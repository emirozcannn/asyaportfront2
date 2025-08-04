import React from 'react';

const UserGuide: React.FC = () => {
  return (
    <div className="user-guide-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Kullanıcı Rehberi</h2>
        <p className="text-muted">Adım adım kullanıcı rehberi ve yönergeler</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .user-guide-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default UserGuide;
