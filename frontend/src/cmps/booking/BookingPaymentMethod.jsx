/* eslint react/prop-types: 0 */
import { useState, useEffect } from 'react'

const availableMethods = [
  { type: 'mastercard', last4: '9865' },
  { type: 'visa', last4: '4685' },
  { type: 'credit', label: 'Credit or debit card' },
  // { type: 'paypal', label: 'PayPal' },
  { type: 'googlepay', label: 'Google Pay' },
]

export function BookingPaymentMethod({ selectedMethod, onMethodChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [localSelectedMethod, setLocalSelectedMethod] = useState(selectedMethod || availableMethods[0])

  useEffect(() => {
    if (isModalOpen) {
      setLocalSelectedMethod(selectedMethod || availableMethods[0])
    }
  }, [isModalOpen, selectedMethod])

  function handleMethodSelect(method) {
    setLocalSelectedMethod(method)
  }

  function handleDone() {
    onMethodChange(localSelectedMethod)
    setIsModalOpen(false)
  }

  function handleCancel() {
    setIsModalOpen(false)
  }

  function getCardIcon(type) {
    switch (type) {
      case 'visa':
        // return <img src='https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png' alt='Visa' style={{ height: '18px' }} />
        return <img src='https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_visa.0adea522bb26bd90821a8fade4911913.svg' alt='Visa' style={{ height: '18px' }} />
      case 'mastercard':
        // return <img src='https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png' alt='Mastercard' style={{ height: '18px' }} />
        return <img src='https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_mastercard.f18379cf1f27d22abd9e9cf44085d149.svg' alt='Mastercard' style={{ height: '18px' }} />
      case 'amex':
        return <img src='https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_amex.84088b520ca1b3384cb71398095627da.svg' alt='Amex' style={{ height: '18px' }} />
        // case 'paypal':
        // return <img src='https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg' alt='Amex' style={{ height: '18px' }} />
      case 'googlepay':
        return <img src='https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg' alt='Google Pay' style={{ height: '18px' }} />
      case 'credit':
        // return <img src='https://upload.wikimedia.org/wikipedia/commons/4/4f/Credit-cards.jpg' alt='Credit' style={{ height: '18px' }} />
        return <img src='/img/payment-methods/credit-card.png  ' alt='Credit' style={{ height: '18px' }} />
      default:
        return ''
    }
  }

  function isMethodSelected(method) {
    if (!localSelectedMethod) return false
    if (method.type !== localSelectedMethod.type) return false
    if (method.last4 && localSelectedMethod.last4) {
      return method.last4 === localSelectedMethod.last4
    }
    if (method.label && localSelectedMethod.label) {
      return method.label === localSelectedMethod.label
    }
    return true
  }

  return (
    <div className="payment-method-container">
    <section className='payment-method'>
      <h3>Payment method</h3>

      {/* <div className='payment-method-box'>
        <div className='selected-method'>
          {selectedMethod?.type && (
            <>
              {getCardIcon(selectedMethod.type)} {selectedMethod.last4 ? ` ${selectedMethod.last4}` : selectedMethod.label}
            </>
          )}
        </div>

        <button className='change-btn' onClick={() => setIsModalOpen(true)}>
          Change
        </button>
        
      </div> */}
{/* put all saved methods instead of selected method */}
<div className='saved-methods-list'>
  {availableMethods.slice(0, availableMethods.length - 2).map((method, idx) => (
    <div key={idx} className='method-option' onClick={() => onMethodChange(method)}>
      <div className='left'>
        {getCardIcon(method.type)} {method.last4}
      </div>
      {/* <div className='radio-circle'>{selectedMethod.type === method.type && selectedMethod.last4 === method.last4 && <div className='radio-dot' />}</div> */}
        <img
    src={`/img/${selectedMethod.type === method.type && selectedMethod.last4 === method.last4 ? 'radio-selected' : 'radio-unselected'}.png`}
    alt="payment method selection"
    className="radio-image"
  />

    </div>
  ))}
</div>
{/* More options - modal link substitute for "Change" button */}
<button className='more-options' onClick={() => setIsModalOpen(true)}>
  More options
</button>
      

      {isModalOpen && (
        <div className='payment-modal'>
          <div className='modal-content'>
          <button className="close-btn" onClick={() => handleCancel()}><img src="/img/close.png"/></button>
          <div className="modal-scroll-content">
            <h4>Payment method</h4>
            {/* (availableMethods.length-2) - show all saved methods except credit card & google pay */}
              {availableMethods.slice(0, availableMethods.length-2).map((method, idx) => (
              <div key={idx} className='method-option' onClick={() => handleMethodSelect(method)}>
                <div className='left'>
                <div className="main-line">
                  {getCardIcon(method.type)} {method.last4 ? ` ${method.last4}` : method.label}
                  </div>
                </div>
                  {/* <div className='radio-circle'>{isMethodSelected(method) && <div className='radio-dot' />}</div> */}

<img
    src={`/img/${isMethodSelected(method) ? 'radio-selected' : 'radio-unselected'}.png`}
    alt="payment method selection"
    className="radio-image"
  />

              </div>
            ))}

            <div className='or-pay-with'>Or pay with</div>

            {/* I changed slice(3) to slice(2) - show only credit card & google pay - new (not saved) payment methods */}
              {availableMethods.slice(2).map((method, idx) => (
              // <div key={idx + 3} className='method-option' onClick={() => handleMethodSelect(method)}>
                <div key={idx + 2} className='method-option' onClick={() => handleMethodSelect(method)}>
                {/* <div className='left'>
                  {getCardIcon(method.type)} {method.last4 ? ` ${method.last4}` : method.label}
                  
                  
                </div> */}

<div className='left'>
  <div className="main-line">
    <div className="logo">
    {getCardIcon(method.type)} 
    </div>
    <div className="content">
    {method.last4 ? ` ${method.last4}` : method.label}
    {method.type === 'credit' && (
    <div className="credit-card-logos">
      <span><img src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_visa.0adea522bb26bd90821a8fade4911913.svg" alt="visa" /></span>
      <span><img src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_mastercard.f18379cf1f27d22abd9e9cf44085d149.svg" alt="mastercard" /></span>
      <span><img src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_amex.84088b520ca1b3384cb71398095627da.svg" alt="amex" /></span>
      <span><img src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_discover.7f05c82f07d62a0f8a69d54dbcd7c8be.svg" alt="discover" /></span>
      <span><img src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_jcb.2cf0077e2220c67895e5f3058813e601.svg" alt="jcb" /></span>
    </div>
  )}
    </div>
    </div>

  
</div>

              
                {/* <div className='radio-circle'>{isMethodSelected(method) && <div className='radio-dot' />}</div> */}

<img
    src={`/img/${isMethodSelected(method) ? 'radio-selected' : 'radio-unselected'}.png`}
    alt="payment method selection"
    className="radio-image"
  />


              </div>
            ))}

            <div className='modal-actions'>
              <button className='cancel-btn' onClick={handleCancel}>
                Cancel
              </button>
              <button className='done-btn' onClick={handleDone}>
                Done
              </button>
            </div>
            </div>
          </div>
          <div className='modal-backdrop' onClick={handleCancel} />
        </div>
      )}
    </section>

    <div className="payment-methods-options">
      <span><img src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_visa.0adea522bb26bd90821a8fade4911913.svg" alt="visa"></img></span>
      <span><img src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_mastercard.f18379cf1f27d22abd9e9cf44085d149.svg" alt="mastercard"></img></span>
      <span><img src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_amex.84088b520ca1b3384cb71398095627da.svg" alt="amex"></img></span>
<span><img src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_discover.7f05c82f07d62a0f8a69d54dbcd7c8be.svg" alt="discover"></img></span>
<span><img src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_jcb.2cf0077e2220c67895e5f3058813e601.svg" alt="jcb"></img></span>
<span><img src="https://a0.muscache.com/airbnb/static/packages/assets/frontend/legacy-shared/svgs/payments/logo_googlepay.3f786bc031b59575d24f504dfb859da0.svg" alt="googlepay"></img></span>
        </div>


    </div>
  )
}
