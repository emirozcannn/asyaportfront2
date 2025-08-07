import React, { useState, useEffect } from 'react';
import {
  getAllDepartments,
  deleteDepartment,
  updateDepartment,
  getDepartmentStats
} from '../../api/departments';
import type { Department, UpdateDepartmentDto, DepartmentStats } from '../../api/departments';
import { AddDepartment } from './AddDepartment';

export const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'code' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load departments and stats
  const loadDepartments = async () => {
    try {
      setIsLoading(true);
      const [departmentsData, statsData] = await Promise.all([
        getAllDepartments(),
        getDepartmentStats()
      ]);
      setDepartments(departmentsData);
      setStats(statsData);
      setError('');
    } catch (error) {
      console.error('Error loading departments:', error);
      setError('Departmanlar yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Filter and sort departments
  const filteredAndSortedDepartments = departments
    .filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'createdAt') {
        return (new Date(aValue).getTime() - new Date(bValue).getTime()) * multiplier;
      }
      return aValue.localeCompare(bValue) * multiplier;
    });

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" departmanını silmek istediğinizden emin misiniz?`)) {
      return;
    }
    try {
      const result = await deleteDepartment(id);
      if (result.success) {
        await loadDepartments();
        showAlert('Departman başarıyla silindi', 'success');
      } else {
        showAlert(result.message, 'danger');
      }
    } catch (error) {
      showAlert('Departman silinemedi', 'danger');
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
  };

  const handleUpdateSubmit = async (updatedData: UpdateDepartmentDto) => {
    if (!editingDepartment) return;
    try {
      await updateDepartment(editingDepartment.id, updatedData);
      setEditingDepartment(null);
      await loadDepartments();
      showAlert('Departman başarıyla güncellendi', 'success');
    } catch (error) {
      showAlert('Departman güncellenemedi', 'danger');
    }
  };

  const handleSort = (field: 'name' | 'code' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const showAlert = (message: string, type: 'success' | 'danger' | 'info' = 'info') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      if (alertDiv.parentNode) alertDiv.remove();
    }, 4000);
  };

  if (isLoading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary mb-3" style={{ width: '4rem', height: '4rem' }}></div>
          <h4 className="text-muted">Departmanlar yükleniyor...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <a href="#" className="text-decoration-none text-primary">
                  <i className="bi bi-house-door me-1"></i>
                  Ana Sayfa
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Departmanlar</li>
            </ol>
          </nav>
          <div className="d-flex align-items-center mb-2">
            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
              <i className="bi bi-building text-primary fs-4"></i>
            </div>
            <div>
              <h2 className="mb-0 fw-bold text-dark">Departman Yönetimi</h2>
              <p className="text-muted mb-0 fs-6">Sistemdeki departmanları görüntüleyin ve yönetin</p>
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-lg d-flex align-items-center"
          >
            <i className="bi bi-plus-lg me-2"></i>
            Departman Ekle
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-2 d-inline-block">
                  <i className="bi bi-building text-primary fs-4"></i>
                </div>
                <h5 className="fw-bold mb-1">{stats.totalDepartments}</h5>
                <p className="text-muted mb-0">Toplam Departman</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 mb-2 d-inline-block">
                  <i className="bi bi-star text-success fs-4"></i>
                </div>
                <h5 className="fw-bold mb-1">{stats.latestDepartment?.name || 'N/A'}</h5>
                <p className="text-muted mb-0">Son Departman</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 mb-2 d-inline-block">
                  <i className="bi bi-calendar text-info fs-4"></i>
                </div>
                <h5 className="fw-bold mb-1">{stats.averageDepartmentsPerMonth}</h5>
                <p className="text-muted mb-0">Aylık Ortalama</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3 mb-2 d-inline-block">
                  <i className="bi bi-tags text-warning fs-4"></i>
                </div>
                <h6 className="fw-bold mb-1">{stats.departmentCodes.join(', ')}</h6>
                <p className="text-muted mb-0">Departman Kodları</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-6 col-lg-4">
          <div className="input-group">
            <span className="input-group-text bg-transparent border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Departman ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
              <i className="bi bi-list-ul text-primary"></i>
            </div>
            <h5 className="mb-0 fw-bold text-dark">Departman Listesi</h5>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th
                    className="cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Ad {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="cursor-pointer"
                    onClick={() => handleSort('code')}
                  >
                    Kod {sortBy === 'code' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    Oluşturulma Tarihi {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedDepartments.map((department) => (
                  <tr key={department.id}>
                    <td>
                      <div className="fw-bold">{department.name}</div>
                    </td>
                    <td>
                      <span className="badge bg-primary">{department.code}</span>
                    </td>
                    <td>
                      {new Date(department.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEdit(department)}
                        >
                          <i className="bi bi-pencil"></i> Düzenle
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(department.id, department.name)}
                        >
                          <i className="bi bi-trash"></i> Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAndSortedDepartments.length === 0 && (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-1"></i>
                <div>Departman bulunamadı</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <AddDepartment
          isModal={true}
          onSuccess={() => {
            setShowAddModal(false);
            loadDepartments();
          }}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Department Modal */}
      {editingDepartment && (
        <EditDepartmentModal
          department={editingDepartment}
          onSubmit={handleUpdateSubmit}
          onCancel={() => setEditingDepartment(null)}
        />
      )}
    </div>
  );
};

// Edit Department Modal Component
interface EditDepartmentModalProps {
  department: Department;
  onSubmit: (data: UpdateDepartmentDto) => void;
  onCancel: () => void;
}

const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({
  department,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<UpdateDepartmentDto>({
    name: department.name,
    code: department.code
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(formData);
    setIsLoading(false);
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-pencil me-2"></i>
              Departmanı Düzenle
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-medium">Departman Adı <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Departman Kodu <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  maxLength={4}
                  required
                />
              </div>
            </div>
            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                <i className="bi bi-x-lg me-1"></i>
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i>
                    Güncelle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Departments;