import { useLanguage } from '../../contexts/languageContext';

interface GameCongratulationsModalProps {
    show: boolean
    onContinue: () => void
    totalPassiveIncome: number
    totalExpenses: number
    darkMode?: boolean
}

function GameCongratulationsModal({ show, onContinue, totalPassiveIncome, totalExpenses }: GameCongratulationsModalProps) {
    const { t } = useLanguage();

    if (!show) return null;

    return (
        <div className="modal-overlay congrats-overlay">
            <div className="modal-content congrats-modal">
                <div className="congrats-header">
                    <h2 className="congrats-title">{t('congratulations.title')}</h2>
                </div>
                <div className="congrats-body">
                    <p className="congrats-message">
                        {t('congratulations.message')}
                    </p>
                    <div className="financial-summary-congrats">
                        <div className="summary-item">
                            <span>{t('game.passiveIncome')}</span>
                            <span className="positive">${totalPassiveIncome.toLocaleString()}/{t('game.month')}</span>
                        </div>
                        <div className="summary-item">
                            <span>{t('game.totalExpenses')}</span>
                            <span>${totalExpenses.toLocaleString()}/{t('game.month')}</span>
                        </div>
                        <div className="summary-item net-cash-flow">
                            <span>{t('game.monthlySurplus')}</span>
                            <span className="positive">+${(totalPassiveIncome - totalExpenses).toLocaleString()}/{t('game.month')}</span>
                        </div>
                    </div>
                    <p className="congrats-submessage">
                        {t('congratulations.achievedFinancialFreedom')}
                    </p>
                </div>
                <div className="modal-actions">
                    <button
                        className="modal-btn continue-btn"
                        onClick={onContinue}
                    >
                        {t('congratulations.continueToFastTrack')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GameCongratulationsModal;