import { useState } from 'react'
import { api } from '../../lib/api'

function ResourceForm({ resource, onClose, onSaved }) {
  const editing = Boolean(resource)

  const [form, setForm] = useState({
    title: resource?.title ?? '',
    category: resource?.category ?? '',
    description: resource?.description ?? '',
    link_url: resource?.link_url ?? '',
    icon: resource?.icon ?? '',
    display_order: resource?.display_order ?? '',
    status: resource?.status ?? 'draft',
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

    const body = {
      title: form.title,
      category: form.category.trim() === '' ? null : form.category.trim(),
      description: form.description,
      link_url: form.link_url.trim() === '' ? null : form.link_url.trim(),
      icon: form.icon.trim() === '' ? null : form.icon.trim(),
      status: form.status,
    }
    if (form.display_order !== '') body.display_order = Number(form.display_order)

    try {
      const data = editing
        ? await api(`/resources/${resource.id}`, { method: 'PUT', body })
        : await api('/resources', { method: 'POST', body })
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
        aria-labelledby="resource-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="resource-form-title">{editing ? 'Edit Resource' : 'Create a Resource'}</h2>
            <p>Published resources appear on the public website.</p>
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

            <div className="field full">
              <label htmlFor="category">Category</label>
              <input id="category" name="category" maxLength="100" placeholder="e.g. Women-Led Enterprise" value={form.category} onChange={handleChange} />
              {field('category') && <small>{field('category')}</small>}
            </div>

            <div className="field full">
              <label htmlFor="description">Description *</label>
              <textarea id="description" name="description" rows="4" value={form.description} onChange={handleChange} required />
              {field('description') && <small>{field('description')}</small>}
            </div>

            <div className="field full">
              <label htmlFor="link_url">Link (optional)</label>
              <input id="link_url" name="link_url" type="url" placeholder="https://…" value={form.link_url} onChange={handleChange} />
              <span className="hint">If set, the public card opens this link. Otherwise it points visitors to the contact form.</span>
              {field('link_url') && <small>{field('link_url')}</small>}
            </div>

            <div className="field">
              <label htmlFor="icon">Icon (emoji)</label>
              <input id="icon" name="icon" maxLength="16" placeholder="e.g. 🌱" value={form.icon} onChange={handleChange} />
              {field('icon') && <small>{field('icon')}</small>}
            </div>

            <div className="field">
              <label htmlFor="display_order">Display order</label>
              <input id="display_order" name="display_order" type="number" min="0" value={form.display_order} onChange={handleChange} />
              <span className="hint">Lower numbers appear first. Leave empty to add at the end.</span>
              {field('display_order') && <small>{field('display_order')}</small>}
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
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResourceForm
