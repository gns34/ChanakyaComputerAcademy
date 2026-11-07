// worker/generate-seed.js — Generates worker/seed.sql with real PBKDF2 salted password hashes
import { hashPassword } from './crypto.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generate() {
  console.log('Generating seed data with salted password hashes...');

  // Admin seed
  const adminPwd = await hashPassword('admin123');
  const admin = {
    id: 'admin',
    username: 'admin',
    name: 'Administrator',
    password_hash: adminPwd.hash,
    salt: adminPwd.salt,
    role: 'admin',
  };

  // Student seeds
  const studentsRaw = [
    { id: 's1', name: 'Ravi Sharma', username: 'ravi', pass: 'ravi123' },
    { id: 's2', name: 'Priya Singh', username: 'priya', pass: 'priya123' },
    { id: 's3', name: 'Amit Kumar', username: 'amit', pass: 'amit123' },
  ];

  const students = [];
  for (const s of studentsRaw) {
    const creds = await hashPassword(s.pass);
    students.push({
      id: s.id,
      name: s.name,
      username: s.username,
      password_hash: creds.hash,
      salt: creds.salt,
      role: 'student',
    });
  }

  const sqlStatements = [
    '-- Auto-generated seed data for Cloudflare D1',
    `INSERT OR REPLACE INTO admins (id, username, password_hash, salt, name, role) VALUES ('${admin.id}', '${admin.username}', '${admin.password_hash}', '${admin.salt}', '${admin.name}', '${admin.role}');`,
    ...students.map(
      (s) =>
        `INSERT OR REPLACE INTO students (id, username, password_hash, salt, name, role) VALUES ('${s.id}', '${s.username}', '${s.password_hash}', '${s.salt}', '${s.name}', '${s.role}');`
    ),
  ];

  const sqlContent = sqlStatements.join('\n') + '\n';
  const outputPath = path.join(__dirname, 'seed.sql');
  fs.writeFileSync(outputPath, sqlContent, 'utf-8');

  console.log('Successfully written to worker/seed.sql:');
  console.log(sqlContent);
}

generate().catch(console.error);
