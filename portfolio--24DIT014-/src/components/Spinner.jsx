import React from 'react'
import './Spinner.css'

// Simple centered spinner with message
export default function Spinner() {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner" />
      <div className="spinner-text">Loading repositories...</div>
    </div>
  )
}
