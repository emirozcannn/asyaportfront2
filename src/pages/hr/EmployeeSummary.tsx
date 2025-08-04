import React from 'react';

const EmployeeSummary: React.FC = () => {
  return (
    <div className="employee-summary-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Personel Zimmet Özeti</h2>
        <p className="text-muted">Personellerin zimmet özetlerini görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .employee-summary-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default EmployeeSummary;
