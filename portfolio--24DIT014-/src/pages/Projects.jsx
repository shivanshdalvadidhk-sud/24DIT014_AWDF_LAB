import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import RepoCard from '../components/RepoCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskCard from '../components/TaskCard.jsx';
import Toast from '../components/Toast.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { getTasks, createTask, updateTask, deleteTask } from '../api.js';
import './Projects.css';

const DEFAULT_GITHUB_USERNAME = 'shivanshdalvadidhk-sud';

function Projects({ initialTab = 'tasks' }) {
  // Active tab: 'tasks' (Practical 6 Full Stack) or 'repos' (Practical 3 GitHub)
  const [activeTab, setActiveTab] = useState(initialTab);

  // --- Full Stack Task Manager State (Practical 6) ---
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskSearch, setTaskSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  // Toast notification state (Supplementary Problem)
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Delete confirmation modal state (Supplementary Problem)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, task: null });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: '', type: 'info' });
  };

  // Manual refresh handler for backend tasks
  const fetchTasksData = async () => {
    setTasksLoading(true);
    setTasksError(null);
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setTasksError(err.message || 'Failed to connect to backend server');
    } finally {
      setTasksLoading(false);
    }
  };

  // Initial load on mount
  useEffect(() => {
    let ignore = false;
    getTasks()
      .then((data) => {
        if (!ignore) {
          setTasks(Array.isArray(data) ? data : []);
          setTasksLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setTasksError(err.message || 'Failed to connect to backend server');
          setTasksLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Handle Create Task with Optimistic UI Update (Supplementary Problem)
  const handleCreateTask = async (taskData) => {
    const tempId = 'temp-' + Date.now();
    const optimisticTask = {
      ...taskData,
      _id: tempId,
      completed: false,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Optimistically prepend to list immediately
    setTasks((prev) => [optimisticTask, ...prev]);
    setIsSubmitting(true);

    try {
      const savedTask = await createTask(taskData);
      // Replace optimistic task with actual database document
      setTasks((prev) => prev.map((t) => (t._id === tempId ? savedTask : t)));
      showToast(`Task "${savedTask.title}" created successfully!`, 'success');
    } catch (err) {
      // Revert optimistic update on error
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      showToast(`Failed to create task: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Toggle Completed
  const handleToggleStatus = async (task) => {
    const newStatus = !task.completed;
    // Optimistic toggle
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: newStatus } : t))
    );

    try {
      await updateTask(task._id, { completed: newStatus });
      showToast(
        `Task marked as ${newStatus ? 'completed' : 'pending'}`,
        'success'
      );
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, completed: task.completed } : t))
      );
      showToast(`Failed to update status: ${err.message}`, 'error');
    }
  };

  // Handle Edit/Update Task Fields
  const handleUpdateTask = async (id, updatedFields) => {
    try {
      const updated = await updateTask(id, updatedFields);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      showToast('Task updated successfully!', 'success');
    } catch (err) {
      showToast(`Failed to update task: ${err.message}`, 'error');
      throw err;
    }
  };

  // Open Delete Confirmation Modal (Supplementary Problem)
  const requestDelete = (task) => {
    setDeleteModal({ isOpen: true, task });
  };

  // Confirm Delete Handler
  const confirmDelete = async () => {
    const { task } = deleteModal;
    if (!task) return;

    setDeleteModal({ isOpen: false, task: null });
    const originalTasks = [...tasks];
    // Optimistically remove
    setTasks((prev) => prev.filter((t) => t._id !== task._id));

    try {
      await deleteTask(task._id);
      showToast(`Task "${task.title}" deleted`, 'info');
    } catch (err) {
      // Revert on failure
      setTasks(originalTasks);
      showToast(`Failed to delete task: ${err.message}`, 'error');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(taskSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'pending') return !t.completed;
    if (statusFilter === 'completed') return t.completed;
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // --- GitHub Repos State (Practical 3 preservation) ---
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState(null);
  const [repoSearch, setRepoSearch] = useState('');
  const [username, setUsername] = useState(DEFAULT_GITHUB_USERNAME);

  const fetchRepos = async (user = username) => {
    setReposLoading(true);
    setReposError(null);
    try {
      const url = `https://api.github.com/users/${user}/repos?per_page=100`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      setRepos(Array.isArray(data) ? data.sort((a, b) => b.stargazers_count - a.stargazers_count) : []);
    } catch (err) {
      setReposError(err.message || 'Unknown error');
    } finally {
      setReposLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'repos' && repos.length === 0 && !reposLoading) {
      fetchRepos(username);
    }
  };

  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(repoSearch.toLowerCase())
  );

  return (
    <section className="page-section projects-page">
      {/* Toast Notification (Supplementary Problem) */}
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      {/* Delete Confirmation Modal (Supplementary Problem) */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteModal.task?.title}"? This will permanently remove it from MongoDB.`}
        confirmText="Yes, Delete"
        confirmColor="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, task: null })}
      />

      <div className="tab-navigation">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'tasks' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('tasks')}
        >
          Task Manager (Practical 6 - Full Stack)
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'repos' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('repos')}
        >
          GitHub Repos (Practical 3)
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <div className="tasks-container">
          <h2>Task Management System</h2>
          <p className="tab-subtitle">
            Connected to <strong>Node.js + Express + MongoDB</strong> backend with full CRUD operations.
          </p>

          {/* Quick Metrics */}
          <div className="projects-stats">
            <div className="stat-item">Total Tasks: <strong>{totalTasks}</strong></div>
            <div className="stat-item">Pending: <strong style={{ color: '#fbbf24' }}>{pendingTasks}</strong></div>
            <div className="stat-item">Completed: <strong style={{ color: '#34d399' }}>{completedTasks}</strong></div>
          </div>

          {/* Task Creation Form */}
          <TaskForm onAddTask={handleCreateTask} isSubmitting={isSubmitting} />

          {/* Controls: Search and Status Filter */}
          <div className="task-filter-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks by title or description..."
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              aria-label="Search tasks"
            />
            <div className="status-filter-pills">
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'all' ? 'pill-active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All ({totalTasks})
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'pending' ? 'pill-active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending ({pendingTasks})
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'completed' ? 'pill-active' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                Completed ({completedTasks})
              </button>
            </div>
            <button className="btn-refresh" onClick={fetchTasksData} title="Reload from server">
              ↻ Refresh
            </button>
          </div>

          {/* Main Task List Rendering */}
          {tasksLoading ? (
            <Spinner />
          ) : tasksError ? (
            <ErrorMessage message={tasksError} onRetry={fetchTasksData} />
          ) : filteredTasks.length === 0 ? (
            <div className="no-results">
              {totalTasks === 0
                ? 'No tasks yet! Add your first task using the form above.'
                : 'No tasks match your search or filter.'}
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onUpdate={handleUpdateTask}
                  onDelete={requestDelete}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Practical 3 GitHub View */
        <div className="repos-container">
          <h2>My GitHub Projects</h2>
          <div className="projects-stats">
            <div className="stat-item">Total repositories: <strong>{repos.length}</strong></div>
            <div className="stat-item">
              Total stars: <strong>{repos.reduce((s, r) => s + (r.stargazers_count || 0), 0)}</strong>
            </div>
          </div>

          <div className="projects-controls">
            <input
              className="search-input"
              placeholder="GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') fetchRepos(username); }}
            />
            <input
              className="search-input"
              placeholder="Search repositories..."
              value={repoSearch}
              onChange={(e) => setRepoSearch(e.target.value)}
            />
            <button className="btn-refresh" onClick={() => fetchRepos(username)}>
              Refresh
            </button>
          </div>

          {reposLoading ? (
            <Spinner />
          ) : reposError ? (
            <ErrorMessage message={reposError} onRetry={() => fetchRepos(username)} />
          ) : filteredRepos.length === 0 ? (
            <div className="no-results">No repositories found.</div>
          ) : (
            <div className="repos-grid">
              {filteredRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Projects;
