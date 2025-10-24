import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Import your JSON data
import fastTrackAssetsData from '../data/fastTrackAssets.json'

interface FastTrackAsset {
    id: string
    value: string
    label: string
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

    // Check for win conditions
    useEffect(() => {
        const cashFlowIncrease = totalCashFlow - initialCashFlow;

        if (cashFlowIncrease >= 50000 && !showCongratsModal) {
            setCongratsMessage('Congratulations! You increased your passive income by $50,000!');
            setShowCongratsModal(true);
        } else if (dreamBought && !showCongratsModal) {
            setCongratsMessage('Congratulations! You bought your dream!');
            setShowCongratsModal(true);
        }
    }, [totalCashFlow, initialCashFlow, dreamBought, showCongratsModal]);

    // Button handlers
    const handleCashflowDay = () => {
        // Add total cash flow to savings
        setSavings(prev => prev + totalCashFlow);
        alert(`Cashflow Day! $${totalCashFlow.toLocaleString()} added to savings.`);
    };

    const handleTaxAudit = () => {
        if (savings > 0) {
            const newSavings = Math.floor(savings / 2);
            setSavings(newSavings);
            alert(`Tax Audit/Civil Suit! Your savings have been halved.\n\nNew savings: $${newSavings.toLocaleString()}`);
        } else {
            alert('No savings to be halved!');
        }
    };

    const handleDivorce = () => {
        if (savings > 0) {
            setSavings(0);
            alert(`Divorce! All your savings are gone.\n\nSavings: $0`);
        } else {
            alert('No savings to lose!');
        }
    };

    const handleBuyDream = () => {
        setShowDreamModal(true);
        setDreamPrice(0); // Reset dream price when opening modal
    };

    const handleConfirmBuyDream = () => {
        if (dreamPrice <= 0) {
            alert('Please enter a valid dream price.');
            return;
        }

        if (dreamPrice > savings) {
            alert('Insufficient savings to buy your dream!');
            return;
        }

        // Deduct dream price from savings
        setSavings(prev => prev - dreamPrice);
        setDreamBought(true);
        setShowDreamModal(false);
    };

    const handleBuyAsset = () => {
        if (!selectedAsset) {
            alert('Please select an asset.');
            return;
        }

        if (selectedAsset.downPayment > savings) {
            alert('Insufficient savings to make this purchase!');
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

        alert(`Successfully purchased ${selectedAsset.label} for $${selectedAsset.downPayment.toLocaleString()}!\n\n` +
            `Monthly passive income: $${selectedAsset.passiveIncome.toLocaleString()}\n` +
            `This will increase your additional cash flow by $${selectedAsset.passiveIncome.toLocaleString()}`);

        // Close modal and reset form
        setShowBuyAssetModal(false);
        setSelectedAsset(null);
    };

    const handleBackToGame = () => {
        navigate('/');
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
                        <h1 className="panel-title">Fast Track</h1>

                        <div className="financial-summary">
                            <div className="summary-item">
                                <span>Initial Cash Flow:</span>
                                <span className="positive">+${initialCashFlow.toLocaleString()}</span>
                            </div>
                            <div className="summary-item">
                                <span>Additional Cash Flow:</span>
                                <span className="positive">+${additionalCashFlow.toLocaleString()}</span>
                            </div>
                            <div className="summary-item net-cash-flow">
                                <span>Total Cash Flow:</span>
                                <span className="positive">+${totalCashFlow.toLocaleString()}</span>
                            </div>
                            <div className="summary-item">
                                <span>Goal Cash Flow:</span>
                                <span>+${goalCashFlow.toLocaleString()}</span>
                            </div>
                            <div className="summary-item">
                                <span>Progress:</span>
                                <span>{progressPercentage.toFixed(1)}%</span>
                            </div>
                        </div>

                        <div className="goal-progress">
                            <h3>Goal: Increase Cash Flow by $50,000</h3>
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
                                    🎉 Goal Achieved! You've increased your cash flow by $50,000! 🎉
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button className="action-btn cashflow-day-btn" onClick={handleCashflowDay}>
                                Cashflow Day
                            </button>
                            <button className="action-btn tax-audit-btn" onClick={handleTaxAudit}>
                                Tax Audit/Civil Suit
                            </button>
                            <button className="action-btn divorce-btn" onClick={handleDivorce}>
                                Divorce
                            </button>
                            <button className="action-btn buy-dream-btn" onClick={handleBuyDream}>
                                Buy Your Dream
                            </button>
                        </div>

                        <button
                            className="back-button"
                            onClick={handleBackToGame}
                        >
                            Back to Start Page
                        </button>
                    </div>
                </div>

                {/* Right Side - Scrollable Content */}
                <div className="right-panel">
                    <div className="scroll-content">
                        <section className="assets-section">
                            <div className="section-header">
                                <h2 className="section-main-title">Fast Track Assets</h2>
                                <button
                                    className="buy-asset-btn"
                                    onClick={() => setShowBuyAssetModal(true)}
                                >
                                    Buy Asset
                                </button>
                            </div>
                            <div className="assets-cards-container">
                                {playerAssets.length > 0 ? (
                                    playerAssets.map(asset => (
                                        <div key={asset.id} className="asset-card">
                                            <div className="asset-card-header">
                                                <h3 className="asset-name">{asset.label}</h3>
                                            </div>
                                            <div className="asset-card-details">
                                                <div className="asset-detail">
                                                    <span className="detail-label">Purchase Cost:</span>
                                                    <span className="detail-value">${asset.downPayment.toLocaleString()}</span>
                                                </div>
                                                <div className="asset-detail">
                                                    <span className="detail-label">Monthly Income:</span>
                                                    <span className="detail-value positive">
                                                        +${asset.passiveIncome.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>No fast track assets yet</p>
                                        <p className="empty-state-subtitle">Click "Buy Asset" to add your first fast track investment</p>
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

            {/* Buy Asset Modal */}
            {showBuyAssetModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Buy Fast Track Asset</h2>

                        <div className="paper-asset-selection">
                            <div className="paper-asset-input-group">
                                <label htmlFor="fast-track-asset-type">Select Asset Type:</label>
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
                                    <option value="">Choose an asset type</option>
                                    {fastTrackAssetsData.map((asset, index) => (
                                        <option key={index} value={asset.value}>
                                            {asset.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {selectedAsset && (
                            <div className="paper-asset-details">
                                <h3>Purchase Details:</h3>

                                <div className="asset-preview-card">
                                    <h4>{selectedAsset.label}</h4>
                                    <div className="asset-preview-details">
                                        <div className="preview-item">
                                            <span className="preview-label">Cost:</span>
                                            <span className="preview-value">${selectedAsset.downPayment.toLocaleString()}</span>
                                        </div>
                                        <div className="preview-item">
                                            <span className="preview-label">Monthly Passive Income:</span>
                                            <span className="preview-value positive">+${selectedAsset.passiveIncome.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="paper-asset-summary">
                                    <p>Available Savings: <strong>${savings.toLocaleString()}</strong></p>
                                    <p className={savings >= selectedAsset.downPayment ? 'success' : 'error'}>
                                        {savings >= selectedAsset.downPayment ? '✓ Sufficient funds' : '✗ Insufficient funds'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={() => setShowBuyAssetModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn buy-paper-asset-btn"
                                onClick={handleBuyAsset}
                                disabled={!selectedAsset || selectedAsset.downPayment > savings}
                            >
                                Buy Asset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Buy Dream Modal */}
            {showDreamModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Buy Your Dream</h2>
                        <div className="dream-modal-content">
                            <p>What is the price of your dream?</p>
                            <div className="paper-asset-input-group">
                                <label>Dream Price:</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={dreamPrice}
                                    onChange={(e) => setDreamPrice(parseInt(e.target.value) || 0)}
                                    placeholder="Enter the price of your dream"
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                            </div>
                            <div className="dream-summary">
                                <p>Dream Price: <strong>${dreamPrice.toLocaleString()}</strong></p>
                                <p>Available Savings: <strong>${savings.toLocaleString()}</strong></p>
                                <p className={savings >= dreamPrice ? 'success' : 'error'}>
                                    {savings >= dreamPrice ? '✓ Sufficient funds' : '✗ Insufficient funds'}
                                </p>
                            </div>
                            <p className="dream-note">Buying your dream will complete your Fast Track journey!</p>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-btn cancel-btn"
                                onClick={() => setShowDreamModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn buy-dream-confirm-btn"
                                onClick={handleConfirmBuyDream}
                                disabled={dreamPrice <= 0 || dreamPrice > savings}
                            >
                                Buy My Dream!
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
                                {congratsMessage}
                            </p>
                            {dreamBought && (
                                <div className="financial-summary-congrats">
                                    <div className="summary-item">
                                        <span>Dream Price:</span>
                                        <span>${dreamPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                            <div className="financial-summary-congrats">
                                <div className="summary-item">
                                    <span>Your Total Cash Flow:</span>
                                    <span className="positive">${totalCashFlow.toLocaleString()}</span>
                                </div>
                                {!dreamBought && (
                                    <div className="summary-item">
                                        <span>Cash Flow Increase:</span>
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
                                Back to Start Page
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FastTrackPage;