import { useState, useEffect, useCallback, useRef } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { useSounds } from '../../context/SoundContext'
import { generateQuestion, generateAnswers } from '../../utils/gameLogic'
import AnswerButton from '../../components/AnswerButton/AnswerButton'
import ProgressBar from '../../components/ProgressBar/ProgressBar'
import type { AnswerStatus } from '../../types'
import styles from './GameSession.module.css'

const TOTAL_TIME = 60
const CORRECT_DELAY = 1000
const WRONG_DELAY = 3000

interface Props {
  difficulty: number
  onGameEnd: (score: number, correctCount: number) => void
}

interface Question {
  a: number
  b: number
  answers: number[]
}

function makeQuestion(difficulty: number): Question {
  const { a, b } = generateQuestion(difficulty)
  return { a, b, answers: generateAnswers(a, b) }
}

export default function GameSession({ difficulty, onGameEnd }: Props) {
  const { t } = useSettings()
  const { startBgMusic, playCorrect, playWrong, playLast10, muted, toggleMute } = useSounds()
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const last10PlayedRef = useRef(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [question, setQuestion] = useState<Question>(() => makeQuestion(difficulty))
  const [statuses, setStatuses] = useState<AnswerStatus[]>(['idle', 'idle', 'idle', 'idle'])
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    startBgMusic('game')
  }, [startBgMusic])

  useEffect(() => {
    if (timeLeft === 10 && !last10PlayedRef.current) {
      playLast10()
      last10PlayedRef.current = true
    }
  }, [timeLeft, playLast10])

  const nextQuestion = useCallback(() => {
    setQuestion(makeQuestion(difficulty))
    setStatuses(['idle', 'idle', 'idle', 'idle'])
    setDisabled(false)
  }, [difficulty])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (timeLeft === 0) {
      onGameEnd(difficulty * correctCount, correctCount)
    }
  }, [timeLeft, correctCount, difficulty, onGameEnd])

  function handleAnswer(index: number) {
    if (disabled) return
    const correct = question.a * question.b
    const selected = question.answers[index]
    const isCorrect = selected === correct

    setDisabled(true)

    if (isCorrect) {
      playCorrect()
      setStatuses(question.answers.map((_, i) => (i === index ? 'correct' : 'idle')))
      setCorrectCount((c) => c + 1)
      setTimeout(nextQuestion, CORRECT_DELAY)
    } else {
      playWrong()
      const correctIdx = question.answers.indexOf(correct)
      setStatuses(
        question.answers.map((_, i) => {
          if (i === index) return 'wrong'
          if (i === correctIdx) return 'correct'
          return 'idle'
        }),
      )
      setTimeout(nextQuestion, WRONG_DELAY)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.progressWrapper}>
        <ProgressBar timeLeft={timeLeft} totalTime={TOTAL_TIME} />
      </div>

      <div className={styles.scoreRow}>
        <p className={styles.score}>
          {t.currentScore}: <strong>{difficulty * correctCount}</strong>
        </p>
        <button className={styles.muteBtn} onClick={toggleMute} aria-label={muted ? t.soundOff : t.soundOn}>
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </button>
      </div>

      <div className={styles.question}>
        <span className={styles.number}>{question.a}</span>
        <span className={styles.operator}>×</span>
        <span className={styles.number}>{question.b}</span>
        <span className={styles.operator}>=</span>
        <span className={styles.questionMark}>?</span>
      </div>

      <div className={styles.answers}>
        {question.answers.map((val, i) => (
          <AnswerButton
            key={val}
            value={val}
            status={statuses[i]}
            onClick={() => handleAnswer(i)}
            disabled={disabled}
          />
        ))}
      </div>

      <button
        className={styles.endBtn}
        onClick={() => onGameEnd(difficulty * correctCount, correctCount)}
      >
        {t.endGame}
      </button>
    </div>
  )
}
