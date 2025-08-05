// src/pages/assets/AssetCategories.tsx
import React, { useState, useEffect } from 'react';
import type { AssetCategory } from '../../api/types/assets';
import { categoriesApi } from '../../api/assets/categories';

interface CategoryFilters {
  search?: string;
  status?: string;
  parentId?: string;
}

interface CreateCategoryData {
  name: string;
  code: string;
  description?: string;
  color: string;
  icon: string;
  parentId?: string;
}

const AssetCategories: React.FC = () => {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AssetCategory | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    code: '',
    description: '',
    color: '#007bff',
    icon: 'bi-folder',
    parentId: ''
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Predefined colors and icons
  const predefinedColors = [
    '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
    '#6f42c1', '#fd7e14', '#20c997', '#6c757d', '#343a40'
  ];

  const predefinedIcons = [
    'bi-laptop', 'bi-pc-display', 'bi-phone', 'bi-printer',
    'bi-headphones', 'bi-camera', 'bi-tools', 'bi-shield',
    'bi-folder', 'bi-box', 'bi-gear', 'bi-building'
  ];

  // Load categories
  const loadCategories = async (filters?: CategoryFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Load categories from API
      const categoriesData = await categoriesApi.getAll();
      
      // Apply filters
      let filteredCategories = categoriesData;
      if (filters?.search) {
        filteredCategories = filteredCategories.filter(cat => 
          cat.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          cat.code.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
      if (filters?.status === 'active') {
        filteredCategories = filteredCategories.filter(cat => cat.isActive !== false);
      } else if (filters?.status === 'inactive') {
        filteredCategories = filteredCategories.filter(cat => cat.isActive === false);
      }

      setCategories(filteredCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kategoriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Search handler
  const handleSearch = () => {
    loadCategories({ search: searchTerm });
  };

  // Category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(cat => cat.id));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Kategori adı gereklidir';
    }
    if (!formData.code.trim()) {
      errors.code = 'Kategori kodu gereklidir';
    } else if (!/^[A-Z0-9]{2,6}$/.test(formData.code)) {
      errors.code = 'Kod 2-6 karakter arası büyük harf ve rakam olmalıdır';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingCategory) {
        // Update category
        console.log('Kategori güncelleniyor:', { ...editingCategory, ...formData });
      } else {
        // Create new category
        console.log('Yeni kategori oluşturuluyor:', formData);
      }
      
      // Close modal and refresh
      setShowAddModal(false);
      setEditingCategory(null);
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Form gönderme hatası:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      color: '#007bff',
      icon: 'bi-folder',
      parentId: ''
    });
    setFormErrors({});
  };

  // Edit category
  const handleEdit = (category: AssetCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      code: category.code,
      description: category.description || '',
      color: category.color || '#007bff',
      icon: category.icon || 'bi-folder',
      parentId: category.parentId || ''
    });
    setShowAddModal(true);
  };

  // Toggle category status
  const toggleCategoryStatus = async (categoryId: string) => {
    try {
      console.log('Kategori durumu değiştiriliyor:', categoryId);
      // API call would be here
      loadCategories();
    } catch (error) {
      console.error('Durum değiştirme hatası:', error);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">📁 Zimmet Kategorileri</h4>
          <p className="text-muted mb-0">Asset kategorilerini yönetin ve düzenleyin</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm">
            <i className="bi bi-download me-1"></i>
            Dışa Aktar
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => {
              resetForm();
              setEditingCategory(null);
              setShowAddModal(true);
            }}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Yeni Kategori
          </button>
        </div>
      </div>

      {/* Filters & Search */}
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
                  placeholder="Kategori ara (isim, kod)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-outline-primary" onClick={handleSearch}>
                  Ara
                </button>
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                onChange={(e) => loadCategories({ status: e.target.value })}
              >
                <option value="">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">Tüm Ana Kategoriler</option>
                <option value="main">Ana Kategoriler</option>
                <option value="sub">Alt Kategoriler</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="row g-4 mb-4">
        {categories.map((category) => (
          <div key={category.id} className="col-lg-3 col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded p-2 me-3"
                      style={{ backgroundColor: `${category.color}20`, color: category.color }}
                    >
                      <i className={`${category.icon} fs-5`}></i>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategorySelect(category.id)}
                      />
                    </div>
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-three-dots"></i>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(category)}
                        >
                          <i className="bi bi-pencil me-2"></i>Düzenle
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => toggleCategoryStatus(category.id)}
                        >
                          <i className={`bi ${category.isActive !== false ? 'bi-pause' : 'bi-play'} me-2`}></i>
                          {category.isActive !== false ? 'Pasifleştir' : 'Aktifleştir'}
                        </button>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item text-danger">
                          <i className="bi bi-trash me-2"></i>Sil
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold mb-1">{category.name}</h6>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-light text-dark">{category.code}</span>
                    <span className={`badge ${category.isActive ? 'bg-success' : 'bg-secondary'}`}>
                      {category.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  <p className="text-muted small mb-0">
                    {category.description || 'Açıklama bulunmuyor'}
                  </p>
                </div>

                <div className="d-flex justify-content-between align-items-center text-muted small">
                  <span>
                    <i className="bi bi-box me-1"></i>
                    {category.assetCount || 0} asset
                  </span>
                  <span>
                    {new Date(category.updatedAt || category.updated_at || category.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-medium">
                {selectedCategories.length} kategori seçili
              </span>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-warning btn-sm">
                  <i className="bi bi-pause me-1"></i>
                  Pasifleştir
                </button>
                <button className="btn btn-outline-success btn-sm">
                  <i className="bi bi-play me-1"></i>
                  Aktifleştir
                </button>
                <button className="btn btn-outline-danger btn-sm">
                  <i className="bi bi-trash me-1"></i>
                  Sil ({selectedCategories.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted mb-3">
            <i className="bi bi-folder-x fs-1"></i>
          </div>
          <h6 className="text-muted">Kategori Bulunamadı</h6>
          <p className="text-muted">Arama kriterlerinizi değiştirip tekrar deneyin</p>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label">Kategori Adı <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Örn: Bilgisayar ve Donanım"
                      />
                      {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Kod <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.code ? 'is-invalid' : ''}`}
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="COMP"
                        maxLength={6}
                      />
                      {formErrors.code && <div className="invalid-feedback">{formErrors.code}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Açıklama</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Kategori hakkında açıklama..."
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Renk</label>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {predefinedColors.map(color => (
                          <button
                            key={color}
                            type="button"
                            className={`btn p-2 ${formData.color === color ? 'border-3 border-dark' : 'border'}`}
                            style={{ backgroundColor: color, width: '40px', height: '40px' }}
                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                          ></button>
                        ))}
                      </div>
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">İkon</label>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {predefinedIcons.map(icon => (
                          <button
                            key={icon}
                            type="button"
                            className={`btn btn-outline-secondary ${formData.icon === icon ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, icon }))}
                          >
                            <i className={icon}></i>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Ana Kategori</label>
                      <select
                        className="form-select"
                        value={formData.parentId}
                        onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                      >
                        <option value="">Ana kategori olarak oluştur</option>
                        {categories.filter(cat => cat.id !== editingCategory?.id).map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Preview */}
                    <div className="col-12">
                      <label className="form-label">Önizleme</label>
                      <div className="card border">
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded p-2 me-3"
                              style={{ backgroundColor: `${formData.color}20`, color: formData.color }}
                            >
                              <i className={`${formData.icon} fs-5`}></i>
                            </div>
                            <div>
                              <h6 className="mb-1">{formData.name || 'Kategori Adı'}</h6>
                              <span className="badge bg-light text-dark">{formData.code || 'KOD'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingCategory(null);
                      resetForm();
                    }}
                  >
                    İptal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? 'Güncelle' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2 text-muted">Kategoriler yükleniyor...</p>
        </div>
      )}
    </div>
  );
};

export default AssetCategories;