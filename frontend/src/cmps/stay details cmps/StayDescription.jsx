/* eslint react/prop-types: 0 */
import { useState } from 'react'
export const StayDescription = ({ descriptionText, spaceText, onShowFullDescription }) => {
  const [showModal, setShowModal] = useState(false)
  // For testing:
  const descriptionText1 = descriptionText || "2 room unit A bedroom and a living room can accommodate up to 4 people or a couple and 2 children a separate entrance Located in a very quiet and relatively close proximity to the sea.";
  const spaceText1 = spaceText || "Welcome to this stunning loft apartment boasting ceilings over 5 meters high, offering a unique and spacious experience in the heart of Rome. With breathtaking views of the Colosseum, this impeccably crafted space promises a memorable stay."
  const shortSpaceText = spaceText1.length > 256 ? spaceText1.slice(0, 256) + ' …' : spaceText1

  return (
    <section className='stay-description'>
      {/* for testing: */}
      {/* <p className='general-description'>{descriptionText}</p> */}
      {/* original: */}
      <p className='general-description'>{descriptionText1}</p>

      <div className='space-section'>
        <div className='space-title'>The space</div>
        <p className='space-text'>{shortSpaceText}</p>
      </div>

      {/* <button className='show-more-btn' onClick={() => onShowFullDescription && onShowFullDescription(true)}> */}
      <button className="description-show-more-btn" onClick={() => setShowModal(true)}>
        Show more
      </button>

      {showModal && (
        <div className="description-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="description-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}><img src="/img/close.png" /></button>
            <div className="modal-scroll-content">
              <h2>About this space</h2>
              <p>{descriptionText1}</p>
              <h3>The space</h3>
              <p>{spaceText1}</p>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}
