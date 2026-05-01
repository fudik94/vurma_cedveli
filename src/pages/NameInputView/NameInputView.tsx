import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { saveResult } from '../../firebase/firebase'
import LottieAnimation from '../../components/LottieAnimation/LottieAnimation'
import endNorAnim from '../../assets/end_nor_game_1t.json'
import newRecordAnim from '../../assets/new record_1t.json'
import styles from './NameInputView.module.css'

interface Props {
  score: number
  correctCount: number
  onPlayAgain: () => void
}

export default function NameInputView({ score, correctCount, onPlayAgain }: Props) {
  const navigate = useNavigate()
  const { t, difficulty } = useSettings()
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveable, setSaveable] = useState(false)
  const [isNewRecord] = useState(() => {
    const stored = localStorage.getItem('bestScore')
    if (stored !== null && score > Number(stored)) {
      localStorage.setItem('bestScore', String(score))
      return true
    }
    if (stored === null) {
      localStorage.setItem('bestScore', String(score))
    }
    return false
  })

  useEffect(() => {
    const stored = localStorage.getItem('playerName')
    if (stored) setName(stored)
    const t = setTimeout(() => setSaveable(true), 600)
    return () => clearTimeout(t)
  }, [])

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    localStorage.setItem('playerName', name.trim())
    await saveResult({ name: name.trim(), score, correctAnswers: correctCount, difficulty })
    setSaving(false)
    setSaved(true)
  }

  return (
    <div className={styles.container}>
      <LottieAnimation
        animationData={isNewRecord ? newRecordAnim : endNorAnim}
        loop={false}
        className={styles.animation}
      />
      <div className={styles.card}>
        <h2 className={styles.title}>{t.timeUp}</h2>
        <p className={isNewRecord ? styles.recordMsg : styles.tryMsg}>
          {isNewRecord ? t.newRecordMsg : t.tryAgainMsg}
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t.yourCorrectAnswers}</span>
            <span className={styles.statValue}>{correctCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t.yourScore}</span>
            <span className={styles.statValue}>{score}</span>
          </div>
        </div>

        {!saved ? (
          <div className={styles.form}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.enterName}
              className={styles.input}
              onKeyDown={(e) => { if (e.key === 'Enter') void handleSave() }}
            />
            <button onClick={() => void handleSave()} disabled={!name.trim() || saving || !saveable}>
              {saving ? '...' : t.saveResults}
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/results')}>{t.results}</button>
        )}

        <button className={styles.playAgain} onClick={onPlayAgain}>
          {t.startGame}
        </button>
      </div>
    </div>
  )
}
