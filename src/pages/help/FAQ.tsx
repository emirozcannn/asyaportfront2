import React from 'react';

const FAQ: React.FC = () => {
  return (
    <div className="faq-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Sıkça Sorulan Sorular</h2>
        <p className="text-muted">Sık sorulan sorular ve cevapları</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .faq-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default FAQ;
