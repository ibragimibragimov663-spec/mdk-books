import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import styles from './Filters.module.css'

const GENRES = [
  'Художественная', 'Нон-фикшн', 'Бизнес',
  'Психология', 'История', 'Наука', 'Искусство', 'Детям',
]

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={styles.section}>
      <button className={styles.sectionHeader} onClick={() => setOpen(v => !v)}>
        <span className={styles.sectionTitle}>{title}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  )
}

export default function Filters({ filters, onChange, onReset }) {
  return (
    <aside className={styles.aside}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <SlidersHorizontal size={16} />
          <span>Фильтры</span>
        </div>
        <button className={styles.resetBtn} onClick={onReset}>
          <X size={13} />
          Сбросить
        </button>
      </div>

      {/* ── Жанр ── */}
      <Section title="Жанр">
        <div className={styles.checkList}>
          {GENRES.map(genre => (
            <label key={genre} className={styles.checkLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={filters.genres?.includes(genre) || false}
                onChange={e => {
                  const next = e.target.checked
                    ? [...(filters.genres || []), genre]
                    : (filters.genres || []).filter(g => g !== genre)
                  onChange({ ...filters, genres: next })
                }}
              />
              <span>{genre}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* ── Цена ── */}
      <Section title="Цена">
        <div className={styles.priceRow}>
          <div className={styles.priceField}>
            <label className={styles.priceLabel}>От</label>
            <input
              type="number"
              className={styles.priceInput}
              placeholder="0"
              value={filters.priceMin || ''}
              onChange={e => onChange({ ...filters, priceMin: e.target.value ? +e.target.value : '' })}
            />
          </div>
          <span className={styles.priceDash}>—</span>
          <div className={styles.priceField}>
            <label className={styles.priceLabel}>До</label>
            <input
              type="number"
              className={styles.priceInput}
              placeholder="9999"
              value={filters.priceMax || ''}
              onChange={e => onChange({ ...filters, priceMax: e.target.value ? +e.target.value : '' })}
            />
          </div>
        </div>
      </Section>

      {/* ── Рейтинг ── */}
      <Section title="Рейтинг">
        <div className={styles.ratingList}>
          {[4, 3, 2].map(r => (
            <label key={r} className={styles.checkLabel}>
              <input
                type="radio"
                className={styles.checkbox}
                name="rating"
                checked={filters.minRating === r}
                onChange={() => onChange({ ...filters, minRating: r })}
              />
              <span>{'★'.repeat(r)}{'☆'.repeat(5 - r)} и выше</span>
            </label>
          ))}
          <label className={styles.checkLabel}>
            <input
              type="radio"
              className={styles.checkbox}
              name="rating"
              checked={!filters.minRating}
              onChange={() => onChange({ ...filters, minRating: null })}
            />
            <span>Любой рейтинг</span>
          </label>
        </div>
      </Section>

      {/* ── Toggles ── */}
      <Section title="Наличие">
        <label className={styles.toggleLabel}>
          <div className={`${styles.toggle} ${filters.inStock ? styles.toggleOn : ''}`}
            onClick={() => onChange({ ...filters, inStock: !filters.inStock })}>
            <div className={styles.toggleThumb} />
          </div>
          <span>Только в наличии</span>
        </label>
        <label className={styles.toggleLabel} style={{ marginTop: 10 }}>
          <div className={`${styles.toggle} ${filters.onSale ? styles.toggleOn : ''}`}
            onClick={() => onChange({ ...filters, onSale: !filters.onSale })}>
            <div className={styles.toggleThumb} />
          </div>
          <span>Со скидкой</span>
        </label>
      </Section>
    </aside>
  )
}
