import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { bannersApi } from '../../lib/api.js'
import styles from './Banner.module.css'

export default function Banner() {
  const [banners, setBanners] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    bannersApi.getActive()
      .then(data => setBanners(Array.isArray(data) ? data : []))
      .catch(() => setBanners([]))
  }, [])

  const next = useCallback(() => setCurrent(i => (i + 1) % banners.length), [banners.length])
  const prev = useCallback(() => setCurrent(i => (i - 1 + banners.length) % banners.length), [banners.length])

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next, banners.length])

  useEffect(() => { setCurrent(0) }, [banners.length])

  if (!banners.length) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <img
          key={banners[current].id}
          src={banners[current].image}
          alt=""
          className={styles.image}
          draggable={false}
        />
      </div>

      {banners.length > 1 && (
        <>
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Назад">
            <ChevronLeft size={20} />
          </button>
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Вперёд">
            <ChevronRight size={20} />
          </button>

          <div className={styles.dots}>
            {banners.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Баннер ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
