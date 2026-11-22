import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { formatKES } from '../../lib/money'
import OrderDetails from '../../components/admin/OrderDetails'
// Shared table, toolbar, form and modal styles
import './Members.css'
import './Programmes.css'
import './Enquiries.css'
import './Orders.css'

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    : '—'

function Orders() {
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({ page })
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (status) params.set('status', status)

    api(`/orders?${params}`)
      .then((data) => {
        if (cancelled) return
        setItems(data.data)
        setMeta({ current_page: data.current_page, last_page: data.last_page, total: data.total })
        setError('')
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoaded(true))

    return () => {
      cancelled = true
    }
  }, [page, debouncedSearch, status, reloadKey])

  // The list does not carry the items, so load the full order when opening it
  async function openOrder(item) {
    try {
      const data = await api(`/orders/${item.id}`)
      setSelected(data.order)
    } catch (err) {
      setError(err.message)
    }
  }

  function handleChanged(message) {
    setSelected(null)
    setNotice(message)
    setReloadKey((key) => key + 1)
  }

  return (
    <div className="members-page">
      <div className="members-heading">
        <div>
          <span className="members-eyebrow">SHOP</span>
          <h1>Orders</h1>
          <p>
            Customers pay by M-Pesa when they order. Check each payment, then approve or reject the order.
          </p>
        </div>
      </div>

      {notice && (
        <div className="members-alert success" role="status">
          {notice}
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss">×</button>
        </div>
      )}
      {error && <div className="members-alert error" role="alert">{error}</div>}

      <div className="members-panel">
        <div className="members-toolbar">
          <input
            type="search"
            placeholder="Search by reference, name, phone, email or M-Pesa code"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search orders"
          />

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="delivered">Delivered</option>
            <option value="rejected">Rejected</option>
          </select>

          <span className="members-count">
            {meta.total} order{meta.total === 1 ? '' : 's'}
          </span>
        </div>

        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th>Placed</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {!loaded && (
                <tr><td colSpan="6" className="table-empty">Loading orders…</td></tr>
              )}

              {loaded && items.length === 0 && (
                <tr>
                  <td colSpan="6" className="table-empty">
                    {debouncedSearch || status ? 'No orders match your search.' : 'No orders yet.'}
                  </td>
                </tr>
              )}

              {items.map((item) => (
                <tr key={item.id} className={item.status === 'pending' ? 'row-new' : ''}>
                  <td className="mono">{formatDateTime(item.created_at)}</td>
                  <td>
                    <strong>{item.reference}</strong>
                    <small>M-Pesa {item.mpesa_code}</small>
                  </td>
                  <td>
                    <strong>{item.customer_name}</strong>
                    <small>{item.phone}</small>
                  </td>
                  <td className="mono">{formatKES(item.total)}</td>
                  <td>
                    <span className={`status-pill ${item.status}`}>{item.status}</span>
                  </td>
                  <td className="row-actions">
                    <button type="button" onClick={() => openOrder(item)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta.last_page > 1 && (
          <div className="members-pagination">
            <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              ← Previous
            </button>
            <span>Page {meta.current_page} of {meta.last_page}</span>
            <button type="button" disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}>
              Next →
            </button>
          </div>
        )}
      </div>

      {selected && (
        <OrderDetails
          key={selected.id}
          order={selected}
          onClose={() => setSelected(null)}
          onChanged={handleChanged}
        />
      )}
    </div>
  )
}

export default Orders
