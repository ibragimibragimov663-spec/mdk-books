import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma.js'
import { signAccess, signRefresh, verifyRefresh } from '../lib/jwt.js'

function ms(str) {
  const map = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
  const [, n, u] = str.match(/^(\d+)([smhd])$/) || []
  return n ? Number(n) * (map[u] || 1000) : 15 * 60 * 1000
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { login, password } = req.body
    const user = await prisma.user.findUnique({ where: { login } })
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Неверный логин или пароль' })
    }
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Неверный логин или пароль' })

    const payload      = { id: user.id, role: user.role }
    const accessToken  = signAccess(payload)
    const refreshToken = signRefresh(payload)

    const exp = process.env.JWT_REFRESH_EXPIRES || '30d'
    await prisma.refreshToken.create({
      data: {
        token:     refreshToken,
        userId:    user.id,
        expiresAt: new Date(Date.now() + ms(exp)),
      },
    })

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, role: user.role },
    })
  } catch (err) { next(err) }
}

// POST /api/auth/refresh
export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken обязателен' })

    let payload
    try { payload = verifyRefresh(refreshToken) }
    catch { return res.status(401).json({ error: 'Токен недействителен' }) }

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Токен истёк или не найден' })
    }

    const newAccess  = signAccess({ id: payload.id, role: payload.role })
    res.json({ accessToken: newAccess })
  } catch (err) { next(err) }
}

// POST /api/auth/logout
export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }
    res.json({ ok: true })
  } catch (err) { next(err) }
}
