import { useState } from 'react';
import { useLanguage } from '../../contexts/languageContext';

interface Liability {
    name: string
    amount: number
    expenseName?: string
    expenseAmount?: number
}

interface RepayLiabilityModalProps {
    show: boolean
    onClose: () => void
    onRepay: (liability: Liability, amount: number) => void
    liabilities: Liability[]
    savings: number
}

function RepayLiabilityModal({ show, onClose, onRepay, liabilities, savings }: RepayLiabilityModalProps) {
    const { t } = useLanguage();
    const [selectedLiability, setSelectedLiability] = useState<Liability | null>(null);
    const [repayAmount, setRepayAmount] = useState(0);

    if (!show) return null;

    const handleLiabilitySelect = (liability: Liability) => {
        setSelectedLiability(liability);
        if (liability.name !== t('liabilities.bankLoan')) {
            setRepayAmount(liability.amount);
        } else {
            setRepayAmount(0);
        }
    };

    const handleBankLoanRepayChange = (value: number) => {
        if (value % 1000 === 0 && value >= 0 && value <= (selectedLiability?.amount || 0)) {
            setRepayAmount(value);
        }
    };

    const handleRepay = () => {
        if (selectedLiability) {
            onRepay(selectedLiability, repayAmount);
            setSelectedLiability(null);
            setRepayAmount(0);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">{t('modals.repayLiability')}</h2>

                <div className="liability-selection">
                    <h3>{t('modals.selectLiability')}</h3>
                    <div className="liability-options">
                        {liabilities.map((liability, index) => (
                            <div
                                key={index}
                                className={`liability-option ${selectedLiability?.name === liability.name ? 'selected' : ''}`}
                                onClick={() => handleLiabilitySelect(liability)}
                            >
                                <span className="liability-name">{liability.name}</span>
                                <span className="liability-amount">${liability.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedLiability && (
                    <div className="repay-amount-section">
                        <h3>{t('modals.repaymentAmount')}</h3>
                        {selectedLiability.name === t('liabilities.bankLoan') ? (
                            <div className="bank-loan-repay">
                                <p>{t('modals.bankLoanIncrements')}</p>
                                <input
                                    type="number"
                                    min="0"
                                    max={selectedLiability.amount}
                                    step="1000"
                                    value={repayAmount}
                                    onChange={(e) => setRepayAmount(parseInt(e.target.value) || 0)}
                                    onBlur={(e) => {
                                        let value = parseInt(e.target.value) || 0;
                                        if (value % 1000 !== 0) {
                                            value = Math.round(value / 1000) * 1000;
                                        }
                                        if (value > (selectedLiability?.amount || 0)) {
                                            value = selectedLiability?.amount || 0;
                                        }
                                        setRepayAmount(value);
                                    }}
                                    placeholder={t('modals.enterAmountIn1000s')}
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                                {repayAmount > 0 && repayAmount % 1000 !== 0 && (
                                    <p className="warning-note" style={{ color: 'orange', marginTop: '5px' }}>
                                        ⚠️ {t('modals.amountMustBeMultipleOf1000')} ${Math.round(repayAmount / 1000) * 1000}.
                                    </p>
                                )}
                                <div className="amount-options">
                                    <button onClick={() => handleBankLoanRepayChange(1000)}>$1,000</button>
                                    <button onClick={() => handleBankLoanRepayChange(5000)}>$5,000</button>
                                    <button onClick={() => handleBankLoanRepayChange(selectedLiability.amount)}>{t('modals.fullAmount')}</button>
                                </div>
                            </div>
                        ) : (
                            <div className="full-repay">
                                <p>{t('modals.fullRepaymentAmount')} <strong>${selectedLiability.amount.toLocaleString()}</strong></p>
                                <p className="expense-info">
                                    {t('modals.willEliminateExpense')} <strong>${selectedLiability.expenseAmount}</strong> {t('modals.monthly')} {selectedLiability.expenseName} {t('modals.expense')}
                                </p>
                            </div>
                        )}

                        <div className="repay-summary">
                            <p>{t('modals.availableSavings')} <strong>${savings.toLocaleString()}</strong></p>
                            <p>{t('modals.amountToRepay')} <strong>${repayAmount.toLocaleString()}</strong></p>
                            {selectedLiability.name !== t('liabilities.bankLoan') && (
                                <p>{t('modals.monthlyExpenseReduction')} <strong>${selectedLiability.expenseAmount}</strong></p>
                            )}
                            {selectedLiability.name === t('liabilities.bankLoan') && repayAmount > 0 && (
                                <p>{t('modals.monthlyExpenseReduction')} <strong>${(repayAmount * 0.10).toFixed(0)}</strong></p>
                            )}
                            <p className={savings >= repayAmount ? 'success' : 'error'}>
                                {savings >= repayAmount ? t('modals.sufficientFunds') : t('modals.insufficientFunds')}
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
                        className="modal-btn repay-modal-btn"
                        onClick={handleRepay}
                        disabled={!selectedLiability || repayAmount <= 0 || repayAmount > savings}
                    >
                        {t('modals.repayLiability')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RepayLiabilityModal;