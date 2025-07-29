import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { ObjectId } from 'mongodb'

export const orderService = {
  query,
  getById,
  add,
  update,
  remove,
}

const COLLECTION_NAME = 'orders'

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy)
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const orders = await collection.find(criteria).toArray()
    return orders
  } catch (err) {
    logger.error('cannot find orders', err)
    throw err
  }
}

async function getById(orderId) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const order = await collection.findOne({ _id: ObjectId.createFromHexString(orderId) })
    return order
  } catch (err) {
    logger.error(`while finding order by id: ${orderId}`, err)
    throw err
  }
}

async function remove(orderId) {
  try {
    const collection = await dbService.getCollection(COLLECTION_NAME)
    await collection.deleteOne({ _id: ObjectId.createFromHexString(orderId) })
  } catch (err) {
    logger.error(`cannot remove order ${orderId}`, err)
    throw err
  }
}

async function update(order) {
  try {
    const orderToSave = {
      _id: ObjectId.createFromHexString(order._id),
      stayId: order.stayId,
      hostId: order.hostId,
      userId: order.userId,
      checkin: order.checkin,
      checkout: order.checkout,
      guests: order.guests,
      totalNights: order.totalNights,
      pricePerNight: order.pricePerNight,
      priceDetails: order.priceDetails,
      currency: order.currency,
      paymentOption: order.paymentOption,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      messageToHost: order.messageToHost,
      createdAt: order.createdAt,
      status: order.status,
      cancellationPolicy: order.cancellationPolicy,
      orderCode: order.orderCode,
      orderIdAirbnb: order.orderIdAirbnb,
      photoId: order.photoId,
      isWorkTrip: order.isWorkTrip,
    }

    const collection = await dbService.getCollection(COLLECTION_NAME)
    await collection.updateOne({ _id: orderToSave._id }, { $set: orderToSave })
    return orderToSave
  } catch (err) {
    logger.error(`cannot update order ${order._id}`, err)
    throw err
  }
}

async function add(order) {
  try {
    const orderToAdd = {
      stayId: order.stayId,
      hostId: order.hostId,
      userId: order.userId,
      checkin: order.checkin,
      checkout: order.checkout,
      guests: order.guests,
      totalNights: order.totalNights,
      pricePerNight: order.pricePerNight,
      priceDetails: order.priceDetails,
      currency: order.currency,
      paymentOption: order.paymentOption,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      messageToHost: order.messageToHost,
      createdAt: order.createdAt || Date.now(),
      status: order.status,
      cancellationPolicy: order.cancellationPolicy,
      orderCode: order.orderCode,
      orderIdAirbnb: order.orderIdAirbnb,
      photoId: order.photoId,
      isWorkTrip: order.isWorkTrip,
    }

    const collection = await dbService.getCollection(COLLECTION_NAME)
    const result = await collection.insertOne(orderToAdd)
    orderToAdd._id = result.insertedId
    return orderToAdd
  } catch (err) {
    logger.error('cannot add order', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}

  if (filterBy.userId) {
    criteria.userId = filterBy.userId
  }

  if (filterBy.hostId) {
    criteria.hostId = filterBy.hostId
  }

  if (filterBy.stayId) {
    criteria.stayId = filterBy.stayId
  }

  if (filterBy.status) {
    criteria.status = filterBy.status
  }

  if (filterBy.startDate || filterBy.endDate) {
    criteria.checkin = {}
    if (filterBy.startDate) {
      criteria.checkin.$gte = filterBy.startDate
    }
    if (filterBy.endDate) {
      criteria.checkin.$lte = filterBy.endDate
    }
  }

  return criteria
}
