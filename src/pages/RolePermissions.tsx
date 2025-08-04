// Bu dosya artık src/pages/users/RolePermissions.tsx'e taşınmıştır
// Lütfen src/pages/users/RolePermissions.tsx dosyasını kullanın
export { default } from './users/RolePermissions';
  role: string;
  permission: string;
  description: string;
}

const mockPermissions: RolePermission[] = [
  { role: 'Admin', permission: 'Kullanıcı Yönetimi', description: 'Kullanıcı ekleme, silme, düzenleme' },
  { role: 'Admin', permission: 'Departman Yönetimi', description: 'Departman ekleme, silme, düzenleme' },
  { role: 'ZimmetManager', permission: 'Zimmet İşlemleri', description: 'Zimmet ekleme, iade, transfer' },
  { role: 'Manager', permission: 'Raporlama', description: 'Rapor görüntüleme' },
  { role: 'Employee', permission: 'Profil Görüntüleme', description: 'Kendi profilini görüntüleme' },
];

const RolePermissions: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = mockPermissions.filter(p =>
    (p.role + p.permission + p.description).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="role-permissions-page">
      <div className="container-fluid px-4 py-4">
        <h2 className="mb-1 fw-bold text-dark">Rol Yetkileri</h2>
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
          <div className="card-body p-4">
            <input
              type="text"
              className="form-control"
              placeholder="Rol veya yetki ara..."
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
                  <th>Rol</th>
                  <th>Yetki</th>
                  <th>Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className={`badge bg-${p.role === 'Admin' ? 'danger' : p.role === 'ZimmetManager' ? 'primary' : p.role === 'Manager' ? 'warning' : 'secondary'}`}>
                        {p.role}
                      </span>
                    </td>
                    <td>{p.permission}</td>
                    <td>{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>{`
        .role-permissions-page {
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

export default RolePermissions;
