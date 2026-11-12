import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import AnnouncementForm from '../../components/admin/AnnouncementForm'
// Shared table, toolbar, form and status styles
import './Members.css'
import './Programmes.css'

const formatDate = (value) =>
  value
    ? new Date(String(value).slice(0, 10)).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : '—'

function News() {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({ page })
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (status) params.set('status', status)

    api(`/announcements?${params}`)
      .then((data) => {
        if (cancelled) return
        setItems(data.data)
        setMeta({ current_page: data.current_page, last_page: data.last_page, total: data.total })
        setError('')
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoaded(true))

    return () => {
      cancelled = true
    }
  }, [page, debouncedSearch, status, reloadKey])

  function openNew() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(item) {
    setEditing(item)
    setFormOpen(true)
  }

  function handleSaved(message) {
    setFormOpen(false)
    setNotice(message)
    setReloadKey((key) => key + 1)
  }

  async function togglePublished(item) {
    const next = item.status === 'published' ? 'draft' : 'published'
    const question =
      next === 'published'
        ? `Publish "${item.title}" on the public website?`
        : `Unpublish "${item.title}"? It will be hidden from the public website.`

    if (!window.confirm(question)) return

    try {
      const data = await api(`/announcements/${item.id}/status`, {
        method: 'PATCH',
        body: { status: next },
      })
      setNotice(data.message)
      setReloadKey((key) => key + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="members-page">
      <div className="members-heading">
        <div>
          <span className="members-eyebrow">CONTENT MANAGEMENT</span>
          <h1>News &amp; Announcements</h1>
          <p>Publish updates and announcements for the LEWOCO public website.</p>
        </div>

        <button type="button" className="btn-primary" onClick={openNew}>
          + Create announcement
        </button>
      </div>

      {notice && (
        <div className="members-alert success" role="status">
          {notice}
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss">×</button>
        </div>
      )}
      {error && <div className="members-alert error" role="alert">{error}</div>}

      <div className="members-panel">
        <div className="members-toolbar">
          <input
            type="search"
            placeholder="Search by title, category or description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search announcements"
          />

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <span className="members-count">
            {meta.total} item{meta.total === 1 ? '' : 's'}
          </span>
        </div>

        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Announcement</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {!loaded && (
                <tr><td colSpan="4" className="table-empty">Loading announcements…</td></tr>
              )}

              {loaded && items.length === 0 && (
                <tr>
                  <td colSpan="4" className="table-empty">
                    {debouncedSearch || status
                      ? 'No announcements match your search.'
                      : 'No announcements yet.'}
                  </td>
                </tr>
              )}

              {items.map((item) => (
                <tr key={item.id}>
                  <td className="mono">{formatDate(item.published_at)}</td>
                  <td>
                    <strong>{item.title}</strong>
                    {item.category && <small>{item.category}</small>}
                    <small className="clamp">{item.description}</small>
                  </td>
                  <td>
                    <span className={`status-pill ${item.status}`}>{item.status}</span>
                  </td>
                  <td className="row-actions">
                    <button type="button" onClick={() => openEdit(item)}>Edit</button>
                    <button type="button" onClick={() => togglePublished(item)}>
                      {item.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta.last_page > 1 && (
          <div className="members-pagination">
            <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              ← Previous
            </button>
            <span>Page {meta.current_page} of {meta.last_page}</span>
            <button type="button" disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}>
              Next →
            </button>
          </div>
        )}
      </div>

      {formOpen && (
        <AnnouncementForm
          key={editing?.id ?? 'new'}
          announcement={editing}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

export default News
