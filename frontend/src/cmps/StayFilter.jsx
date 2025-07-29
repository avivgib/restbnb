import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DayPicker } from 'react-day-picker'
import { loadStays } from '../store/stay.actions.js'
import { stayService } from '../services/stay/index.js'
import { useLocation } from 'react-router-dom'
import 'react-day-picker/dist/style.css'
import '../assets/styles/cmps/AppHeader.scss'

export function StayFilter({ isSmallerSearchBar, onMiniSearchClick, expandTrigger, clearExpandTrigger, searchState, setSearchState, filterBy, onSetFilter }) {
  const popularDestinations = [
    // {name:"Nearby, ", desc: "Find what's around you", icon: "/img/default suggestions/nearby.png", },
    { name: 'Paris, France', desc: 'For its bustling nightlife', icon: '/img/default suggestions/paris.png' },
    { name: 'Prague, Czech Republic', desc: 'For a trip abroad', icon: '/img/default suggestions/prague.png' },
    { name: 'Rome, Italy', desc: 'For sights like Trevi fountain', icon: '/img/default suggestions/rome.png' },
    { name: 'Sofia, Bulgaria', desc: 'For sights like Alexander Nevski Cathedral', icon: '/img/default suggestions/sofia.png' },
    { name: 'Tel-Aviv Yafo, Israel', desc: 'Popular beach destination', icon: '/img/default suggestions/telaviv-yafo.png' },
    { name: 'Valencia, Spain', desc: 'Popular beach destination', icon: '/img/default suggestions/valencia.png' },
    { name: 'Vienna, Austria', desc: 'For its stunning architecture', icon: '/img/default suggestions/vienna.png' },
    { name: 'Athens, Greece', desc: 'For sights like Acropolis of Athens', icon: '/img/default suggestions/athens.png' },
    { name: 'Barcelona, Spain', desc: 'Popular beach destination', icon: '/img/default suggestions/barcelona.png' },
    { name: 'Belgrade, Serbia', desc: 'For its stunning architecture', icon: '/img/default suggestions/belgrade.png' },
    { name: 'Berlin, Germany', desc: 'For its bustling nightlife', icon: '/img/default suggestions/berlin.png' },
    { name: 'Bucharest, Romania', desc: 'For sights like Cismigiu Gardens', icon: '/img/default suggestions/telaviv-yafo.png' },
    { name: 'Budapest, Hungary', desc: 'For its stunning architecture', icon: '/img/default suggestions/budapest.png' },
    { name: 'Eilat, Israel', desc: 'Popular beach destination', icon: '/img/default suggestions/eilat.png' },
    { name: 'Jerusalem, Israel', desc: 'for its top-notch dining', icon: '/img/default suggestions/jerusalem.png' },
    { name: 'Krakov, Poland', desc: 'Popular with travelers near you', icon: '/img/default suggestions/krakov.png' },
    { name: 'Lisbon, Portugal', desc: 'For its bustling nightlife', icon: '/img/default suggestions/lisbon.png' },
    { name: 'London, United Kingdom', desc: 'For its bustling nightlife', icon: '/img/default suggestions/london.png' },
    { name: 'Madrid, Spain', desc: 'For a trip abroad', icon: '/img/default suggestions/madrid.png' },
    { name: 'Milan, Italy', desc: 'For its bustling nightlife', icon: '/img/default suggestions/milan.png' },
  ]

  const [showWhereModal, setShowWhereModal] = useState(false)

  const searchBarRef = useRef()
  const calendarRef = useRef()
  const checkInRef = useRef()
  const checkOutRef = useRef()
  const whoRef = useRef()
  const whereInputRef = useRef()

  const [isDateModalOpen, setIsDateModalOpen] = useState(false)
  const [selectedDateField, setSelectedDateField] = useState(null)

  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isWhoModalOpen, setIsWhoModalOpen] = useState(false)

  const [checkInDate1, setCheckInDate1] = useState(null)
  const [checkOutDate1, setCheckOutDate1] = useState(null)
  const [whereInput1, setWhereInput1] = useState('')
  const [guestCounts1, setGuestCounts1] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  })

  const location = useLocation()
  const pathname = location.pathname
  const isStayResults = pathname.startsWith('/stay/results')

  const navigate = useNavigate()

  // keep search bar values
  const { checkInDate, checkOutDate, whereInput, guestCounts } = searchState

  // X search bar clear button:
  const clearWhere = (e) => {
    e.stopPropagation()
    setSearchState((prev) => ({ ...prev, whereInput: '' }))
  }

  const clearCheckIn = (e) => {
    e.stopPropagation()
    setSearchState((prev) => ({ ...prev, checkInDate: null }))
  }

  const clearCheckOut = (e) => {
    e.stopPropagation()
    setSearchState((prev) => ({ ...prev, checkOutDate: null }))
  }

  const clearGuests = (e) => {
    e.stopPropagation()
    setSearchState((prev) => ({
      ...prev,
      guestCounts: { adults: 0, children: 0, infants: 0, pets: 0 },
    }))
  }

  //expand on click on smaller search bar:
  useEffect(() => {
    if (!expandTrigger) return

    // fix click on mini search button when header collapsed:
    if (expandTrigger === 'where') {
      setIsSearchFocused(true)
      setSelectedDateField(null)
      setIsWhoModalOpen(false)
      whereInputRef.current?.focus()
      if (!whereInput.trim()) setShowWhereModal(true)
    } else if (expandTrigger === 'checkin') {
      setIsSearchFocused(true)
      setSelectedDateField('checkin')
      setIsDateModalOpen(true)
    } else if (expandTrigger === 'who') {
      setIsSearchFocused(true)
      setSelectedDateField(null)
      setIsWhoModalOpen(true)
    } else if (expandTrigger === 'none') {
      // ❌ don't activate/focus anything
      setIsSearchFocused(false)
      setSelectedDateField(null)
      setIsWhoModalOpen(false)
      setShowWhereModal(false)
    }

    clearExpandTrigger?.()
  }, [expandTrigger])

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickInsideDateFields = checkInRef.current?.contains(e.target) || checkOutRef.current?.contains(e.target)
      const isClickInsideCalendar = calendarRef.current?.contains(e.target)
      const isClickInsideSearchBar = searchBarRef.current?.contains(e.target)

      const isClickInsideWhereField = whereInputRef.current?.contains(e.target) || e.target.closest('.where-modal')
      if (!isClickInsideWhereField) {
        setShowWhereModal(false)
      }

      const isClickInsideWhoModal = whoRef.current?.contains(e.target) || e.target.closest('.who-modal')

      if (!isClickInsideDateFields && !isClickInsideCalendar) {
        setIsDateModalOpen(false)
        setSelectedDateField(null)
      }

      if (!isClickInsideWhoModal) {
        setIsWhoModalOpen(false)
      }

      if (!isClickInsideSearchBar) {
        setIsSearchFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFocus = () => setIsSearchFocused(true)

  const updateGuestCount = (type, delta) => {
    // keep search bar values
    setSearchState((prev) => {
      const updated = {
        ...prev.guestCounts,
        [type]: Math.max(0, prev.guestCounts[type] + delta),
      }

      if (delta > 0 && (type === 'children' || type === 'infants' || type === 'pets') && updated.adults === 0) {
        updated.adults = 1
      }

      if (type === 'adults' && delta < 0 && updated.adults === 0 && (updated.children > 0 || updated.infants > 0 || updated.pets > 0)) {
        return prev
      }

      return {
        ...prev,
        guestCounts: updated,
      }
    })
  }

  const handleDateClick = (date) => {
    if (selectedDateField === 'checkin') {
      // when user selects a check-in date after the selected check-out date.
      if (checkOutDate && date > checkOutDate) {
        setSearchState((prev) => ({
          ...prev,
          checkInDate: date,
          checkOutDate: null,
        }))
        setSelectedDateField('checkout')
      } else {
        setSearchState((prev) => ({
          ...prev,
          checkInDate: date,
        }))
        setSelectedDateField('checkout')
      }
    } else if (selectedDateField === 'checkout') {
      // when user selectsa check-out date before the selected check-in date
      if (checkInDate && date < checkInDate) {
        setSearchState((prev) => ({
          ...prev,
          checkInDate: date,
          checkOutDate: null,
        }))
        setSelectedDateField('checkout')
      } else {
        setSearchState((prev) => ({
          ...prev,
          checkOutDate: date,
        }))
        setSelectedDateField('checkout') // Keep calendar open
      }
    }
  }

  function applyLocationFilter(stays, locationStr) {
    if (!locationStr) return stays

    const search = locationStr.toLowerCase().trim()

    return stays.filter((stay) => {
      const { loc } = stay
      if (!loc) return false

      return loc.city?.toLowerCase().includes(search) || loc.country?.toLowerCase().includes(search) || loc.address?.toLowerCase().includes(search)
    })
  }

  async function handleSearch() {
    const validGuestCounts = {
      adults: Number(guestCounts.adults) || 0,
      children: Number(guestCounts.children) || 0,
      infants: Number(guestCounts.infants) || 0,
      pets: Number(guestCounts.pets) || 0,
    }

    const filter = {
      location: 'rome',
      checkIn: checkInDate ? checkInDate.toISOString() : null,
      checkOut: checkOutDate ? checkOutDate.toISOString() : null,
      guests: validGuestCounts,
    }

    try {
      const allStays = await stayService.query()
      const filteredStays = applyLocationFilter(allStays, filter.location)
      console.log('Filtered stays:', filteredStays)

      onSetFilter({ ...filter, filteredStays })
      const queryParams = new URLSearchParams(filter).toString()

      navigate(`/stay/results?${queryParams}`, { state: { filterBy: filter, filteredStays } })
    } catch (err) {
      console.error('Failed to load stays', err)
    }
  }

  return (
    <div className={`app-header__search-bar ${isSmallerSearchBar ? 'smaller' : 'expanded'} ${isSearchFocused ? 'focused' : ''}`} ref={searchBarRef}>
      {isSmallerSearchBar ? (
        // expand on click on the smaller search bar:
        <div className='mini-search-bar'>
          <div className='mini-search-section with-icon' onClick={() => onMiniSearchClick?.('where')}>
            <img src='/img/homes0.png' alt='Homes' />
            {/* <span>Anywhere</span> */}
            <span>{isStayResults ? 'Homes in Rome' : 'Anywhere'}</span>
          </div>
          <div className='mini-divider'></div>
          <div className='mini-search-section' onClick={() => onMiniSearchClick?.('checkin')}>
            {/* <span>Anytime</span> */}
            <span>{isStayResults ? 'Jul 4-7' : 'Anytime'}</span>
          </div>
          <div className='mini-divider'></div>
          <div className='mini-search-section' onClick={() => onMiniSearchClick?.('who')}>
            {/* <span>Add guests</span> */}
            <span>{isStayResults ? '4 guests' : 'Add guests'}</span>
          </div>
          <button className='mini-search-button' onClick={() => onMiniSearchClick?.('none')}>
            <img src='/img/magnifying-glass.png' alt='Search' />
          </button>
        </div>
      ) : (
        <>
          {/* Expanded version starts here */}

          <div
            // className={`search-input where ${isSearchFocused && !selectedDateField && !isWhoModalOpen ? 'active' : 'inactive'}`}
            className={`search-input where no-divider ${isSearchFocused && !selectedDateField && !isWhoModalOpen ? 'active' : 'inactive'}`}
            onClick={() => {
              setIsSearchFocused(true)
              setSelectedDateField(null)
              setIsWhoModalOpen(false)
              whereInputRef.current?.focus()
            }}
          >
            <span>Where</span>
            <input
              ref={whereInputRef}
              type='text'
              value={whereInput}
              // keep search bar values
              onChange={(e) => {
                const value = e.target.value
                setSearchState((prev) => ({ ...prev, whereInput: value }))
                setShowWhereModal(!value.trim())
              }}
              onFocus={() => {
                setIsSearchFocused(true)
                setSelectedDateField(null)
                setIsWhoModalOpen(false)
                if (!whereInput.trim()) setShowWhereModal(true)
              }}
              placeholder='Search destinations'
              className={whereInput ? 'has-text' : ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSelectedDateField('checkin')
                  setIsDateModalOpen(true)
                  setIsSearchFocused(true)
                }
              }}
            />

            {/* X clear button */}
            {whereInput && isSearchFocused && !selectedDateField && !isWhoModalOpen && (
              // <button className="clear-btn" onClick={clearWhere}>&times;</button>
              <button className='clear-btn where' onClick={clearWhere}>
                <img src='/img/close.png' />
              </button>
            )}
          </div>

          <div
            className={`search-input checkin ${selectedDateField === 'checkin' ? 'active' : isSearchFocused ? 'inactive' : ''}`}
            ref={checkInRef}
            onClick={() => {
              setSelectedDateField('checkin')
              setIsDateModalOpen(true)
              setIsSearchFocused(true)
            }}
          >
            <span>Check in</span>
            {/* <div className="static-input"> */}
            {/*  */}
            <div className={`static-input ${checkInDate ? 'has-text' : ''}`}>
              {/* X clear button */}
              {checkInDate && selectedDateField === 'checkin' && (
                // <button className="clear-btn" onClick={clearCheckIn}>&times;</button>
                <button className='clear-btn' onClick={clearCheckIn}>
                  <img src='/img/close.png' />
                </button>
              )}

              {checkInDate ? checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Add dates'}
            </div>
          </div>

          <div
            className={`search-input checkout ${selectedDateField === 'checkout' ? 'active' : isSearchFocused ? 'inactive' : ''}`}
            ref={checkOutRef}
            onClick={() => {
              setSelectedDateField('checkout')
              setIsDateModalOpen(true)
              setIsSearchFocused(true)
            }}
          >
            <span>Check out</span>
            {/* <div className="static-input"> */}
            <div className={`static-input ${checkOutDate ? 'has-text' : ''}`}>
              {/* X clear button */}
              {checkOutDate && selectedDateField === 'checkout' && (
                // <button className="clear-btn" onClick={clearCheckOut}>&times;</button>
                <button className='clear-btn' onClick={clearCheckOut}>
                  <img src='/img/close.png' />
                </button>
              )}

              {checkOutDate ? checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Add dates'}
            </div>
          </div>

          <div
            // className={`search-input who no-divider ${isWhoModalOpen ? 'active' : isSearchFocused ? 'inactive' : ''}`}
            className={`search-input who ${isWhoModalOpen ? 'active' : isSearchFocused ? 'inactive' : ''}`}
            ref={whoRef}
            onClick={() => {
              if (isWhoModalOpen) {
                // If already open, close the modal
                setIsWhoModalOpen(false)
                setIsSearchFocused(false)
              } else {
                // Open the modal and ensure the search bar stays focused
                setIsWhoModalOpen(true)
                setIsSearchFocused(true)
              }

              // isSearchFocused debugging:
              console.log('isWhoModalOpen: ', isWhoModalOpen)
              console.log('isSearchFocused: ', isSearchFocused)
              setSelectedDateField(null)
            }}
          >
            <span>Who</span>
            <div className={`static-input ${guestCounts.adults + guestCounts.children + guestCounts.infants + guestCounts.pets > 0 ? 'has-text' : ''}`}>
              {guestCounts.adults + guestCounts.children + guestCounts.infants + guestCounts.pets > 0 && isWhoModalOpen && (
                // <button className="clear-btn who" onClick={clearGuests}>&times;</button>
                <button className='clear-btn who' onClick={clearGuests}>
                  <img src='/img/close.png' />
                </button>
              )}

              {(() => {
                const { adults, children, infants, pets } = guestCounts
                const totalAdults = adults + children
                const parts = []

                if (totalAdults > 0) parts.push(`${totalAdults} ${totalAdults === 1 ? 'adult' : 'adults'}`)
                if (infants > 0) parts.push(`${infants} ${infants === 1 ? 'infant' : 'infants'}`)
                if (pets > 0) parts.push(`${pets} ${pets === 1 ? 'pet' : 'pets'}`)

                const fullText = parts.length > 0 ? parts.join(', ') : 'Add guests'
                return fullText.length > 17 ? fullText.slice(0, 17).trimEnd() + '…' : fullText
              })()}
            </div>
          </div>

          <button className={`search-button ${isSearchFocused ? 'expanded' : ''}`} onClick={handleSearch}>
            <img src='/img/magnifying-glass.png' alt='Search' />
            <span>Search</span>
          </button>

          {isWhoModalOpen && (
            <div className='who-modal'>
              {[
                { label: 'Adults', desc: 'Ages 13 or above', type: 'adults' },
                { label: 'Children', desc: 'Ages 2 - 12', type: 'children' },
                { label: 'Infants', desc: 'Under 2', type: 'infants' },
                { label: 'Pets', desc: <a href='#'>Bringing a service animal?</a>, type: 'pets' },
              ].map(({ label, desc, type }) => (
                <div className='guest-row' key={type}>
                  <div className='guest-info'>
                    <div className='label'>{label}</div>
                    <div className='desc'>{desc}</div>
                  </div>
                  <div className='guest-controls'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateGuestCount(type, -1)
                      }}
                    >
                      -
                    </button>
                    <span>{guestCounts[type]}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateGuestCount(type, 1)
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isDateModalOpen && (
            <div className='date-modal' ref={calendarRef}>
              <DayPicker
                mode='single'
                selected={
                  checkInDate && checkOutDate
                    ? { from: checkInDate, to: checkOutDate }
                    : checkInDate
                    ? { from: checkInDate, to: checkInDate }
                    : checkOutDate
                    ? { from: checkOutDate, to: checkOutDate }
                    : undefined
                }
                onSelect={handleDateClick}
                numberOfMonths={2}
                fromMonth={new Date()}
                navLayout='around'
                // disable past dates:
                disabled={{ before: new Date() }}
                className='rdp-root'
              />
            </div>
          )}

          {showWhereModal && (
            <div className='where-modal'>
              <div className='modal-section-title'>Suggested destinations</div>
              <div className='destination-section'>
                {popularDestinations.map((dest) => (
                  // fix suggested destinations modal response to destination selection
                  <div
                    className='destination-row'
                    key={dest.name}
                    onClick={() => {
                      setSearchState((prev) => ({ ...prev, whereInput: dest.name }))
                      setShowWhereModal(false)
                      setSelectedDateField('checkin')
                      setIsDateModalOpen(true)
                      setIsSearchFocused(true)
                    }}
                  >
                    <img src={dest.icon} alt={dest.name} className='destination-icon' />
                    <div className='destination-info'>
                      <div className='destination-name'>{dest.name}</div>
                      <div className='destination-desc'>{dest.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
