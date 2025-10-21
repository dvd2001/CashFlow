import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import professions from '../data/professions.json'

interface Profession {
    value: string
    label: string
}

function StartPage() {
    const [selectedProfession, setSelectedProfession] = useState<string>(professions[0].value)
    const navigate = useNavigate()

    const handleStartGame = () => {
        const selected = professions.find(p => p.value === selectedProfession)
        navigate('/game', { state: { profession: selected } })
    }

    return (
        <div className="app-container">
            <div className="content-card">
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