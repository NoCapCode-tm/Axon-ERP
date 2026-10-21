import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageSkeleton from './shared/components/PageSkeleton';
import './App.css';

// --- SUPERADMIN MODULES ---
const SuperAdminDashboard = React.lazy(() => import('./superadmin/pages/Dashboard'));
const SuperAdminAnalytics = React.lazy(() => import('./superadmin/pages/Analytics'));
const SuperAdminFeatureControl = React.lazy(() => import('./superadmin/pages/FeatureControl'));
const SuperAdminSchoollist = React.lazy(() => import('./superadmin/pages/Schoollist'));
const SuperAdminUserlist = React.lazy(() => import('./superadmin/pages/Userlist'));
const SuperAdminSettings = React.lazy(() => import('./superadmin/pages/Settings'));
const SuperAdminSubscription = React.lazy(() => import('./superadmin/pages/Subscription'));
const SuperAdminTicket = React.lazy(() => import('./superadmin/pages/Ticket'));
const SuperAdminNotification = React.lazy(() => import('./superadmin/pages/Notification'));

// --- SCHOOL ADMIN MODULES ---
const AdminDashboard = React.lazy(() => import('./admin/pages/Dashboard'));
const AdminFinance = React.lazy(() => import('./admin/pages/Finance'));
const AdminSettings = React.lazy(() => import('./admin/pages/Settings'));
const AdminStaffManagement = React.lazy(() => import('./admin/pages/StaffManagement'));
const AdminStudentDirectory = React.lazy(() => import('./admin/pages/StudentDirectory'));

// --- TEACHER MODULES ---
const TeacherDashboard = React.lazy(() => import('./teacher/pages/Dashboard'));
const TeacherAssignments = React.lazy(() => import('./teacher/pages/Assignments'));
const TeacherClasses = React.lazy(() => import('./teacher/pages/Classes'));
const TeacherGrading = React.lazy(() => import('./teacher/pages/Grading'));
const TeacherMessages = React.lazy(() => import('./teacher/pages/Messages'));

// --- STUDENT MODULES ---
const StudentDashboard = React.lazy(() => import('./student/pages/Dashboard'));
const StudentAssignments = React.lazy(() => import('./student/pages/Assignments'));
const StudentGrades = React.lazy(() => import('./student/pages/Grades'));
const StudentMyCourses = React.lazy(() => import('./student/pages/MyCourses'));
const StudentSchedule = React.lazy(() => import('./student/pages/Schedule'));

function App() {
  return (
    <Router>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          {/* Add a login route later: <Route path="/" element={<Login />} /> */}
          
          {/* SUPERADMIN ROUTES */}
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/analytics" element={<SuperAdminAnalytics />} />
          <Route path="/superadmin/feature-control" element={<SuperAdminFeatureControl />} />
          <Route path="/superadmin/schools" element={<SuperAdminSchoollist />} />
          <Route path="/superadmin/users" element={<SuperAdminUserlist />} />
          <Route path="/superadmin/settings" element={<SuperAdminSettings />} />
          <Route path="/superadmin/subscriptions" element={<SuperAdminSubscription />} />
          <Route path="/superadmin/tickets" element={<SuperAdminTicket />} />
          <Route path="/superadmin/notifications" element={<SuperAdminNotification />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/finance" element={<AdminFinance />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/staff" element={<AdminStaffManagement />} />
          <Route path="/admin/students" element={<AdminStudentDirectory />} />

          {/* TEACHER ROUTES */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />
          <Route path="/teacher/classes" element={<TeacherClasses />} />
          <Route path="/teacher/grading" element={<TeacherGrading />} />
          <Route path="/teacher/messages" element={<TeacherMessages />} />

          {/* STUDENT ROUTES */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/grades" element={<StudentGrades />} />
          <Route path="/student/courses" element={<StudentMyCourses />} />
          <Route path="/student/schedule" element={<StudentSchedule />} />
          
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;