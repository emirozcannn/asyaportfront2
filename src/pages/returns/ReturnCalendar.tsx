import React from 'react';

const ReturnCalendar: React.FC = () => {
  return (
    <div className="return-calendar-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">İade Takvimleri</h2>
        <p className="text-muted">İade tarihlerini takvim görünümünde inceleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .return-calendar-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default ReturnCalendar;
