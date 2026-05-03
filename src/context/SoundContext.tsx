import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Howl, Howler } from 'howler'
import correctSfx from '../assets/sounds/correct_ans.wav'
import wrongSfx from '../assets/sounds/wrong_ans.wav'
import last10Sfx from '../assets/sounds/last_10 sec.wav'
import countdownSfx from '../assets/sounds/321_go.wav'
import mainMusic from '../assets/sounds/main_phone.mp3'
import gameMusic from '../assets/sounds/during_game.mp3'
import endMusic from '../assets/sounds/est_end game.mp3'

type BgTrack = 'main' | 'game' | 'end'

interface SoundContextValue {
  playCorrect: () => void
  playWrong: () => void
  playLast10: () => void
  playCountdown: () => void
  startBgMusic: (track: BgTrack) => void
  muted: boolean
  toggleMute: () => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(() => localStorage.getItem('soundMuted') === 'true')

  const correctRef = useRef<Howl | null>(null)
  const wrongRef = useRef<Howl | null>(null)
  const last10Ref = useRef<Howl | null>(null)
  const countdownRef = useRef<Howl | null>(null)
  const bgRef = useRef<Howl | null>(null)
  const currentTrackRef = useRef<BgTrack | null>(null)

  useEffect(() => {
    correctRef.current = new Howl({ src: [correctSfx], volume: 0.8 })
    wrongRef.current = new Howl({ src: [wrongSfx], volume: 0.8 })
    last10Ref.current = new Howl({ src: [last10Sfx], volume: 0.9 })
    countdownRef.current = new Howl({ src: [countdownSfx], volume: 1.0 })
    return () => {
      correctRef.current?.unload()
      wrongRef.current?.unload()
      last10Ref.current?.unload()
      countdownRef.current?.unload()
      bgRef.current?.unload()
    }
  }, [])

  useEffect(() => {
    Howler.mute(muted)
    localStorage.setItem('soundMuted', String(muted))
  }, [muted])

  const startBgMusic = useCallback((track: BgTrack) => {
    if (currentTrackRef.current === track && bgRef.current?.playing()) return
    bgRef.current?.stop()
    bgRef.current?.unload()
    const src = track === 'main' ? mainMusic : track === 'game' ? gameMusic : endMusic
    bgRef.current = new Howl({ src: [src], loop: track !== 'end', volume: 0.35 })
    bgRef.current.play()
    currentTrackRef.current = track
  }, [])

  const playCorrect = useCallback(() => {
    correctRef.current?.stop()
    correctRef.current?.play()
  }, [])

  const playWrong = useCallback(() => {
    wrongRef.current?.stop()
    wrongRef.current?.play()
  }, [])

  const playLast10 = useCallback(() => {
    last10Ref.current?.play()
  }, [])

  const playCountdown = useCallback(() => {
    countdownRef.current?.stop()
    countdownRef.current?.play()
  }, [])

  const toggleMute = useCallback(() => setMuted(m => !m), [])

  const value = useMemo<SoundContextValue>(
    () => ({ playCorrect, playWrong, playLast10, playCountdown, startBgMusic, muted, toggleMute }),
    [playCorrect, playWrong, playLast10, playCountdown, startBgMusic, muted, toggleMute],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSounds() {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSounds must be used within SoundProvider')
  return ctx
}
