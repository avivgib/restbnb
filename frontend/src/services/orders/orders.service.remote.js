import { httpService } from '../http.service.js'

const ENDPOINT = 'orders'

export const orderService = {
  query,
  getById,
  save,
  remove,
}

async function query(filterBy = {}) {
  const queryParams = {
    userId: filterBy.userId || '',
    hostId: filterBy.hostId || '',
    stayId: filterBy.stayId || '',
    status: filterBy.status || '',
    startDate: filterBy.startDate || '',
    endDate: filterBy.endDate || '',
  }
  console.log('Query params for orders:', queryParams)
  return await httpService.get(ENDPOINT, queryParams)
}

function getById(orderId) {
  return httpService.get(`${ENDPOINT}/${orderId}`)
}

async function remove(orderId) {
  return httpService.delete(`${ENDPOINT}/${orderId}`)
}

async function save(order) {
  var savedOrder
  if (order._id) {
    savedOrder = await httpService.put(`${ENDPOINT}/${order._id}`, order)
  } else {
    savedOrder = await httpService.post(ENDPOINT, order)
  }
  return savedOrder
}
