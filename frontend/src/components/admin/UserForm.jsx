import { useState } from 'react'
import { api } from '../../lib/api'

function UserForm({ user, onClose, onSaved }) {
  const editing = Boolean(user)

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    role: user?.role ?? 'content_admin',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors({})
    setFormError('')
    setSaving(true)

    try {
      const data = editing
        ? await api(`/users/${user.id}`, {
            method: 'PUT',
            body: { name: form.name, email: form.email, role: form.role },
          })
        : await api('/users', { method: 'POST', body: form })
      onSaved(data.message)
    } catch (err) {
      setErrors(err.errors || {})
      setFormError(err.errors ? 'Please correct the highlighted fields.' : err.message)
    } finally {
      setSaving(false)
    }
  }

  const field = (name) => errors[name]?.[0]

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="user-form-title">{editing ? 'Edit Administrator' : 'Add an Administrator'}</h2>
            <p>{editing ? 'Changing the role signs them out so it takes effect at once.' : 'They can sign in straight away with this password.'}</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {formError && <div className="members-alert error" role="alert">{formError}</div>}

          <div className="form-grid">
            <div className="field">
              <label htmlFor="name">Full name *</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
              {field('name') && <small>{field('name')}</small>}
            </div>

            <div className="field">
              <label htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" autoComplete="off" value={form.email} onChange={handleChange} required />
              {field('email') && <small>{field('email')}</small>}
            </div>

            <div className="field">
              <label htmlFor="role">Role *</label>
              <select id="role" name="role" value={form.role} onChange={handleChange}>
                <option value="content_admin">Content Administrator</option>
                <option value="super_admin">Super Administrator</option>
              </select>
              {field('role') && <small>{field('role')}</small>}
            </div>

            {!editing && (
              <div className="field">
                <label htmlFor="password">Password *</label>
                <input id="password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} required />
                <span className="hint">At least 8 characters.</span>
                {field('password') && <small>{field('password')}</small>}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add administrator'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm
