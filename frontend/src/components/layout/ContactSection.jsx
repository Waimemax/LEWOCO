
import { useState } from 'react'
import './ContactSection.css'

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  website: '', // hidden spam trap: real visitors leave it empty
}

function ContactSection() {
  const [formData, setFormData] = useState(emptyForm)

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setSubmitted(false)
    setErrorMessage('')
    setFieldErrors({})
    setSubmitting(true)

    try {
      const response = await fetch('/api/public/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          website: formData.website,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 422) {
        setFieldErrors(data.errors || {})
        setErrorMessage('Please check the highlighted details and try again.')
        return
      }

      if (response.status === 429) {
        setErrorMessage(
          'You have sent several enquiries recently. Please wait a few minutes, or contact LEWOCO by phone or email.'
        )
        return
      }

      if (!response.ok) throw new Error('Request failed')

      setSubmitted(true)
      setFormData(emptyForm)
    } catch {
      setErrorMessage(
        'We could not send your enquiry. Please try again, or contact LEWOCO directly using the details provided.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="contact-section" id="contact">

      <div className="contact-heading">
        <span className="contact-label">GET IN TOUCH</span>

        <h2>
          Let's Start a <span>Conversation</span>
        </h2>

        <p>
  Are you interested in LEWOCO's work, membership,
  women-led enterprises, handmade woven crafts or youth
  development? Get in touch with us. We welcome enquiries
  from individuals, communities and potential partners.
</p>
      </div>

      <div className="contact-content">

        {/* Contact Information */}

        <div className="contact-information">

          <div className="contact-item">
            <div className="contact-icon">✉</div>

            <div>
              <h3>Email Address</h3>
              <a href="mailto:info@lewocomcultd.co.ke">
                info@lewocomcultd.co.ke
              </a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">☎</div>

            <div>
              <h3>Phone Numbers</h3>
              <a href="tel:+254722937900">
                +254 722 937900
              </a>
              <a href="tel:+254722494037">
                +254 722 494037
              </a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">⌖</div>

            <div>
              <h3>Our Location</h3>
              <p>Masii, Machakos County, Kenya</p>
            </div>
          </div>

          <div className="contact-message">
            <span className="contact-message-label">
              WE ARE HERE TO CONNECT
            </span>

           <h3>
  Empowering women and youth for a sustainable future.
</h3>

<p>
  Connect with LEWOCO to learn about our initiatives,
  membership opportunities, enterprise development
  and creative skills programmes across Lower Eastern Kenya.
</p>
          </div>

        </div>

        {/* Enquiry Form */}

        <div className="contact-form-container">

          <div className="contact-form-heading">
            <h3>Send Us an Enquiry</h3>
            <p>
              Fill in the form below and let us know how we can help.
            </p>
          </div>

          {submitted && (
            <div className="form-success" role="status">
              Thank you. Your enquiry has been received and LEWOCO
              will get back to you as soon as possible.
            </div>
          )}

          {errorMessage && (
            <div className="form-error" role="alert">
              {errorMessage}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>

            {/* Spam trap: hidden from people, often filled in by bots */}
            <div className="form-trap" aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex="-1"
                autoComplete="off"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              {fieldErrors.full_name && (
                <small className="form-field-error">{fieldErrors.full_name[0]}</small>
              )}
            </div>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.email && (
                  <small className="form-field-error">{fieldErrors.email[0]}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+254 7XX XXX XXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.phone && (
                  <small className="form-field-error">{fieldErrors.phone[0]}</small>
                )}
              </div>

            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select an enquiry subject</option>
<option value="General Enquiry">General Enquiry</option>
<option value="Membership">Membership</option>
<option value="Women-Led Enterprise">Women-Led Enterprise</option>
<option value="Handmade Woven Crafts">Handmade Woven Crafts</option>
<option value="Youth Beading">Youth Beading & Creative Skills</option>
<option value="Sustainable Livelihoods">Sustainable Livelihoods</option>
<option value="Partnership">Partnership Opportunities</option>
<option value="Other">Other</option>
              </select>
              {fieldErrors.subject && (
                <small className="form-field-error">{fieldErrors.subject[0]}</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Write your enquiry here..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              {fieldErrors.message && (
                <small className="form-field-error">{fieldErrors.message[0]}</small>
              )}
            </div>

            <button
              type="submit"
              className="contact-submit-button"
              disabled={submitting}
            >
              {submitting ? 'Sending…' : 'Submit Enquiry'} <span>→</span>
            </button>

          </form>

        </div>

      </div>
    </section>
  )
}

export default ContactSection
