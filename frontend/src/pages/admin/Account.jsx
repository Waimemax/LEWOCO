import { useState } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import './Members.css'
import './Account.css'

const ROLE_LABELS = {
  super_admin: 'Super Administrator',
  content_admin: 'Content Administrator',
}

function Account() {
  const { user } = useAuth()

  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors({})
    setFormError('')
    setNotice('')
    setSaving(true)

    try {
      const data = await api('/auth/password', { method: 'POST', body: form })
      setNotice(data.message)
      setForm({ current_password: '', password: '', password_confirmation: '' })
    } catch (err) {
      setErrors(err.errors || {})
      setFormError(err.errors ? 'Please correct the highlighted fields.' : err.message)
    } finally {
      setSaving(false)
    }
  }

  const field = (name) => errors[name]?.[0]

  return (
    <div className="members-page account-page">
      <div className="members-heading">
        <div>
          <span className="members-eyebrow">SYSTEM</span>
          <h1>My Account</h1>
          <p>Your sign-in details and password.</p>
        </div>
      </div>

      <div className="members-panel account-card">
        <dl className="account-facts">
          <div><dt>Name</dt><dd>{user?.name}</dd></div>
          <div><dt>Email</dt><dd>{user?.email}</dd></div>
          <div><dt>Role</dt><dd>{ROLE_LABELS[user?.role] || user?.role}</dd></div>
        </dl>
      </div>

      <div className="members-panel account-card">
        <h2>Change password</h2>
        <p className="account-help">
          You stay signed in here. Any other device you are signed in on will be signed out.
        </p>

        {notice && <div className="members-alert success" role="status">{notice}</div>}
        {formError && <div className="members-alert error" role="alert">{formError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="account-fields">
            <div className="field">
              <label htmlFor="current_password">Current password</label>
              <input id="current_password" name="current_password" type="password" autoComplete="current-password" value={form.current_password} onChange={handleChange} required />
              {field('current_password') && <small>{field('current_password')}</small>}
            </div>

            <div className="field">
              <label htmlFor="password">New password</label>
              <input id="password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} required />
              <span className="hint">At least 8 characters, different from the current one.</span>
              {field('password') && <small>{field('password')}</small>}
            </div>

            <div className="field">
              <label htmlFor="password_confirmation">Confirm new password</label>
              <input id="password_confirmation" name="password_confirmation" type="password" autoComplete="new-password" value={form.password_confirmation} onChange={handleChange} required />
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Change password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Account
