import React from 'react';

const LeaveManagement: React.FC = () => {
  return (
    <div className="leave-management-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">İzin/Tatil Yönetimi</h2>
        <p className="text-muted">Personel izin ve tatil işlemlerini yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .leave-management-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default LeaveManagement;
