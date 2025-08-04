// src/pages/users/RolePermissions.tsx
import React, { useState } from 'react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  permissions: string[];
}

const RolePermissions: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Mock permissions data
  const permissions: Permission[] = [
    // Kullanıcı Yönetimi
    { id: 'user.view', name: 'Kullanıcı Görüntüleme', description: 'Kullanıcı listesini görüntüleme', category: 'Kullanıcı Yönetimi' },
    { id: 'user.create', name: 'Kullanıcı Oluşturma', description: 'Yeni kullanıcı ekleme', category: 'Kullanıcı Yönetimi' },
    { id: 'user.edit', name: 'Kullanıcı Düzenleme', description: 'Kullanıcı bilgilerini güncelleme', category: 'Kullanıcı Yönetimi' },
    { id: 'user.delete', name: 'Kullanıcı Silme', description: 'Kullanıcıları sistemden kaldırma', category: 'Kullanıcı Yönetimi' },
    
    // Departman Yönetimi
    { id: 'dept.view', name: 'Departman Görüntüleme', description: 'Departman listesini görüntüleme', category: 'Departman Yönetimi' },
    { id: 'dept.create', name: 'Departman Oluşturma', description: 'Yeni departman ekleme', category: 'Departman Yönetimi' },
    { id: 'dept.edit', name: 'Departman Düzenleme', description: 'Departman bilgilerini güncelleme', category: 'Departman Yönetimi' },
    
    // Zimmet Yönetimi
    { id: 'asset.view', name: 'Zimmet Görüntüleme', description: 'Zimmet listesini görüntüleme', category: 'Zimmet Yönetimi' },
    { id: 'asset.create', name: 'Zimmet Oluşturma', description: 'Yeni zimmet ekleme', category: 'Zimmet Yönetimi' },
    { id: 'asset.assign', name: 'Zimmet Atama', description: 'Zimmet kullanıcılara atama', category: 'Zimmet Yönetimi' },
    { id: 'asset.transfer', name: 'Zimmet Transfer', description: 'Zimmet transferi yapma', category: 'Zimmet Yönetimi' },
    
    // Sistem Yönetimi
    { id: 'system.settings', name: 'Sistem Ayarları', description: 'Sistem ayarlarını değiştirme', category: 'Sistem Yönetimi' },
    { id: 'system.backup', name: 'Yedekleme', description: 'Sistem yedeklemesi yapma', category: 'Sistem Yönetimi' },
    { id: 'system.logs', name: 'Log Görüntüleme', description: 'Sistem loglarını görüntüleme', category: 'Sistem Yönetimi' },
  ];

  // Mock roles data
  const roles: Role[] = [
    {
      id: '1',
      name: 'SuperAdmin',
      displayName: '🔧 Süper Yönetici',
      permissions: permissions.map(p => p.id) // Tüm yetkiler
    },
    {
      id: '2', 
      name: 'Admin',
      displayName: '⚡ Sistem Yöneticisi',
      permissions: ['user.view', 'user.create', 'user.edit', 'dept.view', 'dept.create', 'asset.view', 'asset.create', 'asset.assign']
    },
    {
      id: '3',
      name: 'DepartmentAdmin', 
      displayName: '👥 Departman Yöneticisi',
      permissions: ['user.view', 'dept.view', 'asset.view', 'asset.assign']
    },
    {
      id: '4',
      name: 'User',
      displayName: '👤 Kullanıcı',
      permissions: ['asset.view']
    }
  ];

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handlePermissionToggle = (permissionId: string) => {
    if (!selectedRoleData) return;
    
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      console.log(`Toggle permission ${permissionId} for role ${selectedRole}`);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">🔑 Rol Yetkileri</h4>
          <p className="text-muted mb-0">Rollerin sistem yetkilerini yönet</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <i className="bi bi-save me-1"></i>
          Değişiklikleri Kaydet
        </button>
      </div>

      <div className="row g-4">
        {/* Rol Seçimi */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-shield me-2 text-primary"></i>
                Rol Seçin
              </h6>
            </div>
            <div className="card-body">
              <div className="list-group">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    className={`list-group-item list-group-item-action d-flex align-items-center ${
                      selectedRole === role.id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className="flex-grow-1">
                      <div className="fw-medium">{role.displayName}</div>
                      <small className="text-muted">
                        {role.permissions.length} yetki
                      </small>
                    </div>
                    {selectedRole === role.id && (
                      <i className="bi bi-check-lg text-white"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Yetki Listesi */}
        <div className="col-lg-9">
          {selectedRoleData ? (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-semibold">
                    <i className="bi bi-key me-2 text-success"></i>
                    {selectedRoleData.displayName} Yetkileri
                  </h6>
                  <span className="badge bg-primary">
                    {selectedRoleData.permissions.length} / {permissions.length} yetki
                  </span>
                </div>
              </div>
              <div className="card-body">
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                  <div key={category} className="mb-4">
                    <h6 className="fw-semibold text-primary mb-3">
                      <i className="bi bi-folder me-2"></i>
                      {category}
                    </h6>
                    <div className="row g-3">
                      {categoryPermissions.map((permission) => {
                        const hasPermission = selectedRoleData.permissions.includes(permission.id);
                        return (
                          <div key={permission.id} className="col-lg-6">
                            <div className={`card h-100 ${hasPermission ? 'border-success' : 'border-light'}`}>
                              <div className="card-body p-3">
                                <div className="d-flex align-items-start justify-content-between">
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center mb-2">
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={hasPermission}
                                          onChange={() => handlePermissionToggle(permission.id)}
                                          disabled={loading}
                                        />
                                      </div>
                                      <label className="fw-medium ms-2">{permission.name}</label>
                                    </div>
                                    <p className="text-muted mb-0 small">
                                      {permission.description}
                                    </p>
                                  </div>
                                  {hasPermission && (
                                    <span className="badge bg-success ms-2">Aktif</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <div className="text-muted mb-3">
                  <i className="bi bi-shield-exclamation fs-1"></i>
                </div>
                <h6 className="text-muted">Rol Seçin</h6>
                <p className="text-muted">
                  Yetkileri görüntülemek için sol taraftan bir rol seçin
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolePermissions;