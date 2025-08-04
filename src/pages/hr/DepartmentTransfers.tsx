import React from 'react';

const DepartmentTransfers: React.FC = () => {
  return (
    <div className="department-transfers-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Departman Transferleri</h2>
        <p className="text-muted">Personel departman transfer işlemlerini yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .department-transfers-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default DepartmentTransfers;
