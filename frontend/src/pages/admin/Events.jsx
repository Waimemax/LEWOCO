import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import EventForm from '../../components/admin/EventForm'
// Shared table, toolbar, form and status styles
import './Members.css'
import './Programmes.css'
import './Events.css'

const formatDate = (value) =>
  value
    ? new Date(String(value).slice(0, 10)).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : ''

const dateRange = (item) => {
  const start = formatDate(item.start_date)
  const end = formatDate(item.end_date)
  return end && end !== start ? `${start} – ${end}` : start
}

const timeRange = (item) => {
  const start = item.start_time ? String(item.start_time).slice(0, 5) : ''
  const end = item.end_time ? String(item.end_time).slice(0, 5) : ''
  if (start && end) return `${start} – ${end}`
  return start || ''
}

function Events() {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [when, setWhen] = useState('')
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
    if (when) params.set('when', when)

    api(`/events?${params}`)
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
  }, [page, debouncedSearch, status, when, reloadKey])

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
      const data = await api(`/events/${item.id}/status`, {
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
          <span className="members-eyebrow">ORGANIZATION</span>
          <h1>Training &amp; Events</h1>
          <p>Schedule trainings, workshops, meetings and other events.</p>
        </div>

        <button type="button" className="btn-primary" onClick={openNew}>
          + Create event
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
            placeholder="Search by title, venue or description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search events"
          />

          <select
            value={when}
            onChange={(event) => {
              setWhen(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by timing"
          >
            <option value="">All dates</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>

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
            {meta.total} event{meta.total === 1 ? '' : 's'}
          </span>
        </div>

        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Event</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {!loaded && (
                <tr><td colSpan="4" className="table-empty">Loading events…</td></tr>
              )}

              {loaded && items.length === 0 && (
                <tr>
                  <td colSpan="4" className="table-empty">
                    {debouncedSearch || status || when
                      ? 'No events match your search.'
                      : 'No events yet.'}
                  </td>
                </tr>
              )}

              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong className="mono">{dateRange(item)}</strong>
                    {timeRange(item) && <small>{timeRange(item)}</small>}
                  </td>
                  <td>
                    <strong>{item.title}</strong>
                    <small className="type-label">
                      {item.type}{item.venue ? ` · ${item.venue}` : ''}
                    </small>
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
        <EventForm
          key={editing?.id ?? 'new'}
          event={editing}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

export default Events
