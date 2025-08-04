import React from 'react';

const LocationTransfer: React.FC = () => {
  return (
    <div className="location-transfer-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Lokasyon Transferi</h2>
        <p className="text-muted">Zimmet öğelerini farklı lokasyonlara transfer edin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .location-transfer-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default LocationTransfer;
