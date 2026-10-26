import React, { useCallback, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import TeacherTopbar from './TeacherTopbar';
import TeacherMessages from '../pages/Messages';
import TeacherSchedule from '../pages/Schedule';
import styles from '../CSS/Dashboard.module.css';

function TeacherLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    setMessagesOpen(false);
    setScheduleOpen(false);
  }, []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const openMessages = useCallback(() => {
    setSidebarOpen(false);
    setScheduleOpen(false);
    setMessagesOpen(true);
  }, []);
  const openSchedule = useCallback(() => {
    setMessagesOpen(false);
    setScheduleOpen(true);
  }, []);
  const closeMessages = useCallback(() => {
    setMessagesOpen(false);
    setScheduleOpen(false);
  }, []);
  const pageTitle = messagesOpen
    ? 'Message'
    : scheduleOpen
      ? 'Class Schedule'
    : location.pathname === '/teacher/notifications'
      ? 'Notification'
      : undefined;

  return (
    <div className={styles.app}>
      <TeacherSidebar
        open={sidebarOpen}
        onClose={closeSidebar}
        onScheduleClick={openSchedule}
        scheduleActive={scheduleOpen}
      />
      <div className={styles.workspace}>
        <TeacherTopbar
          title={pageTitle}
          onMenuClick={openSidebar}
          onMessagesClick={openMessages}
          onRouteAction={closeMessages}
          menuOpen={sidebarOpen}
          messagesActive={messagesOpen}
          notificationsActive={location.pathname === '/teacher/notifications'}
        />
        {messagesOpen ? <TeacherMessages /> : scheduleOpen ? <TeacherSchedule /> : <Outlet />}
      </div>
    </div>
  );
}

export default TeacherLayout;
