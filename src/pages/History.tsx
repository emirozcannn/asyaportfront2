import React from 'react';
import Layout from '../components/Layout';

const History: React.FC = () => {
  // Örnek veri
  const history = [
    { id: 1, user: 'Ahmet Yılmaz', asset: 'HP ProDesk 400', action: 'Zimmetlendi', date: '2025-07-20' },
    { id: 2, user: 'Ayşe Demir', asset: 'Dell P2422H Monitor', action: 'İade Edildi', date: '2025-07-22' },
  ];

  return (
    <Layout pageTitle="Zimmet Geçmişi">
      <div className="card p-4 shadow-sm">
        <h2 className="mb-4">Zimmet Geçmişi</h2>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kullanıcı</th>
              <th>Varlık</th>
              <th>İşlem</th>
              <th>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {history.map(h => (
              <tr key={h.id}>
                <td>{h.id}</td>
                <td>{h.user}</td>
                <td>{h.asset}</td>
                <td>{h.action}</td>
                <td>{h.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default History;
