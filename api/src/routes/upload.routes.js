import { Router } from 'express'
import multer       from 'multer'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

const CLOUDINARY_CONFIGURED =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY    &&
  process.env.CLOUDINARY_API_SECRET

let upload

if (CLOUDINARY_CONFIGURED) {
  // ── Cloudinary (production) ────────────────────────────────────────────────
  const { v2: cloudinary }    = await import('cloudinary')
  const { CloudinaryStorage } = await import('multer-storage-cloudinary')

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder:          'mdk-books',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
    },
  })

  upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } })

} else {
  // ── Локальный диск (dev) ───────────────────────────────────────────────────
  const path              = await import('path')
  const { fileURLToPath } = await import('url')
  const { mkdirSync }     = await import('fs')

  const __dirname   = path.default.dirname(fileURLToPath(import.meta.url))
  const UPLOADS_DIR = path.default.join(__dirname, '../../uploads')
  mkdirSync(UPLOADS_DIR, { recursive: true })

  const diskStorage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename:    (_req, file, cb) => {
      const ext  = path.default.extname(file.originalname).toLowerCase()
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
      cb(null, name)
    },
  })

  upload = multer({
    storage: diskStorage,
    limits:  { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const ok = /jpeg|jpg|png|webp/.test(file.mimetype)
      ok ? cb(null, true) : cb(new Error('Только изображения: jpg, png, webp'))
    },
  })
}

// POST /api/upload
router.post('/', requireAuth, requireRole('ADMIN'), upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не получен' })
  const url = req.file.path?.startsWith('http')
    ? req.file.path
    : `/uploads/${req.file.filename}`
  res.json({ url })
})

export default router
