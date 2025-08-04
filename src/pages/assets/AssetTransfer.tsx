import React from 'react';

const AssetTransfer: React.FC = () => {
  return (
    <div className="asset-transfer-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Zimmet Transferi</h2>
        <p className="text-muted">Zimmet transfer işlemleri</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .asset-transfer-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default AssetTransfer;
