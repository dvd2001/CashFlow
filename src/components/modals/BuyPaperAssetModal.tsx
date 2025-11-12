import { useState } from 'react';
import { useLanguage } from '../../contexts/languageContext';

interface PaperAssetType {
    value: string
    labelKey: string
}

interface BuyPaperAssetModalProps {
    show: boolean
    onClose: () => void
    onConfirm: (assetType: string, quantity: number, price: number, passiveIncome: number) => void
    paperAssetTypes: PaperAssetType[]
    savings: number
}

function BuyPaperAssetModal({ show, onClose, onConfirm, paperAssetTypes, savings }: BuyPaperAssetModalProps) {
    const { t } = useLanguage();
    const [selectedPaperAssetType, setSelectedPaperAssetType] = useState('');
    const [paperAssetQuantity, setPaperAssetQuantity] = useState(1);
    const [paperAssetPrice, setPaperAssetPrice] = useState(0);
    const [paperAssetPassiveIncome, setPaperAssetPassiveIncome] = useState(0);

    if (!show) return null;

    const paperAssetTotalCost = paperAssetQuantity * paperAssetPrice;

    const handlePaperAssetTypeSelect = (assetType: string) => {
        setSelectedPaperAssetType(assetType);
    };

    const handlePaperAssetQuantityChange = (value: number) => {
        if (value >= 1 && value <= 5000) {
            setPaperAssetQuantity(value);
        }
    };

    const handlePaperAssetPriceChange = (value: number) => {
        if (value >= 1) {
            setPaperAssetPrice(value);
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedPaperAssetType, paperAssetQuantity, paperAssetPrice, paperAssetPassiveIncome);
        setSelectedPaperAssetType('');
        setPaperAssetQuantity(1);
        setPaperAssetPrice(0);
        setPaperAssetPassiveIncome(0);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{t('modals.buyPaperAsset')}</h2>

                <div className="paper-asset-selection">
                    <div className="paper-asset-input-group">
                        <label htmlFor="paper-asset-type">{t('modals.selectAssetType')}</label>
                        <select
                            id="paper-asset-type"
                            className="paper-asset-select"
                            value={selectedPaperAssetType}
                            onChange={(e) => handlePaperAssetTypeSelect(e.target.value)}
                        >
                            <option value="">{t('modals.chooseAssetType')}</option>
                            {paperAssetTypes.map((assetType, index) => (
                                <option key={index} value={assetType.value}>
                                    {t(assetType.labelKey)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedPaperAssetType && (
                    <div className="paper-asset-details">
                        <h3>{t('modals.purchaseDetails')}</h3>
                        <div className="paper-asset-input-group">
                            <label>{t('modals.quantity')} (1-5000):</label>
                            <input
                                type="number"
                                min="1"
                                max="5000"
                                value={paperAssetQuantity}
                                onChange={(e) => handlePaperAssetQuantityChange(parseInt(e.target.value) || 1)}
                                placeholder={t('modals.enterQuantity')}
                                onWheel={(e) => e.currentTarget.blur()}
                            />
                        </div>
                        <div className="paper-asset-input-group">
                            <label>{t('modals.pricePerUnit')}</label>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={paperAssetPrice}
                                onChange={(e) => handlePaperAssetPriceChange(parseInt(e.target.value) || 0)}
                                placeholder={t('modals.enterWholeNumberPrice')}
                                onWheel={(e) => e.currentTarget.blur()}
                            />
                        </div>
                        <div className="paper-asset-input-group">
                            <label>{t('modals.monthlyPassiveIncomePerUnit')}</label>
                            <input
                                type="number"
                                value={paperAssetPassiveIncome}
                                onChange={(e) => setPaperAssetPassiveIncome(parseInt(e.target.value) || 0)}
                                placeholder={t('modals.enterMonthlyPassiveIncome')}
                                onWheel={(e) => e.currentTarget.blur()}
                            />
                        </div>

                        <div className="paper-asset-summary">
                            <p>{t('modals.totalCost')} <strong>${paperAssetTotalCost.toLocaleString()}</strong></p>
                            <p>{t('modals.monthlyPassiveIncome')} <strong>+${paperAssetPassiveIncome.toLocaleString()}</strong></p>
                            <p>{t('modals.availableSavings')} <strong>${savings.toLocaleString()}</strong></p>
                            <p className={savings >= paperAssetTotalCost ? 'success' : 'error'}>
                                {savings >= paperAssetTotalCost ? t('modals.sufficientFunds') : t('modals.insufficientFunds')}
                            </p>
                        </div>
                    </div>
                )}

                <div className="modal-actions">
                    <button
                        className="modal-btn cancel-btn"
                        onClick={onClose}
                    >
                        {t('modals.cancel')}
                    </button>
                    <button
                        className="modal-btn buy-paper-asset-btn"
                        onClick={handleConfirm}
                        disabled={!selectedPaperAssetType || paperAssetQuantity < 1 || paperAssetPrice <= 0 || paperAssetTotalCost > savings}
                    >
                        {t('modals.buyPaperAsset')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BuyPaperAssetModal;