// /* eslint react/prop-types: 0 */
// import {NavLink} from 'react-router-dom'
// // export function BookingHeader({ stay }) {
//   export function BookingHeader() {
//   return (
//     // <section className='booking-header'>
//     //   <h2>{stay.name}</h2>
//     //   <p>
//     //     {stay.loc.city}, {stay.loc.country}
//     //   </p>
//     //   <img src={stay.imgUrls?.[0]} alt='Stay preview' className='stay-preview-img' />
//     // </section>

// <section className='booking-header'>

// <img src={"/img/logo.png"} alt='Stay preview' className='logo' />
// </section>
//   )
// }

import { NavLink } from 'react-router-dom'

export function BookingHeader() {
  return (
    <header className="booking-header">
      <NavLink to="/" className="logo-link">
        <img src="/img/logo.png" alt="Logo" className="logo" />
      </NavLink>
    </header>
  )
}
