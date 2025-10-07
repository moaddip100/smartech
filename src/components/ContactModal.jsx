import React, { useState } from 'react'

export default function ContactModal({ open, onClose }) {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    whatsapp: '',
    subject: '',
    notes: ''
  })
  const [touched, setTouched] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setValues(v => ({ ...v, [name]: value }))
  }

  function handleBlur(e) {
    setTouched(t => ({ ...t, [e.target.name]: true }))
  }

  function validate() {
    const errs = {}
    if (!values.firstName.trim()) errs.firstName = 'Required'
    if (!values.lastName.trim()) errs.lastName = 'Required'
    if (!values.company.trim()) errs.company = 'Required'
    if (!values.email.trim()) errs.email = 'Required'
    if (!values.whatsapp.trim()) errs.whatsapp = 'Required'
    if (!values.subject.trim()) errs.subject = 'Required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setTouched(Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {}))
      return
    }
    // For now just print to console and close
    console.log('Contact form submitted', values)
    onClose()
    alert('Thank you! Your message was submitted.')
  }

  if (!open) return null

  const errs = validate()

  return (
    <div className="contact-modal-backdrop" role="dialog" aria-modal="true">
      <div className="contact-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h3>Contact supplier</h3>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="row two">
            <label>
              First name *
              <input name="firstName" value={values.firstName} onChange={handleChange} onBlur={handleBlur} />
              {touched.firstName && errs.firstName ? <div className="err">{errs.firstName}</div> : null}
            </label>
            <label>
              Last name *
              <input name="lastName" value={values.lastName} onChange={handleChange} onBlur={handleBlur} />
              {touched.lastName && errs.lastName ? <div className="err">{errs.lastName}</div> : null}
            </label>
          </div>

          <label>
            Company name *
            <input name="company" value={values.company} onChange={handleChange} onBlur={handleBlur} />
            {touched.company && errs.company ? <div className="err">{errs.company}</div> : null}
          </label>

          <label>
            Work e-mail address *
            <input name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
            {touched.email && errs.email ? <div className="err">{errs.email}</div> : null}
          </label>

          <label>
            WhatsApp number *
            <input name="whatsapp" value={values.whatsapp} onChange={handleChange} onBlur={handleBlur} />
            {touched.whatsapp && errs.whatsapp ? <div className="err">{errs.whatsapp}</div> : null}
          </label>

          <label>
            Subject *
            <input name="subject" value={values.subject} onChange={handleChange} onBlur={handleBlur} />
            {touched.subject && errs.subject ? <div className="err">{errs.subject}</div> : null}
          </label>

          <label>
            Additional notes (optional)
            <textarea name="notes" value={values.notes} onChange={handleChange} />
          </label>

          <div className="modal-actions">
            <button type="submit" className="btn btn-orange">Submit</button>
            <button type="button" className="btn btn-white" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
