import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Settings, Language, Theme, Translations } from '../types'
import { translations } from '../i18n/translations'

const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  theme: 'light',
  difficulty: 5,
}

interface SettingsContextType extends Settings {
  t: Translations
  setLanguage: (lang: Language) => void
  setTheme: (theme: Theme) => void
  setDifficulty: (d: number) => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('settings')
    return stored ? (JSON.parse(stored) as Settings) : DEFAULT_SETTINGS
  })

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
    document.documentElement.setAttribute('data-theme', settings.theme)
  }, [settings])

  const value: SettingsContextType = {
    ...settings,
    t: translations[settings.language],
    setLanguage: (language) => setSettings((s) => ({ ...s, language })),
    setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
    setDifficulty: (difficulty) => setSettings((s) => ({ ...s, difficulty })),
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
