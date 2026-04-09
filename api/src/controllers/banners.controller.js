import prisma from '../lib/prisma.js'

// GET /api/banners/active  — публичный
export async function getActiveBanners(req, res, next) {
  try {
    const banners = await prisma.banner.findMany({
      where:   { active: true },
      orderBy: { order: 'asc' },
    })
    res.json(banners)
  } catch (err) { next(err) }
}

// GET /api/banners  — admin
export async function getBanners(req, res, next) {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } })
    res.json(banners)
  } catch (err) { next(err) }
}

// POST /api/banners  — admin
export async function createBanner(req, res, next) {
  try {
    const { image, active, order } = req.body
    if (!image) return res.status(400).json({ error: 'image обязателен' })
    const banner = await prisma.banner.create({
      data: { image, active: active ?? true, order: order ?? 0 },
    })
    res.status(201).json(banner)
  } catch (err) { next(err) }
}

// PATCH /api/banners/:id  — admin
export async function updateBanner(req, res, next) {
  try {
    const { image, active, order } = req.body
    const data = {}
    if (image  !== undefined) data.image  = image
    if (active !== undefined) data.active = active
    if (order  !== undefined) data.order  = Number(order)
    const banner = await prisma.banner.update({
      where: { id: Number(req.params.id) },
      data,
    })
    res.json(banner)
  } catch (err) { next(err) }
}

// DELETE /api/banners/:id  — admin
export async function deleteBanner(req, res, next) {
  try {
    await prisma.banner.delete({ where: { id: Number(req.params.id) } })
    res.json({ ok: true })
  } catch (err) { next(err) }
}
