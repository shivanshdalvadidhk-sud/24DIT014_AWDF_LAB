import { useState } from 'react';
import './TaskCard.css';

function TaskCard({ task, onToggleStatus, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority || 'medium');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    setIsUpdating(true);
    try {
      await onUpdate(task._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
      });
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'medium');
    setIsEditing(false);
  };

  const priorityClass = `priority-badge priority-${task.priority || 'medium'}`;

  return (
    <div className={`task-card ${task.completed ? 'task-completed' : ''} ${task.isOptimistic ? 'task-optimistic' : ''}`}>
      {isEditing ? (
        <form className="task-edit-form" onSubmit={handleSave}>
          <input
            type="text"
            className="edit-input-title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
            autoFocus
          />
          <textarea
            className="edit-input-desc"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description..."
            rows="2"
          />
          <div className="edit-controls">
            <select
              className="edit-select-priority"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <div className="edit-buttons">
              <button type="button" className="btn-cancel" onClick={handleCancel} disabled={isUpdating}>
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <>
          <div className="task-header">
            <div className="task-checkbox-wrap">
              <input
                type="checkbox"
                id={`task-${task._id}`}
                className="task-checkbox"
                checked={task.completed}
                onChange={() => onToggleStatus(task)}
                disabled={task.isOptimistic}
              />
              <label htmlFor={`task-${task._id}`} className="task-title">
                {task.title}
              </label>
            </div>
            <span className={priorityClass}>{task.priority || 'medium'}</span>
          </div>

          {task.description && <p className="task-description">{task.description}</p>}

          <div className="task-footer">
            <span className="task-date">
              {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Just now'}
            </span>
            <div className="task-actions">
              <button
                type="button"
                className="btn-task-action btn-task-edit"
                onClick={() => setIsEditing(true)}
                disabled={task.isOptimistic}
                title="Edit Task"
              >
                ✎ Edit
              </button>
              <button
                type="button"
                className="btn-task-action btn-task-delete"
                onClick={() => onDelete(task)}
                disabled={task.isOptimistic}
                title="Delete Task"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskCard;
