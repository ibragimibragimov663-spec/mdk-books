import prisma from '../lib/prisma.js'

const include = {
  items: {
    include: {
      book: { select: { id: true, title: true, cover: true } },
    },
  },
}

// POST /api/orders  — публичный (оформление заказа)
export async function createOrder(req, res, next) {
  try {
    const { name, phone, email, comment, items } = req.body

    if (!name || !phone || !items?.length) {
      return res.status(400).json({ error: 'Обязательные поля: name, phone, items' })
    }

    // Получаем актуальные цены из БД
    const bookIds  = items.map(i => i.bookId)
    const books    = await prisma.book.findMany({ where: { id: { in: bookIds } } })
    const bookMap  = Object.fromEntries(books.map(b => [b.id, b]))

    const orderItems = items.map(i => {
      const book = bookMap[i.bookId]
      if (!book) throw Object.assign(new Error(`Книга ${i.bookId} не найдена`), { status: 400 })
      return { bookId: i.bookId, qty: i.qty, price: book.price }
    })

    const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0)

    const order = await prisma.order.create({
      data: {
        name, phone, email, comment,
        total,
        items: { create: orderItems },
      },
      include,
    })

    res.status(201).json(order)
  } catch (err) { next(err) }
}

// GET /api/orders  — admin
export async function getOrders(req, res, next) {
  try {
    const { status, page = 1, limit = 50 } = req.query
    const where = status ? { status } : {}
    const take  = Math.min(Number(limit), 100)
    const skip  = (Number(page) - 1) * take

    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, include, orderBy: { createdAt: 'desc' }, take, skip }),
      prisma.order.count({ where }),
    ])

    res.json({ orders, total })
  } catch (err) { next(err) }
}

// GET /api/orders/:id  — admin
export async function getOrder(req, res, next) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include,
    })
    if (!order) return res.status(404).json({ error: 'Заказ не найден' })
    res.json(order)
  } catch (err) { next(err) }
}

// PATCH /api/orders/:id  — admin (смена статуса)
export async function updateOrder(req, res, next) {
  try {
    const { status } = req.body
    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data:  { status },
      include,
    })
    res.json(order)
  } catch (err) { next(err) }
}
