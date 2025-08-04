import React from 'react';

const AssetCategories: React.FC = () => {
  return (
    <div className="asset-categories-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Zimmet Kategorileri</h2>
        <p className="text-muted">Zimmet kategorilerini yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .asset-categories-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default AssetCategories;
