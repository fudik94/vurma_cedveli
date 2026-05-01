export type Language = 'en' | 'et' | 'ru' | 'az'
export type Theme = 'light' | 'dark'
export type AnswerStatus = 'idle' | 'correct' | 'wrong'

export interface Settings {
  language: Language
  theme: Theme
  difficulty: number
}

export interface GameResult {
  id?: string
  name: string
  score: number
  correctAnswers: number
  difficulty: number
  createdAt: Date
}

export interface Translations {
  home: string
  game: string
  results: string
  settings: string
  startGame: string
  endGame: string
  saveResults: string
  language: string
  theme: string
  difficulty: string
  light: string
  dark: string
  leaderboard: string
  score: string
  correctAnswers: string
  currentScore: string
  enterName: string
  yourScore: string
  yourCorrectAnswers: string
  playAgain: string
  langEn: string
  langEt: string
  langRu: string
  langAz: string
  loading: string
  player: string
  rank: string
  timeUp: string
  newRecordMsg: string
  tryAgainMsg: string
}
