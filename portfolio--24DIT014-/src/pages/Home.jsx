import { useState } from 'react'
import About from '../components/About.jsx'
import Skills from '../components/Skills.jsx'

function Home(props) {
  const [showHighlights, setShowHighlights] = useState(true)

  return (
    <section className="page-section">
      <h2>Home Page</h2>
      <button
        type="button"
        className="btn-toggle-highlights"
        onClick={() => setShowHighlights((prev) => !prev)}
        style={{
          marginBottom: '16px',
          padding: '6px 14px',
          borderRadius: '6px',
          border: '1px solid #475569',
          background: '#1e293b',
          color: '#f8fafc',
          cursor: 'pointer'
        }}
      >
        {showHighlights ? 'Hide Highlights' : 'Show Highlights'}
      </button>

      {showHighlights && (
        <div
          className="home-highlights"
          style={{
            marginBottom: '16px',
            padding: '12px 16px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}
        >
          <p style={{ margin: 0 }}>Welcome to my full-stack web development lab portfolio!</p>
        </div>
      )}

      <About summary={props.summary} />
      <Skills skillList={props.skillList} />
    </section>
  )
}

export default Home







