import React, { useState } from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <div className="min-vh-100 bg-light">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="main-content"
        style={{
          marginLeft: window.innerWidth >= 992 ? '280px' : '0',
          transition: 'margin-left 0.3s',
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} pageTitle={pageTitle} />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
