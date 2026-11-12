import { useState } from 'react'
import { api } from '../../lib/api'

const dateOnly = (value) => (value ? String(value).slice(0, 10) : '')

function AnnouncementForm({ announcement, onClose, onSaved }) {
  const editing = Boolean(announcement)

  const [form, setForm] = useState({
    title: announcement?.title ?? '',
    category: announcement?.category ?? '',
    description: announcement?.description ?? '',
    image_url: announcement?.image_url ?? '',
    published_at: dateOnly(announcement?.published_at),
    status: announcement?.status ?? 'draft',
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

    const clean = (value) => (value.trim() === '' ? null : value.trim())

    const body = {
      title: form.title,
      category: clean(form.category),
      description: form.description,
      image_url: clean(form.image_url),
      published_at: clean(form.published_at),
      status: form.status,
    }

    try {
      const data = editing
        ? await api(`/announcements/${announcement.id}`, { method: 'PUT', body })
        : await api('/announcements', { method: 'POST', body })
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
        aria-labelledby="announcement-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="announcement-form-title">
              {editing ? 'Edit Announcement' : 'Create an Announcement'}
            </h2>
            <p>Published items appear in the News section of the public website.</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="member-form" noValidate>
          {formError && <div className="members-alert error" role="alert">{formError}</div>}

          <div className="form-grid">
            <div className="field full">
              <label htmlFor="title">Title *</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} required />
              {field('title') && <small>{field('title')}</small>}
            </div>

            <div className="field">
              <label htmlFor="category">Category</label>
              <input id="category" name="category" maxLength="100" placeholder="e.g. Youth Development" value={form.category} onChange={handleChange} />
              {field('category') && <small>{field('category')}</small>}
            </div>

            <div className="field">
              <label htmlFor="published_at">Date</label>
              <input id="published_at" name="published_at" type="date" value={form.published_at} onChange={handleChange} />
              <span className="hint">Leave empty to use the publishing date.</span>
              {field('published_at') && <small>{field('published_at')}</small>}
            </div>

            <div className="field full">
              <label htmlFor="description">Description *</label>
              <textarea id="description" name="description" rows="4" value={form.description} onChange={handleChange} required />
              {field('description') && <small>{field('description')}</small>}
            </div>

            <div className="field full">
              <label htmlFor="image_url">Image link</label>
              <input id="image_url" name="image_url" type="url" placeholder="https://…" value={form.image_url} onChange={handleChange} />
              <span className="hint">Paste a link to an image. Uploading images will be added later.</span>
              {field('image_url') && <small>{field('image_url')}</small>}
            </div>

            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published (visible on website)</option>
              </select>
              {field('status') && <small>{field('status')}</small>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AnnouncementForm
