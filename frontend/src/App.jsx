import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Index from "./components/pages/common/Index";
import Dashboard from "./components/pages/user/Dashboard";
import IssueDetail from "./components/pages/user/IssueDetails";
import Reports from "./components/pages/user/Reports";
import Analytics from "./components/pages/user/Analytics";
import MapView from "./components/pages/user/MapView";
import Profile from "./components/pages/user/Profile";
import Alerts from "./components/pages/user/Alerts";
import ReportIssue from "./components/pages/user/ReportIssueForm";
import NotFound from "./components/pages/common/NotFound";
import FAQ from "./components/pages/common/FAQ";
import About from "./components/pages/common/About";
import RegisterChoice from "./components/pages/common/RegisterChoice";
import Impact from "./components/pages/common/Impacts";
import CitizenRegister from "./components/pages/Auth/CitizenRegister";
import CitizenLogin from "./components/pages/Auth/CitizenLogin";

/* Department */
import DepartmentIssue from "./components/pages/Department/DepartmentIssue";
import DepartmentLogin from "./components/pages/Auth/DepartmentLogin";
import DepartmentRegister from "./components/pages/Auth/DepartmentRegister";
import TaskBoard from "./components/pages/Department/TaskBoard";
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
//admin
import AdminLogin from "./components/pages/Auth/AdminLogin";
import AIConsole from "./components/pages/Admin/AlConsole";
import DashboardAdmin from "./components/pages/Admin/Dashboard";
import AlertsCenter from "./components/pages/Admin/AltersCenter";
import AIEngine from "./components/pages/Admin/AIEngine";
import AdminAnalytics from "./components/pages/Admin/Analytics";
import AuditLogs from "./components/pages/Admin/AuditsLog";
import Departments from "./components/pages/Admin/Departments";
import IssueIntelligence from "./components/pages/Admin/IssueIntelligence";
import TaskOperations from "./components/pages/Admin/TaskOperations";
import SettingsPage from "./components/pages/Admin/Settings";
import UserManagement from "./components/pages/Admin/UserManagement";
import ZoneMapping from "./components/pages/Admin/ZoneMapping";
import AdminDepartmentNotification from "./components/pages/Admin/AdminDepartmentNotification";

/*operator*/
import OperatorLogin from "./components/pages/Auth/operatorLogin";
import OperatorRegister from "./components/pages/Auth/OperatorRegister";
import DepartmentDashboard from "./components/pages/Department/DepartmentDashboard";
import OperatorDashboard from "./components/pages/operator/OperatorDashboard";
import OperatorMyTasks from "./components/pages/operator/OperatorMyTask";
import TaskDetailSingle from "./components/pages/operator/TaskDetailSingle";
import TaskDetails from "./components/pages/operator/TaskDetails";
import UploadProof from "./components/pages/operator/UploadProof";
import ProfileOperator from "./components/pages/operator/ProfileOperator";


function App() {
  return (
    <BrowserRouter>
     <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/help" element={<FAQ/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/impact" element={<Impact/>}/>
        <Route path="/decide-role" element={<RegisterChoice/>}/>
        {/* Admin */}

        <Route path="/admin-login" element={<AdminLogin/>}/>
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/admin-issues" element={<IssueIntelligence/>}/>
        <Route path="/ai-console" element={<AIConsole/>}/>
        <Route path="/ai-engine" element={<AIEngine />} />
        <Route path="/admin-alerts" element={<AlertsCenter />} />
        <Route path="/admin-analytics" element={<AdminAnalytics/>}/>
        <Route path="/audit" element={<AuditLogs/>}/>
        <Route path="/departments" element={<Departments/>}/>
        <Route path="/tasks" element={<TaskOperations/>}/>
        <Route path="/users" element={<UserManagement/>}/>
        <Route path="/zones" element={<ZoneMapping/>}/>
        <Route path="/settings" element={<SettingsPage/>}/>
        <Route path="/admin/notifications" element={<AdminDepartmentNotification/>}/>

        {/* Department */}
        <Route path="/department-login" element={<DepartmentLogin/>}/>
        <Route path="/department-register" element={<DepartmentRegister/>}/>
        <Route path="/department/dashboard" element={<DepartmentDashboard/>}/>
        <Route path="/department/issues" element={<DepartmentIssue/>}/>
        <Route path="department/taskboard" element={<TaskBoard/>}/>
        <Route path="/department/team" element={<TeamManagement/>}/>
        <Route path="/department/zones" element={<Zones/>}/>
        <Route path="/department/performance" element={<DepartmentPerformance/>}/>
        <Route path="/department/reports" element={<DepartmentReports/>}/>
        <Route path="/department/notifications" element={<DepartmentNotifications/>}/>
        <Route path="/department/settings" element={<DepartmentSettings/>}/>
        <Route path="/department/profile" element={<DepartmentProfile/>}/>
        <Route path="/department/operator-requests" element={<OperatorRequests/>}/>
        {/* //working  */}
        <Route path="/department/settings/issue-types" element={<IssueTypeForm/>}/>
        <Route path="/department/operator/:operatorId" element={<OperatorDetails/>}/>
        {/* ====User===== */}
        <Route path='/register-citizen' element={<CitizenRegister/>}/>
        <Route path="/login-citizen" element={<CitizenLogin/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path="/reports" element={<Reports/>}/>
        <Route path="/issue/:issueId" element={<IssueDetail />} />
        <Route path="/analytics" element={<Analytics/>}/>
        <Route path="/map" element={<MapView/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/alerts" element={<Alerts/>}/>
        <Route path="/post-report" element={<ReportIssue/>}/>

        {/*======Operator==== */}
        <Route path="/operator-login" element={<OperatorLogin/>}/>
        <Route path="/operator-register" element={<OperatorRegister/>}/>
        <Route path="/operator/dashboard" element={<OperatorDashboard/>}/>
        <Route path="/operator/tasks" element={<OperatorMyTasks/>}/>
        <Route path="/operator/tasks/:id" element={<TaskDetailSingle/>}/>
        <Route path="/operator/task-details" element={<TaskDetails/>}/>
        <Route path="/operator/upload-proof" element={<UploadProof/>}/>
        <Route path="/operator/profile" element={<ProfileOperator/>}/>
        
        {/* == Not found==== */}
        <Route path="*" element={<NotFound/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

// import React from 'react'

// const App = () => {
//   // localStorage.setItem('user','sakshi');
//   const user={
//     name:"sakshi",
//     username:'sn'
//   };
//   const val=localStorage.setItem('user1',JSON.stringify(user));
//   console.log(JSON.parse(localStorage.getItem('user1')));
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default App
