import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()
  const { t } = useSettings()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>vurma_cedveli</h1>
      <p className={styles.subtitle}>×</p>
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
