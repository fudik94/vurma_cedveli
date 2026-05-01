import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { getResults } from '../../firebase/firebase'
import type { GameResult } from '../../types'
import styles from './ResultsPage.module.css'

export default function ResultsPage() {
  const navigate = useNavigate()
  const { t } = useSettings()
  const [results, setResults] = useState<GameResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getResults()
      .then((data) => setResults(data.sort((a, b) => b.score - a.score)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t.leaderboard}</h1>

      {loading ? (
        <p className={styles.empty}>{t.loading}</p>
      ) : results.length === 0 ? (
        <p className={styles.empty}>No results yet. Be the first!</p>
      ) : (
        <ol className={styles.list}>
          {results.map((r, index) => (
            <li key={r.id} className={styles.item}>
              <span className={styles.rank}>#{index + 1}</span>
              <span className={styles.name}>{r.name}</span>
              <span className={styles.score}>{r.score}</span>
            </li>
          ))}
        </ol>
      )}

      <div className={styles.nav}>
        <button className={styles.navBtn} onClick={() => navigate('/')}>{t.home}</button>
        <button onClick={() => navigate('/game')}>{t.game}</button>
      </div>
    </div>
  )
}
