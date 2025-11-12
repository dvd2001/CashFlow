import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/languageContext';
import RepayLiabilityModal from '../components/modals/RepayLiabilityModal';
import GetLoanModal from '../components/modals/GetLoanModal';
import BuyPaperAssetModal from '../components/modals/BuyPaperAssetModal';
import BuyPropertyAssetModal from '../components/modals/BuyPropertyAssetModal';
import PaperAssetManagementModal from '../components/modals/PaperAssetManagementModal';
import PropertyAssetManagementModal from '../components/modals/PropertyAssetManagementModal';
import GameCongratulationsModal from '../components/modals/GameCongratulationsModal';

interface Profession {
    value: string
    label: string
    payment: number
    taxes: number
    mortgagePayment: number
    schoolLoanPayment: number
    carLoanPayment: number
    creditCardPayment: number
    retailDebtPayment: number
    otherExpenses: number
    expensePerChild: number
    mortageAmount: number
    schoolLoanAmount: number
    carLoanAmount: number
    creditCardDebt: number
    retailDebt: number
    savings: number
}

interface LocationState {
    profession: Profession
    darkMode?: boolean
    language?: string
}

interface Liability {
    name: string
    amount: number
    expenseName?: string
    expenseAmount?: number
}

interface Expense {
    name: string
    amount: number
}

interface PaperAsset {
    id: string
    name: string
    quantity: number
    pricePerUnit: number
    passiveIncomePerUnit: number
}

interface PropertyAsset {
    id: string
    name: string
    downPayment: number
    totalCost: number
    mortgage: number
    passiveIncome: number
}

function GamePage() {
    const location = useLocation()
    const navigate = useNavigate()
    const { t } = useLanguage()
    const { profession, darkMode } = location.state as LocationState
    const [numberOfChildren, setNumberOfChildren] = useState(0)
    const [bankLoan, setBankLoan] = useState(0)
    const [savings, setSavings] = useState(profession.savings)
    const [retailDebt, setRetailDebt] = useState(1000)
    const [showRepayModal, setShowRepayModal] = useState(false)
    const [showGetLoanModal, setShowGetLoanModal] = useState(false)
    const [showBuyPaperAssetModal, setShowBuyPaperAssetModal] = useState(false)
    const [showBuyPropertyAssetModal, setShowBuyPropertyAssetModal] = useState(false)
    const [selectedPaperAsset, setSelectedPaperAsset] = useState<PaperAsset | null>(null)
    const [selectedPropertyAsset, setSelectedPropertyAsset] = useState<PropertyAsset | null>(null)
    const [showPaperAssetModal, setShowPaperAssetModal] = useState(false)
    const [showPropertyAssetModal, setShowPropertyAssetModal] = useState(false)
    const [showCongratsModal, setShowCongratsModal] = useState(false)

    // State for expenses that can be modified
    const [expenses, setExpenses] = useState<Expense[]>([
        { name: t('expenses.taxes'), amount: profession.taxes },
        { name: t('expenses.homeMortgage'), amount: profession.mortgagePayment },
        { name: t('expenses.schoolLoan'), amount: profession.schoolLoanPayment },
        { name: t('expenses.carLoan'), amount: profession.carLoanPayment },
        { name: t('expenses.creditCard'), amount: profession.creditCardPayment },
        { name: t('expenses.retail'), amount: 50 },
        { name: t('expenses.otherExpenses'), amount: profession.otherExpenses },
        { name: t('expenses.childExpenses'), amount: 0 },
        { name: t('expenses.bankLoanPayment'), amount: 0 }
    ])

    // State for assets
    const [paperAssets, setPaperAssets] = useState<PaperAsset[]>([])
    const [propertyAssets, setPropertyAssets] = useState<PropertyAsset[]>([])

    const paperAssetTypes = [
        { value: 'depositCertificate', labelKey: 'paperAssets.depositCertificate' },
        { value: '2BIG', labelKey: 'paperAssets.2BIG' },
        { value: 'GRO4US', labelKey: 'paperAssets.GRO4US' },
        { value: 'MYT4U', labelKey: 'paperAssets.MYT4U' },
        { value: 'OK4U', labelKey: 'paperAssets.OK4U' },
        { value: 'ON2U', labelKey: 'paperAssets.ON2U' }
    ]
    const propertyTypes = [
        { value: 'condo2_1', labelKey: 'propertyAssets.condo2_1' },
        { value: 'house3_2', labelKey: 'propertyAssets.house3_2' },
        { value: 'widgetsMakingCompany', labelKey: 'propertyAssets.widgetsMakingCompany' },
        { value: 'softwareCompany', labelKey: 'propertyAssets.softwareCompany' },
        { value: 'goldCoinPiecesOf8', labelKey: 'propertyAssets.goldCoinPiecesOf8' },
        { value: 'krugerrands', labelKey: 'propertyAssets.krugerrands' },
        { value: 'rawLand10Acres', labelKey: 'propertyAssets.rawLand10Acres' },
        { value: 'sisterInLaw', labelKey: 'propertyAssets.sisterInLaw' },
        { value: 'automatedBusiness', labelKey: 'propertyAssets.automatedBusiness' },
        { value: 'smallShoppingMall', labelKey: 'propertyAssets.smallShoppingMall' },
        { value: 'carWash', labelKey: 'propertyAssets.carWash' },
        { value: 'pizzaFranchise', labelKey: 'propertyAssets.pizzaFranchise' },
        { value: 'duplex', labelKey: 'propertyAssets.duplex' },
        { value: 'fourPlex', labelKey: 'propertyAssets.fourPlex' },
        { value: 'eightPlex', labelKey: 'propertyAssets.eightPlex' },
        { value: 'rawLand20Acres', labelKey: 'propertyAssets.rawLand20Acres' },
        { value: 'apartmentHouse12', labelKey: 'propertyAssets.apartmentHouse12' },
        { value: 'apartmentHouse24', labelKey: 'propertyAssets.apartmentHouse24' },
        { value: 'apartmentHouse60', labelKey: 'propertyAssets.apartmentHouse60' },
        { value: 'limitedPartner', labelKey: 'propertyAssets.limitedPartner' },
        { value: 'bedAndBreakfast', labelKey: 'propertyAssets.bedAndBreakfast' }
    ]

    // Calculate total passive income from all paper assets (per unit * quantity)
    const totalPaperPassiveIncome = paperAssets.reduce((sum, asset) =>
        sum + (asset.passiveIncomePerUnit * asset.quantity), 0)
    const totalPassiveIncome = propertyAssets.reduce((sum, property) => sum + property.passiveIncome, 0) + totalPaperPassiveIncome

    const handleBackToStart = () => {
        if (window.confirm(t('alerts.leavePageConfirmation'))) {
            navigate('/')
        }
    }

    const handleChildrenChange = (value: number) => {
        if (value >= 0 && value <= 3) {
            setNumberOfChildren(value)
        }
    }

    const perChildExpense = profession.expensePerChild
    const totalChildExpenses = perChildExpense * numberOfChildren
    const bankLoanExpense = bankLoan * 0.10
    const salary = profession.payment

    // Update expenses with calculated values
    const updatedExpenses = expenses.map(expense => {
        if (expense.name === t('expenses.childExpenses')) {
            return { ...expense, amount: totalChildExpenses }
        }
        if (expense.name === t('expenses.bankLoanPayment')) {
            return { ...expense, amount: bankLoanExpense }
        }
        return expense
    })

    // Liabilities data with expense mapping
    const liabilities: Liability[] = [
        {
            name: t('liabilities.homeMortgage'),
            amount: profession.mortageAmount,
            expenseName: t('expenses.homeMortgage'),
            expenseAmount: profession.mortgagePayment
        },
        {
            name: t('liabilities.schoolLoan'),
            amount: profession.schoolLoanAmount,
            expenseName: t('expenses.schoolLoan'),
            expenseAmount: profession.schoolLoanPayment
        },
        {
            name: t('liabilities.carLoan'),
            amount: profession.carLoanAmount,
            expenseName: t('expenses.carLoan'),
            expenseAmount: profession.carLoanPayment
        },
        {
            name: t('liabilities.creditCard'),
            amount: profession.creditCardDebt,
            expenseName: t('expenses.creditCard'),
            expenseAmount: profession.creditCardPayment
        },
        {
            name: t('liabilities.retailDebt'),
            amount: retailDebt,
            expenseName: t('expenses.retail'),
            expenseAmount: updatedExpenses.find(e => e.name === t('expenses.retail'))?.amount || 110
        },
        {
            name: t('liabilities.bankLoan'),
            amount: bankLoan,
            expenseName: t('expenses.bankLoanPayment'),
            expenseAmount: bankLoanExpense
        }
    ]

    const totalExpenses = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalIncome = salary + totalPassiveIncome
    const monthlyCashFlow = totalIncome - totalExpenses

    const launchConfetti = () => {
        console.log("🎉🎊🎉🎊 Congratulations! 🎉🎊🎉🎊");
    };

    // Add page leaving confirmation
    useEffect(() => {
        let shouldBlockNavigation = true;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (shouldBlockNavigation) {
                e.preventDefault();
                e.returnValue = t('alerts.leavePageConfirmation');
                return t('alerts.leavePageConfirmation');
            }
        };

        const handlePopState = (e: PopStateEvent) => {
            if (shouldBlockNavigation) {
                // Show confirmation dialog
                const confirmLeave = window.confirm(t('alerts.leavePageConfirmation'));

                if (!confirmLeave) {
                    // If user cancels, push current state back to history
                    window.history.pushState(null, '', window.location.href);
                    // Also prevent any React Router navigation
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    // User confirmed - allow navigation
                    shouldBlockNavigation = false;
                }
            }
        };

        // Add current page to history
        window.history.pushState(null, '', window.location.href);

        // Add event listeners
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState, true);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState, true);
            shouldBlockNavigation = false;
        };
    }, [t]);

    // Update the useEffect to launch confetti when condition is met
    useEffect(() => {
        if (totalPassiveIncome >= totalExpenses && totalExpenses > 0) {
            setShowCongratsModal(true);
            launchConfetti();
        }
    }, [totalPassiveIncome, totalExpenses]);

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode')
        if (savedDarkMode) {
            const isDarkMode = JSON.parse(savedDarkMode)
            if (isDarkMode) {
                document.body.classList.add('dark-mode')
            } else {
                document.body.classList.remove('dark-mode')
            }
        }
    }, [])

    // Button handlers
    const handlePayday = () => {
        setSavings(prev => prev + monthlyCashFlow)
        alert(`${t('alerts.payday')} $${monthlyCashFlow} ${t('alerts.addedToSavings')}`)
    }

    const handleRepayLiability = (liability: Liability, amount: number) => {
        const amountToRepay = liability.name === t('liabilities.bankLoan') ? amount : liability.amount

        if (liability.name === t('liabilities.bankLoan')) {
            const newBankLoan = Math.max(0, bankLoan - amount)
            setBankLoan(newBankLoan)
        } else if (liability.name === t('liabilities.retailDebt')) {
            const newRetailDebt = Math.max(0, retailDebt - amount)
            setRetailDebt(newRetailDebt)
            const currentRetailExpense = updatedExpenses.find(e => e.name === t('expenses.retail'))?.amount || 0
            const expenseReduction = (amount / retailDebt) * currentRetailExpense
            setExpenses(prev =>
                prev.map(expense =>
                    expense.name === t('expenses.retail')
                        ? { ...expense, amount: Math.max(0, expense.amount - expenseReduction) }
                        : expense
                )
            )
        } else {
            setExpenses(prev =>
                prev.map(expense =>
                    expense.name === liability.expenseName
                        ? { ...expense, amount: 0 }
                        : expense
                )
            )
        }

        // Deduct from savings
        setSavings(prev => prev - amountToRepay)

        // Calculate the expense reduction amount
        let expenseReduction = 0
        if (liability.name === t('liabilities.bankLoan')) {
            const oldExpense = bankLoanExpense
            const newExpense = (bankLoan - amount) * 0.10
            expenseReduction = oldExpense - newExpense
        } else if (liability.name === t('liabilities.retailDebt')) {
            const currentRetailExpense = updatedExpenses.find(e => e.name === t('expenses.retail'))?.amount || 0
            expenseReduction = (amount / retailDebt) * currentRetailExpense
        } else {
            expenseReduction = liability.expenseAmount || 0
        }

        // Show success message
        alert(`${t('alerts.repaid')} $${amountToRepay} ${t('alerts.of')} ${liability.name}!\n\n` +
            `${t('alerts.monthlyExpensesReduced')}: $${expenseReduction.toFixed(0)}\n` +
            `${t('alerts.monthlyCashFlowIncreased')}: $${expenseReduction.toFixed(0)}`)

        // Close modal
        setShowRepayModal(false)
    }

    const handleGetLoan = (loanType: 'bank' | 'retail', amount: number, retailExpenseAmount: number) => {
        let finalLoanAmount = amount;

        if (loanType === 'bank') {
            if (finalLoanAmount < 1000) {
                alert(t('alerts.bankLoanMin1000'));
                return;
            }

            if (finalLoanAmount % 1000 !== 0) {
                finalLoanAmount = Math.round(finalLoanAmount / 1000) * 1000;
                alert(t('alerts.bankLoanAdjusted').replace('${amount}', finalLoanAmount.toString()));
            }
        }

        if (loanType === 'bank') {
            setBankLoan(prev => prev + finalLoanAmount);
            setSavings(prev => prev + finalLoanAmount);
        } else {
            setRetailDebt(prev => prev + finalLoanAmount);
            setExpenses(prev =>
                prev.map(expense =>
                    expense.name === t('expenses.retail')
                        ? { ...expense, amount: (expense.amount || 0) + retailExpenseAmount }
                        : expense
                )
            );
        }

        // Show success message
        if (loanType === 'bank') {
            alert(`${t('alerts.bankLoanReceived')} $${finalLoanAmount}!\n\n` +
                `$${finalLoanAmount} ${t('alerts.addedToSavings')}\n` +
                `${t('alerts.monthlyExpenseIncreased')}: $${finalLoanAmount * 0.10}`);
        } else {
            alert(`${t('alerts.retailDebtReceived')} $${finalLoanAmount}!\n\n` +
                `${t('alerts.monthlyExpenseIncreased')}: $${retailExpenseAmount}\n` +
                `${t('alerts.retailDebtNote')}`);
        }

        // Close modal
        setShowGetLoanModal(false);
    }

    const handleBuyPaperAsset = (assetType: string, quantity: number, price: number, passiveIncome: number) => {
        const totalCost = quantity * price;

        // Create new paper asset with passive income per unit
        const newPaperAsset: PaperAsset = {
            id: Date.now().toString(),
            name: t(paperAssetTypes.find(a => a.value === assetType)?.labelKey || assetType),
            quantity: quantity,
            pricePerUnit: price,
            passiveIncomePerUnit: passiveIncome
        }

        // Add to paper assets
        setPaperAssets(prev => [...prev, newPaperAsset])

        // Deduct from savings
        setSavings(prev => prev - totalCost)

        // Show success message
        alert(`${t('alerts.purchased')} ${quantity} ${t('alerts.unitsOf')} ${assetType} ${t('alerts.for')} $${totalCost}!\n` +
            `${t('alerts.monthlyPassiveIncome')}: $${passiveIncome}`)

        // Close modal
        setShowBuyPaperAssetModal(false)
    }

    const handleBuyPropertyAsset = (propertyType: string, downPayment: number, totalCost: number, mortgage: number, passiveIncome: number) => {
        // Create new property asset
        const newPropertyAsset: PropertyAsset = {
            id: Date.now().toString(),
            name: t(propertyTypes.find(p => p.value === propertyType)?.labelKey || propertyType),
            downPayment: downPayment,
            totalCost: totalCost,
            mortgage: mortgage,
            passiveIncome: passiveIncome
        }

        // Add to property assets
        setPropertyAssets(prev => [...prev, newPropertyAsset])

        // Deduct down payment from savings (only if down payment > 0)
        if (downPayment > 0) {
            setSavings(prev => prev - downPayment)
        }

        // Show success message
        const downPaymentText = downPayment === 0 ? t('alerts.noDownPayment') : `${t('alerts.downPayment')}: $${downPayment.toLocaleString()}`;

        alert(`${t('alerts.purchased')} ${propertyType}!\n\n` +
            `${downPaymentText}\n` +
            `${t('alerts.totalCost')}: $${totalCost.toLocaleString()}\n` +
            `${t('alerts.mortgage')}: $${mortgage.toLocaleString()}\n` +
            `${t('alerts.monthlyPassiveIncome')}: $${passiveIncome.toLocaleString()}\n\n` +
            `${t('alerts.totalPassiveIncomeIncreased')} $${(totalPassiveIncome + passiveIncome).toLocaleString()}`)

        // Close modal
        setShowBuyPropertyAssetModal(false)
    }

    const handleUpdatePaperAsset = (assetId: string, newQuantity: number) => {
        setPaperAssets(prev =>
            prev.map(asset =>
                asset.id === assetId
                    ? { ...asset, quantity: newQuantity }
                    : asset
            )
        )

        alert(`${t('alerts.updated')} ${selectedPaperAsset?.name} ${t('alerts.quantityTo')} ${newQuantity}`)
        setShowPaperAssetModal(false)
        setSelectedPaperAsset(null)
    }

    const handleSellPaperAsset = (assetId: string, unitsToSell: number, sellPrice: number) => {
        const asset = paperAssets.find(a => a.id === assetId);
        if (!asset) return;

        const totalSaleAmount = unitsToSell * sellPrice

        if (unitsToSell === asset.quantity) {
            setPaperAssets(prev => prev.filter(paperAsset => paperAsset.id !== assetId))
        } else {
            setPaperAssets(prev =>
                prev.map(paperAsset =>
                    paperAsset.id === assetId
                        ? { ...paperAsset, quantity: paperAsset.quantity - unitsToSell }
                        : paperAsset
                )
            )
        }

        setSavings(prev => prev + totalSaleAmount)

        alert(`${t('alerts.sold')} ${unitsToSell} ${t('alerts.unitsOf')} ${asset.name} ${t('alerts.for')} $${totalSaleAmount.toLocaleString()}!`)
        setShowPaperAssetModal(false)
        setSelectedPaperAsset(null)
    }

    const handleUpdatePropertyIncome = (assetId: string, newIncome: number) => {
        setPropertyAssets(prev =>
            prev.map(property =>
                property.id === assetId
                    ? { ...property, passiveIncome: newIncome }
                    : property
            )
        );
        setSelectedPropertyAsset(prev =>
            prev ? { ...prev, passiveIncome: newIncome } : null
        );
        alert(`${t('alerts.passiveIncomeUpdated')} $${newIncome.toLocaleString()} ${t('alerts.perMonth')}`);
    }

    const handleSellPropertyAsset = (assetId: string, sellPrice: number) => {
        const asset = propertyAssets.find(p => p.id === assetId);
        if (!asset) return;

        const netProceeds = sellPrice - asset.mortgage

        setPropertyAssets(prev => prev.filter(property => property.id !== assetId))
        setSavings(prev => prev + netProceeds)

        alert(`${t('alerts.sold')} ${asset.name} ${t('alerts.for')} $${sellPrice.toLocaleString()}!\n` +
            `${t('alerts.afterPayingMortgage')} $${asset.mortgage.toLocaleString()},\n` +
            `${t('alerts.netProceeds')}: $${netProceeds.toLocaleString()}`)

        setShowPropertyAssetModal(false)
        setSelectedPropertyAsset(null)
    }

    const handleCharity = () => {
        const charityAmount = Math.round(totalIncome * 0.10);
        if (charityAmount <= 0) {
            alert(t('alerts.noIncomeForCharity'));
            return;
        }

        if (charityAmount > savings) {
            alert(t('alerts.insufficientSavingsForCharity'));
            return;
        }

        if (window.confirm(t('alerts.charityConfirmation').replace('${amount}', charityAmount.toLocaleString()))) {
            setSavings(prev => prev - charityAmount);
            alert(t('alerts.charityDonated').replace('${amount}', charityAmount.toLocaleString()));
        }
    }

    const handleDownsizing = () => {
        if (totalExpenses <= 0) {
            alert(t('alerts.noExpensesToDownsize'));
            return;
        }

        if (totalExpenses > savings) {
            alert(t('alerts.insufficientSavingsForDownsizing'));
            return;
        }

        if (window.confirm(t('alerts.downsizingConfirmation').replace('${amount}', totalExpenses.toLocaleString()))) {
            setSavings(prev => prev - totalExpenses);
            alert(t('alerts.downsizingCompleted').replace('${amount}', totalExpenses.toLocaleString()));
        }
    }

    const handlePaperAssetClick = (asset: PaperAsset) => {
        setSelectedPaperAsset(asset)
        setShowPaperAssetModal(true)
    }

    const handlePropertyAssetClick = (asset: PropertyAsset) => {
        setSelectedPropertyAsset(asset);
        setShowPropertyAssetModal(true);
    };

    const handleCongratsContinue = () => {
        navigate('/fast-track', {
            state: {
                passiveIncome: totalPassiveIncome,
                darkMode: darkMode
            }
        })
    }

    return (
        <div className={`game-page ${darkMode ? 'dark-mode' : ''}`}>
            <div className="game-container">
                {/* Left Side - Fixed Panel */}
                <div className="left-panel">
                    <div className="panel-content">
                        <h1 className="panel-title">{t('game.yourProfession')}</h1>

                        <div className="profession-display">
                            <h2>{profession.label.toUpperCase()}</h2>
                        </div>

                        <div className="salary-display">
                            <div className="salary-info">
                                <span>{t('game.monthlySalary')}</span>
                                <span>${salary.toLocaleString()}</span>
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
                                    {updatedExpenses.map((expense, index) => (
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
                            <button className="action-btn payday-btn" onClick={handlePayday}>
                                {t('game.payday')}
                            </button>
                            <button className="action-btn repay-liability-btn" onClick={() => setShowRepayModal(true)}>
                                {t('game.repayLiability')}
                            </button>
                            <button className="action-btn loan-btn" onClick={() => setShowGetLoanModal(true)}>
                                {t('game.getLoan')}
                            </button>
                            <button className="action-btn charity-btn" onClick={handleCharity}>
                                {t('game.charity')}
                            </button>
                            <button className="action-btn downsizing-btn" onClick={handleDownsizing}>
                                {t('game.downsizing')}
                            </button>
                        </div>

                        <div className="children-section">
                            <div className="children-input">
                                <label htmlFor="children-count">{t('game.numberOfChildren')}:</label>
                                <div className="children-controls">
                                    <button
                                        className="children-btn minus-btn"
                                        onClick={() => handleChildrenChange(Math.max(0, numberOfChildren - 1))}
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
                                        onChange={(e) => handleChildrenChange(parseInt(e.target.value) || 0)}
                                        onWheel={(e) => e.currentTarget.blur()}
                                        readOnly
                                        className="children-input-field"
                                    />
                                    <button
                                        className="children-btn plus-btn"
                                        onClick={() => handleChildrenChange(Math.min(3, numberOfChildren + 1))}
                                        disabled={numberOfChildren >= 3}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="child-expense-note">
                                    {t('game.expensePerChild')}: ${perChildExpense}
                                </div>
                            </div>
                        </div>

                        <button
                            className="back-button"
                            onClick={handleBackToStart}
                        >
                            {t('game.backToStart')}
                        </button>
                    </div>
                </div>

                {/* Right Side - Scrollable Content */}
                <div className="right-panel">
                    <div className="scroll-content">
                        {/* Paper Assets Section */}
                        <section className="assets-section">
                            <div className="section-header">
                                <h2 className="section-main-title">{t('game.paperAssets')}</h2>
                                <button className="buy-asset-btn" onClick={() => setShowBuyPaperAssetModal(true)}>
                                    {t('game.buyAsset')}
                                </button>
                            </div>
                            <div className="assets-cards-container">
                                {paperAssets.length > 0 ? (
                                    paperAssets.map(asset => (
                                        <div
                                            key={asset.id}
                                            className="asset-card clickable"
                                            onClick={() => handlePaperAssetClick(asset)}
                                        >
                                            <div className="asset-card-header">
                                                <h3 className="asset-name">{asset.name}</h3>
                                                <span className="asset-quantity">{asset.quantity} {t('alerts.units')}</span>
                                            </div>
                                            <div className="asset-card-details">
                                                <div className="asset-detail">
                                                    <span className="detail-label">{t('alerts.pricePerUnit')}</span>
                                                    <span className="detail-value">${asset.pricePerUnit.toLocaleString()}</span>
                                                </div>
                                                <div className="asset-detail">
                                                    <span className="detail-label">{t('alerts.monthlyIncome')}:</span>
                                                    <span className="detail-value positive">
                                                        +${(asset.passiveIncomePerUnit * asset.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>{t('game.noPaperAssets')}</p>
                                        <p className="empty-state-subtitle">{t('game.clickToAddFirstPaper')}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Property Assets Section */}
                        <section className="assets-section">
                            <div className="section-header">
                                <h2 className="section-main-title">{t('game.propertyAssets')}</h2>
                                <button className="buy-asset-btn" onClick={() => setShowBuyPropertyAssetModal(true)}>
                                    {t('game.buyAsset')}
                                </button>
                            </div>
                            <div className="assets-cards-container">
                                {propertyAssets.length > 0 ? (
                                    propertyAssets.map(property => (
                                        <div
                                            key={property.id}
                                            className="property-card clickable"
                                            onClick={() => handlePropertyAssetClick(property)}
                                        >
                                            <div className="property-card-header">
                                                <h3 className="property-name">{property.name}</h3>
                                                <span className={`property-income ${property.passiveIncome >= 0 ? 'positive' : 'negative'}`}>
                                                    {property.passiveIncome >= 0 ? '+' : ''}${property.passiveIncome.toLocaleString()}/month
                                                </span>
                                            </div>
                                            <div className="property-card-details">
                                                <div className="property-detail-grid">
                                                    <div className="property-detail">
                                                        <span className="detail-label">{t('alerts.downPayment')}:</span>
                                                        <span className="detail-value">${property.downPayment.toLocaleString()}</span>
                                                    </div>
                                                    <div className="property-detail">
                                                        <span className="detail-label">{t('alerts.totalCost')}:</span>
                                                        <span className="detail-value">${property.totalCost.toLocaleString()}</span>
                                                    </div>
                                                    <div className="property-detail">
                                                        <span className="detail-label">{t('alerts.mortgage')}:</span>
                                                        <span className="detail-value">${property.mortgage.toLocaleString()}</span>
                                                    </div>
                                                    <div className="property-detail">
                                                        <span className="detail-label">{t('alerts.equity')}:</span>
                                                        <span className="detail-value">${(property.totalCost - property.mortgage).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>{t('game.noPropertyAssets')}</p>
                                        <p className="empty-state-subtitle">{t('game.clickToAddFirstProperty')}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Fixed Savings Section at Bottom */}
            <div className="savings-section">
                <div className="savings-content">
                    <div className="savings-info">
                        <span className="savings-label">{t('game.savings')}:</span>
                        <span className="savings-amount">${savings.toLocaleString()}</span>
                    </div>
                    <div className="savings-actions">
                        <button
                            className="savings-btn add-btn"
                            onClick={() => {
                                const amount = parseInt(prompt(t('game.addFundsPrompt')) || '0')
                                if (amount > 0) setSavings(prev => prev + amount)
                            }}
                        >
                            {t('game.addFunds')}
                        </button>
                        <button
                            className="savings-btn withdraw-btn"
                            onClick={() => {
                                const amount = parseInt(prompt(t('game.withdrawPrompt')) || '0')
                                if (amount > 0 && amount <= savings) {
                                    setSavings(prev => prev - amount)
                                } else if (amount > savings) {
                                    alert(t('alerts.insufficientSavings'))
                                }
                            }}
                        >
                            {t('game.withdraw')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Components */}
            <RepayLiabilityModal
                show={showRepayModal}
                onClose={() => setShowRepayModal(false)}
                onRepay={handleRepayLiability}
                liabilities={liabilities}
                savings={savings}
            />

            <GetLoanModal
                show={showGetLoanModal}
                onClose={() => setShowGetLoanModal(false)}
                onConfirm={handleGetLoan}
            />

            <BuyPaperAssetModal
                show={showBuyPaperAssetModal}
                onClose={() => setShowBuyPaperAssetModal(false)}
                onConfirm={handleBuyPaperAsset}
                paperAssetTypes={paperAssetTypes}
                savings={savings}
            />

            <BuyPropertyAssetModal
                show={showBuyPropertyAssetModal}
                onClose={() => setShowBuyPropertyAssetModal(false)}
                onConfirm={handleBuyPropertyAsset}
                propertyTypes={propertyTypes}
                savings={savings}
            />

            <PaperAssetManagementModal
                show={showPaperAssetModal}
                onClose={() => setShowPaperAssetModal(false)}
                selectedPaperAsset={selectedPaperAsset}
                onUpdate={handleUpdatePaperAsset}
                onSell={handleSellPaperAsset}
            />

            <PropertyAssetManagementModal
                show={showPropertyAssetModal}
                onClose={() => setShowPropertyAssetModal(false)}
                selectedPropertyAsset={selectedPropertyAsset}
                onUpdateIncome={handleUpdatePropertyIncome}
                onSell={handleSellPropertyAsset}
            />

            <GameCongratulationsModal
                show={showCongratsModal}
                onContinue={handleCongratsContinue}
                totalPassiveIncome={totalPassiveIncome}
                totalExpenses={totalExpenses}
                darkMode={darkMode}
            />
        </div>
    )
}

export default GamePage