import { useLanguage } from '../../contexts/languageContext';

interface FastTrackCongratsModalProps {
    show: boolean
    onContinue: () => void
    message: string
    dreamBought: boolean
    dreamPrice: number
    totalCashFlow: number
    initialCashFlow: number
}

function FastTrackCongratsModal({
    show,
    onContinue,
    message,
    dreamBought,
    dreamPrice,
    totalCashFlow,
    initialCashFlow
}: FastTrackCongratsModalProps) {
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
                        {message}
                    </p>
                    {dreamBought && (
                        <div className="financial-summary-congrats">
                            <div className="summary-item">
                                <span>{t('modals.dreamPrice')}</span>
                                <span>${dreamPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                    <div className="financial-summary-congrats">
                        <div className="summary-item">
                            <span>{t('fastTrack.totalCashFlow')}</span>
                            <span className="positive">${totalCashFlow.toLocaleString()}</span>
                        </div>
                        {!dreamBought && (
                            <div className="summary-item">
                                <span>{t('fastTrack.cashFlowIncrease')}</span>
                                <span className="positive">+${(totalCashFlow - initialCashFlow).toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-actions">
                    <button
                        className="modal-btn continue-btn"
                        onClick={onContinue}
                    >
                        {t('congratulations.backToStartPage')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FastTrackCongratsModal;