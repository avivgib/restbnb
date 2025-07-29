import { Link } from 'react-router-dom'
import { SvgIcon } from './SvgIcon'

const THIN = '\u2009'
const DASH = '–'

export function RoomPreview({ stay, searchDates }) {
  const suggestedCheckIn = searchDates?.checkIn || stay.availability?.suggestedDates?.checkIn
  const suggestedCheckOut = searchDates?.checkOut || stay.availability?.suggestedDates?.checkOut

  if (!stay || !stay._id) {
    return null // Prevent rendering if stay is invalid
  }

  function formatDateRange(checkInStr, checkOutStr) {
    const options = { month: 'short', day: 'numeric' }
    const formattedStartDate = new Date(checkInStr)
    const formattedEndDate = new Date(checkOutStr)

    const sameMonth = formattedStartDate.getMonth() === formattedEndDate.getMonth()
    const startMonth = formattedStartDate.toLocaleDateString('en-US', { month: 'short' })
    const endMonth = formattedEndDate.toLocaleDateString('en-US', { month: 'short' })

    const startDay = formattedStartDate.getDate()
    const endDay = formattedEndDate.getDate()

    if (sameMonth) {
      return `${startMonth} ${startDay}${THIN}${DASH}${THIN}${endDay}`
    } else {
      return `${startMonth} ${startDay}${THIN}${DASH}${THIN}${endMonth} ${endDay}`
    }
  }

  const addOneDay = (date) => {
    if (!date) return null
    const result = new Date(date)
    result.setDate(result.getDate() + 1)
    return result
  }
  // stay.rating - how many decimal points to display?
  const displayRating =
    typeof stay?.rating === 'number'
      ? Number.isInteger(stay.rating)
        ? `${stay.rating}.0`
        : stay.rating % 1 === 0
        ? `${stay.rating.toFixed(1)}`
        : stay.rating.toFixed(2).replace(/0$/, '')
      : 'N/A'

  const formatToDateString = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  const checkIn = addOneDay(suggestedCheckIn)
  const checkOut = addOneDay(suggestedCheckOut)

  const queryParams = new URLSearchParams({
    check_in: formatToDateString(checkIn) || '',
    check_out: formatToDateString(checkOut) || '',
  }).toString()

  return (
    <Link to={`/rooms/${stay._id}?${queryParams}`}>
      <article className='stay-preview'>
        {/* Main Image */}
        {stay.imgUrls && stay.imgUrls.length > 0 ? (
          <div className='stay-image-container'>
            <img src={stay.imgUrls[0]} alt={stay.name || 'Stay image'} className='preview-image' />
            <button
              className='like-btn'
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <SvgIcon iconName='heart' />
            </button>
            {/* Change from stay.name to stay.guestFavorite */}
            {stay.rating > 4.9 && <button className='guest-favorite-btn'>Guest favorite</button>}
          </div>
        ) : (
          <div className='no-image'>No image available</div>
        )}

        <header>
          {/* Location */}
          {stay.loc && (
            <p className='location'>
              {stay.type} in {stay.loc.city}
            </p>
          )}
        </header>

        {/* Price */}
        {stay.price && stay.rating && (
          <div className='price-rating-container'>
            {stay.price && <span className='suggested-dates'>{formatDateRange(suggestedCheckIn, suggestedCheckOut)}</span>}
            <div className='price-rating-row'>
              <span className='price'>
                ${(stay.price * (stay.nights || 2)).toLocaleString()} for {stay.nights || 2} nights ·{' '}
              </span>
              {stay.rating && (
                // <span className="rating">★ {stay.rating}</span>
                <span className='rating'>★ {displayRating}</span>
              )}
            </div>
          </div>
        )}
      </article>
    </Link>
  )
}
