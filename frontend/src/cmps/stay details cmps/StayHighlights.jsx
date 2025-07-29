/* eslint react/prop-types: 0 */

export const StayHighlights = ({ hostName, hostAvatar, isSuperhost, hostYears, highlights }) => {
  return (
    // <section className='stay-highlights'>
    //   <div className='host-info'>
    //     <img src={hostAvatar} alt={`Host ${hostName}`} className='host-avatar' />
    //     <div className='host-details'>
    //       <div className='host-name'>Hosted by {hostName}</div>
    //       <div className='host-meta'>
    //         {isSuperhost && <span className='superhost-badge'>Superhost · </span>}
    //         {hostYears} years hosting
    //       </div>
    //     </div>
    //   </div>

    //   <hr />

    //   <ul className='highlights-list'>
    //     {highlights.map((highlight, idx) => (
    //       <li key={idx} className='highlight-item'>
    //         <div className='highlight-icon'>
    //           <img src={highlight.icon} alt={highlight.title} />
    //         </div>
    //         <div className='highlight-text'>
    //           <div className='highlight-title'>{highlight.title}</div>
    //           <div className='highlight-description'>{highlight.description}</div>
    //         </div>
    //       </li>
    //     ))}
    //   </ul>
    // </section>

<section className='stay-highlights'>
  <div className='stay-highlights-host'>
  <img src={hostAvatar} alt={`Host ${hostName}`} className='host-avatar' />
    <div className='host-text'>
      <h3 className='host-name'>Hosted by {hostName}</h3>
      <p className='host-years'>{hostYears} years hosting</p>
    </div>
  </div>

  <hr className='highlight-divider' />

  <ul className='highlight-items'>
    {highlights.map((highlight, idx) => (
      <li key={idx} className='highlight-item'>
        <div className='highlight-icon'>
          <img src={highlight.icon} alt={highlight.title} />
        </div>
        <div className='highlight-content'>
          <div className='highlight-title'>{highlight.title}</div>
          <div className='highlight-description'>{highlight.description}</div>
        </div>
      </li>
    ))}
  </ul>
</section>


  )
}
