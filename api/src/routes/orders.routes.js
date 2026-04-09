import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { createOrder, getOrders, getOrder, updateOrder } from '../controllers/orders.controller.js'

const router = Router()

router.post  ('/',    createOrder)                                            // публичный
router.get   ('/',    requireAuth, requireRole('ADMIN'), getOrders)
router.get   ('/:id', requireAuth, requireRole('ADMIN'), getOrder)
router.patch ('/:id', requireAuth, requireRole('ADMIN'), updateOrder)

export default router
