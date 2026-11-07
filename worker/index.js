// worker/index.js — Cloudflare Worker API with Cloudflare D1 Auth & CORS
import { hashPassword, verifyPassword } from './crypto.js';

// Global CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

/**
 * Helper to build JSON responses with CORS headers
 */
function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

/**
 * Handle OPTIONS preflight requests
 */
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * Helper to create a signed mock session token
 */
function createToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return btoa(JSON.stringify(payload));
}

/**
 * Verify session token from Authorization header
 */
function verifyAuthHeader(request) {
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions();
    }

    // Health check endpoint
    if (method === 'GET' && (path === '/' || path === '/api' || path === '/api/health')) {
      const db = env?.DB || env?.chanakya_db;
      return jsonResponse({
        status: 'online',
        service: 'Chanakya Computer Academy Cloudflare Worker API',
        timestamp: new Date().toISOString(),
        d1_configured: Boolean(db),
      });
    }

    // Ensure D1 database binding exists
    const db = env?.DB || env?.chanakya_db;
    if (!db) {
      return jsonResponse(
        {
          success: false,
          error: 'Cloudflare D1 database binding "DB" is not configured or available.',
        },
        500
      );
    }

    try {
      // ─────────────────────────────────────────────────────────────
      // POST /api/auth/login or POST /api/login
      // Also handles POST /api/auth/admin/login and POST /api/auth/student/login
      // ─────────────────────────────────────────────────────────────
      const isLoginRoute =
        path === '/api/auth/login' ||
        path === '/api/login' ||
        path === '/api/auth/admin/login' ||
        path === '/api/admin/login' ||
        path === '/api/auth/student/login' ||
        path === '/api/student/login';

      if (method === 'POST' && isLoginRoute) {
        let body;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ success: false, error: 'Invalid JSON request body' }, 400);
        }

        const username = body.username?.toString().trim();
        const password = body.password?.toString();

        let requestedRole = body.role?.toString().trim().toLowerCase();
        if (path.includes('admin')) {
          requestedRole = 'admin';
        } else if (path.includes('student')) {
          requestedRole = 'student';
        }

        if (!username || !password) {
          return jsonResponse(
            { success: false, error: 'Username and password are required' },
            400
          );
        }

        let userRecord = null;
        let role = null;

        // 1. Search admins table
        if (!requestedRole || requestedRole === 'admin') {
          const admin = await db
            .prepare(
              'SELECT id, username, password_hash, salt, name, role FROM admins WHERE username = ?'
            )
            .bind(username)
            .first();

          if (admin) {
            userRecord = admin;
            role = 'admin';
          }
        }

        // 2. Search students table if not found yet
        if (!userRecord && (!requestedRole || requestedRole === 'student')) {
          const student = await db
            .prepare(
              'SELECT id, username, password_hash, salt, name, role FROM students WHERE username = ?'
            )
            .bind(username)
            .first();

          if (student) {
            userRecord = student;
            role = 'student';
          }
        }

        // Check if user exists
        if (!userRecord) {
          return jsonResponse(
            { success: false, error: 'Invalid username or password' },
            401
          );
        }

        // Verify salted password hash
        const isValid = await verifyPassword(
          password,
          userRecord.salt,
          userRecord.password_hash
        );

        if (!isValid) {
          return jsonResponse(
            { success: false, error: 'Invalid username or password' },
            401
          );
        }

        // Credentials valid
        const user = {
          id: userRecord.id,
          username: userRecord.username,
          name: userRecord.name,
          role: role || userRecord.role || 'student',
        };

        const token = createToken(user);

        return jsonResponse({
          success: true,
          message: 'Authentication successful',
          user,
          token,
        });
      }

      // ─────────────────────────────────────────────────────────────
      // GET /api/auth/me or GET /api/auth/verify
      // ─────────────────────────────────────────────────────────────
      if (method === 'GET' && (path === '/api/auth/me' || path === '/api/auth/verify')) {
        const payload = verifyAuthHeader(request);
        if (!payload) {
          return jsonResponse({ success: false, error: 'Unauthorized or token expired' }, 401);
        }

        return jsonResponse({
          success: true,
          user: {
            id: payload.sub,
            username: payload.username,
            name: payload.name,
            role: payload.role,
          },
        });
      }

      // ─────────────────────────────────────────────────────────────
      // POST /api/auth/student/register or POST /api/students
      // Create new student with salted password hashing
      // ─────────────────────────────────────────────────────────────
      if (
        method === 'POST' &&
        (path === '/api/auth/student/register' || path === '/api/students')
      ) {
        let body;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ success: false, error: 'Invalid JSON request body' }, 400);
        }

        const name = body.name?.toString().trim();
        const username = body.username?.toString().trim().toLowerCase();
        const password = body.password?.toString();

        if (!name || !username || !password) {
          return jsonResponse(
            { success: false, error: 'Name, username, and password are required' },
            400
          );
        }

        if (password.length < 4) {
          return jsonResponse(
            { success: false, error: 'Password must be at least 4 characters long' },
            400
          );
        }

        // Check if username already exists in admins or students
        const existingAdmin = await db
          .prepare('SELECT username FROM admins WHERE username = ?')
          .bind(username)
          .first();

        const existingStudent = await db
          .prepare('SELECT username FROM students WHERE username = ?')
          .bind(username)
          .first();

        if (existingAdmin || existingStudent) {
          return jsonResponse(
            { success: false, error: 'Username is already taken' },
            409
          );
        }

        // Generate salted password hash
        const { hash, salt } = await hashPassword(password);
        const id = 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

        await db
          .prepare(
            'INSERT INTO students (id, username, password_hash, salt, name, role) VALUES (?, ?, ?, ?, ?, ?)'
          )
          .bind(id, username, hash, salt, name, 'student')
          .run();

        return jsonResponse(
          {
            success: true,
            message: 'Student registered successfully',
            student: {
              id,
              name,
              username,
              role: 'student',
              createdAt: new Date().toISOString(),
            },
          },
          201
        );
      }

      // ─────────────────────────────────────────────────────────────
      // GET /api/students — List students (without sensitive hashes)
      // ─────────────────────────────────────────────────────────────
      if (method === 'GET' && path === '/api/students') {
        const { results } = await db
          .prepare(
            'SELECT id, username, name, role, created_at FROM students ORDER BY created_at DESC'
          )
          .all();

        return jsonResponse({
          success: true,
          students: results || [],
        });
      }

      // ─────────────────────────────────────────────────────────────
      // PUT /api/students/:id — Update student (name, password)
      // ─────────────────────────────────────────────────────────────
      const studentIdMatch = path.match(/^\/api\/students\/([^/]+)$/);
      if (method === 'PUT' && studentIdMatch) {
        const studentId = studentIdMatch[1];
        let body;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ success: false, error: 'Invalid JSON request body' }, 400);
        }

        const existing = await db
          .prepare('SELECT id FROM students WHERE id = ?')
          .bind(studentId)
          .first();

        if (!existing) {
          return jsonResponse({ success: false, error: 'Student not found' }, 404);
        }

        const name = body.name?.toString().trim();
        const password = body.password?.toString();

        if (name && password) {
          const { hash, salt } = await hashPassword(password);
          await db
            .prepare(
              'UPDATE students SET name = ?, password_hash = ?, salt = ? WHERE id = ?'
            )
            .bind(name, hash, salt, studentId)
            .run();
        } else if (name) {
          await db
            .prepare('UPDATE students SET name = ? WHERE id = ?')
            .bind(name, studentId)
            .run();
        } else if (password) {
          const { hash, salt } = await hashPassword(password);
          await db
            .prepare(
              'UPDATE students SET password_hash = ?, salt = ? WHERE id = ?'
            )
            .bind(hash, salt, studentId)
            .run();
        }

        return jsonResponse({
          success: true,
          message: 'Student updated successfully',
        });
      }

      // ─────────────────────────────────────────────────────────────
      // DELETE /api/students/:id — Remove student
      // ─────────────────────────────────────────────────────────────
      if (method === 'DELETE' && studentIdMatch) {
        const studentId = studentIdMatch[1];
        await db.prepare('DELETE FROM students WHERE id = ?').bind(studentId).run();
        return jsonResponse({
          success: true,
          message: 'Student deleted successfully',
        });
      }

      // Fallback 404
      return jsonResponse({ success: false, error: 'Endpoint not found' }, 404);
    } catch (err) {
      console.error('API Error:', err);
      return jsonResponse(
        {
          success: false,
          error: err.message || 'Internal server error',
        },
        500
      );
    }
  },
};
