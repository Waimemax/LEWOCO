
import { useState } from 'react'
import './ContactSection.css'

function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    setSubmitted(true)

    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    })
  }

  return (
    <section className="contact-section" id="contact">

      <div className="contact-heading">
        <span className="contact-label">GET IN TOUCH</span>

        <h2>
          Let's Start a <span>Conversation</span>
        </h2>

        <p>
          Have a question or want to learn more about LEWOCO?
          Send us an enquiry or reach out through our contact details.
          We would be happy to hear from you.
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
              Together, we can build stronger communities.
            </h3>

            <p>
              Connect with LEWOCO to learn about our work,
              programmes and opportunities to participate
              in community development.
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
            <div className="form-success">
              Your enquiry has been validated successfully.
              Form submission to LEWOCO will be enabled when
              we connect the Laravel backend.
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>

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
                <option value="Programmes">Programmes</option>
                <option value="Membership">Membership</option>
                <option value="Partnership">Partnership</option>
                <option value="Training">Training Opportunities</option>
                <option value="Other">Other</option>
              </select>
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
            </div>

            <button type="submit" className="contact-submit-button">
              Submit Enquiry <span>→</span>
            </button>

          </form>

        </div>

      </div>
    </section>
  )
}

export default ContactSection
