// Sidebar.tsx

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface Badge {
  count: number;
  type: 'danger' | 'warning' | 'primary';
}

interface MenuItem {
  icon: string;
  text: string;
  path?: string;
  badge?: Badge | null;
  children?: {
    text: string;
    path: string;
    icon: string;
    badge?: Badge;
  }[];
}

const superAdminMenu: MenuItem[] = [
  {
    icon: 'bi bi-house',
    text: 'Ana Sayfa',
    path: '/dashboard',
    badge: null,
  },
  {
    icon: 'bi-people',
    text: 'Kullanıcı Yönetimi',
    children: [
      { text: 'Tüm Kullanıcılar', path: '/dashboard/users', icon: 'bi-person-lines-fill' },
      { text: 'Yeni Kullanıcı Ekle', path: '/dashboard/users/add', icon: 'bi-person-plus' },
      { text: 'Kullanıcı Rolleri', path: '/dashboard/users/roles', icon: 'bi-shield-check' },
      { text: 'Rol Yetkileri', path: '/dashboard/users/permissions', icon: 'bi-key' },
      { text: 'Aktif/Pasif Durumu', path: '/dashboard/users/status', icon: 'bi-toggle-on' },
   
    ],
  },
  {
    icon: 'bi-building',
    text: 'Departman Yönetimi',
    children: [
      { text: 'Tüm Departmanlar', path: '/dashboard/departments', icon: 'bi-diagram-3' },
      { text: 'Yeni Departman', path: '/dashboard/departments/add', icon: 'bi-plus-circle' },
      { text: 'Yetki Ayarları', path: '/dashboard/departments/permissions', icon: 'bi-key' },
    
    ],
  },
  {
    icon: 'bi-box-seam',
    text: 'Zimmet Yönetimi',
    children: [
      { text: 'Tüm Zimmetler', path: '/dashboard/assets', icon: 'bi-list-ul' },
      { text: 'Zimmet Kategorileri', path: '/dashboard/assets/categories', icon: 'bi-tags' },
      { text: 'Yeni Zimmet Ekle', path: '/dashboard/assets/add', icon: 'bi-plus-square' },
      { text: 'Zimmet Transferi', path: '/dashboard/assets/transfer', icon: 'bi-arrow-left-right' },
      { text: 'Stok Durumu', path: '/dashboard/assets/stock-status', icon: 'bi-boxes' },
      { text: 'Zimmet Durumları', path: '/dashboard/assets/status', icon: 'bi-check-circle' },
      { text: 'QR Kod Oluştur', path: '/dashboard/assets/qr-generator', icon: 'bi-qr-code' },
    ],
  },
  {
    icon: 'bi-clipboard-check',
    text: 'Talep Yönetimi',
    badge: { count: 12, type: 'warning' },
    children: [
      { text: 'Bekleyen Talepler', path: '/dashboard/requests/pending', icon: 'bi-hourglass-split', badge: { count: 8, type: 'danger' } },
      { text: 'Onaylanan Talepler', path: '/dashboard/requests/approved', icon: 'bi-check-circle-fill' },
      { text: 'Reddedilen Talepler', path: '/dashboard/requests/rejected', icon: 'bi-x-circle-fill' },
      { text: 'Talep Geçmişi', path: '/dashboard/requests/history', icon: 'bi-clock-history' },
      { text: 'Acil Talepler', path: '/dashboard/requests/urgent', icon: 'bi-exclamation-triangle-fill' },
    
    ],
  },
 
  {
    icon: 'bi-bar-chart-line',
    text: 'Raporlar & Analitik',
    children: [
   
      { text: 'Departman Raporları', path: '/dashboard/reports/departments', icon: 'bi-building' },
      { text: 'Kullanıcı Raporları', path: '/dashboard/reports/users', icon: 'bi-person-lines-fill' },
      { text: 'Zimmet İstatistikleri', path: '/dashboard/reports/assets', icon: 'bi-graph-up-arrow' },
      { text: 'Maliyet Analizleri', path: '/dashboard/reports/costs', icon: 'bi-currency-dollar' },
  
    ],
  },
  {
    icon: 'bi-tools',
    text: 'Bakım & Servis',
    children: [
      { text: 'Bakım Takvimi', path: '/dashboard/maintenance/calendar', icon: 'bi-calendar-check' },
      { text: 'Bakım Geçmişi', path: '/dashboard/maintenance/history', icon: 'bi-journal-text' },
      { text: 'Servis Talepleri', path: '/dashboard/maintenance/service', icon: 'bi-wrench' },
    
      { text: 'Yedek Parça Yönetimi', path: '/dashboard/maintenance/parts', icon: 'bi-gear-wide-connected' },
    ],
  },
  
  {
    icon: 'bi-gear-fill',
    text: 'Sistem Ayarları',
    children: [
      { text: 'Genel Ayarlar', path: '/dashboard/settings/general', icon: 'bi-sliders' },
      { text: 'Kategori-Departman Eşleştirme', path: '/dashboard/settings/mapping', icon: 'bi-diagram-2' },
      { text: 'Onay Süreç Ayarları', path: '/dashboard/settings/approval', icon: 'bi-check-square' },
      { text: 'Bildirim Ayarları', path: '/dashboard/settings/notifications', icon: 'bi-bell-fill' },
      { text: 'E-posta Şablonları', path: '/dashboard/settings/email-templates', icon: 'bi-envelope' },
      { text: 'Sistem Parametreleri', path: '/dashboard/settings/parameters', icon: 'bi-toggles' },
      { text: 'Backup/Restore', path: '/dashboard/settings/backup', icon: 'bi-cloud-download' },
      { text: 'Sistem Bakımı', path: '/dashboard/settings/maintenance', icon: 'bi-tools' },
    ],
  },
  {
    icon: 'bi-shield-lock-fill',
    text: 'Güvenlik & Denetim',
    children: [
      { text: 'Kullanıcı Aktiviteleri', path: '/dashboard/security/activity', icon: 'bi-activity' },
      { text: 'Sistem Erişim Logları', path: '/dashboard/security/access', icon: 'bi-door-open' },
      { text: 'Yetki Değişiklik Geçmişi', path: '/dashboard/security/roles-history', icon: 'bi-clock-history' },
    
   
      { text: 'Güvenlik Politikaları', path: '/dashboard/security/policies', icon: 'bi-shield-check' },

    ],
  },
  {
    icon: 'bi-phone-vibrate',
    text: 'Mobil & Entegrasyon',
    children: [
 
      { text: 'Mobil Uygulama Ayarları', path: '/dashboard/integration/mobile', icon: 'bi-phone' },
      { text: 'Webhook Ayarları', path: '/dashboard/integration/webhooks', icon: 'bi-arrow-repeat' },
      { text: 'Üçüncü Parti Entegrasyonlar', path: '/dashboard/integration/third-party', icon: 'bi-puzzle' },
      { text: 'Push Bildirimler', path: '/dashboard/integration/push', icon: 'bi-bell-fill' },
    ],
  },

  
  {
    icon: 'bi-question-circle-fill',
    text: 'Destek & Yardım',
    children: [
      { text: 'Sistem Dokümantasyonu', path: '/dashboard/help/docs', icon: 'bi-book' },
      { text: 'Kullanıcı Rehberi', path: '/dashboard/help/user-guide', icon: 'bi-journal-bookmark' },
      { text: 'Video Eğitimler', path: '/dashboard/help/videos', icon: 'bi-play-circle' },
      { text: 'SSS', path: '/dashboard/help/faq', icon: 'bi-question-circle' },
      { text: 'Teknik Destek', path: '/dashboard/help/support', icon: 'bi-headset' },
    
      { text: 'Sistem Durumu', path: '/dashboard/help/system-status', icon: 'bi-activity' },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleMenuClick = (idx: number) => {
    setOpenMenus((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredMenu = superAdminMenu.filter(item => {
    if (!searchTerm) return true;
    
    const matchMain = item.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchChildren = item.children?.some(child => 
      child.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return matchMain || matchChildren;
  });

  const renderBadge = (badge: Badge | null | undefined) => {
    if (!badge) return null;
    
    const badgeClass = badge.type === 'danger' ? 'bg-danger' : 
                      badge.type === 'warning' ? 'bg-warning text-dark' : 
                      'bg-primary';
    
    return (
      <span className={`badge ${badgeClass} ms-2`} style={{ fontSize: '10px' }}>
        {badge.count}
      </span>
    );
  };

  return (
    <>
      {/* Add Bootstrap Icons CSS if not already included */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" 
        rel="stylesheet"
      />

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none" 
          style={{ zIndex: 1040 }}
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <nav 
        className={`sidebar position-fixed top-0 start-0 h-100 bg-white shadow-lg overflow-hidden ${
          isOpen ? 'd-block' : 'd-none d-lg-block'
        }`}
        style={{ 
          width: '300px', 
          zIndex: 1050,
          transform: isOpen || window.innerWidth >= 992 ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {/* Header */}
        <div className="p-4 border-bottom bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="d-flex align-items-center justify-content-center flex-column">
            <div
              className="d-flex align-items-center justify-content-center bg-white rounded-3 shadow-sm mb-3"
              style={{ width: '64px', height: '64px' }}
            >
              <img
                src="/asyaport-logo.webp"
                alt="AsyaPort Logo"
                width={78}
                height={78}
                style={{ objectFit: 'contain' }}
                onError={(e) => {
                  // Fallback icon if logo doesn't load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <i 
                className="bi bi-building text-primary fs-2" 
                style={{ display: 'none' }}
              ></i>
            </div>
            <div className="text-center">
              <div className="fw-bold text mb-1" style={{ fontSize: '16px', letterSpacing: '0.5px' }}>
                Asyaport Zimmet Paneli
              </div>
              <div className="text text-opacity-75" style={{ fontSize: '12px' }}>
                Admin Paneli
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-bottom">
          <div className="position-relative">
            <input
              type="text"
              className="form-control form-control-sm ps-5"
              placeholder="Menüde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: '20px', fontSize: '14px' }}
            />
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="flex-grow-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          <div className="p-2">
            <ul className="nav flex-column gap-1">
              {filteredMenu.map((item, idx) => (
                <li key={idx} className="nav-item">
                  {item.children ? (
                    <>
                      <button
                        className={`nav-link px-3 py-3 rounded-3 d-flex align-items-center w-100 text-start position-relative sidebar-button ${
                          openMenus[idx] ? 'bg-primary text-white shadow-sm' : 'text-dark'
                        }`}
                        style={{ 
                          border: 'none', 
                          background: openMenus[idx] ? '' : 'none', 
                          transition: 'all 0.2s', 
                          textDecoration: 'none',
                          fontSize: '14px'
                        }}
                        onClick={() => handleMenuClick(idx)}
                      >
                        <i className={`bi ${item.icon} me-3 fs-5`}></i>
                        <span className="fw-medium flex-grow-1">{item.text}</span>
                        {renderBadge(item.badge)}
                        <i className={`bi ms-2 ${openMenus[idx] ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                      </button>
                      {openMenus[idx] && (
                        <ul className="nav flex-column ms-2 mb-2 mt-1">
                          {item.children.map((child, cidx) => (
                            <li key={cidx} className="nav-item">
                              <Link
                                to={child.path}
                                className={`nav-link px-3 py-2 rounded-2 d-flex align-items-center position-relative sidebar-child ${
                                  location.pathname === child.path ? 'bg-primary bg-opacity-10 text-primary border-start border-primary border-3' : 'text-muted'
                                }`}
                                onClick={() => window.innerWidth < 992 && toggleSidebar()}
                                style={{ 
                                  fontSize: '13px', 
                                  transition: 'all 0.2s', 
                                  textDecoration: 'none',
                                  marginLeft: '8px'
                                }}
                              >
                                <i className={`bi ${child.icon} me-2`} style={{ fontSize: '12px' }}></i>
                                <span className="flex-grow-1">{child.text}</span>
                                {renderBadge(child.badge)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path || '#'}
                      className={`nav-link px-3 py-3 rounded-3 d-flex align-items-center position-relative sidebar-link ${
                        location.pathname === item.path ? 'bg-primary text-white shadow-sm' : 'text-dark'
                      }`}
                      onClick={() => window.innerWidth < 992 && toggleSidebar()}
                      style={{ transition: 'all 0.2s', textDecoration: 'none', fontSize: '14px' }}
                    >
                      <i className={`bi ${item.icon} me-3 fs-5`}></i>
                      <span className="fw-medium flex-grow-1">{item.text}</span>
                      {renderBadge(item.badge)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-top p-3 bg-light">
          <div className="d-flex align-items-center">
            <div className="bg-success rounded-circle p-1 me-2">
              <div className="bg-white rounded-circle" style={{ width: '8px', height: '8px' }}></div>
            </div>
            <small className="text-muted">Sistem Aktif</small>
            <small className="text-muted ms-auto">v2.1.0</small>
          </div>
        </div>
      </nav>

      <style>{`
        .sidebar-button:hover:not(.bg-primary) {
          background-color: #f8f9fa !important;
          color: #0d6efd !important;
          transform: translateX(2px);
        }
        
        .sidebar-link:hover:not(.bg-primary) {
          background-color: #f8f9fa !important;
          color: #0d6efd !important;
          transform: translateX(2px);
        }
        
        .sidebar-child:hover:not(.bg-primary) {
          background-color: #f1f3f4 !important;
          color: #495057 !important;
          transform: translateX(3px);
        }
        
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .sidebar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        @media (max-width: 991.98px) {
          .sidebar {
            transform: translateX(-100%) !important;
          }
          .sidebar.d-block {
            transform: translateX(0) !important;
          }
        }
        
        @media (min-width: 992px) {
          .sidebar {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;