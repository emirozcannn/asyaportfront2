import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Layout from './components/Layout';

// Dashboard
import DashboardPage from './pages/DashboardPage';

// Users
import Users from './pages//users/Users';
import UserRoles from './pages/users/UserRoles';
import AddUser from './pages/users/AddUser';
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
import Departments from './pages/departments/Departments';
import AddDepartment from './pages/departments/AddDepartment';
import PermissionSettings from './pages/departments/PermissionSettings';
import AdminAssignment from './pages/departments/AdminAssignment';
import DepartmentStats from './pages/departments/DepartmentStats';

// Requests
import PendingRequests from './pages/requests/PendingRequests';
import ApprovedRequests from './pages/requests/ApprovedRequests';
import RejectedRequests from './pages/requests/RejectedRequests';
import RequestHistory from './pages/requests/RequestHistory';
import UrgentRequests from './pages/requests/UrgentRequests';
import AutoApprove from './pages/requests/AutoApprove';

// Returns
import PendingReturns from './pages/returns/PendingReturns';
import CompletedReturns from './pages/returns/CompletedReturns';
import OverdueReturns from './pages/returns/OverdueReturns';
import ReturnCalendar from './pages/returns/ReturnCalendar';
import Reminders from './pages/returns/Reminders';

// Reports
import GeneralReports from './pages/reports/GeneralReports';
import UserReports from './pages/reports/UserReports';
import AssetReports from './pages/reports/AssetReports';
import DepartmentReports from './pages/reports/DepartmentReports';
import ReportsOverview from './pages/reports/ReportsOverview';
import CostAnalysis from './pages/reports/CostAnalysis';
import UsageAnalysis from './pages/reports/UsageAnalysis';
import TrendAnalysis from './pages/reports/TrendAnalysis';
import ExportReports from './pages/reports/ExportReports';

// Maintenance
import MaintenanceCalendar from './pages/maintenance/MaintenanceCalendar';
import MaintenanceHistory from './pages/maintenance/MaintenanceHistory';
import ServiceRequests from './pages/maintenance/ServiceRequests';
import WarrantyTracking from './pages/maintenance/WarrantyTracking';
import PartsManagement from './pages/maintenance/PartsManagement';

// Locations
import LocationMap from './pages/locations/LocationMap';
import BuildingManagement from './pages/locations/BuildingManagement';
import AssetLocations from './pages/locations/AssetLocations';
import LocationTransfer from './pages/locations/LocationTransfer';

// Settings
import SystemSettings from './pages/settings/SystemSettings';
import GeneralSettings from './pages/settings/GeneralSettings';
import CategoryMapping from './pages/settings/CategoryMapping';
import ApprovalSettings from './pages/settings/ApprovalSettings';
import Notifications from './pages/settings/Notifications';
import EmailTemplates from './pages/settings/EmailTemplates';
import SystemParameters from './pages/settings/SystemParameters';
import BackupRestore from './pages/settings/BackupRestore';
import SystemMaintenance from './pages/settings/SystemMaintenance';

// Security
import UserActivity from './pages/security/UserActivity';
import AccessLogs from './pages/security/AccessLogs';
import RoleHistory from './pages/security/RoleHistory';
import IPRestrictions from './pages/security/IPRestrictions';
import SessionManagement from './pages/security/SessionManagement';
import SecurityPolicies from './pages/security/SecurityPolicies';
import SuspiciousActivity from './pages/security/SuspiciousActivity';

// Integration
import QRManagement from './pages/integration/QRManagement';
import APIManagement from './pages/integration/APIManagement';
import MobileSettings from './pages/integration/MobileSettings';
import WebhookSettings from './pages/integration/WebhookSettings';
import ThirdPartyIntegrations from './pages/integration/ThirdPartyIntegrations';
import PushNotifications from './pages/integration/PushNotifications';

// HR
import EmployeeSummary from './pages/hr/EmployeeSummary';
import OnboardingOffboarding from './pages/hr/OnboardingOffboarding';
import DepartmentTransfers from './pages/hr/DepartmentTransfers';
import PerformanceTracking from './pages/hr/PerformanceTracking';
import LeaveManagement from './pages/hr/LeaveManagement';

// Finance
import AssetValues from './pages/finance/AssetValues';
import DepreciationCalculations from './pages/finance/DepreciationCalculations';
import BudgetPlanning from './pages/finance/BudgetPlanning';
import CostCenters from './pages/finance/CostCenters';
import FinancialReports from './pages/finance/FinancialReports';
import ProcurementRequests from './pages/finance/ProcurementRequests';

// Help
import Documentation from './pages/help/Documentation';
import UserGuide from './pages/help/UserGuide';
import VideoTutorials from './pages/help/VideoTutorials';
import FAQ from './pages/help/FAQ';
import TechnicalSupport from './pages/help/TechnicalSupport';

import SystemStatus from './pages/help/SystemStatus';



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
          
          {/* Request Management Routes */}
          <Route path="/dashboard/requests/pending" element={<Layout><PendingRequests /></Layout>} />
          <Route path="/dashboard/requests/approved" element={<Layout><ApprovedRequests /></Layout>} />
          <Route path="/dashboard/requests/rejected" element={<Layout><RejectedRequests /></Layout>} />
          <Route path="/dashboard/requests/history" element={<Layout><RequestHistory /></Layout>} />
          <Route path="/dashboard/requests/urgent" element={<Layout><UrgentRequests /></Layout>} />
          <Route path="/dashboard/requests/auto-approve" element={<Layout><AutoApprove /></Layout>} />
          
          {/* Return Management Routes */}
          <Route path="/dashboard/returns/pending" element={<Layout><PendingReturns /></Layout>} />
          <Route path="/dashboard/returns/completed" element={<Layout><CompletedReturns /></Layout>} />
          <Route path="/dashboard/returns/overdue" element={<Layout><OverdueReturns /></Layout>} />
          <Route path="/dashboard/returns/calendar" element={<Layout><ReturnCalendar /></Layout>} />
          <Route path="/dashboard/returns/reminders" element={<Layout><Reminders /></Layout>} />
          
          {/* Reports Routes */}
          <Route path="/dashboard/reports" element={<Layout><GeneralReports /></Layout>} />
          <Route path="/dashboard/reports/general" element={<Layout><GeneralReports /></Layout>} />
          <Route path="/dashboard/reports/overview" element={<Layout><ReportsOverview /></Layout>} />
          <Route path="/dashboard/reports/users" element={<Layout><UserReports /></Layout>} />
          <Route path="/dashboard/reports/assets" element={<Layout><AssetReports /></Layout>} />
          <Route path="/dashboard/reports/departments" element={<Layout><DepartmentReports /></Layout>} />
          <Route path="/dashboard/reports/costs" element={<Layout><CostAnalysis /></Layout>} />
          <Route path="/dashboard/reports/usage" element={<Layout><UsageAnalysis /></Layout>} />
          <Route path="/dashboard/reports/trends" element={<Layout><TrendAnalysis /></Layout>} />
          <Route path="/dashboard/reports/export" element={<Layout><ExportReports /></Layout>} />
          
          {/* Maintenance Routes */}
          <Route path="/dashboard/maintenance/calendar" element={<Layout><MaintenanceCalendar /></Layout>} />
          <Route path="/dashboard/maintenance/history" element={<Layout><MaintenanceHistory /></Layout>} />
          <Route path="/dashboard/maintenance/service" element={<Layout><ServiceRequests /></Layout>} />
          <Route path="/dashboard/maintenance/warranty" element={<Layout><WarrantyTracking /></Layout>} />
          <Route path="/dashboard/maintenance/parts" element={<Layout><PartsManagement /></Layout>} />
          
          {/* Location Routes */}
          <Route path="/dashboard/locations/map" element={<Layout><LocationMap /></Layout>} />
          <Route path="/dashboard/locations/buildings" element={<Layout><BuildingManagement /></Layout>} />
          <Route path="/dashboard/locations/assets" element={<Layout><AssetLocations /></Layout>} />
          <Route path="/dashboard/locations/transfer" element={<Layout><LocationTransfer /></Layout>} />
          
          {/* Settings Routes */}
          <Route path="/dashboard/settings" element={<Layout><SystemSettings /></Layout>} />
          <Route path="/dashboard/settings/general" element={<Layout><GeneralSettings /></Layout>} />
          <Route path="/dashboard/settings/mapping" element={<Layout><CategoryMapping /></Layout>} />
          <Route path="/dashboard/settings/approval" element={<Layout><ApprovalSettings /></Layout>} />
          <Route path="/dashboard/settings/notifications" element={<Layout><Notifications /></Layout>} />
          <Route path="/dashboard/settings/email-templates" element={<Layout><EmailTemplates /></Layout>} />
          <Route path="/dashboard/settings/parameters" element={<Layout><SystemParameters /></Layout>} />
          <Route path="/dashboard/settings/backup" element={<Layout><BackupRestore /></Layout>} />
          <Route path="/dashboard/settings/maintenance" element={<Layout><SystemMaintenance /></Layout>} />
          
          {/* Security Routes */}
          <Route path="/dashboard/security/activity" element={<Layout><UserActivity /></Layout>} />
          <Route path="/dashboard/security/access" element={<Layout><AccessLogs /></Layout>} />
          <Route path="/dashboard/security/roles-history" element={<Layout><RoleHistory /></Layout>} />
          <Route path="/dashboard/security/ip-restrictions" element={<Layout><IPRestrictions /></Layout>} />
          <Route path="/dashboard/security/sessions" element={<Layout><SessionManagement /></Layout>} />
          <Route path="/dashboard/security/policies" element={<Layout><SecurityPolicies /></Layout>} />
          <Route path="/dashboard/security/suspicious" element={<Layout><SuspiciousActivity /></Layout>} />
          
          {/* Integration Routes */}
          <Route path="/dashboard/integration/qr" element={<Layout><QRManagement /></Layout>} />
          <Route path="/dashboard/integration/api" element={<Layout><APIManagement /></Layout>} />
          <Route path="/dashboard/integration/mobile" element={<Layout><MobileSettings /></Layout>} />
          <Route path="/dashboard/integration/webhooks" element={<Layout><WebhookSettings /></Layout>} />
          <Route path="/dashboard/integration/third-party" element={<Layout><ThirdPartyIntegrations /></Layout>} />
          <Route path="/dashboard/integration/push" element={<Layout><PushNotifications /></Layout>} />
          
          {/* HR Routes */}
          <Route path="/dashboard/hr/employee-summary" element={<Layout><EmployeeSummary /></Layout>} />
          <Route path="/dashboard/hr/onboarding" element={<Layout><OnboardingOffboarding /></Layout>} />
          <Route path="/dashboard/hr/transfers" element={<Layout><DepartmentTransfers /></Layout>} />
          <Route path="/dashboard/hr/performance" element={<Layout><PerformanceTracking /></Layout>} />
          <Route path="/dashboard/hr/leave" element={<Layout><LeaveManagement /></Layout>} />
          
          {/* Finance Routes */}
          <Route path="/dashboard/finance/asset-values" element={<Layout><AssetValues /></Layout>} />
          <Route path="/dashboard/finance/depreciation" element={<Layout><DepreciationCalculations /></Layout>} />
          <Route path="/dashboard/finance/budget" element={<Layout><BudgetPlanning /></Layout>} />
          <Route path="/dashboard/finance/cost-centers" element={<Layout><CostCenters /></Layout>} />
          <Route path="/dashboard/finance/reports" element={<Layout><FinancialReports /></Layout>} />
          <Route path="/dashboard/finance/procurement" element={<Layout><ProcurementRequests /></Layout>} />
          
          {/* Help Routes */}
          <Route path="/dashboard/help/docs" element={<Layout><Documentation /></Layout>} />
          <Route path="/dashboard/help/user-guide" element={<Layout><UserGuide /></Layout>} />
          <Route path="/dashboard/help/videos" element={<Layout><VideoTutorials /></Layout>} />
          <Route path="/dashboard/help/faq" element={<Layout><FAQ /></Layout>} />
          <Route path="/dashboard/help/support" element={<Layout><TechnicalSupport /></Layout>} />
      
          <Route path="/dashboard/help/system-status" element={<Layout><SystemStatus /></Layout>} />
          
        
          
          {/* Default Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
