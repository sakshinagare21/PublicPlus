import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Index from "./components/pages/common/Index";
import Dashboard from "./components/pages/user/Dashboard";
import IssueDetail from "./components/pages/user/IssueDetails";
import Reports from "./components/pages/user/Reports";
import Analytics from "./components/pages/user/Analytics";
import MapView from "./components/pages/user/MapView";
import Profile from "./components/pages/user/Profile";
import ReportIssue from "./components/pages/user/ReportIssueForm";
import UserNotifications from "./components/pages/user/UserNotifications";
import CommunityIssues from "./components/pages/user/CommunityIssues";
import NotFound from "./components/pages/common/NotFound";
import FAQ from "./components/pages/common/FAQ";
import Help from "./components/pages/common/Help";
import Contact from "./components/pages/common/Contact";
import About from "./components/pages/common/About";
import RegisterChoice from "./components/pages/common/RegisterChoice";
import Impact from "./components/pages/common/Impacts";
import CitizenRegister from "./components/pages/Auth/CitizenRegister";
import CitizenLogin from "./components/pages/Auth/CitizenLogin";

/* Department */
import DepartmentIssue from "./components/pages/Department/DepartmentIssue";
import DepartmentLogin from "./components/pages/Auth/DepartmentLogin";
import DepartmentRegister from "./components/pages/Auth/DepartmentRegister";
import TeamManagement from "./components/pages/Department/TeamManagement";
import Zones from "./components/pages/Department/Zones";
import DepartmentPerformance from "./components/pages/Department/DepartmentPerfomance";
import DepartmentReports from "./components/pages/Department/DepartmentReports";
import DepartmentNotifications from "./components/pages/Department/DepartmentNotifications";
import DepartmentSettings from "./components/pages/Department/DepartmentSettings";
import DepartmentProfile from "./components/pages/Department/DepartmentProfile";
import OperatorRequests from "./components/pages/Department/OperatorRequests";
import IssueTypeForm from "./components/pages/Department/IssueTypeForm";
import OperatorDetails from "./components/pages/Department/OperatorDetail";
import ZoneConfiguration from "./components/pages/Department/ZoneConfiguration";
//admin
import AdminLogin from "./components/pages/Auth/AdminLogin";
import DashboardAdmin from "./components/pages/Admin/Dashboard";
import AdminAnalytics from "./components/pages/Admin/AnalyticsDashboard";
import AuditLogs from "./components/pages/Admin/AuditsLog";
import Departments from "./components/pages/Admin/Departments";
import IssueIntelligence from "./components/pages/Admin/IssueIntelligence";
import TaskOperations from "./components/pages/Admin/TaskOperations";
import SettingsMain from "./components/pages/Admin/Settings";
import UserManagement from "./components/pages/Admin/UserManagement";
import ZoneMapping from "./components/pages/Admin/ZoneMapping";
import AdminDepartmentNotification from "./components/pages/Admin/AdminDepartmentNotification";
import AdminContact from "./components/pages/Admin/AdminContact";
import AdminProfile from "./components/pages/Admin/AdminProfile";

/*operator*/
import OperatorLogin from "./components/pages/Auth/operatorLogin";
import OperatorRegister from "./components/pages/Auth/OperatorRegister";
import DepartmentDashboard from "./components/pages/Department/DepartmentDashboard";
import OperatorDashboard from "./components/pages/operator/OperatorDashboard";
import OperatorMyTasks from "./components/pages/operator/OperatorMyTasks";
import TaskDetailSingle from "./components/pages/operator/TaskDetailSingle";
import UploadProof from "./components/pages/operator/UploadProof";
import ProfileOperator from "./components/pages/operator/ProfileOperator";
import OperatorNotifications from "./components/pages/operator/OperatorNotifications";
import OperatorIssueHistory from "./components/pages/operator/OperatorIssueHistory";


import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Index />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/decide-role" element={<RegisterChoice />} />

            {/* AUTH ROUTES (PUBLIC) */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/department-login" element={<DepartmentLogin />} />
            <Route path="/department-register" element={<DepartmentRegister />} />
            <Route path="/register-citizen" element={<CitizenRegister />} />
            <Route path="/login-citizen" element={<CitizenLogin />} />
            <Route path="/operator-login" element={<OperatorLogin />} />
            <Route path="/operator-register" element={<OperatorRegister />} />

            {/* ADMIN ROUTES (PROTECTED) */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardAdmin /></ProtectedRoute>} />
            <Route path="/admin-issues" element={<ProtectedRoute allowedRoles={['admin']}><IssueIntelligence /></ProtectedRoute>} />
            <Route path="/admin-analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/audit" element={<ProtectedRoute allowedRoles={['admin']}><AuditLogs /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute allowedRoles={['admin']}><Departments /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute allowedRoles={['admin']}><TaskOperations /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
            <Route path="/zones" element={<ProtectedRoute allowedRoles={['admin']}><ZoneMapping /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin']}><SettingsMain /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminDepartmentNotification /></ProtectedRoute>} />
            <Route path="/admin/contact" element={<ProtectedRoute allowedRoles={['admin']}><AdminContact /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>} />

            {/* DEPARTMENT ROUTES (PROTECTED) */}
            <Route path="/department/dashboard" element={<ProtectedRoute allowedRoles={['department']}><DepartmentDashboard /></ProtectedRoute>} />
            <Route path="/department/issues" element={<ProtectedRoute allowedRoles={['department']}><DepartmentIssue /></ProtectedRoute>} />
            <Route path="/department/team" element={<ProtectedRoute allowedRoles={['department']}><TeamManagement /></ProtectedRoute>} />
            <Route path="/department/zones" element={<ProtectedRoute allowedRoles={['department']}><Zones /></ProtectedRoute>} />
            <Route path="/department/performance" element={<ProtectedRoute allowedRoles={['department']}><DepartmentPerformance /></ProtectedRoute>} />
            <Route path="/department/reports" element={<ProtectedRoute allowedRoles={['department']}><DepartmentReports /></ProtectedRoute>} />
            <Route path="/department/notifications" element={<ProtectedRoute allowedRoles={['department']}><DepartmentNotifications /></ProtectedRoute>} />
            <Route path="/department/settings" element={<ProtectedRoute allowedRoles={['department']}><DepartmentSettings /></ProtectedRoute>} />
            <Route path="/department/profile" element={<ProtectedRoute allowedRoles={['department']}><DepartmentProfile /></ProtectedRoute>} />
            <Route path="/department/operator-requests" element={<ProtectedRoute allowedRoles={['department']}><OperatorRequests /></ProtectedRoute>} />
            <Route path="/department/settings/issue-types" element={<ProtectedRoute allowedRoles={['department']}><IssueTypeForm /></ProtectedRoute>} />
            <Route path="/department/settings/zones" element={<ProtectedRoute allowedRoles={['department']}><ZoneConfiguration /></ProtectedRoute>} />
            <Route path="/department/operator/:operatorId" element={<ProtectedRoute allowedRoles={['department']}><OperatorDetails /></ProtectedRoute>} />

            {/* USER ROUTES (PROTECTED) */}
            <Route path='/dashboard' element={<ProtectedRoute allowedRoles={['citizen']}><Dashboard /></ProtectedRoute>} />
            <Route path="/community-issues" element={<ProtectedRoute allowedRoles={['citizen']}><CommunityIssues /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={['citizen']}><Reports /></ProtectedRoute>} />
            <Route path="/issue/:issueId" element={<ProtectedRoute allowedRoles={['citizen']}><IssueDetail /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute allowedRoles={['citizen']}><Analytics /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute allowedRoles={['citizen']}><MapView /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['citizen']}><Profile /></ProtectedRoute>} />
            <Route path="/post-report" element={<ProtectedRoute allowedRoles={['citizen']}><ReportIssue /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute allowedRoles={['citizen']}><UserNotifications /></ProtectedRoute>} />

            {/* OPERATOR ROUTES (PROTECTED) */}
            <Route path="/operator/dashboard" element={<ProtectedRoute allowedRoles={['operator']}><OperatorDashboard /></ProtectedRoute>} />
            <Route path="/operator/tasks" element={<ProtectedRoute allowedRoles={['operator']}><OperatorMyTasks /></ProtectedRoute>} />
            <Route path="/operator/tasks/:id" element={<ProtectedRoute allowedRoles={['operator']}><TaskDetailSingle /></ProtectedRoute>} />
            <Route path="/operator/profile" element={<ProtectedRoute allowedRoles={['operator']}><ProfileOperator /></ProtectedRoute>} />
            <Route path="/operator/notifications" element={<ProtectedRoute allowedRoles={['operator']}><OperatorNotifications /></ProtectedRoute>} />
            <Route path="/operator/history" element={<ProtectedRoute allowedRoles={['operator']}><OperatorIssueHistory /></ProtectedRoute>} />

            {/* == Not found==== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
 );
}

export default App;

// import React from 'react'

// const App = () => {
// // localStorage.setItem('user','sakshi');
// const user={
// name:"sakshi",
// username:'sn'
// };
// const val=localStorage.setItem('user1',JSON.stringify(user));
// console.log(JSON.parse(localStorage.getItem('user1')));
// return (
// <div>
 
// </div>
// )
// }

// export default App

