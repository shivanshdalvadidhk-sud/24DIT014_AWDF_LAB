import './Spinner.css'

// Simple centered spinner with message
export default function Spinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner" />
      <div className="spinner-text">{message}</div>
    </div>
  )
}
