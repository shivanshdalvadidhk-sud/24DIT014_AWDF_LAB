import './TaskAnalyticsChart.css';

function TaskAnalyticsChart({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const lowPriority = tasks.filter((t) => (t.priority || 'medium') === 'low').length;
  const medPriority = tasks.filter((t) => (t.priority || 'medium') === 'medium').length;
  const highPriority = tasks.filter((t) => (t.priority || 'medium') === 'high').length;

  return (
    <div className="analytics-card">
      <div className="analytics-header">
        <h3>📊 Task Performance Analytics & Distribution</h3>
        <span className="analytics-badge">Lazy Loaded Component</span>
      </div>

      <div className="analytics-grid">
        <div className="metric-box">
          <div className="metric-value">{completionRate}%</div>
          <div className="metric-label">Completion Rate</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-value">{pending}</div>
          <div className="metric-label">Active / Pending Tasks</div>
          <div className="status-tag status-pending">Needs Attention</div>
        </div>

        <div className="metric-box">
          <div className="metric-value">{completed}</div>
          <div className="metric-label">Tasks Finished</div>
          <div className="status-tag status-completed">Completed</div>
        </div>
      </div>

      <div className="priority-distribution">
        <h4>Priority Breakdown</h4>
        <div className="priority-bars">
          <div className="priority-row">
            <span className="p-label">High Priority</span>
            <div className="bar-bg">
              <div className="bar-fill bar-high" style={{ width: `${total > 0 ? (highPriority / total) * 100 : 0}%` }} />
            </div>
            <span className="p-count">{highPriority}</span>
          </div>

          <div className="priority-row">
            <span className="p-label">Medium Priority</span>
            <div className="bar-bg">
              <div className="bar-fill bar-medium" style={{ width: `${total > 0 ? (medPriority / total) * 100 : 0}%` }} />
            </div>
            <span className="p-count">{medPriority}</span>
          </div>

          <div className="priority-row">
            <span className="p-label">Low Priority</span>
            <div className="bar-bg">
              <div className="bar-fill bar-low" style={{ width: `${total > 0 ? (lowPriority / total) * 100 : 0}%` }} />
            </div>
            <span className="p-count">{lowPriority}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskAnalyticsChart;
