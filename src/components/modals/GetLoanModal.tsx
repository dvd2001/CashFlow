import { useState } from 'react';
import { useLanguage } from '../../contexts/languageContext';

interface GetLoanModalProps {
    show: boolean
    onClose: () => void
    onConfirm: (loanType: 'bank' | 'retail', amount: number, retailExpenseAmount: number) => void
}

function GetLoanModal({ show, onClose, onConfirm }: GetLoanModalProps) {
    const { t } = useLanguage();
    const [selectedLoanType, setSelectedLoanType] = useState<'bank' | 'retail' | null>(null);
    const [loanAmount, setLoanAmount] = useState(0);
    const [retailExpenseAmount, setRetailExpenseAmount] = useState(0);

    if (!show) return null;

    const handleLoanTypeSelect = (loanType: 'bank' | 'retail') => {
        setSelectedLoanType(loanType);
        setLoanAmount(0);
        setRetailExpenseAmount(0);
    };

    const handleLoanAmountChange = (value: number) => {
        if (selectedLoanType === 'bank') {
            if (value % 1000 === 0 && value >= 0) {
                setLoanAmount(value);
            }
        } else {
            if (value >= 0) {
                setLoanAmount(value);
            }
        }
    };

    const handleRetailExpenseChange = (value: number) => {
        if (value >= 0) {
            setRetailExpenseAmount(value);
        }
    };

    const handleConfirm = () => {
        if (selectedLoanType) {
            onConfirm(selectedLoanType, loanAmount, retailExpenseAmount);
            setSelectedLoanType(null);
            setLoanAmount(0);
            setRetailExpenseAmount(0);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{t('modals.getLoan')}</h2>

                <div className="loan-type-selection">
                    <h3>{t('modals.selectLoanType')}</h3>
                    <div className="loan-type-options">
                        <div
                            className={`loan-type-option ${selectedLoanType === 'bank' ? 'selected' : ''}`}
                            onClick={() => handleLoanTypeSelect('bank')}
                        >
                            <span className="loan-type-name">{t('modals.bankLoan')}</span>
                            <span className="loan-type-desc">{t('modals.bankLoanDesc')}</span>
                        </div>
                        <div
                            className={`loan-type-option ${selectedLoanType === 'retail' ? 'selected' : ''}`}
                            onClick={() => handleLoanTypeSelect('retail')}
                        >
                            <span className="loan-type-name">{t('modals.retailDebt')}</span>
                            <span className="loan-type-desc">{t('modals.retailDebtDesc')}</span>
                        </div>
                    </div>
                </div>

                {selectedLoanType && (
                    <div className="loan-amount-section">
                        <h3>{t('modals.loanDetails')}</h3>
                        {selectedLoanType === 'bank' ? (
                            <div className="bank-loan-amount">
                                <p>{t('modals.bankLoanMustBeMultiple')}</p>
                                <input
                                    type="number"
                                    min="1000"
                                    step="1000"
                                    value={loanAmount}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 0;
                                        setLoanAmount(value);
                                    }}
                                    onBlur={(e) => {
                                        let value = parseInt(e.target.value) || 0;
                                        if (value < 1000) {
                                            value = 1000;
                                        } else if (value % 1000 !== 0) {
                                            value = Math.round(value / 1000) * 1000;
                                        }
                                        setLoanAmount(value);
                                    }}
                                    placeholder={t('modals.enterAmountMultiplesOf1000')}
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                                {loanAmount > 0 && loanAmount % 1000 !== 0 && (
                                    <p className="warning-note" style={{ color: 'orange', marginTop: '5px' }}>
                                        ⚠️ {t('modals.amountMustBeMultipleOf1000Adjust')} ${Math.round(loanAmount / 1000) * 1000} {t('modals.whenYouProceed')}
                                    </p>
                                )}
                                <div className="amount-options">
                                    <button onClick={() => setLoanAmount(1000)}>$1,000</button>
                                    <button onClick={() => setLoanAmount(5000)}>$5,000</button>
                                    <button onClick={() => setLoanAmount(10000)}>$10,000</button>
                                </div>
                            </div>
                        ) : (
                            <div className="retail-debt-amount">
                                <div className="retail-input-group">
                                    <label>{t('modals.loanAmountAny')}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={loanAmount}
                                        onChange={(e) => handleLoanAmountChange(parseInt(e.target.value) || 0)}
                                        placeholder={t('modals.enterAmount')}
                                        onWheel={(e) => e.currentTarget.blur()}
                                    />
                                </div>
                                <div className="retail-input-group">
                                    <label>{t('modals.monthlyExpense')}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={retailExpenseAmount}
                                        onChange={(e) => handleRetailExpenseChange(parseInt(e.target.value) || 0)}
                                        placeholder={t('modals.enterMonthlyExpense')}
                                        onWheel={(e) => e.currentTarget.blur()}
                                    />
                                </div>
                                <div className="amount-options">
                                    <button onClick={() => handleLoanAmountChange(500)}>$500</button>
                                    <button onClick={() => handleLoanAmountChange(1000)}>$1,000</button>
                                    <button onClick={() => handleLoanAmountChange(2000)}>$2,000</button>
                                </div>
                            </div>
                        )}

                        <div className="loan-summary">
                            <p>{t('modals.amountToReceive')} <strong>${loanAmount.toLocaleString()}</strong></p>
                            <p>{t('modals.monthlyExpenseIncrease')} <strong>${selectedLoanType === 'bank' ? (loanAmount * 0.10).toFixed(0) : retailExpenseAmount}</strong></p>
                            <p className={selectedLoanType === 'bank' ? 'info-note' : 'warning-note'}>
                                {selectedLoanType === 'bank'
                                    ? t('modals.bankLoanAddedToSavings')
                                    : t('modals.retailDebtNotAddedToSavings')
                                }
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
                        className="modal-btn get-loan-btn"
                        onClick={handleConfirm}
                        disabled={!selectedLoanType || loanAmount <= 0 || (selectedLoanType === 'retail' && retailExpenseAmount <= 0)}
                    >
                        {t('modals.getLoan')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GetLoanModal;