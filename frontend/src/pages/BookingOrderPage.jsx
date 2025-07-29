import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { stayService } from '../services/stay/'
import { orderService } from '../services/orders'
import { userService } from '../services/user'
import { showErrorMsg } from '../services/event-bus.service.js'
import { makeId } from '../services/util.service.js'

import { BookingPaymentOptions } from '../cmps/booking/BookingPaymentOptions.jsx'
import { BookingPaymentMethod } from '../cmps/booking/BookingPaymentMethod.jsx'
import { BookingMessageHost } from '../cmps/booking/BookingMessageHost.jsx'
import { BookingSummary } from '../cmps/booking/BookingSummary.jsx'
import { BookingHeader } from '../cmps/booking/BookingHeader.jsx'
import { AirbnbLoader } from '../cmps/AirbnbLoader.jsx'
// import { AppModal } from '../cmps/stay details cmps/AppModal.jsx'
import { BookingModal } from '../cmps/booking/BookingModal.jsx'
import DynamicGradientButton from '../cmps/DynamicGradientButton.jsx'
import { socketService, SOCKET_EMIT_ORDER_SEND } from '../services/socket.service.js'

import { AppFooter } from '../cmps/AppFooter'


export function BookingOrderPage() {
  const { stayId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const stayFromNav = location.state?.stay

  const [stay, setStay] = useState(null)
  const [messageToHost, setMessageToHost] = useState('')
  const [paymentOption, setPaymentOption] = useState('full')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [orderToSave, setOrderToSave] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const availableMethods = [
    { type: 'mastercard', last4: '9865' },
    { type: 'visa', last4: '4685' },
    { type: 'credit', label: 'Credit or debit card' },
    { type: 'googlepay', label: 'Google Pay' },
  ]
  const [selectedMethod, setSelectedMethod] = useState(availableMethods[0])

  const searchParams = new URLSearchParams(location.search)
  const checkInFromURL = searchParams.get('check_in') || ''
  const checkOutFromURL = searchParams.get('check_out') || ''
  const adultsFromURL = parseInt(searchParams.get('adults')) || 1
  const childrenFromURL = parseInt(searchParams.get('children')) || 0
  const infantsFromURL = parseInt(searchParams.get('infants')) || 0
  const petsFromURL = parseInt(searchParams.get('pets')) || 0
  const pricePerNightFromURL = parseFloat(searchParams.get('price_per_night')) || 0
  const cleaningFeeFromURL = parseFloat(searchParams.get('cleaning_fee')) || 0
  const serviceFeeFromURL = parseFloat(searchParams.get('service_fee')) || 0
  const currencyFromURL = searchParams.get('currency') || 'USD'

  const [bookingDetails, setBookingDetails] = useState({
    checkin: checkInFromURL,
    checkout: checkOutFromURL,
    numberOfAdults: adultsFromURL,
    numberOfChildren: childrenFromURL,
    numberOfInfants: infantsFromURL,
    numberOfPets: petsFromURL,
    pricePerNight: pricePerNightFromURL,
    cleaningFee: cleaningFeeFromURL,
    serviceFee: serviceFeeFromURL,
    guestCurrency: currencyFromURL,
    isWorkTrip: false,
  })

  useEffect(() => {
    loadStay()
  }, [stayId])

  useEffect(() => {
    if (stayFromNav) {
      setStay(stayFromNav)
    } else {
      loadStay()
    }

    setBookingDetails((prev) => ({
      ...prev,
      checkin: checkInFromURL ? new Date(checkInFromURL).toISOString().slice(0, 10) : prev.checkin,
      checkout: checkOutFromURL ? new Date(checkOutFromURL).toISOString().slice(0, 10) : prev.checkout,
      numberOfAdults: adultsFromURL,
      numberOfChildren: childrenFromURL,
      numberOfInfants: infantsFromURL,
      numberOfPets: petsFromURL,
      pricePerNight: pricePerNightFromURL,
      cleaningFee: cleaningFeeFromURL,
      serviceFee: serviceFeeFromURL,
      guestCurrency: currencyFromURL,
    }))
  }, [stayId, location.search])

  async function loadStay() {
    try {
      const stay = await stayService.getById(stayId)
      setStay(stay)
    } catch (err) {
      console.error('Failed to load stay', err)
      showErrorMsg('Failed to load stay')
    }
  }

  function onConfirmBooking() {
    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) {
      showErrorMsg('You must be logged in to book.')
      return
    }

    const nights = calculateNights(bookingDetails.checkin, bookingDetails.checkout)
    const pricePerNight = bookingDetails.pricePerNight
    const cleaningFee = bookingDetails.cleaningFee
    const serviceFee = bookingDetails.serviceFee
    const nightsSubtotal = pricePerNight * nights
    const taxes = 0
    const total = nightsSubtotal + cleaningFee + serviceFee + taxes

    const order = {
      stayId: stay._id,
      hostId: stay.host._id,
      userId: loggedinUser._id,
      checkin: bookingDetails.checkin,
      checkout: bookingDetails.checkout,
      guests: {
        adults: bookingDetails.numberOfAdults,
        children: bookingDetails.numberOfChildren,
        infants: bookingDetails.numberOfInfants,
        pets: bookingDetails.numberOfPets,
        total: bookingDetails.numberOfAdults + bookingDetails.numberOfChildren + bookingDetails.numberOfInfants + bookingDetails.numberOfPets,
      },
      totalNights: nights,
      pricePerNight,
      priceDetails: {
        nightsSubtotal,
        cleaningFee,
        serviceFee,
        taxes,
        total,
      },
      currency: bookingDetails.guestCurrency,
      paymentOption,
      paymentMethod: selectedMethod,
      paymentStatus: 'pending',
      messageToHost,
      createdAt: Date.now(),
      status: 'pending',
      cancellationPolicy: 'moderate',
      orderCode: `ORD-${makeId(8)}`,
      orderIdAirbnb: `AIRBNB-${makeId(8)}`,
      photoId: stay.imgUrls?.[0] || 'no-photo',
      isWorkTrip: bookingDetails.isWorkTrip,
    }

    setOrderToSave(order)
    setIsConfirmModalOpen(true)
  }

  async function onFinalApprove() {
    try {
      const savedOrder = await orderService.save(orderToSave)
      // Send order request to the host 
      socketService.emit(SOCKET_EMIT_ORDER_SEND, {
        order: savedOrder,
        hostId: savedOrder.hostId
      })
      setIsConfirmModalOpen(false)
      setIsSuccess(true)
    } catch (err) {
      showErrorMsg('An error occurred while submitting the order')
      console.error('Order save failed:', err)
    }
  }

  function calculateNights(checkin, checkout) {
    const checkinDate = new Date(checkin)
    const checkoutDate = new Date(checkout)
    const diffTime = Math.abs(checkoutDate - checkinDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  function calculateTotalPrice() {
    if (!bookingDetails.checkin || !bookingDetails.checkout) return 0
    const nights = calculateNights(bookingDetails.checkin, bookingDetails.checkout)
    const base = bookingDetails.pricePerNight * nights
    const cleaning = bookingDetails.cleaningFee || 0
    const service = bookingDetails.serviceFee || 0
    return base + cleaning + service
  }

  if (!stay) return <AirbnbLoader />

  const displaySelectedMethod = selectedMethod.type.charAt(0).toUpperCase() + selectedMethod.type.slice(1).toLowerCase()

  var checkin = new Date(bookingDetails.checkin)
  var displayBookingCheckInDate = checkin.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  var checkout = new Date(bookingDetails.checkout)
  var displayBookingCheckOutDate = checkout.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  var displayOrderCheckInDate = '';
  var displayOrderCheckOutDate = '';
  if (orderToSave?.checkin && orderToSave?.checkout) {
    var checkin = new Date(orderToSave.checkin)
    var displayOrderCheckInDate = checkin.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })


    var checkout = new Date(orderToSave.checkout)
    var displayOrderCheckOutDate = checkout.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  var displayCurrency = '$';

  switch (bookingDetails.guestCurrency) {
    case 'ILS':
      displayCurrency = '₪';
      break;
    case 'USD':
      displayCurrency = '$';
      break;
    default:
      displayCurrency = bookingDetails.guestCurrency; // fallback to the original currency code
  }


  return (
    <section className='booking-order-page'>
      <div className="booking-main-container">
        <div className='header'>
          <BookingHeader />
        </div>

        <div className='booking-main-block'>
          <div className='back-button-container'>
            <button className='back-btn' onClick={() => window.history.back()}>
              <span className='arrow-icon'>
                <img src='/img/back-arrow.png' alt='back-arrow' />
              </span>
            </button>
          </div>

          <div className='right'>
            <div className='headline'>
              <h1>Confirm and Pay</h1>
            </div>

            <div className='booking-main-content'>
              <div className='main-content'>
                <div className='booking-payment-options'>
                  <BookingPaymentOptions guestCurrency={bookingDetails.guestCurrency} totalPrice={calculateTotalPrice()} checkinDate={bookingDetails.checkin} onPaymentOptionChange={setPaymentOption} />
                </div>
                <div className='booking-payment-method'>
                  <BookingPaymentMethod selectedMethod={selectedMethod} onMethodChange={setSelectedMethod} />
                </div>
                <div className='booking-message-host'>
                  <BookingMessageHost host={stay.host} onMessageChange={setMessageToHost} />
                </div>
                <div className='booking-terms'>
                  By clicking the button, I agree to the <a href='#'>booking terms</a>.
                </div>
                <DynamicGradientButton onClick={onConfirmBooking}>Confirm and Pay</DynamicGradientButton>
              </div>

              <aside className='summary-sidebar'>
                <BookingSummary stay={stay} bookingDetails={bookingDetails} />
              </aside>
            </div>
          </div>
        </div>

        {isConfirmModalOpen && (
          // <AppModal
          <BookingModal className="booking-modal"
            onClose={() => {
              setIsConfirmModalOpen(false)
            }}
          >
            <h2>One Last Step</h2>
            <p>Dear guest, please confirm your booking details to complete your reservation.</p>
            <div className="main-content">
              <div className="left-col">
                <p>
                  <span className="label">Check-In: </span>
                  {/* <span className="content">{bookingDetails.checkin}</span> */}
                  <span className="content">{displayBookingCheckInDate}</span>
                </p>
                <p>
                  <span className="label">Check-Out: </span>
                  {/* <span className="content">{bookingDetails.checkout}</span> */}
                  <span className="content">{displayBookingCheckOutDate}</span>
                </p>
                <p>
                  <span className="label">Guests: </span>
                  {/* <span className="content">{orderToSave?.guests?.total}</span> */}
                  <span className="content">{bookingDetails.numberOfAdults} {bookingDetails.numberOfAdults === 1 ? 'adult' : 'adults'}
                    {bookingDetails.numberOfChildren > 0 && `, ${bookingDetails.numberOfChildren} ${bookingDetails.numberOfChildren === 1 ? 'child' : 'children'}`}
                    {bookingDetails.numberOfInfants > 0 && `, ${bookingDetails.numberOfInfants} ${bookingDetails.numberOfInfants === 1 ? 'infant' : 'infants'}`}
                    {bookingDetails.numberOfPets > 0 && `, ${bookingDetails.numberOfPets} ${bookingDetails.numberOfPets === 1 ? 'pet' : 'pets'}`}</span>
                </p>
                <p>
                  <span className="label">Total Price: </span>
                  {/* <span className="content">{orderToSave?.priceDetails?.total} {bookingDetails.guestCurrency}</span> */}
                  <span className="content">{displayCurrency}{orderToSave?.priceDetails?.total} </span>
                </p>
                <p>
                  <span className="label">Payment Option: </span>
                  <span className="content">{paymentOption === 'full' ? 'Pay in Full' : 'Pay Part Now, Part Later'}</span>
                </p>
                <p>
                  <span className="label">Payment Method: </span>
                  {/* <span className="content">**** **** **** {selectedMethod.last4 || '----'}</span> */}
                  <span className="content">{displaySelectedMethod} {selectedMethod.last4 || '----'}</span>
                </p>
              </div>
              <div className="right-col">
                <img src={stay.imgUrls?.[0]} alt='Stay preview' className='stay-image-modal' />
              </div>

            </div>
            {/* <div className="modal-actions" style={{ marginTop: '1em', display: 'flex', gap: '1em' }}> */}
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setIsConfirmModalOpen(false)}>Cancel</button>
              {/* <button className="confirm-btn" onClick={onFinalApprove}>Confirm</button> */}
              <DynamicGradientButton onClick={onFinalApprove}>Confirm</DynamicGradientButton>
            </div>
          </BookingModal>
        )}

        {isSuccess && (
          // <AppModal onClose={() => navigate('/')}>
          <BookingModal onClose={() => navigate('/')}>
            <h2>Reservation complete!</h2>
            <p>Your booking is currently pending approval by your host.</p>
            <div className="main-content">

              <div className="left-col">

                <p>
                  <span className="label">Check-In: </span>
                  {/* <span className="content">{bookingDetails.checkin}</span> */}
                  <span className="content">{displayOrderCheckInDate}</span>
                </p>
                <p>
                  <span className="label">Check-Out: </span>
                  {/* <span className="content">{bookingDetails.checkout}</span> */}
                  <span className="content">{displayOrderCheckOutDate}</span>
                </p>
                <p>
                  <span className="label">Guests: </span>
                  {/* <span className="content">{orderToSave?.guests?.total}</span> */}
                  <span className="content">{bookingDetails.numberOfAdults} {bookingDetails.numberOfAdults === 1 ? 'adult' : 'adults'}
                    {bookingDetails.numberOfChildren > 0 && `, ${bookingDetails.numberOfChildren} ${bookingDetails.numberOfChildren === 1 ? 'child' : 'children'}`}
                    {bookingDetails.numberOfInfants > 0 && `, ${bookingDetails.numberOfInfants} ${bookingDetails.numberOfInfants === 1 ? 'infant' : 'infants'}`}
                    {bookingDetails.numberOfPets > 0 && `, ${bookingDetails.numberOfPets} ${bookingDetails.numberOfPets === 1 ? 'pet' : 'pets'}`}</span>

                </p>
                <p>
                  <span className="label">Total Price: </span>
                  {/* <span className="content">{orderToSave?.priceDetails?.total} {bookingDetails.guestCurrency}</span> */}
                  <span className="content">{displayCurrency}{orderToSave?.priceDetails?.total} </span>
                </p>
                <p>
                  <span className="label">Payment Option: </span>
                  <span className="content">{paymentOption === 'full' ? 'Pay in Full' : 'Pay Part Now, Part Later'}</span>
                </p>
                <p>
                  <span className="label">Payment Method: </span>
                  {/* <span className="content">**** **** **** {selectedMethod.last4 || '----'}</span> */}
                  <span className="content">{displaySelectedMethod} {selectedMethod.last4 || '----'}</span>

                </p>
              </div>
              <div className="right-col">
                <img src={stay.imgUrls?.[0]} alt='Stay preview' className='stay-image-modal' />
              </div>

            </div>
            {/* <div className="modal-actions" style={{ marginTop: '1em', display: 'flex', gap: '1em' }}> */}
            <div className="modal-actions">

              {/* <DynamicGradientButton onClick={() => navigate('/')}>Back to home</DynamicGradientButton> */}
              <button className="home-btn" onClick={() => navigate('/')}>Back to home</button>
              <DynamicGradientButton onClick={() => navigate('/user/orders')}>View my reservations</DynamicGradientButton>
            </div>
          </BookingModal>
        )}
      </div>
      <AppFooter />
    </section>
  )
}