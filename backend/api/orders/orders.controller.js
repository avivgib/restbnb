import { orderService } from './orders.service.js'
import { logger } from '../../services/logger.service.js'

export async function getOrder(req, res) {
  try {
    const order = await orderService.getById(req.params.id)
    res.send(order)
  } catch (err) {
    logger.error('Failed to get order', err)
    res.status(400).send({ err: 'Failed to get order' })
  }
}

export async function getOrders(req, res) {
  try {
    const filterBy = {
      userId: req.query?.userId || '',
      hostId: req.query?.hostId || '',
      stayId: req.query?.stayId || '',
      status: req.query?.status || '',
      startDate: req.query?.startDate || '',
      endDate: req.query?.endDate || '',
    }
    const orders = await orderService.query(filterBy)
    res.send(orders)
  } catch (err) {
    logger.error('Failed to get orders', err)
    res.status(400).send({ err: 'Failed to get orders' })
  }
}

export async function deleteOrder(req, res) {
  try {
    await orderService.remove(req.params.id)
    res.send({ msg: 'Deleted successfully' })
  } catch (err) {
    logger.error('Failed to delete order', err)
    res.status(400).send({ err: 'Failed to delete order' })
  }
}

export async function updateOrder(req, res) {
  try {
    const order = req.body
    const savedOrder = await orderService.update(order)
    res.send(savedOrder)
  } catch (err) {
    logger.error('Failed to update order', err)
    res.status(400).send({ err: 'Failed to update order' })
  }
}

export async function addOrder(req, res) {
  try {
    const order = req.body
    const savedOrder = await orderService.add(order)
    res.send(savedOrder)
  } catch (err) {
    logger.error('Failed to add order', err)
    res.status(400).send({ err: 'Failed to add order' })
  }
}
