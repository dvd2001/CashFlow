import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/languageContext'
import StartPage from './components/StartPage'
import GamePage from './components/GamePage'
import FastTrackPage from './components/FastTrackPage'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/fast-track" element={<FastTrackPage />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App