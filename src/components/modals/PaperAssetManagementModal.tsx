import { useState } from 'react';
import { useLanguage } from '../../contexts/languageContext';

interface PaperAsset {
    id: string
    name: string
    quantity: number
    pricePerUnit: number
    passiveIncomePerUnit: number
}

interface PaperAssetManagementModalProps {
    show: boolean
    onClose: () => void
    selectedPaperAsset: PaperAsset | null
    onUpdate: (assetId: string, newQuantity: number) => void
    onSell: (assetId: string, unitsToSell: number, sellPrice: number) => void
}

function PaperAssetManagementModal({ show, onClose, selectedPaperAsset, onUpdate, onSell }: PaperAssetManagementModalProps) {
    const { t } = useLanguage();
    const [editQuantity, setEditQuantity] = useState(1);
    const [sellPrice, setSellPrice] = useState(0);
    const [unitsToSell, setUnitsToSell] = useState(1);

    if (!show || !selectedPaperAsset) return null;

    const handleUpdate = () => {
        onUpdate(selectedPaperAsset.id, editQuantity);
    };

    const handleSell = () => {
        onSell(selectedPaperAsset.id, unitsToSell, sellPrice);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{selectedPaperAsset.name}</h2>

                <div className="asset-info-section">
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">{t('modals.currentQuantity')}</span>
                            <span className="info-value">{selectedPaperAsset.quantity}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">{t('modals.pricePerUnit')}</span>
                            <span className="info-value">${selectedPaperAsset.pricePerUnit.toLocaleString()}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">{t('modals.monthlyIncomePerUnit')}</span>
                            <span className="info-value positive">+${selectedPaperAsset.passiveIncomePerUnit.toLocaleString()}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">{t('modals.totalMonthlyIncome')}</span>
                            <span className="info-value positive">+${(selectedPaperAsset.passiveIncomePerUnit * selectedPaperAsset.quantity).toLocaleString()}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">{t('modals.totalValue')}</span>
                            <span className="info-value">${(selectedPaperAsset.quantity * selectedPaperAsset.pricePerUnit).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="asset-management-section">
                    <h3>{t('modals.editQuantity')}</h3>
                    <div className="input-group">
                        <label>{t('modals.newQuantity')}</label>
                        <input
                            type="number"
                            min="1"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                            placeholder={t('modals.enterNewQuantity')}
                            onWheel={(e) => e.currentTarget.blur()}
                        />
                    </div>

                    <div className="action-buttons-horizontal">
                        <button
                            className="modal-btn update-btn"
                            onClick={handleUpdate}
                        >
                            {t('modals.updateQuantity')}
                        </button>
                    </div>
                </div>

                <div className="asset-sale-section">
                    <h3>{t('modals.sellAsset')}</h3>
                    <div className="input-group">
                        <label>{t('modals.sellPricePerUnit')}</label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(parseInt(e.target.value) || 0)}
                            placeholder={t('modals.enterSellPricePerUnit')}
                            onWheel={(e) => e.currentTarget.blur()}
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('modals.unitsToSell')} (Max: {selectedPaperAsset.quantity}):</label>
                        <input
                            type="number"
                            min="1"
                            max={selectedPaperAsset.quantity}
                            value={unitsToSell}
                            onChange={(e) => setUnitsToSell(parseInt(e.target.value) || 1)}
                            placeholder={t('modals.enterUnitsToSell')}
                            onWheel={(e) => e.currentTarget.blur()}
                        />
                    </div>

                    <div className="quantity-options">
                        <button onClick={() => setUnitsToSell(1)}>1 {t('modals.unit')}</button>
                        <button onClick={() => setUnitsToSell(Math.floor(selectedPaperAsset.quantity / 2))}>{t('modals.half')}</button>
                        <button onClick={() => setUnitsToSell(selectedPaperAsset.quantity)}>{t('modals.all')}</button>
                    </div>

                    <div className="sale-summary">
                        <p>{t('modals.unitsToSell')} <strong>{unitsToSell}</strong></p>
                        <p>{t('modals.remainingAfterSale')} <strong>{selectedPaperAsset.quantity - unitsToSell}</strong></p>
                        <p>{t('modals.monthlyIncomeLost')} <strong>-${(selectedPaperAsset.passiveIncomePerUnit * unitsToSell).toLocaleString()}</strong></p>
                        <p>{t('modals.salePricePerUnit')} <strong>${sellPrice.toLocaleString()}</strong></p>
                        <p className="net-proceeds">{t('modals.totalSaleAmount')} <strong>${(unitsToSell * sellPrice).toLocaleString()}</strong></p>
                        {unitsToSell > selectedPaperAsset.quantity && (
                            <p className="warning-note">⚠️ {t('modals.cannotSellMoreThanOwn')}</p>
                        )}
                    </div>

                    <div className="action-buttons-horizontal">
                        <button
                            className="modal-btn sell-btn"
                            onClick={handleSell}
                            disabled={sellPrice <= 0 || unitsToSell < 1 || unitsToSell > selectedPaperAsset.quantity}
                        >
                            {unitsToSell === selectedPaperAsset.quantity ? t('modals.sellAllUnits') : `${t('modals.sell')} ${unitsToSell} ${t('modals.units')}`}
                        </button>
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        className="modal-btn cancel-btn"
                        onClick={onClose}
                    >
                        {t('modals.close')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaperAssetManagementModal;