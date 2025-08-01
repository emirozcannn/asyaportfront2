// Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
  pageTitle?: string;
}

interface UserInfo {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  department?: string;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, pageTitle = "" }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Load user info from localStorage on component mount
  useEffect(() => {
    const loadUserInfo = () => {
      try {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);
        } else {
          // Fallback - try to get basic info from token or other sources
          const email = localStorage.getItem('userEmail') || 'user@example.com';
          setUserInfo({ email });
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        setUserInfo({ email: 'user@example.com' });
      }
    };

    loadUserInfo();

    // Listen for storage changes (if user info is updated elsewhere)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userInfo') {
        loadUserInfo();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setShowQuickActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberedEmail');
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

  // Helper functions for user display
  const getUserDisplayName = () => {
    if (userInfo.name) return userInfo.name;
    if (userInfo.email) {
      // Extract name from email (before @)
      const emailPart = userInfo.email.split('@')[0];
      return emailPart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'Kullanıcı';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    const words = displayName.split(' ');
    if (words.length >= 2) {
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    } else if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserEmail = () => {
    return userInfo.email || 'user@example.com';
  };

  const getUserRole = () => {
    return userInfo.role || userInfo.department || 'Kullanıcı';
  };

  const notifications = [
    {
      id: 1,
      type: 'info',
      icon: 'bi-person-plus',
      title: 'Yeni Kullanıcı Eklendi',
      message: 'Ahmet Yılmaz sisteme eklendi',
      time: '2 saat önce',
      unread: true
    },
    {
      id: 2,
      type: 'warning',
      icon: 'bi-exclamation-triangle',
      title: 'Zimmet İade Tarihi',
      message: 'Laptop - HP EliteBook iade tarihi yaklaşıyor',
      time: '4 saat önce',
      unread: true
    },
    {
      id: 3,
      type: 'success',
      icon: 'bi-check-circle',
      title: 'Talep Onaylandı',
      message: 'Yazılım geliştirici için masa talebi onaylandı',
      time: '1 gün önce',
      unread: false
    }
  ];

  const getNotificationBgColor = (type: string) => {
    switch(type) {
      case 'info': return 'bg-info bg-opacity-10';
      case 'warning': return 'bg-warning bg-opacity-10';
      case 'success': return 'bg-success bg-opacity-10';
      case 'danger': return 'bg-danger bg-opacity-10';
      default: return 'bg-secondary bg-opacity-10';
    }
  };

  const getNotificationTextColor = (type: string) => {
    switch(type) {
      case 'info': return 'text-info';
      case 'warning': return 'text-warning';
      case 'success': return 'text-success';
      case 'danger': return 'text-danger';
      default: return 'text-secondary';
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav 
      className="navbar navbar-expand-lg bg-white border-bottom shadow-sm px-4 py-3 position-sticky top-0" 
      style={{ 
        minHeight: '70px',
        zIndex: 1030,
        background: 'linear-gradient(90deg, #ffffff 0%, #f8f9fa 100%) !important'
      }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center w-100">
          
          {/* Sol taraf - Menu ve Title */}
          <div className="d-flex align-items-center">
            {/* Mobile Menu Button */}
            <button 
              className="btn btn-light d-lg-none me-3 rounded-3 shadow-sm"
              onClick={toggleSidebar}
              style={{ 
                border: '1px solid #e9ecef',
                width: '44px',
                height: '44px'
              }}
            >
              <i className="bi bi-list fs-5 text-primary"></i>
            </button>

            {/* Page Title */}
            <div className="d-flex align-items-center">
              <div>
                <h4 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '0.5px' }}>
                  {pageTitle}
                </h4>
              </div>
            </div>
          </div>

          {/* Orta kısım - Boş alan (flexbox için) */}
          <div className="flex-grow-1"></div>

          {/* Sağ taraf - Actions */}
          <div className="d-flex align-items-center gap-3">
            
            {/* Quick Actions */}
            <div className="dropdown position-relative d-none d-md-block" ref={quickActionsRef}>
              <button 
                className="btn btn-light rounded-3 shadow-sm position-relative"
                type="button"
                onClick={() => setShowQuickActions(!showQuickActions)}
                style={{ 
                  border: '1px solid #e9ecef',
                  width: '44px',
                  height: '44px'
                }}
              >
                <i className="bi bi-plus-lg fs-5 text-primary"></i>
              </button>
              {showQuickActions && (
                <div className="dropdown-menu show shadow-lg border-0" style={{ 
                  right: 0, 
                  left: 'auto', 
                  minWidth: '250px', 
                  zIndex: 2000,
                  borderRadius: '12px',
                  marginTop: '8px'
                }}>
                  <div className="dropdown-header bg-light rounded-top" style={{ borderRadius: '12px 12px 0 0' }}>
                    <span className="fw-bold text-primary">Hızlı İşlemler</span>
                  </div>
                  <div className="p-2">
                    <a className="dropdown-item rounded-3 py-3 px-3" href="#" onClick={e => e.preventDefault()}>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-3 p-2 me-3">
                          <i className="bi bi-person-plus text-primary"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">Yeni Kullanıcı</div>
                          <small className="text-muted">Sisteme kullanıcı ekle</small>
                        </div>
                      </div>
                    </a>
                    <a className="dropdown-item rounded-3 py-3 px-3" href="#" onClick={e => e.preventDefault()}>
                      <div className="d-flex align-items-center">
                        <div className="bg-success bg-opacity-10 rounded-3 p-2 me-3">
                          <i className="bi bi-box-seam text-success"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">Yeni Zimmet</div>
                          <small className="text-muted">Zimmet öğesi tanımla</small>
                        </div>
                      </div>
                    </a>
                    <a className="dropdown-item rounded-3 py-3 px-3" href="#" onClick={e => e.preventDefault()}>
                      <div className="d-flex align-items-center">
                        <div className="bg-warning bg-opacity-10 rounded-3 p-2 me-3">
                          <i className="bi bi-building text-warning"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">Yeni Departman</div>
                          <small className="text-muted">Departman oluştur</small>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <button 
              className="btn btn-light rounded-3 shadow-sm d-none d-md-block"
              style={{ 
                border: '1px solid #e9ecef',
                width: '44px',
                height: '44px'
              }}
            >
              <i className="bi bi-search fs-5 text-primary"></i>
            </button>

            {/* Notifications */}
            <div className="dropdown position-relative" ref={notificationRef}>
              <button 
                className="btn btn-light rounded-3 shadow-sm position-relative"
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ 
                  border: '1px solid #e9ecef',
                  width: '44px',
                  height: '44px'
                }}
              >
                <i className="bi bi-bell fs-5 text-primary"></i>
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger animate__animated animate__pulse animate__infinite" 
                    style={{ fontSize: '0.7rem', marginTop: '-2px', marginLeft: '-8px' }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="dropdown-menu show shadow-lg border-0" style={{ 
                  right: 0, 
                  left: 'auto', 
                  minWidth: '350px', 
                  maxWidth: '400px', 
                  zIndex: 2000,
                  borderRadius: '12px',
                  marginTop: '8px',
                  maxHeight: '500px',
                  overflowY: 'auto'
                }}>
                  <div className="dropdown-header bg-light d-flex justify-content-between align-items-center rounded-top" 
                    style={{ borderRadius: '12px 12px 0 0' }}>
                    <span className="fw-bold text-primary">Bildirimler ({unreadCount})</span>
                    <button className="btn btn-sm btn-link text-primary p-0" style={{ fontSize: '12px' }}>
                      Tümünü okundu işaretle
                    </button>
                  </div>
                  <div className="p-2">
                    {notifications.map((notification, index) => (
                      <div key={notification.id}>
                        <a className={`dropdown-item rounded-3 py-3 px-3 ${notification.unread ? 'bg-light bg-opacity-50' : ''}`} 
                          href="#" onClick={e => e.preventDefault()}>
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className={`rounded-circle ${getNotificationBgColor(notification.type)} p-2`}>
                                <i className={`bi ${notification.icon} ${getNotificationTextColor(notification.type)}`}></i>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <h6 className="mb-0 fw-semibold" style={{ fontSize: '14px' }}>
                                  {notification.title}
                                </h6>
                                {notification.unread && (
                                  <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                )}
                              </div>
                              <p className="mb-1 text-muted" style={{ fontSize: '13px' }}>
                                {notification.message}
                              </p>
                              <small className="text-muted">{notification.time}</small>
                            </div>
                          </div>
                        </a>
                        {index < notifications.length - 1 && <hr className="dropdown-divider my-2" />}
                      </div>
                    ))}
                  </div>
                  <div className="border-top p-3">
                    <a className="btn btn-light w-100 text-primary fw-semibold" href="#" onClick={e => e.preventDefault()}>
                      Tüm Bildirimleri Görüntüle
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="dropdown position-relative" ref={userMenuRef}>
              <div 
                className="d-flex align-items-center gap-3 cursor-pointer rounded-3 p-2 user-profile-hover"
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid transparent'
                }}
              >
                {/* User Info (Desktop) */}
                <div className="d-none d-lg-flex align-items-center gap-3">
                  <div className="text-end" style={{ lineHeight: '1.2' }}>
                    <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
                      {getUserDisplayName()}
                    </div>
                    <small className="text-muted" style={{ fontSize: '12px' }}>
                      {getUserEmail()}
                    </small>
                  </div>
                  <div 
                    className="rounded-circle bg-gradient d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                    style={{ 
                      width: '44px', 
                      height: '44px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '16px'
                    }}
                  >
                    {getUserInitials()}
                  </div>
                  <i className="bi bi-chevron-down text-muted"></i>
                </div>

                {/* Mobile User Button */}
                <button 
                  className="btn btn-light rounded-3 shadow-sm d-lg-none"
                  style={{ 
                    border: '1px solid #e9ecef',
                    width: '44px',
                    height: '44px'
                  }}
                >
                  <i className="bi bi-person-circle fs-5 text-primary"></i>
                </button>
              </div>

              {showUserMenu && (
                <div className="dropdown-menu show shadow-lg border-0" style={{ 
                  right: 0, 
                  left: 'auto', 
                  minWidth: '280px', 
                  zIndex: 2000,
                  borderRadius: '12px',
                  marginTop: '8px'
                }}>
                  <div className="dropdown-header bg-light rounded-top" style={{ borderRadius: '12px 12px 0 0' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="rounded-circle bg-gradient d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ 
                          width: '40px', 
                          height: '40px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontSize: '14px'
                        }}
                      >
                        {getUserInitials()}
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">{getUserDisplayName()}</div>
                        <small className="text-muted">{getUserEmail()}</small>
                        {getUserRole() !== 'Kullanıcı' && (
                          <div className="badge bg-primary bg-opacity-10 text-primary mt-1" style={{ fontSize: '10px' }}>
                            {getUserRole()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button 
                      className="dropdown-item rounded-3 py-3 px-3 text-start" 
                      onClick={handleProfile}
                      style={{ border: 'none', background: 'none', width: '100%' }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-3 p-2 me-3">
                          <i className="bi bi-person text-primary"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">Profil Ayarları</div>
                          <small className="text-muted">Kişisel bilgilerinizi düzenleyin</small>
                        </div>
                      </div>
                    </button>
                    <button 
                      className="dropdown-item rounded-3 py-3 px-3 text-start" 
                      onClick={handleSettings}
                      style={{ border: 'none', background: 'none', width: '100%' }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="bg-secondary bg-opacity-10 rounded-3 p-2 me-3">
                          <i className="bi bi-gear text-secondary"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">Sistem Ayarları</div>
                          <small className="text-muted">Sistem konfigürasyonları</small>
                        </div>
                      </div>
                    </button>
                    <a className="dropdown-item rounded-3 py-3 px-3" href="#" onClick={e => e.preventDefault()}>
                      <div className="d-flex align-items-center">
                        <div className="bg-info bg-opacity-10 rounded-3 p-2 me-3">
                          <i className="bi bi-question-circle text-info"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">Yardım & Destek</div>
                          <small className="text-muted">Dokümantasyon ve destek</small>
                        </div>
                      </div>
                    </a>
                  </div>
                  <hr className="dropdown-divider my-2" />
                  <div className="p-2">
                    <button 
                      className="dropdown-item rounded-3 py-3 px-3 text-danger text-start" 
                      onClick={handleLogout}
                      style={{ border: 'none', background: 'none', width: '100%' }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="bg-danger bg-opacity-10 rounded-3 p-2 me-3">
                          <i className="bi bi-box-arrow-right text-danger"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">Güvenli Çıkış</div>
                          <small className="text-muted">Oturumu sonlandır</small>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .user-profile-hover:hover {
          background-color: #f8f9fa !important;
          border-color: #dee2e6 !important;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
          transform: translateX(2px);
          transition: all 0.2s ease;
        }
        
        .navbar {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .animate__pulse {
          animation: pulse 2s infinite;
        }
        
        .dropdown-menu::-webkit-scrollbar {
          width: 6px;
        }
        
        .dropdown-menu::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .dropdown-menu::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .dropdown-menu::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;