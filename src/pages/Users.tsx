import { fetchUsers, addUser, updateUser, deleteUser } from '../api/supabaseUsers';
import { fetchAssets } from '../api/supabaseAssets';
import { fetchAssignments, addAssignment, deleteAssignment } from '../api/supabaseAssetAssignments';
import { fetchDepartments } from '../api/supabaseDepartments';
import type { User } from '../types/User';
import type { Asset } from '../types/Asset';
import type { Department } from '../types/Department';
import React, { useState, useEffect } from 'react';

const emptyUser: Omit<User, 'id' | 'created_at'> = {
  employee_number: '',
  first_name: '',
  last_name: '',
  email: '',
  password_hash: '',
  department_id: '',
  role: '',
  is_active: true,
};

const Users: React.FC = () => {
  // Departmanlar için state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  // State tanımlamaları
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState<Omit<User, 'id' | 'created_at'>>(emptyUser);
  const [saving, setSaving] = useState(false);
  // Asset modal state
  const [assetModalUser, setAssetModalUser] = useState<User | null>(null);
  const [userAssets, setUserAssets] = useState<(Asset & { assignment_id: string })[]>([]);
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [assetLoading, setAssetLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');

  // Departmanları yükle
  const loadDepartments = async () => {
    setDepartmentsLoading(true);
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (err) {
      setError('Departmanlar yüklenemedi.');
    } finally {
      setDepartmentsLoading(false);
    }
  };

  // Kullanıcıları yükle
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err: any) {
      setError('Kullanıcılar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadDepartments();
  }, []);

  // Kullanıcıya zimmetli varlıkları yükle
  const openAssetModal = async (user: User) => {
    setAssetModalUser(user);
    setAssetLoading(true);
    setSelectedAssetId('');
    try {
      const [assets, assignments] = await Promise.all([
        fetchAssets(),
        fetchAssignments()
      ]);
      setAllAssets(assets);
      // Kullanıcıya zimmetli varlıklar: assignment ile eşleşen asset'ler
      const userAssetList = (assignments as { asset_id: string; assigned_to_id: string; id: string }[])
        .filter((a) => a.assigned_to_id === user.id)
        .map((assign) => {
          const asset = assets.find((as) => as.id === assign.asset_id);
          return asset ? { ...asset, assignment_id: assign.id } : null;
        })
        .filter(Boolean) as (Asset & { assignment_id: string })[];
      setUserAssets(userAssetList);
    } finally {
      setAssetLoading(false);
    }
  };

  const closeAssetModal = () => {
    setAssetModalUser(null);
    setUserAssets([]);
    setSelectedAssetId('');
  };

  // Kullanıcıya varlık ata (asset_assignments tablosuna kayıt ekle)
  const handleAssignAsset = async () => {
    if (!assetModalUser || !selectedAssetId) return;
    setAssigning(true);
    try {
      await addAssignment({ asset_id: selectedAssetId, assigned_to_id: assetModalUser.id });
      await openAssetModal(assetModalUser); // Yeniden yükle
      setSelectedAssetId('');
    } catch (err: any) {
      setError('Varlık atama işlemi başarısız: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setAssigning(false);
    }
  };

  // Kullanıcıdan zimmetli varlığı kaldır (asset_assignments tablosundan sil)
  const handleUnassignAsset = async (assignmentId: string) => {
    if (!assetModalUser) return;
    setAssigning(true);
    try {
      await deleteAssignment(assignmentId);
      await openAssetModal(assetModalUser); // Yeniden yükle
    } catch (err: any) {
      setError('Varlık zimmet kaldırma işlemi başarısız: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setAssigning(false);
    }
  };

  const handleOpenAdd = () => {
    setEditUser(null);
    setForm(emptyUser);
    setShowModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditUser(user);
    setForm({ ...user });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditUser(null);
    setForm(emptyUser);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editUser) {
        await updateUser(editUser.id, form);
      } else {
        await addUser(form);
      }
      await loadUsers();
      handleCloseModal();
    } catch (err: any) {
      setError('Kayıt işlemi başarısız.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`${user.first_name} ${user.last_name} adlı kullanıcı silinsin mi?`)) return;
    try {
      await deleteUser(user.id);
      await loadUsers();
    } catch {
      setError('Silme işlemi başarısız.');
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Kullanıcılar</h2>
        <button className="btn btn-success" onClick={handleOpenAdd}>
          Yeni Kullanıcı
        </button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle bg-white">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Ad</th>
              <th>Soyad</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Aktif</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="text-center">Yükleniyor...</td></tr>
            )}
            {!loading && users.length === 0 && (
              <tr><td colSpan={7} className="text-center">Kayıt yok</td></tr>
            )}
            {!loading && users.length > 0 && users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>{u.first_name}</td>
                <td>{u.last_name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.is_active ? 'Evet' : 'Hayır'}</td>
                <td>
                  <button className="btn btn-sm btn-info me-2" onClick={() => openAssetModal(u)}>Varlıklar</button>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleOpenEdit(u)}>Düzenle</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kullanıcıya zimmetli varlıklar modalı */}
      {assetModalUser && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{assetModalUser.first_name} {assetModalUser.last_name} - Zimmetli Varlıklar</h5>
                <button type="button" className="btn-close" onClick={closeAssetModal}></button>
              </div>
              <div className="modal-body">
                {assetLoading ? (
                  <div>Yükleniyor...</div>
                ) : (
                  <>
                    <table className="table table-bordered table-hover align-middle bg-white mb-4">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Ad</th>
                          <th>Seri No</th>
                          <th>Kategori</th>
                          <th>Durum</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {userAssets.length === 0 ? (
                          <tr><td colSpan={6} className="text-center">Zimmetli varlık yok</td></tr>
                        ) : (
                          userAssets.map((a, i) => (
                            <tr key={a.id}>
                              <td>{i + 1}</td>
                              <td>{a.name}</td>
                              <td>{a.serial_number}</td>
                              <td>{a.category}</td>
                              <td>{a.status}</td>
                              <td>
                                <button className="btn btn-sm btn-danger" disabled={assigning} onClick={() => handleUnassignAsset(a.assignment_id)}>Kaldır</button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <div className="mb-2 fw-bold">Yeni Varlık Ata</div>
                    <div className="d-flex gap-2 align-items-center">
                      <select className="form-select" style={{ maxWidth: 300 }} value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)}>
                        <option value="">Seçiniz</option>
                        {/* Atanmamış assetler: asset_assignments'ta olmayanlar */}
                        {allAssets.filter(a => !userAssets.some(ua => ua.id === a.id)).map(a => (
                          <option key={a.id} value={a.id}>{a.name} - {a.serial_number}</option>
                        ))}
                      </select>
                      <button className="btn btn-success" disabled={!selectedAssetId || assigning} onClick={handleAssignAsset}>Ata</button>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeAssetModal}>Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kullanıcı Ekleme/Düzenleme Modalı */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">{editUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Ad</label>
                    <input name="first_name" className="form-control" value={form.first_name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Soyad</label>
                    <input name="last_name" className="form-control" value={form.last_name} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select name="role" className="form-select" value={form.role} onChange={handleChange} required>
                      <option value="">Seçiniz</option>
                      <option value="Admin">Admin</option>
                      <option value="ZimmetManager">ZimmetManager</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Aktif</label>
                    <input name="is_active" type="checkbox" className="form-check-input ms-2" checked={form.is_active} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Çalışan No</label>
                    <input name="employee_number" className="form-control" value={form.employee_number} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Departman</label>
                    <select
                      name="department_id"
                      className="form-select"
                      value={form.department_id}
                      onChange={handleChange}
                      required
                      disabled={departmentsLoading}
                    >
                      <option value="">Seçiniz</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Şifre (hash)</label>
                    <input name="password_hash" type="password" className="form-control" value={form.password_hash} onChange={handleChange} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>İptal</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;