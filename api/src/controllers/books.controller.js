import prisma from '../lib/prisma.js'

const include = {
  author:   { select: { id: true, name: true } },
  category: { select: { id: true, slug: true, name: true } },
}

// GET /api/books
export async function getBooks(req, res, next) {
  try {
    const {
      category, q, minPrice, maxPrice, minRating,
      inStock, onSale, isNew, isPopular,
      sort = 'popular', page = 1, limit = 48,
    } = req.query

    const where = {}

    if (category && category !== 'all') {
      where.category = { slug: category }
    }

    if (q) {
      where.OR = [
        { title:       { contains: q, mode: 'insensitive' } },
        { author:      { name: { contains: q, mode: 'insensitive' } } },
        { isbn:        { contains: q } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number(minPrice)
      if (maxPrice) where.price.lte = Number(maxPrice)
    }

    if (minRating) where.rating = { gte: Number(minRating) }
    if (inStock === 'true')   where.available = true
    if (onSale  === 'true')   where.oldPrice  = { not: null }
    if (isNew   === 'true')   where.isNew     = true
    if (isPopular === 'true') where.isPopular = true

    const orderBy = {
      popular:    { reviewCount: 'desc' },
      new:        { createdAt:   'desc' },
      price_asc:  { price:       'asc'  },
      price_desc: { price:       'desc' },
      rating:     { rating:      'desc' },
    }[sort] || { reviewCount: 'desc' }

    const take = Math.min(Number(limit), 100)
    const skip = (Number(page) - 1) * take

    const [books, total] = await Promise.all([
      prisma.book.findMany({ where, include, orderBy, take, skip }),
      prisma.book.count({ where }),
    ])

    res.json({ books, total, page: Number(page), limit: take })
  } catch (err) { next(err) }
}

// GET /api/books/:id
export async function getBook(req, res, next) {
  try {
    const book = await prisma.book.findUnique({
      where:   { id: Number(req.params.id) },
      include,
    })
    if (!book) return res.status(404).json({ error: 'Книга не найдена' })
    res.json(book)
  } catch (err) { next(err) }
}

// POST /api/books  (admin)
export async function createBook(req, res, next) {
  try {
    const {
      title, authorId, categoryId, description,
      price, oldPrice, cover, isbn, publisher,
      year, pages, available, isNew, isPopular,
    } = req.body

    const book = await prisma.book.create({
      data: {
        title, authorId: Number(authorId), categoryId: Number(categoryId),
        description, price: Number(price),
        oldPrice:  oldPrice  ? Number(oldPrice)  : null,
        cover, isbn, publisher,
        year:  year  ? Number(year)  : null,
        pages: pages ? Number(pages) : null,
        available: available ?? true,
        isNew:     isNew     ?? false,
        isPopular: isPopular ?? false,
      },
      include,
    })
    res.status(201).json(book)
  } catch (err) { next(err) }
}

// PATCH /api/books/:id  (admin)
export async function updateBook(req, res, next) {
  try {
    const fields = [
      'title','authorId','categoryId','description','price','oldPrice',
      'cover','isbn','publisher','year','pages','available','isNew','isPopular',
      'rating','reviewCount',
    ]
    const data = {}
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        const numFields = ['authorId','categoryId','price','oldPrice','year','pages','reviewCount']
        data[f] = numFields.includes(f) && req.body[f] !== null
          ? Number(req.body[f])
          : req.body[f]
      }
    }

    const book = await prisma.book.update({
      where:  { id: Number(req.params.id) },
      data,
      include,
    })
    res.json(book)
  } catch (err) { next(err) }
}

// DELETE /api/books/:id  (admin)
export async function deleteBook(req, res, next) {
  try {
    await prisma.book.delete({ where: { id: Number(req.params.id) } })
    res.json({ ok: true })
  } catch (err) { next(err) }
}
