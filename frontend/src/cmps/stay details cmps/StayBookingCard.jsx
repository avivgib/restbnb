import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import DynamicGradientButton from '../DynamicGradientButton.jsx'
import { format } from 'date-fns'

export const StayBookingCard = ({
  stayId,
  pricePerNight = 0,
  cleaningFee = 0,
  serviceFee = 0,
  discounts = { weekly: 0, monthly: 0 },
  minNights = 1,
  maxNights = 14,
  currency = '$',
  checkInDate,
  checkOutDate,
  guests,
  setGuests,
}) => {
  const navigate = useNavigate()

  const hasCheckInOnly = !!checkInDate && !checkOutDate
  const hasSelectedDates = !!checkInDate && !!checkOutDate
  const [isWhoModalOpen, setIsWhoModalOpen] = useState(false)
  const [guestCount, setGuestCount] = useState(1)
  const whoRef = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      console.log('Click detected outside:', e.target)
      if (whoRef.current && !whoRef.current.contains(e.target) && !e.target.closest('.guests-cell')) {
        console.log('Closing modal due to outside click')
        setIsWhoModalOpen(false)
      }
    }
    if (isWhoModalOpen) {
      console.log('Modal is open, adding event listener')
      document.addEventListener('pointerdown', handleClickOutside)
    }
    return () => {
      console.log('Removing event listener')
      document.removeEventListener('pointerdown', handleClickOutside)
    }
  }, [isWhoModalOpen])

  const nights = hasSelectedDates ? Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)) : 0

  const total = pricePerNight * nights + cleaningFee + serviceFee

  function onReserveClick() {
    if (!stayId) return

    const formatDate = (date) => (date ? format(new Date(date), 'yyyy-MM-dd') : '')

    const queryParams = new URLSearchParams({
      check_in: formatDate(checkInDate),
      check_out: formatDate(checkOutDate),
      adults: guests.adults || 1,
      children: guests.children || 0,
      infants: guests.infants || 0,
      pets: guests.pets || 0,
      price_per_night: pricePerNight || 0,
      cleaning_fee: cleaningFee || 0,
      service_fee: serviceFee || 0,
      currency: currency || 'USD',
    }).toString()

    navigate(`/stay/${stayId}/booking?${queryParams}`)
  }

  const updateGuestCount = (delta) => {
    const newCount = Math.max(1, guestCount + delta)
    setGuestCount(newCount)
  }

  const updateModalGuestCount = (type, delta) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }))
    // Update total guestCount based on adults + children
    setGuestCount((prev) => Math.max(1, prev + (delta > 0 ? 1 : -1) * (type === 'adults' || type === 'children' ? 1 : 0)))
  }

  const closeModal = () => {
    setIsWhoModalOpen(false)
  }

  // Function to format the guest count text with singular/plural
  const formatGuestCount = () => {
    const totalGuests = guests.adults + guests.children
    const totalInfants = guests.infants
    const totalPets = guests.pets

    const getPlural = (count, singular, plural) => (count === 1 ? singular : plural)

    let result = ''
    if (totalGuests > 0) {
      result += `${totalGuests} ${getPlural(totalGuests, 'guest', 'guests')}`
    }
    if (totalInfants > 0) {
      result += `${result ? ', ' : ''}${totalInfants} ${getPlural(totalInfants, 'infant', 'infants')}`
    }
    if (totalPets > 0) {
      result += `${result ? ', ' : ''}${totalPets} ${getPlural(totalPets, 'pet', 'pets')}`
    }
    return result || '1 guest' // Default to '1 guest' if no counts
  }

  return (
    <section className='stay-booking-card'>
      {hasSelectedDates ? (
        <>
          <div className='booking-header'>
            <div className='price-row'>
              <span className='price'>
                {currency}
                {pricePerNight}
              </span>
              &nbsp;
              <span className='per-night'> night</span>
            </div>
          </div>

          <div className='booking-inputs'>
            <div className='date-inputs'>
              <div className='date-cell'>
                <label>CHECK-IN</label>
                <span>{checkInDate ? format(new Date(checkInDate), 'd/M/yyyy') : 'Add date'}</span>
              </div>
              <div className='date-cell'>
                <label>CHECKOUT</label>
                <span>{checkOutDate ? format(new Date(checkOutDate), 'd/M/yyyy') : 'Add date'}</span>
              </div>
            </div>

            {/* <div className="guests-cell" onClick={() => { console.log('Toggling modal, isWhoModalOpen:', !isWhoModalOpen); setIsWhoModalOpen(!isWhoModalOpen); }}> */}
            <div
              className={`guests-cell ${isWhoModalOpen ? 'active' : ''}`}
              onClick={() => {
                console.log('Toggling modal, isWhoModalOpen:', !isWhoModalOpen)
                setIsWhoModalOpen(!isWhoModalOpen)
              }}
            >
              <label>GUESTS</label>
              <span className='guest-count'>{formatGuestCount()}</span>
              {/* <span className="arrow"><img src="/img/arrow-down.png" className="arrow-down" alt="arrow-down"/></span> */}
              <span className='arrow'>
                <img src={`/img/${isWhoModalOpen ? 'arrow-up' : 'arrow-down'}.png`} className='arrow-down' alt={isWhoModalOpen ? 'arrow-up' : 'arrow-down'} />
              </span>

              {isWhoModalOpen && (
                <div className='booking-who-modal' ref={whoRef} onClick={(e) => e.stopPropagation()}>
                  {console.log('Rendering modal, ref:', whoRef.current)}
                  {[
                    { label: 'Adults', desc: 'Ages 13+', type: 'adults' },
                    { label: 'Children', desc: 'Ages 2-12', type: 'children' },
                    { label: 'Infants', desc: 'Under 2', type: 'infants' },
                    { label: 'Pets', desc: <a href='#'>Bringing a service animal?</a>, type: 'pets' },
                  ].map(({ label, desc, type }) => (
                    <div className='booking-guest-row' key={type}>
                      <div className='booking-guest-info'>
                        <div className='booking-label'>{label}</div>
                        <div className='booking-desc'>{desc}</div>
                      </div>
                      <div className='booking-guest-controls'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateModalGuestCount(type, -1)
                          }}
                        >
                          -
                        </button>
                        <span>{guests[type]}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateModalGuestCount(type, 1)
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className='modal-close-button'
                    onClick={(e) => {
                      e.stopPropagation()
                      closeModal()
                    }}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>

          <DynamicGradientButton onClick={onReserveClick}>Reserve</DynamicGradientButton>
          <p className='charge-note'>You won't be charged yet</p>

          <div className='breakdown'>
            <div className='row'>
              <span>
                {currency}
                {pricePerNight} x {nights} nights
              </span>
              <span>
                {currency}
                {pricePerNight * nights}
              </span>
            </div>
            <div className='row'>
              <span>Cleaning fee</span>
              <span>
                {currency}
                {cleaningFee}
              </span>
            </div>
            <div className='row'>
              <span>Airbnb service fee</span>
              <span>
                {currency}
                {serviceFee}
              </span>
            </div>
            <hr />
            <div className='row total'>
              <span>Total</span>
              <span>
                {currency}
                {total}
              </span>
            </div>
          </div>
        </>
      ) : hasCheckInOnly ? (
        <>
          <div className='no-dates-header'>Add dates for prices</div>

          <div className='booking-inputs'>
            <div className='date-inputs'>
              <div className='date-cell'>
                <label>CHECK-IN</label>
                <span>{checkInDate ? format(new Date(checkInDate), 'd/M/yyyy') : 'Add date'}</span>
              </div>
              <div className='date-cell'>
                <label>CHECKOUT</label>
                <span className='placeholder'>Add date</span>
              </div>
            </div>

            {/* <div className="guests-cell" onClick={() => { console.log('Toggling modal, isWhoModalOpen:', !isWhoModalOpen); setIsWhoModalOpen(!isWhoModalOpen); }}> */}
            <div
              className={`guests-cell ${isWhoModalOpen ? 'active' : ''}`}
              onClick={() => {
                console.log('Toggling modal, isWhoModalOpen:', !isWhoModalOpen)
                setIsWhoModalOpen(!isWhoModalOpen)
              }}
            >
              <label>GUESTS</label>
              <span className='guest-count'>{formatGuestCount()}</span>
              <span className='arrow'>▾</span>
              {isWhoModalOpen && (
                <div className='booking-who-modal' ref={whoRef}>
                  {console.log('Rendering modal, ref:', whoRef.current)}
                  {[
                    { label: 'Adults', desc: 'Ages 13 or above', type: 'adults' },
                    { label: 'Children', desc: 'Ages 2-12', type: 'children' },
                    { label: 'Infants', desc: 'Under 2', type: 'infants' },
                    { label: 'Pets', desc: <a href='#'>Bringing a service animal?</a>, type: 'pets' },
                  ].map(({ label, desc, type }) => (
                    <div className='booking-guest-row' key={type}>
                      <div className='booking-guest-info'>
                        <div className='booking-label'>{label}</div>
                        <div className='booking-desc'>{desc}</div>
                      </div>
                      <div className='booking-guest-controls'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateModalGuestCount(type, -1)
                          }}
                        >
                          -
                        </button>
                        <span>{guests[type]}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateModalGuestCount(type, 1)
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className='modal-close-button'
                    onClick={(e) => {
                      e.stopPropagation()
                      closeModal()
                    }}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>

          <DynamicGradientButton onClick={onReserveClick}>Check availability</DynamicGradientButton>
        </>
      ) : (
        <>
          <div className='no-dates-header'>Add dates for prices</div>
          <div className='booking-inputs'>
            <div className='date-inputs'>
              <div className='date-cell'>
                <label>CHECK-IN</label>
                <span className='placeholder'>Add date</span>
              </div>
              <div className='date-cell'>
                <label>CHECKOUT</label>
                <span className='placeholder'>Add date</span>
              </div>
            </div>
            {/* <div className="guests-cell" onClick={() => { console.log('Toggling modal, isWhoModalOpen:', !isWhoModalOpen); setIsWhoModalOpen(!isWhoModalOpen); }}> */}
            <div
              className={`guests-cell ${isWhoModalOpen ? 'active' : ''}`}
              onClick={() => {
                console.log('Toggling modal, isWhoModalOpen:', !isWhoModalOpen)
                setIsWhoModalOpen(!isWhoModalOpen)
              }}
            >
              <label>GUESTS</label>
              <span className='guest-count'>{formatGuestCount()}</span>
              <span className='arrow'>▾</span>
              {isWhoModalOpen && (
                <div className='booking-who-modal' ref={whoRef}>
                  {console.log('Rendering modal, ref:', whoRef.current)}
                  {[
                    { label: 'Adults', desc: 'Ages 13 or above', type: 'adults' },
                    { label: 'Children', desc: 'Ages 2-12', type: 'children' },
                    { label: 'Infants', desc: 'Under 2', type: 'infants' },
                    { label: 'Pets', desc: <a href='#'>Bringing a service animal?</a>, type: 'pets' },
                  ].map(({ label, desc, type }) => (
                    <div className='booking-guest-row' key={type}>
                      <div className='booking-guest-info'>
                        <div className='booking-label'>{label}</div>
                        <div className='booking-desc'>{desc}</div>
                      </div>
                      <div className='booking-guest-controls'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateModalGuestCount(type, -1)
                          }}
                        >
                          -
                        </button>
                        <span>{guests[type]}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateModalGuestCount(type, 1)
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    className='modal-close-button'
                    onClick={(e) => {
                      e.stopPropagation()
                      closeModal()
                    }}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>

          <DynamicGradientButton onClick={onReserveClick}>Check availability</DynamicGradientButton>
        </>
      )}
    </section>
  )
}
