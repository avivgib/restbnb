/* eslint react/prop-types: 0 */
import { useState, useEffect } from 'react'

export function BookingPaymentOptions({ guestCurrency, totalPrice, checkinDate, onPaymentOptionChange }) {
// Add partial payment to BookingSummary
  // export function BookingPaymentOptions({
  //   totalPrice,
  //   checkinDate,
  //   onPaymentOptionChange,
  //   setPartialNow,
  //   setPartialLater,
  //   setPartialDueDate,
  //   partialNow,
  //   partialLater,
  //   partialDueDate
  // }) {
  const [paymentOption, setPaymentOption] = useState('full')
// Add partial payment to BookingSummary - replace consts below with parameters in export function
  const [partialNow, setPartialNow] = useState(0)
  const [partialLater, setPartialLater] = useState(0)
  const [partialDueDate, setPartialDueDate] = useState('')


  // Add partial payment to BookingSummary - move this to BookingOrderPage
  useEffect(() => {
    calculatePartialPayment()
  }, [totalPrice, checkinDate])

  // Add partial payment to BookingSummary - move this function to BookingOrderPage
  function calculatePartialPayment() {
    const partialNowVal = totalPrice / 6
    const partialLaterVal = totalPrice - partialNowVal

    setPartialNow(partialNowVal)
    setPartialLater(partialLaterVal)

    const checkin = new Date(checkinDate)
    checkin.setDate(checkin.getDate() - 7)
    const formattedDate = checkin.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    setPartialDueDate(formattedDate)
  }

  function handleChange(option) {
    setPaymentOption(option)
    onPaymentOptionChange(option) // מעדכנים את ה־Order Page
  }

  var displayCurrency = '$';

switch (guestCurrency) {
  case 'ILS':
    displayCurrency = '₪';
    break;
  case 'USD':
    displayCurrency = '$';
    break;
  default:
    displayCurrency = guestCurrency; // fallback to the original currency code
}

  return (
    <section className='payment-options'>
      <h3>Choose when to pay</h3>

      <div className={`payment-option ${paymentOption === 'full' ? 'selected' : ''}`} onClick={() => handleChange('full')}>
        <div className='payment-option-header'>
          <div className="payment-label">
          <span>Pay {displayCurrency}{Number(totalPrice || 0).toFixed(2)} now</span>
          </div>
          {/* <div className='radio-circle'>{paymentOption === 'full' && <div className='radio-dot' />}</div> */}

<img
    src={`/img/${paymentOption === 'full' ? 'radio-selected' : 'radio-unselected'}.png`}
    alt="payment method selection"
    className="radio-image"
  />
          
        </div>
      </div>

      <div className={`payment-option ${paymentOption === 'partial' ? 'selected' : ''}`} onClick={() => handleChange('partial')}>
        <div className='payment-option-header'>
          <div className="payment-label">
          <span>Pay part now, part later</span>
          </div>
          {/* <div className='radio-circle'>{paymentOption === 'partial' && <div className='radio-dot' />}</div> */}

<img
    src={`/img/${paymentOption === 'partial' ? 'radio-selected' : 'radio-unselected'}.png`}
    alt="payment method selection"
    className="radio-image"
  />

        </div>
        <p className='partial-details'>
        {displayCurrency}{Number(partialNow || 0).toFixed(2)} now, {displayCurrency}{Number(partialLater || 0).toFixed(2)} charged on {partialDueDate}. No extra fees. <a href='#' className='more-info'>More info</a>
          
        </p>
      </div>
    </section>
  )
}
