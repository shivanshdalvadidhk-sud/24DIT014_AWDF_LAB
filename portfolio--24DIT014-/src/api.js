const BASE_URL = 'http://localhost:5000';

/**
 * Fetch all tasks from Express/MongoDB backend
 */
export const getTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch tasks (HTTP ${response.status})`);
  }
  return response.json();
};

/**
 * Create a new task
 */
export const createTask = async (taskData) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create task (HTTP ${response.status})`);
  }
  return response.json();
};

/**
 * Update an existing task by ID
 */
export const updateTask = async (id, taskData) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update task (HTTP ${response.status})`);
  }
  return response.json();
};

/**
 * Delete a task by ID
 */
export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete task (HTTP ${response.status})`);
  }
  return response.json();
};
