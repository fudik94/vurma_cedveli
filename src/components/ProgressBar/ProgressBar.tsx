import styles from './ProgressBar.module.css'

interface Props {
  timeLeft: number
  totalTime: number
}

export default function ProgressBar({ timeLeft, totalTime }: Props) {
  const percentage = (timeLeft / totalTime) * 100
  const isLow = percentage <= 25

  return (
    <div className={styles.track}>
      <div
        className={`${styles.bar} ${isLow ? styles.low : ''}`}
        style={{ width: `${percentage}%` }}
      />
      <span className={styles.time}>{timeLeft}s</span>
    </div>
  )
}
