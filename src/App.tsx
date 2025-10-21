import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StartPage from './components/StartPage'
import GamePage from './components/GamePage'
import FastTrackPage from './components/FastTrackPage';
import './App.css'

function App() {
  return (
    <Router >
      <div className="app">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/fast-track" element={<FastTrackPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App