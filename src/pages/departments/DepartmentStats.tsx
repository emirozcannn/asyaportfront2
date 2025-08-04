import React from 'react';

const DepartmentStats: React.FC = () => {
  return (
    <div className="department-stats-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Departman İstatistikleri</h2>
        <p className="text-muted">Departman performans istatistikleri</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .department-stats-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default DepartmentStats;
