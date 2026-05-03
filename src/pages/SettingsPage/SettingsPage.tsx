import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { useSounds } from '../../context/SoundContext'
import LottieAnimation from '../../components/LottieAnimation/LottieAnimation'
import type { Language, Theme } from '../../types'
import settAnim from '../../assets/sett_many_t.json'
import styles from './SettingsPage.module.css'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { t, language, theme, difficulty, setLanguage, setTheme, setDifficulty } = useSettings()
  const { startBgMusic, muted, toggleMute } = useSounds()

  useEffect(() => {
    startBgMusic('main')
  }, [startBgMusic])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t.settings}</h1>

      <LottieAnimation animationData={settAnim} loop={true} className={styles.animation} />

      <div className={styles.card}>
        <div className={styles.setting}>
          <label className={styles.label}>{t.language}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            <option value="en">{t.langEn}</option>
            <option value="et">{t.langEt}</option>
            <option value="ru">{t.langRu}</option>
            <option value="az">{t.langAz}</option>
          </select>
        </div>

        <div className={styles.setting}>
          <label className={styles.label}>{t.theme}</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
          >
            <option value="light">{t.light}</option>
            <option value="dark">{t.dark}</option>
          </select>
        </div>

        <div className={styles.setting}>
          <label className={styles.label}>{t.sound}</label>
          <select value={muted ? 'off' : 'on'} onChange={() => toggleMute()}>
            <option value="on">{t.soundOn}</option>
            <option value="off">{t.soundOff}</option>
          </select>
        </div>

        <div className={styles.setting}>
          <label className={styles.label}>
            {t.difficulty}: <strong>{difficulty}</strong>
          </label>
          <input
            type="range"
            min={2}
            max={20}
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className={styles.slider}
          />
          <div className={styles.sliderLabels}>
            <span>2</span>
            <span>20</span>
          </div>
        </div>
      </div>

      <div className={styles.nav}>
        <button className={styles.navBtn} onClick={() => navigate('/')}>
          {t.home}
        </button>
        <button onClick={() => navigate('/game')}>{t.startGame}</button>
      </div>
    </div>
  )
}
