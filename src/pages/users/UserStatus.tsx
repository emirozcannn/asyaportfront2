// src/pages/users/UserStatus.tsx
import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/users/getAllUsers';

interface User {
  id: string;
  fullName: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin?: string;
  department?: {
    name: string;
  };
}

const UserStatus: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await getAllUsers();
      // Mock status data
      const usersWithStatus = usersData.map(user => ({
        ...user,
        status: Math.random() > 0.8 ? 'Inactive' : Math.random() > 0.9 ? 'Suspended' : 'Active'
      })) as User[];
      setUsers(usersWithStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kullanıcılar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus as 'Active' | 'Inactive' | 'Suspended' }
          : user
      ));
      
      console.log(`User ${userId} status changed to ${newStatus}`);
    } catch (error) {
      alert('Durum değiştirilirken hata oluştu');
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedUsers.length === 0) {
      alert('Lütfen kullanıcı seçin');
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.map(user => 
        selectedUsers.includes(user.id)
          ? { ...user, status: newStatus as 'Active' | 'Inactive' | 'Suspended' }
          : user
      ));
      
      setSelectedUsers([]);
      alert(`${selectedUsers.length} kullanıcının durumu ${newStatus} olarak değiştirildi`);
    } catch (error) {
      alert('Toplu durum değişikliği başarısız');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesStatus = !statusFilter || user.status === statusFilter;
    const matchesSearch = !searchTerm || 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success';
      case 'Inactive': return 'bg-secondary';
      case 'Suspended': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return 'bi-check-circle';
      case 'Inactive': return 'bi-pause-circle';
      case 'Suspended': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  };

  const statusCounts = {
    Active: users.filter(u => u.status === 'Active').length,
    Inactive: users.filter(u => u.status === 'Inactive').length,
    Suspended: users.filter(u => u.status === 'Suspended').length,
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">🔘 Aktif/Pasif Durumu</h4>
          <p className="text-muted mb-0">Kullanıcı durumlarını yönet</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success btn-sm" disabled={selectedUsers.length === 0}
                  onClick={() => handleBulkStatusChange('Active')}>
            <i className="bi bi-check-circle me-1"></i>
            Aktif Yap ({selectedUsers.length})
          </button>
          <button className="btn btn-outline-secondary btn-sm" disabled={selectedUsers.length === 0}
                  onClick={() => handleBulkStatusChange('Inactive')}>
            <i className="bi bi-pause-circle me-1"></i>
            Pasif Yap ({selectedUsers.length})
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-success bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success rounded-circle p-2 me-3">
                  <i className="bi bi-check-circle text-white"></i>
                </div>
                <div>
                  <h6 className="mb-0">Aktif Kullanıcılar</h6>
                  <h4 className="mb-0 text-success">{statusCounts.Active}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-secondary bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-secondary rounded-circle p-2 me-3">
                  <i className="bi bi-pause-circle text-white"></i>
                </div>
                <div>
                  <h6 className="mb-0">Pasif Kullanıcılar</h6>
                  <h4 className="mb-0 text-secondary">{statusCounts.Inactive}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-danger bg-opacity-10">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-danger rounded-circle p-2 me-3">
                  <i className="bi bi-x-circle text-white"></i>
                </div>
                <div>
                  <h6 className="mb-0">Askıdaki Kullanıcılar</h6>
                  <h4 className="mb-0 text-danger">{statusCounts.Suspended}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tüm Durumlar</option>
                <option value="Active">Aktif</option>
                <option value="Inactive">Pasif</option>
                <option value="Suspended">Askıda</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-primary w-100" onClick={loadUsers}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                Yenile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0">
          <div className="d-flex align-items-center">
            <div className="form-check me-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                onChange={handleSelectAll}
              />
            </div>
            <span className="fw-medium">
              {filteredUsers.length} kullanıcı 
              {selectedUsers.length > 0 && ` (${selectedUsers.length} seçili)`}
            </span>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2 text-muted">Yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <i className="bi bi-exclamation-triangle fs-1 text-danger"></i>
              <p className="text-danger">{error}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Kullanıcı</th>
                    <th>E-posta</th>
                    <th>Departman</th>
                    <th>Mevcut Durum</th>
                    <th>Son Giriş</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelect(user.id)}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className={`bi ${getStatusIcon(user.status)} text-primary`}></i>
                          </div>
                          <div>
                            <div className="fw-medium">{user.fullName}</div>
                            <small className="text-muted">ID: {user.id.slice(0, 8)}...</small>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {user.department?.name || 'Atanmamış'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(user.status)}`}>
                          {user.status === 'Active' ? 'Aktif' : 
                           user.status === 'Inactive' ? 'Pasif' : 'Askıda'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('tr-TR') : 'Hiç'}
                        </small>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                  data-bs-toggle="dropdown">
                            Durum Değiştir
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button className="dropdown-item" 
                                      onClick={() => handleStatusChange(user.id, 'Active')}
                                      disabled={user.status === 'Active'}>
                                <i className="bi bi-check-circle me-2 text-success"></i>
                                Aktif Yap
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item"
                                      onClick={() => handleStatusChange(user.id, 'Inactive')}
                                      disabled={user.status === 'Inactive'}>
                                <i className="bi bi-pause-circle me-2 text-secondary"></i>
                                Pasif Yap
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item"
                                      onClick={() => handleStatusChange(user.id, 'Suspended')}
                                      disabled={user.status === 'Suspended'}>
                                <i className="bi bi-x-circle me-2 text-danger"></i>
                                Askıya Al
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStatus;