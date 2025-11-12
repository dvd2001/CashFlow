import { useState } from 'react';
import { useLanguage } from '../../contexts/languageContext';

interface PropertyAsset {
    id: string
    name: string
    downPayment: number
    totalCost: number
    mortgage: number
    passiveIncome: number
}

interface PropertyAssetManagementModalProps {
    show: boolean
    onClose: () => void
    selectedPropertyAsset: PropertyAsset | null
    onUpdateIncome: (assetId: string, newIncome: number) => void
    onSell: (assetId: string, sellPrice: number) => void
}

function PropertyAssetManagementModal({ show, onClose, selectedPropertyAsset, onUpdateIncome, onSell }: PropertyAssetManagementModalProps) {
    const { t } = useLanguage();
    const [editPropertyPassiveIncome, setEditPropertyPassiveIncome] = useState(0);
    const [propertySellPrice, setPropertySellPrice] = useState(0);

    if (!show || !selectedPropertyAsset) return null;

    const handleUpdateIncome = () => {
        onUpdateIncome(selectedPropertyAsset.id, editPropertyPassiveIncome);
    };

    const handleSell = () => {
        onSell(selectedPropertyAsset.id, propertySellPrice);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{selectedPropertyAsset.name}</h2>

                <div className="property-edit-section">
                    <h3>{t('modals.editPassiveIncome')}</h3>
                    <div className="input-group">
                        <label>{t('modals.monthlyPassiveIncome')}</label>
                        <input
                            type="number"
                            value={editPropertyPassiveIncome}
                            onChange={(e) => setEditPropertyPassiveIncome(parseInt(e.target.value) || 0)}
                            placeholder={t('modals.enterMonthlyPassiveIncome')}
                            onWheel={(e) => e.currentTarget.blur()}
                        />
                    </div>
                    <div className="action-buttons-horizontal">
                        <button
                            className="modal-btn update-btn"
                            onClick={handleUpdateIncome}
                        >
                            {t('modals.updateIncome')}
                        </button>
                    </div>
                </div>

                <div className="property-sale-section">
                    <h3>{t('modals.sellProperty')}</h3>

                    <div className="property-current-info">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">{t('modals.originalCost')}</span>
                                <span className="info-value">${selectedPropertyAsset.totalCost.toLocaleString()}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">{t('modals.downPayment')}</span>
                                <span className="info-value">${selectedPropertyAsset.downPayment.toLocaleString()}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">{t('modals.mortgage')}</span>
                                <span className="info-value">${selectedPropertyAsset.mortgage.toLocaleString()}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">{t('modals.monthlyIncome')}</span>
                                <span className="info-value positive">+${editPropertyPassiveIncome.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>{t('modals.sellingPrice')}</label>
                        <input
                            type="number"
                            min="1"
                            value={propertySellPrice}
                            onChange={(e) => setPropertySellPrice(parseInt(e.target.value) || 0)}
                            placeholder={t('modals.enterSellingPrice')}
                            onWheel={(e) => e.currentTarget.blur()}
                        />
                    </div>

                    <div className="sale-summary">
                        <p>{t('modals.sellingPrice')} <strong>${propertySellPrice.toLocaleString()}</strong></p>
                        <p>{t('modals.mortgageToPayOff')} <strong>${selectedPropertyAsset.mortgage.toLocaleString()}</strong></p>
                        <p className="net-proceeds">{t('modals.netProceeds')} <strong>${(propertySellPrice - selectedPropertyAsset.mortgage).toLocaleString()}</strong></p>
                        {propertySellPrice < selectedPropertyAsset.mortgage && (
                            <p className="warning-note">⚠️ {t('modals.sellingPriceLessThanMortgage')}</p>
                        )}
                    </div>

                    <div className="action-buttons-horizontal">
                        <button
                            className="modal-btn sell-btn"
                            onClick={handleSell}
                            disabled={propertySellPrice <= 0 || propertySellPrice < selectedPropertyAsset.mortgage}
                        >
                            {t('modals.sellProperty')}
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

export default PropertyAssetManagementModal;