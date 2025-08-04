import React from 'react';

const CategoryMapping: React.FC = () => {
  return (
    <div className="category-mapping-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Kategori-Departman Eşleştirme</h2>
        <p className="text-muted">Kategori ve departman eşleştirmelerini yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .category-mapping-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default CategoryMapping;
