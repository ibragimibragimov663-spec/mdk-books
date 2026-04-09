# МДК. Дом книги — Документация проекта

## Что это за проект

**МДК. Дом книги** — полноценный интернет-магазин книг с публичным каталогом и административной панелью.

Проект состоит из двух частей:
- `api/` — бэкенд (REST API, база данных, загрузка файлов)
- `app/` — фронтенд (интерфейс магазина)

Визуальная концепция вдохновлена российскими книжными сервисами (Читай-город, Book24). Шрифт — Inter. Цветовая схема — тёмно-зелёный (`#0D7377`) как основной акцент.

---

## Структура проекта

```
books-service/
├── api/                         ← Бэкенд
│   ├── prisma/
│   │   ├── schema.prisma        ← Схема базы данных
│   │   └── seed.js              ← Начальные данные (категории, книги, admin)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── books.controller.js
│   │   │   ├── banners.controller.js
│   │   │   ├── categories.controller.js
│   │   │   ├── authors.controller.js
│   │   │   ├── orders.controller.js
│   │   │   └── auth.controller.js
│   │   ├── routes/
│   │   │   ├── books.routes.js
│   │   │   ├── banners.routes.js
│   │   │   ├── categories.routes.js
│   │   │   ├── orders.routes.js
│   │   │   └── auth.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.js          ← Проверка JWT токена
│   │   │   └── errorHandler.js
│   │   ├── lib/
│   │   │   ├── prisma.js        ← Singleton клиент БД
│   │   │   └── jwt.js           ← Подпись и верификация токенов
│   │   └── index.js             ← Точка входа сервера
│   ├── uploads/                 ← Загруженные изображения (локально)
│   ├── .env                     ← Переменные окружения (создать вручную)
│   ├── .env.example             ← Шаблон для .env
│   └── package.json
│
└── app/                         ← Фронтенд
    ├── src/
    │   ├── styles/
    │   │   └── globals.css      ← CSS-переменные и reset
    │   ├── components/
    │   │   ├── Header/          ← Логотип, поиск, корзина, категории
    │   │   ├── Banner/          ← Слайдер баннеров (только картинка)
    │   │   ├── BookCard/        ← Карточка книги
    │   │   ├── BookGrid/        ← Сетка книг + тулбар сортировки
    │   │   ├── Filters/         ← Сайдбар фильтров
    │   │   └── Footer/          ← Подвал с контактами
    │   ├── pages/
    │   │   └── client/
    │   │       └── CatalogPage.jsx   ← Главная страница
    │   ├── context/
    │   │   └── CartContext.jsx  ← Состояние корзины (React Context)
    │   ├── lib/
    │   │   └── api.js           ← HTTP-клиент для запросов к API
    │   ├── constants/
    │   │   └── mock.js          ← Заглушки данных (до подключения API)
    │   ├── App.jsx              ← Роутинг
    │   └── main.jsx             ← Точка входа React
    ├── .env.example
    └── package.json
```

---

## Технологии

### Бэкенд (`api/`)

| Пакет | Версия | Зачем |
|---|---|---|
| Node.js | ≥ 20 | Среда выполнения |
| Express | ^4.19 | HTTP-сервер и роутинг |
| Prisma | ^5.14 | ORM для работы с PostgreSQL |
| PostgreSQL | ≥ 14 | База данных |
| bcryptjs | ^2.4 | Хэширование паролей |
| jsonwebtoken | ^9.0 | JWT авторизация |
| multer | ^2.1 | Загрузка изображений |
| cors | ^2.8 | Разрешение запросов с фронта |
| dotenv | ^16.4 | Переменные окружения |
| nodemon | ^3.1 | Горячая перезагрузка в dev |

### Фронтенд (`app/`)

| Пакет | Версия | Зачем |
|---|---|---|
| Node.js | ≥ 20 | Для запуска Vite |
| React | ^18.2 | UI-библиотека |
| React Router | ^6.22 | Клиентский роутинг |
| Vite | ^5.2 | Сборщик и dev-сервер |
| lucide-react | ^0.363 | Иконки |
| clsx | ^2.1 | Утилита для классов |

---

## Что нужно установить перед запуском

### 1. Node.js (≥ 20)

Скачать: https://nodejs.org/en/download

Проверить установку:
```bash
node -v   # должно быть v20.x.x или выше
npm -v
```

### 2. PostgreSQL (≥ 14)

Скачать: https://www.postgresql.org/download/windows/

При установке запомни:
- Порт: `5432` (по умолчанию)
- Пользователь: `postgres`
- Пароль: задаёшь сам при установке

После установки создай базу данных. Через pgAdmin или через psql:
```sql
CREATE DATABASE books_db;
```

---

## Запуск проекта

### Шаг 1 — Настройка бэкенда

```bash
cd books-service/api
```

Создай файл `.env` (скопируй из `.env.example` и заполни):

```env
DATABASE_URL="postgresql://postgres:ТВОЙпароль@localhost:5432/books_db"
PORT=4000
CLIENT_URL=http://localhost:3000

JWT_ACCESS_SECRET=придумай_любую_строку_посложнее
JWT_REFRESH_SECRET=другую_строку_тоже_сложную
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d
```

Установи зависимости и подними базу:

```bash
npm install
npm run db:push     # создаёт таблицы в PostgreSQL
npm run db:seed     # заполняет начальными данными (категории, книги, admin)
npm run dev         # запускает сервер на http://localhost:4000
```

### Шаг 2 — Настройка фронтенда

В новом терминале:

```bash
cd books-service/app
```

Создай файл `.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

```bash
npm install
npm run dev         # запускает на http://localhost:3000
```

---

## API — список эндпоинтов

### Публичные (без авторизации)

```
GET    /api/books              — список книг (с фильтрами и пагинацией)
GET    /api/books/:id          — одна книга
GET    /api/banners/active     — активные баннеры
GET    /api/categories         — список категорий
GET    /api/authors            — список авторов
POST   /api/orders             — создать заказ
POST   /api/auth/login         — вход в админку
POST   /api/auth/refresh       — обновить access token
POST   /api/auth/logout        — выход
GET    /api/health             — проверка состояния сервера и БД
```

### Только для ADMIN (нужен Bearer токен)

```
POST   /api/books              — добавить книгу
PATCH  /api/books/:id          — редактировать книгу
DELETE /api/books/:id          — удалить книгу

GET    /api/banners            — все баннеры
POST   /api/banners            — добавить баннер
PATCH  /api/banners/:id        — редактировать баннер
DELETE /api/banners/:id        — удалить баннер

POST   /api/categories         — добавить категорию
PATCH  /api/categories/:id     — редактировать категорию
DELETE /api/categories/:id     — удалить категорию

POST   /api/authors            — добавить автора
PATCH  /api/authors/:id        — редактировать автора
DELETE /api/authors/:id        — удалить автора

GET    /api/orders             — список заказов
GET    /api/orders/:id         — один заказ
PATCH  /api/orders/:id         — сменить статус заказа

POST   /api/upload             — загрузить изображение
```

### Фильтры для GET /api/books

```
?category=fiction        — фильтр по slug категории
?q=булгаков              — поиск по названию, автору, ISBN
?minPrice=500            — цена от
?maxPrice=1500           — цена до
?minRating=4             — рейтинг от
?inStock=true            — только в наличии
?onSale=true             — только со скидкой
?isNew=true              — только новинки
?sort=popular            — сортировка (popular | new | price_asc | price_desc | rating)
?page=1&limit=48         — пагинация
```

---

## База данных — структура таблиц

```
User          — администраторы (login + passwordHash)
RefreshToken  — refresh-токены для авторизации
Author        — авторы книг
Category      — категории (slug, name, order)
Book          — книги (title, price, cover, isbn, ...)
Order         — заказы покупателей
OrderItem     — позиции в заказе (bookId, qty, price на момент заказа)
Banner        — баннеры (только image URL + active + order)
```

---

## Баннеры — принцип работы

Баннер — это **только изображение**. Весь текст, кнопки и дизайн — внутри самой картинки.

Логика:
1. В админке загружаешь картинку через `POST /api/upload`
2. Получаешь URL картинки
3. Создаёшь баннер через `POST /api/banners` с этим URL
4. Фронт загружает активные баннеры через `GET /api/banners/active` и показывает слайдер

Размер баннерных изображений — **1440×480px** (соотношение 3:1).

---

## Авторизация — принцип работы

Используется схема **Access + Refresh токенов**:

- **Access token** — живёт 15 минут, передаётся в заголовке `Authorization: Bearer <token>`
- **Refresh token** — живёт 30 дней, хранится в БД, используется для получения нового access token

Сейчас авторизация нужна только для входа в **административную панель**. Покупатели заказывают без регистрации.

Дефолтный admin после seed:
```
login:    admin
password: admin123
```
> Сменить пароль после первого входа!

---

## Загрузка изображений

В режиме **dev** — файлы сохраняются в `api/uploads/` и отдаются по `/uploads/filename.jpg`.

В режиме **production** — рекомендуется Cloudinary. Добавить в `.env`:
```env
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
```
И установить: `npm install cloudinary multer-storage-cloudinary`

---

## Что сделано / Что предстоит

### Готово ✅
- Фронт: главная страница (Header, Banner, каталог, фильтры, Footer)
- Фронт: состояние корзины (CartContext)
- Фронт: архитектура под расширение (роутинг, api.js, mock-данные)
- Бэкенд: схема БД (книги, авторы, категории, заказы, баннеры)
- Бэкенд: полный CRUD для книг, баннеров, категорий, авторов
- Бэкенд: оформление заказов
- Бэкенд: JWT авторизация (admin)
- Бэкенд: загрузка изображений (локально + Cloudinary)

### Предстоит 🔲
- Страница книги (`/book/:id`)
- Страница корзины (`/cart`)
- Страница оформления заказа (`/checkout`)
- Административная панель (`/admin`)
- Подключение фронта к реальному API (убрать mock.js)
- Мобильные фильтры (drawer/bottom sheet)
- Пагинация в каталоге
- Поиск с debounce
