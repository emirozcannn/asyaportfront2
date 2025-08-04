import React from 'react';

const LocationMap: React.FC = () => {
  return (
    <div className="location-map-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Lokasyon Haritası</h2>
        <p className="text-muted">Zimmet lokasyonlarını harita üzerinde görüntüleyin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .location-map-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default LocationMap;
