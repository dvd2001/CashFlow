import { useLanguage } from '../../contexts/languageContext';

interface GameSavingsSectionProps {
    savings: number
    onAddFunds: (amount: number) => void
    onWithdraw: (amount: number) => void
}

function GameSavingsSection({ savings, onAddFunds, onWithdraw }: GameSavingsSectionProps) {
    const { t } = useLanguage();

    const handleAddFunds = () => {
        const amount = parseInt(prompt(t('game.addFundsPrompt')) || '0');
        if (amount > 0) onAddFunds(amount);
    };

    const handleWithdraw = () => {
        const amount = parseInt(prompt(t('game.withdrawPrompt')) || '0');
        if (amount > 0) {
            if (amount <= savings) {
                onWithdraw(amount);
            } else {
                alert(t('alerts.insufficientSavings'));
            }
        }
    };

    return (
        <div className="savings-section">
            <div className="savings-content">
                <div className="savings-info">
                    <span className="savings-label">{t('game.savings')}:</span>
                    <span className="savings-amount">${savings.toLocaleString()}</span>
                </div>
                <div className="savings-actions">
                    <button
                        className="savings-btn add-btn"
                        onClick={handleAddFunds}
                    >
                        {t('game.addFunds')}
                    </button>
                    <button
                        className="savings-btn withdraw-btn"
                        onClick={handleWithdraw}
                    >
                        {t('game.withdraw')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GameSavingsSection;