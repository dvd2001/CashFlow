import { useState } from 'react';
import { useLanguage } from '../../contexts/languageContext';

interface PropertyType {
    value: string
    labelKey: string
}

interface BuyPropertyAssetModalProps {
    show: boolean
    onClose: () => void
    onConfirm: (propertyType: string, downPayment: number, totalCost: number, mortgage: number, passiveIncome: number) => void
    propertyTypes: PropertyType[]
    savings: number
}

function BuyPropertyAssetModal({ show, onClose, onConfirm, propertyTypes, savings }: BuyPropertyAssetModalProps) {
    const { t } = useLanguage();
    const [selectedPropertyType, setSelectedPropertyType] = useState('');
    const [propertyDownPayment, setPropertyDownPayment] = useState(0);
    const [propertyTotalCost, setPropertyTotalCost] = useState(0);
    const [propertyMortgage, setPropertyMortgage] = useState(0);
    const [propertyPassiveIncome, setPropertyPassiveIncome] = useState(0);

    if (!show) return null;

    const handlePropertyTypeSelect = (propertyType: string) => {
        setSelectedPropertyType(propertyType);
    };

    const handlePropertyDownPaymentChange = (value: number) => {
        if (value >= 0) {
            setPropertyDownPayment(value);
            if (propertyTotalCost > 0) {
                setPropertyMortgage(propertyTotalCost - value);
            }
        }
    };

    const handlePropertyTotalCostChange = (value: number) => {
        if (value >= 0) {
            setPropertyTotalCost(value);
            if (propertyDownPayment > 0) {
                setPropertyMortgage(value - propertyDownPayment);
            }
        }
    };

    const handlePropertyMortgageChange = (value: number) => {
        if (value >= 0) {
            setPropertyMortgage(value);
        }
    };

    const handlePropertyPassiveIncomeChange = (value: number) => {
        setPropertyPassiveIncome(value);
    };

    const handleConfirm = () => {
        onConfirm(selectedPropertyType, propertyDownPayment, propertyTotalCost, propertyMortgage, propertyPassiveIncome);
        setSelectedPropertyType('');
        setPropertyDownPayment(0);
        setPropertyTotalCost(0);
        setPropertyMortgage(0);
        setPropertyPassiveIncome(0);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{t('modals.buyPropertyAsset')}</h2>

                <div className="property-asset-selection">
                    <div className="property-asset-input-group">
                        <label htmlFor="property-type">{t('modals.selectAssetType')}</label>
                        <select
                            id="property-type"
                            className="property-asset-select"
                            value={selectedPropertyType}
                            onChange={(e) => handlePropertyTypeSelect(e.target.value)}
                        >
                            <option value="">{t('modals.choosePropertyType')}</option>
                            {propertyTypes.map((propertyType, index) => (
                                <option key={index} value={propertyType.value}>
                                    {t(propertyType.labelKey)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedPropertyType && (
                    <div className="property-asset-details">
                        <h3>{t('modals.propertyDetails')}</h3>
                        <div className="property-asset-input-group">
                            <label>{t('modals.downPayment')}</label>
                            <input
                                type="number"
                                min="0"
                                value={propertyDownPayment}
                                onChange={(e) => handlePropertyDownPaymentChange(parseInt(e.target.value) || 0)}
                                placeholder={t('modals.enterDownPayment')}
                                onWheel={(e) => e.currentTarget.blur()}
                            />
                        </div>
                        <div className="property-asset-input-group">
                            <label>{t('modals.totalCost')}</label>
                            <input
                                type="number"
                                min="0"
                                value={propertyTotalCost}
                                onChange={(e) => handlePropertyTotalCostChange(parseInt(e.target.value) || 0)}
                                placeholder={t('modals.enterTotalCost')}
                                onWheel={(e) => e.currentTarget.blur()}
                            />
                        </div>
                        <div className="property-asset-input-group">
                            <label>{t('modals.mortgage')}</label>
                            <input
                                type="number"
                                min="0"
                                value={propertyMortgage}
                                onChange={(e) => handlePropertyMortgageChange(parseInt(e.target.value) || 0)}
                                placeholder={t('modals.enterMortgageAmount')}
                                onWheel={(e) => e.currentTarget.blur()}
                            />
                        </div>
                        <div className="property-asset-input-group">
                            <label>{t('modals.monthlyPassiveIncome')}</label>

                            <div className="passive-income-input-group">
                                <label>{t('modals.amount')}:</label>
                                <input
                                    type="number"
                                    value={Math.abs(propertyPassiveIncome)}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 0;
                                        handlePropertyPassiveIncomeChange(propertyPassiveIncome >= 0 ? value : -value);
                                    }}
                                    placeholder={t('modals.enterAmount')}
                                    onWheel={(e) => e.currentTarget.blur()}
                                    className="passive-income-amount-input"
                                />
                            </div>

                            <div className="passive-income-toggle">
                                <span className="passive-income-label">{t('modals.incomeType')}:</span>
                                <span className={`passive-income-status ${propertyPassiveIncome >= 0 ? 'positive' : 'negative'}`}>
                                    {propertyPassiveIncome >= 0 ? t('modals.positive') : t('modals.negative')}
                                </span>
                                <label className="passive-income-toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={propertyPassiveIncome >= 0}
                                        onChange={(e) => {
                                            const isPositive = e.target.checked;
                                            handlePropertyPassiveIncomeChange(isPositive ? Math.abs(propertyPassiveIncome) : -Math.abs(propertyPassiveIncome));
                                        }}
                                    />
                                    <span className="passive-income-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="property-asset-summary">
                            <p>{t('modals.downPayment')} <strong>${propertyDownPayment.toLocaleString()}</strong></p>
                            <p>{t('modals.totalCost')} <strong>${propertyTotalCost.toLocaleString()}</strong></p>
                            <p>{t('modals.mortgage')} <strong>${propertyMortgage.toLocaleString()}</strong></p>
                            <p>{t('modals.monthlyPassiveIncome')} <strong>{propertyPassiveIncome >= 0 ? '+' : ''}${propertyPassiveIncome.toLocaleString()}</strong></p>
                            <p>{t('modals.availableSavings')} <strong>${savings.toLocaleString()}</strong></p>
                            <p className={savings >= propertyDownPayment ? 'success' : 'error'}>
                                {savings >= propertyDownPayment ? t('modals.sufficientFundsForDownPayment') : t('modals.insufficientFundsForDownPayment')}
                            </p>
                            <p className={propertyDownPayment + propertyMortgage === propertyTotalCost ? 'success' : 'error'}>
                                {propertyDownPayment + propertyMortgage === propertyTotalCost ? t('modals.downPaymentPlusMortgageEqualsTotalCost') : t('modals.downPaymentPlusMortgageMustEqualTotalCost')}
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
                        className="modal-btn buy-property-asset-btn"
                        onClick={handleConfirm}
                        disabled={
                            !selectedPropertyType ||
                            propertyDownPayment < 0 ||
                            propertyTotalCost <= 0 ||
                            propertyDownPayment + propertyMortgage !== propertyTotalCost ||
                            propertyDownPayment > savings
                        }
                    >
                        {t('modals.buyProperty')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BuyPropertyAssetModal;