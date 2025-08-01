// Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
  pageTitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, pageTitle = "Dashboard" }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // localStorage'daki token'ları temizle
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    // Login sayfasına yönlendir
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/dashboard/profile');
    setShowUserMenu(false);
  };

  const handleSettings = () => {
    navigate('/dashboard/settings');
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar navbar-light bg-white border-bottom shadow-sm px-3 py-2" style={{ minHeight: 64 }}>
      <div className="d-flex align-items-center w-100">
        {/* Mobile Menu Button */}
        <button 
          className="btn btn-outline-secondary d-lg-none me-3"
          onClick={toggleSidebar}
          style={{ border: 'none' }}
        >
          <i className="bi bi-list fs-5"></i>
        </button>
        {/* Page Title */}
        <span className="fw-bold fs-4 text-primary" style={{ letterSpacing: 0.5 }}>{pageTitle}</span>
        {/* Sağ taraf */}
        <div className="ms-auto d-flex align-items-center gap-3">
          {/* Notifications */}
          <div className="dropdown position-relative" ref={notificationRef}>
            <button 
              className="btn btn-light position-relative"
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ border: 'none' }}
            >
              <i className="bi bi-bell fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                3
              </span>
            </button>
            {showNotifications && (
              <div className="dropdown-menu show" style={{ right: 0, left: 'auto', minWidth: 260, maxWidth: 320, zIndex: 2000, overflow: 'auto' }}>
                <div className="dropdown-header d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Bildirimler</span>
                  <small className="text-primary" style={{ cursor: 'pointer' }}>Tümünü okundu işaretle</small>
                </div>
                <hr className="dropdown-divider" />
                <a className="dropdown-item py-3" href="#" onClick={e => e.preventDefault()}>
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="rounded-circle bg-info bg-opacity-10 p-2">
                        <i className="bi bi-person-plus text-info"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Yeni kullanıcı eklendi</h6>
                      <p className="mb-1 text-muted small">Ahmet Yılmaz sisteme eklendi</p>
                      <small className="text-muted">2 saat önce</small>
                    </div>
                  </div>
                </a>
                <a className="dropdown-item py-3" href="#" onClick={e => e.preventDefault()}>
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="rounded-circle bg-warning bg-opacity-10 p-2">
                        <i className="bi bi-exclamation-triangle text-warning"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Sistem bakımı</h6>
                      <p className="mb-1 text-muted small">Yarın 02:00'da bakım yapılacak</p>
                      <small className="text-muted">4 saat önce</small>
                    </div>
                  </div>
                </a>
                <hr className="dropdown-divider" />
                <a className="dropdown-item text-center py-2" href="#" onClick={e => e.preventDefault()}>Tüm bildirimleri gör</a>
              </div>
            )}
          </div>

          {/* User Info (Desktop) */}
          <div className="d-none d-md-flex align-items-center gap-2">
            <div className="text-end">
              <div className="fw-semibold text-dark">BT Müdürü</div>
              <small className="text-muted">bt.mudur@asyaport.com</small>
            </div>
            <div 
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: 40, height: 40, cursor: 'pointer', fontSize: 18 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              BM
            </div>
          </div>
          
          {/* User Dropdown */}
          <div className="dropdown position-relative" ref={userMenuRef}>
            <button 
              className="btn btn-outline-primary dropdown-toggle d-md-none"
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <i className="bi bi-person-circle me-1"></i>
              <span className="d-none d-sm-inline">Menü</span>
            </button>
            {showUserMenu && (
              <div className="dropdown-menu show" style={{ right: 0, left: 'auto', minWidth: 200, zIndex: 2000, overflow: 'auto' }}>
                <div className="dropdown-header">
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                      <i className="bi bi-person text-primary"></i>
                    </div>
                    <div>
                      <div className="fw-semibold">BT Müdürü</div>
                      <small className="text-muted">bt.mudur@asyaport.com</small>
                    </div>
                  </div>
                </div>
                <hr className="dropdown-divider" />
                <button 
                  className="dropdown-item" 
                  onClick={handleProfile}
                  style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                >
                  <i className="bi bi-person me-2"></i>Profil Ayarları
                </button>
                <button 
                  className="dropdown-item" 
                  onClick={handleSettings}
                  style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                >
                  <i className="bi bi-gear me-2"></i>Sistem Ayarları
                </button>
                <a className="dropdown-item" href="#" onClick={e => e.preventDefault()}>
                  <i className="bi bi-question-circle me-2"></i>Yardım
                </a>
                <hr className="dropdown-divider" />
                <button 
                  className="dropdown-item text-danger" 
                  onClick={handleLogout}
                  style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>Güvenli Çıkış
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// ================================
