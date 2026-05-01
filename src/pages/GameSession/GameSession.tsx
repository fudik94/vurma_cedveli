import { useState, useEffect, useCallback } from 'react'
import { useSettings } from '../../context/SettingsContext'
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
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [correctCount, setCorrectCount] = useState(0)
  const [question, setQuestion] = useState<Question>(() => makeQuestion(difficulty))
  const [statuses, setStatuses] = useState<AnswerStatus[]>(['idle', 'idle', 'idle', 'idle'])
  const [disabled, setDisabled] = useState(false)

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
      setStatuses(question.answers.map((_, i) => (i === index ? 'correct' : 'idle')))
      setCorrectCount((c) => c + 1)
      setTimeout(nextQuestion, CORRECT_DELAY)
    } else {
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

      <p className={styles.score}>
        {t.currentScore}: <strong>{difficulty * correctCount}</strong>
      </p>

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
