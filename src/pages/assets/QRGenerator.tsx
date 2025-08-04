import React from 'react';

const QRGenerator: React.FC = () => {
  return (
    <div className="qr-generator-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">QR Kod Oluşturucu</h2>
        <p className="text-muted">Zimmet öğeleri için QR kod oluşturun</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .qr-generator-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default QRGenerator;
