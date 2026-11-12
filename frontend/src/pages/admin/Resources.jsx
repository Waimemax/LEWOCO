import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import ResourceForm from '../../components/admin/ResourceForm'
// Shares the table, toolbar and form styles used by the Members page
import './Members.css'
import './Programmes.css'

function Resources() {
  const [resources, setResources] = useState([])
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

    api(`/resources?${params}`)
      .then((data) => {
        if (cancelled) return
        setResources(data.data)
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

  function openEdit(resource) {
    setEditing(resource)
    setFormOpen(true)
  }

  function handleSaved(message) {
    setFormOpen(false)
    setNotice(message)
    setReloadKey((key) => key + 1)
  }

  async function togglePublished(resource) {
    const next = resource.status === 'published' ? 'draft' : 'published'
    const question =
      next === 'published'
        ? `Publish "${resource.title}" on the public website?`
        : `Unpublish "${resource.title}"? It will be hidden from the public website.`

    if (!window.confirm(question)) return

    try {
      const data = await api(`/resources/${resource.id}/status`, {
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
          <h1>Resources</h1>
          <p>Manage the resources shown on the LEWOCO public website.</p>
        </div>

        <button type="button" className="btn-primary" onClick={openNew}>
          + Create resource
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
            aria-label="Search resources"
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
            {meta.total} resource{meta.total === 1 ? '' : 's'}
          </span>
        </div>

        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Icon</th>
                <th>Resource</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {!loaded && (
                <tr><td colSpan="5" className="table-empty">Loading resources…</td></tr>
              )}

              {loaded && resources.length === 0 && (
                <tr>
                  <td colSpan="5" className="table-empty">
                    {debouncedSearch || status
                      ? 'No resources match your search.'
                      : 'No resources yet.'}
                  </td>
                </tr>
              )}

              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td className="mono">{resource.display_order}</td>
                  <td className="icon-cell">{resource.icon || '—'}</td>
                  <td>
                    <strong>{resource.title}</strong>
                    {resource.category && <small>{resource.category}</small>}
                    <small className="clamp">{resource.description}</small>
                  </td>
                  <td>
                    <span className={`status-pill ${resource.status}`}>{resource.status}</span>
                  </td>
                  <td className="row-actions">
                    <button type="button" onClick={() => openEdit(resource)}>Edit</button>
                    <button type="button" onClick={() => togglePublished(resource)}>
                      {resource.status === 'published' ? 'Unpublish' : 'Publish'}
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
        <ResourceForm
          key={editing?.id ?? 'new'}
          resource={editing}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

export default Resources
