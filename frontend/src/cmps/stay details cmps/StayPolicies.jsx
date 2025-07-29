// /* eslint react/prop-types: 0 */

// export const StayPolicies = ({ stayPolicies }) => {
//   const policies = stayPolicies || {
//     checkIn: '15:00',
//     checkOut: '11:00',
//     cancellation: 'Free cancellation within 48 hours',
//     houseRules: ['No smoking', 'No pets'],
//   }

//   return (
//     <section className='stay-policies'>
//       <h3>Policies</h3>
//       <p>
//         <strong>Check-in:</strong> {policies.checkIn}
//       </p>
//       <p>
//         <strong>Check-out:</strong> {policies.checkOut}
//       </p>
//       <p>
//         <strong>Cancellation:</strong> {policies.cancellation}
//       </p>

//       <h4>House Rules</h4>
//       <ul>
//         {policies.houseRules.map((rule, idx) => (
//           <li key={idx}>{rule}</li>
//         ))}
//       </ul>
//     </section>
//   )
// }

/* eslint react/prop-types: 0 */

export const StayPolicies = ({ stayPolicies = {} }) => {
  const {
    checkIn = '2:00PM - 8:00PM',
    checkOut = 'before 11:00AM',
    cancellation = 'Add your trip dates to get the cancellation details for this stay.',
    houseRules = ['3 guests maximum'],
    safety = ['No smoke alarm', 'Exterior security cameras on property', 'Carbon monoxide detector not required'],
  } = stayPolicies

  return (
    <section className='stay-policies'>
      <h2>Things to know</h2>
      <div className='policies-grid'>
        <div className='policy-section'>
          <h4>House rules</h4>
          <p>Check-in: {checkIn}</p>
          <p>Checkout: {checkOut}</p>
          {houseRules.map((rule, idx) => (
            <p key={idx}>{rule}</p>
          ))}
          <a href='#' className='show-more'>
            Show more <img src='/img/arrow.png' className='img' />
          </a>
        </div>

        <div className='policy-section'>
          <h4>Safety & property</h4>
          {safety.map((item, idx) => (
            <p key={idx}>{item}</p>
          ))}
          <a href='#' className='show-more'>
            Show more <img src='/img/arrow.png' className='img' />
          </a>
        </div>

        <div className='policy-section'>
          <h4>Cancellation policy</h4>
          <p>{cancellation}</p>
          <a href='#' className='show-more'>
            Show more <img src='/img/arrow.png' className='img' />
          </a>
        </div>
      </div>
    </section>
  )
}
