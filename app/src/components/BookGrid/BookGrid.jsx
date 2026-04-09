import { LayoutGrid, List } from 'lucide-react'
import BookCard from '../BookCard/BookCard.jsx'
import { SORT_OPTIONS } from '../../constants/mock.js'
import styles from './BookGrid.module.css'

export default function BookGrid({ books, sort, onSortChange, viewMode, onViewModeChange }) {
  return (
    <div className={styles.wrap}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <span className={styles.count}>
          Найдено: <strong>{books.length}</strong> {declBook(books.length)}
        </span>
        <div className={styles.toolbarRight}>
          <div className={styles.sortWrap}>
            <label className={styles.sortLabel}>Сортировка:</label>
            <select
              className={styles.sortSelect}
              value={sort}
              onChange={e => onSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Сетка"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
              onClick={() => onViewModeChange('list')}
              title="Список"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {books.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📭</span>
          <p className={styles.emptyTitle}>Книги не найдены</p>
          <p className={styles.emptyText}>Попробуйте изменить фильтры или поисковый запрос</p>
        </div>
      ) : (
        <div className={`${styles.grid} ${viewMode === 'list' ? styles.gridList : ''}`}>
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

function declBook(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 19) return 'книг'
  if (mod10 === 1) return 'книга'
  if (mod10 >= 2 && mod10 <= 4) return 'книги'
  return 'книг'
}
