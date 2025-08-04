import React from 'react';

const BuildingManagement: React.FC = () => {
  return (
    <div className="building-management-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Bina/Kat Yönetimi</h2>
        <p className="text-muted">Bina ve kat bilgilerini yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .building-management-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default BuildingManagement;
