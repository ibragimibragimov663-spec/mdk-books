import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../lib/api.js'
import styles from './AdminLoginPage.module.css'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ login: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authApi.login(form.login, form.password)
      navigate('/admin/books')
    } catch (err) {
      setError(err.message || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoMain}>МДК</span>
          <span className={styles.logoDot}>.</span>
          <span className={styles.logoSub}>Админ</span>
        </div>
        <h1 className={styles.title}>Вход в панель</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            placeholder="Логин"
            value={form.login}
            onChange={e => setForm(p => ({ ...p, login: e.target.value }))}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
