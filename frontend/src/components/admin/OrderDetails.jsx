import { useState } from 'react'
import { api } from '../../lib/api'
import { formatKES } from '../../lib/money'

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    : '—'

const STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  delivered: 'Delivered',
  rejected: 'Rejected',
}

function OrderDetails({ order, onClose, onChanged }) {
  const [notes, setNotes] = useState(order.admin_notes ?? '')
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function run(request, fallbackError) {
    setError('')
    setBusy(true)
    try {
      const data = await request()
      onChanged(data.message)
    } catch (err) {
      setError(err.errors ? Object.values(err.errors)[0][0] : err.message || fallbackError)
    } finally {
      setBusy(false)
    }
  }

  function approve() {
    if (
      !window.confirm(
        `Approve order ${order.reference}? Confirm first that ${formatKES(order.total)} was received with M-Pesa code ${order.mpesa_code}. The customer will be emailed.`
      )
    )
      return
    run(() => api(`/orders/${order.id}/approve`, { method: 'POST' }))
  }

  function reject(event) {
    event.preventDefault()
    run(() =>
      api(`/orders/${order.id}/reject`, { method: 'POST', body: { rejection_reason: reason.trim() } })
    )
  }

  function deliver() {
    if (!window.confirm(`Mark order ${order.reference} as delivered?`)) return
    run(() => api(`/orders/${order.id}/deliver`, { method: 'POST' }))
  }

  function saveNotes(event) {
    event.preventDefault()
    run(() =>
      api(`/orders/${order.id}`, {
        method: 'PATCH',
        body: { admin_notes: notes.trim() === '' ? null : notes.trim() },
      })
    )
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="order-title">Order {order.reference}</h2>
            <p>
              Placed {formatDateTime(order.created_at)} ·{' '}
              <span className={`status-pill ${order.status}`}>{STATUS_LABELS[order.status]}</span>
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {error && <div className="members-alert error" role="alert">{error}</div>}

        <table className="order-lines">
          <thead>
            <tr><th>Item</th><th>Price</th><th>Qty</th><th>Total</th></tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{formatKES(item.unit_price)}</td>
                <td>{item.quantity}</td>
                <td>{formatKES(item.line_total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan="3">Total to be paid</td><td>{formatKES(order.total)}</td></tr>
          </tfoot>
        </table>

        {order.status === 'pending' && (
          <p className="order-check">
            Check the M-Pesa statement for a payment of <strong>{formatKES(order.total)}</strong> with
            code <span className="order-code">{order.mpesa_code}</span> from {order.phone}. Approve only if it matches.
          </p>
        )}

        <dl className="enquiry-facts">
          <div>
            <dt>Customer</dt>
            <dd>{order.customer_name}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd><a href={`tel:${order.phone}`}>{order.phone}</a></dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd><a href={`mailto:${order.email}`}>{order.email}</a></dd>
          </div>
          <div>
            <dt>M-Pesa code</dt>
            <dd><span className="order-code">{order.mpesa_code}</span></dd>
          </div>
          <div>
            <dt>Approved</dt>
            <dd>{formatDateTime(order.approved_at)}</dd>
          </div>
          <div>
            <dt>Delivered</dt>
            <dd>{formatDateTime(order.delivered_at)}</dd>
          </div>
        </dl>

        <div className="enquiry-message">
          <strong>Delivery details</strong>
          {'\n'}
          {order.delivery_details}
          {order.customer_notes ? `\n\nCustomer notes\n${order.customer_notes}` : ''}
          {order.status === 'rejected' && order.rejection_reason
            ? `\n\nReason for rejection\n${order.rejection_reason}`
            : ''}
        </div>

        <form onSubmit={saveNotes} className="member-form">
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="order-notes">Internal notes</label>
              <textarea
                id="order-notes"
                rows="2"
                placeholder="Visible to staff only, never to the customer."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-secondary" disabled={busy}>Save notes</button>
          </div>
        </form>

        {rejecting && order.status === 'pending' && (
          <form onSubmit={reject} className="member-form">
            <div className="form-grid">
              <div className="field full">
                <label htmlFor="reject-reason">Reason for rejecting (sent to the customer) *</label>
                <textarea
                  id="reject-reason"
                  rows="3"
                  required
                  placeholder="e.g. We could not find this M-Pesa payment, or the amount paid does not match the order total."
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setRejecting(false)}>Cancel</button>
              <button type="submit" className="btn-danger" disabled={busy || reason.trim() === ''}>
                {busy ? 'Rejecting…' : 'Reject order'}
              </button>
            </div>
          </form>
        )}

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Close</button>

          {order.status === 'pending' && !rejecting && (
            <>
              <button type="button" className="btn-secondary" onClick={() => setRejecting(true)} disabled={busy}>
                Reject…
              </button>
              <button type="button" className="btn-primary" onClick={approve} disabled={busy}>
                {busy ? 'Working…' : 'Approve order'}
              </button>
            </>
          )}

          {order.status === 'approved' && (
            <button type="button" className="btn-primary" onClick={deliver} disabled={busy}>
              Mark as delivered
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
