import React from 'react';

const AssetReports: React.FC = () => {
  return (
    <div className="asset-reports-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Zimmet Raporları</h2>
        <p className="text-muted">Zimmet bazlı raporları görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .asset-reports-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default AssetReports;
