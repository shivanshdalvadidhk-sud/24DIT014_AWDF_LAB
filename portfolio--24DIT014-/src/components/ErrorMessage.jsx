import './ErrorMessage.css'

// Displays an error message and a retry button
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-wrap">
      <div className="error-card">
        <div className="error-title">❌ Error loading data</div>
        <div className="error-message">{message}</div>
        <div className="error-actions">
          <button className="btn-retry" onClick={onRetry}>Retry</button>
        </div>
      </div>
    </div>
  )
}
