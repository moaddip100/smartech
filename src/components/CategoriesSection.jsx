import React from 'react'

export default function CategoriesSection() {
  return (
    <section className="categories-section">
      <div className="container">
        <div className="sidebar">
          <ul>
            <li><a href="#section-building" style={{ fontWeight: 'bold' }}>Building materials</a></li>
            <li><span className="category-inactive" aria-disabled="true">thermal insulation</span></li>
            <li><span className="category-inactive" aria-disabled="true">waterproofing</span></li>
            <li><a href="#section-ppe" style={{ fontWeight: 'bold' }}>PPE (Personal Protective Equipment)</a></li>
            <li><span className="category-inactive" aria-disabled="true">professional cleaning chemicals</span></li>
          </ul>
        </div>
        <div className="cards">
          <div id="section-building" className="prev-text">
            <h2>Text1</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam blanditiis consequuntur quod?</p>
          </div>
          <div className="prev-text">
            <h2>Text2</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam blanditiis consequuntur quod?</p>
          </div>
          <div className="prev-text">
            <h2>Text3</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam blanditiis consequuntur quod?</p>
          </div>
        </div>
      </div>
    </section>
  )
}
