import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { booksApi, authorsApi, categoriesApi } from '../../lib/api.js'
import styles from './AdminPage.module.css'

const EMPTY = {
  title: '', authorId: '', categoryId: '', description: '',
  price: '', oldPrice: '', cover: '', isbn: '', publisher: '',
  year: '', pages: '', available: true, isNew: false, isPopular: false,
}

export default function AdminBooksPage() {
  const [books, setBooks]           = useState([])
  const [authors, setAuthors]       = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(null) // null | 'create' | 'edit'
  const [form, setForm]             = useState(EMPTY)
  const [editId, setEditId]         = useState(null)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')

  async function load() {
    setLoading(true)
    try {
      const [bData, aData, cData] = await Promise.all([
        booksApi.getAll({ limit: 100 }),
        authorsApi.getAll(),
        categoriesApi.getAll(),
      ])
      setBooks(bData.books || [])
      setAuthors(aData || [])
      setCategories(cData || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setForm(EMPTY)
    setEditId(null)
    setError('')
    setModal('create')
  }

  function openEdit(book) {
    setForm({
      title: book.title || '',
      authorId: book.author?.id || book.authorId || '',
      categoryId: book.category?.id || book.categoryId || '',
      description: book.description || '',
      price: book.price || '',
      oldPrice: book.oldPrice || '',
      cover: book.cover || '',
      isbn: book.isbn || '',
      publisher: book.publisher || '',
      year: book.year || '',
      pages: book.pages || '',
      available: book.available ?? true,
      isNew: book.isNew ?? false,
      isPopular: book.isPopular ?? false,
    })
    setEditId(book.id)
    setError('')
    setModal('edit')
  }

  async function handleSave() {
    if (!form.title || !form.price || !form.authorId || !form.categoryId) {
      setError('Заполните обязательные поля: название, цена, автор, категория')
      return
    }
    setSaving(true)
    setError('')
    try {
      const data = {
        title:      form.title,
        authorId:   Number(form.authorId),
        categoryId: Number(form.categoryId),
        price:      Number(form.price),
        oldPrice:   (form.oldPrice && Number(form.oldPrice) > 0) ? Number(form.oldPrice) : null,
        year:       form.year  ? Number(form.year)  : null,
        pages:      form.pages ? Number(form.pages) : null,
        available:  form.available,
        isNew:      form.isNew,
        isPopular:  form.isPopular,
        description: form.description || undefined,
        cover:      form.cover || undefined,
        publisher:  form.publisher || undefined,
        isbn:       form.isbn || undefined,
      }
      if (modal === 'create') await booksApi.create(data)
      else                    await booksApi.update(editId, data)
      setModal(null)
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Удалить книгу?')) return
    try {
      await booksApi.delete(id)
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Книги</h1>
        <button className={styles.addBtn} onClick={openCreate}>
          <Plus size={16} /> Добавить
        </button>
      </div>

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Обложка</th>
                <th>Название</th>
                <th>Автор</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>Наличие</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id}>
                  <td className={styles.tdMuted}>{b.id}</td>
                  <td>
                    {b.cover
                      ? <img src={b.cover} alt="" className={styles.thumb} />
                      : <div className={styles.thumbPlaceholder}>📖</div>
                    }
                  </td>
                  <td className={styles.tdBold}>{b.title}</td>
                  <td>{b.author?.name || '—'}</td>
                  <td>{b.category?.name || '—'}</td>
                  <td>{b.price?.toLocaleString('ru-RU')} ₽</td>
                  <td>
                    <span className={b.available ? styles.badgeGreen : styles.badgeRed}>
                      {b.available ? 'Да' : 'Нет'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editBtn} onClick={() => openEdit(b)}><Pencil size={14} /></button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(b.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className={styles.overlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{modal === 'create' ? 'Добавить книгу' : 'Редактировать'}</h2>
              <button className={styles.closeBtn} onClick={() => setModal(null)}><X size={18} /></button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Название *</label>
                  <input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Название книги" />
                </div>
                <div className={styles.field}>
                  <label>Автор *</label>
                  <select value={form.authorId} onChange={e => setForm(p => ({...p, authorId: e.target.value}))}>
                    <option value="">Выберите автора</option>
                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Категория *</label>
                  <select value={form.categoryId} onChange={e => setForm(p => ({...p, categoryId: e.target.value}))}>
                    <option value="">Выберите категорию</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Цена (₽) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} placeholder="890" />
                </div>
                <div className={styles.field}>
                  <label>Старая цена (₽)</label>
                  <input type="text" value={form.oldPrice} onChange={e => setForm(p => ({...p, oldPrice: e.target.value}))} placeholder="1200" />
                </div>
                <div className={styles.field}>
                  <label>ISBN</label>
                  <input value={form.isbn} onChange={e => setForm(p => ({...p, isbn: e.target.value}))} placeholder="978-..." />
                </div>
                <div className={styles.field}>
                  <label>Издательство</label>
                  <input value={form.publisher} onChange={e => setForm(p => ({...p, publisher: e.target.value}))} />
                </div>
                <div className={styles.field}>
                  <label>Год</label>
                  <input type="number" value={form.year} onChange={e => setForm(p => ({...p, year: e.target.value}))} placeholder="2024" />
                </div>
                <div className={styles.field}>
                  <label>Страниц</label>
                  <input type="number" value={form.pages} onChange={e => setForm(p => ({...p, pages: e.target.value}))} placeholder="320" />
                </div>
                <div className={styles.field}>
                  <label>URL обложки</label>
                  <input value={form.cover} onChange={e => setForm(p => ({...p, cover: e.target.value}))} placeholder="https://..." />
                </div>
              </div>

              <div className={styles.field}>
                <label>Описание</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
              </div>

              <div className={styles.checkboxRow}>
                <label className={styles.checkLabel}>
                  <input type="checkbox" checked={form.available} onChange={e => setForm(p => ({...p, available: e.target.checked}))} />
                  В наличии
                </label>
                <label className={styles.checkLabel}>
                  <input type="checkbox" checked={form.isNew} onChange={e => setForm(p => ({...p, isNew: e.target.checked}))} />
                  Новинка
                </label>
                <label className={styles.checkLabel}>
                  <input type="checkbox" checked={form.isPopular} onChange={e => setForm(p => ({...p, isPopular: e.target.checked}))} />
                  Популярное
                </label>
              </div>

              {error && <p className={styles.formError}>{error}</p>}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setModal(null)}>Отмена</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                <Check size={15} /> {saving ? 'Сохраняем...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
