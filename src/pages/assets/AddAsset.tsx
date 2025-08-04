import React from 'react';

const AddAsset: React.FC = () => {
  return (
    <div className="add-asset-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Yeni Zimmet Ekle</h2>
        <p className="text-muted">Sisteme yeni zimmet öğesi ekleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .add-asset-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default AddAsset;
