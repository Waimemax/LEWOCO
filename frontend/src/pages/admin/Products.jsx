import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import ProductForm from '../../components/admin/ProductForm'
import { formatKES } from '../../lib/money'
// Shares the table, toolbar and form styles used by the Members page
import './Members.css'
import './Programmes.css'
import './Orders.css'
import './Danger.css'

function Products() {
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

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

    api(`/products?${params}`)
      .then((data) => {
        if (cancelled) return
        setProducts(data.data)
        setMeta({ current_page: data.current_page, last_page: data.last_page, total: data.total })
        setError('')
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoaded(true))

    return () => {
      cancelled = true
    }
  }, [page, debouncedSearch, status, reloadKey])

  function openNew() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(product) {
    setEditing(product)
    setFormOpen(true)
  }

  function handleSaved(message) {
    setFormOpen(false)
    setNotice(message)
    setReloadKey((key) => key + 1)
  }

  async function togglePublished(product) {
    const next = product.status === 'published' ? 'draft' : 'published'
    const question =
      next === 'published'
        ? `Publish "${product.name}" in the public shop?`
        : `Unpublish "${product.name}"? It will be hidden from the public shop.`

    if (!window.confirm(question)) return

    try {
      const data = await api(`/products/${product.id}/status`, {
        method: 'PATCH',
        body: { status: next },
      })
      setNotice(data.message)
      setReloadKey((key) => key + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteProduct(product) {
    if (
      !window.confirm(
        `Delete "${product.name}"? Orders already placed keep its name and price. To only hide it from the shop, use Unpublish instead.`
      )
    )
      return

    try {
      const data = await api(`/products/${product.id}`, { method: 'DELETE' })
      setNotice(data.message)
      setReloadKey((key) => key + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="members-page">
      <div className="members-heading">
        <div>
          <span className="members-eyebrow">SHOP</span>
          <h1>Products</h1>
          <p>Manage the products customers can order from the LEWOCO website.</p>
        </div>

        <button type="button" className="btn-primary" onClick={openNew}>
          + Add product
        </button>
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
            placeholder="Search by name, category or description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <span className="members-count">
            {meta.total} product{meta.total === 1 ? '' : 's'}
          </span>
        </div>

        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Photo</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {!loaded && (
                <tr><td colSpan="6" className="table-empty">Loading products…</td></tr>
              )}

              {loaded && products.length === 0 && (
                <tr>
                  <td colSpan="6" className="table-empty">
                    {debouncedSearch || status
                      ? 'No products match your search.'
                      : 'No products yet.'}
                  </td>
                </tr>
              )}

              {products.map((product) => (
                <tr key={product.id}>
                  <td className="mono">{product.display_order}</td>
                  <td className="icon-cell">
                    {product.image_url ? (
                      <img className="product-thumb" src={product.image_url} alt="" />
                    ) : (
                      product.icon || '—'
                    )}
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                    {product.category && <small>{product.category}</small>}
                    <small className="clamp">{product.description}</small>
                  </td>
                  <td className="mono">
                    {formatKES(product.price)}
                    {product.unit && <small>{product.unit}</small>}
                  </td>
                  <td>
                    <span className={`status-pill ${product.status}`}>{product.status}</span>
                    {!product.in_stock && <span className="status-pill out">out of stock</span>}
                  </td>
                  <td className="row-actions">
                    <button type="button" onClick={() => openEdit(product)}>Edit</button>
                    <button type="button" onClick={() => togglePublished(product)}>
                      {product.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button type="button" className="danger" onClick={() => deleteProduct(product)}>
                      Delete
                    </button>
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

      {formOpen && (
        <ProductForm
          key={editing?.id ?? 'new'}
          product={editing}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

export default Products
