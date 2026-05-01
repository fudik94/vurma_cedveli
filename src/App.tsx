import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import HomePage from './pages/HomePage/HomePage'
import SettingsPage from './pages/SettingsPage/SettingsPage'
import ResultsPage from './pages/ResultsPage/ResultsPage'
import GamePage from './pages/GamePage/GamePage'

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  )
}
