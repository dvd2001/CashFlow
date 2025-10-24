import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import professions from '../data/professions.json'

interface Profession {
    value: string
    label: string
}

function StartPage() {
    const [selectedProfession, setSelectedProfession] = useState<string>(professions[0].value)
    const [darkMode, setDarkMode] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleStartGame = () => {
        const selected = professions.find(p => p.value === selectedProfession)
        navigate('/game', { state: { profession: selected, darkMode } })
    }

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)

        if (newDarkMode) {
            document.body.classList.add('dark-mode')
            localStorage.setItem('darkMode', 'true')
        } else {
            document.body.classList.remove('dark-mode')
            localStorage.setItem('darkMode', 'false')
        }
    }

    // And in the component, initialize from localStorage
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true'
        setDarkMode(savedDarkMode)
        if (savedDarkMode) {
            document.body.classList.add('dark-mode')
        }
    }, [])

    return (
        <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="content-card">
                {/* Dark Mode Toggle */}
                <div className="dark-mode-toggle">
                    <label className="toggle-label">
                        <span>Dark Mode</span>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={toggleDarkMode}
                            />
                            <span className="slider"></span>
                        </div>
                    </label>
                </div>

                <h1 className="title">CashFlow</h1>

                <select
                    className="game-select"
                    value={selectedProfession}
                    onChange={(e) => setSelectedProfession(e.target.value)}
                >
                    {professions.map((profession: Profession) => (
                        <option key={profession.value} value={profession.value}>
                            {profession.label}
                        </option>
                    ))}
                </select>

                <button
                    className="start-button"
                    onClick={handleStartGame}
                >
                    Start Game
                </button>
            </div>
        </div>
    )
}

export default StartPage