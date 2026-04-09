import { useState, useEffect } from 'react'
import { ordersApi } from '../../lib/api.js'
import styles from './AdminPage.module.css'

const STATUS_LABELS = {
  NEW:        { label: 'Новый',      color: 'blue'   },
  PROCESSING: { label: 'В работе',   color: 'orange' },
  SHIPPED:    { label: 'Отправлен',  color: 'purple' },
  DELIVERED:  { label: 'Доставлен',  color: 'green'  },
  CANCELLED:  { label: 'Отменён',    color: 'red'    },
}

const STATUSES = Object.keys(STATUS_LABELS)

export default function AdminOrdersPage() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const data = await ordersApi.getAll()
      setOrders(Array.isArray(data) ? data : data.orders || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleStatus(id, status) {
    try {
      await ordersApi.updateStatus(id, status)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    } catch (e) {
      alert(e.message)
    }
  }

  const statusClass = {
    blue:   styles.badgeBlue,
    orange: styles.badgeOrange,
    purple: styles.badgePurple,
    green:  styles.badgeGreen,
    red:    styles.badgeRed,
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Заказы</h1>
        <button className={styles.refreshBtn} onClick={load}>Обновить</button>
      </div>

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : orders.length === 0 ? (
        <p className={styles.empty}>Заказов пока нет</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№</th>
                <th>Дата</th>
                <th>Клиент</th>
                <th>Телефон</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Изменить статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const st = STATUS_LABELS[o.status] || { label: o.status, color: 'blue' }
                return (
                  <>
                    <tr
                      key={o.id}
                      className={styles.trClickable}
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                    >
                      <td className={styles.tdMuted}>#{o.id}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString('ru-RU')}</td>
                      <td className={styles.tdBold}>{o.name}</td>
                      <td>{o.phone}</td>
                      <td>{o.total?.toLocaleString('ru-RU')} ₽</td>
                      <td>
                        <span className={`${styles.badge} ${statusClass[st.color]}`}>
                          {st.label}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <select
                          className={styles.statusSelect}
                          value={o.status}
                          onChange={e => handleStatus(o.id, e.target.value)}
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {expanded === o.id && o.items && (
                      <tr key={`${o.id}-items`} className={styles.expandedRow}>
                        <td colSpan={7}>
                          <div className={styles.orderItems}>
                            <strong>Состав заказа:</strong>
                            {o.items.map(item => (
                              <div key={item.id} className={styles.orderItem}>
                                <span>{item.book?.title || `Книга #${item.bookId}`}</span>
                                <span>× {item.qty}</span>
                                <span>{(item.price * item.qty).toLocaleString('ru-RU')} ₽</span>
                              </div>
                            ))}
                            {o.comment && (
                              <p className={styles.orderComment}>💬 {o.comment}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
