import React from 'react';

const QRManagement: React.FC = () => {
  return (
    <div className="qr-management-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">QR Kod Yönetimi</h2>
        <p className="text-muted">QR kod oluşturma ve yönetim işlemleri</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .qr-management-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default QRManagement;
