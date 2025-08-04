
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

type DashboardProps = {
  children?: React.ReactNode;
};

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: '123',
      icon: 'bi-people',
      color: 'primary',
      change: '+12%'
    },
    {
      title: 'Toplam Varlık',
      value: '456',
      icon: 'bi-box-seam',
      color: 'success',
      change: '+8%'
    },
    {
      title: 'Aktif Atamalar',
      value: '78',
      icon: 'bi-graph-up-arrow',
      color: 'warning',
      change: '+5%'
    }
  ];

  const announcements = [
    { type: 'info', text: 'Yeni kullanıcı eklendi', time: '2 saat önce' },
    { type: 'warning', text: 'Bakım zamanı yaklaşıyor', time: '4 saat önce' },
    { type: 'success', text: 'Sistem güncellendi', time: '1 gün önce' }
  ];

  return (
    <div className="min-vh-100 bg-light">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div 
        className="main-content"
        style={{ 
          marginLeft: (window.innerWidth >= 992) ? '280px' : '0',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-4">
          {children ? (
            children
          ) : (
            <>
              {/* Stats Cards */}
              <div className="row g-4 mb-4">
                {stats.map((stat, index) => (
                  <div key={index} className="col-lg-4 col-md-6">
                    <div className="card border-0 shadow-sm h-100 hover-card">
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h6 className="card-title text-muted mb-2 fw-medium">{stat.title}</h6>
                            <h2 className="mb-0 fw-bold text-dark">{stat.value}</h2>
                          </div>
                          <div className={`rounded-3 p-3 bg-${stat.color} bg-opacity-10`}>
                            <i className={`bi ${stat.icon} text-${stat.color} fs-4`}></i>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className={`badge bg-${stat.color} bg-opacity-10 text-${stat.color} me-2`}>
                            {stat.change}
                          </span>
                          <small className="text-muted">Son aya göre</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Content Row */}
              <div className="row g-4">
                {/* Chart Section */}
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white border-0 p-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold">Genel Bakış</h5>
                        <div className="dropdown">
                          <button 
                            className="btn btn-outline-secondary btn-sm dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Son 30 gün
                          </button>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Son 7 gün</a></li>
                            <li><a className="dropdown-item" href="#">Son 30 gün</a></li>
                            <li><a className="dropdown-item" href="#">Son 3 ay</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <div 
                        className="bg-light rounded-3 d-flex align-items-center justify-content-center text-muted"
                        style={{ height: '300px' }}
                      >
                        {/* Grafik alanı placeholder */}
                        Grafik alanı (Chart.js veya benzeri ile doldurulabilir)
                      </div>
                    </div>
                    <div className="card-footer bg-white border-0 p-4">
                      <a href="#" className="btn btn-outline-primary w-100">
                        Tüm Duyuruları Gör
                      </a>
                    </div>
                  </div>
                </div>

                {/* Announcements */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white border-0 p-4">
                      <h5 className="mb-0 fw-bold">Duyurular</h5>
                    </div>
                    <div className="card-body p-0">
                      {announcements.map((announcement, index) => (
                        <div key={index} className="p-4 border-bottom last-child-no-border">
                          <div className="d-flex align-items-start gap-3">
                            <div className={`rounded-circle p-2 bg-${announcement.type} bg-opacity-10 flex-shrink-0`}>
                              <i className={`bi bi-${
                                announcement.type === 'info' ? 'info-circle' :
                                announcement.type === 'warning' ? 'exclamation-triangle' :
                                'check-circle'
                              } text-${announcement.type}`}></i>
                            </div>
                            <div className="flex-grow-1">
                              <p className="mb-1 fw-medium text-dark">{announcement.text}</p>
                              <small className="text-muted">{announcement.time}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="card-footer bg-white border-0 p-4">
                      <a href="#" className="btn btn-outline-primary w-100">
                        Tüm Duyuruları Gör
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;