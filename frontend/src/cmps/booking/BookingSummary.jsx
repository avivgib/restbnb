/* eslint react/prop-types: 0 */
import { format, isSameMonth } from 'date-fns'

export function BookingSummary({ stay, bookingDetails }) {
  // Add partial payment to BookingSummary
  // export function BookingSummary({ stay, bookingDetails, paymentOption, partialNow, partialLater, partialDueDate }) {

  function calculateNights(checkin, checkout) {
    if (!checkin || !checkout) return 0
    const checkinDate = new Date(checkin)
    const checkoutDate = new Date(checkout)
    if (isNaN(checkinDate) || isNaN(checkoutDate)) return 0
    const diffTime = Math.abs(checkoutDate - checkinDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights(bookingDetails.checkin, bookingDetails.checkout)
  const pricePerNight = bookingDetails.pricePerNight || 0
  const cleaningFee = bookingDetails.cleaningFee || 0
  const serviceFee = bookingDetails.serviceFee || 0
  const taxes = stay.taxes || 0

  const total = pricePerNight * nights + cleaningFee + serviceFee + taxes

  // if user didn't choose any guests - change adults from 0 to 1
  if (+bookingDetails.numberOfAdults === 0) {
    bookingDetails.numberOfAdults = 1
  }

  function formatDateRange(checkin, checkout) {
    if (!checkin || !checkout) return 'No dates selected'

    const checkinDate = new Date(checkin)
    const checkoutDate = new Date(checkout)

    if (isNaN(checkinDate) || isNaN(checkoutDate)) {
      return 'Invalid dates'
    }

    const checkinYear = checkinDate.getFullYear()
    const checkoutYear = checkoutDate.getFullYear()
    const isSameYear = checkinYear === checkoutYear

    const sameMonth = isSameMonth(checkinDate, checkoutDate)

    const checkinFormatted = format(checkinDate, 'MMM d')
    const checkoutFormatted = sameMonth
      ? format(checkoutDate, 'd')
      : format(checkoutDate, 'MMM d')

    return isSameYear
      ? `${checkinFormatted} – ${checkoutFormatted}, ${checkinYear}`
      : `${checkinFormatted}, ${checkinYear} – ${checkoutFormatted}, ${checkoutYear}`
  }

  var displayCurrency = '$';

  switch (bookingDetails.guestCurrency) {
    case '₪':
      displayCurrency = 'ILS';
      break;
    case '$':
      displayCurrency = 'USD';
      break;
    default:
      displayCurrency = bookingDetails.guestCurrency; // fallback to the original currency code
  }

  return (
    <section className='booking-summary'>
      <div className='summary-header'>
        <img src={stay.imgUrls?.[0]} alt='Stay preview' className='summary-thumbnail' />
        <div className='summary-info'>
          <h3>{stay.name}</h3>
          <p>
            {/* {stay.loc?.city} •{' '} */}
            <span className='rating'>
              ★{/* <img src="/img/star.png" className="review-star"/> */}
              {stay.rating?.toFixed(2) || '4.9'} ({stay.hostStats?.totalReviews || 82})
            </span>{' '}
            • <span className='guest-favorite'>Guest favorite</span>
          </p>
        </div>
      </div>

      <p className='free-cancellation'>
        Free cancellation
        {/* <br /> */}
      </p>
      <p className='cancel-before'>
        Cancel before {getCancellationDate(bookingDetails.checkin)} for a full refund.{' '}
        <a href='#' className='full-policy'>
          Full Policy
        </a>
      </p>

      <div className='trip-details'>
        <h4>Trip details</h4>
        <p>
          {/* {bookingDetails.checkin} - {bookingDetails.checkout} */}
          <p>{formatDateRange(bookingDetails.checkin, bookingDetails.checkout)}</p>

          {/* {formatDate(bookingDetails.checkin).slice(4)} - {formatDate(bookingDetails.checkout).slice(4)} */}
        </p>
        <p>
          {/* {bookingDetails.numberOfAdults} adults, {bookingDetails.numberOfInfants} infants */}
          {bookingDetails.numberOfAdults} {bookingDetails.numberOfAdults === 1 ? 'adult' : 'adults'}
          {bookingDetails.numberOfChildren > 0 && `, ${bookingDetails.numberOfChildren} ${bookingDetails.numberOfChildren === 1 ? 'child' : 'children'}`}
          {bookingDetails.numberOfInfants > 0 && `, ${bookingDetails.numberOfInfants} ${bookingDetails.numberOfInfants === 1 ? 'infant' : 'infants'}`}
          {bookingDetails.numberOfPets > 0 && `, ${bookingDetails.numberOfPets} ${bookingDetails.numberOfPets === 1 ? 'pet' : 'pets'}`}
        </p>
      </div>

      <div className='price-details'>
        <h4>Price details</h4>
        <ul className='price-breakdown'>
          <li>
            <span>
              {bookingDetails.guestCurrency}{pricePerNight} x {nights} nights
            </span>
            <span>{bookingDetails.guestCurrency}{(pricePerNight * nights).toFixed(2)}</span>
          </li>
          <li>
            <span>Cleaning fee</span>
            <span>{bookingDetails.guestCurrency}{cleaningFee.toFixed(2)}</span>
          </li>
          <li>
            <span>Airbnb service fee</span>
            <span>{bookingDetails.guestCurrency}{serviceFee.toFixed(2)}</span>
          </li>
          <li>
            <span>Taxes</span>
            <span>{bookingDetails.guestCurrency}{taxes.toFixed(2)}</span>
          </li>
          <li className='total'>
            <span>
              <span className='label'>Total </span> <span className='currency'>{displayCurrency}</span>
            </span>
            <span className='total-number'>{bookingDetails.guestCurrency}{total.toFixed(2)}</span>
          </li>
        </ul>
        {/* Add partial payment to BookingSummary */}
        {/* {paymentOption === 'partial' && (
  <div className="partial-summary">
    <div className="partial-summary-left">
      <div className="summary-label">Due today</div>
      <div className="summary-label">Charge on {partialDueDate}</div>
    </div>
    <div className="partial-summary-right">
      <div className="summary-amount">₪{Number(partialNow || 0).toFixed(2)}</div>
      <div className="summary-amount">₪{Number(partialLater || 0).toFixed(2)}</div>
    </div>
  </div>
)} */}
      </div>
    </section>
  )
}

function getCancellationDate(checkinDateStr) {
  const checkinDate = new Date(checkinDateStr)
  checkinDate.setDate(checkinDate.getDate() - 1)

  // convert date format from 1969-12-31 to Dec 31, 1969:
  const now = new Date()
  const showYear = checkinDate.getFullYear() !== now.getFullYear()
  const options = {
    month: 'short',
    day: 'numeric',
    ...(showYear && { year: 'numeric' }),
  }

  return checkinDate.toLocaleDateString('en-US', options)

  // return checkinDate.toISOString().split('T')[0]
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toDateString()
}