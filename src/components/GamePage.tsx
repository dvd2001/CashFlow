import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
    passiveIncomePerUnit: number // Change from passiveIncome to passiveIncomePerUnit
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
    const { profession } = location.state as LocationState
    const [numberOfChildren, setNumberOfChildren] = useState(0)
    const [bankLoan, setBankLoan] = useState(0)
    const [savings, setSavings] = useState(profession.savings) // Use profession savings
    const [retailDebt, setRetailDebt] = useState(1000) // Always $1000 as specified
    const [showRepayModal, setShowRepayModal] = useState(false)
    const [showGetLoanModal, setShowGetLoanModal] = useState(false)
    const [showBuyPaperAssetModal, setShowBuyPaperAssetModal] = useState(false)
    const [showBuyPropertyAssetModal, setShowBuyPropertyAssetModal] = useState(false)
    const [selectedLiability, setSelectedLiability] = useState<Liability | null>(null)
    const [repayAmount, setRepayAmount] = useState(0)
    const [loanAmount, setLoanAmount] = useState(0)
    const [selectedLoanType, setSelectedLoanType] = useState<'bank' | 'retail' | null>(null)
    const [retailExpenseAmount, setRetailExpenseAmount] = useState(50) // Always $50 as specified

    // Paper asset purchase state
    const [selectedPaperAssetType, setSelectedPaperAssetType] = useState<string>('')
    const [paperAssetQuantity, setPaperAssetQuantity] = useState(1)
    const [paperAssetPrice, setPaperAssetPrice] = useState(0)
    const [paperAssetPassiveIncome, setPaperAssetPassiveIncome] = useState(0)

    // Property asset purchase state
    const [selectedPropertyType, setSelectedPropertyType] = useState<string>('')
    const [propertyDownPayment, setPropertyDownPayment] = useState(0)
    const [propertyTotalCost, setPropertyTotalCost] = useState(0)
    const [propertyMortgage, setPropertyMortgage] = useState(0)
    const [propertyPassiveIncome, setPropertyPassiveIncome] = useState(0)
    const [editPropertyPassiveIncome, setEditPropertyPassiveIncome] = useState(0);

    const [selectedPaperAsset, setSelectedPaperAsset] = useState<PaperAsset | null>(null)
    const [selectedPropertyAsset, setSelectedPropertyAsset] = useState<PropertyAsset | null>(null)
    const [showPaperAssetModal, setShowPaperAssetModal] = useState(false)
    const [showPropertyAssetModal, setShowPropertyAssetModal] = useState(false)
    const [editQuantity, setEditQuantity] = useState(1)
    const [sellPrice, setSellPrice] = useState(0)
    const [propertySellPrice, setPropertySellPrice] = useState(0)
    const [unitsToSell, setUnitsToSell] = useState(1)
    const [showCongratsModal, setShowCongratsModal] = useState(false)

    // State for expenses that can be modified
    const [expenses, setExpenses] = useState<Expense[]>([
        { name: 'Taxes', amount: profession.taxes },
        { name: 'Home Mortgage', amount: profession.mortgagePayment },
        { name: 'School Loan', amount: profession.schoolLoanPayment },
        { name: 'Car Loan', amount: profession.carLoanPayment },
        { name: 'Credit Card', amount: profession.creditCardPayment },
        { name: 'Retail', amount: 50 }, // Always $50
        { name: 'Other Expenses', amount: profession.otherExpenses },
        { name: 'Child Expenses', amount: 0 }, // Will be calculated
        { name: 'Bank Loan Payment', amount: 0 } // Will be calculated
    ])

    // State for assets
    const [paperAssets, setPaperAssets] = useState<PaperAsset[]>([])
    const [propertyAssets, setPropertyAssets] = useState<PropertyAsset[]>([])

    const paperAssetTypes = ['Deposit Certificate', '2BIG', 'GRO4US', 'MYT4U', 'OK4U', 'ON2U']
    const propertyTypes = [
        'Condo 2/1',
        'House 3/2',
        'Widgets Making Company',
        'Software Company',
        'Gold Coin pieces of 8',
        '10 one-ounce Krugerrands',
        '10 Acres Raw Land',
        'Sister- In-Law',
        'Automated Business',
        'Small Shopping Mall',
        'Pizza Franchise',
        'Duplex',
        '4-plex',
        '8-plex',
        '20 Acers Raw Land',
        'Apartment House',
        'Limited Partner',
        'Bed & Breakfast'
    ]

    // Calculate total passive income from all property assets
    // Calculate total passive income from all paper assets (per unit * quantity)
    const totalPaperPassiveIncome = paperAssets.reduce((sum, asset) =>
        sum + (asset.passiveIncomePerUnit * asset.quantity), 0)
    const totalPassiveIncome = propertyAssets.reduce((sum, property) => sum + property.passiveIncome, 0) + totalPaperPassiveIncome

    const handleBackToStart = () => {
        navigate('/')
    }

    const handleChildrenChange = (value: number) => {
        if (value >= 0 && value <= 3) {
            setNumberOfChildren(value)
        }
    }

    const perChildExpense = profession.expensePerChild
    const totalChildExpenses = perChildExpense * numberOfChildren
    const bankLoanExpense = bankLoan * 0.10 // 10% of bank loan
    const salary = profession.payment

    // Update expenses with calculated values
    const updatedExpenses = expenses.map(expense => {
        if (expense.name === 'Child Expenses') {
            return { ...expense, amount: totalChildExpenses }
        }
        if (expense.name === 'Bank Loan Payment') {
            return { ...expense, amount: bankLoanExpense }
        }
        return expense
    })

    // Liabilities data with expense mapping
    const liabilities: Liability[] = [
        {
            name: 'Home Mortgage',
            amount: profession.mortageAmount,
            expenseName: 'Home Mortgage',
            expenseAmount: profession.mortgagePayment
        },
        {
            name: 'School Loan',
            amount: profession.schoolLoanAmount,
            expenseName: 'School Loan',
            expenseAmount: profession.schoolLoanPayment
        },
        {
            name: 'Car Loan',
            amount: profession.carLoanAmount,
            expenseName: 'Car Loan',
            expenseAmount: profession.carLoanPayment
        },
        {
            name: 'Credit Card',
            amount: profession.creditCardDebt,
            expenseName: 'Credit Card',
            expenseAmount: profession.creditCardPayment
        },
        {
            name: 'Retail Debt',
            amount: retailDebt,
            expenseName: 'Retail',
            expenseAmount: updatedExpenses.find(e => e.name === 'Retail')?.amount || 110
        },
        {
            name: 'Bank Loan',
            amount: bankLoan,
            expenseName: 'Bank Loan Payment',
            expenseAmount: bankLoanExpense
        }
    ]

    const totalExpenses = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalIncome = salary + totalPassiveIncome
    const monthlyCashFlow = totalIncome - totalExpenses

    // Calculate total cost for paper asset purchase
    const paperAssetTotalCost = paperAssetQuantity * paperAssetPrice

    const launchConfetti = () => {
        // Simple confetti effect using emojis in an alert (or use a proper confetti library)
        console.log("🎉🎊🎉🎊 Congratulations! 🎉🎊🎉🎊");
    };

    // Update the useEffect to launch confetti when condition is met
    useEffect(() => {
        if (totalPassiveIncome >= totalExpenses && totalExpenses > 0) {
            setShowCongratsModal(true);
            launchConfetti();
        }
    }, [totalPassiveIncome, totalExpenses]);

    // Button handlers
    const handlePayday = () => {
        // Add monthly cash flow to savings
        setSavings(prev => prev + monthlyCashFlow)
        alert(`Payday! $${monthlyCashFlow} added to savings.`)
    }

    const handleRepayLiability = () => {
        setShowRepayModal(true)
        setSelectedLiability(null)
        setRepayAmount(0)
    }

    const handleGetLoan = () => {
        setShowGetLoanModal(true)
        setSelectedLoanType(null)
        setLoanAmount(0)
        setRetailExpenseAmount(0)
    }

    const handleBuyPaperAsset = () => {
        setShowBuyPaperAssetModal(true)
        setSelectedPaperAssetType('')
        setPaperAssetQuantity(1)
        setPaperAssetPrice(0)
    }

    const handleBuyPropertyAsset = () => {
        setShowBuyPropertyAssetModal(true)
        setSelectedPropertyType('')
        setPropertyDownPayment(0)
        setPropertyTotalCost(0)
        setPropertyMortgage(0)
        setPropertyPassiveIncome(0)
    }

    const handleBuyPaperAssetConfirm = () => {
        if (!selectedPaperAssetType || paperAssetQuantity < 1 || paperAssetPrice <= 0) {
            alert('Please fill in all fields correctly.')
            return
        }

        if (paperAssetQuantity > 5000) {
            alert('Maximum quantity is 5000.')
            return
        }

        if (paperAssetTotalCost > savings) {
            alert('Insufficient savings to make this purchase!')
            return
        }

        // Create new paper asset with passive income per unit
        const newPaperAsset: PaperAsset = {
            id: Date.now().toString(),
            name: selectedPaperAssetType,
            quantity: paperAssetQuantity,
            pricePerUnit: paperAssetPrice,
            passiveIncomePerUnit: paperAssetPassiveIncome // Store per unit
        }

        // Add to paper assets
        setPaperAssets(prev => [...prev, newPaperAsset])

        // Deduct from savings
        setSavings(prev => prev - paperAssetTotalCost)

        // Show success message
        alert(`Successfully purchased ${paperAssetQuantity} units of ${selectedPaperAssetType} for $${paperAssetTotalCost}!\n` +
            `Monthly passive income: $${paperAssetPassiveIncome}`)

        // Close modal and reset form
        setShowBuyPaperAssetModal(false)
        setSelectedPaperAssetType('')
        setPaperAssetQuantity(1)
        setPaperAssetPrice(0)
        setPaperAssetPassiveIncome(0)
    }

    const handleBuyPropertyAssetConfirm = () => {
        if (!selectedPropertyType || propertyDownPayment <= 0 || propertyTotalCost <= 0) {
            alert('Please fill in all fields correctly.')
            return
        }

        if (propertyDownPayment > savings) {
            alert('Insufficient savings for the down payment!')
            return
        }

        if (propertyDownPayment + propertyMortgage !== propertyTotalCost) {
            alert('Down payment + mortgage should equal total cost.')
            return
        }

        // Create new property asset
        const newPropertyAsset: PropertyAsset = {
            id: Date.now().toString(),
            name: selectedPropertyType,
            downPayment: propertyDownPayment,
            totalCost: propertyTotalCost,
            mortgage: propertyMortgage,
            passiveIncome: propertyPassiveIncome
        }

        // Add to property assets
        setPropertyAssets(prev => [...prev, newPropertyAsset])

        // Deduct down payment from savings
        setSavings(prev => prev - propertyDownPayment)

        // Show success message
        alert(`Successfully purchased ${selectedPropertyType}!\n\n` +
            `Down payment: $${propertyDownPayment.toLocaleString()}\n` +
            `Total cost: $${propertyTotalCost.toLocaleString()}\n` +
            `Mortgage: $${propertyMortgage.toLocaleString()}\n` +
            `Monthly passive income: ${propertyPassiveIncome >= 0 ? '+' : ''}$${propertyPassiveIncome.toLocaleString()}\n\n` +
            `Your total passive income increased to $${(totalPassiveIncome + propertyPassiveIncome).toLocaleString()}`)

        // Close modal and reset form
        setShowBuyPropertyAssetModal(false)
        setSelectedPropertyType('')
        setPropertyDownPayment(0)
        setPropertyTotalCost(0)
        setPropertyMortgage(0)
        setPropertyPassiveIncome(0)
    }

    const handleGetLoanConfirm = () => {
        if (!selectedLoanType || loanAmount <= 0) {
            alert('Please select a loan type and enter a valid amount.');
            return;
        }

        let finalLoanAmount = loanAmount;

        if (selectedLoanType === 'bank') {
            // For bank loan, ensure it's a multiple of 1000 and at least 1000
            if (finalLoanAmount < 1000) {
                alert('Bank loan must be at least $1,000');
                return;
            }

            if (finalLoanAmount % 1000 !== 0) {
                // Auto-adjust to nearest multiple of 1000
                finalLoanAmount = Math.round(finalLoanAmount / 1000) * 1000;
                setLoanAmount(finalLoanAmount); // Update the display
                alert(`Bank loan amount adjusted to $${finalLoanAmount} (must be in multiples of $1,000)`);
            }
        }

        if (selectedLoanType === 'bank') {
            setBankLoan(prev => prev + finalLoanAmount);
            setSavings(prev => prev + finalLoanAmount);
        } else {
            // For retail debt handling...
            setRetailDebt(prev => prev + finalLoanAmount);
            setExpenses(prev =>
                prev.map(expense =>
                    expense.name === 'Retail'
                        ? { ...expense, amount: (expense.amount || 0) + retailExpenseAmount }
                        : expense
                )
            );
        }

        // Show success message
        if (selectedLoanType === 'bank') {
            alert(`Successfully received $${finalLoanAmount} Bank Loan!\n\n` +
                `$${finalLoanAmount} added to your savings.\n` +
                `Monthly expense increased by: $${finalLoanAmount * 0.10}`);
        } else {
            alert(`Successfully received $${finalLoanAmount} Retail Debt!\n\n` +
                `Monthly expense increased by: $${retailExpenseAmount}\n` +
                `Note: Retail debt amount is spent immediately and not added to savings.`);
        }

        // Close modal
        setShowGetLoanModal(false);
        setSelectedLoanType(null);
        setLoanAmount(0);
        setRetailExpenseAmount(0);
    }

    const handleRepay = () => {
        if (!selectedLiability) {
            alert('Please select a liability to repay.')
            return
        }

        const amountToRepay = selectedLiability.name === 'Bank Loan' ? repayAmount : selectedLiability.amount

        if (amountToRepay <= 0) {
            alert('Please enter a valid repayment amount.')
            return
        }

        if (amountToRepay > savings) {
            alert('Insufficient savings to make this repayment!')
            return
        }

        // Process repayment
        if (selectedLiability.name === 'Bank Loan') {
            // For bank loan, reduce the loan amount
            const newBankLoan = Math.max(0, bankLoan - repayAmount)
            setBankLoan(newBankLoan)
        } else if (selectedLiability.name === 'Retail Debt') {
            // For retail debt, reduce the debt amount
            const newRetailDebt = Math.max(0, retailDebt - repayAmount)
            setRetailDebt(newRetailDebt)
            // Also reduce the retail expense proportionally
            const currentRetailExpense = updatedExpenses.find(e => e.name === 'Retail')?.amount || 0
            const expenseReduction = (repayAmount / retailDebt) * currentRetailExpense
            setExpenses(prev =>
                prev.map(expense =>
                    expense.name === 'Retail'
                        ? { ...expense, amount: Math.max(0, expense.amount - expenseReduction) }
                        : expense
                )
            )
        } else {
            // For other liabilities, set the expense to 0
            setExpenses(prev =>
                prev.map(expense =>
                    expense.name === selectedLiability.expenseName
                        ? { ...expense, amount: 0 }
                        : expense
                )
            )
        }

        // Deduct from savings
        setSavings(prev => prev - amountToRepay)

        // Calculate the expense reduction amount
        let expenseReduction = 0
        if (selectedLiability.name === 'Bank Loan') {
            // For bank loan, calculate the reduction in expense
            const oldExpense = bankLoanExpense
            const newExpense = (bankLoan - repayAmount) * 0.10
            expenseReduction = oldExpense - newExpense
        } else if (selectedLiability.name === 'Retail Debt') {
            // For retail debt, calculate the reduction in expense
            const currentRetailExpense = updatedExpenses.find(e => e.name === 'Retail')?.amount || 0
            expenseReduction = (repayAmount / retailDebt) * currentRetailExpense
        } else {
            // For other liabilities, reduce by the full expense amount
            expenseReduction = selectedLiability.expenseAmount || 0
        }

        // Show success message with details
        alert(`Successfully repaid $${amountToRepay} of ${selectedLiability.name}!\n\n` +
            `Monthly expenses reduced by: $${expenseReduction.toFixed(0)}\n` +
            `Monthly cash flow increased by: $${expenseReduction.toFixed(0)}`)

        // Close modal
        setShowRepayModal(false)
        setSelectedLiability(null)
        setRepayAmount(0)
    }

    const handleLiabilitySelect = (liability: Liability) => {
        setSelectedLiability(liability)
        if (liability.name !== 'Bank Loan') {
            // For non-bank loans, set repay amount to full amount
            setRepayAmount(liability.amount)
        } else {
            // For bank loan, start with 0
            setRepayAmount(0)
        }
    }

    const handleBankLoanRepayChange = (value: number) => {
        // Ensure value is a multiple of 1000 and within bounds
        if (value % 1000 === 0 && value >= 0 && value <= (selectedLiability?.amount || 0)) {
            setRepayAmount(value);
        }
    };

    const handleLoanTypeSelect = (loanType: 'bank' | 'retail') => {
        setSelectedLoanType(loanType)
        setLoanAmount(0)
        setRetailExpenseAmount(0)
    }

    const handleLoanAmountChange = (value: number) => {
        if (selectedLoanType === 'bank') {
            // For bank loan, only allow multiples of 1000
            if (value % 1000 === 0 && value >= 0) {
                setLoanAmount(value)
            }
        } else {
            // For retail debt, allow any amount
            if (value >= 0) {
                setLoanAmount(value)
            }
        }
    }

    const handleRetailExpenseChange = (value: number) => {
        if (value >= 0) {
            setRetailExpenseAmount(value)
        }
    }

    const handlePaperAssetTypeSelect = (assetType: string) => {
        setSelectedPaperAssetType(assetType)
    }

    const handlePaperAssetQuantityChange = (value: number) => {
        if (value >= 1 && value <= 5000) {
            setPaperAssetQuantity(value)
        }
    }

    const handlePaperAssetPriceChange = (value: number) => {
        if (value >= 1) {
            setPaperAssetPrice(value)
        }
    }

    const handlePropertyTypeSelect = (propertyType: string) => {
        setSelectedPropertyType(propertyType)
    }

    const handlePropertyDownPaymentChange = (value: number) => {
        if (value >= 0) {
            setPropertyDownPayment(value)
            // Auto-calculate mortgage if total cost is set
            if (propertyTotalCost > 0) {
                setPropertyMortgage(propertyTotalCost - value)
            }
        }
    }

    const handlePropertyTotalCostChange = (value: number) => {
        if (value >= 0) {
            setPropertyTotalCost(value)
            // Auto-calculate mortgage if down payment is set
            if (propertyDownPayment > 0) {
                setPropertyMortgage(value - propertyDownPayment)
            }
        }
    }

    const handlePropertyMortgageChange = (value: number) => {
        if (value >= 0) {
            setPropertyMortgage(value)
        }
    }

    const handlePropertyPassiveIncomeChange = (value: number) => {
        setPropertyPassiveIncome(value)
    }

    const handlePaperAssetClick = (asset: PaperAsset) => {
        setSelectedPaperAsset(asset)
        setEditQuantity(asset.quantity)
        setSellPrice(asset.pricePerUnit) // Default to purchase price
        setUnitsToSell(1) // Default to 1 unit
        setShowPaperAssetModal(true)
    }

    const handlePropertyAssetClick = (asset: PropertyAsset) => {
        setSelectedPropertyAsset(asset);
        setEditPropertyPassiveIncome(asset.passiveIncome); // Initialize with current value
        setPropertySellPrice(asset.totalCost);
        setShowPropertyAssetModal(true);
    };

    const handleUpdatePaperAsset = () => {
        if (!selectedPaperAsset) return

        if (editQuantity < 1) {
            alert('Quantity must be at least 1')
            return
        }

        // Update the paper asset with new quantity
        setPaperAssets(prev =>
            prev.map(asset =>
                asset.id === selectedPaperAsset.id
                    ? { ...asset, quantity: editQuantity }
                    : asset
            )
        )

        alert(`Updated ${selectedPaperAsset.name} quantity to ${editQuantity}`)
        setShowPaperAssetModal(false)
        setSelectedPaperAsset(null)
    }

    const handleSellPaperAsset = () => {
        if (!selectedPaperAsset) return

        if (sellPrice <= 0) {
            alert('Please enter a valid sell price')
            return
        }

        if (unitsToSell < 1 || unitsToSell > selectedPaperAsset.quantity) {
            alert('Please enter a valid number of units to sell')
            return
        }

        const totalSaleAmount = unitsToSell * sellPrice

        if (unitsToSell === selectedPaperAsset.quantity) {
            // Selling all units - remove the asset completely
            setPaperAssets(prev => prev.filter(asset => asset.id !== selectedPaperAsset.id))
        } else {
            // Selling partial units - update the quantity
            setPaperAssets(prev =>
                prev.map(asset =>
                    asset.id === selectedPaperAsset.id
                        ? { ...asset, quantity: asset.quantity - unitsToSell }
                        : asset
                )
            )
        }

        // Add money to savings
        setSavings(prev => prev + totalSaleAmount)

        alert(`Sold ${unitsToSell} units of ${selectedPaperAsset.name} for $${totalSaleAmount.toLocaleString()}!`)
        setShowPaperAssetModal(false)
        setSelectedPaperAsset(null)
    }

    const handleSellPropertyAsset = () => {
        if (!selectedPropertyAsset) return

        if (propertySellPrice <= 0) {
            alert('Please enter a valid sell price')
            return
        }

        // Calculate net proceeds (selling price minus mortgage)
        const netProceeds = propertySellPrice - selectedPropertyAsset.mortgage

        if (netProceeds < 0) {
            alert('Selling price must be at least equal to the mortgage amount!')
            return
        }

        // Remove the property and add net proceeds to savings
        setPropertyAssets(prev => prev.filter(property => property.id !== selectedPropertyAsset.id))
        setSavings(prev => prev + netProceeds)

        alert(`Sold ${selectedPropertyAsset.name} for $${propertySellPrice.toLocaleString()}!\n` +
            `After paying off mortgage of $${selectedPropertyAsset.mortgage.toLocaleString()},\n` +
            `Net proceeds: $${netProceeds.toLocaleString()}`)

        setShowPropertyAssetModal(false)
        setSelectedPropertyAsset(null)
    }


    return (
        <div className="game-page">
            <div className="game-container">
                {/* Left Side - Fixed Panel */}
                <div className="left-panel">
                    <div className="panel-content">
                        <h1 className="panel-title">Your Profession</h1>

                        <div className="profession-display">
                            <h2>{profession.label.toUpperCase()}</h2>
                        </div>

                        <div className="salary-display">
                            <div className="salary-info">
                                <span>Monthly Salary:</span>
                                <span>${salary.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="financial-summary">
                            <div className="summary-item">
                                <span>Total Income:</span>
                                <span>${totalIncome}</span>
                            </div>
                            <div className="summary-item">
                                <span>Passive Income:</span>
                                <span>${totalPassiveIncome}</span>
                            </div>
                            <div className="summary-item">
                                <span>Total Expenses:</span>
                                <span>${totalExpenses}</span>
                            </div>
                            <div className="summary-item net-cash-flow">
                                <span>Monthly Cash Flow:</span>
                                <span>${monthlyCashFlow}</span>
                            </div>
                        </div>

                        <div className="financial-sections">
                            {/* Expenses Section */}
                            <div className="section">
                                <h3 className="section-title">Expenses</h3>
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
                                <h3 className="section-title">Liabilities</h3>
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
                                Payday
                            </button>
                            <button className="action-btn repay-btn" onClick={handleRepayLiability}>
                                Repay Liability
                            </button>
                            <button className="action-btn loan-btn" onClick={handleGetLoan}>
                                Get Loan
                            </button>
                        </div>

                        <div className="children-section">
                            <div className="children-input">
                                <label htmlFor="children-count">Number of Children (Max 3):</label>
                                <input
                                    type="number"
                                    id="children-count"
                                    min="0"
                                    max="3"
                                    value={numberOfChildren}
                                    onChange={(e) => handleChildrenChange(parseInt(e.target.value) || 0)}
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                                <div className="child-expense-note">
                                    Expense per Child: ${perChildExpense}
                                </div>
                            </div>
                        </div>

                        <button
                            className="back-button"
                            onClick={handleBackToStart}
                        >
                            Back to Start
                        </button>
                    </div>
                </div>

                {/* Right Side - Scrollable Content */}
                <div className="right-panel">
                    <div className="scroll-content">
                        {/* Paper Assets Section */}
                        <section className="assets-section">
                            <div className="section-header">
                                <h2 className="section-main-title">Paper Assets</h2>
                                <button className="buy-asset-btn" onClick={handleBuyPaperAsset}>
                                    Buy Asset
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
                                                <span className="asset-quantity">{asset.quantity} units</span>
                                            </div>
                                            <div className="asset-card-details">
                                                <div className="asset-detail">
                                                    <span className="detail-label">Price per Unit:</span>
                                                    <span className="detail-value">${asset.pricePerUnit.toLocaleString()}</span>
                                                </div>
                                                <div className="asset-detail">
                                                    <span className="detail-label">Monthly Income:</span>
                                                    <span className="detail-value positive">
                                                        +${(asset.passiveIncomePerUnit * asset.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>No paper assets yet</p>
                                        <p className="empty-state-subtitle">Click "Buy Asset" to add your first investment</p>
                                    </div>
                                )}
                            </div>
                        </section>


                        {/* Property Assets Section */}
                        <section className="assets-section">
                            <div className="section-header">
                                <h2 className="section-main-title">Property Assets</h2>
                                <button className="buy-asset-btn" onClick={handleBuyPropertyAsset}>
                                    Buy Asset
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
                                                        <span className="detail-label">Down Payment:</span>
                                                        <span className="detail-value">${property.downPayment.toLocaleString()}</span>
                                                    </div>
                                                    <div className="property-detail">
                                                        <span className="detail-label">Total Cost:</span>
                                                        <span className="detail-value">${property.totalCost.toLocaleString()}</span>
                                                    </div>
                                                    <div className="property-detail">
                                                        <span className="detail-label">Mortgage:</span>
                                                        <span className="detail-value">${property.mortgage.toLocaleString()}</span>
                                                    </div>
                                                    <div className="property-detail">
                                                        <span className="detail-label">Equity:</span>
                                                        <span className="detail-value">${(property.totalCost - property.mortgage).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>No property assets yet</p>
                                        <p className="empty-state-subtitle">Click "Buy Asset" to add your first property</p>
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
                        <span className="savings-label">Savings:</span>
                        <span className="savings-amount">${savings.toLocaleString()}</span>
                    </div>
                    <div className="savings-actions">
                        <button
                            className="savings-btn add-btn"
                            onClick={() => {
                                const amount = parseInt(prompt('Enter amount to add to savings:') || '0')
                                if (amount > 0) setSavings(prev => prev + amount)
                            }}
                        >
                            Add Funds
                        </button>
                        <button
                            className="savings-btn withdraw-btn"
                            onClick={() => {
                                const amount = parseInt(prompt('Enter amount to withdraw from savings:') || '0')
                                if (amount > 0 && amount <= savings) {
                                    setSavings(prev => prev - amount)
                                } else if (amount > savings) {
                                    alert('Insufficient savings!')
                                }
                            }}
                        >
                            Withdraw
                        </button>
                    </div>
                </div>
            </div>

            {/* Repay Liability Modal */}
            {showRepayModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Repay Liability</h2>

                        <div className="liability-selection">
                            <h3>Select Liability to Repay:</h3>
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
                                <h3>Repayment Amount:</h3>
                                {selectedLiability.name === 'Bank Loan' ? (
                                    <div className="bank-loan-repay">
                                        <p>Bank Loan can be repaid in increments of $1,000</p>
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
                                            placeholder="Enter amount in 1000s"
                                            onWheel={(e) => e.currentTarget.blur()}
                                        />
                                        {repayAmount > 0 && repayAmount % 1000 !== 0 && (
                                            <p className="warning-note" style={{ color: 'orange', marginTop: '5px' }}>
                                                ⚠️ Amount must be in multiples of $1,000. It will be adjusted to ${Math.round(repayAmount / 1000) * 1000}.
                                            </p>
                                        )}
                                        <div className="amount-options">
                                            <button onClick={() => handleBankLoanRepayChange(1000)}>$1,000</button>
                                            <button onClick={() => handleBankLoanRepayChange(5000)}>$5,000</button>
                                            <button onClick={() => handleBankLoanRepayChange(selectedLiability.amount)}>Full Amount</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="full-repay">
                                        <p>Full repayment amount: <strong>${selectedLiability.amount.toLocaleString()}</strong></p>
                                        <p className="expense-info">
                                            This will eliminate your <strong>${selectedLiability.expenseAmount}</strong> monthly {selectedLiability.expenseName} expense
                                        </p>
                                    </div>
                                )}

                                <div className="repay-summary">
                                    <p>Available Savings: <strong>${savings.toLocaleString()}</strong></p>
                                    <p>Amount to Repay: <strong>${repayAmount.toLocaleString()}</strong></p>
                                    {selectedLiability.name !== 'Bank Loan' && (
                                        <p>Monthly Expense Reduction: <strong>${selectedLiability.expenseAmount}</strong></p>
                                    )}
                                    {selectedLiability.name === 'Bank Loan' && repayAmount > 0 && (
                                        <p>Monthly Expense Reduction: <strong>${(repayAmount * 0.10).toFixed(0)}</strong></p>
                                    )}
                                    <p className={savings >= repayAmount ? 'success' : 'error'}>
                                        {savings >= repayAmount ? '✓ Sufficient funds' : '✗ Insufficient funds'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={() => setShowRepayModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn repay-modal-btn"
                                onClick={handleRepay}
                                disabled={!selectedLiability || repayAmount <= 0 || repayAmount > savings}
                            >
                                Repay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Get Loan Modal */}
            {showGetLoanModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Get Loan</h2>

                        <div className="loan-type-selection">
                            <h3>Select Loan Type:</h3>
                            <div className="loan-type-options">
                                <div
                                    className={`loan-type-option ${selectedLoanType === 'bank' ? 'selected' : ''}`}
                                    onClick={() => handleLoanTypeSelect('bank')}
                                >
                                    <span className="loan-type-name">Bank Loan</span>
                                    <span className="loan-type-desc">10% monthly expense, added to savings</span>
                                </div>
                                <div
                                    className={`loan-type-option ${selectedLoanType === 'retail' ? 'selected' : ''}`}
                                    onClick={() => handleLoanTypeSelect('retail')}
                                >
                                    <span className="loan-type-name">Retail Debt</span>
                                    <span className="loan-type-desc">Set monthly expense, spent immediately</span>
                                </div>
                            </div>
                        </div>

                        {selectedLoanType && (
                            <div className="loan-amount-section">
                                <h3>Loan Details:</h3>
                                {selectedLoanType === 'bank' ? (
                                    <div className="bank-loan-amount">
                                        <p>Bank Loan must be in multiples of $1,000 (minimum $1,000)</p>
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
                                                // When input loses focus, validate and adjust to nearest multiple of 1000
                                                let value = parseInt(e.target.value) || 0;
                                                if (value < 1000) {
                                                    value = 1000;
                                                } else if (value % 1000 !== 0) {
                                                    // Round to nearest multiple of 1000
                                                    value = Math.round(value / 1000) * 1000;
                                                }
                                                setLoanAmount(value);
                                            }}
                                            placeholder="Enter amount in multiples of 1000"
                                            onWheel={(e) => e.currentTarget.blur()}
                                        />
                                        {loanAmount > 0 && loanAmount % 1000 !== 0 && (
                                            <p className="warning-note" style={{ color: 'orange', marginTop: '5px' }}>
                                                ⚠️ Amount must be in multiples of $1,000. It will be adjusted to ${Math.round(loanAmount / 1000) * 1000} when you proceed.
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
                                            <label>Loan Amount (any amount):</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={loanAmount}
                                                onChange={(e) => handleLoanAmountChange(parseInt(e.target.value) || 0)}
                                                placeholder="Enter amount"
                                                onWheel={(e) => e.currentTarget.blur()}
                                            />
                                        </div>
                                        <div className="retail-input-group">
                                            <label>Monthly Expense:</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={retailExpenseAmount}
                                                onChange={(e) => handleRetailExpenseChange(parseInt(e.target.value) || 0)}
                                                placeholder="Enter monthly expense"
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
                                    <p>Amount to {selectedLoanType === 'bank' ? 'Receive' : 'Borrow'}: <strong>${loanAmount.toLocaleString()}</strong></p>
                                    <p>Monthly Expense Increase: <strong>${selectedLoanType === 'bank' ? (loanAmount * 0.10).toFixed(0) : retailExpenseAmount}</strong></p>
                                    <p className={selectedLoanType === 'bank' ? 'info-note' : 'warning-note'}>
                                        {selectedLoanType === 'bank'
                                            ? 'The loan amount will be added to your savings'
                                            : 'Retail debt amount is spent immediately and NOT added to savings'
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={() => setShowGetLoanModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn get-loan-btn"
                                onClick={handleGetLoanConfirm}
                                disabled={!selectedLoanType || loanAmount <= 0 || (selectedLoanType === 'retail' && retailExpenseAmount <= 0)}
                            >
                                Get Loan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Buy Paper Asset Modal */}
            {showBuyPaperAssetModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Buy Paper Asset</h2>

                        <div className="paper-asset-selection">
                            <div className="paper-asset-input-group">
                                <label htmlFor="paper-asset-type">Select Asset Type:</label>
                                <select
                                    id="paper-asset-type"
                                    className="paper-asset-select"
                                    value={selectedPaperAssetType}
                                    onChange={(e) => handlePaperAssetTypeSelect(e.target.value)}
                                >
                                    <option value="">Choose an asset type</option>
                                    {paperAssetTypes.map((assetType, index) => (
                                        <option key={index} value={assetType}>
                                            {assetType}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {selectedPaperAssetType && (
                            <div className="paper-asset-details">
                                <h3>Purchase Details:</h3>
                                <div className="paper-asset-input-group">
                                    <label>Quantity (1-5000):</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5000"
                                        value={paperAssetQuantity}
                                        onChange={(e) => handlePaperAssetQuantityChange(parseInt(e.target.value) || 1)}
                                        placeholder="Enter quantity"
                                        onWheel={(e) => e.currentTarget.blur()}
                                    />
                                </div>
                                <div className="paper-asset-input-group">
                                    <label>Price per Unit (Whole numbers only):</label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={paperAssetPrice}
                                        onChange={(e) => handlePaperAssetPriceChange(parseInt(e.target.value) || 0)}
                                        placeholder="Enter whole number price"
                                        onWheel={(e) => e.currentTarget.blur()}
                                    />
                                </div>
                                <div className="paper-asset-input-group">
                                    <label>Monthly Passive Income Per Unit (Dividends/Interest):</label>
                                    <input
                                        type="number"
                                        value={paperAssetPassiveIncome}
                                        onChange={(e) => setPaperAssetPassiveIncome(parseInt(e.target.value) || 0)}
                                        placeholder="Enter monthly passive income per unit"
                                        onWheel={(e) => e.currentTarget.blur()}
                                    />
                                </div>

                                <div className="paper-asset-summary">
                                    <p>Total Cost: <strong>${paperAssetTotalCost.toLocaleString()}</strong></p>
                                    <p>Monthly Passive Income: <strong>+${paperAssetPassiveIncome.toLocaleString()}</strong></p>
                                    <p>Available Savings: <strong>${savings.toLocaleString()}</strong></p>
                                    <p className={savings >= paperAssetTotalCost ? 'success' : 'error'}>
                                        {savings >= paperAssetTotalCost ? '✓ Sufficient funds' : '✗ Insufficient funds'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={() => setShowBuyPaperAssetModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn buy-paper-asset-btn"
                                onClick={handleBuyPaperAssetConfirm}
                                disabled={!selectedPaperAssetType || paperAssetQuantity < 1 || paperAssetPrice <= 0 || paperAssetTotalCost > savings}
                            >
                                Buy Asset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Buy Property Asset Modal */}
            {showBuyPropertyAssetModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Buy Property Asset</h2>

                        <div className="property-asset-selection">
                            <div className="property-asset-input-group">
                                <label htmlFor="property-type">Select Property Type:</label>
                                <select
                                    id="property-type"
                                    className="property-asset-select"
                                    value={selectedPropertyType}
                                    onChange={(e) => handlePropertyTypeSelect(e.target.value)}
                                >
                                    <option value="">Choose a property type</option>
                                    {propertyTypes.map((propertyType, index) => (
                                        <option key={index} value={propertyType}>
                                            {propertyType}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {selectedPropertyType && (
                            <div className="property-asset-details">
                                <h3>Property Details:</h3>
                                <div className="property-asset-input-group">
                                    <label>Down Payment:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={propertyDownPayment}
                                        onChange={(e) => handlePropertyDownPaymentChange(parseInt(e.target.value) || 0)}
                                        placeholder="Enter down payment"
                                        onWheel={(e) => e.currentTarget.blur()}
                                    />
                                </div>
                                <div className="property-asset-input-group">
                                    <label>Total Cost:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={propertyTotalCost}
                                        onChange={(e) => handlePropertyTotalCostChange(parseInt(e.target.value) || 0)}
                                        placeholder="Enter total cost"
                                        onWheel={(e) => e.currentTarget.blur()}
                                    />
                                </div>
                                <div className="property-asset-input-group">
                                    <label>Mortgage:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={propertyMortgage}
                                        onChange={(e) => handlePropertyMortgageChange(parseInt(e.target.value) || 0)}
                                        placeholder="Enter mortgage amount"
                                        onWheel={(e) => e.currentTarget.blur()}
                                    />
                                </div>
                                <div className="property-asset-input-group">
                                    <label>Monthly Passive Income:</label>
                                    <input
                                        type="number"
                                        value={propertyPassiveIncome}
                                        onChange={(e) => handlePropertyPassiveIncomeChange(parseInt(e.target.value) || 0)}
                                        placeholder="Enter monthly passive income"
                                        onWheel={(e) => e.currentTarget.blur()}
                                    />
                                </div>

                                <div className="property-asset-summary">
                                    <p>Down Payment: <strong>${propertyDownPayment.toLocaleString()}</strong></p>
                                    <p>Total Cost: <strong>${propertyTotalCost.toLocaleString()}</strong></p>
                                    <p>Mortgage: <strong>${propertyMortgage.toLocaleString()}</strong></p>
                                    <p>Monthly Passive Income: <strong>{propertyPassiveIncome >= 0 ? '+' : ''}${propertyPassiveIncome.toLocaleString()}</strong></p>                                    <p>Available Savings: <strong>${savings.toLocaleString()}</strong></p>
                                    <p className={savings >= propertyDownPayment ? 'success' : 'error'}>
                                        {savings >= propertyDownPayment ? '✓ Sufficient funds for down payment' : '✗ Insufficient funds for down payment'}
                                    </p>
                                    <p className={propertyDownPayment + propertyMortgage === propertyTotalCost ? 'success' : 'error'}>
                                        {propertyDownPayment + propertyMortgage === propertyTotalCost ? '✓ Down payment + mortgage equals total cost' : '✗ Down payment + mortgage must equal total cost'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={() => setShowBuyPropertyAssetModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn buy-property-asset-btn"
                                onClick={handleBuyPropertyAssetConfirm}
                                disabled={
                                    !selectedPropertyType ||
                                    propertyDownPayment <= 0 ||
                                    propertyTotalCost <= 0 ||
                                    propertyDownPayment + propertyMortgage !== propertyTotalCost ||
                                    propertyDownPayment > savings
                                }
                            >
                                Buy Property
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showPaperAssetModal && selectedPaperAsset && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">{selectedPaperAsset.name}</h2>

                        <div className="asset-info-section">
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Current Quantity:</span>
                                    <span className="info-value">{selectedPaperAsset.quantity}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Price per Unit:</span>
                                    <span className="info-value">${selectedPaperAsset.pricePerUnit.toLocaleString()}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Monthly Income Per Unit:</span>
                                    <span className="info-value positive">+${selectedPaperAsset.passiveIncomePerUnit.toLocaleString()}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Total Monthly Income:</span>
                                    <span className="info-value positive">+${(selectedPaperAsset.passiveIncomePerUnit * selectedPaperAsset.quantity).toLocaleString()}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Total Value:</span>
                                    <span className="info-value">${(selectedPaperAsset.quantity * selectedPaperAsset.pricePerUnit).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="asset-management-section">
                            <h3>Edit Quantity</h3>
                            <div className="input-group">
                                <label>New Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={editQuantity}
                                    onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                                    placeholder="Enter new quantity"
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                            </div>

                            <div className="action-buttons-horizontal">
                                <button
                                    className="modal-btn update-btn"
                                    onClick={handleUpdatePaperAsset}
                                >
                                    Update Quantity
                                </button>
                            </div>
                        </div>

                        <div className="asset-sale-section">
                            <h3>Sell Asset</h3>
                            <div className="input-group">
                                <label>Sell Price per Unit:</label>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={sellPrice}
                                    onChange={(e) => setSellPrice(parseInt(e.target.value) || 0)}
                                    placeholder="Enter sell price per unit"
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                            </div>
                            <div className="input-group">
                                <label>Units to Sell (Max: {selectedPaperAsset.quantity}):</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedPaperAsset.quantity}
                                    value={unitsToSell}
                                    onChange={(e) => setUnitsToSell(parseInt(e.target.value) || 1)}
                                    placeholder="Enter units to sell"
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                            </div>

                            <div className="quantity-options">
                                <button onClick={() => setUnitsToSell(1)}>1 Unit</button>
                                <button onClick={() => setUnitsToSell(Math.floor(selectedPaperAsset.quantity / 2))}>Half</button>
                                <button onClick={() => setUnitsToSell(selectedPaperAsset.quantity)}>All</button>
                            </div>

                            <div className="sale-summary">
                                <p>Units to Sell: <strong>{unitsToSell}</strong></p>
                                <p>Remaining After Sale: <strong>{selectedPaperAsset.quantity - unitsToSell}</strong></p>
                                <p>Monthly Income Lost: <strong>-${(selectedPaperAsset.passiveIncomePerUnit * unitsToSell).toLocaleString()}</strong></p>
                                <p>Sale Price per Unit: <strong>${sellPrice.toLocaleString()}</strong></p>
                                <p className="net-proceeds">Total Sale Amount: <strong>${(unitsToSell * sellPrice).toLocaleString()}</strong></p>
                                {unitsToSell > selectedPaperAsset.quantity && (
                                    <p className="warning-note">⚠️ Cannot sell more units than you own!</p>
                                )}
                            </div>

                            <div className="action-buttons-horizontal">
                                <button
                                    className="modal-btn sell-btn"
                                    onClick={handleSellPaperAsset}
                                    disabled={sellPrice <= 0 || unitsToSell < 1 || unitsToSell > selectedPaperAsset.quantity}
                                >
                                    {unitsToSell === selectedPaperAsset.quantity ? 'Sell All Units' : `Sell ${unitsToSell} Units`}
                                </button>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={() => setShowPaperAssetModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPropertyAssetModal && selectedPropertyAsset && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">{selectedPropertyAsset.name}</h2>

                        {/* Edit Passive Income Section */}
                        <div className="property-edit-section">
                            <h3>Edit Passive Income</h3>
                            <div className="input-group">
                                <label>Monthly Passive Income:</label>
                                <input
                                    type="number"
                                    value={editPropertyPassiveIncome}
                                    onChange={(e) => setEditPropertyPassiveIncome(parseInt(e.target.value) || 0)}
                                    placeholder="Enter monthly passive income"
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                            </div>
                            <div className="action-buttons-horizontal">
                                <button
                                    className="modal-btn update-btn"
                                    onClick={() => {
                                        // Update the property asset with new passive income
                                        setPropertyAssets(prev =>
                                            prev.map(property =>
                                                property.id === selectedPropertyAsset.id
                                                    ? { ...property, passiveIncome: editPropertyPassiveIncome }
                                                    : property
                                            )
                                        );

                                        // Update the selected property asset to reflect changes
                                        setSelectedPropertyAsset(prev =>
                                            prev ? { ...prev, passiveIncome: editPropertyPassiveIncome } : null
                                        );

                                        alert(`Passive income updated to $${editPropertyPassiveIncome.toLocaleString()} per month`);
                                    }}
                                >
                                    Update Income
                                </button>
                            </div>
                        </div>

                        <div className="property-sale-section">
                            <h3>Sell Property</h3>

                            <div className="property-current-info">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Original Cost:</span>
                                        <span className="info-value">${selectedPropertyAsset.totalCost.toLocaleString()}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Down Payment:</span>
                                        <span className="info-value">${selectedPropertyAsset.downPayment.toLocaleString()}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Mortgage:</span>
                                        <span className="info-value">${selectedPropertyAsset.mortgage.toLocaleString()}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Monthly Income:</span>
                                        <span className="info-value positive">+${editPropertyPassiveIncome.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Selling Price:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={propertySellPrice}
                                    onChange={(e) => setPropertySellPrice(parseInt(e.target.value) || 0)}
                                    placeholder="Enter selling price"
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                            </div>

                            <div className="sale-summary">
                                <p>Selling Price: <strong>${propertySellPrice.toLocaleString()}</strong></p>
                                <p>Mortgage to Pay Off: <strong>${selectedPropertyAsset.mortgage.toLocaleString()}</strong></p>
                                <p className="net-proceeds">Net Proceeds: <strong>${(propertySellPrice - selectedPropertyAsset.mortgage).toLocaleString()}</strong></p>
                                {propertySellPrice < selectedPropertyAsset.mortgage && (
                                    <p className="warning-note">⚠️ Selling price is less than mortgage!</p>
                                )}
                            </div>

                            <div className="action-buttons-horizontal">
                                <button
                                    className="modal-btn sell-btn"
                                    onClick={handleSellPropertyAsset}
                                    disabled={propertySellPrice <= 0 || propertySellPrice < selectedPropertyAsset.mortgage}
                                >
                                    Sell Property
                                </button>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={() => setShowPropertyAssetModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Congratulations Modal */}
            {showCongratsModal && (
                <div className="modal-overlay congrats-overlay">
                    <div className="modal-content congrats-modal">
                        <div className="congrats-header">
                            <h2 className="congrats-title">🎉 Congratulations! 🎉</h2>
                        </div>
                        <div className="congrats-body">
                            <p className="congrats-message">
                                You got out of the rat race. Now enjoy your life on the fast track!
                            </p>
                            <div className="financial-summary-congrats">
                                <div className="summary-item">
                                    <span>Your Passive Income:</span>
                                    <span className="positive">${totalPassiveIncome.toLocaleString()}/month</span>
                                </div>
                                <div className="summary-item">
                                    <span>Your Total Expenses:</span>
                                    <span>${totalExpenses.toLocaleString()}/month</span>
                                </div>
                                <div className="summary-item net-cash-flow">
                                    <span>Monthly Surplus:</span>
                                    <span className="positive">+${(totalPassiveIncome - totalExpenses).toLocaleString()}/month</span>
                                </div>
                            </div>
                            <p className="congrats-submessage">
                                You've achieved financial freedom! Your assets now generate enough income to cover all your expenses.
                            </p>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-btn continue-btn"
                                onClick={() => navigate('/fast-track', {
                                    state: {
                                        passiveIncome: totalPassiveIncome
                                    }
                                })}
                            >
                                Continue to Fast Track
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GamePage