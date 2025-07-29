/* eslint react/prop-types: 0 */
export function AppModal({ children, onClose }) {
  return (
    <div className='app-modal-overlay' onClick={onClose}>
      <div className='app-modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='app-modal-close' onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
