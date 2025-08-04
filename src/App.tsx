import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Layout from './components/Layout';

// Pages
import DashboardPage from './pages/DashboardPage';
import Users from './pages/Users';
import UserRoles from './pages/UserRoles';
import AddUser from './pages/AddUser';

// Users
import RolePermissions from './pages/users/RolePermissions';
import UserStatus from './pages/users/UserStatus';
import BulkUserOperations from './pages/users/BulkUserOperations';

// Assets
import AllAssets from './pages/assets/AllAssets';
import AssetCategories from './pages/assets/AssetCategories';
import AddAsset from './pages/assets/AddAsset';
import AssetTransfer from './pages/assets/AssetTransfer';
import StockStatus from './pages/assets/StockStatus';
import AssetStatus from './pages/assets/AssetStatus';
import BulkOperations from './pages/assets/BulkOperations';
import QRGenerator from './pages/assets/QRGenerator';

// Departments
import Departments from './pages/Departments';
import AddDepartment from './pages/departments/AddDepartment';
import PermissionSettings from './pages/departments/PermissionSettings';
import AdminAssignment from './pages/departments/AdminAssignment';
import DepartmentStats from './pages/departments/DepartmentStats';

// Reports
import GeneralReports from './pages/reports/GeneralReports';
import UserReports from './pages/reports/UserReports';
import AssetReports from './pages/reports/AssetReports';
import DepartmentReports from './pages/reports/DepartmentReports';

// Settings
import SystemSettings from './pages/settings/SystemSettings';
import Notifications from './pages/settings/Notifications';
import BackupRestore from './pages/settings/BackupRestore';

// Profile
import Profile from './pages/Profile';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard Routes with Layout */}
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          
          {/* User Management Routes */}
          <Route path="/dashboard/users" element={<Layout><Users /></Layout>} />
          <Route path="/dashboard/users/add" element={<Layout><AddUser /></Layout>} />
          <Route path="/dashboard/users/roles" element={<Layout><UserRoles /></Layout>} />
          <Route path="/dashboard/users/permissions" element={<Layout><RolePermissions /></Layout>} />
          <Route path="/dashboard/users/status" element={<Layout><UserStatus /></Layout>} />
          <Route path="/dashboard/users/bulk-operations" element={<Layout><BulkUserOperations /></Layout>} />
          
          {/* Asset Management Routes */}
          <Route path="/dashboard/assets" element={<Layout><AllAssets /></Layout>} />
          <Route path="/dashboard/assets/all" element={<Layout><AllAssets /></Layout>} />
          <Route path="/dashboard/assets/categories" element={<Layout><AssetCategories /></Layout>} />
          <Route path="/dashboard/assets/add" element={<Layout><AddAsset /></Layout>} />
          <Route path="/dashboard/assets/transfer" element={<Layout><AssetTransfer /></Layout>} />
          <Route path="/dashboard/assets/stock-status" element={<Layout><StockStatus /></Layout>} />
          <Route path="/dashboard/assets/status" element={<Layout><AssetStatus /></Layout>} />
          <Route path="/dashboard/assets/bulk-operations" element={<Layout><BulkOperations /></Layout>} />
          <Route path="/dashboard/assets/qr-generator" element={<Layout><QRGenerator /></Layout>} />
          
          {/* Department Management Routes */}
          <Route path="/dashboard/departments" element={<Layout><Departments /></Layout>} />
          <Route path="/dashboard/departments/add" element={<Layout><AddDepartment /></Layout>} />
          <Route path="/dashboard/departments/permissions" element={<Layout><PermissionSettings /></Layout>} />
          <Route path="/dashboard/departments/admin-assignment" element={<Layout><AdminAssignment /></Layout>} />
          <Route path="/dashboard/departments/stats" element={<Layout><DepartmentStats /></Layout>} />
          
          {/* Reports Routes */}
          <Route path="/dashboard/reports" element={<Layout><GeneralReports /></Layout>} />
          <Route path="/dashboard/reports/general" element={<Layout><GeneralReports /></Layout>} />
          <Route path="/dashboard/reports/users" element={<Layout><UserReports /></Layout>} />
          <Route path="/dashboard/reports/assets" element={<Layout><AssetReports /></Layout>} />
          <Route path="/dashboard/reports/departments" element={<Layout><DepartmentReports /></Layout>} />
          
          {/* Settings Routes */}
          <Route path="/dashboard/settings" element={<Layout><SystemSettings /></Layout>} />
          <Route path="/dashboard/settings/system" element={<Layout><SystemSettings /></Layout>} />
          <Route path="/dashboard/settings/notifications" element={<Layout><Notifications /></Layout>} />
          <Route path="/dashboard/settings/backup" element={<Layout><BackupRestore /></Layout>} />
          
          {/* Profile Route */}
          <Route path="/dashboard/profile" element={<Layout><Profile /></Layout>} />
          
          {/* Default Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
