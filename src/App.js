import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageSkeleton from './shared/components/PageSkeleton';
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
const AdminStudentDirectory = React.lazy(() => import('./admin/pages/StudentDirectory'));
const AdminStaffManagement = React.lazy(() => import('./admin/pages/StaffManagement'));
const AdminAcademicStructure = React.lazy(() => import('./admin/pages/AcademicStructure'));
const AdminTimetable = React.lazy(() => import('./admin/pages/Timetable'));
const AdminAttendance = React.lazy(() => import('./admin/pages/Attendance'));
const AdminExams = React.lazy(() => import('./admin/pages/Exams'));
const AdminFinance = React.lazy(() => import('./admin/pages/Finance'));
const AdminLMS = React.lazy(() => import('./admin/pages/LMS'));
const AdminReports = React.lazy(() => import('./admin/pages/Reports'));
const AdminCalendar = React.lazy(() => import('./admin/pages/Calendar'));
const AdminSettings = React.lazy(() => import('./admin/pages/Settings'));

// --- TEACHER MODULES ---
const TeacherDashboard = React.lazy(() => import('./teacher/pages/Dashboard'));
const TeacherSchedule = React.lazy(() => import('./teacher/pages/Schedule'));
const TeacherAttendance = React.lazy(() => import('./teacher/pages/Attendance'));
const TeacherLMS = React.lazy(() => import('./teacher/pages/LMS'));
const TeacherStudentMaterial = React.lazy(() => import('./teacher/pages/StudentMaterial'));
const TeacherExams = React.lazy(() => import('./teacher/pages/Exams'));
const TeacherStudyProfiles = React.lazy(() => import('./teacher/pages/StudyProfiles'));
const TeacherReports = React.lazy(() => import('./teacher/pages/Reports'));
const TeacherCalendar = React.lazy(() => import('./teacher/pages/Calendar'));

// --- STUDENT MODULES ---
const StudentDashboard = React.lazy(() => import('./student/pages/Dashboard'));
const StudentTimetable = React.lazy(() => import('./student/pages/Timetable'));
const StudentAssignments = React.lazy(() => import('./student/pages/Assignments'));
const StudentAttendance = React.lazy(() => import('./student/pages/Attendance'));
const StudentExams = React.lazy(() => import('./student/pages/Exams'));
const StudentStudyMaterial = React.lazy(() => import('./student/pages/StudyMaterial'));

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
          <Route path="/admin/students" element={<AdminStudentDirectory />} />
          <Route path="/admin/staff" element={<AdminStaffManagement />} />
          <Route path="/admin/academic-structure" element={<AdminAcademicStructure />} />
          <Route path="/admin/timetable" element={<AdminTimetable />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/exams" element={<AdminExams />} />
          <Route path="/admin/finance" element={<AdminFinance />} />
          <Route path="/admin/lms" element={<AdminLMS />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* TEACHER ROUTES */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/schedule" element={<TeacherSchedule />} />
          <Route path="/teacher/attendance" element={<TeacherAttendance />} />
          <Route path="/teacher/lms" element={<TeacherLMS />} />
          <Route path="/teacher/student-material" element={<TeacherStudentMaterial />} />
          <Route path="/teacher/exams" element={<TeacherExams />} />
          <Route path="/teacher/study-profiles" element={<TeacherStudyProfiles />} />
          <Route path="/teacher/reports" element={<TeacherReports />} />
          <Route path="/teacher/calendar" element={<TeacherCalendar />} />

          {/* STUDENT ROUTES */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/timetable" element={<StudentTimetable />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/exams" element={<StudentExams />} />
          <Route path="/student/study-material" element={<StudentStudyMaterial />} />
          
        </Routes>
      </Suspense>
    </Router>
  );
}





export default App;