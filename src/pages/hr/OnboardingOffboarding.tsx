import React from 'react';

const OnboardingOffboarding: React.FC = () => {
  return (
    <div className="onboarding-offboarding-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Giriş/Çıkış İşlemleri</h2>
        <p className="text-muted">Personel giriş ve çıkış işlemlerini yönetin</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .onboarding-offboarding-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default OnboardingOffboarding;
