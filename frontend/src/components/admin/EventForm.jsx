import { useState } from 'react'
import { api } from '../../lib/api'

const dateOnly = (value) => (value ? String(value).slice(0, 10) : '')
const timeOnly = (value) => (value ? String(value).slice(0, 5) : '')

function EventForm({ event, onClose, onSaved }) {
  const editing = Boolean(event)

  const [form, setForm] = useState({
    title: event?.title ?? '',
    type: event?.type ?? 'training',
    description: event?.description ?? '',
    venue: event?.venue ?? '',
    start_date: dateOnly(event?.start_date),
    end_date: dateOnly(event?.end_date),
    start_time: timeOnly(event?.start_time),
    end_time: timeOnly(event?.end_time),
    status: event?.status ?? 'draft',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleChange(changeEvent) {
    const { name, value } = changeEvent.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault()
    setErrors({})
    setFormError('')
    setSaving(true)

    const clean = (value) => (value.trim() === '' ? null : value.trim())

    const body = {
      title: form.title,
      type: form.type,
      description: clean(form.description),
      venue: clean(form.venue),
      start_date: form.start_date,
      end_date: clean(form.end_date),
      start_time: clean(form.start_time),
      end_time: clean(form.end_time),
      status: form.status,
    }

    try {
      const data = editing
        ? await api(`/events/${event.id}`, { method: 'PUT', body })
        : await api('/events', { method: 'POST', body })
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
        aria-labelledby="event-form-title"
        onMouseDown={(mouseEvent) => mouseEvent.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="event-form-title">{editing ? 'Edit Event' : 'Create a Training or Event'}</h2>
            <p>Published upcoming events appear on the public website.</p>
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
              <label htmlFor="type">Type</label>
              <select id="type" name="type" value={form.type} onChange={handleChange}>
                <option value="training">Training</option>
                <option value="workshop">Workshop</option>
                <option value="meeting">Meeting</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
              {field('type') && <small>{field('type')}</small>}
            </div>

            <div className="field">
              <label htmlFor="venue">Venue</label>
              <input id="venue" name="venue" placeholder="e.g. Masii, Machakos County" value={form.venue} onChange={handleChange} />
              {field('venue') && <small>{field('venue')}</small>}
            </div>

            <div className="field">
              <label htmlFor="start_date">Start date *</label>
              <input id="start_date" name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
              {field('start_date') && <small>{field('start_date')}</small>}
            </div>

            <div className="field">
              <label htmlFor="end_date">End date</label>
              <input id="end_date" name="end_date" type="date" min={form.start_date || undefined} value={form.end_date} onChange={handleChange} />
              <span className="hint">Leave empty for a one-day event.</span>
              {field('end_date') && <small>{field('end_date')}</small>}
            </div>

            <div className="field">
              <label htmlFor="start_time">Start time</label>
              <input id="start_time" name="start_time" type="time" value={form.start_time} onChange={handleChange} />
              {field('start_time') && <small>{field('start_time')}</small>}
            </div>

            <div className="field">
              <label htmlFor="end_time">End time</label>
              <input id="end_time" name="end_time" type="time" value={form.end_time} onChange={handleChange} />
              {field('end_time') && <small>{field('end_time')}</small>}
            </div>

            <div className="field full">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows="3" value={form.description} onChange={handleChange} />
              {field('description') && <small>{field('description')}</small>}
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
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventForm
