import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.png'; // Adjust the path as necessary

const Sidebar: React.FC = () => {
  const location = useLocation();
  return (
    <aside className="d-flex flex-column bg-white border-end shadow-sm p-4" style={{ width: 260, minHeight: '100vh' }}>
      <div className="mb-5 text-center">
     <div className="fw-bold fs-4 mb-2">
  <img src={Logo} alt="Logo" style={{ width: 100 }} />
</div>


        <span className="text-muted small">Admin Paneli</span>
      </div>
      <ul className="nav nav-pills flex-column gap-2">
        <li className="nav-item">
          <Link
            to="/dashboard/users"
            className={`nav-link fw-semibold ${location.pathname === '/dashboard/users' ? 'active' : 'text-dark'}`}
          >
            <i className="bi bi-people me-2" />Kullanıcılar
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/dashboard/assets"
            className={`nav-link fw-semibold ${location.pathname === '/dashboard/assets' ? 'active' : 'text-dark'}`}
          >
            <i className="bi bi-box-seam me-2" />Varlık Yönetimi
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
