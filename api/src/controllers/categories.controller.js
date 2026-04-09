import prisma from '../lib/prisma.js'

export async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } })
    res.json(categories)
  } catch (err) { next(err) }
}

export async function createCategory(req, res, next) {
  try {
    const { slug, name, order } = req.body
    const cat = await prisma.category.create({
      data: { slug, name, order: order ?? 0 },
    })
    res.status(201).json(cat)
  } catch (err) { next(err) }
}

export async function updateCategory(req, res, next) {
  try {
    const { slug, name, order } = req.body
    const data = {}
    if (slug  !== undefined) data.slug  = slug
    if (name  !== undefined) data.name  = name
    if (order !== undefined) data.order = Number(order)
    const cat = await prisma.category.update({ where: { id: Number(req.params.id) }, data })
    res.json(cat)
  } catch (err) { next(err) }
}

export async function deleteCategory(req, res, next) {
  try {
    await prisma.category.delete({ where: { id: Number(req.params.id) } })
    res.json({ ok: true })
  } catch (err) { next(err) }
}
