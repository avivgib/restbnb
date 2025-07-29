import { useEffect, useState } from 'react'

import DynamicGradientButton from '../DynamicGradientButton.jsx'

  export function StayScrollNav({ price, rating, reviewCount, checkInDate, checkOutDate }) {
  const [showNav, setShowNav] = useState(false)
  const [showRightContent, setShowRightContent] = useState(false)
  const hasDates = !!checkInDate && !!checkOutDate
  

  useEffect(() => {
    const galleryEl = document.querySelector('.stay-gallery')
    const cardEl = document.querySelector('.stay-booking-card')

    const galleryObserver = new IntersectionObserver(
      ([entry]) => setShowNav(!entry.isIntersecting),
      { threshold: 0 }
    )

    const cardObserver = new IntersectionObserver(
      ([entry]) => setShowRightContent(!entry.isIntersecting),
      { threshold: 0 }
    )

    if (galleryEl) galleryObserver.observe(galleryEl)
    if (cardEl) cardObserver.observe(cardEl)

    return () => {
      galleryObserver.disconnect()
      cardObserver.disconnect()
    }
  }, [])

  const scrollToId = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const el = document.getElementById(id)
      if (el) {
        const offset = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top: offset, behavior: 'smooth' })
      }
    }
  }

  const handleCheckClick = () => {
    const el = document.querySelector('.stay-booking-card .date-cell')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function onReserveClick() {
    if (!stayId) return
    navigate(`/stay/${stayId}/booking`)
  }

  return (
    <nav className={`stay-scroll-nav ${showNav ? 'visible' : ''}`}>
      <div className="scroll-nav-inner">
        <ul className="nav-links">
          <li onClick={() => scrollToId('top')}>Photos</li>
          <li onClick={() => scrollToId('amenities')}>Amenities</li>
          <li onClick={() => scrollToId('reviews')}>Reviews</li>
          <li onClick={() => scrollToId('location')}>Location</li>
        </ul>

        {showRightContent && (
          <div className="nav-right">
            <div className="info">
              <div className="top-line">
                {hasDates ? (
                  <span className="price">{price} <span className="night">night</span></span>
                ) : (
                  <span className="placeholder">Add dates for prices</span>
                )}
              </div>
              <div className="bottom-line">
                <img src="/img/star.png" alt="star" />
                <span className="rating">{rating}</span>
                <span className="dot">·</span>
                <span className="review-count">{reviewCount} reviews</span>
              </div>
            </div>
            {/* <button
              className="nav-btn"
              onClick={hasDates ? () => alert('TODO: Navigate to checkout') : handleCheckClick}
            >
              {hasDates ? 'Reserve' : 'Check availability'}
            </button> */}
            {/* <DynamicGradientButton onClick={hasDates ? onReserveClick : handleCheckClick}>{hasDates ? 'Reserve' : 'Check availability'}</DynamicGradientButton> */}
            <DynamicGradientButton onClick={hasDates ? handleCheckClick : handleCheckClick}>{hasDates ? 'Reserve' : 'Check availability'}</DynamicGradientButton>
          </div>
        )}
      </div>
    </nav>
  )
}
