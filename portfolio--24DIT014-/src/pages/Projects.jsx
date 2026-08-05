import React, { useState, useEffect, useCallback } from 'react'
import Spinner from '../components/Spinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import RepoCard from '../components/RepoCard.jsx'
import './Projects.css'

// Default username (editable via the UI below)
const DEFAULT_GITHUB_USERNAME = 'shivanshdalvadidhk-sud'

function Projects() {
  // State variables required by the lab
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [username, setUsername] = useState(DEFAULT_GITHUB_USERNAME)

  // Fetch repositories from GitHub REST API
  // Fetch repositories for a given username (defaults to current `username` state)
  const fetchRepos = useCallback(async (user = username) => {
    setLoading(true)
    setError(null)

    try {
      const url = `https://api.github.com/users/${user}/repos?per_page=100`
      const response = await fetch(url)

      // Handle HTTP errors explicitly
      if (!response.ok) {
        // Try to read JSON message for more context
        let body = null
        try { body = await response.json() } catch (e) { /* ignore */ }

        if (response.status === 404) {
          throw new Error('User not found (404)')
        }

        // GitHub rate limit returns 403 with a message
        if (response.status === 403) {
          const msg = (body && body.message) || 'Forbidden (403)'
          if (msg.toLowerCase().includes('rate limit')) {
            throw new Error('GitHub API rate limit exceeded. Try again later or use an authenticated request.')
          }
          throw new Error(msg)
        }

        // Generic HTTP error
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = await response.json()

      // Store repositories (sort by stars desc for convenience)
      setRepos(Array.isArray(data) ? data.sort((a, b) => b.stargazers_count - a.stargazers_count) : [])
    } catch (err) {
      // Network failures and other exceptions land here
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [username])

  // Run fetch on mount and whenever `username` changes
  useEffect(() => {
    fetchRepos(username)
  }, [fetchRepos, username])

  // Filter repositories by name (case-insensitive)
  const filteredRepos = repos.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Aggregate totals for display
  const totalRepos = repos.length
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)

  // If currently loading show spinner
  if (loading) return <Spinner />

  // If there is an error show error component with retry (retry will re-fetch for current username)
  if (error) return <ErrorMessage message={error} onRetry={() => fetchRepos(username)} />

  return (
    <section className="page-section projects-page">
      <h2>My GitHub Projects</h2>

      {/* Totals / stats area */}
      <div className="projects-stats">
        <div className="stat-item">Total repositories: <strong>{totalRepos}</strong></div>
        <div className="stat-item">Total stars: <strong>{totalStars}</strong></div>
      </div>

      <div className="projects-controls">
        <input
          className="search-input"
          placeholder="GitHub username (press Enter or click Refresh)"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') fetchRepos(username) }}
          aria-label="GitHub username"
        />

        <input
          className="search-input"
          placeholder="Search repositories by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          aria-label="Search repositories"
        />
        <button className="btn-refresh" onClick={() => fetchRepos(username)}>Refresh</button>
      </div>

      {/* Different messages depending on whether user has repos at all, or search filtered them out */}
      {totalRepos === 0 ? (
        <div className="no-results">This user has no repositories.</div>
      ) : filteredRepos.length === 0 ? (
        <div className="no-results">No repositories match your search.</div>
      ) : (
        <div className="repos-grid">
          {filteredRepos.map(repo => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Projects