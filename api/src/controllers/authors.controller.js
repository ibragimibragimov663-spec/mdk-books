import prisma from '../lib/prisma.js'

export async function getAuthors(req, res, next) {
  try {
    const { q } = req.query
    const where = q ? { name: { contains: q, mode: 'insensitive' } } : {}
    const authors = await prisma.author.findMany({ where, orderBy: { name: 'asc' } })
    res.json(authors)
  } catch (err) { next(err) }
}

export async function createAuthor(req, res, next) {
  try {
    const author = await prisma.author.create({ data: { name: req.body.name } })
    res.status(201).json(author)
  } catch (err) { next(err) }
}

export async function updateAuthor(req, res, next) {
  try {
    const author = await prisma.author.update({
      where: { id: Number(req.params.id) },
      data:  { name: req.body.name },
    })
    res.json(author)
  } catch (err) { next(err) }
}

export async function deleteAuthor(req, res, next) {
  try {
    await prisma.author.delete({ where: { id: Number(req.params.id) } })
    res.json({ ok: true })
  } catch (err) { next(err) }
}
