import { useNavigate } from 'react-router-dom'
import { useRef, useEffect } from 'react'
import lottie from 'lottie-web'
import { useSettings } from '../../context/SettingsContext'
import { useSounds } from '../../context/SoundContext'
import type { Language, Theme } from '../../types'
import animationData from '../../assets/animation_main_dsip.json'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()
  const { t, language, theme, setLanguage, setTheme } = useSettings()
  const { startBgMusic } = useSounds()
  const animRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startBgMusic('main')
  }, [startBgMusic])

  useEffect(() => {
    if (!animRef.current) return
    const anim = lottie.loadAnimation({
      container: animRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animationData as unknown as object,
    })
    return () => anim.destroy()
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>vurma_cedveli</h1>

      <div ref={animRef} className={styles.animation} />

      <div className={styles.controls}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className={styles.select}
        >
          <option value="en">{t.langEn}</option>
          <option value="et">{t.langEt}</option>
          <option value="ru">{t.langRu}</option>
          <option value="az">{t.langAz}</option>
        </select>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className={styles.select}
        >
          <option value="dark">{t.dark}</option>
          <option value="light">{t.light}</option>
        </select>
      </div>

      <div className={styles.buttons}>
        <button className={styles.btn} onClick={() => navigate('/game')}>
          {t.game}
        </button>
        <button className={`${styles.btn} ${styles.secondary}`} onClick={() => navigate('/results')}>
          {t.results}
        </button>
        <button className={`${styles.btn} ${styles.secondary}`} onClick={() => navigate('/settings')}>
          {t.settings}
        </button>
      </div>
    </div>
  )
}
