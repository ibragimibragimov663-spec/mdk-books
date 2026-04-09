import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Star, Package, BookOpen, Calendar, Hash } from 'lucide-react'
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import { booksApi } from '../../lib/api.js'
import { useCart } from '../../context/CartContext.jsx'
import styles from './BookPage.module.css'

function formatPrice(n) {
  return n?.toLocaleString('ru-RU') + ' ₽'
}

export default function BookPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    booksApi.getById(id)
      .then(data => {
        setBook({
          ...data,
          author: data.author?.name || '',
          categorySlug: data.category?.slug || '',
          categoryName: data.category?.name || '',
          inStock: data.available,
        })
      })
      .catch(() => setError('Книга не найдена'))
      .finally(() => setLoading(false))
  }, [id])

  function handleAddToCart() {
    if (!book) return
    addToCart(book)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const discount = book?.oldPrice
    ? Math.round((1 - book.price / book.oldPrice) * 100)
    : null

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <Link to="/" className={styles.back}>
            <ArrowLeft size={16} /> Назад к каталогу
          </Link>

          {loading && <div className={styles.loading}>Загрузка...</div>}
          {error && <div className={styles.error}>{error}</div>}

          {book && (
            <div className={styles.content}>
              {/* Обложка */}
              <div className={styles.coverCol}>
                <div className={styles.coverWrap}>
                  {book.cover
                    ? <img src={book.cover} alt={book.title} className={styles.cover} />
                    : <div className={styles.coverPlaceholder}>📖</div>
                  }
                  {discount && (
                    <span className={styles.discountBadge}>−{discount}%</span>
                  )}
                </div>
              </div>

              {/* Инфо */}
              <div className={styles.infoCol}>
                {book.categoryName && (
                  <span className={styles.category}>{book.categoryName}</span>
                )}
                <h1 className={styles.title}>{book.title}</h1>
                <p className={styles.author}>{book.author}</p>

                {/* Рейтинг */}
                <div className={styles.rating}>
                  {[1,2,3,4,5].map(i => (
                    <Star
                      key={i}
                      size={16}
                      fill={i <= Math.round(book.rating) ? 'var(--color-accent-orange)' : 'none'}
                      color="var(--color-accent-orange)"
                    />
                  ))}
                  <span className={styles.ratingVal}>{book.rating}</span>
                  <span className={styles.ratingCount}>({book.reviewCount?.toLocaleString('ru-RU')} отзывов)</span>
                </div>

                {/* Цена */}
                <div className={styles.priceRow}>
                  <span className={styles.price}>{formatPrice(book.price)}</span>
                  {book.oldPrice && (
                    <span className={styles.oldPrice}>{formatPrice(book.oldPrice)}</span>
                  )}
                </div>

                {/* Наличие */}
                <div className={`${styles.stock} ${book.inStock ? styles.inStock : styles.outStock}`}>
                  <Package size={14} />
                  {book.inStock ? 'Есть в наличии' : 'Нет в наличии'}
                </div>

                {/* Кнопка */}
                <button
                  className={`${styles.cartBtn} ${added ? styles.cartBtnAdded : ''} ${!book.inStock ? styles.cartBtnDisabled : ''}`}
                  onClick={handleAddToCart}
                  disabled={!book.inStock}
                >
                  <ShoppingCart size={18} />
                  {added ? 'Добавлено!' : 'В корзину'}
                </button>

                {/* Характеристики */}
                <div className={styles.details}>
                  <h3 className={styles.detailsTitle}>Характеристики</h3>
                  <div className={styles.detailsGrid}>
                    {book.isbn && (
                      <div className={styles.detailItem}>
                        <Hash size={14} />
                        <span className={styles.detailLabel}>ISBN:</span>
                        <span>{book.isbn}</span>
                      </div>
                    )}
                    {book.publisher && (
                      <div className={styles.detailItem}>
                        <BookOpen size={14} />
                        <span className={styles.detailLabel}>Издательство:</span>
                        <span>{book.publisher}</span>
                      </div>
                    )}
                    {book.year && (
                      <div className={styles.detailItem}>
                        <Calendar size={14} />
                        <span className={styles.detailLabel}>Год:</span>
                        <span>{book.year}</span>
                      </div>
                    )}
                    {book.pages && (
                      <div className={styles.detailItem}>
                        <BookOpen size={14} />
                        <span className={styles.detailLabel}>Страниц:</span>
                        <span>{book.pages}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Описание */}
                {book.description && (
                  <div className={styles.description}>
                    <h3 className={styles.detailsTitle}>Описание</h3>
                    <p>{book.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
