// worker/test-auth.js — Comprehensive verification of salted password hashing & worker auth logic
import process from 'node:process';
import { hashPassword, verifyPassword, generateSalt } from './crypto.js';
import worker from './index.js';

async function runTests() {
  console.log('--- 1. Testing Crypto & Salted Hashing ---');
  const salt = generateSalt();
  console.log('Generated random salt:', salt, '(length:', salt.length, 'chars = 16 bytes)');

  const testPass = 'admin123';
  const hashed = await hashPassword(testPass);
  console.log('Hashed admin123 => hash:', hashed.hash.substring(0, 16) + '...', 'salt:', hashed.salt);

  const matchCorrect = await verifyPassword(testPass, hashed.salt, hashed.hash);
  console.log('Verify correct password:', matchCorrect ? 'PASS ✅' : 'FAIL ❌');
  if (!matchCorrect) throw new Error('Correct password failed to verify');

  const matchWrong = await verifyPassword('wrongpassword', hashed.salt, hashed.hash);
  console.log('Verify wrong password rejects:', !matchWrong ? 'PASS ✅' : 'FAIL ❌');
  if (matchWrong) throw new Error('Wrong password erroneously verified');

  console.log('\n--- 2. Testing Worker Endpoints & CORS ---');
  // Mock D1 Database simulating Cloudflare D1 environment
  const mockAdminSalt = hashed.salt;
  const mockAdminHash = hashed.hash;

  const mockDb = {
    prepare(query) {
      return {
        bind(...args) {
          return {
            async first() {
              if (query.includes('FROM admins WHERE username = ?')) {
                const u = args[0];
                if (u === 'admin') {
                  return {
                    id: 'admin',
                    username: 'admin',
                    name: 'Administrator',
                    password_hash: mockAdminHash,
                    salt: mockAdminSalt,
                    role: 'admin',
                  };
                }
                return null;
              }
              if (query.includes('FROM students WHERE username = ?')) {
                const u = args[0];
                if (u === 'ravi') {
                  return {
                    id: 's1',
                    username: 'ravi',
                    name: 'Ravi Sharma',
                    password_hash: mockAdminHash,
                    salt: mockAdminSalt,
                    role: 'student',
                  };
                }
                return null;
              }
              return null;
            },
            async all() {
              if (query.includes('FROM students')) {
                return {
                  results: [
                    { id: 's1', username: 'ravi', name: 'Ravi Sharma', role: 'student' },
                  ],
                };
              }
              return { results: [] };
            },
            async run() {
              return { success: true };
            },
          };
        },
      };
    },
  };

  const env = { DB: mockDb };

  // Test CORS Preflight OPTIONS
  const optionsReq = new Request('http://localhost/api/auth/login', { method: 'OPTIONS' });
  const optionsRes = await worker.fetch(optionsReq, env);
  console.log('OPTIONS status:', optionsRes.status, '(expected 204)');
  console.log('CORS Allow-Origin:', optionsRes.headers.get('Access-Control-Allow-Origin'));
  if (optionsRes.status !== 204 || optionsRes.headers.get('Access-Control-Allow-Origin') !== '*') {
    throw new Error('CORS OPTIONS failed');
  }
  console.log('CORS Preflight Test: PASS ✅');

  // Test Valid Admin Login
  const loginReq = new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  const loginRes = await worker.fetch(loginReq, env);
  const loginData = await loginRes.json();
  console.log('Admin login status:', loginRes.status, 'data:', loginData);
  if (loginRes.status !== 200 || !loginData.success || loginData.user.role !== 'admin' || !loginData.token) {
    throw new Error('Admin login failed');
  }
  console.log('Admin Login Test: PASS ✅');

  // Test Invalid Password
  const invalidReq = new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'badpassword' }),
  });
  const invalidRes = await worker.fetch(invalidReq, env);
  const invalidData = await invalidRes.json();
  console.log('Invalid pass status:', invalidRes.status, 'error:', invalidData.error);
  if (invalidRes.status !== 401 || invalidData.success) {
    throw new Error('Invalid pass should return 401');
  }
  console.log('Invalid Password Test: PASS ✅');

  // Test Student Login
  const studentReq = new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'ravi', password: 'admin123' }),
  });
  const studentRes = await worker.fetch(studentReq, env);
  const studentData = await studentRes.json();
  console.log('Student login status:', studentRes.status, 'role:', studentData.user?.role);
  if (studentRes.status !== 200 || !studentData.success || studentData.user.role !== 'student') {
    throw new Error('Student login failed');
  }
  console.log('Student Login Test: PASS ✅');

  // Test Health Check
  const healthReq = new Request('http://localhost/api/health', { method: 'GET' });
  const healthRes = await worker.fetch(healthReq, env);
  const healthData = await healthRes.json();
  console.log('Health check:', healthData);
  if (healthRes.status !== 200 || healthData.status !== 'online') {
    throw new Error('Health check failed');
  }
  console.log('Health Check Test: PASS ✅');

  console.log('\nALL AUTH & CORS TESTS PASSED SUCCESSFULLY! 🎉');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
