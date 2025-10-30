import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/languageContext';

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
    const [selectedLiability, setSelectedLiability] = useState<Liability | null>(null)
    const [repayAmount, setRepayAmount] = useState(0)
    const [loanAmount, setLoanAmount] = useState(0)
    const [selectedLoanType, setSelectedLoanType] = useState<'bank' | 'retail' | null>(null)
    const [retailExpenseAmount, setRetailExpenseAmount] = useState(50)

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
        { value: 'apartmentHouse', labelKey: 'propertyAssets.apartmentHouse' },
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

    // Calculate total cost for paper asset purchase
    const paperAssetTotalCost = paperAssetQuantity * paperAssetPrice

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
        window.addEventListener('popstate', handlePopState, true); // Use capture phase

        return () => {
            // Clean up event listeners
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
            // Apply dark mode class to body if needed
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
            alert(t('alerts.fillAllFields'))
            return
        }

        if (paperAssetQuantity > 5000) {
            alert(t('alerts.maxQuantity5000'))
            return
        }

        if (paperAssetTotalCost > savings) {
            alert(t('alerts.insufficientSavings'))
            return
        }

        // Create new paper asset with passive income per unit
        const newPaperAsset: PaperAsset = {
            id: Date.now().toString(),
            name: t(paperAssetTypes.find(a => a.value === selectedPaperAssetType)?.labelKey || selectedPaperAssetType),
            quantity: paperAssetQuantity,
            pricePerUnit: paperAssetPrice,
            passiveIncomePerUnit: paperAssetPassiveIncome
        }

        // Add to paper assets
        setPaperAssets(prev => [...prev, newPaperAsset])

        // Deduct from savings
        setSavings(prev => prev - paperAssetTotalCost)

        // Show success message
        alert(`${t('alerts.purchased')} ${paperAssetQuantity} ${t('alerts.unitsOf')} ${selectedPaperAssetType} ${t('alerts.for')} $${paperAssetTotalCost}!\n` +
            `${t('alerts.monthlyPassiveIncome')}: $${paperAssetPassiveIncome}`)

        // Close modal and reset form
        setShowBuyPaperAssetModal(false)
        setSelectedPaperAssetType('')
        setPaperAssetQuantity(1)
        setPaperAssetPrice(0)
        setPaperAssetPassiveIncome(0)
    }

    const handleBuyPropertyAssetConfirm = () => {
        if (!selectedPropertyType || propertyTotalCost <= 0) {
            alert(t('alerts.fillAllFields'))
            return
        }

        // Allow zero down payment, but ensure it's not negative
        if (propertyDownPayment < 0) {
            alert(t('alerts.invalidDownPayment'))
            return
        }

        if (propertyDownPayment > savings) {
            alert(t('alerts.insufficientDownPayment'))
            return
        }

        if (propertyDownPayment + propertyMortgage !== propertyTotalCost) {
            alert(t('alerts.downPaymentPlusMortgage'))
            return
        }

        // Create new property asset
        const newPropertyAsset: PropertyAsset = {
            id: Date.now().toString(),
            name: t(propertyTypes.find(p => p.value === selectedPropertyType)?.labelKey || selectedPropertyType),
            downPayment: propertyDownPayment,
            totalCost: propertyTotalCost,
            mortgage: propertyMortgage,
            passiveIncome: propertyPassiveIncome
        }

        // Add to property assets
        setPropertyAssets(prev => [...prev, newPropertyAsset])

        // Deduct down payment from savings (only if down payment > 0)
        if (propertyDownPayment > 0) {
            setSavings(prev => prev - propertyDownPayment)
        }

        // Show success message
        const downPaymentText = propertyDownPayment === 0 ? t('alerts.noDownPayment') : `${t('alerts.downPayment')}: $${propertyDownPayment.toLocaleString()}`;

        alert(`${t('alerts.purchased')} ${selectedPropertyType}!\n\n` +
            `${downPaymentText}\n` +
            `${t('alerts.totalCost')}: $${propertyTotalCost.toLocaleString()}\n` +
            `${t('alerts.mortgage')}: $${propertyMortgage.toLocaleString()}\n` +
            `${t('alerts.monthlyPassiveIncome')}: $${propertyPassiveIncome.toLocaleString()}\n\n` +
            `${t('alerts.totalPassiveIncomeIncreased')} $${(totalPassiveIncome + propertyPassiveIncome).toLocaleString()}`)

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
            alert(t('alerts.selectLoanTypeAndAmount'));
            return;
        }

        let finalLoanAmount = loanAmount;

        if (selectedLoanType === 'bank') {
            if (finalLoanAmount < 1000) {
                alert(t('alerts.bankLoanMin1000'));
                return;
            }

            if (finalLoanAmount % 1000 !== 0) {
                finalLoanAmount = Math.round(finalLoanAmount / 1000) * 1000;
                setLoanAmount(finalLoanAmount);
                alert(t('alerts.bankLoanAdjusted').replace('${amount}', finalLoanAmount.toString()));
            }
        }

        if (selectedLoanType === 'bank') {
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
        if (selectedLoanType === 'bank') {
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
        setSelectedLoanType(null);
        setLoanAmount(0);
        setRetailExpenseAmount(0);
    }

    const handleRepay = () => {
        if (!selectedLiability) {
            alert(t('alerts.selectLiabilityToRepay'))
            return
        }

        const amountToRepay = selectedLiability.name === t('liabilities.bankLoan') ? repayAmount : selectedLiability.amount

        if (amountToRepay <= 0) {
            alert(t('alerts.enterValidRepaymentAmount'))
            return
        }

        if (amountToRepay > savings) {
            alert(t('alerts.insufficientSavings'))
            return
        }

        // Process repayment
        if (selectedLiability.name === t('liabilities.bankLoan')) {
            const newBankLoan = Math.max(0, bankLoan - repayAmount)
            setBankLoan(newBankLoan)
        } else if (selectedLiability.name === t('liabilities.retailDebt')) {
            const newRetailDebt = Math.max(0, retailDebt - repayAmount)
            setRetailDebt(newRetailDebt)
            const currentRetailExpense = updatedExpenses.find(e => e.name === t('expenses.retail'))?.amount || 0
            const expenseReduction = (repayAmount / retailDebt) * currentRetailExpense
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
        if (selectedLiability.name === t('liabilities.bankLoan')) {
            const oldExpense = bankLoanExpense
            const newExpense = (bankLoan - repayAmount) * 0.10
            expenseReduction = oldExpense - newExpense
        } else if (selectedLiability.name === t('liabilities.retailDebt')) {
            const currentRetailExpense = updatedExpenses.find(e => e.name === t('expenses.retail'))?.amount || 0
            expenseReduction = (repayAmount / retailDebt) * currentRetailExpense
        } else {
            expenseReduction = selectedLiability.expenseAmount || 0
        }

        // Show success message
        alert(`${t('alerts.repaid')} $${amountToRepay} ${t('alerts.of')} ${selectedLiability.name}!\n\n` +
            `${t('alerts.monthlyExpensesReduced')}: $${expenseReduction.toFixed(0)}\n` +
            `${t('alerts.monthlyCashFlowIncreased')}: $${expenseReduction.toFixed(0)}`)

        // Close modal
        setShowRepayModal(false)
        setSelectedLiability(null)
        setRepayAmount(0)
    }

    const handleLiabilitySelect = (liability: Liability) => {
        setSelectedLiability(liability)
        if (liability.name !== t('liabilities.bankLoan')) {
            setRepayAmount(liability.amount)
        } else {
            setRepayAmount(0)
        }
    }

    const handleBankLoanRepayChange = (value: number) => {
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
            if (value % 1000 === 0 && value >= 0) {
                setLoanAmount(value)
            }
        } else {
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
            if (propertyTotalCost > 0) {
                setPropertyMortgage(propertyTotalCost - value)
            }
        }
    }

    const handlePropertyTotalCostChange = (value: number) => {
        if (value >= 0) {
            setPropertyTotalCost(value)
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
        setSellPrice(asset.pricePerUnit)
        setUnitsToSell(1)
        setShowPaperAssetModal(true)
    }

    const handlePropertyAssetClick = (asset: PropertyAsset) => {
        setSelectedPropertyAsset(asset);
        setEditPropertyPassiveIncome(asset.passiveIncome);
        setPropertySellPrice(asset.totalCost);
        setShowPropertyAssetModal(true);
    };

    const handleUpdatePaperAsset = () => {
        if (!selectedPaperAsset) return

        if (editQuantity < 1) {
            alert(t('alerts.quantityAtLeast1'))
            return
        }

        setPaperAssets(prev =>
            prev.map(asset =>
                asset.id === selectedPaperAsset.id
                    ? { ...asset, quantity: editQuantity }
                    : asset
            )
        )

        alert(`${t('alerts.updated')} ${selectedPaperAsset.name} ${t('alerts.quantityTo')} ${editQuantity}`)
        setShowPaperAssetModal(false)
        setSelectedPaperAsset(null)
    }

    const handleSellPaperAsset = () => {
        if (!selectedPaperAsset) return

        if (sellPrice <= 0) {
            alert(t('alerts.enterValidSellPrice'))
            return
        }

        if (unitsToSell < 1 || unitsToSell > selectedPaperAsset.quantity) {
            alert(t('alerts.enterValidUnitsToSell'))
            return
        }

        const totalSaleAmount = unitsToSell * sellPrice

        if (unitsToSell === selectedPaperAsset.quantity) {
            setPaperAssets(prev => prev.filter(asset => asset.id !== selectedPaperAsset.id))
        } else {
            setPaperAssets(prev =>
                prev.map(asset =>
                    asset.id === selectedPaperAsset.id
                        ? { ...asset, quantity: asset.quantity - unitsToSell }
                        : asset
                )
            )
        }

        setSavings(prev => prev + totalSaleAmount)

        alert(`${t('alerts.sold')} ${unitsToSell} ${t('alerts.unitsOf')} ${selectedPaperAsset.name} ${t('alerts.for')} $${totalSaleAmount.toLocaleString()}!`)
        setShowPaperAssetModal(false)
        setSelectedPaperAsset(null)
    }

    const handleSellPropertyAsset = () => {
        if (!selectedPropertyAsset) return

        if (propertySellPrice <= 0) {
            alert(t('alerts.enterValidSellPrice'))
            return
        }

        const netProceeds = propertySellPrice - selectedPropertyAsset.mortgage

        if (netProceeds < 0) {
            alert(t('alerts.sellingPriceMustCoverMortgage'))
            return
        }

        setPropertyAssets(prev => prev.filter(property => property.id !== selectedPropertyAsset.id))
        setSavings(prev => prev + netProceeds)

        alert(`${t('alerts.sold')} ${selectedPropertyAsset.name} ${t('alerts.for')} $${propertySellPrice.toLocaleString()}!\n` +
            `${t('alerts.afterPayingMortgage')} $${selectedPropertyAsset.mortgage.toLocaleString()},\n` +
            `${t('alerts.netProceeds')}: $${netProceeds.toLocaleString()}`)

        setShowPropertyAssetModal(false)
        setSelectedPropertyAsset(null)
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
                            <button className="action-btn repay-btn" onClick={handleRepayLiability}>
                                {t('game.repayLiability')}
                            </button>
                            <button className="action-btn loan-btn" onClick={handleGetLoan}>
                                {t('game.getLoan')}
                            </button>
                        </div>

                        <div className="children-section">
                            <div className="children-input">
                                <label htmlFor="children-count">{t('game.numberOfChildren')}:</label>
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
                                <button className="buy-asset-btn" onClick={handleBuyPaperAsset}>
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
                                <button className="buy-asset-btn" onClick={handleBuyPropertyAsset}>
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

            {/* Repay Liability Modal */}
            {showRepayModal && (
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
                                onClick={() => setShowRepayModal(false)}
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
            )}

            {/* Get Loan Modal */}
            {showGetLoanModal && (
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
                                onClick={() => setShowGetLoanModal(false)}
                            >
                                {t('modals.cancel')}
                            </button>
                            <button
                                className="modal-btn get-loan-btn"
                                onClick={handleGetLoanConfirm}
                                disabled={!selectedLoanType || loanAmount <= 0 || (selectedLoanType === 'retail' && retailExpenseAmount <= 0)}
                            >
                                {t('modals.getLoan')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Buy Paper Asset Modal */}
            {showBuyPaperAssetModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">{t('modals.buyPaperAsset')}</h2>

                        <div className="paper-asset-selection">
                            <div className="paper-asset-input-group">
                                <label htmlFor="paper-asset-type">{t('modals.selectAssetType')}</label>
                                {/* In the Buy Paper Asset Modal */}
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
                                onClick={() => setShowBuyPaperAssetModal(false)}
                            >
                                {t('modals.cancel')}
                            </button>
                            <button
                                className="modal-btn buy-paper-asset-btn"
                                onClick={handleBuyPaperAssetConfirm}
                                disabled={!selectedPaperAssetType || paperAssetQuantity < 1 || paperAssetPrice <= 0 || paperAssetTotalCost > savings}
                            >
                                {t('modals.buyPaperAsset')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Buy Property Asset Modal */}
            {showBuyPropertyAssetModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">{t('modals.buyPropertyAsset')}</h2>

                        <div className="property-asset-selection">
                            <div className="property-asset-input-group">
                                <label htmlFor="property-type">{t('modals.selectAssetType')}</label>
                                {/* In the Buy Property Asset Modal */}
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
                                    <input
                                        type="number"
                                        value={propertyPassiveIncome}
                                        onChange={(e) => handlePropertyPassiveIncomeChange(parseInt(e.target.value) || 0)}
                                        placeholder={t('modals.enterMonthlyPassiveIncome')}
                                        onWheel={(e) => e.currentTarget.blur()}
                                    />
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
                                onClick={() => setShowBuyPropertyAssetModal(false)}
                            >
                                {t('modals.cancel')}
                            </button>
                            <button
                                className="modal-btn buy-property-asset-btn"
                                onClick={handleBuyPropertyAssetConfirm}
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
            )}

            {/* Paper Asset Management Modal */}
            {showPaperAssetModal && selectedPaperAsset && (
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
                                    onClick={handleUpdatePaperAsset}
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
                                    onClick={handleSellPaperAsset}
                                    disabled={sellPrice <= 0 || unitsToSell < 1 || unitsToSell > selectedPaperAsset.quantity}
                                >
                                    {unitsToSell === selectedPaperAsset.quantity ? t('modals.sellAllUnits') : `${t('modals.sell')} ${unitsToSell} ${t('modals.units')}`}
                                </button>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={() => setShowPaperAssetModal(false)}
                            >
                                {t('modals.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Property Asset Management Modal */}
            {showPropertyAssetModal && selectedPropertyAsset && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">{selectedPropertyAsset.name}</h2>

                        {/* Edit Passive Income Section */}
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
                                    onClick={() => {
                                        setPropertyAssets(prev =>
                                            prev.map(property =>
                                                property.id === selectedPropertyAsset.id
                                                    ? { ...property, passiveIncome: editPropertyPassiveIncome }
                                                    : property
                                            )
                                        );
                                        setSelectedPropertyAsset(prev =>
                                            prev ? { ...prev, passiveIncome: editPropertyPassiveIncome } : null
                                        );
                                        alert(`${t('alerts.passiveIncomeUpdated')} $${editPropertyPassiveIncome.toLocaleString()} ${t('alerts.perMonth')}`);
                                    }}
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
                                    onClick={handleSellPropertyAsset}
                                    disabled={propertySellPrice <= 0 || propertySellPrice < selectedPropertyAsset.mortgage}
                                >
                                    {t('modals.sellProperty')}
                                </button>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={() => setShowPropertyAssetModal(false)}
                            >
                                {t('modals.close')}
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
                            <h2 className="congrats-title">{t('congratulations.title')}</h2>
                        </div>
                        <div className="congrats-body">
                            <p className="congrats-message">
                                {t('congratulations.message')}
                            </p>
                            <div className="financial-summary-congrats">
                                <div className="summary-item">
                                    <span>{t('game.passiveIncome')}</span>
                                    <span className="positive">${totalPassiveIncome.toLocaleString()}/{t('game.month')}</span>
                                </div>
                                <div className="summary-item">
                                    <span>{t('game.totalExpenses')}</span>
                                    <span>${totalExpenses.toLocaleString()}/{t('game.month')}</span>
                                </div>
                                <div className="summary-item net-cash-flow">
                                    <span>{t('game.monthlySurplus')}</span>
                                    <span className="positive">+${(totalPassiveIncome - totalExpenses).toLocaleString()}/{t('game.month')}</span>
                                </div>
                            </div>
                            <p className="congrats-submessage">
                                {t('congratulations.achievedFinancialFreedom')}
                            </p>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-btn continue-btn"
                                onClick={() => navigate('/fast-track', {
                                    state: {
                                        passiveIncome: totalPassiveIncome,
                                        darkMode: darkMode
                                    }
                                })}
                            >
                                {t('congratulations.continueToFastTrack')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GamePage