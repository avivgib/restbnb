import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { loadStay, addStayMsg } from '../store/stay.actions.js'
import { format } from 'date-fns'

import { StayDetailsHeader } from '../cmps/stay details cmps/StayDetailsHeader.jsx'
import { StayGallery } from '../cmps/stay details cmps/StayGallery.jsx'
import { StaySummary } from '../cmps/stay details cmps/StaySummary.jsx'
import { StayHighlights } from '../cmps/stay details cmps/StayHighlights.jsx'
import { StayDescription } from '../cmps/stay details cmps/StayDescription.jsx'
import { StayAmenities } from '../cmps/stay details cmps/StayAmenities.jsx'
import { StayPolicies } from '../cmps/stay details cmps/StayPolicies.jsx'
import { StayHostInfo } from '../cmps/stay details cmps/StayHostInfo.jsx'
import { StayAvailability } from '../cmps/stay details cmps/StayAvailability.jsx'
import { StayRatingsBreakdown } from '../cmps/stay details cmps/StayRatingsBreakdown.jsx'
import { StayReviews } from '../cmps/stay details cmps/StayReviews.jsx'
import { StayMapLocation } from '../cmps/stay details cmps/StayMapLocation.jsx'
import { StayBookingCard } from '../cmps/stay details cmps/StayBookingCard.jsx'
import { AppModal } from '../cmps/stay details cmps/AppModal.jsx'
import { AppHeader } from '../cmps/AppHeader.jsx'
import { StayScrollNav } from '../cmps/stay details cmps/StayScrollNav.jsx'
import { StayDetailsTopHeader } from '../cmps/stay details cmps/StayDetailsTopHeader.jsx'

import { AppFooter } from '../cmps/AppFooter.jsx'
import 'react-day-picker/dist/style.css'
import { AirbnbLoader } from '../cmps/AirbnbLoader.jsx'

export function StayDetail() {
  const [searchParams, setSearchParams] = useSearchParams()

  const { stayId } = useParams()
  const stay = useSelector((storeState) => storeState.stayModule.stay)

  // Initial default dates from suggested dates
  const [checkInDate, setCheckInDate] = useState(new Date('2025-07-04'))
  const [checkOutDate, setCheckOutDate] = useState(new Date('2025-07-07'))

  const [showReviewsModal, setShowReviewsModal] = useState(false)
  const [showDescriptionModal, setShowDescriptionModal] = useState(false)

  const [guests, setGuests] = useState({
    adults: 4,
    children: 0,
    infants: 1,
    pets: 1,
  })

  const DEFAULT_PARAMS = {
    check_in: '2025-07-04',
    check_out: '2025-07-07',
    adults: '4',
    children: '0',
    infants: '1',
    pets: '1',
  }

  useEffect(() => {
    const currentParams = Object.fromEntries([...searchParams])

    const hasAllParams = Object.entries(DEFAULT_PARAMS).every(([key, value]) => currentParams[key] === value)

    if (!hasAllParams) {
      setSearchParams(DEFAULT_PARAMS)
    }
  }, [])

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  function setShowReviews(show) {
    setShowReviewsModal(show)
  }

  const handleDateSelect = (range) => {
    setCheckInDate(range?.from || null)
    setCheckOutDate(range?.to || null)
    // console.log('Selected dates:', { checkInDate: range.from, checkOutDate: range.to })
  }

  // Pass review count from StayReviews to StaySumary
  const [effectiveReviewCount, setEffectiveReviewCount] = useState(stay?.reviews?.length || 0)

  if (!stay || !Array.isArray(stay.imgUrls) || stay.imgUrls.length === 0) {
    return <AirbnbLoader />
  }

  //consts for header info (next to the button)
  const rating = stay.rating || stay.hostStats?.avgRating || 4.99
  const price = `${stay.currency || '$'}${stay.pricePerNight || stay.price}`

  return (
    <section className='stay-details'>
      <div className='stay-details-main-container'>
        <StayScrollNav
          // hasDates={hasDates}
          price={price}
          rating={rating}
          // reviewCount={reviewCount}
          reviewCount={effectiveReviewCount} // Pass review count from StayReviews to StaySummary
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
        />

        <div className='header'>
          {/* <AppHeader /> */}
          <StayDetailsTopHeader />
        </div>

        <div className='stay-content-wrapper'>
          {/* <StayScrollNav/> */}
          <StayDetailsHeader stayName={stay.name} />
          <StayGallery imgGallery={stay.imgUrls?.map((url) => ({ url }))} />

          <section className='stay-main-content'>
            <div className='left-col'>
              <StaySummary
                type={stay.type}
                location={`${stay.loc?.city}, ${stay.loc?.country}`}
                capacity={stay.capacity}
                bedrooms={stay.bedrooms}
                beds={stay.beds}
                bathrooms={stay.bathrooms}
                rating={stay.rating || stay.hostStats?.avgRating}
                // reviewCount={stay.reviews?.length || 1}
                reviewCount={effectiveReviewCount} // Pass review count from StayReviews to StaySummary
                onShowReviews={setShowReviews}
              />

              <StayHighlights
                hostName={stay.host?.fullname}
                hostAvatar={stay.host?.imgUrl}
                isSuperhost={stay.host?.isSuperhost}
                hostYears={stay.hostStats?.yearsHosting || 1}
                highlights={[
                  {
                    icon: '/img/features/free-cancellation-before.png',
                    title: 'Free cancellation before Jul 23',
                    description: 'Get a full refund if you change your mind.',
                  },
                  {
                    icon: '/img/features/furry-friends-welcome.png',
                    title: 'Pet friendly',
                    description: 'Pets are welcome in this property.',
                  },
                  {
                    icon: '/img/features/great-for-remote-work.png',
                    title: 'Great for remote work',
                    description: 'Fast Wi-Fi and dedicated workspace.',
                  },
                ]}
              />
              <StayDescription
                descriptionText={stay.description || ''}
                spaceText={stay.spaceDescription || ''}
                onShowFullDescription={setShowDescriptionModal}
              />

              {/* <StayDescription descriptionText={stay.description || ''} spaceText={stay.spaceDescription || ''} onShowFullDescription={setShowDescriptionModal} /> */}

              {/* <StayAmenities amenities={stay.amenities} /> */}
              {/* <StayAmenities amenities={stay.amenities} id='amenities' /> */}
              <div id='amenities'>
                <StayAmenities amenities={stay.amenities} />
              </div>

              {/* <StayAvailability availability={stay.availability} /> */}
              <StayAvailability
                availability={stay.availability}
                onDateSelect={handleDateSelect}
                location={stay.loc?.city}
                minNights={stay.minNights}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
              />
            </div>

            <div className='right-col'>
              {/* <div className='stay-booking-card'> */}
              <StayBookingCard
                stayId={stay._id}
                pricePerNight={stay.pricePerNight || stay.price}
                cleaningFee={stay.cleaningFee || 0}
                serviceFee={stay.serviceFee || 0}
                discounts={stay.discounts}
                minNights={stay.minNights || 1}
                maxNights={stay.maxNights || 14}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                guests={guests}
                setGuests={setGuests}
              />
              {/* </div> */}
            </div>
          </section>

          <div id='reviews'>
            <StayRatingsBreakdown ratings={stay.ratings} />
          </div>

          {/* <StayReviews reviews={stay.reviews} /> */}
          {/* <StayReviews reviews={stay.reviews} id='reviews' /> */}
          {/* <StayReviews reviews={stay.reviews} /> */}

          {/* Pass review count from StayReviews to StaySummary */}
          <StayReviews reviews={stay.reviews} setEffectiveReviewCount={setEffectiveReviewCount} />

          {/* <StayMapLocation loc={stay.loc} /> */}
          {/* <StayMapLocation loc={stay.loc} id='location' /> */}
          <div id='location'>
            <StayMapLocation loc={stay.loc} />
          </div>

          <StayHostInfo host={stay.host} hostLanguages={stay.hostLanguages} hostStats={stay.hostStats} />
          <StayPolicies
            stayPolicies={{
              checkIn: stay.checkIn,
              checkOut: stay.checkOut,
              cancellation: stay.cancellationPolicy,
              houseRules: stay.rules,
              safety: stay.safetyFeatures,
            }}
          />

          {/* remove Add Stay Message */}
          {/* <div className='stay-actions'>
        <button onClick={() => onAddStayMsg(stay._id)}>Add stay message</button>
      </div> */}

          {showReviewsModal && (
            <AppModal onClose={() => setShowReviewsModal(false)}>
              <h2>Reviews</h2>
              <StayReviews reviews={stay.reviews} />
            </AppModal>
          )}

          {showDescriptionModal && (
            <AppModal onClose={() => setShowDescriptionModal(false)}>
              <h2>Description</h2>
              <p>{stay.description}</p>
              <h3>The space</h3>
              <p>{stay.spaceDescription}</p>
            </AppModal>
          )}
        </div>
      </div>
      <AppFooter />
    </section>
  )
}
