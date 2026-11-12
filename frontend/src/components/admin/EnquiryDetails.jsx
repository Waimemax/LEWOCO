import { useState } from 'react'
import { api } from '../../lib/api'

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    : '—'

function EnquiryDetails({ enquiry, onClose, onSaved }) {
  const [status, setStatus] = useState(enquiry.status)
  const [notes, setNotes] = useState(enquiry.notes ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const data = await api(`/enquiries/${enquiry.id}`, {
        method: 'PATCH',
        body: { status, notes: notes.trim() === '' ? null : notes.trim() },
      })
      onSaved(data.message)
    } catch (err) {
      setError(err.errors ? Object.values(err.errors)[0][0] : err.message)
    } finally {
      setSaving(false)
    }
  }

  const replySubject = encodeURIComponent(`Re: ${enquiry.subject}`)

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="enquiry-title">{enquiry.subject}</h2>
            <p>Received {formatDateTime(enquiry.created_at)}</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <dl className="enquiry-facts">
          <div>
            <dt>From</dt>
            <dd>{enquiry.full_name}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd><a href={`mailto:${enquiry.email}?subject=${replySubject}`}>{enquiry.email}</a></dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd><a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a></dd>
          </div>
        </dl>

        <div className="enquiry-message">{enquiry.message}</div>

        <form onSubmit={handleSave} className="member-form">
          {error && <div className="members-alert error" role="alert">{error}</div>}

          <div className="form-grid">
            <div className="field">
              <label htmlFor="enquiry-status">Status</label>
              <select id="enquiry-status" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
              </select>
            </div>

            <div className="field full">
              <label htmlFor="enquiry-notes">Internal notes</label>
              <textarea
                id="enquiry-notes"
                rows="3"
                placeholder="Visible to staff only, never to the visitor."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <a
              className="btn-secondary reply-link"
              href={`mailto:${enquiry.email}?subject=${replySubject}`}
            >
              Reply by email
            </a>
            <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EnquiryDetails
