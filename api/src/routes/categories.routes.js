import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categories.controller.js'

const router = Router()

router.get   ('/',    getCategories)                                           // публичный
router.post  ('/',    requireAuth, requireRole('ADMIN'), createCategory)
router.patch ('/:id', requireAuth, requireRole('ADMIN'), updateCategory)
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteCategory)

export default router
