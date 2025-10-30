import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/languageContext' // Make sure this is imported

// Import your JSON data
import fastTrackAssetsData from '../data/fastTrackAssets.json'

interface FastTrackAsset {
    id: string
    value: string
    label: {
        en: string
        hu: string
    }
    downPayment: number
    passiveIncome: number
}

interface LocationState {
    passiveIncome: number
    darkMode?: boolean
}

function FastTrackPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { language, t } = useLanguage(); // Get the current language
    const { passiveIncome, darkMode } = (location.state as LocationState) || { passiveIncome: 0 };

    const [playerAssets, setPlayerAssets] = useState<FastTrackAsset[]>([]);
    const [showBuyAssetModal, setShowBuyAssetModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<FastTrackAsset | null>(null);
    const [showDreamModal, setShowDreamModal] = useState(false);
    const [dreamBought, setDreamBought] = useState(false);
    const [showCongratsModal, setShowCongratsModal] = useState(false);
    const [congratsMessage, setCongratsMessage] = useState('');
    const [dreamPrice, setDreamPrice] = useState(0);

    // Calculate initial cash flow from game page passive income
    const calculateInitialCashFlow = () => {
        const roundedPassiveIncome = Math.ceil(passiveIncome / 1000) * 1000;
        return roundedPassiveIncome * 100;
    };

    // Calculate additional cash flow from Fast Track assets - directly add passive income
    const calculateAdditionalCashFlow = () => {
        return playerAssets.reduce((sum, asset) => {
            // Directly add the passive income to additional cash flow
            return sum + asset.passiveIncome;
        }, 0);
    };

    const initialCashFlow = calculateInitialCashFlow();
    const additionalCashFlow = calculateAdditionalCashFlow();
    const totalCashFlow = initialCashFlow + additionalCashFlow;

    const goalCashFlow = initialCashFlow + 50000; // Goal is initial + $50,000

    // Set savings to initial cash flow
    const [savings, setSavings] = useState(initialCashFlow);

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

    // Check for win conditions
    useEffect(() => {
        const cashFlowIncrease = totalCashFlow - initialCashFlow;

        if (cashFlowIncrease >= 50000 && !showCongratsModal) {
            setCongratsMessage(t('fastTrack.goalAchieved'));
            setShowCongratsModal(true);
        } else if (dreamBought && !showCongratsModal) {
            setCongratsMessage(t('congratulations.message'));
            setShowCongratsModal(true);
        }
    }, [totalCashFlow, initialCashFlow, dreamBought, showCongratsModal, t]);

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
    const handleCashflowDay = () => {
        // Add total cash flow to savings
        setSavings(prev => prev + totalCashFlow);
        alert(`Cashflow Day! $${totalCashFlow.toLocaleString()} ${t('alerts.addedToSavings')}`);
    };

    const handleTaxAudit = () => {
        if (savings > 0) {
            const newSavings = Math.floor(savings / 2);
            setSavings(newSavings);
            alert(`${t('fastTrack.taxAudit')}! ${t('alerts.savingsHalved')}\n\n${t('game.savings')}: $${newSavings.toLocaleString()}`);
        } else {
            alert(t('alerts.noSavingsToHalve'));
        }
    };

    const handleDivorce = () => {
        if (savings > 0) {
            setSavings(0);
            alert(`${t('fastTrack.divorce')}! ${t('alerts.allSavingsGone')}\n\n${t('game.savings')}: $0`);
        } else {
            alert(t('alerts.noSavingsToLose'));
        }
    };

    const handleBuyDream = () => {
        setShowDreamModal(true);
        setDreamPrice(0); // Reset dream price when opening modal
    };

    const handleConfirmBuyDream = () => {
        if (dreamPrice <= 0) {
            alert(t('alerts.enterValidDreamPrice'));
            return;
        }

        if (dreamPrice > savings) {
            alert(t('alerts.insufficientSavings'));
            return;
        }

        // Deduct dream price from savings
        setSavings(prev => prev - dreamPrice);
        setDreamBought(true);
        setShowDreamModal(false);
    };

    const handleBuyAsset = () => {
        if (!selectedAsset) {
            alert(t('alerts.selectAsset'));
            return;
        }

        if (selectedAsset.downPayment > savings) {
            alert(t('alerts.insufficientSavings'));
            return;
        }

        const newPlayerAsset: FastTrackAsset = {
            ...selectedAsset,
            id: Date.now().toString() // Add unique ID
        };

        // Add to player assets
        setPlayerAssets(prev => [...prev, newPlayerAsset]);

        // Deduct down payment from savings
        setSavings(prev => prev - selectedAsset.downPayment);

        // Use the translated label in the alert
        alert(`${t('alerts.purchased')} ${selectedAsset.label[language]} ${t('alerts.for')} $${selectedAsset.downPayment.toLocaleString()}!\n\n` +
            `${t('game.monthlyPassiveIncome')}: $${selectedAsset.passiveIncome.toLocaleString()}\n` +
            `${t('alerts.willIncreaseCashFlow')} $${selectedAsset.passiveIncome.toLocaleString()}`);

        // Close modal and reset form
        setShowBuyAssetModal(false);
        setSelectedAsset(null);
    };

    const handleBackToGame = () => {
        if (window.confirm(t('alerts.leavePageConfirmation'))) {
            navigate('/');
        }
    };

    const handleCongratsContinue = () => {
        navigate('/');
    };

    const progressPercentage = Math.min(100, ((totalCashFlow - initialCashFlow) / 50000) * 100);

    return (
        <div className={`game-page ${darkMode ? 'dark-mode' : ''}`}>
            <div className="game-container">
                {/* Left Side - Fixed Panel */}
                <div className="left-panel">
                    <div className="panel-content">
                        <h1 className="panel-title">{t('fastTrack.fastTrack')}</h1>

                        <div className="financial-summary">
                            <div className="summary-item">
                                <span>{t('fastTrack.initialCashFlow')}</span>
                                <span className="positive">+${initialCashFlow.toLocaleString()}</span>
                            </div>
                            <div className="summary-item">
                                <span>{t('fastTrack.additionalCashFlow')}</span>
                                <span className="positive">+${additionalCashFlow.toLocaleString()}</span>
                            </div>
                            <div className="summary-item net-cash-flow">
                                <span>{t('fastTrack.totalCashFlow')}</span>
                                <span className="positive">+${totalCashFlow.toLocaleString()}</span>
                            </div>
                            <div className="summary-item">
                                <span>{t('fastTrack.goalCashFlow')}</span>
                                <span>+${goalCashFlow.toLocaleString()}</span>
                            </div>
                            <div className="summary-item">
                                <span>{t('fastTrack.progress')}</span>
                                <span>{progressPercentage.toFixed(1)}%</span>
                            </div>
                        </div>

                        <div className="goal-progress">
                            <h3>{t('fastTrack.goalIncrease')}</h3>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            <div className="progress-text">
                                <span>+${(totalCashFlow - initialCashFlow).toLocaleString()} / +$50,000</span>
                            </div>
                            {totalCashFlow >= goalCashFlow && (
                                <div className="goal-achieved">
                                    {t('fastTrack.goalAchieved')}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button className="action-btn cashflow-day-btn" onClick={handleCashflowDay}>
                                {t('fastTrack.cashflowDay')}
                            </button>
                            <button className="action-btn tax-audit-btn" onClick={handleTaxAudit}>
                                {t('fastTrack.taxAudit')}
                            </button>
                            <button className="action-btn divorce-btn" onClick={handleDivorce}>
                                {t('fastTrack.divorce')}
                            </button>
                            <button className="action-btn buy-dream-btn" onClick={handleBuyDream}>
                                {t('fastTrack.buyYourDream')}
                            </button>
                        </div>

                        <button
                            className="back-button"
                            onClick={handleBackToGame}
                        >
                            {t('congratulations.backToStartPage')}
                        </button>
                    </div>
                </div>

                {/* Right Side - Scrollable Content */}
                <div className="right-panel">
                    <div className="scroll-content">
                        <section className="assets-section">
                            <div className="section-header">
                                <h2 className="section-main-title">{t('fastTrack.fastTrackAssets')}</h2>
                                <button
                                    className="buy-asset-btn"
                                    onClick={() => setShowBuyAssetModal(true)}
                                >
                                    {t('game.buyAsset')}
                                </button>
                            </div>
                            <div className="assets-cards-container">
                                {playerAssets.length > 0 ? (
                                    playerAssets.map(asset => (
                                        <div key={asset.id} className="asset-card">
                                            <div className="asset-card-header">
                                                {/* Use the current language for the asset name */}
                                                <h3 className="asset-name">{asset.label[language]}</h3>
                                            </div>
                                            <div className="asset-card-details">
                                                <div className="asset-detail">
                                                    <span className="detail-label">{t('modals.downPayment')}</span>
                                                    <span className="detail-value">${asset.downPayment.toLocaleString()}</span>
                                                </div>
                                                <div className="asset-detail">
                                                    <span className="detail-label">{t('game.monthlyPassiveIncome')}</span>
                                                    <span className="detail-value positive">
                                                        +${asset.passiveIncome.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>{t('game.noFastTrackAssets')}</p>
                                        <p className="empty-state-subtitle">{t('game.clickToAddFirstFastTrack')}</p>
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

            {/* Buy Asset Modal */}
            {showBuyAssetModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">{t('modals.buyFastTrackAsset')}</h2>

                        <div className="paper-asset-selection">
                            <div className="paper-asset-input-group">
                                <label htmlFor="fast-track-asset-type">{t('modals.selectAssetType')}</label>
                                <select
                                    id="fast-track-asset-type"
                                    className="paper-asset-select"
                                    value={selectedAsset?.value || ''}
                                    onChange={(e) => {
                                        const asset = fastTrackAssetsData.find(a => a.value === e.target.value);
                                        if (asset) {
                                            // Convert the JSON data to match our interface
                                            const selectedAssetData: FastTrackAsset = {
                                                ...asset,
                                                id: '' // Will be set when purchased
                                            };
                                            setSelectedAsset(selectedAssetData);
                                        } else {
                                            setSelectedAsset(null);
                                        }
                                    }}
                                >
                                    <option value="">{t('modals.chooseAssetType')}</option>
                                    {fastTrackAssetsData.map((asset, index) => (
                                        <option key={index} value={asset.value}>
                                            {/* Use the current language for the dropdown options */}
                                            {asset.label[language]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {selectedAsset && (
                            <div className="paper-asset-details">
                                <h3>{t('modals.purchaseDetails')}</h3>

                                <div className="asset-preview-card">
                                    {/* Use the current language for the asset name */}
                                    <h4>{selectedAsset.label[language]}</h4>
                                    <div className="asset-preview-details">
                                        <div className="preview-item">
                                            <span className="preview-label">{t('modals.downPayment')}</span>
                                            <span className="preview-value">${selectedAsset.downPayment.toLocaleString()}</span>
                                        </div>
                                        <div className="preview-item">
                                            <span className="preview-label">{t('game.monthlyPassiveIncome')}</span>
                                            <span className="preview-value positive">+${selectedAsset.passiveIncome.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="paper-asset-summary">
                                    <p>{t('modals.availableSavings')} <strong>${savings.toLocaleString()}</strong></p>
                                    <p className={savings >= selectedAsset.downPayment ? 'success' : 'error'}>
                                        {savings >= selectedAsset.downPayment ? t('modals.sufficientFunds') : t('modals.insufficientFunds')}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={() => setShowBuyAssetModal(false)}
                            >
                                {t('modals.cancel')}
                            </button>
                            <button
                                className="modal-btn buy-paper-asset-btn"
                                onClick={handleBuyAsset}
                                disabled={!selectedAsset || selectedAsset.downPayment > savings}
                            >
                                {t('game.buyAsset')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Buy Dream Modal */}
            {showDreamModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">{t('fastTrack.buyYourDream')}</h2>
                        <div className="dream-modal-content">
                            <p>{t('modals.whatIsDreamPrice')}</p>
                            <div className="paper-asset-input-group">
                                <label>{t('modals.dreamPrice')}</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={dreamPrice}
                                    onChange={(e) => setDreamPrice(parseInt(e.target.value) || 0)}
                                    placeholder={t('modals.enterDreamPrice')}
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                            </div>
                            <div className="dream-summary">
                                <p>{t('modals.dreamPrice')} <strong>${dreamPrice.toLocaleString()}</strong></p>
                                <p>{t('modals.availableSavings')} <strong>${savings.toLocaleString()}</strong></p>
                                <p className={savings >= dreamPrice ? 'success' : 'error'}>
                                    {savings >= dreamPrice ? t('modals.sufficientFunds') : t('modals.insufficientFunds')}
                                </p>
                            </div>
                            <p className="dream-note">{t('modals.buyDreamNote')}</p>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={() => setShowDreamModal(false)}
                            >
                                {t('modals.cancel')}
                            </button>
                            <button
                                className="modal-btn buy-dream-confirm-btn"
                                onClick={handleConfirmBuyDream}
                                disabled={dreamPrice <= 0 || dreamPrice > savings}
                            >
                                {t('modals.buyMyDream')}
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
                                {congratsMessage}
                            </p>
                            {dreamBought && (
                                <div className="financial-summary-congrats">
                                    <div className="summary-item">
                                        <span>{t('modals.dreamPrice')}</span>
                                        <span>${dreamPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                            <div className="financial-summary-congrats">
                                <div className="summary-item">
                                    <span>{t('fastTrack.totalCashFlow')}</span>
                                    <span className="positive">${totalCashFlow.toLocaleString()}</span>
                                </div>
                                {!dreamBought && (
                                    <div className="summary-item">
                                        <span>{t('fastTrack.cashFlowIncrease')}</span>
                                        <span className="positive">+${(totalCashFlow - initialCashFlow).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-btn continue-btn"
                                onClick={handleCongratsContinue}
                            >
                                {t('congratulations.backToStartPage')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FastTrackPage;