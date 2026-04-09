import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { getBooks, getBook, createBook, updateBook, deleteBook } from '../controllers/books.controller.js'

const router = Router()

router.get   ('/',    getBooks)
router.get   ('/:id', getBook)
router.post  ('/',    requireAuth, requireRole('ADMIN'), createBook)
router.patch ('/:id', requireAuth, requireRole('ADMIN'), updateBook)
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteBook)

export default router
