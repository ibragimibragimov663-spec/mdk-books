# МДК. Дом книги — API

Node.js + Express + Prisma + PostgreSQL

## Стек
- Node.js ≥ 20 (ESM)
- Express 4
- Prisma 5 + PostgreSQL
- bcryptjs, jsonwebtoken, multer

## Запуск

```bash
cd books-service/api
npm install
cp .env.example .env
# Заполни DATABASE_URL в .env

npm run db:push    # применить схему к БД
npm run db:seed    # засеять начальные данные (admin + книги)
npm run dev        # запуск с nodemon
```

API доступен на http://localhost:4000

## Роуты

### Публичные
| Метод | URL | Описание |
|-------|-----|----------|
| GET | /api/books | Каталог (фильтры: category, q, minPrice, maxPrice, minRating, inStock, onSale, sort, page, limit) |
| GET | /api/books/:id | Книга |
| GET | /api/categories | Категории |
| GET | /api/authors | Авторы |
| GET | /api/banners/active | Активные баннеры |
| POST | /api/orders | Создать заказ |
| POST | /api/auth/login | Вход |
| POST | /api/auth/refresh | Обновить токен |
| POST | /api/auth/logout | Выход |

### Admin (Bearer token)
| Метод | URL | Описание |
|-------|-----|----------|
| POST/PATCH/DELETE | /api/books | CRUD книг |
| POST/PATCH/DELETE | /api/banners | CRUD баннеров |
| POST/PATCH/DELETE | /api/categories | CRUD категорий |
| POST/PATCH/DELETE | /api/authors | CRUD авторов |
| GET/PATCH | /api/orders | Заказы + смена статуса |
| POST | /api/upload | Загрузка изображения |

## Admin по умолчанию
```
login:    admin
password: admin123
```
Сменить после первого входа!
