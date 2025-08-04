import React from 'react';

const MaintenanceCalendar: React.FC = () => {
  return (
    <div className="maintenance-calendar-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Bakım Takvimi</h2>
        <p className="text-muted">Zimmet bakım takvimini görüntüleyin ve yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .maintenance-calendar-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default MaintenanceCalendar;
