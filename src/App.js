import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginNew from './components/LoginNew';
import Sidebar from './components/Sidebar';
import './styles/Sidebar.css';
import './App.css';

// Admin pages
import DashboardOverview from './pages/admin/DashboardOverview';
import AdminEventManagement from './pages/admin/EventManagement';
import AdminOpportunityManagement from './pages/admin/OpportunityManagement';
import UserManagement from './pages/admin/UserManagement';
import AdminNotifications from './pages/admin/Notifications';

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

// Employee pages
import EmployeeMyDashboard from './pages/employee/MyDashboard';
import EmployeeEventManagement from './pages/employee/EventManagement';
import EmployeeCalendarView from './pages/employee/CalendarView';
import EmployeeProfileSettings from './pages/employee/ProfileSettings';
import EmployeeNotifications from './pages/employee/Notifications';


const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; // Create an unauthorized page later
  }

  return children;
};


function App() {
  const { user, loading, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <div>Loading application...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && (
          <Sidebar
            isCollapsed={isCollapsed}
            userRole={user.role}
            currentUser={user}
            handleToggle={handleToggle}
            handleLogout={handleLogout}
          />
        )}
        <main className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
          <Routes>
            <Route path="/login" element={<LoginNew />} />
            <Route path="/unauthorized" element={<div>Unauthorized Access</div>} /> {/* Placeholder */}

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><DashboardOverview /></PrivateRoute>} />
            <Route path="/admin/events" element={<PrivateRoute allowedRoles={['admin']}><AdminEventManagement /></PrivateRoute>} />
            <Route path="/admin/opportunities" element={<PrivateRoute allowedRoles={['admin']}><AdminOpportunityManagement /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute allowedRoles={['admin']}><UserManagement /></PrivateRoute>} />
            <Route path="/admin/notifications" element={<PrivateRoute allowedRoles={['admin']}><AdminNotifications /></PrivateRoute>} />

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

            {/* Employee Routes */}
            <Route path="/employee/dashboard" element={<PrivateRoute allowedRoles={['employee']}><EmployeeMyDashboard /></PrivateRoute>} />
            <Route path="/employee/events" element={<PrivateRoute allowedRoles={['employee']}><EmployeeEventManagement /></PrivateRoute>} />
            <Route path="/employee/calendar" element={<PrivateRoute allowedRoles={['employee']}><EmployeeCalendarView /></PrivateRoute>} />
            <Route path="/employee/profile" element={<PrivateRoute allowedRoles={['employee']}><EmployeeProfileSettings /></PrivateRoute>} />
            <Route path="/employee/notifications" element={<PrivateRoute allowedRoles={['employee']}><EmployeeNotifications /></PrivateRoute>} />

            {/* Default redirect to login if no other route matches */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
