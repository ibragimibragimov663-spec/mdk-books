import { Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import CatalogPage from './pages/client/CatalogPage.jsx'
import BookPage from './pages/client/BookPage.jsx'
import CartPage from './pages/client/CartPage.jsx'
import CheckoutPage from './pages/client/CheckoutPage.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminBooksPage from './pages/admin/AdminBooksPage.jsx'
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx'
import AdminBannersPage from './pages/admin/AdminBannersPage.jsx'
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'

export default function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Клиентские страницы */}
        <Route path="/" element={<CatalogPage />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Админ */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/books" replace />} />
          <Route path="books" element={<AdminBooksPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}
