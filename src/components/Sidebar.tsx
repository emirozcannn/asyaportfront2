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
        className={`sidebar position-fixed top-0 start-0 h-100 asyaport-sidebar ${
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
        <div className="sidebar-header">
          <div className="d-flex align-items-center justify-content-center flex-column">
            {/* Logo container - navbar ile uyumlu */}
            <div className="asyaport-logo-sidebar">
              <img 
                src="/asyaport-logo.webp" 
                alt="ASYAPORT Logo" 
                className="logo-img-sidebar"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="logo-placeholder-sidebar">
                <i className="bi bi-image"></i>
              </div>
            </div>
            
            {/* Brand Text */}
            <div className="text-center mt-3">
              <div className="sidebar-brand-title">
                ASYAPORT
              </div>
              <div className="sidebar-brand-subtitle">
                Zimmet Yönetim Paneli
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="sidebar-search">
          <div className="position-relative">
            <input
              type="text"
              className="search-input"
              placeholder="Menüde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="bi bi-search search-icon"></i>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="sidebar-menu">
          <div className="p-2">
            <ul className="nav flex-column gap-1">
              {filteredMenu.map((item, idx) => (
                <li key={idx} className="nav-item">
                  {item.children ? (
                    <>
                      <button
                        className={`menu-button ${
                          openMenus[idx] ? 'menu-button-active' : ''
                        }`}
                        onClick={() => handleMenuClick(idx)}
                      >
                        <i className={`bi ${item.icon} me-3`}></i>
                        <span className="flex-grow-1">{item.text}</span>
                        {renderBadge(item.badge)}
                        <i className={`bi ms-2 ${openMenus[idx] ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                      </button>
                      {openMenus[idx] && (
                        <ul className="submenu">
                          {item.children.map((child, cidx) => (
                            <li key={cidx} className="nav-item">
                              <Link
                                to={child.path}
                                className={`submenu-link ${
                                  location.pathname === child.path ? 'submenu-link-active' : ''
                                }`}
                                onClick={() => window.innerWidth < 992 && toggleSidebar()}
                              >
                                <i className={`bi ${child.icon} me-2`}></i>
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
                      className={`menu-link ${
                        location.pathname === item.path ? 'menu-link-active' : ''
                      }`}
                      onClick={() => window.innerWidth < 992 && toggleSidebar()}
                    >
                      <i className={`bi ${item.icon} me-3`}></i>
                      <span className="flex-grow-1">{item.text}</span>
                      {renderBadge(item.badge)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="d-flex align-items-center">
            <div className="status-indicator me-2">
              <div className="status-dot"></div>
            </div>
            <small className="text-muted">Sistem Aktif</small>
            <small className="text-muted ms-auto">v2.1.0</small>
          </div>
        </div>
      </nav>

      <style>{`
        .asyaport-sidebar {
          background: #ffffff;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          
        }

        .sidebar-header {
          padding: 24px;
          background: linear-gradient(135deg, #1a1a1a 0%, #333333 50%, #1a1a1a 100%);
          border-bottom: 2px solid #ffd700;
          position: relative;
        }

        .sidebar-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #000000, #333333, #666666, #999999, #cccccc, #ffcc00, #ffd700, #ffe135, #fff700, #cccccc, #999999, #666666, #333333, #000000);
          background-size: 200% 100%;
          animation: sidebarWave 4s ease-in-out infinite;
        }
        
        @keyframes sidebarWave {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .asyaport-logo-sidebar {
          width: 56px;
          height: 56px;
          position: relative;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-img-sidebar {
          width: 48px;
          height: 48px;
          object-fit: contain;
          border-radius: 6px;
        }

        .logo-placeholder-sidebar {
          width: 48px;
          height: 48px;
          display: none;
          align-items: center;
          justify-content: center;
          color: #1a237e;
          font-size: 20px;
        }

        .sidebar-brand-title {
          font-family: 'Arial', 'Helvetica Neue', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #ffd700;
          letter-spacing: 1px;
          margin-bottom: 4px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .sidebar-brand-subtitle {
          font-size: 12px;
          color: #cccccc;
          font-weight: 500;
        }

        .sidebar-search {
          padding: 16px 20px;
          background: #ffffff;
          border-bottom: 1px solid #e9ecef;
        }

        .search-input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          font-size: 14px;
          background: #f8f9fa;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #ffd700;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
          background: #ffffff;
        }

        .search-icon {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          color: #6c757d;
          font-size: 14px;
        }

        .sidebar-menu {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
          max-height: calc(100vh - 280px);
        }

        .sidebar-menu::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar-menu::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .sidebar-menu::-webkit-scrollbar-thumb {
          background: #ffd700;
          border-radius: 3px;
        }
        
        .sidebar-menu::-webkit-scrollbar-thumb:hover {
          background: #ffcc00;
        }

        .menu-button {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          text-align: left;
          color: #495057;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          margin: 2px 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }

        .menu-button:hover {
          background: linear-gradient(135deg, #333333 0%, #1a1a1a 100%);
          color: #ffd700;
          transform: translateX(2px);
        }

        .menu-button-active {
          background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%) !important;
          color: #ffd700 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border-left: 3px solid #ffd700;
        }

        .menu-link {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          margin: 2px 8px;
          color: #495057;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .menu-link:hover {
          background: linear-gradient(135deg, #333333 0%, #1a1a1a 100%);
          color: #ffd700;
          text-decoration: none;
          transform: translateX(2px);
        }

        .menu-link-active {
          background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%) !important;
          color: #ffd700 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border-left: 3px solid #ffd700;
        }

        .submenu {
          list-style: none;
          padding: 0;
          margin: 8px 0 12px 0;
        }

        .submenu-link {
          display: flex;
          align-items: center;
          padding: 8px 16px 8px 32px;
          margin: 1px 8px;
          color: #6c757d;
          text-decoration: none;
          font-size: 13px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .submenu-link:hover {
          background: #f8f9fa;
          color: #333333;
          text-decoration: none;
          transform: translateX(3px);
        }

        .submenu-link-active {
          background: rgba(255, 215, 0, 0.1) !important;
          color: #333333 !important;
          border-left: 3px solid #ffd700;
        }

        .sidebar-footer {
          padding: 16px 20px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }

        .status-indicator {
          width: 20px;
          height: 20px;
          background: #28a745;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
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
          .asyaport-sidebar {
            transform: translateX(-100%) !important;
          }
          .asyaport-sidebar.d-block {
            transform: translateX(0) !important;
          }
        }
        
        @media (min-width: 992px) {
          .asyaport-sidebar {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;