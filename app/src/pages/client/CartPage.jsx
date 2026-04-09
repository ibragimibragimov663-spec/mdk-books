import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import { useCart } from '../../context/CartContext.jsx'
import styles from './CartPage.module.css'

function formatPrice(n) {
  return n?.toLocaleString('ru-RU') + ' ₽'
}

export default function CartPage() {
  const { items, removeFromCart, updateQty, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className="container">
            <div className={styles.empty}>
              <ShoppingBag size={64} className={styles.emptyIcon} />
              <h2>Корзина пуста</h2>
              <p>Добавьте книги из каталога</p>
              <Link to="/" className={styles.goBtn}>Перейти в каталог</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <Link to="/" className={styles.back}>
            <ArrowLeft size={16} /> Продолжить покупки
          </Link>

          <h1 className={styles.heading}>Корзина <span>({items.length})</span></h1>

          <div className={styles.layout}>
            {/* Список товаров */}
            <div className={styles.items}>
              {items.map(item => (
                <div key={item.id} className={styles.item}>
                  <Link to={`/book/${item.id}`} className={styles.itemCover}>
                    {item.cover
                      ? <img src={item.cover} alt={item.title} />
                      : <div className={styles.itemCoverPlaceholder}>📖</div>
                    }
                  </Link>

                  <div className={styles.itemInfo}>
                    <Link to={`/book/${item.id}`} className={styles.itemTitle}>{item.title}</Link>
                    <p className={styles.itemAuthor}>{item.author}</p>
                    <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
                  </div>

                  <div className={styles.itemControls}>
                    <div className={styles.qty}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={14} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={14} /></button>
                    </div>
                    <span className={styles.itemTotal}>{formatPrice(item.price * item.qty)}</span>
                    <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Итог */}
            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Итого</h3>
              <div className={styles.summaryRow}>
                <span>Товаров</span>
                <span>{items.reduce((s, i) => s + i.qty, 0)} шт.</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Сумма</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>К оплате</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <Link to="/checkout" className={styles.checkoutBtn}>
                Оформить заказ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
