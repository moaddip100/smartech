import React from 'react'

export default function AdminHeader() {
  return (
    <header className="admin-header" role="banner">
      <div className="admin-header__inner">
        <div className="admin-header__brand" onClick={() => (window.location.hash = '#/admin')} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (window.location.hash = '#/admin')}>
          <span className="admin-header__logo">SMARTECH Admin</span>
        </div>
        <nav className="admin-header__nav" aria-label="Admin navigation">
          <a href="#/admin" className="admin-header__link">Dashboard</a>
          <a href="#/admin#products" className="admin-header__link">Products</a>
          <a href="#/admin#categories" className="admin-header__link">Categories</a>
        </nav>
      </div>
    </header>
  )
}
