import React from 'react'

export default function AdminFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="admin-footer">
      <div className="admin-footer__inner">
        <p className="admin-footer__copy">Admin Panel • © {year} Smartech</p>
        <div className="admin-footer__links">
          <a href="#/" className="admin-footer__link">Go to site</a>
        </div>
      </div>
    </footer>
  )
}
