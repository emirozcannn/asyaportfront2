import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Burada isterseniz localStorage temizliği veya auth logout işlemi de ekleyebilirsiniz
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white border-bottom shadow-sm px-4" style={{ height: 60 }}>
      <div className="ms-auto d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold">bt.mudur@asyaport.com</span>
          <span className="rounded-circle bg-secondary" style={{ width: 32, height: 32, display: 'inline-block' }}></span>
        </div>
        <button className="btn btn-link fw-bold">Profil</button>
        <button className="btn btn-danger px-3" onClick={handleLogout}>Çıkış</button>
      </div>
    </nav>
  );
};

export default Navbar;
