import { useEffect, useMemo, useState } from 'react'
import { formatKES } from '../../lib/money'
import './ShopSection.css'

const emptyForm = {
  customer_name: '',
  email: '',
  phone: '',
  delivery_details: '',
  customer_notes: '',
  mpesa_code: '',
  hp_ref: '', // hidden spam trap: real visitors leave it empty
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  return { response, data }
}

function PaymentSteps({ payment, total }) {
  const isPaybill = payment.method === 'paybill'

  return (
    <ol className="shop-steps">
      <li>Open <strong>M-Pesa</strong> on your phone and choose <strong>Lipa na M-Pesa</strong>.</li>
      {isPaybill ? (
        <>
          <li>Choose <strong>Pay Bill</strong> and enter Business Number <strong>{payment.number}</strong>.</li>
          <li>For the account number, enter <strong>your phone number</strong>.</li>
        </>
      ) : (
        <>
          <li>Choose <strong>Buy Goods and Services</strong> and enter Till Number <strong>{payment.number}</strong>.</li>
        </>
      )}
      <li>Enter the amount <strong>{formatKES(total)}</strong> and your PIN. The name shown should be <strong>{payment.account_name}</strong>.</li>
      <li>When the M-Pesa message arrives, type its <strong>transaction code</strong> (10 letters and numbers) in the form below.</li>
    </ol>
  )
}

function ShopSection() {
  const [products, setProducts] = useState([])
  const [payment, setPayment] = useState({ method: 'till', number: '', account_name: 'LEWOCO' })
  const [loaded, setLoaded] = useState(false)

  const [cart, setCart] = useState({})
  const [form, setForm] = useState(emptyForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [placed, setPlaced] = useState(null)

  const [trackForm, setTrackForm] = useState({ reference: '', phone: '' })
  const [trackResult, setTrackResult] = useState(null)
  const [trackError, setTrackError] = useState('')
  const [tracking, setTracking] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch('/api/public/products', { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return
        if (Array.isArray(data.products)) setProducts(data.products)
        if (data.payment) setPayment(data.payment)
      })
      .catch(() => {
        // No products: the whole section stays hidden
      })
      .finally(() => !cancelled && setLoaded(true))

    return () => {
      cancelled = true
    }
  }, [])

  const lines = useMemo(
    () =>
      products
        .filter((product) => cart[product.id] > 0)
        .map((product) => ({ product, quantity: cart[product.id], total: product.price * cart[product.id] })),
    [products, cart]
  )
  const total = lines.reduce((sum, line) => sum + line.total, 0)
  const canPay = Boolean(payment.number)

  function changeQuantity(product, delta) {
    setPlaced(null)
    setCart((previous) => {
      const next = Math.max(0, Math.min(100, (previous[product.id] || 0) + delta))
      return { ...previous, [product.id]: next }
    })
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({
      ...previous,
      [name]: name === 'mpesa_code' ? value.toUpperCase().replace(/[^A-Z0-9]/g, '') : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFieldErrors({})
    setErrorMessage('')
    setSubmitting(true)

    try {
      const { response, data } = await postJson('/api/public/orders', {
        ...form,
        items: lines.map((line) => ({ product_id: line.product.id, quantity: line.quantity })),
      })

      if (response.status === 422) {
        setFieldErrors(data.errors || {})
        setErrorMessage(data.errors?.items?.[0] || 'Please check the highlighted details and try again.')
      } else if (response.status === 429) {
        setErrorMessage('Too many attempts. Please wait a few minutes, or contact LEWOCO by phone or email.')
      } else if (!response.ok) {
        setErrorMessage('Sorry, we could not place your order. Please try again, or contact LEWOCO.')
      } else {
        setPlaced({ reference: data.reference, total: data.total, email: form.email })
        setCart({})
        setForm(emptyForm)
      }
    } catch {
      setErrorMessage('Could not reach the server. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleTrack(event) {
    event.preventDefault()
    setTrackError('')
    setTrackResult(null)
    setTracking(true)

    try {
      const { response, data } = await postJson('/api/public/orders/track', trackForm)

      if (response.ok) setTrackResult(data.order)
      else if (response.status === 429) setTrackError('Too many attempts. Please wait a minute and try again.')
      else setTrackError(data.message || 'We could not find an order with those details.')
    } catch {
      setTrackError('Could not reach the server. Please try again.')
    } finally {
      setTracking(false)
    }
  }

  // Nothing published yet: show nothing rather than an empty shop
  if (!loaded || products.length === 0) return null

  const err = (name) => fieldErrors[name]?.[0]

  return (
    <section className="shop-section" id="shop">
      <div className="shop-container">
        <div className="shop-heading">
          <span className="shop-label">LEWOCO SHOP</span>
          <h2>
            Buy Products Made by <span>Our Members</span>
          </h2>
          <p>
            Every purchase supports women-led enterprise in Lower Eastern Kenya. Order here and pay by
            M-Pesa. We check your payment, approve your order and email you.
          </p>
        </div>

        <div className="shop-grid">
          {products.map((product) => {
            const quantity = cart[product.id] || 0

            return (
              <article className="shop-card" key={product.id}>
                <div className="shop-icon"><span>{product.icon || '🛍️'}</span></div>

                {product.category && <span className="shop-category">{product.category}</span>}
                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <div className="shop-price">
                  {formatKES(product.price)}
                  {product.unit && <small> {product.unit}</small>}
                </div>

                {product.in_stock ? (
                  <div className="shop-qty" role="group" aria-label={`Quantity of ${product.name}`}>
                    <button type="button" onClick={() => changeQuantity(product, -1)} disabled={quantity === 0} aria-label="Remove one">−</button>
                    <span aria-live="polite">{quantity}</span>
                    <button type="button" onClick={() => changeQuantity(product, 1)} aria-label="Add one">+</button>
                  </div>
                ) : (
                  <span className="shop-out">Out of stock</span>
                )}
              </article>
            )
          })}
        </div>

        {placed && (
          <div className="shop-panel shop-success" role="status">
            <h3>Thank you, your order is received</h3>
            <p>
              Your order reference is <strong className="shop-ref">{placed.reference}</strong>. Please keep it.
              We will check your M-Pesa payment of {formatKES(placed.total)} and email you at {placed.email} once your
              order is approved.
            </p>
          </div>
        )}

        {lines.length > 0 && (
          <div className="shop-panel" id="shop-checkout">
            <h3>Your order</h3>

            <table className="shop-lines">
              <tbody>
                {lines.map((line) => (
                  <tr key={line.product.id}>
                    <td>{line.product.name} × {line.quantity}</td>
                    <td>{formatKES(line.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr><td>Total to pay</td><td>{formatKES(total)}</td></tr>
              </tfoot>
            </table>

            {!canPay ? (
              <p className="shop-note">
                Online payment details are being set up. Please <a href="#contact">contact us</a> to place this order.
              </p>
            ) : (
              <>
                <h4>1. Pay with M-Pesa</h4>
                <PaymentSteps payment={payment} total={total} />

                <h4>2. Tell us where to deliver</h4>
                <form className="shop-form" onSubmit={handleSubmit} noValidate>
                  {errorMessage && <div className="shop-alert" role="alert">{errorMessage}</div>}

                  <div className="shop-trap" aria-hidden="true">
                    <label htmlFor="shop-hp">Leave this field empty</label>
                    <input id="shop-hp" type="text" name="hp_ref" tabIndex="-1" autoComplete="off" value={form.hp_ref} onChange={handleChange} />
                  </div>

                  <div className="shop-fields">
                    <div className="shop-field">
                      <label htmlFor="shop-name">Full name *</label>
                      <input id="shop-name" name="customer_name" autoComplete="name" value={form.customer_name} onChange={handleChange} required />
                      {err('customer_name') && <small>{err('customer_name')}</small>}
                    </div>

                    <div className="shop-field">
                      <label htmlFor="shop-phone">Phone number *</label>
                      <input id="shop-phone" name="phone" type="tel" autoComplete="tel" placeholder="e.g. 0712 345 678" value={form.phone} onChange={handleChange} required />
                      {err('phone') && <small>{err('phone')}</small>}
                    </div>

                    <div className="shop-field full">
                      <label htmlFor="shop-email">Email *</label>
                      <input id="shop-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />
                      <span className="shop-hint">We email you here when your order is approved.</span>
                      {err('email') && <small>{err('email')}</small>}
                    </div>

                    <div className="shop-field full">
                      <label htmlFor="shop-delivery">Delivery details *</label>
                      <textarea id="shop-delivery" name="delivery_details" rows="3" placeholder="Town or area, landmark, and any directions" value={form.delivery_details} onChange={handleChange} required />
                      {err('delivery_details') && <small>{err('delivery_details')}</small>}
                    </div>

                    <div className="shop-field full">
                      <label htmlFor="shop-notes">Notes (optional)</label>
                      <textarea id="shop-notes" name="customer_notes" rows="2" value={form.customer_notes} onChange={handleChange} />
                      {err('customer_notes') && <small>{err('customer_notes')}</small>}
                    </div>

                    <div className="shop-field full">
                      <label htmlFor="shop-code">M-Pesa transaction code *</label>
                      <input id="shop-code" name="mpesa_code" maxLength="10" placeholder="e.g. QGH7K2M9PX" autoComplete="off" value={form.mpesa_code} onChange={handleChange} required />
                      {err('mpesa_code') && <small>{err('mpesa_code')}</small>}
                    </div>
                  </div>

                  <p className="shop-consent">
                    By placing this order you agree that LEWOCO may use these details to process and deliver it, as
                    described in our <a href="/privacy">privacy notice</a>.
                  </p>

                  <button type="submit" className="shop-submit" disabled={submitting}>
                    {submitting ? 'Placing order…' : `Place order (${formatKES(total)})`}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        <div className="shop-panel shop-track">
          <h3>Check your order</h3>
          <p>Enter your order reference and the phone number you used.</p>

          <form className="shop-track-form" onSubmit={handleTrack}>
            <input
              aria-label="Order reference"
              placeholder="Reference, e.g. LW-7K2M9Q"
              value={trackForm.reference}
              onChange={(event) => setTrackForm({ ...trackForm, reference: event.target.value })}
              required
            />
            <input
              aria-label="Phone number"
              type="tel"
              placeholder="Phone number"
              value={trackForm.phone}
              onChange={(event) => setTrackForm({ ...trackForm, phone: event.target.value })}
              required
            />
            <button type="submit" disabled={tracking}>{tracking ? 'Checking…' : 'Check order'}</button>
          </form>

          {trackError && <div className="shop-alert" role="alert">{trackError}</div>}

          {trackResult && (
            <div className="shop-track-result" role="status">
              <p>
                <strong>{trackResult.reference}</strong>
                <span className={`shop-status ${trackResult.status}`}>{trackResult.status_label}</span>
              </p>
              <ul>
                {trackResult.items.map((item) => (
                  <li key={item.name}>{item.name} × {item.quantity} — {formatKES(item.line_total)}</li>
                ))}
              </ul>
              <p>Total: <strong>{formatKES(trackResult.total)}</strong></p>
              {trackResult.rejection_reason && (
                <p className="shop-reason">Reason: {trackResult.rejection_reason}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ShopSection
