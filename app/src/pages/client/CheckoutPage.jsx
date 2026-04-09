import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { ordersApi } from '../../lib/api.js'
import styles from './CheckoutPage.module.css'

function formatPrice(n) {
  return n?.toLocaleString('ru-RU') + ' ₽'
}

export default function CheckoutPage() {
  const { items, totalPrice, removeFromCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', email: '', comment: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Заполните имя и телефон')
      return
    }
    setLoading(true)
    setError('')
    try {
      await ordersApi.create({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        comment: form.comment || undefined,
        items: items.map(i => ({ bookId: i.id, qty: i.qty, price: i.price })),
        total: totalPrice,
      })
      setSuccess(true)
      items.forEach(i => removeFromCart(i.id))
    } catch (err) {
      setError(err.message || 'Ошибка при оформлении заказа')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className="container">
            <div className={styles.success}>
              <CheckCircle size={64} className={styles.successIcon} />
              <h2>Заказ оформлен!</h2>
              <p>Мы свяжемся с вами в ближайшее время</p>
              <Link to="/" className={styles.goBtn}>Вернуться в каталог</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <Link to="/cart" className={styles.back}>
            <ArrowLeft size={16} /> Вернуться в корзину
          </Link>

          <h1 className={styles.heading}>Оформление заказа</h1>

          <div className={styles.layout}>
            {/* Форма */}
            <form className={styles.form} onSubmit={handleSubmit}>
              <h2 className={styles.sectionTitle}>Контактные данные</h2>

              <div className={styles.field}>
                <label className={styles.label}>Имя *</label>
                <input
                  className={styles.input}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Иван Иванов"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Телефон *</label>
                <input
                  className={styles.input}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+7 (999) 000-00-00"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Комментарий</label>
                <textarea
                  className={styles.textarea}
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="Пожелания к заказу..."
                  rows={3}
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button className={styles.submitBtn} type="submit" disabled={loading}>
                {loading ? 'Оформляем...' : 'Подтвердить заказ'}
              </button>
            </form>

            {/* Итог */}
            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Ваш заказ</h3>
              {items.map(item => (
                <div key={item.id} className={styles.orderItem}>
                  <span className={styles.orderItemName}>
                    {item.title} <span className={styles.orderItemQty}>× {item.qty}</span>
                  </span>
                  <span className={styles.orderItemPrice}>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
              <div className={styles.orderTotal}>
                <span>Итого</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
