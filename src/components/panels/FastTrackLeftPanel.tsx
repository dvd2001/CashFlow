import { useLanguage } from '../../contexts/languageContext';

interface FastTrackLeftPanelProps {
    initialCashFlow: number
    additionalCashFlow: number
    totalCashFlow: number
    goalCashFlow: number
    progressPercentage: number
    onCashflowDay: () => void
    onTaxAudit: () => void
    onDivorce: () => void
    onCharity: () => void
    onBuyDream: () => void
    onBackToGame: () => void
}

function FastTrackLeftPanel({
    initialCashFlow,
    additionalCashFlow,
    totalCashFlow,
    goalCashFlow,
    progressPercentage,
    onCashflowDay,
    onTaxAudit,
    onDivorce,
    onCharity,
    onBuyDream,
    onBackToGame
}: FastTrackLeftPanelProps) {
    const { t } = useLanguage();

    return (
        <div className="left-panel">
            <div className="panel-content">
                <h1 className="panel-title">{t('fastTrack.fastTrack')}</h1>

                <div className="financial-summary">
                    <div className="summary-item">
                        <span>{t('fastTrack.initialCashFlow')}</span>
                        <span className="positive">+${initialCashFlow.toLocaleString()}</span>
                    </div>
                    <div className="summary-item">
                        <span>{t('fastTrack.additionalCashFlow')}</span>
                        <span className="positive">+${additionalCashFlow.toLocaleString()}</span>
                    </div>
                    <div className="summary-item net-cash-flow">
                        <span>{t('fastTrack.totalCashFlow')}</span>
                        <span className="positive">+${totalCashFlow.toLocaleString()}</span>
                    </div>
                    <div className="summary-item">
                        <span>{t('fastTrack.goalCashFlow')}</span>
                        <span>+${goalCashFlow.toLocaleString()}</span>
                    </div>
                    <div className="summary-item">
                        <span>{t('fastTrack.progress')}</span>
                        <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                </div>

                <div className="goal-progress">
                    <h3>{t('fastTrack.goalIncrease')}</h3>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="progress-text">
                        <span>+${(totalCashFlow - initialCashFlow).toLocaleString()} / +$50,000</span>
                    </div>
                    {totalCashFlow >= goalCashFlow && (
                        <div className="goal-achieved">
                            {t('fastTrack.goalAchieved')}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="action-btn cashflow-day-btn" onClick={onCashflowDay}>
                        {t('fastTrack.cashflowDay')}
                    </button>
                    <button className="action-btn tax-audit-btn" onClick={onTaxAudit}>
                        {t('fastTrack.taxAudit')}
                    </button>
                    <button className="action-btn divorce-btn" onClick={onDivorce}>
                        {t('fastTrack.divorce')}
                    </button>
                    <button className="action-btn charity-btn" onClick={onCharity}>
                        {t('game.charity')}
                    </button>
                    <button className="action-btn buy-dream-btn" onClick={onBuyDream}>
                        {t('fastTrack.buyYourDream')}
                    </button>
                </div>

                <button
                    className="back-button"
                    onClick={onBackToGame}
                >
                    {t('congratulations.backToStartPage')}
                </button>
            </div>
        </div>
    );
}

export default FastTrackLeftPanel;