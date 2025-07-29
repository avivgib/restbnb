// /* eslint react/prop-types: 0 */

// export const StayHostInfo = ({ host, hostLanguages, hostStats }) => {
//   const displayHost = host || {
//     fullname: 'Giulia Romano',
//     imgUrl: 'https://via.placeholder.com/80',
//     isSuperhost: true,
//     hostSince: '2022-01-01',
//     about: 'Hi! I love hosting people from all over the world.',
//   }

//   const displayLanguages = hostLanguages?.length ? hostLanguages : ['English', 'Italian']

//   const displayStats = hostStats || {
//     tripsHosted: 50,
//     avgRating: 4.8,
//     totalReviews: 32,
//   }

//   return (
//     <section className='stay-host-info'>
//       <div className='host-header'>
//         <img src={displayHost.imgUrl} alt={displayHost.fullname} className='host-avatar' />
//         <div className='host-details'>
//           <h3>Hosted by {displayHost.fullname}</h3>
//           <p>
//             {displayHost.isSuperhost ? '🌟 Superhost' : 'Host'} • Hosting since {displayHost.hostSince}
//           </p>
//           <p>Languages: {displayLanguages.join(', ')}</p>
//           <p>
//             {displayStats.tripsHosted} trips • {displayStats.totalReviews} reviews • Avg rating: {displayStats.avgRating}
//           </p>
//         </div>
//       </div>

//       {displayHost.about && (
//         <div className='host-about'>
//           <h4>About the host</h4>
//           <p>{displayHost.about}</p>
//         </div>
//       )}
//     </section>
//   )
// }

/* eslint react/prop-types: 0 */

export const StayHostInfo = ({ host = {}, hostLanguages = [], hostStats = {} }) => {
  const displayHost = {
    fullname: host.fullname || 'Guy Siso',
    imgUrl: host.imgUrl || 'https://randomuser.me/api/portraits/men/96.jpg',
    isSuperhost: host.isSuperhost ?? true,
    about:
      host.about ||
      `My name is ${host.fullname} and I own a radio station and a small billiard club. For years I worked in the hotel business and I enjoy giving people good service. When you order my apartment you will also have fun at my club called Nisha 17.`,
    job: host.job || 'Owner at Nisha 17 Sooker Club',
  }

  const displayLanguages = hostLanguages.length ? hostLanguages : ['English', 'Spanish']

  const displayStats = {
    totalReviews: hostStats.totalReviews > 0 ? hostStats.totalReviews : 8,
    avgRating: hostStats.avgRating ?? 4.67,
    yearsHosting: hostStats.yearsHosting ?? 7,
    responseRate: hostStats.responseRate ?? 100,
    responseTime: hostStats.responseTime || 'within an hour',
  }

  const hostFirstName = displayHost.fullname.split(' ')[0]

  return (
    <section className='stay-host-info'>
      <h2>Meet your host</h2>

      <div className='host-columns'>
        {/* LEFT COLUMN */}
        <div className='host-left'>
          <div className='host-card'>
            <div className='host-card-left'>
              <img src={displayHost.imgUrl} alt={hostFirstName} className='host-avatar' />
              <h3>{hostFirstName}</h3>
              <p className='host-role'>{displayHost.isSuperhost ? 'Superhost' : 'Host'}</p>
            </div>
            <div className='host-card-right'>
              <div className='host-stat'>
                <div className='stat-value'>{displayStats.totalReviews}</div>
                <div className='stat-label divider'>Reviews</div>
              </div>
              <div className='host-stat'>
                <div className='stat-value'>
                  {displayStats.avgRating}
                  <img src='/img/star.png' className='review-star' />
                </div>
                <div className='stat-label divider'>Rating</div>
              </div>
              <div className='host-stat'>
                <div className='stat-value'>{displayStats.yearsHosting}</div>
                <div className='stat-label'>Years hosting</div>
              </div>
            </div>
          </div>

          <div className='host-quick-facts'>
            <p className='host-icon-line'>
              <img src='/img/briefcase.png' alt='' />
              My work: {displayHost.job}
            </p>
            <p className='host-icon-line'>
              <img src='/img/speaks.png' alt='' />
              Speaks {displayLanguages.join(' and ')}
            </p>
            <p className='host-about-text'>{displayHost.about}</p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className='host-right'>
          {displayHost.isSuperhost && (
            <div className='superhost'>
              <h4>{hostFirstName} is a Superhost</h4>
              <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
            </div>
          )}

          <div className='host-details'>
            <h4>Host details</h4>
            <p>Response rate: {displayStats.responseRate}%</p>
            <p>Responds {displayStats.responseTime}</p>
            <button className='message-btn' onClick={() => onAddStayMsg(stay._id)}>
              Message host
            </button>
          </div>

          <hr />

          <div className='airbnb-reminder'>
            <img src='/img/payment-protection.png' alt='Payment protection' />
            <span>To help protect your payment, always use Airbnb to send money and communicate with hosts.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
