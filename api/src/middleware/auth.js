import { verifyAccess } from '../lib/jwt.js'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' })
  }
  try {
    const payload = verifyAccess(header.slice(7))
    req.user = { id: payload.id, role: payload.role }
    next()
  } catch {
    return res.status(401).json({ error: 'Токен недействителен или истёк' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Требуется авторизация' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Нет доступа' })
    }
    next()
  }
}
