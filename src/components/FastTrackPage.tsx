import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/languageContext'
import BuyFastTrackAssetModal from '../components/modals/BuyFastTrackAssetModal'
import BuyDreamModal from '../components/modals/BuyDreamModal'
import FastTrackCongratsModal from '../components/modals/FastTrackCongratsModal'

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
    const { language, t } = useLanguage();
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
            return sum + asset.passiveIncome;
        }, 0);
    };

    const initialCashFlow = calculateInitialCashFlow();
    const additionalCashFlow = calculateAdditionalCashFlow();
    const totalCashFlow = initialCashFlow + additionalCashFlow;

    const goalCashFlow = initialCashFlow + 50000;

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
                const confirmLeave = window.confirm(t('alerts.leavePageConfirmation'));

                if (!confirmLeave) {
                    window.history.pushState(null, '', window.location.href);
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    shouldBlockNavigation = false;
                }
            }
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState, true);

        return () => {
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
            if (isDarkMode) {
                document.body.classList.add('dark-mode')
            } else {
                document.body.classList.remove('dark-mode')
            }
        }
    }, [])

    // Button handlers
    const handleCashflowDay = () => {
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

    const handleCharity = () => {
        const charityAmount = 100000;

        if (savings < charityAmount) {
            alert(t('alerts.insufficientSavingsForCharity'));
            return;
        }

        const confirmCharity = window.confirm(
            `${t('alerts.charityConfirmation').replace('${amount}', charityAmount.toLocaleString())}\n\n${t('game.savings')}: $${savings.toLocaleString()}`
        );

        if (confirmCharity) {
            setSavings(prev => prev - charityAmount);
            alert(t('alerts.charityDonated').replace('${amount}', charityAmount.toLocaleString()));
        }
    };

    const handleBuyAsset = (asset: FastTrackAsset) => {
        const newPlayerAsset: FastTrackAsset = {
            ...asset,
            id: Date.now().toString()
        };

        setPlayerAssets(prev => [...prev, newPlayerAsset]);
        setSavings(prev => prev - asset.downPayment);

        alert(`${t('alerts.purchased')} ${asset.label[language]} ${t('alerts.for')} $${asset.downPayment.toLocaleString()}!\n\n` +
            `${t('game.monthlyPassiveIncome')}: $${asset.passiveIncome.toLocaleString()}\n` +
            `${t('alerts.willIncreaseCashFlow')} $${asset.passiveIncome.toLocaleString()}`);

        setShowBuyAssetModal(false);
        setSelectedAsset(null);
    };

    const handleConfirmBuyDream = (dreamPrice: number) => {
        setSavings(prev => prev - dreamPrice);
        setDreamBought(true);
        setShowDreamModal(false);
        setDreamPrice(dreamPrice);
    };

    const handleBackToGame = () => {
        if (window.confirm(t('alerts.leavePageConfirmation'))) {
            navigate('/');
        }
    };

    const handleCongratsContinue = () => {
        navigate('/');
    };

    const handleDeleteAsset = (assetId: string) => {
        const assetToDelete = playerAssets.find(asset => asset.id === assetId);

        if (!assetToDelete) return;

        if (window.confirm(t('alerts.confirmDeleteAsset'))) {
            setSavings(prev => prev + assetToDelete.downPayment);
            setPlayerAssets(prev => prev.filter(asset => asset.id !== assetId));
            alert(`${t('alerts.assetDeleted')}\n${t('alerts.refundAmount')}: $${assetToDelete.downPayment.toLocaleString()}`);
        }
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
                            <button className="action-btn charity-btn" onClick={handleCharity}>
                                {t('game.charity')}
                            </button>
                            <button className="action-btn buy-dream-btn" onClick={() => setShowDreamModal(true)}>
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
                                                <h3 className="asset-name">{asset.label[language]}</h3>
                                                <button
                                                    className="delete-asset-btn"
                                                    onClick={() => handleDeleteAsset(asset.id)}
                                                    title={t('modals.deleteAsset')}
                                                >
                                                    ✕
                                                </button>
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

            {/* Modal Components */}
            <BuyFastTrackAssetModal
                show={showBuyAssetModal}
                onClose={() => setShowBuyAssetModal(false)}
                onBuy={handleBuyAsset}
                selectedAsset={selectedAsset}
                setSelectedAsset={setSelectedAsset}
                savings={savings}
                fastTrackAssetsData={fastTrackAssetsData}
                language={language}
            />

            <BuyDreamModal
                show={showDreamModal}
                onClose={() => setShowDreamModal(false)}
                onConfirm={handleConfirmBuyDream}
                savings={savings}
            />

            <FastTrackCongratsModal
                show={showCongratsModal}
                onContinue={handleCongratsContinue}
                message={congratsMessage}
                dreamBought={dreamBought}
                dreamPrice={dreamPrice}
                totalCashFlow={totalCashFlow}
                initialCashFlow={initialCashFlow}
            />
        </div>
    );
}

export default FastTrackPage;