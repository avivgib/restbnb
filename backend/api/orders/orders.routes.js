import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'

import { getOrder, getOrders, deleteOrder, updateOrder, addOrder } from './orders.controller.js'

const router = express.Router()
router.get('/', getOrders)
router.get('/:id', getOrder)
router.post('/', requireAuth, addOrder)
router.put('/:id', requireAuth, updateOrder)
router.delete('/:id', requireAuth, requireAdmin, deleteOrder)

export const orderRoutes = router
