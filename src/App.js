import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router';
import Dashboard from './superadmin/pages/Dashboard';
import Ticket from './superadmin/pages/Ticket';
import Subscription from './superadmin/pages/Subscription';
import Settings from './superadmin/pages/Settings';
import Userlist from './superadmin/pages/Userlist';
import Schoollist from './superadmin/pages/Schoollist';
import Notification from './superadmin/pages/Notification';
import FeatureControl from './superadmin/pages/FeatureControl';
import Analytics from './superadmin/pages/Analytics';
import TeacherDashboard from './teacher/pages/Dashboard';
import TeacherLayout from './teacher/components/TeacherLayout';
import TeacherNotifications from './teacher/pages/Notifications';
import TeacherSettings from './teacher/pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/superadmin/dashboard" element={<Dashboard/>}/>
        <Route path="/superadmin/analytics" element={<Analytics/>}/>
        <Route path="/superadmin/feature-control" element={<FeatureControl/>}/>
        <Route path="/superadmin/notifications" element={<Notification/>}/>
        <Route path="/superadmin/schools" element={<Schoollist/>}/>
        <Route path="/superadmin/users" element={<Userlist/>}/>
        <Route path="/superadmin/settings" element={<Settings/>}/>
        <Route path="/superadmin/subscriptions" element={<Subscription/>}/>
        <Route path="/superadmin/tickets" element={<Ticket/>}/>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="notifications" element={<TeacherNotifications />} />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
