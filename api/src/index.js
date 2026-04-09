import 'dotenv/config'
import express from 'express'
import cors    from 'cors'
import path    from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync } from 'fs'

import authRoutes       from './routes/auth.routes.js'
import booksRoutes      from './routes/books.routes.js'
import bannersRoutes    from './routes/banners.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import authorsRoutes    from './routes/authors.routes.js'
import ordersRoutes     from './routes/orders.routes.js'
import uploadRouter     from './routes/upload.routes.js'
import { errorHandler } from './middleware/errorHandler.js'
import prisma           from './lib/prisma.js'

const __dirname   = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '../uploads')
mkdirSync(UPLOADS_DIR, { recursive: true })

const app  = express()
const PORT = process.env.PORT || 4000

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(UPLOADS_DIR))

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes)
app.use('/api/books',      booksRoutes)
app.use('/api/banners',    bannersRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/authors',    authorsRoutes)
app.use('/api/orders',     ordersRoutes)
app.use('/api/upload',     uploadRouter)

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, db: 'ok', time: new Date() })
  } catch {
    res.status(503).json({ ok: false, db: 'error', time: new Date() })
  }
})

// ─── Serve frontend (production) ──────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const DIST = path.join(__dirname, '../../app/dist')
  app.use(express.static(DIST))
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(DIST, 'index.html')))
}

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler)

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`📚  МДК API running at http://localhost:${PORT}`)
})
