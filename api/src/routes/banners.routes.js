import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { getActiveBanners, getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/banners.controller.js'

const router = Router()

router.get   ('/active', getActiveBanners)                                  // публичный
router.get   ('/',       requireAuth, requireRole('ADMIN'), getBanners)
router.post  ('/',       requireAuth, requireRole('ADMIN'), createBanner)
router.patch ('/:id',    requireAuth, requireRole('ADMIN'), updateBanner)
router.delete('/:id',    requireAuth, requireRole('ADMIN'), deleteBanner)

export default router
