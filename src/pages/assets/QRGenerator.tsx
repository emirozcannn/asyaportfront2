// src/pages/assets/QRGenerator.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Asset } from '../../api/types/assets';
import { assetsApi } from '../../api/assets';

interface QRSettings {
  size: number;
  includeText: boolean;
  includeLogo: boolean;
  backgroundColor: string;
  foregroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  format: 'PNG' | 'SVG' | 'PDF';
  textPosition: 'bottom' | 'top' | 'none';
  fontSize: number;
}

interface BulkQRData {
  assets: Asset[];
  format: 'individual' | 'sheet';
  sheetLayout: '2x2' | '3x3' | '4x4' | '5x5';
  includeAssetInfo: boolean;
}

const QRGenerator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [qrSettings, setQrSettings] = useState<QRSettings>({
    size: 256,
    includeText: true,
    includeLogo: false,
    backgroundColor: '#FFFFFF',
    foregroundColor: '#000000',
    errorCorrectionLevel: 'M',
    format: 'PNG',
    textPosition: 'bottom',
    fontSize: 12
  });

  const [bulkSettings, setBulkSettings] = useState<BulkQRData>({
    assets: [],
    format: 'individual',
    sheetLayout: '3x3',
    includeAssetInfo: true
  });

  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

  // Load assets
  useEffect(() => {
    loadAssets();
    
    // Check if specific asset is requested via URL params
    const assetId = searchParams.get('assetId');
    if (assetId) {
      setSelectedAssets([assetId]);
      setActiveTab('single');
    }
  }, [searchParams]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const assetsData = await assetsApi.getAll();
      setAssets(assetsData);
    } catch (error) {
      console.error('Asset yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter assets based on search
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Asset selection
  const handleAssetSelect = (assetId: string) => {
    if (activeTab === 'single') {
      setSelectedAssets([assetId]);
      const asset = assets.find(a => a.id === assetId);
      if (asset) {
        setPreviewAsset(asset);
        generateQRPreview(asset);
      }
    } else {
      setSelectedAssets(prev => 
        prev.includes(assetId) 
          ? prev.filter(id => id !== assetId)
          : [...prev, assetId]
      );
    }
  };

  const handleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    }
  };

  // Generate QR Code Preview
  const generateQRPreview = (asset: Asset) => {
    // This would use a QR code library like qrcode.js or similar
    // For now, we'll simulate the preview
    console.log('Generating QR preview for:', asset);
    
    // Simulate QR code generation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.fillStyle = qrSettings.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw placeholder QR pattern
        ctx.fillStyle = qrSettings.foregroundColor;
        const cellSize = qrSettings.size / 25;
        
        // Simulate QR pattern
        for (let i = 0; i < 25; i++) {
          for (let j = 0; j < 25; j++) {
            if (Math.random() > 0.5) {
              ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
          }
        }
        
        // Add text if enabled
        if (qrSettings.includeText && qrSettings.textPosition !== 'none') {
          ctx.fillStyle = qrSettings.foregroundColor;
          ctx.font = `${qrSettings.fontSize}px Arial`;
          ctx.textAlign = 'center';
          
          const text = `${asset.assetNumber}`;
          const textY = qrSettings.textPosition === 'bottom' ? 
            qrSettings.size + qrSettings.fontSize + 5 : 
            -5;
          
          ctx.fillText(text, qrSettings.size / 2, textY);
        }
      }
    }
  };

  // Generate and download single QR
  const generateSingleQR = async () => {
    if (!previewAsset) {
      alert('Lütfen bir asset seçin');
      return;
    }

    try {
      setLoading(true);
      
      // API call will be here
      // const qrData = await generateAssetQR(previewAsset.id, qrSettings);
      console.log('Single QR generated for:', previewAsset.assetNumber);
      
      // Simulate download
      const canvas = canvasRef.current;
      if (canvas) {
        const link = document.createElement('a');
        link.download = `QR_${previewAsset.assetNumber}.${qrSettings.format.toLowerCase()}`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('QR oluşturma hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate bulk QR codes
  const generateBulkQR = async () => {
    if (selectedAssets.length === 0) {
      alert('Lütfen asset(lar) seçin');
      return;
    }

    try {
      setLoading(true);
      
      const selectedAssetData = assets.filter(asset => selectedAssets.includes(asset.id));
      
      // API call will be here
      // const bulkQRData = await generateBulkQR(selectedAssets, { ...qrSettings, ...bulkSettings });
      console.log('Bulk QR generated for assets:', selectedAssetData.map(a => a.assetNumber));
      
      // Simulate download
      const link = document.createElement('a');
      link.download = `QR_Codes_Bulk_${new Date().getTime()}.${qrSettings.format.toLowerCase()}`;
      link.href = '#'; // Would be actual blob URL
      link.click();
    } catch (error) {
      console.error('Toplu QR oluşturma hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Print QR codes
  const printQRCodes = () => {
    if (activeTab === 'single' && previewAsset) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>QR Code - ${previewAsset.assetNumber}</title></head>
            <body style="text-align: center; padding: 20px;">
              <h2>${previewAsset.name}</h2>
              <p>Asset No: ${previewAsset.assetNumber}</p>
              <canvas id="qrCanvas" width="${qrSettings.size}" height="${qrSettings.size}"></canvas>
              <script>
                // Copy canvas content
                const originalCanvas = window.opener.document.querySelector('canvas');
                const printCanvas = document.getElementById('qrCanvas');
                const ctx = printCanvas.getContext('2d');
                ctx.drawImage(originalCanvas, 0, 0);
                window.print();
              </script>
            </body>
          </html>
        `);
      }
    } else {
      console.log('Bulk print not implemented yet');
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">📱 QR Kod Oluşturucu</h4>
          <p className="text-muted mb-0">Asset'lar için QR kod oluşturun ve yazdırın</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={printQRCodes}
            disabled={activeTab === 'single' ? !previewAsset : selectedAssets.length === 0}
          >
            <i className="bi bi-printer me-1"></i>
            Yazdır
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={activeTab === 'single' ? generateSingleQR : generateBulkQR}
            disabled={loading || (activeTab === 'single' ? !previewAsset : selectedAssets.length === 0)}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <i className="bi bi-download me-1"></i>
                {activeTab === 'single' ? 'İndir' : `Toplu İndir (${selectedAssets.length})`}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-center">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${activeTab === 'single' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('single')}
              >
                <i className="bi bi-qr-code me-2"></i>
                Tekil QR Kod
              </button>
              <button
                type="button"
                className={`btn ${activeTab === 'bulk' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('bulk')}
              >
                <i className="bi bi-grid-3x3 me-2"></i>
                Toplu QR Kod
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Panel - Asset Selection */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0 fw-bold">
                {activeTab === 'single' ? '📦 Asset Seç' : '📦 Assetları Seç'}
              </h6>
            </div>
            <div className="card-body">
              {/* Search */}
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Asset ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Bulk selection header */}
              {activeTab === 'bulk' && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                      onChange={handleSelectAll}
                    />
                    <label className="form-check-label small">
                      Tümünü Seç ({selectedAssets.length} seçili)
                    </label>
                  </div>
                </div>
              )}

              {/* Asset List */}
              <div className="asset-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {loading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" />
                    <p className="mt-2 text-muted small">Yükleniyor...</p>
                  </div>
                ) : filteredAssets.length === 0 ? (
                  <div className="text-center py-3">
                    <i className="bi bi-inbox text-muted fs-4"></i>
                    <p className="text-muted small mt-2">Asset bulunamadı</p>
                  </div>
                ) : (
                  filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className={`card mb-2 cursor-pointer ${
                        selectedAssets.includes(asset.id) ? 'border-primary bg-primary bg-opacity-10' : 'border-light'
                      }`}
                      onClick={() => handleAssetSelect(asset.id)}
                    >
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center">
                          {activeTab === 'bulk' && (
                            <div className="form-check me-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedAssets.includes(asset.id)}
                                onChange={() => handleAssetSelect(asset.id)}
                              />
                            </div>
                          )}
                          <div 
                            className="rounded p-2 me-3 flex-shrink-0"
                            style={{ 
                              backgroundColor: `${asset.category?.color || '#6c757d'}20`, 
                              color: asset.category?.color || '#6c757d' 
                            }}
                          >
                            <i className={`${asset.category?.icon || 'bi bi-box'}`}></i>
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <h6 className="mb-1 text-truncate">{asset.name}</h6>
                            <p className="text-muted small mb-0">{asset.assetNumber}</p>
                            <p className="text-muted small mb-0">{asset.category?.name || 'Kategori Yok'}</p>
                          </div>
                          {asset.qrCodeUrl && (
                            <i className="bi bi-qr-code text-success"></i>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - QR Settings & Preview */}
        <div className="col-lg-8">
          <div className="row g-4">
            {/* QR Settings */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0">
                  <h6 className="mb-0 fw-bold">⚙️ QR Ayarları</h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small">Boyut</label>
                      <div className="d-flex align-items-center">
                        <input
                          type="range"
                          className="form-range flex-grow-1 me-3"
                          min="128"
                          max="512"
                          step="32"
                          value={qrSettings.size}
                          onChange={(e) => setQrSettings(prev => ({ ...prev, size: Number(e.target.value) }))}
                        />
                        <span className="small text-muted">{qrSettings.size}px</span>
                      </div>
                    </div>

                    <div className="col-6">
                      <label className="form-label small">Arka Plan</label>
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={qrSettings.backgroundColor}
                        onChange={(e) => setQrSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      />
                    </div>

                    <div className="col-6">
                      <label className="form-label small">Ön Plan</label>
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={qrSettings.foregroundColor}
                        onChange={(e) => setQrSettings(prev => ({ ...prev, foregroundColor: e.target.value }))}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small">Format</label>
                      <select
                        className="form-select"
                        value={qrSettings.format}
                        onChange={(e) => setQrSettings(prev => ({ ...prev, format: e.target.value as QRSettings['format'] }))}
                      >
                        <option value="PNG">PNG</option>
                        <option value="SVG">SVG</option>
                        <option value="PDF">PDF</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small">Hata Düzeltme</label>
                      <select
                        className="form-select"
                        value={qrSettings.errorCorrectionLevel}
                        onChange={(e) => setQrSettings(prev => ({ ...prev, errorCorrectionLevel: e.target.value as QRSettings['errorCorrectionLevel'] }))}
                      >
                        <option value="L">Düşük (7%)</option>
                        <option value="M">Orta (15%)</option>
                        <option value="Q">Yüksek (25%)</option>
                        <option value="H">En Yüksek (30%)</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={qrSettings.includeText}
                          onChange={(e) => setQrSettings(prev => ({ ...prev, includeText: e.target.checked }))}
                        />
                        <label className="form-check-label small">
                          Asset numarası göster
                        </label>
                      </div>
                    </div>

                    {qrSettings.includeText && (
                      <>
                        <div className="col-8">
                          <label className="form-label small">Metin Pozisyonu</label>
                          <select
                            className="form-select"
                            value={qrSettings.textPosition}
                            onChange={(e) => setQrSettings(prev => ({ ...prev, textPosition: e.target.value as QRSettings['textPosition'] }))}
                          >
                            <option value="bottom">Alt</option>
                            <option value="top">Üst</option>
                            <option value="none">Gösterme</option>
                          </select>
                        </div>

                        <div className="col-4">
                          <label className="form-label small">Font Boyutu</label>
                          <input
                            type="number"
                            className="form-control"
                            min="8"
                            max="24"
                            value={qrSettings.fontSize}
                            onChange={(e) => setQrSettings(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                          />
                        </div>
                      </>
                    )}

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={qrSettings.includeLogo}
                          onChange={(e) => setQrSettings(prev => ({ ...prev, includeLogo: e.target.checked }))}
                        />
                        <label className="form-check-label small">
                          Şirket logosu ekle
                        </label>
                      </div>
                    </div>

                    {/* Bulk specific settings */}
                    {activeTab === 'bulk' && (
                      <>
                        <hr />
                        <div className="col-12">
                          <label className="form-label small fw-bold">Toplu Ayarlar</label>
                        </div>

                        <div className="col-12">
                          <label className="form-label small">Çıktı Formatı</label>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="bulkFormat"
                              checked={bulkSettings.format === 'individual'}
                              onChange={() => setBulkSettings(prev => ({ ...prev, format: 'individual' }))}
                            />
                            <label className="form-check-label small">
                              Ayrı dosyalar
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="bulkFormat"
                              checked={bulkSettings.format === 'sheet'}
                              onChange={() => setBulkSettings(prev => ({ ...prev, format: 'sheet' }))}
                            />
                            <label className="form-check-label small">
                              Tek sayfa (Grid)
                            </label>
                          </div>
                        </div>

                        {bulkSettings.format === 'sheet' && (
                          <div className="col-12">
                            <label className="form-label small">Grid Düzeni</label>
                            <select
                              className="form-select"
                              value={bulkSettings.sheetLayout}
                              onChange={(e) => setBulkSettings(prev => ({ ...prev, sheetLayout: e.target.value as BulkQRData['sheetLayout'] }))}
                            >
                              <option value="2x2">2x2 (4 QR/sayfa)</option>
                              <option value="3x3">3x3 (9 QR/sayfa)</option>
                              <option value="4x4">4x4 (16 QR/sayfa)</option>
                              <option value="5x5">5x5 (25 QR/sayfa)</option>
                            </select>
                          </div>
                        )}

                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={bulkSettings.includeAssetInfo}
                              onChange={(e) => setBulkSettings(prev => ({ ...prev, includeAssetInfo: e.target.checked }))}
                            />
                            <label className="form-check-label small">
                              Asset bilgilerini dahil et
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* QR Preview */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0">
                  <h6 className="mb-0 fw-bold">👁️ Önizleme</h6>
                </div>
                <div className="card-body text-center">
                  {activeTab === 'single' ? (
                    previewAsset ? (
                      <div>
                        <div className="mb-3">
                          <canvas
                            ref={canvasRef}
                            width={qrSettings.size}
                            height={qrSettings.size + (qrSettings.includeText ? 30 : 0)}
                            className="border rounded"
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </div>
                        <div className="text-center">
                          <h6 className="fw-bold">{previewAsset.name}</h6>
                          <p className="text-muted small mb-1">Asset No: {previewAsset.assetNumber}</p>
                          <p className="text-muted small mb-0">Seri No: {previewAsset.serialNumber}</p>
                          <span className="badge bg-light text-dark mt-2">
                            {previewAsset.category?.name || 'Kategori Yok'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-5">
                        <i className="bi bi-qr-code text-muted fs-1"></i>
                        <p className="text-muted mt-2">Önizleme için asset seçin</p>
                      </div>
                    )
                  ) : (
                    <div className="py-4">
                      <i className="bi bi-grid-3x3 text-muted fs-1"></i>
                      <p className="text-muted mt-2">Toplu QR Kod</p>
                      <p className="fw-bold text-primary">{selectedAssets.length} asset seçili</p>
                      <div className="small text-muted">
                        Format: {bulkSettings.format === 'individual' ? 'Ayrı Dosyalar' : `Grid ${bulkSettings.sheetLayout}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card border-0 shadow-sm mt-3">
                <div className="card-header bg-transparent border-0">
                  <h6 className="mb-0 fw-bold">⚡ Hızlı İşlemler</h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        setQrSettings(prev => ({ ...prev, size: 256, backgroundColor: '#FFFFFF', foregroundColor: '#000000' }));
                      }}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Varsayılan Ayarlar
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        if (previewAsset) generateQRPreview(previewAsset);
                      }}
                      disabled={!previewAsset}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Önizlemeyi Yenile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
     
    </div>
  );
};

export default QRGenerator;