import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import MemberForm from '../../components/admin/MemberForm'
import './Members.css'

const formatDate = (value) =>
  value
    ? new Date(String(value).slice(0, 10)).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : '—'

function Members() {
  const [members, setMembers] = useState([])
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

  // Wait for the user to stop typing before searching
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

    api(`/members?${params}`)
      .then((data) => {
        if (cancelled) return
        setMembers(data.data)
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

  function openEdit(member) {
    setEditing(member)
    setFormOpen(true)
  }

  function handleSaved(message) {
    setFormOpen(false)
    setNotice(message)
    setReloadKey((key) => key + 1)
  }

  async function toggleStatus(member) {
    const next = member.status === 'active' ? 'inactive' : 'active'
    const name = `${member.first_name} ${member.last_name}`

    if (!window.confirm(`Mark ${name} as ${next}?`)) return

    try {
      const data = await api(`/members/${member.id}/status`, {
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
          <span className="members-eyebrow">MAIN MENU</span>
          <h1>Members</h1>
          <p>Register and maintain cooperative member records.</p>
        </div>

        <button type="button" className="btn-primary" onClick={openNew}>
          + Register member
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
            placeholder="Search by name, membership number, phone or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search members"
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <span className="members-count">{meta.total} member{meta.total === 1 ? '' : 's'}</span>
        </div>

        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th>Membership no.</th>
                <th>Name</th>
                <th>Phone</th>
                <th>County</th>
                <th>Member since</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {!loaded && (
                <tr><td colSpan="7" className="table-empty">Loading members…</td></tr>
              )}

              {loaded && members.length === 0 && (
                <tr>
                  <td colSpan="7" className="table-empty">
                    {debouncedSearch || status
                      ? 'No members match your search.'
                      : 'No members registered yet.'}
                  </td>
                </tr>
              )}

              {members.map((member) => (
                <tr key={member.id}>
                  <td className="mono">{member.membership_number}</td>
                  <td>
                    <strong>{member.first_name} {member.last_name}</strong>
                    {member.email && <small>{member.email}</small>}
                  </td>
                  <td>{member.phone}</td>
                  <td>{member.county || '—'}</td>
                  <td>{formatDate(member.membership_date)}</td>
                  <td>
                    <span className={`status-pill ${member.status}`}>{member.status}</span>
                  </td>
                  <td className="row-actions">
                    <button type="button" onClick={() => openEdit(member)}>Edit</button>
                    <button type="button" onClick={() => toggleStatus(member)}>
                      {member.status === 'active' ? 'Deactivate' : 'Activate'}
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
        <MemberForm
          key={editing?.id ?? 'new'}
          member={editing}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

export default Members
