import React from 'react';

const StockStatus: React.FC = () => {
  return (
    <div className="stock-status-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Stok Durumu</h2>
        <p className="text-muted">Zimmet stok durumlarını görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .stock-status-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default StockStatus;
