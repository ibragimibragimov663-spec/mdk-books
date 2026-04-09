import { useState, useEffect } from 'react'
import { Search, ShoppingCart, Heart, Menu, X, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import { categoriesApi } from '../../lib/api.js'
import styles from './Header.module.css'

const ALL_CAT = { id: 0, slug: 'all', name: 'Все книги' }

export default function Header({ activeCategory, onCategoryChange }) {
  const { totalCount } = useCart()
  const [searchValue, setSearchValue] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState([ALL_CAT])
  const navigate = useNavigate()

  useEffect(() => {
    categoriesApi.getAll()
      .then(data => setCategories([ALL_CAT, ...(Array.isArray(data) ? data : [])]))
      .catch(() => {})
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/?q=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className="container">
          <div className={styles.topInner}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoMain}>МДК</span>
              <span className={styles.logoDot}>.</span>
              <span className={styles.logoSub}>Дом книги</span>
            </Link>

            <form className={styles.searchForm} onSubmit={handleSearch}>
              <Search size={16} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Поиск по книгам, авторам, ISBN..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
              <button type="submit" className={styles.searchBtn}>Найти</button>
            </form>

            <div className={styles.actions}>
              <button className={styles.actionBtn} title="Избранное">
                <Heart size={20} />
              </button>
              <Link to="/cart" className={styles.cartBtn}>
                <ShoppingCart size={20} />
                {totalCount > 0 && (
                  <span className={styles.cartBadge}>{totalCount}</span>
                )}
              </Link>
              <button
                className={styles.mobileMenuBtn}
                onClick={() => setMobileMenuOpen(v => !v)}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className={styles.catRow}>
        <div className="container">
          <div className={styles.catList}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`${styles.catItem} ${activeCategory === cat.slug ? styles.catItemActive : ''}`}
                onClick={() => onCategoryChange?.(cat.slug)}
              >
                {cat.name}
                {cat.slug === 'all' && <ChevronDown size={14} style={{ marginLeft: 2 }} />}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileCatList}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`${styles.mobileCatItem} ${activeCategory === cat.slug ? styles.mobileCatItemActive : ''}`}
                onClick={() => { onCategoryChange?.(cat.slug); setMobileMenuOpen(false) }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
