import './RepoCard.css'

// Card showing repository details
export default function RepoCard({ repo }) {
  const updated = repo.updated_at ? new Date(repo.updated_at).toLocaleString() : '—'

  return (
    <article className="repo-card">
      <h3 className="repo-name">{repo.name}</h3>
      <p className="repo-desc">{repo.description || 'No description provided.'}</p>

      <div className="repo-meta">
        <span className="meta-item">⭐ {repo.stargazers_count}</span>
        <span className="meta-item">🍴 {repo.forks_count}</span>
        <span className="meta-item">{repo.language || '—'}</span>
      </div>

      <div className="repo-bottom">
        <a className="repo-link" href={repo.html_url} target="_blank" rel="noopener noreferrer">Visit Repository</a>
        <div className="repo-updated">Last updated: {updated}</div>
      </div>
    </article>
  )
}
