import { useLanguage } from '../../contexts/languageContext';

interface Profession {
    label: string
    payment: number
    expensePerChild: number
}

interface Expense {
    name: string
    amount: number
}

interface Liability {
    name: string
    amount: number
}

interface GameLeftPanelProps {
    profession: Profession
    numberOfChildren: number
    onChildrenChange: (value: number) => void
    expenses: Expense[]
    liabilities: Liability[]
    totalIncome: number
    totalPassiveIncome: number
    totalExpenses: number
    monthlyCashFlow: number
    onPayday: () => void
    onRepayLiability: () => void
    onGetLoan: () => void
    onCharity: () => void
    onDownsizing: () => void
    onBackToStart: () => void
}

function GameLeftPanel({
    profession,
    numberOfChildren,
    onChildrenChange,
    expenses,
    liabilities,
    totalIncome,
    totalPassiveIncome,
    totalExpenses,
    monthlyCashFlow,
    onPayday,
    onRepayLiability,
    onGetLoan,
    onCharity,
    onDownsizing,
    onBackToStart
}: GameLeftPanelProps) {
    const { t } = useLanguage();

    return (
        <div className="left-panel">
            <div className="panel-content">
                <h1 className="panel-title">{t('game.yourProfession')}</h1>

                <div className="profession-display">
                    <h2>{profession.label.toUpperCase()}</h2>
                </div>

                <div className="salary-display">
                    <div className="salary-info">
                        <span>{t('game.monthlySalary')}</span>
                        <span>${profession.payment.toLocaleString()}</span>
                    </div>
                </div>

                <div className="financial-summary">
                    <div className="summary-item">
                        <span>{t('game.totalIncome')}</span>
                        <span>${totalIncome}</span>
                    </div>
                    <div className="summary-item">
                        <span>{t('game.passiveIncome')}</span>
                        <span>${totalPassiveIncome}</span>
                    </div>
                    <div className="summary-item">
                        <span>{t('game.totalExpenses')}</span>
                        <span>${totalExpenses}</span>
                    </div>
                    <div className="summary-item net-cash-flow">
                        <span>{t('game.monthlyCashFlow')}</span>
                        <span>${monthlyCashFlow}</span>
                    </div>
                </div>

                <div className="financial-sections">
                    {/* Expenses Section */}
                    <div className="section">
                        <h3 className="section-title">{t('game.expenses')}</h3>
                        <div className="items-list">
                            {expenses.map((expense, index) => (
                                <div key={index} className="item-row">
                                    <span className="item-name">{expense.name}:</span>
                                    <span className="item-amount">${expense.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Liabilities Section */}
                    <div className="section">
                        <h3 className="section-title">{t('game.liabilities')}</h3>
                        <div className="items-list">
                            {liabilities.map((liability, index) => (
                                <div key={index} className="item-row">
                                    <span className="item-name">{liability.name}:</span>
                                    <span className="item-amount">${liability.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="action-btn payday-btn" onClick={onPayday}>
                        {t('game.payday')}
                    </button>
                    <button className="action-btn repay-liability-btn" onClick={onRepayLiability}>
                        {t('game.repayLiability')}
                    </button>
                    <button className="action-btn loan-btn" onClick={onGetLoan}>
                        {t('game.getLoan')}
                    </button>
                    <button className="action-btn charity-btn" onClick={onCharity}>
                        {t('game.charity')}
                    </button>
                    <button className="action-btn downsizing-btn" onClick={onDownsizing}>
                        {t('game.downsizing')}
                    </button>
                </div>

                <div className="children-section">
                    <div className="children-input">
                        <label htmlFor="children-count">{t('game.numberOfChildren')}:</label>
                        <div className="children-controls">
                            <button
                                className="children-btn minus-btn"
                                onClick={() => onChildrenChange(Math.max(0, numberOfChildren - 1))}
                                disabled={numberOfChildren <= 0}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                id="children-count"
                                min="0"
                                max="3"
                                value={numberOfChildren}
                                onChange={(e) => onChildrenChange(parseInt(e.target.value) || 0)}
                                onWheel={(e) => e.currentTarget.blur()}
                                readOnly
                                className="children-input-field"
                            />
                            <button
                                className="children-btn plus-btn"
                                onClick={() => onChildrenChange(Math.min(3, numberOfChildren + 1))}
                                disabled={numberOfChildren >= 3}
                            >
                                +
                            </button>
                        </div>
                        <div className="child-expense-note">
                            {t('game.expensePerChild')}: ${profession.expensePerChild}
                        </div>
                    </div>
                </div>

                <button
                    className="back-button"
                    onClick={onBackToStart}
                >
                    {t('game.backToStart')}
                </button>
            </div>
        </div>
    );
}

export default GameLeftPanel;