import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Signup } from '../pages/Signup'

import '../assets/styles/cmps/LoginSignupModal.scss'

export function LoginSignupModal({ onClose }) {
  const [isSignup, setIsSignup] = useState(false)
  const location = useLocation()

  // Disable body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => (document.body.style.overflow = 'auto')
  }, [])

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
        <button className="close-btn" onClick={onClose}>✕</button>
            <div className="login-modal-mode">
          <span className={!isSignup ? 'active' : 'link'} onClick={() => setIsSignup(false)}>
            Log in
          </span>
          <span>&nbsp;or&nbsp;</span>
          <span className={isSignup ? 'active' : 'link'} onClick={() => setIsSignup(true)}>
            Sign up
          </span>
          </div>
          
        </div>

        <div className="login-modal-body">
          {isSignup ? (
            <Signup onComplete={onClose} />
          ) : (
            <Login onComplete={onClose} />
          )}
        </div>
      </div>
    </div>
  )
}
