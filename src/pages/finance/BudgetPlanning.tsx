import React from 'react';

const BudgetPlanning: React.FC = () => {
  return (
    <div className="budget-planning-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Bütçe Planlaması</h2>
        <p className="text-muted">Bütçe planlaması ve takibi yapın</p>
        {/* İçerik buraya gelecek */}
      </div>
      <style>{`
        .budget-planning-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `}</style>
    </div>
  );
};

export default BudgetPlanning;
