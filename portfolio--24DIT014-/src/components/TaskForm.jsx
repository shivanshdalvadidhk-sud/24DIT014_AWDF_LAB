import { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onAddTask, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Create New Task</h3>
      <div className="form-group">
        <label htmlFor="task-title-input" className="form-label">
          Task Title <span className="required">*</span>
        </label>
        <input
          id="task-title-input"
          type="text"
          className="form-input"
          placeholder="e.g. Complete Practical 6 Integration"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-desc-input" className="form-label">
          Description
        </label>
        <textarea
          id="task-desc-input"
          className="form-textarea"
          placeholder="Details or notes about this task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-row">
        <div className="form-group form-group-priority">
          <label htmlFor="task-priority-select" className="form-label">
            Priority
          </label>
          <select
            id="task-priority-select"
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <button type="submit" className="btn-create-task" disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? 'Creating...' : '+ Add Task'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
