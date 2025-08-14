import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import LoginNew from './components/LoginNew';
import ChangePassword from './components/ChangePassword';
import Sidebar from './components/Sidebar';
import './styles/Sidebar.css';
import './App.css';

// Admin pages
import DashboardOverview from './pages/admin/DashboardOverview';
import AdminEventManagement from './pages/admin/EventManagement';
import AdminOpportunityManagement from './pages/admin/OpportunityManagement';
import UserManagement from './pages/admin/UserManagement';
import AdminConfirmedStudents from './pages/admin/ConfirmedStudents';

// Student pages
import StudentMyDashboard from './pages/student/MyDashboard';
import BrowseEvents from './pages/student/BrowseEvents';
import BrowseOpportunity from './pages/student/BrowseOpportunity';
import StudentCalendarView from './pages/student/CalendarView';
import EventHistory from './pages/student/EventHistory';
import StudentProfileSettings from './pages/student/ProfileSettings';
import StudentNotifications from './pages/student/Notifications';

// Head pages
import DepartmentDashboard from './pages/head/DepartmentDashboard';
import HeadEventManagement from './pages/head/EventManagement';
import HeadOpportunityManagement from './pages/head/OpportunityManagement';
import HeadNotifications from './pages/head/Notifications';
import HeadCalendarView from './pages/head/CalendarView';
import ConfirmedStudents from './pages/head/ConfirmedStudents';

// Employee pages
import EmployeeMyDashboard from './pages/employee/MyDashboard';
import EmployeeEventManagement from './pages/employee/EventManagement';
import EmployeeCalendarView from './pages/employee/CalendarView';
import EmployeeProfileSettings from './pages/employee/ProfileSettings';
import EmployeeNotifications from './pages/employee/Notifications';
import EmployeeOpportunityManagement from './pages/employee/OpportunityManagement';


const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; // Create an unauthorized page later
  }

  return children;
};


const ProtectedLayout = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => setIsCollapsed(!isCollapsed);
  const handleLogout = () => logout();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="App">
      <Sidebar
        isCollapsed={isCollapsed}
        userRole={user.role}
        currentUser={user}
        handleToggle={handleToggle}
        handleLogout={handleLogout}
      />
      <main className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
        <Routes>
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

          {/* General Authenticated Routes */}
          <Route path="/change-password" element={<PrivateRoute allowedRoles={['admin', 'student', 'head', 'employee']}><ChangePassword /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><DashboardOverview /></PrivateRoute>} />
          <Route path="/admin/events" element={<PrivateRoute allowedRoles={['admin']}><AdminEventManagement /></PrivateRoute>} />
          <Route path="/admin/opportunities" element={<PrivateRoute allowedRoles={['admin']}><AdminOpportunityManagement /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute allowedRoles={['admin']}><UserManagement /></PrivateRoute>} />
          <Route path="/admin/confirmed-students" element={<PrivateRoute allowedRoles={['admin']}><AdminConfirmedStudents /></PrivateRoute>} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<PrivateRoute allowedRoles={['student']}><StudentMyDashboard /></PrivateRoute>} />
          <Route path="/student/events" element={<PrivateRoute allowedRoles={['student']}><BrowseEvents /></PrivateRoute>} />
          <Route path="/student/opportunities" element={<PrivateRoute allowedRoles={['student']}><BrowseOpportunity /></PrivateRoute>} />
          <Route path="/student/calendar" element={<PrivateRoute allowedRoles={['student']}><StudentCalendarView /></PrivateRoute>} />
          <Route path="/student/history" element={<PrivateRoute allowedRoles={['student']}><EventHistory /></PrivateRoute>} />
          <Route path="/student/profile" element={<PrivateRoute allowedRoles={['student']}><StudentProfileSettings /></PrivateRoute>} />
          <Route path="/student/notifications" element={<PrivateRoute allowedRoles={['student']}><StudentNotifications /></PrivateRoute>} />

          {/* Head Routes */}
          <Route path="/head/dashboard" element={<PrivateRoute allowedRoles={['head']}><DepartmentDashboard /></PrivateRoute>} />
          <Route path="/head/events" element={<PrivateRoute allowedRoles={['head']}><HeadEventManagement /></PrivateRoute>} />
          <Route path="/head/opportunities" element={<PrivateRoute allowedRoles={['head']}><HeadOpportunityManagement /></PrivateRoute>} />
          <Route path="/head/notifications" element={<PrivateRoute allowedRoles={['head']}><HeadNotifications /></PrivateRoute>} />
          <Route path="/head/calendar" element={<PrivateRoute allowedRoles={['head']}><HeadCalendarView /></PrivateRoute>} />
          <Route path="/head/confirmed-students" element={<PrivateRoute allowedRoles={['head']}><ConfirmedStudents /></PrivateRoute>} />

          {/* Employee Routes */}
          <Route path="/employee/dashboard" element={<PrivateRoute allowedRoles={['employee']}><EmployeeMyDashboard /></PrivateRoute>} />
          <Route path="/employee/events" element={<PrivateRoute allowedRoles={['employee']}><EmployeeEventManagement /></PrivateRoute>} />
          <Route path="/employee/calendar" element={<PrivateRoute allowedRoles={['employee']}><EmployeeCalendarView /></PrivateRoute>} />
          <Route path="/employee/profile" element={<PrivateRoute allowedRoles={['employee']}><EmployeeProfileSettings /></PrivateRoute>} />
          <Route path="/employee/notifications" element={<PrivateRoute allowedRoles={['employee']}><EmployeeNotifications /></PrivateRoute>} />
          <Route path="/employee/opportunities" element={<PrivateRoute allowedRoles={['employee']}><EmployeeOpportunityManagement /></PrivateRoute>} />

          {/* Default redirect to login if no other route matches */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
};

const AppContent = () => {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginNew />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
