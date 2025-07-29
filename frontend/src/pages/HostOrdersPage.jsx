import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { orderService } from '../services/orders'
import { userService } from '../services/user'
import { stayService } from '../services/stay'
import { OrderConfirmationModal } from '../cmps/OrderConfirmationModal'
import { AppModal } from '../cmps/AppModal'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { HostHeader } from '../cmps/HostHeader'
import { socketService, SOCKET_EVENT_ORDER_ADDED, SOCKET_EMIT_ORDER_UPDATE } from '../services/socket.service'
import { format, isSameMonth } from 'date-fns'

import { AppFooter } from '../cmps/AppFooter'


import DynamicGradientButton from '../cmps/DynamicGradientButton.jsx'
import { Socket } from 'socket.io-client'

export function HostOrdersPage() {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(0)
  const [pageSize] = useState(50)
  const navigate = useNavigate() 

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)

  const loggedInUser = userService.getLoggedinUser()

  useEffect(() => {
    loadOrders()
    socketService.on(SOCKET_EVENT_ORDER_ADDED, handleNewOrder)
    return () => {
      socketService.off(SOCKET_EVENT_ORDER_ADDED, handleNewOrder)
    }
  }, [])

  async function handleNewOrder(order) {
    try {
      const buyer = await userService.getById(order.userId)
      const stay = await stayService.getById(order.stayId)

      setOrders((prevOrders) => [
        { ...order, buyer, stay },
        ...prevOrders
      ].sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return 1
        if (a.status !== 'pending' && b.status === 'pending') return -1
        return new Date(a.createdAt) - new Date(b.createdAt)
      }))
      showSuccessMsg('New order received!')
    } catch (err) {
      showErrorMsg('Failed to process new order')
      console.error('Error processing new order', err)
    }
  }

  async function loadOrders() {
    try {
      const [allOrders, allUsers, allStays] = await Promise.all([orderService.query(), userService.getUsers(), stayService.query()])

      const buyerMap = allUsers.reduce((acc, user) => {
        acc[user._id] = user
        return acc
      }, {})

      const stayMap = allStays.reduce((acc, stay) => {
        acc[stay._id] = stay
        return acc
      }, {})

      const hostOrders = allOrders
        .filter((order) => order.hostId === loggedInUser._id)
        .map((order) => ({
          ...order,
          buyer: buyerMap[order.userId],
          stay: stayMap[order.stayId],
        }))
        .sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return 1
          if (a.status !== 'pending' && b.status === 'pending') return -1
          return new Date(a.createdAt) - new Date(b.createdAt)
        })

      setOrders(hostOrders)
    } catch (err) {
      showErrorMsg('Failed to load orders')
    }
  }

  function handleApprove(order) {
    setSelectedOrder(order)
    setIsApproveModalOpen(true)
  }

  function handleDecline(order) {
    if (!order?.userId || !order?.stayId || !order?.buyer || !order?.stay) {
      console.error('Invalid order selected for decline:', order)
      showErrorMsg('Cannot decline order: incomplete order information')
      return;
    }
    setSelectedOrder(order)
    setIsDeclineModalOpen(true)
  }

  async function confirmDecline() {
    try {
      if (!selectedOrder || !selectedOrder.userId || !selectedOrder.stayId) {
        console.error('selectedOrder is invalid:', selectedOrder)
        showErrorMsg('Cannot decline order: missing order information')
        return;
      }

      const updatedOrder = { ...selectedOrder, status: 'declined' }
      const savedOrder = await orderService.save(updatedOrder)

      const enrichedOrder = {
        ...savedOrder,
        buyer: selectedOrder.buyer || { fullname: 'Unknown', imgUrl: '' },
        stay: selectedOrder.stay || { name: 'N/A', imgUrls: [''] },
      }

      setOrders((prev) =>
        prev.map((o) =>
          o._id === enrichedOrder._id
            ? {
              ...enrichedOrder,
              buyer: { ...enrichedOrder.buyer },
              stay: { ...enrichedOrder.stay },
            }
            : o
        )
      )
      
      socketService.emit(SOCKET_EMIT_ORDER_UPDATE, {
        order: savedOrder,
        userId: savedOrder.userId
      })

      showSuccessMsg('Order declined')
      setIsDeclineModalOpen(false)
      setSelectedOrder(null)
    } catch (err) {
      showErrorMsg('Failed to decline order')
      console.error('Error declining order:', err)
    }
  }

  const pagedOrders = orders.slice(page * pageSize, (page + 1) * pageSize)

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

  function formatDateRange(checkin, checkout) {
    if (!checkin || !checkout) return 'No dates selected'

    const checkinDate = new Date(checkin)
    const checkoutDate = new Date(checkout)

    if (isNaN(checkinDate) || isNaN(checkoutDate)) {
      return 'Invalid dates'
    }

    const checkinYear = checkinDate.getFullYear()
    const checkoutYear = checkoutDate.getFullYear()
    const isSameYear = checkinYear === checkoutYear

    const sameMonth = isSameMonth(checkinDate, checkoutDate)

    const checkinFormatted = format(checkinDate, 'MMM d')
    const checkoutFormatted = sameMonth
      ? format(checkoutDate, 'd')
      : format(checkoutDate, 'MMM d')

    return isSameYear
      ? `${checkinFormatted} - ${checkoutFormatted}, ${checkinYear}`
      : `${checkinFormatted}, ${checkinYear} - ${checkoutFormatted}, ${checkoutYear}`
  }



  return (
    <main className='host-orders'>
      <div className="host-orders-main-container">
      <>
        <div className='header'>
          <HostHeader />
        </div>
        <section className='pending-orders-page'>
          <div className='orders-header'>
              <h2>
              Hi {loggedInUser.fullname.split(' ')[0]}, you have {orders.filter((o) => o.status === 'pending').length} pending {orders.filter((o) => o.status === 'pending').length === 1 ? 'order' : 'orders'}:
              </h2>
          </div>

          <div className='order-summary'>
            <span>
              Approved: <span className='green'>{orders.filter((o) => o.status === 'approved').length}/{orders.length}</span>
            </span>
            <span>
              {' '}
              Pending: <span className='yellow'>{orders.filter((o) => o.status === 'pending').length}/{orders.length}</span>
            </span>
            <span>
              {' '}
              Declined: <span className='red'>{orders.filter((o) => o.status === 'declined').length}/{orders.length}</span>
            </span>
            {/* <span>
              Earnings: $
              {orders
                .filter((o) => o.status === 'approved')
                .reduce((sum, o) => sum + (o.priceDetails?.total || 0), 0)
                .toFixed(2)}
            </span> */}
          </div>

          {/* <table className='order-table'>
            <tbody>
              {pagedOrders.slice().reverse().map((order) => (
                <tr className='order-preview' key={order._id}>
                  <td className='preview-cell destination'>
                    <img src={order?.stay?.imgUrls[0]} alt={order?.stay?.name} className='order-img grid-order-img' onClick={() => navigate(`/stay/${order?.stay._id}`)} />
                    <div className="stay-name-dates">
                      <div className='stay-name grid-stay-name' onClick={() => navigate(`/stay/${stay._id}`)}>{order.stay?.name || 'N/A'}</div>
                      <div className='dates grid-dates'>{formatDate(order.checkin).slice(4)} - {formatDate(order.checkout).slice(4)}</div>
                    </div>
                  </td>
                  <td className='preview-cell buyer grid-buyer'>
                    <span><img src={order?.buyer?.imgUrl} alt={order?.buyer} className='buyer-avatar' /></span>
                    <span>{order.buyer?.fullname || 'Unknown'}</span>
                  </td>

                  <td className='preview-cell total-price grid-total-price'>
                    {currencySymbol({ currency: order.currency })}
                    {order.priceDetails?.total?.toFixed(2) || 0}
                  </td>
                  <td className={`preview-cell order-status grid-order-status`}>
                    <span className={`${order.status}`}></span>
                    {order.status.charAt(0).toUpperCase()}{order.status.slice(1).toLowerCase()}
                  </td>
                  <td className='preview-cell actions'>
                    {order.status === 'pending' ? (
                      <>
                        <button className='btn-approve' onClick={() => handleApprove(order)}>
                          Approve
                        </button>
                        <button className='btn-decline' onClick={() => handleDecline(order)}>
                          Decline
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#999' }}>—</span>
                    )}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table> */}


<div className='order-table'>
            {/* <tbody> */}
              {pagedOrders.slice().reverse().map((order) => (
                <div className='order-preview' key={order._id}>
                  {/* <div className="desktop-display"> */}
                  <div className='preview-cell destination grid-destination'>
                    
                    <div className="stay-name-dates">
                      <div className='stay-name grid-stay-name' onClick={() => navigate(`/stay/${stay._id}`)}>{order.stay?.name || 'N/A'}</div>
                      {/* <div className='stay-name grid-stay-name' onClick={() => navigate(`/stay/${stay._id}`)}>Iconic apartment with breathtaking Colosseum view</div> */}
                      {/* <div className='dates grid-dates'>{formatDate(order.checkin).slice(4)} - {formatDate(order.checkout).slice(4)}</div> */}
                      <div className='dates grid-dates'>{formatDateRange(order.checkin, order.checkout)}</div>
                      
                  
                    </div>
                      <img src={order?.stay?.imgUrls[0]} alt={order?.stay?.name} className='order-img grid-order-img' onClick={() => navigate(`/stay/${order?.stay._id}`)} />
                  </div>
                  
                  <div className="buyer-order-status">
                  <div className='preview-cell buyer grid-buyer'>
                    <span>{order.buyer?.fullname.split(' ')[0] || 'Unknown'}</span>
                    <span><img src={order?.buyer?.imgUrl} alt={order?.buyer} className='buyer-avatar' /></span>
                  </div>
                  <div className={`preview-cell order-status mobile`}>
                    <span className={`${order.status}`}></span>
                    <span className="status-label">{order.status.charAt(0).toUpperCase()}{order.status.slice(1).toLowerCase()}</span>
                  </div>
                  </div>

                  <div className='preview-cell total-price grid-total-price'>
                    {currencySymbol({ currency: order.currency })}
                    {order.priceDetails?.total?.toFixed(2) || 0}
                  </div>
                  <div className={`preview-cell order-status desktop`}>
                    <span className={`${order.status}`}></span>
                    {order.status.charAt(0).toUpperCase()}{order.status.slice(1).toLowerCase()}
                  </div>

                    <div className={`preview-cell actions ${order.status}`}>
                    {order.status === 'pending' ? (
                      <>
                        <button className='btn-approve' onClick={() => handleApprove(order)}>
                          Approve
                        </button>
                        <button className='btn-decline' onClick={() => handleDecline(order)}>
                          Decline
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#999' }}>—</span>
                    )}
                  </div>
                  {/* </div> */}

                  {/* <div className="mobile-display">
                  <div className='stay-name grid-stay-name' onClick={() => navigate(`/stay/${stay._id}`)}>{order.stay?.name || 'N/A'}</div>
                  <div className='dates grid-dates'>{formatDate(order.checkin).slice(4)} - {formatDate(order.checkout).slice(4)}</div>
                  <img src={order?.stay?.imgUrls[0]} alt={order?.stay?.name} className='order-img grid-order-img' onClick={() => navigate(`/stay/${order?.stay._id}`)} />
                  <div className={`preview-cell order-status grid-order-status`}>
                    <span className={`${order.status}`}></span>
                    {order.status.charAt(0).toUpperCase()}{order.status.slice(1).toLowerCase()}
                  </div>
                  <div className='preview-cell buyer grid-buyer'>
                    <span><img src={order?.buyer?.imgUrl} alt={order?.buyer} className='buyer-avatar' /></span>
                    <span>{order.buyer?.fullname || 'Unknown'}</span>
                  </div>
                  <div className='preview-cell total-price grid-total-price'>
                    {currencySymbol({ currency: order.currency })}
                    {order.priceDetails?.total?.toFixed(2) || 0}
                  </div>
                  <div className='preview-cell actions'>
                    {order.status === 'pending' ? (
                      <>
                        <button className='btn-approve' onClick={() => handleApprove(order)}>
                          Approve
                        </button>
                        <button className='btn-decline' onClick={() => handleDecline(order)}>
                          Decline
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#999' }}>—</span>
                    )}
                  </div>
                    </div> */}
                </div>


              ))}
            {/* </tbody> */}
          </div>

          {/* <div className='paging'>
          <button disabled={page === 0} onClick={() => setPage((prev) => prev - 1)}>
            ←
          </button>
          <span>
            {page + 1} / {Math.ceil(orders.length / pageSize)}
          </span>
          <button disabled={(page + 1) * pageSize >= orders.length} onClick={() => setPage((prev) => prev + 1)}>
            →
          </button>
        </div> */}

          {isApproveModalOpen && selectedOrder && (
            <OrderConfirmationModal
              orderId={selectedOrder._id}
              onClose={() => {
                setIsApproveModalOpen(false)
                setSelectedOrder(null)
              }}

              onApproved={async (updatedOrder) => {
                const buyer = await userService.getById(updatedOrder.userId)
                const stay = await stayService.getById(updatedOrder.stayId)
                const enrichedOrder = {
                  ...updatedOrder,
                  buyer,
                  stay,
                }
                setOrders((prev) => prev.map((o) => (o._id === enrichedOrder._id ? enrichedOrder : o)).sort((a, b) => {
                  if (a.status === 'pending' && b.status !== 'pending') return 1
                  if (a.status !== 'pending' && b.status === 'pending') return -1
                  return new Date(a.createdAt) - new Date(b.createdAt)
                }))
              }}


            />
          )}

          {isDeclineModalOpen && (
            <AppModal onClose={() => setIsDeclineModalOpen(false)}>
              <div className='decline-confirmation'>
                <h3>Are you sure you want to decline this reservation?</h3>
                <p>This action cannot be undone.</p>
                <div className='decline-modal-actions'>
                  <button className="cancel-btn" onClick={() => setIsDeclineModalOpen(false)} >Cancel</button>
                  <DynamicGradientButton onClick={confirmDecline}>Yes, Decline</DynamicGradientButton>
                </div>
              </div>
            </AppModal>
          )}
        </section>
      </>
      </div>
      <AppFooter/>
    </main>
  )
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toDateString()
}

