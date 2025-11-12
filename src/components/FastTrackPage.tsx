import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/languageContext'
import FastTrackLeftPanel from '../components/panels/FastTrackLeftPanel'
import FastTrackRightPanel from '../components/panels/FastTrackRightPanel'
import FastTrackSavingsSection from '../components/panels/FastTrackSavingsSection'
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

    // State management
    const [playerAssets, setPlayerAssets] = useState<FastTrackAsset[]>([]);
    const [showBuyAssetModal, setShowBuyAssetModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<FastTrackAsset | null>(null);
    const [showDreamModal, setShowDreamModal] = useState(false);
    const [dreamBought, setDreamBought] = useState(false);
    const [showCongratsModal, setShowCongratsModal] = useState(false);
    const [congratsMessage, setCongratsMessage] = useState('');
    const [dreamPrice, setDreamPrice] = useState(0);

    // Helper function for type-safe language access
    const getAssetLabel = (asset: FastTrackAsset, lang: string): string => {
        return lang === 'hu' ? asset.label.hu : asset.label.en;
    };

    // Financial calculations
    const calculateInitialCashFlow = () => {
        const roundedPassiveIncome = Math.ceil(passiveIncome / 1000) * 1000;
        return roundedPassiveIncome * 100;
    };

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

    const progressPercentage = Math.min(100, ((totalCashFlow - initialCashFlow) / 50000) * 100);

    // Effects
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

    // Handler functions
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

        alert(`${t('alerts.purchased')} ${getAssetLabel(asset, language)} ${t('alerts.for')} $${asset.downPayment.toLocaleString()}!\n\n` +
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

    const handleAddFunds = (amount: number) => {
        setSavings(prev => prev + amount)
    }

    const handleWithdraw = (amount: number) => {
        setSavings(prev => prev - amount)
    }

    return (
        <div className={`game-page ${darkMode ? 'dark-mode' : ''}`}>
            <div className="game-container">
                <FastTrackLeftPanel
                    initialCashFlow={initialCashFlow}
                    additionalCashFlow={additionalCashFlow}
                    totalCashFlow={totalCashFlow}
                    goalCashFlow={goalCashFlow}
                    progressPercentage={progressPercentage}
                    onCashflowDay={handleCashflowDay}
                    onTaxAudit={handleTaxAudit}
                    onDivorce={handleDivorce}
                    onCharity={handleCharity}
                    onBuyDream={() => setShowDreamModal(true)}
                    onBackToGame={handleBackToGame}
                />

                <FastTrackRightPanel
                    playerAssets={playerAssets}
                    onBuyAsset={() => setShowBuyAssetModal(true)}
                    onDeleteAsset={handleDeleteAsset}
                    language={language}
                />
            </div>

            <FastTrackSavingsSection
                savings={savings}
                onAddFunds={handleAddFunds}
                onWithdraw={handleWithdraw}
            />

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