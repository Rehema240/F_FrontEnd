import { useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import ChangePassword from './components/ChangePassword';
import LoadingSpinner from './components/LoadingSpinner';
import LoginNew from './components/LoginNew';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/Sidebar.css';

// Admin pages
import AdminConfirmedStudents from './pages/admin/ConfirmedStudents';
import DashboardOverview from './pages/admin/DashboardOverview';
import AdminEventManagement from './pages/admin/EventManagement';
import AdminOpportunityManagement from './pages/admin/OpportunityManagement';
import UserManagement from './pages/admin/UserManagement';

// Student pages
import BrowseEvents from './pages/student/BrowseEvents';
import BrowseOpportunity from './pages/student/BrowseOpportunity';
import StudentCalendarView from './pages/student/CalendarView';
import EventHistory from './pages/student/EventHistory';
import StudentMyDashboard from './pages/student/MyDashboard';
import StudentNotifications from './pages/student/Notifications';
import StudentProfileSettings from './pages/student/ProfileSettings';

// Head pages
import HeadCalendarView from './pages/head/CalendarView';
import ConfirmedStudents from './pages/head/ConfirmedStudents';
import DepartmentDashboard from './pages/head/DepartmentDashboard';
import HeadEventManagement from './pages/head/EventManagement';
import HeadNotifications from './pages/head/Notifications';
import HeadOpportunityManagement from './pages/head/OpportunityManagement';

// Employee pages
import EmployeeCalendarView from './pages/employee/CalendarView';
import EmployeeEventManagement from './pages/employee/EventManagement';
import EmployeeMyDashboard from './pages/employee/MyDashboard';
import EmployeeOpportunityManagement from './pages/employee/OpportunityManagement';
import EmployeeProfileSettings from './pages/employee/ProfileSettings';


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
          
          <Route path="/head/calendar" element={<PrivateRoute allowedRoles={['head']}><HeadCalendarView /></PrivateRoute>} />
          <Route path="/head/confirmed-students" element={<PrivateRoute allowedRoles={['head']}><ConfirmedStudents /></PrivateRoute>} />
          <Route path="/head/notifications" element={<PrivateRoute allowedRoles={['head']}><HeadNotifications /></PrivateRoute>} />

          {/* Employee Routes */}
          <Route path="/employee/dashboard" element={<PrivateRoute allowedRoles={['employee']}><EmployeeMyDashboard /></PrivateRoute>} />
          <Route path="/employee/events" element={<PrivateRoute allowedRoles={['employee']}><EmployeeEventManagement /></PrivateRoute>} />
          <Route path="/employee/calendar" element={<PrivateRoute allowedRoles={['employee']}><EmployeeCalendarView /></PrivateRoute>} />
          <Route path="/employee/profile" element={<PrivateRoute allowedRoles={['employee']}><EmployeeProfileSettings /></PrivateRoute>} />
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
