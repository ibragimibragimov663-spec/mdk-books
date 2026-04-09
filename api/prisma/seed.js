import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  // ── Admin user ──────────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where:  { login: 'admin' },
    update: {},
    create: {
      name:         'Администратор',
      login:        'admin',
      passwordHash: await bcrypt.hash('admin123', 10),
      role:         'ADMIN',
    },
  })

  // ── Categories ──────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'fiction'     }, update: {}, create: { slug: 'fiction',     name: 'Художественная', order: 1 } }),
    prisma.category.upsert({ where: { slug: 'non-fiction' }, update: {}, create: { slug: 'non-fiction', name: 'Нон-фикшн',       order: 2 } }),
    prisma.category.upsert({ where: { slug: 'business'    }, update: {}, create: { slug: 'business',    name: 'Бизнес',          order: 3 } }),
    prisma.category.upsert({ where: { slug: 'psychology'  }, update: {}, create: { slug: 'psychology',  name: 'Психология',      order: 4 } }),
    prisma.category.upsert({ where: { slug: 'children'    }, update: {}, create: { slug: 'children',    name: 'Детям',           order: 5 } }),
    prisma.category.upsert({ where: { slug: 'science'     }, update: {}, create: { slug: 'science',     name: 'Наука',           order: 6 } }),
    prisma.category.upsert({ where: { slug: 'history'     }, update: {}, create: { slug: 'history',     name: 'История',         order: 7 } }),
  ])

  const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]))

  // ── Authors ─────────────────────────────────────────────────────────────────
  const authorsData = [
    'Джеймс Клир', 'Михаил Булгаков', 'Дэниел Канеман',
    'Юваль Ной Харари', 'Хулио Кортасар', 'Стивен Хокинг',
    'Питер Тиль', 'Фёдор Достоевский',
  ]

  const authors = {}
  for (const name of authorsData) {
    const a = await prisma.author.upsert({
      where:  { id: (await prisma.author.findFirst({ where: { name } }))?.id ?? 0 },
      update: {},
      create: { name },
    })
    authors[name] = a.id
  }

  // ── Books ───────────────────────────────────────────────────────────────────
  const books = [
    { title: 'Атомные привычки',                  authorName: 'Джеймс Клир',        slug: 'non-fiction', price: 890,  oldPrice: 1190, isPopular: true,  rating: 4.8, reviewCount: 2341 },
    { title: 'Мастер и Маргарита',                authorName: 'Михаил Булгаков',     slug: 'fiction',     price: 650,  oldPrice: null, isPopular: true,  rating: 4.9, reviewCount: 5120 },
    { title: 'Думай медленно... Решай быстро',    authorName: 'Дэниел Канеман',      slug: 'psychology',  price: 990,  oldPrice: 1290, isPopular: true,  rating: 4.7, reviewCount: 1876 },
    { title: 'Сапиенс',                           authorName: 'Юваль Ной Харари',    slug: 'history',     price: 1100, oldPrice: null, isPopular: true,  rating: 4.6, reviewCount: 3200 },
    { title: 'Игра в классики',                   authorName: 'Хулио Кортасар',      slug: 'fiction',     price: 720,  oldPrice: null, isNew: true,      rating: 4.5, reviewCount: 890  },
    { title: 'Краткие ответы на большие вопросы', authorName: 'Стивен Хокинг',       slug: 'science',     price: 780,  oldPrice: 950,  rating: 4.8,      reviewCount: 1540 },
    { title: 'От нуля к единице',                 authorName: 'Питер Тиль',          slug: 'business',    price: 860,  oldPrice: null, isPopular: true,  rating: 4.6, reviewCount: 2100, available: false },
    { title: 'Преступление и наказание',          authorName: 'Фёдор Достоевский',   slug: 'fiction',     price: 590,  oldPrice: null, rating: 4.7,      reviewCount: 4300 },
  ]

  for (const b of books) {
    const existing = await prisma.book.findFirst({ where: { title: b.title } })
    if (!existing) {
      await prisma.book.create({
        data: {
          title:       b.title,
          authorId:    authors[b.authorName],
          categoryId:  catMap[b.slug],
          price:       b.price,
          oldPrice:    b.oldPrice ?? null,
          available:   b.available ?? true,
          isNew:       b.isNew ?? false,
          isPopular:   b.isPopular ?? false,
          rating:      b.rating ?? 0,
          reviewCount: b.reviewCount ?? 0,
        },
      })
    }
  }

  console.log('✅ Seed complete')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
