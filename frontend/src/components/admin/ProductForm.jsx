import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

function ProductForm({ product, onClose, onSaved }) {
  const editing = Boolean(product)

  const [form, setForm] = useState({
    name: product?.name ?? '',
    category: product?.category ?? '',
    description: product?.description ?? '',
    price: product?.price ?? '',
    unit: product?.unit ?? '',
    icon: product?.icon ?? '',
    in_stock: product ? product.in_stock : true,
    display_order: product?.display_order ?? '',
    status: product?.status ?? 'draft',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  // Photo: the chosen file is uploaded after the product itself is saved
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [removeImage, setRemoveImage] = useState(false)
  const [photoError, setPhotoError] = useState('')

  useEffect(() => {
    if (!file) {
      setPreview('')
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function handleFile(event) {
    const chosen = event.target.files?.[0]
    setPhotoError('')

    if (!chosen) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(chosen.type)) {
      setPhotoError('Please choose a JPG, PNG or WebP photo.')
      event.target.value = ''
      return
    }
    if (chosen.size > 2 * 1024 * 1024) {
      setPhotoError('The photo must be 2 MB or smaller. Try a smaller or compressed version.')
      event.target.value = ''
      return
    }

    setFile(chosen)
    setRemoveImage(false)
  }

  const shownImage = preview || (!removeImage ? product?.image_url : '')

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErrors({})
    setFormError('')
    setSaving(true)

    const body = {
      name: form.name,
      category: form.category.trim() === '' ? null : form.category.trim(),
      description: form.description,
      price: form.price === '' ? null : Number(form.price),
      unit: form.unit.trim() === '' ? null : form.unit.trim(),
      icon: form.icon.trim() === '' ? null : form.icon.trim(),
      in_stock: form.in_stock,
      status: form.status,
    }
    if (form.display_order !== '') body.display_order = Number(form.display_order)

    try {
      const data = editing
        ? await api(`/products/${product.id}`, { method: 'PUT', body })
        : await api('/products', { method: 'POST', body })

      // The product is saved; now handle the photo. A photo problem must not lose the product.
      let message = data.message
      try {
        if (file) {
          const upload = new FormData()
          upload.append('image', file)
          await api(`/products/${data.product.id}/image`, { method: 'POST', body: upload })
        } else if (removeImage && product?.image_url) {
          await api(`/products/${data.product.id}/image`, { method: 'DELETE' })
        }
      } catch (photoProblem) {
        const detail = photoProblem.errors?.image?.[0] || photoProblem.message
        message = `${data.message} The photo could not be saved: ${detail} Open Edit to try again.`
      }

      onSaved(message)
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
        aria-labelledby="product-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="product-form-title">{editing ? 'Edit Product' : 'Add a Product'}</h2>
            <p>Published products appear in the shop on the public website.</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="member-form" noValidate>
          {formError && <div className="members-alert error" role="alert">{formError}</div>}

          <div className="form-grid">
            <div className="field full">
              <label htmlFor="name">Product name *</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
              {field('name') && <small>{field('name')}</small>}
            </div>

            <div className="field full">
              <label htmlFor="description">Description *</label>
              <textarea id="description" name="description" rows="4" value={form.description} onChange={handleChange} required />
              {field('description') && <small>{field('description')}</small>}
            </div>

            <div className="field">
              <label htmlFor="price">Price (KES) *</label>
              <input id="price" name="price" type="number" min="1" step="1" value={form.price} onChange={handleChange} required />
              {field('price') && <small>{field('price')}</small>}
            </div>

            <div className="field">
              <label htmlFor="unit">Sold per</label>
              <input id="unit" name="unit" maxLength="60" placeholder="e.g. per basket, per jar" value={form.unit} onChange={handleChange} />
              {field('unit') && <small>{field('unit')}</small>}
            </div>

            <div className="field">
              <label htmlFor="category">Category</label>
              <input id="category" name="category" maxLength="100" placeholder="e.g. Handmade Crafts" value={form.category} onChange={handleChange} />
              {field('category') && <small>{field('category')}</small>}
            </div>

            <div className="field">
              <label htmlFor="icon">Icon (emoji)</label>
              <input id="icon" name="icon" maxLength="16" placeholder="e.g. 🧺" value={form.icon} onChange={handleChange} />
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
                <option value="published">Published (visible in the shop)</option>
              </select>
              {field('status') && <small>{field('status')}</small>}
            </div>

            <div className="field full">
              <label htmlFor="photo">Photo</label>
              {shownImage && (
                <div className="photo-preview">
                  <img src={shownImage} alt="Product preview" />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setFile(null)
                      setRemoveImage(true)
                    }}
                  >
                    Remove photo
                  </button>
                </div>
              )}
              <input id="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
              <span className="hint">JPG, PNG or WebP, up to 2 MB. A landscape photo works best. Without a photo, the emoji icon is shown.</span>
              {photoError && <small>{photoError}</small>}
              {field('image') && <small>{field('image')}</small>}
            </div>

            <div className="field full">
              <label className="check-row" htmlFor="in_stock">
                <input id="in_stock" name="in_stock" type="checkbox" checked={form.in_stock} onChange={handleChange} />
                <span>In stock (untick to show “Out of stock” and stop orders)</span>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm
