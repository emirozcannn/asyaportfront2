// src/pages/assets/StockStatus.tsx
import React, { useState, useEffect } from 'react';

// Types - API'den import edilecek
interface StockItem {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon?: string;
  categoryColor?: string;
  totalCount: number;
  availableCount: number;
  assignedCount: number;
  maintenanceCount: number;
  retiredCount: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  averageAge?: number; // months
  totalValue?: number;
}

interface StockAlert {
  id: string;
  type: 'low_stock' | 'overstocked' | 'maintenance_due' | 'warranty_expiring';
  categoryId: string;
  categoryName: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  createdAt: string;
}

interface StockFilters {
  categoryId?: string;
  alertType?: string;
  sortBy?: 'name' | 'total' | 'available' | 'value';
  sortOrder?: 'asc' | 'desc';
}

const StockStatus: React.FC = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StockFilters>({
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Load stock data
  const loadStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // API calls will be here
      // const stockData = await getStockStatus(filters);
      // const alertsData = await getStockAlerts();
      // setStockItems(stockData);
      // setStockAlerts(alertsData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stok verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStockData();
  }, [filters]);

  // Calculate stock statistics
  const stockStats = {
    totalAssets: stockItems.reduce((sum, item) => sum + item.totalCount, 0),
    availableAssets: stockItems.reduce((sum, item) => sum + item.availableCount, 0),
    assignedAssets: stockItems.reduce((sum, item) => sum + item.assignedCount, 0),
    totalValue: stockItems.reduce((sum, item) => sum + (item.totalValue || 0), 0),
    criticalAlerts: stockAlerts.filter(alert => alert.severity === 'critical').length,
    lowStockItems: stockItems.filter(item => 
      item.minStockLevel && item.availableCount < item.minStockLevel
    ).length
  };

  // Get stock level status
  const getStockStatus = (item: StockItem) => {
    if (!item.minStockLevel) return { status: 'normal', color: 'success' };
    
    if (item.availableCount === 0) {
      return { status: 'out_of_stock', color: 'danger', text: 'Stokta Yok' };
    } else if (item.availableCount < item.minStockLevel) {
      return { status: 'low_stock', color: 'warning', text: 'Düşük Stok' };
    } else if (item.maxStockLevel && item.availableCount > item.maxStockLevel) {
      return { status: 'overstocked', color: 'info', text: 'Fazla Stok' };
    } else {
      return { status: 'normal', color: 'success', text: 'Normal' };
    }
  };

  // Get alert severity badge
  const getAlertSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger';
      case 'high': return 'bg-warning';
      case 'medium': return 'bg-info';
      case 'low': return 'bg-light text-dark';
      default: return 'bg-secondary';
    }
  };

  // Get alert icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return 'bi-exclamation-triangle';
      case 'overstocked': return 'bi-box-fill';
      case 'maintenance_due': return 'bi-tools';
      case 'warranty_expiring': return 'bi-clock';
      default: return 'bi-info-circle';
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">📊 Stok Durumu</h4>
          <p className="text-muted mb-0">Asset stok seviyelerini takip edin ve yönetin</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm">
            <i className="bi bi-download me-1"></i>
            Rapor İndir
          </button>
          <button className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-gear me-1"></i>
            Stok Ayarları
          </button>
          <div className="btn-group">
            <button
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="bi bi-grid"></i>
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setViewMode('table')}
            >
              <i className="bi bi-table"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Stock Overview Cards */}
      <div className="row g-3 mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
                <i className="bi bi-boxes text-primary fs-5"></i>
              </div>
              <h4 className="fw-bold mb-1">{stockStats.totalAssets.toLocaleString()}</h4>
              <p className="text-muted small mb-0">Toplam Asset</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
                <i className="bi bi-check-circle text-success fs-5"></i>
              </div>
              <h4 className="fw-bold mb-1">{stockStats.availableAssets.toLocaleString()}</h4>
              <p className="text-muted small mb-0">Müsait</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
                <i className="bi bi-person-check text-info fs-5"></i>
              </div>
              <h4 className="fw-bold mb-1">{stockStats.assignedAssets.toLocaleString()}</h4>
              <p className="text-muted small mb-0">Atanmış</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
                <i className="bi bi-currency-dollar text-success fs-5"></i>
              </div>
              <h4 className="fw-bold mb-1">₺{stockStats.totalValue.toLocaleString()}</h4>
              <p className="text-muted small mb-0">Toplam Değer</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
                <i className="bi bi-exclamation-triangle text-warning fs-5"></i>
              </div>
              <h4 className="fw-bold mb-1">{stockStats.lowStockItems}</h4>
              <p className="text-muted small mb-0">Düşük Stok</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex mb-2">
                <i className="bi bi-bell text-danger fs-5"></i>
              </div>
              <h4 className="fw-bold mb-1">{stockStats.criticalAlerts}</h4>
              <p className="text-muted small mb-0">Kritik Uyarı</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Alerts */}
      {stockAlerts.length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-transparent border-0">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-bell text-warning me-2"></i>
              Stok Uyarıları
            </h6>
          </div>
          <div className="card-body">
            <div className="row g-2">
              {stockAlerts.slice(0, 6).map((alert) => (
                <div key={alert.id} className="col-md-6">
                  <div className="alert alert-dismissible mb-2 py-2">
                    <div className="d-flex align-items-center">
                      <i className={`${getAlertIcon(alert.type)} me-2`}></i>
                      <div className="flex-grow-1">
                        <div className="fw-medium small">{alert.categoryName}</div>
                        <div className="text-muted small">{alert.message}</div>
                      </div>
                      <span className={`badge ${getAlertSeverityBadge(alert.severity)} ms-2`}>
                        {alert.count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {stockAlerts.length > 6 && (
              <div className="text-center mt-3">
                <button className="btn btn-outline-primary btn-sm">
                  Tüm Uyarıları Gör ({stockAlerts.length})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.categoryId || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
              >
                <option value="">Tüm Kategoriler</option>
                <option value="comp">Bilgisayar ve Donanım</option>
                <option value="safe">İş Güvenliği</option>
                <option value="office">Ofis Malzemeleri</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.alertType || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, alertType: e.target.value }))}
              >
                <option value="">Tüm Durumlar</option>
                <option value="low_stock">Düşük Stok</option>
                <option value="out_of_stock">Stokta Yok</option>
                <option value="overstocked">Fazla Stok</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.sortBy || 'name'}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              >
                <option value="name">İsme Göre</option>
                <option value="total">Toplam Sayıya Göre</option>
                <option value="available">Müsait Sayıya Göre</option>
                <option value="value">Değere Göre</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select"
                value={filters.sortOrder || 'asc'}
                onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
              >
                <option value="asc">Artan</option>
                <option value="desc">Azalan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Items */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div className="row g-4">
          {stockItems.map((item) => {
            const stockStatus = getStockStatus(item);
            return (
              <div key={item.id} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded p-2 me-3"
                          style={{ backgroundColor: `${item.categoryColor}20`, color: item.categoryColor }}
                        >
                          <i className={`${item.categoryIcon} fs-5`}></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">{item.categoryName}</h6>
                          <span className={`badge bg-${stockStatus.color}`}>
                            {stockStatus.text || 'Normal'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="text-center p-2 bg-light rounded">
                          <div className="fw-bold text-primary fs-4">{item.totalCount}</div>
                          <small className="text-muted">Toplam</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-2 bg-light rounded">
                          <div className="fw-bold text-success fs-4">{item.availableCount}</div>
                          <small className="text-muted">Müsait</small>
                        </div>
                      </div>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="text-center p-2 bg-light rounded">
                          <div className="fw-bold text-info fs-6">{item.assignedCount}</div>
                          <small className="text-muted">Atanmış</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-2 bg-light rounded">
                          <div className="fw-bold text-warning fs-6">{item.maintenanceCount}</div>
                          <small className="text-muted">Bakımda</small>
                        </div>
                      </div>
                    </div>

                    {/* Stock Level Progress */}
                    {item.minStockLevel && (
                      <div className="mb-3">
                        <div className="d-flex justify-content-between small text-muted mb-1">
                          <span>Stok Seviyesi</span>
                          <span>{item.availableCount} / {item.minStockLevel} (min)</span>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div
                            className={`progress-bar bg-${stockStatus.color}`}
                            style={{ 
                              width: `${Math.min((item.availableCount / item.minStockLevel) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {item.totalValue && (
                          <small className="text-muted">
                            Değer: ₺{item.totalValue.toLocaleString()}
                          </small>
                        )}
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
                          <li><a className="dropdown-item" href="#"><i className="bi bi-eye me-2"></i>Detaylar</a></li>
                          <li><a className="dropdown-item" href="#"><i className="bi bi-gear me-2"></i>Stok Ayarları</a></li>
                          <li><a className="dropdown-item" href="#"><i className="bi bi-plus me-2"></i>Yeni Asset Ekle</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Kategori</th>
                    <th className="text-center">Toplam</th>
                    <th className="text-center">Müsait</th>
                    <th className="text-center">Atanmış</th>
                    <th className="text-center">Bakımda</th>
                    <th className="text-center">Durumu</th>
                    <th className="text-end">Değer</th>
                    <th style={{ width: '100px' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {stockItems.map((item) => {
                    const stockStatus = getStockStatus(item);
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded p-2 me-3"
                              style={{ backgroundColor: `${item.categoryColor}20`, color: item.categoryColor }}
                            >
                              <i className={`${item.categoryIcon}`}></i>
                            </div>
                            <div>
                              <div className="fw-medium">{item.categoryName}</div>
                              {item.minStockLevel && (
                                <small className="text-muted">Min: {item.minStockLevel}</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="fw-bold">{item.totalCount}</span>
                        </td>
                        <td className="text-center">
                          <span className="fw-bold text-success">{item.availableCount}</span>
                        </td>
                        <td className="text-center">
                          <span className="fw-bold text-info">{item.assignedCount}</span>
                        </td>
                        <td className="text-center">
                          <span className="fw-bold text-warning">{item.maintenanceCount}</span>
                        </td>
                        <td className="text-center">
                          <span className={`badge bg-${stockStatus.color}`}>
                            {stockStatus.text || 'Normal'}
                          </span>
                        </td>
                        <td className="text-end">
                          {item.totalValue ? `₺${item.totalValue.toLocaleString()}` : '-'}
                        </td>
                        <td>
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-outline-secondary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              <i className="bi bi-three-dots"></i>
                            </button>
                            <ul className="dropdown-menu">
                              <li><a className="dropdown-item" href="#"><i className="bi bi-eye me-2"></i>Detaylar</a></li>
                              <li><a className="dropdown-item" href="#"><i className="bi bi-gear me-2"></i>Ayarlar</a></li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && stockItems.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted mb-3">
            <i className="bi bi-inbox fs-1"></i>
          </div>
          <h6 className="text-muted">Stok Verisi Bulunamadı</h6>
          <p className="text-muted">Henüz stok takibi yapılacak kategori bulunmuyor</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2 text-muted">Stok verileri yükleniyor...</p>
        </div>
      )}
    </div>
  );
};

export default StockStatus;