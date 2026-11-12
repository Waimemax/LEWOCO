import { useState } from 'react'
import { api } from '../../lib/api'

function ResetPasswordForm({ user, onClose, onSaved }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const data = await api(`/users/${user.id}/password`, {
        method: 'PATCH',
        body: { password },
      })
      onSaved(data.message)
    } catch (err) {
      setError(err.errors?.password?.[0] || err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal-card narrow"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="reset-title">Reset password</h2>
            <p>{user.name} will be signed out everywhere and must use the new password.</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="members-alert error" role="alert">{error}</div>}

          <div className="field">
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <span className="hint">At least 8 characters. Tell them the password in person, not by an open message.</span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Reset password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordForm
