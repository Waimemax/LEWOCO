import { useState } from 'react'
import { api } from '../../lib/api'

const dateOnly = (value) => (value ? String(value).slice(0, 10) : '')

function MemberForm({ member, onClose, onSaved }) {
  const editing = Boolean(member)

  const [form, setForm] = useState({
    first_name: member?.first_name ?? '',
    last_name: member?.last_name ?? '',
    gender: member?.gender ?? '',
    date_of_birth: dateOnly(member?.date_of_birth),
    phone: member?.phone ?? '',
    email: member?.email ?? '',
    physical_address: member?.physical_address ?? '',
    county: member?.county ?? '',
    membership_date: dateOnly(member?.membership_date),
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors({})
    setFormError('')
    setSaving(true)

    // Send empty optional fields as null so the server clears them
    const body = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value === '' ? null : value]),
    )
    if (!editing && !body.membership_date) delete body.membership_date

    try {
      const data = editing
        ? await api(`/members/${member.id}`, { method: 'PUT', body })
        : await api('/members', { method: 'POST', body })
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
        aria-labelledby="member-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="member-form-title">{editing ? 'Edit Member' : 'Register a Member'}</h2>
            {editing && <p>Membership number: {member.membership_number}</p>}
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="member-form" noValidate>
          {formError && <div className="members-alert error" role="alert">{formError}</div>}

          <div className="form-grid">
            <div className="field">
              <label htmlFor="first_name">First name *</label>
              <input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} required />
              {field('first_name') && <small>{field('first_name')}</small>}
            </div>

            <div className="field">
              <label htmlFor="last_name">Last name *</label>
              <input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} required />
              {field('last_name') && <small>{field('last_name')}</small>}
            </div>

            <div className="field">
              <label htmlFor="phone">Phone *</label>
              <input id="phone" name="phone" type="tel" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={handleChange} required />
              {field('phone') && <small>{field('phone')}</small>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
              {field('email') && <small>{field('email')}</small>}
            </div>

            <div className="field">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Not specified</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              {field('gender') && <small>{field('gender')}</small>}
            </div>

            <div className="field">
              <label htmlFor="date_of_birth">Date of birth</label>
              <input id="date_of_birth" name="date_of_birth" type="date" max={today} value={form.date_of_birth} onChange={handleChange} />
              {field('date_of_birth') && <small>{field('date_of_birth')}</small>}
            </div>

            <div className="field">
              <label htmlFor="county">County</label>
              <input id="county" name="county" value={form.county} onChange={handleChange} />
              {field('county') && <small>{field('county')}</small>}
            </div>

            <div className="field">
              <label htmlFor="membership_date">Membership date</label>
              <input id="membership_date" name="membership_date" type="date" value={form.membership_date} onChange={handleChange} required={editing} />
              {!editing && <span className="hint">Defaults to today</span>}
              {field('membership_date') && <small>{field('membership_date')}</small>}
            </div>

            <div className="field full">
              <label htmlFor="physical_address">Physical address</label>
              <textarea id="physical_address" name="physical_address" rows="2" value={form.physical_address} onChange={handleChange} />
              {field('physical_address') && <small>{field('physical_address')}</small>}
            </div>
          </div>

          {!editing && (
            <p className="hint">A membership number is generated automatically when the member is saved.</p>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Register member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MemberForm
