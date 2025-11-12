import { useState } from 'react';
import { useLanguage } from '../../contexts/languageContext';

interface BuyDreamModalProps {
    show: boolean
    onClose: () => void
    onConfirm: (dreamPrice: number) => void
    savings: number
}

function BuyDreamModal({ show, onClose, onConfirm, savings }: BuyDreamModalProps) {
    const { t } = useLanguage();
    const [dreamPrice, setDreamPrice] = useState(0);

    if (!show) return null;

    const handleConfirm = () => {
        onConfirm(dreamPrice);
        setDreamPrice(0);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{t('fastTrack.buyYourDream')}</h2>
                <div className="dream-modal-content">
                    <p>{t('modals.whatIsDreamPrice')}</p>
                    <div className="paper-asset-input-group">
                        <label>{t('modals.dreamPrice')}</label>
                        <input
                            type="number"
                            min="0"
                            value={dreamPrice}
                            onChange={(e) => setDreamPrice(parseInt(e.target.value) || 0)}
                            placeholder={t('modals.enterDreamPrice')}
                            onWheel={(e) => e.currentTarget.blur()}
                        />
                    </div>
                    <div className="dream-summary">
                        <p>{t('modals.dreamPrice')} <strong>${dreamPrice.toLocaleString()}</strong></p>
                        <p>{t('modals.availableSavings')} <strong>${savings.toLocaleString()}</strong></p>
                        <p className={savings >= dreamPrice ? 'success' : 'error'}>
                            {savings >= dreamPrice ? t('modals.sufficientFunds') : t('modals.insufficientFunds')}
                        </p>
                    </div>
                    <p className="dream-note">{t('modals.buyDreamNote')}</p>
                </div>
                <div className="modal-actions">
                    <button
                        className="modal-btn cancel-btn"
                        onClick={onClose}
                    >
                        {t('modals.cancel')}
                    </button>
                    <button
                        className="modal-btn buy-dream-confirm-btn"
                        onClick={handleConfirm}
                        disabled={dreamPrice <= 0 || dreamPrice > savings}
                    >
                        {t('modals.buyMyDream')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BuyDreamModal;