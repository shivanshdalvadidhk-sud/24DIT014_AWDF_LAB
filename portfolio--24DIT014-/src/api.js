const BASE_URL = 'http://localhost:5000';
const TOKEN_KEY = 'awdf_jwt_token';
const USER_KEY = 'awdf_user';

// Token and User persistence in localStorage
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const setStoredUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem(USER_KEY);

// Auth headers helper
const getHeaders = (contentType = true) => {
  const headers = {};
  if (contentType) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Handle response and 401 token expiry
const handleResponse = async (response) => {
  if (response.status === 401) {
    removeToken();
    removeStoredUser();
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.message || 'Session expired or unauthorized. Please log in.');
    err.isAuthError = true;
    throw err;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

/**
 * Register a new user (Practical 7)
 */
export const registerUser = async (name, email, password) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await handleResponse(response);
  if (data.token) {
    setToken(data.token);
    setStoredUser(data.user);
  }
  return data;
};

/**
 * Login user and store JWT token (Practical 7)
 */
export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);
  if (data.token) {
    setToken(data.token);
    setStoredUser(data.user);
  }
  return data;
};

/**
 * Fetch current user from /auth/me (Practical 7 Supplementary)
 */
export const getCurrentUser = async () => {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: getHeaders(false),
  });
  return handleResponse(response);
};

/**
 * Logout user
 */
export const logoutUser = () => {
  removeToken();
  removeStoredUser();
};

/**
 * Fetch all tasks (Protected by Auth Middleware)
 */
export const getTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    headers: getHeaders(false),
  });
  return handleResponse(response);
};

/**
 * Create a new task (Protected by Auth Middleware + Input Validation)
 */
export const createTask = async (taskData) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(taskData),
  });
  return handleResponse(response);
};

/**
 * Update an existing task by ID (Protected by Auth Middleware)
 */
export const updateTask = async (id, taskData) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(taskData),
  });
  return handleResponse(response);
};

/**
 * Delete a task by ID (Protected by Auth Middleware)
 */
export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(false),
  });
  return handleResponse(response);
};
