import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '../controllers/authors.controller.js'

const router = Router()

router.get   ('/',    getAuthors)                                           // публичный
router.post  ('/',    requireAuth, requireRole('ADMIN'), createAuthor)
router.patch ('/:id', requireAuth, requireRole('ADMIN'), updateAuthor)
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteAuthor)

export default router
