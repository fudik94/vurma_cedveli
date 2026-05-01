import type { AnswerStatus } from '../../types'
import styles from './AnswerButton.module.css'

interface Props {
  value: number
  status: AnswerStatus
  onClick: () => void
  disabled: boolean
}

export default function AnswerButton({ value, status, onClick, disabled }: Props) {
  return (
    <button
      className={`${styles.button} ${styles[status]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  )
}
