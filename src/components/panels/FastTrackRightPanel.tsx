import { useLanguage } from '../../contexts/languageContext';

interface FastTrackAsset {
    id: string
    label: {
        en: string
        hu: string
    }
    downPayment: number
    passiveIncome: number
}

interface FastTrackRightPanelProps {
    playerAssets: FastTrackAsset[]
    onBuyAsset: () => void
    onDeleteAsset: (assetId: string) => void
    language: string
}

function FastTrackRightPanel({ playerAssets, onBuyAsset, onDeleteAsset, language }: FastTrackRightPanelProps) {
    const { t } = useLanguage();

    const getAssetLabel = (asset: FastTrackAsset, lang: string): string => {
        return lang === 'hu' ? asset.label.hu : asset.label.en;
    };

    return (
        <div className="right-panel">
            <div className="scroll-content">
                <section className="assets-section">
                    <div className="section-header">
                        <h2 className="section-main-title">{t('fastTrack.fastTrackAssets')}</h2>
                        <button
                            className="buy-asset-btn"
                            onClick={onBuyAsset}
                        >
                            {t('game.buyAsset')}
                        </button>
                    </div>
                    <div className="assets-cards-container">
                        {playerAssets.length > 0 ? (
                            playerAssets.map(asset => (
                                <div key={asset.id} className="asset-card">
                                    <div className="asset-card-header">
                                        <h3 className="asset-name">{getAssetLabel(asset, language)}</h3>
                                        <button
                                            className="delete-asset-btn"
                                            onClick={() => onDeleteAsset(asset.id)}
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
    );
}

export default FastTrackRightPanel;