import React from 'react';

const AdminAssignment: React.FC = () => {
  return (
    <div className="admin-assignment-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Admin Atama</h2>
        <p className="text-muted">Departman yöneticilerini atayın</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .admin-assignment-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default AdminAssignment;
