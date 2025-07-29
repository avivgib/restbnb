/* eslint react/prop-types: 0 */

export const StaySummary = ({ type, location, capacity, bedrooms, beds, bathrooms, rating, reviewCount, onShowReviews }) => {
  const displayType = type || 'Apartment'
  const displayLocation = location || 'Unknown location'
  const displayCapacity = capacity || 2
  const displayBedrooms = bedrooms || 1
  const displayBeds = beds || 1
  const displayBathrooms = bathrooms || 1
  // const displayRating = rating?.toFixed(2) || '4.5'
  const displayRating = (typeof rating === 'number')
  ? (Number.isInteger(rating) ? `${rating}.0`
    : rating % 1 === 0 ? `${rating.toFixed(1)}`
    : rating.toFixed(2).replace(/0$/, ''))
  : '4.5';

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


  const displayReviewCount = reviewCount || 0

  return (
    <section className='stay-summary'>
  <h2 className='stay-summary-title'>
    {displayType} in {displayLocation}
  </h2>

  <p className='stay-summary-details'>
    {displayCapacity} guest{displayCapacity !== 1 ? 's' : ''} ·
    {' '}{displayBedrooms} bedroom{displayBedrooms !== 1 ? 's' : ''} ·
    {' '}{displayBeds} bed{displayBeds !== 1 ? 's' : ''} ·
    {' '}{displayBathrooms} bath{displayBathrooms !== 1 ? 's' : ''}
  </p>

  <div className='stay-summary-rating'>
    <span className='rating-star'>★</span>
    <span className='rating-score'>{displayRating}</span>
    <span className='dot-divider'>·</span>
    {/* <button className='stay-reviews-btn' onClick={() => onShowReviews?.(true)}> */}
    <button className='stay-reviews-btn' onClick={() => scrollToId('reviews')}>
      {displayReviewCount} review{displayReviewCount !== 1 ? 's' : ''}
    </button>
  </div>
</section>
  )
}
