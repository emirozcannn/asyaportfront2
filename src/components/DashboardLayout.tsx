import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle = "AsyaPort Dashboard" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-layout d-flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content Area */}
      <div 
        className="main-content flex-grow-1" 
        style={{ 
          marginLeft: !isMobile ? '300px' : '0',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        {/* Top Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-3 shadow-sm">
          <div className="d-flex align-items-center w-100">
            {/* Mobile Menu Toggle */}
            <button
              className="btn btn-outline-primary d-lg-none me-3"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <span style={{ fontSize: '1.2rem' }}>☰</span>
            </button>

            {/* Page Title */}
            <h4 className="mb-0 text-dark fw-bold">{pageTitle}</h4>

            {/* Right Side Navigation */}
            <div className="ms-auto d-flex align-items-center gap-2">
              {/* Search */}
              <button className="btn btn-outline-secondary btn-sm d-none d-md-block">
                <span className="me-1">🔍</span>
                Ara
              </button>

              {/* Notifications */}
              <button className="btn btn-outline-secondary btn-sm position-relative">
                <span>🔔</span>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  3
                </span>
              </button>

              {/* User Menu */}
              <div className="dropdown">
                <button 
                  className="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center" 
                  type="button" 
                  data-bs-toggle="dropdown"
                  style={{ minWidth: '120px' }}
                >
                  <span className="me-2">👤</span>
                  Admin
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="#profile"><span className="me-2">👤</span>Profil</a></li>
                  <li><a className="dropdown-item" href="#settings"><span className="me-2">⚙️</span>Ayarlar</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item text-danger" href="#logout"><span className="me-2">🚪</span>Çıkış</a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="content-area" style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#f8f9fa' }}>
          {children}
        </main>
      </div>

      <style>{`
        .dashboard-layout {
          min-height: 100vh;
        }
        
        .navbar {
          z-index: 1040;
        }
        
        .dropdown-toggle::after {
          margin-left: 0.5rem;
        }
        
        @media (max-width: 991.98px) {
          .main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
