import React from 'react';
import Layout from '../components/Layout';

const Reports: React.FC = () => {
  // Örnek veri
  const summary = [
    { label: 'Toplam Zimmetli Varlık', value: 42 },
    { label: 'İade Edilen Varlık', value: 8 },
    { label: 'Aktif Kullanıcı', value: 15 },
  ];

  return (
    <Layout pageTitle="Raporlar">
      <div className="card p-4 shadow-sm">
        <h2 className="mb-4">Raporlar</h2>
        <ul className="list-group">
          {summary.map((item, i) => (
            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
              {item.label}
              <span className="badge bg-primary rounded-pill">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Reports;
