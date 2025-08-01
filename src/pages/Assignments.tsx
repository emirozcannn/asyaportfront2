import React from 'react';
import Layout from '../components/Layout';

const Assignments: React.FC = () => {
  // Burada gerçek veri ile doldurulacak örnek zimmet listesi
  const assignments = [
    { id: 1, user: 'Ahmet Yılmaz', asset: 'HP ProDesk 400', date: '2025-07-20', status: 'Aktif' },
    { id: 2, user: 'Ayşe Demir', asset: 'Dell P2422H Monitor', date: '2025-07-18', status: 'İade Edildi' },
  ];

  return (
    <Layout pageTitle="Zimmetler">
      <div className="card p-4 shadow-sm">
        <h2 className="mb-4">Zimmet Listesi</h2>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kullanıcı</th>
              <th>Varlık</th>
              <th>Tarih</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.user}</td>
                <td>{a.asset}</td>
                <td>{a.date}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Assignments;
