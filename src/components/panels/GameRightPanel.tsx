import { useLanguage } from '../../contexts/languageContext';

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

interface GameRightPanelProps {
    paperAssets: PaperAsset[]
    propertyAssets: PropertyAsset[]
    onBuyPaperAsset: () => void
    onBuyPropertyAsset: () => void
    onPaperAssetClick: (asset: PaperAsset) => void
    onPropertyAssetClick: (asset: PropertyAsset) => void
}

function GameRightPanel({
    paperAssets,
    propertyAssets,
    onBuyPaperAsset,
    onBuyPropertyAsset,
    onPaperAssetClick,
    onPropertyAssetClick
}: GameRightPanelProps) {
    const { t } = useLanguage();

    return (
        <div className="right-panel">
            <div className="scroll-content">
                {/* Paper Assets Section */}
                <section className="assets-section">
                    <div className="section-header">
                        <h2 className="section-main-title">{t('game.paperAssets')}</h2>
                        <button className="buy-asset-btn" onClick={onBuyPaperAsset}>
                            {t('game.buyAsset')}
                        </button>
                    </div>
                    <div className="assets-cards-container">
                        {paperAssets.length > 0 ? (
                            paperAssets.map(asset => (
                                <div
                                    key={asset.id}
                                    className="asset-card clickable"
                                    onClick={() => onPaperAssetClick(asset)}
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
                        <button className="buy-asset-btn" onClick={onBuyPropertyAsset}>
                            {t('game.buyAsset')}
                        </button>
                    </div>
                    <div className="assets-cards-container">
                        {propertyAssets.length > 0 ? (
                            propertyAssets.map(property => (
                                <div
                                    key={property.id}
                                    className="property-card clickable"
                                    onClick={() => onPropertyAssetClick(property)}
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
    );
}

export default GameRightPanel;