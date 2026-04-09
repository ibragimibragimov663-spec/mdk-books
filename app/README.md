# МДК. Дом книги — Frontend

React + Vite frontend для книжного магазина.

## Стек
- React 18
- Vite 5
- React Router v6
- CSS Modules
- lucide-react

## Запуск

```bash
npm install
cp .env.example .env
npm run dev
```

Открыть: http://localhost:3000

## Структура

```
src/
├── styles/globals.css       — CSS-переменные, reset
├── App.jsx                  — роутинг
├── main.jsx                 — точка входа
│
├── constants/mock.js        — заглушки (книги, баннеры, категории)
│                              → заменить на реальные API-запросы
│
├── context/CartContext.jsx  — состояние корзины
├── lib/api.js               — HTTP-клиент для бэкенда
│
├── components/
│   ├── Header/              — шапка: лого, поиск, корзина, категории
│   ├── Banner/              — карусель баннеров
│   ├── BookCard/            — карточка книги
│   ├── BookGrid/            — сетка + тулбар сортировки
│   ├── Filters/             — сайдбар фильтров
│   └── Footer/              — подвал
│
└── pages/
    └── client/
        └── CatalogPage.jsx  — главная страница (каталог)
```

## TODO (следующие итерации)

- [ ] `pages/client/BookPage.jsx` — страница книги
- [ ] `pages/client/CartPage.jsx` — корзина
- [ ] `pages/client/CheckoutPage.jsx` — оформление заказа
- [ ] `pages/admin/` — админка: книги, заказы, баннеры
- [ ] Подключение к реальному API (заменить `constants/mock.js`)
- [ ] Мобильные фильтры (drawer)
- [ ] Пагинация / бесконечная прокрутка
