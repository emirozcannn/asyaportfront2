// src/pages/assets/AddAsset.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AssetDto, AssetCategory, AssetStatusEnum } from '../../api/types/assets';
import { assetsApi } from '../../api/assets';
import { categoriesApi } from '../../api/assets/categories';

interface Department {
  id: string;
  name: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  department?: Department;
}

interface CreateAssetData {
  name: string;
  description?: string;
  serialNumber: string;
  assetNumber: string;
  categoryId: string;
  brand?: string;
  model?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warranty?: string;
  location?: string;
  assignedUserId?: string;
  notes?: string;
  specifications?: { [key: string]: string };
}

const AddAsset: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<CreateAssetData>({
    name: '',
    description: '',
    serialNumber: '',
    assetNumber: '',
    categoryId: '',
    brand: '',
    model: '',
    purchaseDate: '',
    purchasePrice: undefined,
    warranty: '',
    location: '',
    assignedUserId: '',
    notes: '',
    specifications: {}
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentStep, setCurrentStep] = useState(1);

  // Form validation
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Asset adı gereklidir';
      if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Seri numarası gereklidir';
      if (!formData.assetNumber.trim()) newErrors.assetNumber = 'Asset numarası gereklidir';
      if (!formData.categoryId) newErrors.categoryId = 'Kategori seçimi gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }

    setLoading(true);
    try {
      // Create asset via API
      const assetDto: AssetDto = {
        assetNumber: formData.assetNumber,
        name: formData.name,
        serialNumber: formData.serialNumber,
        categoryId: formData.categoryId,
        status: 'Available',
        notes: formData.notes,
        qrCode: `QR-${formData.assetNumber}`,
        createdBy: 'current-user-id', // Replace with actual user ID
      };
      
      await assetsApi.create(assetDto);
      
      console.log('Asset başarıyla oluşturuldu:', assetDto);
      
      // Success notification would be here
      navigate('/dashboard/assets');
    } catch (error) {
      console.error('Asset oluşturma hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate asset number
  const generateAssetNumber = () => {
    const prefix = 'AP-';
    const category = categories.find(c => c.id === formData.categoryId);
    const categoryCode = category?.code || 'GEN';
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    setFormData(prev => ({
      ...prev,
      assetNumber: `${prefix}${categoryCode}-${randomNum}`
    }));
  };

  // Load initial data
  useEffect(() => {
    // Load categories and users
    const loadData = async () => {
      try {
        // Load categories from API
        const categoriesData = await categoriesApi.getAll();
        setCategories(categoriesData);

        // Mock users data - replace with actual API calls when user API is ready
        setUsers([
          { id: '1', fullName: 'Ahmet Yılmaz', email: 'ahmet@company.com' },
          { id: '2', fullName: 'Ayşe Demir', email: 'ayse@company.com' }
        ]);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        // Fallback to empty arrays on error
        setCategories([]);
        setUsers([]);
      }
    };

    loadData();
  }, []);

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <a href="/dashboard/assets" className="text-decoration-none">Asset'lar</a>
              </li>
              <li className="breadcrumb-item active">Yeni Asset Ekle</li>
            </ol>
          </nav>
          <h4 className="mb-1 fw-bold">📦 Yeni Asset Ekle</h4>
          <p className="text-muted mb-0">Sisteme yeni zimmet kaydı oluşturun</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            type="button" 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/dashboard/assets')}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Geri Dön
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between">
                <div className={`text-center ${currentStep >= 1 ? 'text-primary' : 'text-muted'}`}>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{width: '40px', height: '40px'}}>
                    <i className="bi bi-info-circle"></i>
                  </div>
                  <div className="small fw-medium">Temel Bilgiler</div>
                </div>
                <div className={`text-center ${currentStep >= 2 ? 'text-primary' : 'text-muted'}`}>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{width: '40px', height: '40px'}}>
                    <i className="bi bi-gear"></i>
                  </div>
                  <div className="small fw-medium">Detay Bilgileri</div>
                </div>
                <div className={`text-center ${currentStep >= 3 ? 'text-primary' : 'text-muted'}`}>
                  <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{width: '40px', height: '40px'}}>
                    <i className="bi bi-person-check"></i>
                  </div>
                  <div className="small fw-medium">Atama & Onay</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-transparent border-0">
                  <h6 className="mb-0 fw-bold">📋 Temel Bilgiler</h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Asset Adı <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Örn: Dell P2422H Monitor 24''"
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Kategori <span className="text-danger">*</span></label>
                      <select
                        className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                        value={formData.categoryId}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      >
                        <option value="">Kategori seçin...</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Seri Numarası <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className={`form-control ${errors.serialNumber ? 'is-invalid' : ''}`}
                        value={formData.serialNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                        placeholder="Örn: DM2024001"
                      />
                      {errors.serialNumber && <div className="invalid-feedback">{errors.serialNumber}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Asset Numarası <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <input
                          type="text"
                          className={`form-control ${errors.assetNumber ? 'is-invalid' : ''}`}
                          value={formData.assetNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, assetNumber: e.target.value }))}
                          placeholder="Örn: AP-COMP-001"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={generateAssetNumber}
                          title="Otomatik oluştur"
                        >
                          <i className="bi bi-magic"></i>
                        </button>
                      </div>
                      {errors.assetNumber && <div className="invalid-feedback">{errors.assetNumber}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Açıklama</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Asset hakkında detaylı açıklama..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Detailed Information */}
            {currentStep === 2 && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-transparent border-0">
                  <h6 className="mb-0 fw-bold">🔧 Detay Bilgileri</h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Marka</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.brand}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                        placeholder="Örn: Dell"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Model</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.model}
                        onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                        placeholder="Örn: P2422H"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Satın Alma Tarihi</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.purchaseDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Satın Alma Fiyatı</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          value={formData.purchasePrice || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value ? Number(e.target.value) : undefined }))}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        <span className="input-group-text">₺</span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Garanti Süresi</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.warranty}
                        onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
                        placeholder="Örn: 3 yıl"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Konum</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Örn: BT Departmanı - 2. Kat"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Notlar</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Ek notlar ve özel durumlar..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Assignment */}
            {currentStep === 3 && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-transparent border-0">
                  <h6 className="mb-0 fw-bold">👤 Atama ve Onay</h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Kullanıcıya Ata (Opsiyonel)</label>
                      <select
                        className="form-select"
                        value={formData.assignedUserId}
                        onChange={(e) => setFormData(prev => ({ ...prev, assignedUserId: e.target.value }))}
                      >
                        <option value="">Şimdilik atama yapma...</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.fullName} ({user.email})
                          </option>
                        ))}
                      </select>
                      <div className="form-text">Asset'i daha sonra da birine atayabilirsiniz.</div>
                    </div>

                    {/* Summary */}
                    <div className="col-12 mt-4">
                      <div className="alert alert-light border">
                        <h6 className="alert-heading">📋 Özet</h6>
                        <hr />
                        <div className="row">
                          <div className="col-md-6">
                            <strong>Asset Adı:</strong> {formData.name}<br />
                            <strong>Seri No:</strong> {formData.serialNumber}<br />
                            <strong>Asset No:</strong> {formData.assetNumber}
                          </div>
                          <div className="col-md-6">
                            <strong>Kategori:</strong> {categories.find(c => c.id === formData.categoryId)?.name}<br />
                            <strong>Marka/Model:</strong> {formData.brand} {formData.model}<br />
                            <strong>Atanan Kişi:</strong> {formData.assignedUserId ? users.find(u => u.id === formData.assignedUserId)?.fullName : 'Atanmamış'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0">
                <h6 className="mb-0 fw-bold">💡 Yardım</h6>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-start mb-3">
                  <div className="bg-primary bg-opacity-10 rounded p-2 me-3 flex-shrink-0">
                    <i className="bi bi-lightbulb text-primary"></i>
                  </div>
                  <div>
                    <strong className="small">Asset Numarası</strong>
                    <p className="small text-muted mb-0">
                      Otomatik oluştur butonuyla sistem standartlarına uygun numara oluşturabilirsiniz.
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <div className="bg-success bg-opacity-10 rounded p-2 me-3 flex-shrink-0">
                    <i className="bi bi-qr-code text-success"></i>
                  </div>
                  <div>
                    <strong className="small">QR Kod</strong>
                    <p className="small text-muted mb-0">
                      Asset oluşturduktan sonra QR kod otomatik olarak oluşturulacaktır.
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div className="bg-warning bg-opacity-10 rounded p-2 me-3 flex-shrink-0">
                    <i className="bi bi-person-plus text-warning"></i>
                  </div>
                  <div>
                    <strong className="small">Kullanıcı Atama</strong>
                    <p className="small text-muted mb-0">
                      Asset'i hemen birine atamak zorunda değilsiniz. Daha sonra da atayabilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Önceki Adım
                  </button>
                )}
              </div>
              
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/dashboard/assets')}
                >
                  İptal
                </button>
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (validateStep(currentStep)) {
                        setCurrentStep(prev => prev + 1);
                      }
                    }}
                  >
                    Sonraki Adım
                    <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-1"></i>
                        Asset'i Oluştur
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAsset;