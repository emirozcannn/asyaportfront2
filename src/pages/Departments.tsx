import React, { useState } from 'react';

interface Department {
  id: string;
  name: string;
  description?: string;
  manager?: string;
  userCount?: number;
}

const mockDepartments: Department[] = [
  { id: '1', name: 'Operasyon Departmanı', description: 'Saha operasyonları', manager: 'Ahmet Yılmaz', userCount: 12 },
  { id: '2', name: 'Teknik Departman', description: 'Teknik işler', manager: 'Mehmet Kaya', userCount: 8 },
  { id: '3', name: 'Bilgi İşlem Departmanı', description: 'IT ve yazılım', manager: 'Fatma Kara', userCount: 5 },
  { id: '4', name: 'Planlama Departmanı', description: 'Planlama ve analiz', manager: 'Ali Demir', userCount: 7 },
  { id: '5', name: 'İnsan Kaynakları Departmanı', description: 'Personel işleri', manager: 'Ayşe Güneş', userCount: 4 },
];

const Departments: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = mockDepartments.filter(d =>
    (d.name + (d.description || '') + (d.manager || '')).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="departments-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Departmanlar</h2>
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4">
            <input
              type="text"
              className="form-control"
              placeholder="Departman ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
            />
          </div>
        </div>
        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
          <div className="card-body p-0">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Departman</th>
                  <th>Açıklama</th>
                  <th>Yönetici</th>
                  <th>Kullanıcı Sayısı</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id}>
                    <td>{d.name}</td>
                    <td>{d.description}</td>
                    <td>{d.manager}</td>
                    <td>
                      <span className="badge bg-primary">{d.userCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>{`
        .departments-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .card { transition: all 0.3s ease; }
        .card:hover { transform: translateY(-2px); }
        .table > tbody > tr:hover { background-color: #f8f9fa !important; }
        .form-control:focus { border-color: #86b7fe; box-shadow: 0 0 0 0.25rem rgba(13,110,253,0.25); }
        .badge { font-weight: 500; letter-spacing: 0.025em; }
      `}</style>
    </div>
  );
};

export default Departments;
