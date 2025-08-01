
import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../api/supabaseUsers';
import { fetchDepartments } from '../api/supabaseDepartments';
import type { User } from '../types/User';
import type { Department } from '../types/Department';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [usersData, departmentsData] = await Promise.all([
          fetchUsers(),
          fetchDepartments()
        ]);
        setUsers(usersData);
        setDepartments(departmentsData);
      } catch (err) {
        setError('Kullanıcılar veya bölümler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ minHeight: '100vh', marginLeft: 220, background: 'none', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div className="card border-0 shadow-lg modern-card p-4 mb-4 w-100" style={{ borderRadius: 22, maxWidth: 1000, margin: '40px auto 0 auto' }}>
        <h2 className="mb-4 text-center">Kullanıcılar</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="table-responsive" style={{ maxHeight: '75vh', overflowY: 'auto', overflowX: 'auto' }}>
          <table className="table table-hover align-middle text-center mb-0 w-100" style={{ minWidth: 0 }}>
            <thead className="align-middle">
              <tr>
                <th className="text-center">#</th>
                <th className="text-center">Ad</th>
                <th className="text-center">Soyad</th>
                <th className="text-center">Email</th>
                <th className="text-center">Çalışan No</th>
                <th className="text-center">Bölüm</th>
                <th className="text-center">Rol</th>
                <th className="text-center">Oluşturulma Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center">Yükleniyor...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} className="text-center">Kayıt yok</td></tr>
              ) : (
                users.map((u, i) => (
                  <tr key={u.id}>
                    <td className="text-center">{i + 1}</td>
                    <td className="text-center">{u.first_name}</td>
                    <td className="text-center">{u.last_name}</td>
                    <td className="text-center">{u.email}</td>
                    <td className="text-center">{u.employee_number}</td>
                    <td className="text-center">{departments.find(d => d.id === u.department_id)?.name || '-'}</td>
                    <td className="text-center">{u.role}</td>
                    <td className="text-center">{u.created_at ? new Date(u.created_at).toLocaleDateString('tr-TR') : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
