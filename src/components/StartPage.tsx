import { useState, useEffect } from 'react' // Add useEffect import
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/languageContext'
import professions from '../data/professions.json'

interface Profession {
    value: string
    label: {
        en: string
        hu: string
    }
    payment: number
    taxes: number
    mortgagePayment: number
    schoolLoanPayment: number
    carLoanPayment: number
    creditCardPayment: number
    retailDebtPayment?: number
    otherExpenses: number
    expensePerChild: number
    mortageAmount: number
    schoolLoanAmount: number
    carLoanAmount: number
    creditCardDebt: number
    retailDebt?: number
    savings: number
}

function StartPage() {
    const [selectedProfession, setSelectedProfession] = useState<string>(professions[0].value)
    const [darkMode, setDarkMode] = useState<boolean>(false) // Initialize with false
    const { language, setLanguage, t } = useLanguage()
    const navigate = useNavigate()

    // Read dark mode from localStorage on component mount
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode')
        if (savedDarkMode) {
            const isDarkMode = JSON.parse(savedDarkMode)
            setDarkMode(isDarkMode)
            if (isDarkMode) {
                document.body.classList.add('dark-mode')
            } else {
                document.body.classList.remove('dark-mode')
            }
        }
    }, [])

    const handleStartGame = () => {
        const selected = professions.find(p => p.value === selectedProfession)
        if (selected) {
            // Convert profession label to string based on current language
            const professionWithStringLabel = {
                ...selected,
                retailDebtPayment: selected.retailDebtPayment || 0,
                retailDebt: selected.retailDebt || 0,
                label: selected.label[language]
            }
            navigate('/game', { state: { profession: professionWithStringLabel, darkMode, language } })
        }
    }

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)

        // Save to localStorage
        localStorage.setItem('darkMode', JSON.stringify(newDarkMode))

        if (newDarkMode) {
            document.body.classList.add('dark-mode')
        } else {
            document.body.classList.remove('dark-mode')
        }
    }

    const handleLanguageChange = (newLanguage: 'en' | 'hu') => {
        setLanguage(newLanguage)
    }

    return (
        <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="content-card">
                {/* Language Selection */}
                <div className="language-selection">
                    <label className="language-label">
                        <span>{t('language')}:</span>
                        <div className="language-buttons">
                            <button
                                className={`language-btn ${language === 'en' ? 'active' : ''}`}
                                onClick={() => handleLanguageChange('en')}
                            >
                                {t('english')}
                            </button>
                            <button
                                className={`language-btn ${language === 'hu' ? 'active' : ''}`}
                                onClick={() => handleLanguageChange('hu')}
                            >
                                {t('hungarian')}
                            </button>
                        </div>
                    </label>
                </div>

                {/* Dark Mode Toggle */}
                <div className="dark-mode-toggle">
                    <label className="toggle-label">
                        <span>{t('darkMode')}</span>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={darkMode} // This will now reflect the correct state from localStorage
                                onChange={toggleDarkMode}
                            />
                            <span className="slider"></span>
                        </div>
                    </label>
                </div>

                <h1 className="title">{t('appTitle')}</h1>

                <select
                    className="game-select"
                    value={selectedProfession}
                    onChange={(e) => setSelectedProfession(e.target.value)}
                >
                    {professions.map((profession: Profession) => (
                        <option key={profession.value} value={profession.value}>
                            {profession.label[language]}
                        </option>
                    ))}
                </select>

                <button
                    className="start-button"
                    onClick={handleStartGame}
                >
                    {t('startGame')}
                </button>
            </div>
        </div>
    )
}

export default StartPage