import React from 'react';

const ServiceRequests: React.FC = () => {
  return (
    <div className="service-requests-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Servis Talepleri</h2>
        <p className="text-muted">Zimmet servis taleplerini yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .service-requests-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default ServiceRequests;
