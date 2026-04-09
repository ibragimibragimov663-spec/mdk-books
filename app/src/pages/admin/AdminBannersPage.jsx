import { useState, useEffect } from 'react'
import { Plus, Trash2, X, Check, Eye, EyeOff } from 'lucide-react'
import { bannersApi } from '../../lib/api.js'
import styles from './AdminPage.module.css'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState({ image: '', active: true, order: 0 })
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  async function load() {
    setLoading(true)
    try {
      const data = await bannersApi.getAll()
      setBanners(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    if (!form.image) { setError('Укажите URL изображения'); return }
    setSaving(true)
    setError('')
    try {
      await bannersApi.create({ ...form, order: Number(form.order) })
      setModal(false)
      setForm({ image: '', active: true, order: 0 })
      load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(banner) {
    try {
      await bannersApi.update(banner.id, { active: !banner.active })
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Удалить баннер?')) return
    try {
      await bannersApi.delete(id)
      load()
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Баннеры</h1>
        <button className={styles.addBtn} onClick={() => { setModal(true); setError('') }}>
          <Plus size={16} /> Добавить
        </button>
      </div>

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : (
        <div className={styles.bannersGrid}>
          {banners.map(b => (
            <div key={b.id} className={`${styles.bannerCard} ${!b.active ? styles.bannerInactive : ''}`}>
              <img src={b.image} alt="" className={styles.bannerImg} />
              <div className={styles.bannerMeta}>
                <span className={styles.tdMuted}>#{b.id}</span>
                <span className={b.active ? styles.badgeGreen : styles.badgeRed}>
                  {b.active ? 'Активен' : 'Скрыт'}
                </span>
                <span className={styles.tdMuted}>Порядок: {b.order}</span>
              </div>
              <div className={styles.bannerActions}>
                <button className={styles.editBtn} onClick={() => handleToggle(b)} title={b.active ? 'Скрыть' : 'Показать'}>
                  {b.active ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(b.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {banners.length === 0 && <p className={styles.empty}>Баннеров пока нет</p>}
        </div>
      )}

      {modal && (
        <div className={styles.overlay} onClick={() => setModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Добавить баннер</h2>
              <button className={styles.closeBtn} onClick={() => setModal(false)}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.field}>
                <label>URL изображения *</label>
                <input
                  value={form.image}
                  onChange={e => setForm(p => ({...p, image: e.target.value}))}
                  placeholder="https://..."
                />
              </div>
              <div className={styles.field}>
                <label>Порядок</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={e => setForm(p => ({...p, order: e.target.value}))}
                  placeholder="0"
                />
              </div>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={e => setForm(p => ({...p, active: e.target.checked}))}
                />
                Активен
              </label>
              {form.image && (
                <div className={styles.previewWrap}>
                  <img src={form.image} alt="preview" className={styles.preview} onError={e => e.target.style.display='none'} />
                </div>
              )}
              {error && <p className={styles.formError}>{error}</p>}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setModal(false)}>Отмена</button>
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
