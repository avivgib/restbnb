/* eslint react/prop-types: 0 */
import { useState } from 'react'

export function BookingMessageHost({ host, onMessageChange }) {
  const [message, setMessage] = useState('')

  function handleChange(e) {
    const msg = e.target.value
    setMessage(msg)
    onMessageChange(msg)
  }

  return (
    <section className='message-host'>
      <h3>Write a message to the host</h3>
      <p className="host-name">
        {/* {host.fullname} (Hosting {host.hostStats?.tripsHosted || 0} trips) */}
        Before you can continue, let {host.fullname.split(' ')[0]} know a little bit about your trip and why their place is a good fit.
      </p>
      <textarea clasName="message-text" placeholder={`Example: Hi ${host.fullname.split(' ')[0]}, my partner and I are going to a friend's wedding and your place is right down the stree.`} value={message} onChange={handleChange} />
    </section>
  )
}
