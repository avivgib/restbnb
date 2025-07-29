const { DEV, VITE_LOCAL } = import.meta.env
import { getRandomIntInclusive, makeId } from '../util.service'

import { stayService as local } from './stay.service.local.js'
import { stayService as remote } from './stay.service.remote.js'

function getEmptyStay() {
  return {
    name: `Stay ${makeId()}`,
    price: getRandomIntInclusive(100, 400),
    loc: {
      lat: 51.505 + (Math.random() - 0.5) * 0.1,
      lng: -0.09 + (Math.random() - 0.5) * 0.1,
      address: 'Sample Address',
    },
    msgs: [],
  }
}

function getDefaultFilter() {
  return {
    location: '',
    checkIn: null,
    checkOut: null,
    guests: {
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0,
    },
  }
}

// console.log('VITE_LOCAL:', VITE_LOCAL)

const service = VITE_LOCAL === 'true' ? local : remote
export const stayService = { getEmptyStay, getDefaultFilter, ...service }

//* Easy access to this service from the dev tools console
//* when using script - dev / dev:local

if (DEV) window.stayService = stayService
