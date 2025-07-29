// /* eslint react/prop-types: 0 */
import { useState } from 'react'
import { useEffect } from 'react'

// export const StayReviews = ({ reviews }) => {
// Pass review count from StayReviews to StaySumary:
export const StayReviews = ({ reviews, setEffectiveReviewCount }) => {
  const MAX_REVIEWS = 6
  const [showAll, setShowAll] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getDisplayDate = (dateStr) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.floor(diffDays / 7)

    if (diffDays < 1) {
      return 'Today'
    } else if (diffDays === 1) {
      return '1 day ago'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else if (diffWeeks === 1) {
      return '1 week ago'
    } else if (diffWeeks < 5) {
      return `${diffWeeks} weeks ago`
    } else {
      return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    }
  }

  const sampleReviews = [
    {
      _id: `sample-${Date.now()}-${Math.random()}`,
      user: {
        _id: `sample-user-${Math.random()}`,
        fullname: 'James Smith',
        imgUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      rating: 4.8,
      comment: `Just needed a place to sleep for the night, and that was more than perfect. A clean, spacious room with a big bed; on top of this, a 5 min walk to the train station.`,
      date: Date.now(),
    },
    {
      _id: `sample-${Date.now()}-${Math.random()}`,
      user: {
        _id: `sample-user-${Math.random()}`,
        fullname: 'Ryan Patel',
        imgUrl: 'https://randomuser.me/api/portraits/men/33.jpg',
      },
      rating: 5,
      comment: `Aviad was an incredibly hospitable host! He made me feel welcome and comfortable, and his kindness truly stood out. His place was also clean and tidy, making for an overall wonderful experience. 
If you behave yourselves, you might get a very nice Chai treat in the morning (thanks for that Aviad!)
I'd highly recommend staying with him!`,
      date: Date.now(),
    },
    {
      _id: `sample-${Date.now()}-${Math.random()}`,
      user: {
        _id: `sample-user-${Math.random()}`,
        fullname: 'Benjamin Scott',
        imgUrl: 'https://randomuser.me/api/portraits/men/34.jpg',
      },
      rating: 4.9,
      comment: `The house is exceptionally clean and everything is on its place. I was impressed by the smart organization, amount of plants and atmosphere and had a feeling that it is like an oasis of peace in the chaotic surroundings of Tel Aviv. The place is safe, pleasent and totally recommend if you are agree to follow the house rules. Aviad is a friendly and open if you need help. Hope to see you soon.`,
      date: Date.now(),
    },
    {
      _id: `sample-${Date.now()}-${Math.random()}`,
      user: {
        _id: `sample-user-${Math.random()}`,
        fullname: 'Ethan Miller',
        imgUrl: 'https://randomuser.me/api/portraits/men/35.jpg',
      },
      rating: 4.5,
      comment: `Aviad is an excellent host, very friendly, knowledgeable of surrounding areas and places to go. I felt welcomed, accompanied and taken care of; I would go again to his beautiful place and will refer him with no doubt. Thanks Aviad!`,
      date: Date.now(),
    },
    {
      _id: `sample-${Date.now()}-${Math.random()}`,
      user: {
        _id: `sample-user-${Math.random()}`,
        fullname: 'Lucas Wright',
        imgUrl: 'https://randomuser.me/api/portraits/men/36.jpg',
      },
      rating: 4.7,
      comment: `Our stay was wonderful. The room was warm, spotless, and very comfortable. We were able to find parking right outside the house, which was a big plus. Check-in instructions were clear and easy to follow. Overall, it was a great short stay and we would happily return.`,
      date: Date.now(),
    },
    {
      _id: `sample-${Date.now()}-${Math.random()}`,
      user: {
        _id: `sample-user-${Math.random()}`,
        fullname: 'Daniel Hayes',
        imgUrl: 'https://randomuser.me/api/portraits/men/37.jpg',
      },
      rating: 4.6,
      comment: `The host is amazingly helpful and accommodating. Since it is our first time in Israel and we arrived very early he volunteered his house for us to come while waiting for our room. And in a few moment he told us that we can early check in as the previous occupant has vacated the room early. The neighborhood is very quiet and peaceful, with parks nearby to exercise and market to enjoy fruits and food. Btw, Tel Aviv Central Bus Terminal and HaHagana MRT is within 5 minutes walk away. Lovely lovely place. I would book this place again on my future Israel plans. The price is amazing for the stay. Thank you so much Host! Shalom!`,
      date: Date.now(),
    },
    {
      _id: `sample-${Date.now()}-${Math.random()}`,
      user: {
        _id: `sample-user-${Math.random()}`,
        fullname: 'Samuel Foster',
        imgUrl: 'https://randomuser.me/api/portraits/men/38.jpg',
      },
      rating: 4.8,
      comment: `Wonderful location. It’s literally 5 minutes away from the train station. It’s easy to go any direction from here. Aviad is a helpful host and he keeps the apartment very clean. I will definitely check in again.`,
      date: Date.now(),
    },
    {
      _id: `sample-${Date.now()}-${Math.random()}`,
      user: {
        _id: `sample-user-${Math.random()}`,
        fullname: 'Rian Kumar',
        imgUrl: 'https://randomuser.me/api/portraits/men/39.jpg',
      },
      rating: 4.6,
      comment: `I really enjoyed staying here! The place is beautifully furnished, clean, and welcoming. The bed is very comfortable and the room is very quiet. Aviad was very communicative and helpful as I had come in very late and he was still able to assist me. Instructions and house rules were extremely clear so I didn't have a lot of confusion. The photos really helped. It's a very interesting and colorful neighborhood within walking distance to a main train station and a really great market. I feel the area offers a very different feel of the city. I highly recommend staying here if you are coming. :)`,
      date: Date.now(),
    },
  ]

  const displayReviews = reviews?.length ? reviews : sampleReviews
  // Pass review count from StayReviews to StaySummary:
  useEffect(() => {
    setEffectiveReviewCount?.(displayReviews.length)
  }, [displayReviews.length, setEffectiveReviewCount])

  const reviewsToShow = showAll ? displayReviews : displayReviews.slice(0, MAX_REVIEWS)

  return (
    <section className='stay-reviews'>
      {/* <h3>Guest Reviews</h3> */}
      <div className='reviews-grid'>
        {/* {reviewsToShow.map((review, idx) => (
          <div key={idx} className='review-card'>
            <div className='review-header'>
              <img className='review-avatar' src={review.by?.imgUrl} alt={review.by?.fullname} />
              <div>
                <div className='review-name'>{review.by?.fullname}</div>
                <div className='review-location'>{review.by?.location}</div>
              </div>
            </div>
            <div className='review-meta'>
              <span className='review-stars'>★★★★★</span>
              <span className='dot'>·</span>
              <span className='review-date'>April 2025</span>
              <span className='dot'>·</span>
              <span className='review-duration'>Stayed a few nights</span>
            </div>
            <p className='review-text'>{review.txt}</p>
          </div>
        ))} */}

        {reviewsToShow.map((review, idx) => {
          const shortReviewText =
            review.comment.length > 172 ? review.comment.slice(0, 172) + ' …' : review.comment

          return (
            <div key={idx} className='review-card'>
              <div className='review-header'>
                <img className='review-avatar' src={review.user?.imgUrl} alt={review.user?.fullname} />
                <div>
                  <div className='review-name'>{review.user?.fullname}</div>
                  {/* <div className='review-location'>{review.user?.location}</div> */}
                </div>
              </div>
              <div className='review-meta'>
                <span className='review-stars'>★★★★★</span>
                <span className='dot'>·</span>
                <span className='review-date'>{getDisplayDate(review.date)}</span>
                <span className='dot'>·</span>
                <span className='review-duration'>{review.duration || 'Stayed a few nights'}</span>
              </div>
              <p className='review-text'>{shortReviewText}</p>
              {review.comment.length > 172 && (
                <div className='show-more-of-review'>
                  <button className='show-more-of-review-btn' onClick={() => setShowAll(true)}>Show more</button>
                </div>
              )}
            </div>
          )
        })}

      </div>
      {displayReviews.length > MAX_REVIEWS && (
        <div className='show-more-reviews'>
          <button className='show-more-reviews-btn' onClick={() => setIsModalOpen(true)}>Show all {displayReviews.length} reviews</button>
        </div>
      )}

      {/* {displayReviews.length > MAX_REVIEWS && (
  <button className="show-all-btn" onClick={() => setIsModalOpen(true)}>
    Show all {displayReviews.length} reviews
  </button>
)} */}

      {/* {isModalOpen && (
  <div className="all-reviews-modal-overlay" onClick={() => setIsModalOpen(false)}>
    <div className="all-reviews-modal" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={() => setIsModalOpen(false)}>X</button>
      <h2>All Reviews</h2>

      <div className="all-reviews-list">
        {displayReviews.map((review, idx) => (
          <div key={idx} className="review-card full-text">
            <div className="review-header">
              <span className="reviewer">{review.by.fullname}</span>
              <span className="date">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="txt">{review.txt}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)} */}

      {isModalOpen && (
        <div className="all-reviews-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="all-reviews-modal" onClick={(e) => e.stopPropagation()}>
            {/* <button className="review-modal-close-btn" onClick={() => setIsModalOpen(false)}>X</button> */}
            <button className="review-modal-close-btn" onClick={() => setIsModalOpen(false)}><img src="/img/close.png" /></button>
            <h2>{displayReviews.length} reviews</h2>
            <div className="review-modal-scroll-content">
              <div className="all-reviews-list">
                {displayReviews.map((review, idx) => (
                  <div key={idx} className="review-card">
                    <div className="review-header">
                      <img className="review-avatar" src={review.user?.imgUrl} alt={review.user?.fullname} />
                      <div>
                        <div className="review-name">{review.user?.fullname}</div>
                      </div>
                    </div>
                    <div className="review-meta">
                      <span className="review-stars">★★★★★</span>
                      <span className="dot">·</span>
                      <span className='review-date'>{getDisplayDate(review.date)}</span>
                      <span className="dot">·</span>
                      <span className='review-duration'>{review.duration || 'Stayed a few nights'}</span>
                    </div>
                    <p className="review-text">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


    </section>
  )
}
