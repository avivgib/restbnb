// /* eslint react/prop-types: 0 */

// export const StayRatingsBreakdown = ({ ratings }) => {
//   const displayRatings = ratings || {
//     cleanliness: 4.8,
//     communication: 5.0,
//     checkIn: 4.7,
//     accuracy: 4.6,
//     location: 4.9,
//     value: 4.5,
//   }

//   const ratingEntries = Object.entries(displayRatings)

//   return (
//     <section className='stay-ratings'>
//       <h3>Ratings Breakdown</h3>
//       <ul className='ratings-list'>
//         {ratingEntries.map(([category, score], idx) => (
//           <li key={idx}>
//             <strong>{category.charAt(0).toUpperCase() + category.slice(1)}:</strong> ⭐ {score.toFixed(1)}
//           </li>
//         ))}
//       </ul>
//     </section>
//   )
// }


/* eslint react/prop-types: 0 */
import React from 'react'

const reviewTopics = [
  { key: 'cleanliness', label: 'Cleanliness', icon: 'spray.png' },
  { key: 'accuracy', label: 'Accuracy', icon: 'accuracy.png' },
  { key: 'checkIn', label: 'Check-in', icon: 'check-in.png' },
  { key: 'communication', label: 'Communication', icon: 'communication.png' },
  { key: 'location', label: 'Location', icon: 'map.png' },
  { key: 'value', label: 'Value', icon: 'tag.png' },
]

export const StayRatingsBreakdown = ({
  ratings = {},
  overallDistribution = { 5: 25, 4: 10, 3: 5, 2: 2, 1: 8 }, // sample fallback
}) => {
  const defaultRatings = {
    cleanliness: 4.8,
    communication: 5.0,
    checkIn: 4.7,
    accuracy: 4.6,
    location: 4.9,
    value: 4.5,
  }

  const displayRatings = { ...defaultRatings, ...ratings }

  const totalReviews = Object.values(overallDistribution).reduce((sum, count) => sum + count, 0)

  const average =
    Object.entries(overallDistribution).reduce(
      (sum, [star, count]) => sum + parseInt(star) * count,
      0
    ) / (totalReviews || 1)

  return (
    <section className='stay-ratings-breakdown'>
      {/* <div className='ratings-header'>
      <span className='star'><img src="/img/star.png"/></span>
        <span className='avg-rating'> {average.toFixed(2)}</span>
        <span className='review-count'>· {totalReviews} reviews</span>
      </div> */}

      <div className='ratings-content'>
      
        <div className='rating-bars'>
        <span className='overall-rating'>Overall rating</span>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = overallDistribution[star] || 0
            const percentage = (count / (totalReviews || 1)) * 100

            return (
              <div className='rating-bar-row' key={star}>
                <span>{star}</span>
                <div className='bar'>
                  <div className='bar-fill' style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            )
          })}
        </div>  

        <div className='category-ratings'>
          {reviewTopics.map(({ key, label, icon }, idx) => (
            <div className='category-rating' key={key}>
              {idx < reviewTopics.length - 0 && <div className='divider' />}
              <div className='category-info'>
                <span className='label'>{label}</span>
                <span className='score'>{displayRatings[key]?.toFixed(1)}</span>
                
              </div>
              <img
                src={`/img/ratings/${icon}`}
                alt={label}
                className='category-icon'
              />
              {/* {idx < reviewTopics.length - 1 && <div className='divider' />} */}
              
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
