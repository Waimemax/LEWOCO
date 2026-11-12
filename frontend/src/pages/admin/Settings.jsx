import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import UserForm from '../../components/admin/UserForm'
import ResetPasswordForm from '../../components/admin/ResetPasswordForm'
import './Members.css'
import './Programmes.css'
import './Settings.css'

const ROLE_LABELS = {
  super_admin: 'Super Administrator',
  content_admin: 'Content Administrator',
}

function Settings() {
  const { user: me } = useAuth()

  const [users, setUsers] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [resetting, setResetting] = useState(null)

  useEffect(() => {
    let cancelled = false

    api('/users')
      .then((data) => {
        if (cancelled) return
        setUsers(data.users)
        setError('')
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoaded(true))

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  function handleSaved(message) {
    setFormOpen(false)
    setResetting(null)
    setNotice(message)
    setReloadKey((key) => key + 1)
  }

  async function toggleActive(account) {
    const next = !account.is_active
    const question = next
      ? `Activate ${account.name}? They will be able to sign in again.`
      : `Deactivate ${account.name}? They will be signed out and unable to sign in.`

    if (!window.confirm(question)) return

    try {
      const data = await api(`/users/${account.id}/status`, {
        method: 'PATCH',
        body: { is_active: next },
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
          <span className="members-eyebrow">SYSTEM</span>
          <h1>Settings</h1>
          <p>Manage who can sign in to the administration portal.</p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          + Add administrator
        </button>
      </div>

      {notice && (
        <div className="members-alert success" role="status">
          {notice}
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss">×</button>
        </div>
      )}
      {error && <div className="members-alert error" role="alert">{error}</div>}

      <div className="roles-help">
        <div>
          <strong>Super Administrator</strong>
          <span>Everything, including Members, Reports and Settings.</span>
        </div>
        <div>
          <strong>Content Administrator</strong>
          <span>Programmes, Projects, Training &amp; Events, News, Resources and Enquiries. No access to Members, Reports or Settings.</span>
        </div>
      </div>

      <div className="members-panel">
        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th>Administrator</th>
                <th>Role</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {!loaded && (
                <tr><td colSpan="4" className="table-empty">Loading administrators…</td></tr>
              )}

              {users.map((account) => {
                const isMe = account.id === me?.id

                return (
                  <tr key={account.id}>
                    <td>
                      <strong>
                        {account.name}
                        {isMe && <span className="you-tag">You</span>}
                      </strong>
                      <small>{account.email}</small>
                    </td>
                    <td>{ROLE_LABELS[account.role] || account.role}</td>
                    <td>
                      <span className={`status-pill ${account.is_active ? 'active' : 'inactive'}`}>
                        {account.is_active ? 'active' : 'deactivated'}
                      </span>
                    </td>
                    <td className="row-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(account)
                          setFormOpen(true)
                        }}
                      >
                        Edit
                      </button>
                      {!isMe && (
                        <>
                          <button type="button" onClick={() => setResetting(account)}>Reset password</button>
                          <button type="button" onClick={() => toggleActive(account)}>
                            {account.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <UserForm
          key={editing?.id ?? 'new'}
          user={editing}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {resetting && (
        <ResetPasswordForm
          key={resetting.id}
          user={resetting}
          onClose={() => setResetting(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

export default Settings
