import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import EnquiryDetails from '../../components/admin/EnquiryDetails'
// Shared table, toolbar, form and modal styles
import './Members.css'
import './Programmes.css'
import './Enquiries.css'

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    : '—'

function Enquiries() {
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
  const [selected, setSelected] = useState(null)

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

    api(`/enquiries?${params}`)
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

  // Opening a new enquiry marks it as read
  async function openEnquiry(item) {
    setSelected(item)

    if (item.status === 'new') {
      try {
        await api(`/enquiries/${item.id}`, { method: 'PATCH', body: { status: 'read' } })
        setSelected({ ...item, status: 'read' })
        setReloadKey((key) => key + 1)
      } catch {
        // Not critical: the status can still be set manually
      }
    }
  }

  function handleSaved(message) {
    setSelected(null)
    setNotice(message)
    setReloadKey((key) => key + 1)
  }

  return (
    <div className="members-page">
      <div className="members-heading">
        <div>
          <span className="members-eyebrow">CONTENT MANAGEMENT</span>
          <h1>Enquiries</h1>
          <p>Messages sent through the contact form on the public website.</p>
        </div>
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
            placeholder="Search by name, email, phone, subject or message"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search enquiries"
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
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
          </select>

          <span className="members-count">
            {meta.total} enquir{meta.total === 1 ? 'y' : 'ies'}
          </span>
        </div>

        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th>Received</th>
                <th>From</th>
                <th>Subject</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {!loaded && (
                <tr><td colSpan="5" className="table-empty">Loading enquiries…</td></tr>
              )}

              {loaded && items.length === 0 && (
                <tr>
                  <td colSpan="5" className="table-empty">
                    {debouncedSearch || status
                      ? 'No enquiries match your search.'
                      : 'No enquiries yet.'}
                  </td>
                </tr>
              )}

              {items.map((item) => (
                <tr key={item.id} className={item.status === 'new' ? 'row-new' : ''}>
                  <td className="mono">{formatDateTime(item.created_at)}</td>
                  <td>
                    <strong>{item.full_name}</strong>
                    <small>{item.email}</small>
                  </td>
                  <td>
                    <strong>{item.subject}</strong>
                    <small className="clamp">{item.message}</small>
                  </td>
                  <td>
                    <span className={`status-pill ${item.status}`}>{item.status}</span>
                  </td>
                  <td className="row-actions">
                    <button type="button" onClick={() => openEnquiry(item)}>View</button>
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

      {selected && (
        <EnquiryDetails
          key={selected.id}
          enquiry={selected}
          onClose={() => setSelected(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

export default Enquiries
