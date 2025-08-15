// src/pages/users/UsersPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserDetailModal from './UserDetailModal';

// Types
interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  employeeNumber: string;
  createdAt: string;
  status?: 'Active' | 'Inactive';
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Kullanıcıları fetch et
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Kullanıcılar yüklenirken hata oluştu:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      await axios.put(`/api/users/${updatedUser.id}`, updatedUser);
      setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
      setModalOpen(false);
    } catch (error) {
      console.error('Kullanıcı güncellenirken hata oluştu:', error);
    }
  };

  return (
    <div className="container-xxl py-5">
      <div className="row g-4">
        {users.map(user => (
          <div className="col-lg-4 col-md-6" key={user.id}>
            <div className="card shadow-sm border-0 rounded">
              <div className="card-body">
                <h5 className="card-title">{user.fullName}</h5>
                <p className="card-text">
                  <small className="text-muted">{user.email}</small>
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditUser(user)}
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Düzenle
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          show={modalOpen}
          user={selectedUser}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UsersPage;