// Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    { 
      icon: 'bi-speedometer2', 
      text: 'Dashboard', 
      path: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    { 
      icon: 'bi-people', 
      text: 'Kullanıcılar', 
      path: '/dashboard/users',
      active: location.pathname === '/dashboard/users'
    },
    { 
      icon: 'bi-box-seam', 
      text: 'Varlık Yönetimi', 
      path: '/dashboard/assets',
      active: location.pathname === '/dashboard/assets'
    },
    {
      icon: 'bi-clipboard-check',
      text: 'Zimmetler',
      path: '/dashboard/assignments',
      active: location.pathname === '/dashboard/assignments'
    },
  ];

  return (
    <>
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
        className={`sidebar position-fixed top-0 start-0 h-100 bg-white shadow-lg d-lg-block`}
        style={{ 
          width: '280px', 
          zIndex: 1050,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="p-4 border-bottom">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded-3 p-2 me-3">
              <i className="bi bi-building text-white fs-5"></i>
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-dark">AsyaPort</h5>
              <small className="text-muted">Admin Panel</small>
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <ul className="nav flex-column gap-1">
            {menuItems.map((item, index) => (
              <li key={index} className="nav-item">
                <Link 
                  to={item.path}
                  className={`nav-link px-3 py-3 rounded-3 d-flex align-items-center ${
                    item.active 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-dark sidebar-link-hover'
                  }`}
                  onClick={() => window.innerWidth < 992 && toggleSidebar()}
                  style={{
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                >
                  <i className={`bi ${item.icon} me-3 fs-5`}></i>
                  <span className="fw-medium">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <style jsx>{`
        .sidebar-link-hover:hover {
          background-color: #f8f9fa !important;
          color: #0d6efd !important;
        }
        @media (max-width: 991.98px) {
          .sidebar {
            transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
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
