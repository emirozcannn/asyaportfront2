import React from 'react';

const AllAssets: React.FC = () => {
  return (
    <div className="all-assets-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Tüm Zimmetler</h2>
        <p className="text-muted">Sistemdeki tüm zimmet öğelerini görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .all-assets-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default AllAssets;
