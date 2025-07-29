/* eslint react/prop-types: 0 */
export function BookingModal({ children, onClose }) {
    return (
      <div className='booking-modal-overlay' onClick={onClose}>
        <div className='booking-modal-content' onClick={(e) => e.stopPropagation()}>
          <button className='booking-modal-close' onClick={onClose}>
            ✕
          </button>
          {children}
        </div>
      </div>
    )
  }
  