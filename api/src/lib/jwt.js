import jwt from 'jsonwebtoken'

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET  || 'dev_access_secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret'
const ACCESS_EXP     = process.env.JWT_ACCESS_EXPIRES  || '15m'
const REFRESH_EXP    = process.env.JWT_REFRESH_EXPIRES || '30d'

export const signAccess  = (payload) => jwt.sign(payload, ACCESS_SECRET,  { expiresIn: ACCESS_EXP })
export const signRefresh = (payload) => jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP })
export const verifyAccess  = (token) => jwt.verify(token, ACCESS_SECRET)
export const verifyRefresh = (token) => jwt.verify(token, REFRESH_SECRET)
