import { useLanguage } from '../../contexts/languageContext';

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

interface BuyFastTrackAssetModalProps {
    show: boolean
    onClose: () => void
    onBuy: (asset: FastTrackAsset) => void
    selectedAsset: FastTrackAsset | null
    setSelectedAsset: (asset: FastTrackAsset | null) => void
    savings: number
    fastTrackAssetsData: any[]
    language: string
}

function BuyFastTrackAssetModal({
    show,
    onClose,
    onBuy,
    selectedAsset,
    setSelectedAsset,
    savings,
    fastTrackAssetsData,
    language
}: BuyFastTrackAssetModalProps) {
    const { t } = useLanguage();

    // Helper function for type-safe language access
    const getAssetLabel = (asset: FastTrackAsset, lang: string): string => {
        return lang === 'hu' ? asset.label.hu : asset.label.en;
    };

    if (!show) return null;

    return (
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
                                    const selectedAssetData: FastTrackAsset = {
                                        ...asset,
                                        id: ''
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
                                    {getAssetLabel(asset, language)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedAsset && (
                    <div className="paper-asset-details">
                        <h3>{t('modals.purchaseDetails')}</h3>

                        <div className="asset-preview-card">
                            <h4>{getAssetLabel(selectedAsset, language)}</h4>
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
                        onClick={onClose}
                    >
                        {t('modals.cancel')}
                    </button>
                    <button
                        className="modal-btn buy-paper-asset-btn"
                        onClick={() => onBuy(selectedAsset!)}
                        disabled={!selectedAsset || selectedAsset.downPayment > savings}
                    >
                        {t('game.buyAsset')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BuyFastTrackAssetModal;