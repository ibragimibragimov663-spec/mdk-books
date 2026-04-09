import { useState } from 'react'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import styles from './BookCard.module.css'

function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽'
}

export default function BookCard({ book }) {
  const { addToCart } = useCart()
  const [wishlisted, setWishlisted] = useState(false)
  const [added, setAdded] = useState(false)

  function handleAddToCart(e) {
    e.preventDefault()
    addToCart(book)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleWishlist(e) {
    e.preventDefault()
    setWishlisted(v => !v)
  }

  const discount = book.oldPrice
    ? Math.round((1 - book.price / book.oldPrice) * 100)
    : null

  return (
    <Link to={`/book/${book.id}`} className={styles.card}>
      {/* Cover */}
      <div className={styles.coverWrap}>
        {book.cover
          ? <img src={book.cover} alt={book.title} className={styles.cover} />
          : <div className={styles.coverPlaceholder}>
              <span className={styles.coverEmoji}>📖</span>
            </div>
        }

        {/* Badges */}
        <div className={styles.badges}>
          {book.isNew && <span className={`${styles.badge} ${styles.badgeNew}`}>Новинка</span>}
          {discount && <span className={`${styles.badge} ${styles.badgeDiscount}`}>−{discount}%</span>}
          {!book.inStock && <span className={`${styles.badge} ${styles.badgeOut}`}>Нет в наличии</span>}
        </div>

        {/* Wishlist */}
        <button
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
          onClick={handleWishlist}
          title="В избранное"
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className={styles.info}>
        {/* Rating */}
        <div className={styles.rating}>
          <Star size={12} fill="var(--color-accent-orange)" color="var(--color-accent-orange)" />
          <span className={styles.ratingValue}>{book.rating}</span>
          <span className={styles.ratingCount}>({book.reviewCount.toLocaleString('ru-RU')})</span>
        </div>

        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>

        {/* Price + Cart */}
        <div className={styles.bottom}>
          <div className={styles.prices}>
            <span className={styles.price}>{formatPrice(book.price)}</span>
            {book.oldPrice && (
              <span className={styles.oldPrice}>{formatPrice(book.oldPrice)}</span>
            )}
          </div>
          <button
            className={`${styles.cartBtn} ${added ? styles.cartBtnAdded : ''} ${!book.inStock ? styles.cartBtnDisabled : ''}`}
            onClick={handleAddToCart}
            disabled={!book.inStock}
            title={book.inStock ? 'В корзину' : 'Нет в наличии'}
          >
            {added ? '✓' : <ShoppingCart size={15} />}
          </button>
        </div>
      </div>
    </Link>
  )
}
