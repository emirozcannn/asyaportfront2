import React from 'react';

const EmailTemplates: React.FC = () => {
  return (
    <div className="email-templates-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">E-posta Şablonları</h2>
        <p className="text-muted">E-posta şablonlarını yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .email-templates-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default EmailTemplates;
