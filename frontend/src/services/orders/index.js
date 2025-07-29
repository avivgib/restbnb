const { DEV, VITE_LOCAL } = import.meta.env
//import { makeId } from '../util.service'

import { orderService as local } from './orders.service.local.js'
import { orderService as remote } from './orders.service.remote.js'

function getEmptyOrder() {
  return {
    stayId: '',
    hostId: '',
    userId: '',
    checkin: '',
    checkout: '',
    guests: {
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0,
      total: 1,
    },
    totalNights: 1,
    pricePerNight: 0,
    priceDetails: {
      nightsSubtotal: 0,
      cleaningFee: 0,
      serviceFee: 0,
      taxes: 0,
      total: 0,
    },
    currency: 'USD',
    paymentOption: 'full',
    paymentMethod: {
      type: '',
      last4: '',
      label: '',
    },
    paymentStatus: 'pending',
    messageToHost: '',
    createdAt: Date.now(),
    status: 'pending',
    cancellationPolicy: '',
    orderCode: '',
    orderIdAirbnb: '',
    photoId: '',
    isWorkTrip: false,
  }
}

function getDefaultFilter() {
  return {
    userId: '',
    hostId: '',
    stayId: '',
    status: '',
    startDate: '',
    endDate: '',
  }
}

const service = VITE_LOCAL === 'true' ? local : remote
export const orderService = { getEmptyOrder, getDefaultFilter, ...service }

if (DEV) window.orderService = orderService
