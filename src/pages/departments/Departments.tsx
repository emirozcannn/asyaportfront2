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
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed shadow-lg border-0`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.borderRadius = '12px';
    alertDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-${type === 'success' ? 'check-circle-fill' : type === 'danger' ? 'exclamation-triangle-fill' : 'info-circle-fill'} me-2"></i>
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      if (alertDiv.parentNode) alertDiv.remove();
    }, 4000);
  };

  if (isLoading) {
    return (
      <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
          <div className="card border-0 shadow-sm p-5 text-center" style={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <div className="spinner-border text-primary mb-4" style={{ width: '4rem', height: '4rem' }}></div>
            <h4 className="text-dark fw-bold mb-2">Departmanlar Yükleniyor...</h4>
            <p className="text-muted">Lütfen bekleyiniz</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-3">
                  <li className="breadcrumb-item">
                    <a href="#" className="text-decoration-none text-primary">
                      <i className="bi bi-house-door me-1"></i>
                      Ana Sayfa
                    </a>
                  </li>
                  <li className="breadcrumb-item active text-muted" aria-current="page">Departmanlar</li>
                </ol>
              </nav>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                  <i className="bi bi-building text-primary fs-4"></i>
                </div>
                <div>
                  <h2 className="mb-1 fw-bold text-dark">Departman Yönetimi</h2>
                  <p className="text-muted mb-0">Sistemdeki departmanları görüntüleyin ve yönetin</p>
                </div>
              </div>
            </div>
            <div>
            
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '8px', transition: 'all 0.3s ease' }}>
              <div className="card-body text-center p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-3 d-inline-block">
                  <i className="bi bi-building text-primary fs-3"></i>
                </div>
                <h3 className="fw-bold mb-2 text-primary">{stats.totalDepartments}</h3>
                <p className="text-muted mb-0 fw-medium">Toplam Departman</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100 hover-effect" style={{ borderRadius: '16px', transition: 'all 0.3s ease' }}>
              <div className="card-body text-center p-4">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 mb-3 d-inline-block">
                  <i className="bi bi-star text-success fs-3"></i>
                </div>
                <h6 className="fw-bold mb-2 text-success">{stats.latestDepartment?.name || 'N/A'}</h6>
                <p className="text-muted mb-0 fw-medium">Son Departman</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100 hover-effect" style={{ borderRadius: '16px', transition: 'all 0.3s ease' }}>
              <div className="card-body text-center p-4">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3 mb-3 d-inline-block">
                  <i className="bi bi-tags text-warning fs-3"></i>
                </div>
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-2">
                  {stats.departmentCodes.map((code, index) => (
                    <span key={index} className="badge bg-warning text-dark fw-semibold px-3 py-2" style={{ fontSize: '0.9rem', borderRadius: '8px' }}>
                      {code}
                    </span>
                  ))}
                </div>
                <p className="text-muted mb-0 fw-medium">Departman Kodları</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
            <div className="card-body p-3">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent"
                  placeholder="Departman ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ fontSize: '1rem' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
        <div className="card-header border-0 p-4" style={{ backgroundColor: '#ffffff', borderRadius: '8px 8px 0 0' }}>
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
              <i className="bi bi-list-ul text-primary fs-4"></i>
            </div>
            <h4 className="mb-0 fw-bold text-dark">Departman Listesi</h4>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th
                    className="text-dark fw-semibold cursor-pointer border-0 px-4 py-3"
                    onClick={() => handleSort('name')}
                    style={{ fontSize: '0.95rem' }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="bi bi-person-badge me-2"></i>
                      Departman Adı
                      {sortBy === 'name' && (
                        <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-2`}></i>
                      )}
                    </div>
                  </th>
                  <th
                    className="text-dark fw-semibold cursor-pointer border-0 px-4 py-3"
                    onClick={() => handleSort('code')}
                    style={{ fontSize: '0.95rem' }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="bi bi-tag me-2"></i>
                      Kod
                      {sortBy === 'code' && (
                        <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-2`}></i>
                      )}
                    </div>
                  </th>
                  <th
                    className="text-dark fw-semibold cursor-pointer border-0 px-4 py-3"
                    onClick={() => handleSort('createdAt')}
                    style={{ fontSize: '0.95rem' }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar-check me-2"></i>
                      Oluşturulma Tarihi
                      {sortBy === 'createdAt' && (
                        <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-2`}></i>
                      )}
                    </div>
                  </th>
                  <th className="text-dark fw-semibold border-0 px-4 py-3" style={{ fontSize: '0.95rem' }}>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-gear me-2"></i>
                      İşlemler
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedDepartments.map((department, index) => (
                  <tr key={department.id} className="border-0" style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-building text-primary"></i>
                        </div>
                        <div className="fw-semibold text-dark" style={{ fontSize: '1.05rem' }}>{department.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-primary px-3 py-2 fw-semibold" style={{ fontSize: '0.9rem', borderRadius: '8px' }}>
                        {department.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-calendar3 me-2"></i>
                        <span style={{ fontSize: '0.95rem' }}>
                          {new Date(department.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm shadow-sm"
                          onClick={() => handleEdit(department)}
                          style={{ borderRadius: '6px', padding: '8px 16px' }}
                        >
                          <i className="bi bi-pencil me-1"></i> Düzenle
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm shadow-sm"
                          onClick={() => handleDelete(department.id, department.name)}
                          style={{ borderRadius: '6px', padding: '8px 16px' }}
                        >
                          <i className="bi bi-trash me-1"></i> Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAndSortedDepartments.length === 0 && (
              <div className="text-center py-5 text-muted">
                                    <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '400px', borderRadius: '8px' }}>
                  <div className="card-body p-5">
                    <div className="bg-light rounded-circle p-4 mb-4 d-inline-block">
                      <i className="bi bi-inbox fs-1 text-muted"></i>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">Departman Bulunamadı</h5>
                    <p className="text-muted mb-0">Arama kriterlerinize uygun departman bulunmamaktadır.</p>
                  </div>
                </div>
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

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .cursor-pointer:hover {
          background-color: rgba(0,0,0,0.05) !important;
        }
        .table tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.08) !important;
          transition: all 0.2s ease;
        }
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(0,0,0,0.15);
        }
      `}</style>
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
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <div className="modal-header border-0 p-4 bg-primary">
            <h4 className="modal-title text-white fw-bold mb-0">
              <i className="bi bi-pencil me-3"></i>
              Departmanı Düzenle
            </h4>
            <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark mb-2">
                  <i className="bi bi-building me-2"></i>
                  Departman Adı <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control shadow-sm border-0 bg-light"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ borderRadius: '6px', padding: '12px 16px', fontSize: '1rem' }}
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark mb-2">
                  <i className="bi bi-tag me-2"></i>
                  Departman Kodu <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control shadow-sm border-0 bg-light"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  maxLength={4}
                  required
                  style={{ borderRadius: '6px', padding: '12px 16px', fontSize: '1rem' }}
                />
              </div>
            </div>
            <div className="modal-footer border-0 p-4 bg-light">
              <button
                type="button"
                className="btn btn-light shadow-sm"
                onClick={onCancel}
                style={{ borderRadius: '6px', padding: '10px 20px' }}
              >
                <i className="bi bi-x-lg me-2"></i>
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-primary shadow-sm"
                disabled={isLoading}
                style={{ 
                  borderRadius: '6px', 
                  padding: '10px 20px'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
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