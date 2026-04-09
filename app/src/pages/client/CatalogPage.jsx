import { useState, useEffect, useCallback } from 'react'
import Header from '../../components/Header/Header.jsx'
import Banner from '../../components/Banner/Banner.jsx'
import Filters from '../../components/Filters/Filters.jsx'
import BookGrid from '../../components/BookGrid/BookGrid.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import { booksApi } from '../../lib/api.js'
import styles from './CatalogPage.module.css'

const DEFAULT_FILTERS = {
  genres: [],
  priceMin: '',
  priceMax: '',
  minRating: null,
  inStock: false,
  onSale: false,
}

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [filters, setFilters]               = useState(DEFAULT_FILTERS)
  const [sort, setSort]                     = useState('popular')
  const [viewMode, setViewMode]             = useState('grid')
  const [books, setBooks]                   = useState([])
  const [total, setTotal]                   = useState(0)
  const [page, setPage]                     = useState(1)
  const [loading, setLoading]               = useState(false)

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        sort,
        page,
        limit: 24,
        category: activeCategory !== 'all' ? activeCategory : undefined,
        minPrice: filters.priceMin || undefined,
        maxPrice: filters.priceMax || undefined,
        minRating: filters.minRating || undefined,
        inStock: filters.inStock ? 'true' : undefined,
        onSale: filters.onSale ? 'true' : undefined,
      }
      // Убираем undefined
      Object.keys(params).forEach(k => params[k] === undefined && delete params[k])

      const data = await booksApi.getAll(params)
      // Нормализуем данные из API к формату компонентов
      const normalized = data.books.map(b => ({
        ...b,
        author: b.author?.name || b.author || '',
        categorySlug: b.category?.slug || '',
        inStock: b.available,
        oldPrice: b.oldPrice || null,
      }))
      setBooks(normalized)
      setTotal(data.total)
    } catch (err) {
      console.error('Ошибка загрузки книг:', err)
    } finally {
      setLoading(false)
    }
  }, [activeCategory, filters, sort, page])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  // При смене категории/фильтров — сброс страницы
  useEffect(() => {
    setPage(1)
  }, [activeCategory, filters, sort])

  return (
    <div className={styles.page}>
      <Header
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main className={styles.main}>
        <Banner />

        <div className="container">
          <div className={styles.layout}>
            <Filters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
            <BookGrid
              books={books}
              sort={sort}
              onSortChange={setSort}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              loading={loading}
              total={total}
              page={page}
              onPageChange={setPage}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
