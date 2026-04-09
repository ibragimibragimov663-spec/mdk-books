import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const LINKS = {
  catalog: {
    title: 'Каталог',
    items: [
      { label: 'Все книги',      to: '/' },
      { label: 'Новинки',        to: '/?category=new' },
      { label: 'Бестселлеры',   to: '/?category=popular' },
      { label: 'Скидки',         to: '/?onSale=true' },
      { label: 'Детям',          to: '/?category=children' },
    ],
  },
  help: {
    title: 'Покупателям',
    items: [
      { label: 'Как заказать',   to: '/help' },
      { label: 'Доставка',       to: '/delivery' },
      { label: 'Возврат',        to: '/returns' },
      { label: 'Оплата',         to: '/payment' },
    ],
  },
  about: {
    title: 'О компании',
    items: [
      { label: 'О нас',          to: '/about' },
      { label: 'Контакты',       to: '/contacts' },
      { label: 'Вакансии',       to: '/jobs' },
    ],
  },
}

const SOCIALS = [
  { label: 'Telegram',   href: 'https://t.me/', icon: '✈' },
  { label: 'ВКонтакте', href: 'https://vk.com/', icon: 'В' },
  { label: 'WhatsApp',  href: 'https://wa.me/', icon: '💬' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoMain}>МДК</span>
              <span className={styles.logoDot}>.</span>
              <span className={styles.logoSub}>Дом книги</span>
            </div>
            <p className={styles.tagline}>
              Книжный магазин для тех,<br />кто читает по-настоящему
            </p>
            <div className={styles.socials}>
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.values(LINKS).map(col => (
            <div key={col.title} className={styles.col}>
              <h4 className={styles.colTitle}>{col.title}</h4>
              <ul className={styles.colList}>
                {col.items.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className={styles.colLink}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contacts */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Контакты</h4>
            <ul className={styles.colList}>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                Москва, ул. Новый Арбат, 8
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                +7 (495) 000-00-00
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>✉</span>
                info@mdk-books.ru
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>🕐</span>
                Пн–Вс: 10:00–22:00
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} МДК. Дом книги. Все права защищены.</span>
          <div className={styles.bottomLinks}>
            <Link to="/privacy" className={styles.bottomLink}>Политика конфиденциальности</Link>
            <Link to="/terms" className={styles.bottomLink}>Условия использования</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
