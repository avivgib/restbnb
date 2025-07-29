/* eslint react/prop-types: 0 */

import { useEffect, useState } from 'react'
import { stayService } from '../services/stay/stay.service.remote'
import { orderService } from '../services/orders/orders.service.remote'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { socketService, SOCKET_EMIT_ORDER_UPDATE } from '../services/socket.service';

import DynamicGradientButton from '../cmps/DynamicGradientButton.jsx'

export function OrderConfirmationModal({ orderId, onClose, onApproved }) {
  const [order, setOrder] = useState(null)
  const [stay, setStay] = useState(null)

  useEffect(() => {
    loadOrder()
  }, [orderId])

  async function loadOrder() {
    try {
      const order = await orderService.getById(orderId)
      setOrder(order)
      const stay = await stayService.getById(order.stayId)
      setStay(stay)
    } catch (err) {
      showErrorMsg('Failed to load order or stay')
    }
  }

  async function onApproveOrder() {
    try {
      const updatedOrder = { ...order, status: 'approved' }
      const savedOrder = await orderService.save(updatedOrder)
      socketService.emit(SOCKET_EMIT_ORDER_UPDATE, {
        order: savedOrder,
        userId: savedOrder.userId
      })
      showSuccessMsg('Order approved')
      onApproved?.(savedOrder)
      onClose()
    } catch (err) {
      showErrorMsg('Failed to approve order')
      console.error('Error approving order:', err)
    }
  }

  if (!order || !stay) return <div className='modal loading'>Loading...</div>

  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toDateString()
  }

  function currencySymbol({ currency }) {
    switch (currency) {
      case 'USD':
        return '$';
      case 'ILS':
        return '₪';
      default:
        return currency;
    }
  }

  return (
    <section className='order-confirmation-modal'>
      <div className='confirmation-modal-content'>


        <button className='confirmation-modal-close' onClick={onClose}>
        <img src="/img/close.png"/>
        </button>
        <h2>One Last Step</h2>
        <p>Dear host, please approve the booking below.</p>
        <div className="main-content">
          <div className="left-col">
          <p>
          <span className="label">Check-In: </span>
          {/* <span className="content">{bookingDetails.checkin}</span> */}
           
          <span className="content">{formatDate(order.checkin).slice(4)}</span>
          </p>
          <p>
          <span className="label">Check-Out: </span>
          {/* <span className="content">{bookingDetails.checkout}</span> */}
          <span className="content">{formatDate(order.checkout).slice(4)}</span>
          </p>
          <p>
          <span className="label">Guests: </span>
          {/* <span className="content">{orderToSave?.guests?.total}</span> */}
          <span className="content">{order.guests.adults} {order.guests.adults === 1 ? 'adult' : 'adults'}
          {order.guests.children > 0 && `, ${order.guests.children} ${order.guests.children === 1 ? 'child' : 'children'}`}
          {order.guests.infants > 0 && `, ${order.guests.infants} ${order.guests.infants === 1 ? 'infant' : 'infants'}`}
          {order.guests.pets > 0 && `, ${order.guests.pets} ${order.guests.pets === 1 ? 'pet' : 'pets'}`}</span>
          </p>

            <p>
              <span className="label">Stay Duration: </span>
              {/* <span className="content">{orderToSave?.priceDetails?.total} {bookingDetails.guestCurrency}</span> */}
              <span className="content">{order.totalNights} nights</span>
            </p>
            <p>
              <span className="label">Price per Night: </span>
              {/* <span className="content">{orderToSave?.priceDetails?.total} {bookingDetails.guestCurrency}</span> */}
              <span className="content">{currencySymbol({ currency: order.currency })}{order.pricePerNight}</span>
            </p>
            <p>
              <span className="label">Service Fee: </span>
              {/* <span className="content">{orderToSave?.priceDetails?.total} {bookingDetails.guestCurrency}</span> */}
              <span className="content">{currencySymbol({ currency: order.currency })}{order.priceDetails.serviceFee}</span>
            </p>
            <p>
              <span className="label">Total Price: </span>
              {/* <span className="content">{orderToSave?.priceDetails?.total} {bookingDetails.guestCurrency}</span> */}
              <span className="content">{currencySymbol({ currency: order.currency })}{order.priceDetails.total}</span>
            </p>

            {/* <div className='price-breakdown'>
            <h3>Price details</h3>
            <div className='line'>
              <span>
                ${order.pricePerNight} x {order.totalNights} nights
              </span>
              <span>${order.priceDetails.nightsSubtotal}</span>
            </div>
            <div className='line'>
              <span>Service fee</span>
              <span>${order.priceDetails.serviceFee}</span>
            </div>
            <div className='line total'>
              <span>Total</span>
              <span>
                <strong>${order.priceDetails.total}</strong>
              </span>
            </div>
          </div> */}

          </div>
          <div className="right-col">
            <img src={stay.imgUrls?.[0]} alt='Stay preview' className='stay-image-modal' />
          </div>

        </div>

        {/* <div className='modal-actions'>
            <button className='close-btn' onClick={onClose}>
              Close
            </button>
            <button className='approve-btn' onClick={onApproveOrder}>
              Approve
            </button>
          </div> */}


        {/* <div className="modal-actions" style={{ marginTop: '1em', display: 'flex', gap: '1em' }}> */}
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          {/* <button className="confirm-btn" onClick={onFinalApprove}>Confirm</button> */}
          <DynamicGradientButton onClick={onApproveOrder}>Approve</DynamicGradientButton>
        </div>





        {/* </div> */}
      </div>
    </section>
  )
}
