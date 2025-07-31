import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';


type DashboardProps = {
  children?: React.ReactNode;
};

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column">
        <Navbar />
        <div className="container-fluid py-4">
          {children ? (
            children
          ) : (
            <>
              <h2 className="mb-3">Dashboard</h2>
              <p className="text-muted">Hoş geldiniz! Burada içerik olacak.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
