import React, { useState, useEffect } from 'react';

const SecurityPoliciesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('password');
  const [editMode, setEditMode] = useState<string | null>(null);

  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    passwordExpiration: 90,
    rememberPreviousPasswords: 5,
    accountLockoutThreshold: 5,
    lockoutDuration: 30,
    lastUpdated: '2025-08-01T10:00:00Z',
    updatedBy: 'Ali Özkan'
  });

  const [accessPolicy, setAccessPolicy] = useState({
    sessionTimeout: 480, // 8 hours in minutes
    maxConcurrentSessions: 3,
    allowMultipleLocations: false,
    restrictByIP: true,
    allowedIPs: ['192.168.1.0/24', '10.0.0.0/16'],
    blockSuspiciousIPs: true,
    requireMFAForAdmins: true,
    allowRemoteAccess: true,
    workingHoursOnly: false,
    workingHoursStart: '08:00',
    workingHoursEnd: '18:00',
    lastUpdated: '2025-07-28T14:30:00Z',
    updatedBy: 'Ahmet Yılmaz'
  });

  const [dataPolicy, setDataPolicy] = useState({
    dataRetentionPeriod: 2555, // days (7 years)
    backupFrequency: 'daily',
    encryptSensitiveData: true,
    logDataAccess: true,
    requireApprovalForExport: true,
    maskSensitiveInfo: true,
    allowDataDownload: false,
    auditLogRetention: 1825, // 5 years
    deleteInactiveAccounts: 365, // 1 year
    lastUpdated: '2025-08-05T09:15:00Z',
    updatedBy: 'Elif Aydın'
  });

  const [systemPolicy, setSystemPolicy] = useState({
    enableFirewall: true,
    enableAntivirus: true,
    enableIntrustionDetection: true,
    autoUpdateSecurity: true,
    maintenanceWindow: 'sunday_02:00',
    emergencyContactEmail: 'security@asyaport.com',
    incidentResponseTeam: ['Ali Özkan', 'Ahmet Yılmaz', 'Elif Aydın'],
    vulnerabilityScanFrequency: 'weekly',
    securityTrainingRequired: true,
    lastSecurityAudit: '2025-07-15T00:00:00Z',
    nextAuditDue: '2025-10-15T00:00:00Z',
    lastUpdated: '2025-08-10T16:45:00Z',
    updatedBy: 'Ali Özkan'
  });

  const [complianceRules] = useState([
    {
      id: 1,
      title: 'KVKK Uyumluluk',
      description: 'Kişisel verilerin korunması kanunu gerekliliklerine uygunluk',
      status: 'compliant',
      lastCheck: '2025-08-10',
      nextCheck: '2025-09-10',
      riskLevel: 'low'
    },
    {
      id: 2,
      title: 'ISO 27001 Standardı',
      description: 'Bilgi güvenliği yönetim sistemi standardına uyum',
      status: 'compliant',
      lastCheck: '2025-08-05',
      nextCheck: '2025-11-05',
      riskLevel: 'medium'
    },
    {
      id: 3,
      title: 'SOX Uyumluluk',
      description: 'Sarbanes-Oxley finansal raporlama güvenliği',
      status: 'partial',
      lastCheck: '2025-07-28',
      nextCheck: '2025-08-28',
      riskLevel: 'high'
    },
    {
      id: 4,
      title: 'GDPR Uyumluluk',
      description: 'Avrupa Genel Veri Koruma Yönetmeliği',
      status: 'compliant',
      lastCheck: '2025-08-08',
      nextCheck: '2025-09-08',
      riskLevel: 'low'
    }
  ]);

  const [securityMetrics] = useState({
    overallSecurityScore: 87,
    passwordCompliance: 94,
    accessControlCompliance: 89,
    dataProtectionCompliance: 85,
    systemSecurityCompliance: 82,
    totalPolicies: 48,
    activePolicies: 46,
    expiredPolicies: 2,
    lastSecurityUpdate: '2025-08-13T08:30:00Z'
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-success';
      case 'partial': return 'bg-warning';
      case 'non-compliant': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getComplianceStatusText = (status: string) => {
    switch (status) {
      case 'compliant': return 'Uyumlu';
      case 'partial': return 'Kısmi Uyum';
      case 'non-compliant': return 'Uyumsuz';
      default: return status;
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return risk;
    }
  };

  const handleSavePolicy = (policyType: string) => {
    // Simulate save operation
    setEditMode(null);
    // In real app, this would make an API call
    console.log(`${policyType} policy saved`);
  };

  const exportPolicies = () => {
    const policiesData = {
      passwordPolicy,
      accessPolicy,
      dataPolicy,
      systemPolicy,
      complianceRules,
      securityMetrics,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(policiesData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `guvenlik_politikalari_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-2 text-muted">Güvenlik politikaları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">🛡️ Güvenlik Politikaları</h4>
          <p className="text-muted mb-0">
            Sistem güvenlik kuralları ve uyumluluk politikaları • Son güncelleme: {formatDate(securityMetrics.lastSecurityUpdate)}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={exportPolicies}
          >
            <i className="bi bi-download me-1"></i>
            Politikaları Dışa Aktar
          </button>
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-shield-plus me-1"></i>
            Yeni Politika
          </button>
        </div>
      </div>

      {/* Security Score Overview */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <div className="progress mx-auto" style={{ width: '80px', height: '80px' }}>
                  <svg className="progress-ring" width="80" height="80">
                    <circle
                      className="progress-ring-circle"
                      stroke="#e9ecef"
                      strokeWidth="6"
                      fill="transparent"
                      r="35"
                      cx="40"
                      cy="40"
                    />
                    <circle
                      className="progress-ring-circle"
                      stroke="#198754"
                      strokeWidth="6"
                      fill="transparent"
                      r="35"
                      cx="40"
                      cy="40"
                      strokeDasharray={`${2 * Math.PI * 35}`}
                      strokeDashoffset={`${2 * Math.PI * 35 * (1 - securityMetrics.overallSecurityScore / 100)}`}
                      transform="rotate(-90 40 40)"
                    />
                  </svg>
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <h4 className="mb-0 fw-bold text-success">{securityMetrics.overallSecurityScore}%</h4>
                  </div>
                </div>
              </div>
              <h6 className="mb-0">Genel Güvenlik Skoru</h6>
              <small className="text-muted">Tüm politikalar</small>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-primary">{securityMetrics.totalPolicies}</h5>
              <small className="text-muted">Toplam Politika</small>
              <div className="mt-2">
                <small className="text-success">
                  <i className="bi bi-check-circle me-1"></i>
                  {securityMetrics.activePolicies} aktif
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-warning">{securityMetrics.expiredPolicies}</h5>
              <small className="text-muted">Süresi Dolan</small>
              <div className="mt-2">
                <small className="text-warning">
                  <i className="bi bi-clock me-1"></i>
                  Güncelleme gerekli
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <h5 className="mb-0 fw-bold text-success">{securityMetrics.passwordCompliance}%</h5>
              <small className="text-muted">Şifre Uyumu</small>
              <div className="mt-2">
                <small className="text-success">
                  <i className="bi bi-shield-check me-1"></i>
                  Yüksek uyum
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Tabs */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-transparent border-0">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                <i className="bi bi-key me-2"></i>
                Şifre Politikası
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'access' ? 'active' : ''}`}
                onClick={() => setActiveTab('access')}
              >
                <i className="bi bi-shield-lock me-2"></i>
                Erişim Kontrolü
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'data' ? 'active' : ''}`}
                onClick={() => setActiveTab('data')}
              >
                <i className="bi bi-database me-2"></i>
                Veri Koruma
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'system' ? 'active' : ''}`}
                onClick={() => setActiveTab('system')}
              >
                <i className="bi bi-gear me-2"></i>
                Sistem Güvenliği
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'compliance' ? 'active' : ''}`}
                onClick={() => setActiveTab('compliance')}
              >
                <i className="bi bi-clipboard-check me-2"></i>
                Uyumluluk
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body">
          {/* Password Policy Tab */}
          {activeTab === 'password' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold">Şifre Politikası Ayarları</h6>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setEditMode(editMode === 'password' ? null : 'password')}
                >
                  <i className="bi bi-pencil me-1"></i>
                  {editMode === 'password' ? 'İptal' : 'Düzenle'}
                </button>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Şifre Gereksinimleri</h6>
                      <div className="mb-3">
                        <label className="form-label">Minimum Uzunluk</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={passwordPolicy.minLength}
                          disabled={editMode !== 'password'}
                          onChange={(e) => setPasswordPolicy({...passwordPolicy, minLength: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={passwordPolicy.requireUppercase}
                          disabled={editMode !== 'password'}
                          onChange={(e) => setPasswordPolicy({...passwordPolicy, requireUppercase: e.target.checked})}
                        />
                        <label className="form-check-label">Büyük harf zorunlu</label>
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={passwordPolicy.requireLowercase}
                          disabled={editMode !== 'password'}
                          onChange={(e) => setPasswordPolicy({...passwordPolicy, requireLowercase: e.target.checked})}
                        />
                        <label className="form-check-label">Küçük harf zorunlu</label>
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={passwordPolicy.requireNumbers}
                          disabled={editMode !== 'password'}
                          onChange={(e) => setPasswordPolicy({...passwordPolicy, requireNumbers: e.target.checked})}
                        />
                        <label className="form-check-label">Rakam zorunlu</label>
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={passwordPolicy.requireSpecialChars}
                          disabled={editMode !== 'password'}
                          onChange={(e) => setPasswordPolicy({...passwordPolicy, requireSpecialChars: e.target.checked})}
                        />
                        <label className="form-check-label">Özel karakter zorunlu</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Güvenlik Ayarları</h6>
                      <div className="mb-3">
                        <label className="form-label">Şifre Süresi (gün)</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={passwordPolicy.passwordExpiration}
                          disabled={editMode !== 'password'}
                          onChange={(e) => setPasswordPolicy({...passwordPolicy, passwordExpiration: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Hesap Kilitleme Eşiği</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={passwordPolicy.accountLockoutThreshold}
                          disabled={editMode !== 'password'}
                          onChange={(e) => setPasswordPolicy({...passwordPolicy, accountLockoutThreshold: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Kilitleme Süresi (dakika)</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={passwordPolicy.lockoutDuration}
                          disabled={editMode !== 'password'}
                          onChange={(e) => setPasswordPolicy({...passwordPolicy, lockoutDuration: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={passwordPolicy.preventCommonPasswords}
                          disabled={editMode !== 'password'}
                          onChange={(e) => setPasswordPolicy({...passwordPolicy, preventCommonPasswords: e.target.checked})}
                        />
                        <label className="form-check-label">Yaygın şifreleri engelle</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {editMode === 'password' && (
                <div className="mt-3 text-end">
                  <button 
                    className="btn btn-success"
                    onClick={() => handleSavePolicy('password')}
                  >
                    <i className="bi bi-check-lg me-1"></i>
                    Kaydet
                  </button>
                </div>
              )}

              <div className="mt-3">
                <small className="text-muted">
                  Son güncelleme: {formatDate(passwordPolicy.lastUpdated)} - {passwordPolicy.updatedBy}
                </small>
              </div>
            </div>
          )}

          {/* Access Control Tab */}
          {activeTab === 'access' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold">Erişim Kontrolü Ayarları</h6>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setEditMode(editMode === 'access' ? null : 'access')}
                >
                  <i className="bi bi-pencil me-1"></i>
                  {editMode === 'access' ? 'İptal' : 'Düzenle'}
                </button>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Oturum Yönetimi</h6>
                      <div className="mb-3">
                        <label className="form-label">Oturum Zaman Aşımı (dakika)</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={accessPolicy.sessionTimeout}
                          disabled={editMode !== 'access'}
                          onChange={(e) => setAccessPolicy({...accessPolicy, sessionTimeout: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Maksimum Eşzamanlı Oturum</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={accessPolicy.maxConcurrentSessions}
                          disabled={editMode !== 'access'}
                          onChange={(e) => setAccessPolicy({...accessPolicy, maxConcurrentSessions: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={accessPolicy.allowMultipleLocations}
                          disabled={editMode !== 'access'}
                          onChange={(e) => setAccessPolicy({...accessPolicy, allowMultipleLocations: e.target.checked})}
                        />
                        <label className="form-check-label">Çoklu konumdan erişime izin ver</label>
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={accessPolicy.requireMFAForAdmins}
                          disabled={editMode !== 'access'}
                          onChange={(e) => setAccessPolicy({...accessPolicy, requireMFAForAdmins: e.target.checked})}
                        />
                        <label className="form-check-label">Adminler için MFA zorunlu</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title">IP Kısıtlamaları</h6>
                      <div className="form-check mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={accessPolicy.restrictByIP}
                          disabled={editMode !== 'access'}
                          onChange={(e) => setAccessPolicy({...accessPolicy, restrictByIP: e.target.checked})}
                        />
                        <label className="form-check-label">IP bazlı kısıtlama aktif</label>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">İzinli IP Aralıkları</label>
                        <textarea 
                          className="form-control" 
                          rows={3}
                          value={accessPolicy.allowedIPs.join('\n')}
                          disabled={editMode !== 'access'}
                          onChange={(e) => setAccessPolicy({...accessPolicy, allowedIPs: e.target.value.split('\n')})}
                        />
                        <small className="text-muted">Her satıra bir IP aralığı</small>
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={accessPolicy.blockSuspiciousIPs}
                          disabled={editMode !== 'access'}
                          onChange={(e) => setAccessPolicy({...accessPolicy, blockSuspiciousIPs: e.target.checked})}
                        />
                        <label className="form-check-label">Şüpheli IP'leri otomatik engelle</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {editMode === 'access' && (
                <div className="mt-3 text-end">
                  <button 
                    className="btn btn-success"
                    onClick={() => handleSavePolicy('access')}
                  >
                    <i className="bi bi-check-lg me-1"></i>
                    Kaydet
                  </button>
                </div>
              )}

              <div className="mt-3">
                <small className="text-muted">
                  Son güncelleme: {formatDate(accessPolicy.lastUpdated)} - {accessPolicy.updatedBy}
                </small>
              </div>
            </div>
          )}

          {/* Data Protection Tab */}
          {activeTab === 'data' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold">Veri Koruma Politikaları</h6>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setEditMode(editMode === 'data' ? null : 'data')}
                >
                  <i className="bi bi-pencil me-1"></i>
                  {editMode === 'data' ? 'İptal' : 'Düzenle'}
                </button>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Veri Saklama</h6>
                      <div className="mb-3">
                        <label className="form-label">Veri Saklama Süresi (gün)</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={dataPolicy.dataRetentionPeriod}
                          disabled={editMode !== 'data'}
                          onChange={(e) => setDataPolicy({...dataPolicy, dataRetentionPeriod: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Yedekleme Sıklığı</label>
                        <select 
                          className="form-select"
                          value={dataPolicy.backupFrequency}
                          disabled={editMode !== 'data'}
                          onChange={(e) => setDataPolicy({...dataPolicy, backupFrequency: e.target.value})}
                        >
                          <option value="hourly">Saatlik</option>
                          <option value="daily">Günlük</option>
                          <option value="weekly">Haftalık</option>
                        </select>
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={dataPolicy.encryptSensitiveData}
                          disabled={editMode !== 'data'}
                          onChange={(e) => setDataPolicy({...dataPolicy, encryptSensitiveData: e.target.checked})}
                        />
                        <label className="form-check-label">Hassas verileri şifrele</label>
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={dataPolicy.logDataAccess}
                          disabled={editMode !== 'data'}
                          onChange={(e) => setDataPolicy({...dataPolicy, logDataAccess: e.target.checked})}
                        />
                        <label className="form-check-label">Veri erişimlerini logla</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Veri İzinleri</h6>
                      <div className="mb-3">
                        <label className="form-label">Dışa Aktarım için Onay</label>
                        <select 
                          className="form-select"
                          value={dataPolicy.requireApprovalForExport ? 'enabled' : 'disabled'}
                          disabled={editMode !== 'data'}
                          onChange={(e) => setDataPolicy({...dataPolicy, requireApprovalForExport: e.target.value === 'enabled'})}
                        >
                          <option value="enabled">Gerekli</option>
                          <option value="disabled">Gerekli Değil</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Hassas Bilgileri Maskele</label>
                        <select 
                          className="form-select"
                          value={dataPolicy.maskSensitiveInfo ? 'enabled' : 'disabled'}
                          disabled={editMode !== 'data'}
                          onChange={(e) => setDataPolicy({...dataPolicy, maskSensitiveInfo: e.target.value === 'enabled'})}
                        >
                          <option value="enabled">Evet</option>
                          <option value="disabled">Hayır</option>
                        </select>
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={!dataPolicy.allowDataDownload}
                          disabled={editMode !== 'data'}
                          onChange={(e) => setDataPolicy({...dataPolicy, allowDataDownload: !e.target.checked})}
                        />
                        <label className="form-check-label">Veri indirmeyi kısıtla</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {editMode === 'data' && (
                <div className="mt-3 text-end">
                  <button 
                    className="btn btn-success"
                    onClick={() => handleSavePolicy('data')}
                  >
                    <i className="bi bi-check-lg me-1"></i>
                    Kaydet
                  </button>
                </div>
              )}

              <div className="mt-3">
                <small className="text-muted">
                  Son güncelleme: {formatDate(dataPolicy.lastUpdated)} - {dataPolicy.updatedBy}
                </small>
              </div>
            </div>
          )}

          {/* System Security Tab */}
          {activeTab === 'system' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold">Sistem Güvenliği Ayarları</h6>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setEditMode(editMode === 'system' ? null : 'system')}
                >
                  <i className="bi bi-pencil me-1"></i>
                  {editMode === 'system' ? 'İptal' : 'Düzenle'}
                </button>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Güvenlik Modülleri</h6>
                      <div className="form-check mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={systemPolicy.enableFirewall}
                          disabled={editMode !== 'system'}
                          onChange={(e) => setSystemPolicy({...systemPolicy, enableFirewall: e.target.checked})}
                        />
                        <label className="form-check-label">Firewall aktif</label>
                      </div>
                      <div className="form-check mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={systemPolicy.enableAntivirus}
                          disabled={editMode !== 'system'}
                          onChange={(e) => setSystemPolicy({...systemPolicy, enableAntivirus: e.target.checked})}
                        />
                        <label className="form-check-label">Antivirus aktif</label>
                      </div>
                      <div className="form-check mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={systemPolicy.enableIntrustionDetection}
                          disabled={editMode !== 'system'}
                          onChange={(e) => setSystemPolicy({...systemPolicy, enableIntrustionDetection: e.target.checked})}
                        />
                        <label className="form-check-label">Saldırı tespit sistemi</label>
                      </div>
                      <div className="form-check mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={systemPolicy.autoUpdateSecurity}
                          disabled={editMode !== 'system'}
                          onChange={(e) => setSystemPolicy({...systemPolicy, autoUpdateSecurity: e.target.checked})}
                        />
                        <label className="form-check-label">Otomatik güvenlik güncellemeleri</label>
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          checked={systemPolicy.securityTrainingRequired}
                          disabled={editMode !== 'system'}
                          onChange={(e) => setSystemPolicy({...systemPolicy, securityTrainingRequired: e.target.checked})}
                        />
                        <label className="form-check-label">Güvenlik eğitimi zorunlu</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Sistem Bakımı & İletişim</h6>
                      <div className="mb-3">
                        <label className="form-label">Bakım Penceresi</label>
                        <select 
                          className="form-select"
                          value={systemPolicy.maintenanceWindow}
                          disabled={editMode !== 'system'}
                          onChange={(e) => setSystemPolicy({...systemPolicy, maintenanceWindow: e.target.value})}
                        >
                          <option value="sunday_02:00">Pazar 02:00</option>
                          <option value="saturday_03:00">Cumartesi 03:00</option>
                          <option value="daily_02:00">Her gün 02:00</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Güvenlik Tarama Sıklığı</label>
                        <select 
                          className="form-select"
                          value={systemPolicy.vulnerabilityScanFrequency}
                          disabled={editMode !== 'system'}
                          onChange={(e) => setSystemPolicy({...systemPolicy, vulnerabilityScanFrequency: e.target.value})}
                        >
                          <option value="daily">Günlük</option>
                          <option value="weekly">Haftalık</option>
                          <option value="monthly">Aylık</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Acil Durum İletişim</label>
                        <input 
                          type="email" 
                          className="form-control"
                          value={systemPolicy.emergencyContactEmail}
                          disabled={editMode !== 'system'}
                          onChange={(e) => setSystemPolicy({...systemPolicy, emergencyContactEmail: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="form-label">Güvenlik Denetimi</label>
                        <p className="small text-muted mb-1">Son Denetim: {new Date(systemPolicy.lastSecurityAudit).toLocaleDateString('tr-TR')}</p>
                        <p className="small text-muted">Sonraki: {new Date(systemPolicy.nextAuditDue).toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {editMode === 'system' && (
                <div className="mt-3 text-end">
                  <button 
                    className="btn btn-success"
                    onClick={() => handleSavePolicy('system')}
                  >
                    <i className="bi bi-check-lg me-1"></i>
                    Kaydet
                  </button>
                </div>
              )}

              <div className="mt-3">
                <small className="text-muted">
                  Son güncelleme: {formatDate(systemPolicy.lastUpdated)} - {systemPolicy.updatedBy}
                </small>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold">Uyumluluk Kontrolü</h6>
                <button className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Uyumluluk Kontrolü Yap
                </button>
              </div>

              <div className="row g-4">
                {complianceRules.map((rule) => (
                  <div key={rule.id} className="col-md-6">
                    <div className="card border-0 bg-light h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h6 className="card-title mb-0">{rule.title}</h6>
                          <span className={`badge ${getComplianceStatusBadge(rule.status)}`}>
                            {getComplianceStatusText(rule.status)}
                          </span>
                        </div>
                        <p className="card-text text-muted small">{rule.description}</p>
                        <div className="row text-center">
                          <div className="col-6">
                            <div className="border-end">
                              <small className="text-muted d-block">Son Kontrol</small>
                              <strong>{new Date(rule.lastCheck).toLocaleDateString('tr-TR')}</strong>
                            </div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">Sonraki Kontrol</small>
                            <strong>{new Date(rule.nextCheck).toLocaleDateString('tr-TR')}</strong>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="small text-muted">Risk Seviyesi:</span>
                            <span className={`badge ${getRiskBadgeColor(rule.riskLevel)}`}>
                              {getRiskText(rule.riskLevel)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="card border-0 bg-warning bg-opacity-10">
                  <div className="card-body">
                    <h6 className="card-title text-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Dikkat Edilmesi Gerekenler
                    </h6>
                    <ul className="mb-0">
                      <li>SOX uyumluluk kontrolleri kısmi durumda - öncelikli olarak tamamlanmalı</li>
                      <li>ISO 27001 sertifikası 3 ay içinde yenilenmelidir</li>
                      <li>KVKK veri işleme kayıtları güncel tutulmalıdır</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-4">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 mx-auto mb-3" 
                   style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-shield-check fs-3 text-primary"></i>
              </div>
              <h6 className="card-title mb-2 fw-bold">Güvenlik Taraması</h6>
              <p className="card-text text-muted mb-3 small">Sistemde güvenlik açığı taraması başlat</p>
              <button className="btn btn-primary btn-sm px-4">
                <i className="bi bi-play-circle me-1"></i>
                Taramayı Başlat
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-4">
              <div className="bg-warning bg-opacity-10 rounded-circle p-3 mx-auto mb-3" 
                   style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-clipboard-data fs-3 text-warning"></i>
              </div>
              <h6 className="card-title mb-2 fw-bold">Uyumluluk Raporu</h6>
              <p className="card-text text-muted mb-3 small">Detaylı uyumluluk durumu raporu oluştur</p>
              <button className="btn btn-warning btn-sm px-4">
                <i className="bi bi-file-earmark-text me-1"></i>
                Rapor Oluştur
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-4">
              <div className="bg-info bg-opacity-10 rounded-circle p-3 mx-auto mb-3" 
                   style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-journal-check fs-3 text-info"></i>
              </div>
              <h6 className="card-title mb-2 fw-bold">Politika Yedekleme</h6>
              <p className="card-text text-muted mb-3 small">Tüm güvenlik politikalarını yedekle</p>
              <button className="btn btn-info btn-sm px-4">
                <i className="bi bi-cloud-download me-1"></i>
                Yedekle
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .progress-ring-circle {
          transition: stroke-dashoffset 0.35s;
          transform-origin: 50% 50%;
        }
        
        .nav-tabs .nav-link {
          border: none;
          color: #6c757d;
          font-weight: 500;
        }
        
        .nav-tabs .nav-link.active {
          background-color: transparent;
          border-bottom: 2px solid #0d6efd;
          color: #0d6efd;
        }
        
        .nav-tabs .nav-link:hover {
          border: none;
          color: #0d6efd;
        }
        
        .card {
          transition: transform 0.2s ease-in-out;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        .form-control:disabled, .form-select:disabled {
          background-color: #f8f9fa;
          opacity: 0.8;
        }
        
        .form-check-input:disabled {
          opacity: 0.6;
        }
        
        .badge {
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .alert {
          border: none;
          border-radius: 0.5rem;
        }
        
        .btn-sm {
          font-size: 0.875rem;
          padding: 0.375rem 0.75rem;
        }
        
        .text-muted {
          color: #6c757d !important;
        }
        
        .fw-bold {
          font-weight: 600 !important;
        }
        
        .card-title {
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        
        .list-unstyled li {
          margin-bottom: 0.5rem;
        }
        
        .border-end {
          border-right: 1px solid #dee2e6 !important;
        }
        
        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
        
        .bg-opacity-50 {
          --bs-bg-opacity: 0.5;
        }
        
        .shadow-sm {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
        }
        
        .rounded-circle {
          border-radius: 50% !important;
        }
        
        .position-absolute {
          position: absolute !important;
        }
        
        .top-50 {
          top: 50% !important;
        }
        
        .start-50 {
          left: 50% !important;
        }
        
        .translate-middle {
          transform: translate(-50%, -50%) !important;
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            padding: 1rem !important;
          }
          
          .nav-tabs .nav-link {
            font-size: 0.85rem;
            padding: 0.5rem 0.75rem;
          }
          
          .card-body {
            padding: 1rem;
          }
          
          .btn-sm {
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
          }
          
          .progress {
            width: 60px !important;
            height: 60px !important;
          }
          
          .progress svg {
            width: 60px;
            height: 60px;
          }
          
          .progress svg circle {
            r: 25;
            cx: 30;
            cy: 30;
          }
          
          .row.g-4 {
            --bs-gutter-x: 1rem;
            --bs-gutter-y: 1rem;
          }
        }
        
        @media (max-width: 576px) {
          .col-lg-3 {
            margin-bottom: 1rem;
          }
          
          .d-flex.justify-content-between {
            flex-direction: column;
            gap: 1rem;
          }
          
          .d-flex.gap-2 {
            justify-content: stretch;
          }
          
          .d-flex.gap-2 .btn {
            flex: 1;
          }
        }
        
        /* Custom scrollbar for textarea */
        textarea.form-control {
          resize: vertical;
          min-height: 80px;
        }
        
        /* Loading state for buttons */
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        /* Enhanced focus states */
        .form-control:focus,
        .form-select:focus {
          border-color: #86b7fe;
          outline: 0;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        .form-check-input:focus {
          border-color: #86b7fe;
          outline: 0;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        /* Improved table responsiveness */
        .table-responsive {
          border-radius: 0.375rem;
        }
        
        /* Enhanced modal */
        .modal-content {
          border: none;
          border-radius: 0.5rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        
        .modal-header {
          border-bottom: 1px solid #dee2e6;
          padding: 1rem 1.5rem;
        }
        
        .modal-body {
          padding: 1.5rem;
        }
        
        .modal-footer {
          border-top: 1px solid #dee2e6;
          padding: 1rem 1.5rem;
        }
        
        /* Print styles */
        @media print {
          .btn, .nav-tabs, .modal {
            display: none !important;
          }
          
          .card {
            border: 1px solid #dee2e6 !important;
            box-shadow: none !important;
          }
          
          .container-fluid {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SecurityPoliciesPage;