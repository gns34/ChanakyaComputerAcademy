// src/services/api.js — API client for Cloudflare Worker & D1 Authentication
const API_BASE = import.meta.env.VITE_API_URL || '';

function getAuthToken() {
  try {
    return localStorage.getItem('cca_token') || '';
  } catch {
    return '';
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = `${API_BASE}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const errorMsg =
        data?.error || `Request failed with status ${res.status}: ${res.statusText}`;
      return {
        success: false,
        error: errorMsg,
        status: res.status,
      };
    }

    return data || { success: true };
  } catch (err) {
    console.warn(`[API] Network error on ${url}:`, err);
    return {
      success: false,
      error: 'Unable to reach the authentication service. Please check your connection or try again.',
      networkError: true,
    };
  }
}

export const api = {
  /**
   * Health check
   */
  async checkHealth() {
    return request('/api/health', { method: 'GET' });
  },

  /**
   * Login with username, password, and optional role
   */
  async login(username, password, role = undefined) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });
  },

  /**
   * Admin-specific login
   */
  async adminLogin(username, password) {
    return request('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  /**
   * Student-specific login
   */
  async studentLogin(username, password) {
    return request('/api/auth/student/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  /**
   * Verify token / session
   */
  async verifySession() {
    return request('/api/auth/me', { method: 'GET' });
  },

  /**
   * List all registered students
   */
  async getStudents() {
    return request('/api/students', { method: 'GET' });
  },

  /**
   * Register a new student with salted password hashing
   */
  async createStudent({ name, username, password }) {
    return request('/api/students', {
      method: 'POST',
      body: JSON.stringify({ name, username, password }),
    });
  },

  /**
   * Update student name and/or password
   */
  async updateStudent(id, { name, password }) {
    return request(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, password }),
    });
  },

  /**
   * Delete student
   */
  async deleteStudent(id) {
    return request(`/api/students/${id}`, {
      method: 'DELETE',
    });
  },
};
