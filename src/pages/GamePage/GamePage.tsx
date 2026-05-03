import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../context/SettingsContext'
import { useSounds } from '../../context/SoundContext'
import GameSession from '../GameSession/GameSession'
import NameInputView from '../NameInputView/NameInputView'
import LottieAnimation from '../../components/LottieAnimation/LottieAnimation'
import countdownAnim from '../../assets/321_go.json'
import styles from './GamePage.module.css'

type GamePhase = 'idle' | 'countdown' | 'playing' | 'finished'

interface FinishedResult {
  score: number
  correctCount: number
}

const COUNTDOWN_DURATION = 5000

export default function GamePage() {
  const navigate = useNavigate()
  const { t, difficulty, setDifficulty } = useSettings()
  const { playCountdown } = useSounds()
  const [phase, setPhase] = useState<GamePhase>('idle')
  const [result, setResult] = useState<FinishedResult | null>(null)

  useEffect(() => {
    if (phase !== 'countdown') return
    playCountdown()
    const timer = setTimeout(() => setPhase('playing'), COUNTDOWN_DURATION)
    return () => clearTimeout(timer)
  }, [phase, playCountdown])

  function handleGameEnd(score: number, correctCount: number) {
    setResult({ score, correctCount })
    setPhase('finished')
  }

  function handlePlayAgain() {
    setResult(null)
    setPhase('countdown')
  }

  return (
    <div className={styles.container}>
      {phase === 'idle' && (
        <div className={styles.start}>
          <h1 className={styles.title}>vurma_cedveli</h1>

          <div className={styles.difficultyControl}>
            <label className={styles.difficultyLabel}>
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

          <button className={styles.startBtn} onClick={() => setPhase('countdown')}>
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

      {phase === 'countdown' && (
        <div className={styles.countdownWrapper}>
          <LottieAnimation
            animationData={countdownAnim}
            loop={false}
            className={styles.countdownAnim}
          />
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
