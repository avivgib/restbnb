import { storageService } from '../async-storage.service.js'
import { makeId } from '../util.service.js'

const STORAGE_KEY = 'orders'

export const orderService = {
  query,
  getById,
  save,
  remove,
}
window.csOrder = orderService

async function query(filterBy = {}) {
  let orders = await storageService.query(STORAGE_KEY)

  if (filterBy.userId) {
    orders = orders.filter((order) => order.userId === filterBy.userId)
  }

  if (filterBy.hostId) {
    orders = orders.filter((order) => order.hostId === filterBy.hostId)
  }

  if (filterBy.stayId) {
    orders = orders.filter((order) => order.stayId === filterBy.stayId)
  }

  if (filterBy.status) {
    orders = orders.filter((order) => order.status === filterBy.status)
  }

  return orders
}

function getById(orderId) {
  return storageService.get(STORAGE_KEY, orderId)
}

async function remove(orderId) {
  await storageService.remove(STORAGE_KEY, orderId)
}

async function save(order) {
  var savedOrder
  if (order._id) {
    savedOrder = await storageService.put(STORAGE_KEY, order)
  } else {
    order._id = makeId()
    order.createdAt = Date.now()
    savedOrder = await storageService.post(STORAGE_KEY, order)
  }
  return savedOrder
}
