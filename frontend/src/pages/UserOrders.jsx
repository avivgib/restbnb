import { useEffect, useState } from 'react'
import { AppHeader } from '../cmps/AppHeader'
import { MyReservationsHeader } from '../cmps/MyReservationsHeader'
import { AirbnbLoader } from '../cmps/AirbnbLoader.jsx'
import { OrderPreview } from '../cmps/OrderPreview.jsx'

import { orderService } from '../services/orders'
import { stayService } from '../services/stay'
import { userService } from '../services/user'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { socketService, SOCKET_EVENT_ORDER_ADDED, SOCKET_EVENT_ORDER_UPDATED } from '../services/socket.service'

import { AppFooter } from '../cmps/AppFooter'


export function UserOrders() {
  const [orders, setOrders] = useState([])
  const [staysMap, setStaysMap] = useState({})
  const [hostsMap, setHostsMap] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const loggedinUser = userService.getLoggedinUser()

  useEffect(() => {
    if (!loggedinUser) return;
    loadOrders()

    socketService.on(SOCKET_EVENT_ORDER_ADDED, handleNewOrder)
    socketService.on(SOCKET_EVENT_ORDER_UPDATED, handleOrderUpdate)

    return () => {
      socketService.off(SOCKET_EVENT_ORDER_ADDED, handleNewOrder)
      socketService.off(SOCKET_EVENT_ORDER_UPDATED, handleOrderUpdate)
    }
  }, [loggedinUser?._id])

  async function handleNewOrder(order) {
    if (order.userId !== loggedinUser._id) return
    try {
      const stay = await stayService.getById(order.stayId)
      const host = await userService.getById(stay.host._id)
      setOrders((prevOrders) => [...prevOrders, order].sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1
        if (a.status !== 'pending' && b.status === 'pending') return 1
        return b.createdAt - a.createdAt;
      }))
      setStaysMap((prev) => ({ ...prev, [stay._id]: stay }))
      setHostsMap((prev) => ({ ...prev, [host._id]: host }))
    } catch (err) {
      console.error('Error processing new order:', err);
    }
  }

  async function handleOrderUpdate(order) {
    if (order.userId !== loggedinUser._id) return;
    console.log('Received order-updated event:', order._id, 'status:', order.status);
    try {
      const stay = staysMap[order.stayId] || await stayService.getById(order.stayId);
      const host = hostsMap[stay.host._id] || await userService.getById(stay.host._id);
      setOrders((prevOrders) => {
        const newOrders = prevOrders.map((o) => (o._id === order._id ? order : o));
        console.log('Updated orders state:', newOrders);
        return newOrders;
      });
      setStaysMap((prev) => ({ ...prev, [stay._id]: stay }));
      setHostsMap((prev) => ({ ...prev, [host._id]: host }));
      if (order.status === 'approved') {
        showSuccessMsg('Your order was approved!');
      } else if (order.status === 'declined') {
        showErrorMsg('Your order was declined.');
      }
    } catch (err) {
      console.error('Error processing order update:', err);
    }
  }

  async function loadOrders() {
    try {
      const userOrders = await orderService.query({ userId: loggedinUser._id })
      setOrders(userOrders)

      const stayIds = [...new Set(userOrders.map((order) => order.stayId))]
      const stays = await Promise.all(stayIds.map((stayId) => stayService.getById(stayId)))
      const staysMap = {}
      stays.forEach((stay) => (staysMap[stay._id] = stay))
      setStaysMap(staysMap)

      const hostIds = [...new Set(stays.map((stay) => stay.host._id))]
      const hosts = await Promise.all(hostIds.map((hostId) => userService.getById(hostId)))
      const hostsMap = {}
      hosts.forEach((host) => (hostsMap[host._id] = host))
      setHostsMap(hostsMap)
    } catch (err) {
      showErrorMsg('Failed to load your orders')
    } finally {
      setIsLoading(false)
    }
  }
  

  if (!loggedinUser) return <div className='user-orders-msg'>Please log in to view your orders.</div>
  if (isLoading) return <AirbnbLoader />

  return (
    <main className='user-orders'>
      <div className="orders-main-container">
      <div className='header'>
        {/* <AppHeader /> */}
        <MyReservationsHeader />
      </div>

      <section className='orders-section'>
        <h1>My Reservations</h1>

        {orders.length === 0 ? (
          <p className='no-orders'>You have no reservations yet.</p>

        ) : (

          <>
            <ul className='order-list'>
              {orders.slice().reverse().map((order) => {
                const stay = staysMap[order.stayId]
                const host = hostsMap[stay.host._id]
                return (
                  <li key={order._id}>
                    <OrderPreview order={order} stay={stay} host={host} />
                  </li>
                )
              })}
            </ul>
          </>

        )}
      </section>
      </div>
      <AppFooter/>
    </main>
  )
}
