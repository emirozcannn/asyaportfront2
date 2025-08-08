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
  firstName?: string;
  lastName?: string;
  role?: string;
  departmentId?: string;
  employeeNumber?: string;
  isActive?: boolean;
  // Legacy support for old structure
  name?: string;
  department?: string;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, pageTitle = "" }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({});

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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberedEmail');
    navigate('/login');
  };

  // Helper functions for user display
  const getUserDisplayName = () => {
    if (userInfo.firstName && userInfo.lastName) {
      return `${userInfo.firstName} ${userInfo.lastName}`;
    }
    if (userInfo.name) return userInfo.name;
    if (userInfo.email) {
      const emailPart = userInfo.email.split('@')[0];
      return emailPart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'Kullanıcı';
  };

  const getUserInitials = () => {
    if (userInfo.firstName && userInfo.lastName) {
      return userInfo.firstName[0].toUpperCase() + userInfo.lastName[0].toUpperCase();
    }
    
    const displayName = getUserDisplayName();
    const words = displayName.split(' ');
    if (words.length >= 2) {
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    } else if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-asyaport position-sticky top-0" style={{ zIndex: 1030 }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between w-100">
            
            {/* Sol taraf - Menu Button (sadece mobile) */}
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-outline-light d-lg-none me-3"
                onClick={toggleSidebar}
                style={{ 
                  border: '1px solid #666666',
                  width: '40px',
                  height: '40px',
                  padding: '0',
                  color: '#ffd700'
                }}
              >
                <i className="bi bi-list"></i>
              </button>
            </div>

            {/* Sağ taraf - Kullanıcı Bilgileri ve Çıkış */}
            <div className="d-flex align-items-center gap-3">
              
              {/* Kullanıcı Bilgileri */}
              <div className="d-flex align-items-center gap-2">
                {/* Desktop - Kullanıcı Bilgileri */}
                <div className="d-none d-md-flex flex-column text-end">
                  <span className="fw-semibold" style={{ fontSize: '13px', lineHeight: '1.2', color: '#ffffff' }}>
                    {getUserDisplayName()}
                  </span>
                </div>
                
                {/* Avatar */}
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-dark fw-bold"
                  style={{ 
                    width: '36px', 
                    height: '36px',
                    fontSize: '14px',
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffcc00 100%)',
                    border: '2px solid #333333'
                  }}
                >
                  {getUserInitials()}
                </div>
              </div>

              {/* Çıkış Butonu */}
              <button 
                className="btn logout-btn d-flex align-items-center gap-2"
                onClick={handleLogout}
                style={{ 
                  background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                  border: '1px solid #bd2130',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span className="d-none d-sm-inline">Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        .navbar-asyaport {
          background: linear-gradient(135deg, #1a1a1a 0%, #333333 50%, #1a1a1a 100%);
          border-bottom: 1px solid #333333;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          padding: 12px 0;
          min-height: 65px;
          position: relative;
          overflow: hidden;
        }
        
        .navbar-asyaport::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #000000, #333333, #666666, #999999, #cccccc, #ffcc00, #ffd700, #ffe135, #fff700, #cccccc, #999999, #666666, #333333, #000000);
          background-size: 200% 100%;
          animation: wave 4s ease-in-out infinite;
          clip-path: polygon(0 0%, 20% 100%, 40% 50%, 60% 100%, 80% 25%, 100% 75%, 100% 0%);
        }
        
        @keyframes wave {
          0%, 100% {
            background-position: 0% 50%;
            clip-path: polygon(0 0%, 20% 100%, 40% 50%, 60% 100%, 80% 25%, 100% 75%, 100% 0%);
          }
          25% {
            background-position: 25% 50%;
            clip-path: polygon(0 25%, 20% 75%, 40% 100%, 60% 25%, 80% 50%, 100% 100%, 100% 0%);
          }
          50% {
            background-position: 50% 50%;
            clip-path: polygon(0 50%, 20% 25%, 40% 75%, 60% 50%, 80% 100%, 100% 25%, 100% 0%);
          }
          75% {
            background-position: 75% 50%;
            clip-path: polygon(0 100%, 20% 50%, 40% 25%, 60% 75%, 80% 50%, 100% 100%, 100% 0%);
          }
        }

        .logout-btn:hover {
          background: linear-gradient(135deg, #c82333 0%, #bd2130 100%) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        .logout-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
        }

        /* Mobile uyumluluğu */
        @media (max-width: 767.98px) {
          .navbar-asyaport {
            padding: 8px 0;
            min-height: 60px;
          }
          
          .logout-btn {
            padding: 8px 12px !important;
            font-size: 13px !important;
          }
        }

        @media (max-width: 575.98px) {
          .logout-btn {
            padding: 8px 10px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;