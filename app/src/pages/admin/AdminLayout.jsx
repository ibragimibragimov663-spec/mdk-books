import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, ShoppingBag, Image, LogOut } from 'lucide-react'
import { authApi } from '../../lib/api.js'
import styles from './AdminLayout.module.css'

const NAV = [
  { to: '/admin/books',   label: 'Книги',   icon: BookOpen },
  { to: '/admin/orders',  label: 'Заказы',  icon: ShoppingBag },
  { to: '/admin/banners', label: 'Баннеры', icon: Image },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  if (!authApi.isAuthenticated()) {
    navigate('/admin/login')
    return null
  }

  async function handleLogout() {
    await authApi.logout()
    navigate('/admin/login')
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoMain}>МДК</span>
          <span className={styles.logoDot}>.</span>
          <span className={styles.logoSub}>Админ</span>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} /> Выйти
        </button>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
