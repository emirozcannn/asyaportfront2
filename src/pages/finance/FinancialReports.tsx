import React from 'react';

const FinancialReports: React.FC = () => {
  return (
    <div className="financial-reports-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Finansal Raporlar</h2>
        <p className="text-muted">Finansal raporları görüntüleyin ve analiz edin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .financial-reports-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default FinancialReports;
