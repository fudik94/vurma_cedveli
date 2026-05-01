import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import GameSession from '../GameSession/GameSession'
import NameInputView from '../NameInputView/NameInputView'
import styles from './GamePage.module.css'

type GamePhase = 'idle' | 'playing' | 'finished'

interface FinishedResult {
  score: number
  correctCount: number
}

export default function GamePage() {
  const navigate = useNavigate()
  const { t, difficulty } = useSettings()
  const [phase, setPhase] = useState<GamePhase>('idle')
  const [result, setResult] = useState<FinishedResult | null>(null)

  function handleGameEnd(score: number, correctCount: number) {
    setResult({ score, correctCount })
    setPhase('finished')
  }

  function handlePlayAgain() {
    setResult(null)
    setPhase('playing')
  }

  return (
    <div className={styles.container}>
      {phase === 'idle' && (
        <div className={styles.start}>
          <h1 className={styles.title}>vurma_cedveli</h1>
          <p className={styles.difficultyLabel}>
            {t.difficulty}: <strong>{difficulty}</strong>
          </p>
          <button className={styles.startBtn} onClick={() => setPhase('playing')}>
            {t.startGame}
          </button>
          <div className={styles.nav}>
            <button className={styles.navBtn} onClick={() => navigate('/')}>
              {t.home}
            </button>
            <button className={styles.navBtn} onClick={() => navigate('/settings')}>
              {t.settings}
            </button>
          </div>
        </div>
      )}

      {phase === 'playing' && (
        <GameSession difficulty={difficulty} onGameEnd={handleGameEnd} />
      )}

      {phase === 'finished' && result && (
        <NameInputView
          score={result.score}
          correctCount={result.correctCount}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  )
}
