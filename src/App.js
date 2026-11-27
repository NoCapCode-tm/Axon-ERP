
import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import PageSkeleton from "./shared/components/PageSkeleton";
import "./App.css";

// --- SUPERADMIN MODULES ---
const SuperAdminDashboard = React.lazy(
  () => import("./superadmin/pages/Dashboard")
);
const SuperAdminAnalytics = React.lazy(
  () => import("./superadmin/pages/Analytics")
);
const SuperAdminFeatureControl = React.lazy(
  () => import("./superadmin/pages/FeatureControl")
);
const SuperAdminSchoollist = React.lazy(
  () => import("./superadmin/pages/Schoollist")
);
const SuperAdminUserlist = React.lazy(
  () => import("./superadmin/pages/Userlist")
);
const SuperAdminSettings = React.lazy(
  () => import("./superadmin/pages/Settings")
);
const SuperAdminSubscription = React.lazy(
  () => import("./superadmin/pages/Subscription")
);
const SuperAdminTicket = React.lazy(
  () => import("./superadmin/pages/Ticket")
);
const SuperAdminNotification = React.lazy(
  () => import("./superadmin/pages/Notification")
);

// --- SCHOOL ADMIN MODULES ---
const AdminDashboard = React.lazy(
  () => import("./admin/pages/Dashboard")
);
const AdminStudentDirectory = React.lazy(
  () => import("./admin/pages/StudentDirectory")
);
const AdminStaffManagement = React.lazy(
  () => import("./admin/pages/StaffManagement")
);
const AdminAcademicStructure = React.lazy(
  () => import("./admin/pages/AcademicStructure")
);
const AdminTimetable = React.lazy(
  () => import("./admin/pages/Timetable")
);
const AdminAttendance = React.lazy(
  () => import("./admin/pages/Attendance")
);
const AdminExams = React.lazy(
  () => import("./admin/pages/Exams")
);
const AdminFinance = React.lazy(
  () => import("./admin/pages/Finance")
);
const AdminLMS = React.lazy(
  () => import("./admin/pages/LMS")
);
const AdminReports = React.lazy(
  () => import("./admin/pages/Reports")
);
const AdminCalendar = React.lazy(
  () => import("./admin/pages/Calendar")
);
const AdminSettings = React.lazy(
  () => import("./admin/pages/Settings")
);

// --- TEACHER MODULES ---
const TeacherLayout = React.lazy(
  () => import("./teacher/components/TeacherLayout")
);
const TeacherDashboard = React.lazy(
  () => import("./teacher/pages/Dashboard")
);
const TeacherNotifications = React.lazy(
  () => import("./teacher/pages/Notifications")
);
const TeacherSettings = React.lazy(
  () => import("./teacher/pages/Settings")
);
const TeacherSchedule = React.lazy(
  () => import("./teacher/pages/Schedule")
);
const TeacherAttendance = React.lazy(
  () => import("./teacher/pages/Attendance")
);
const TeacherLMS = React.lazy(
  () => import("./teacher/pages/LMS")
);
const TeacherStudentMaterial = React.lazy(
  () => import("./teacher/pages/StudentMaterial")
);
const TeacherExams = React.lazy(
  () => import("./teacher/pages/Exams")
);
const TeacherStudyProfiles = React.lazy(
  () => import("./teacher/pages/StudyProfiles")
);
const TeacherReports = React.lazy(
  () => import("./teacher/pages/Reports")
);
const TeacherCalendar = React.lazy(
  () => import("./teacher/pages/Calendar")
);

// --- STUDENT MODULES ---
const StudentDashboard = React.lazy(
  () => import("./student/pages/Dashboard")
);
const StudentTimetable = React.lazy(
  () => import("./student/pages/Timetable")
);
const StudentAssignments = React.lazy(
  () => import("./student/pages/Assignments")
);
const StudentAttendance = React.lazy(
  () => import("./student/pages/Attendance")
);
const StudentExams = React.lazy(
  () => import("./student/pages/Exams")
);
const StudentStudyMaterial = React.lazy(
  () => import("./student/pages/StudyMaterial")
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          {/* Root route */}
          <Route
            path="/"
            element={<Navigate to="/superadmin/dashboard" replace />}
          />

          {/* SUPERADMIN ROUTES */}
          <Route
            path="/superadmin/dashboard"
            element={<SuperAdminDashboard />}
          />
          <Route
            path="/superadmin/analytics"
            element={<SuperAdminAnalytics />}
          />
          <Route
            path="/superadmin/feature-control"
            element={<SuperAdminFeatureControl />}
          />
          <Route
            path="/superadmin/notifications"
            element={<SuperAdminNotification />}
          />
          <Route
            path="/superadmin/schools"
            element={<SuperAdminSchoollist />}
          />
          <Route
            path="/superadmin/users"
            element={<SuperAdminUserlist />}
          />
          <Route
            path="/superadmin/settings"
            element={<SuperAdminSettings />}
          />
          <Route
            path="/superadmin/subscriptions"
            element={<SuperAdminSubscription />}
          />
          <Route
            path="/superadmin/tickets"
            element={<SuperAdminTicket />}
          />

          {/* SCHOOL ADMIN ROUTES */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/students"
            element={<AdminStudentDirectory />}
          />
          <Route
            path="/admin/staff"
            element={<AdminStaffManagement />}
          />
          <Route
            path="/admin/academic-structure"
            element={<AdminAcademicStructure />}
          />
          <Route
            path="/admin/timetable"
            element={<AdminTimetable />}
          />
          <Route
            path="/admin/attendance"
            element={<AdminAttendance />}
          />
          <Route
            path="/admin/exams"
            element={<AdminExams />}
          />
          <Route
            path="/admin/finance"
            element={<AdminFinance />}
          />
          <Route
            path="/admin/lms"
            element={<AdminLMS />}
          />
          <Route
            path="/admin/reports"
            element={<AdminReports />}
          />
          <Route
            path="/admin/calendar"
            element={<AdminCalendar />}
          />
          <Route
            path="/admin/settings"
            element={<AdminSettings />}
          />

          {/* TEACHER ROUTES */}
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route
              index
              element={<Navigate to="dashboard" replace />}
            />
            <Route
              path="dashboard"
              element={<TeacherDashboard />}
            />
            <Route
              path="notifications"
              element={<TeacherNotifications />}
            />
            <Route
              path="settings"
              element={<TeacherSettings />}
            />
            <Route
              path="schedule"
              element={<TeacherSchedule />}
            />
            <Route
              path="attendance"
              element={<TeacherAttendance />}
            />
            <Route
              path="lms"
              element={<TeacherLMS />}
            />
            <Route
              path="student-material"
              element={<TeacherStudentMaterial />}
            />
            <Route
              path="exams"
              element={<TeacherExams />}
            />
            <Route
              path="study-profiles"
              element={<TeacherStudyProfiles />}
            />
            <Route
              path="reports"
              element={<TeacherReports />}
            />
            <Route
              path="calendar"
              element={<TeacherCalendar />}
            />
          </Route>

          {/* STUDENT ROUTES */}
          <Route
            path="/student"
            element={<Navigate to="/student/dashboard" replace />}
          />
          <Route
            path="/student/dashboard"
            element={<StudentDashboard />}
          />
          <Route
            path="/student/timetable"
            element={<StudentTimetable />}
          />
          <Route
            path="/student/assignments"
            element={<StudentAssignments />}
          />
          <Route
            path="/student/attendance"
            element={<StudentAttendance />}
          />
          <Route
            path="/student/exams"
            element={<StudentExams />}
          />
          <Route
            path="/student/study-material"
            element={<StudentStudyMaterial />}
          />

          {/* 404 ROUTE */}
          <Route
            path="*"
            element={
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
