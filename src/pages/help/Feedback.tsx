import React from 'react';

const Feedback: React.FC = () => {
  return (
    <div className="feedback-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Geri Bildirim</h2>
        <p className="text-muted">Sistem hakkında görüş ve önerilerinizi paylaşın</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .feedback-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default Feedback;
