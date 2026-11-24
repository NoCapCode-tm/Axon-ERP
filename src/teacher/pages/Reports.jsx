import React, { useState } from 'react';
import { ChevronDown, Download, FileText } from 'lucide-react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import styles from '../CSS/Reports.module.css';

const stats = [
  { label: 'Total Students', value: '32', detail: 'In X-A' },
  { label: 'Average Attendance', value: '87%', detail: 'This term' },
  { label: 'Average Marks', value: '71%', detail: 'This term' },
  { label: 'Assignments Submitted', value: '24', detail: 'Out of 28' },
  { label: 'Tests Conducted', value: '06', detail: 'This term' },
];

const performanceData = [
  { month: 'Jun', score: 34 },
  { month: 'Jul', score: 34 },
  { month: 'Aug', score: 34 },
  { month: 'Sep', score: 34 },
  { month: 'Oct', score: 34 },
];

const attendanceData = [
  { name: 'Present', value: 28, color: '#E5F588' },
  { name: 'Absent/late', value: 4, color: '#BDD9CB' },
];

const recentReports = [
  {
    title: 'Class X - Term 1 Performance Report',
    meta: 'PDF • OCT 18, 2025 • 1.2 MB',
  },
  {
    title: 'Class X - Term 1 Performance Report',
    meta: 'PDF • OCT 18, 2025 • 1.2 MB',
  },
  {
    title: 'Class X - Term 1 Performance Report',
    meta: 'PDF • OCT 18, 2025 • 1.2 MB',
  },
  {
    title: 'Class X - Term 1 Performance Report',
    meta: 'PDF • OCT 18, 2025 • 1.2 MB',
  },
  {
    title: 'Class X - Term 1 Performance Report',
    meta: 'PDF • OCT 18, 2025 • 1.2 MB',
  },
  {
    title: 'Class X - Term 1 Performance Report',
    meta: 'PDF • OCT 18, 2025 • 1.2 MB',
  },
  {
    title: 'Class X - Term 1 Performance Report',
    meta: 'PDF • OCT 18, 2025 • 1.2 MB',
  },
];

const filterOptions = ['This Term', 'Last 6 Months', 'This Year'];

function Reports() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Filter');

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const handleGenerate = () => {
    const statsRows = stats
      .map(
        (item) =>
          `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(item.value)}</td><td>${escapeHtml(item.detail)}</td></tr>`
      )
      .join('');
    const performanceRows = performanceData
      .map((item) => `<tr><td>${escapeHtml(item.month)}</td><td>${escapeHtml(item.score)}</td></tr>`)
      .join('');
    const attendanceRows = attendanceData
      .map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.value)}</td></tr>`)
      .join('');
    const reportRows = recentReports
      .map((item) => `<tr><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.meta)}</td></tr>`)
      .join('');

    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head><meta charset="UTF-8"></head>
        <body>
          <table border="1"><caption>Report Statistics</caption><tr><th>Label</th><th>Value</th><th>Detail</th></tr>${statsRows}</table>
          <br />
          <table border="1"><caption>Performance Overview</caption><tr><th>Month</th><th>Score</th></tr>${performanceRows}</table>
          <br />
          <table border="1"><caption>Attendance Overview</caption><tr><th>Status</th><th>Count</th></tr>${attendanceRows}</table>
          <br />
          <table border="1"><caption>Recent Reports</caption><tr><th>Title</th><th>Details</th></tr>${reportRows}</table>
        </body>
      </html>`;

    const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Teacher_Report.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const visibleReports = recentReports;

  return (
    <main className={styles.page}>
      <div className={styles.pageActions}>
        <div className={styles.filterWrap}>
          <button
            type="button"
            className={styles.filterButton}
            aria-haspopup="listbox"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((open) => !open)}
          >
            <span>{selectedFilter}</span>
            <ChevronDown size={14} aria-hidden="true" />
          </button>
          {filterOpen && (
            <div className={styles.filterMenu} role="listbox" aria-label="Report filter">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selectedFilter === option}
                  className={styles.filterOption}
                  onClick={() => {
                    setSelectedFilter(option);
                    setFilterOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" className={styles.generateButton} onClick={handleGenerate}>
          Generate Report
        </button>
      </div>

      <section className={styles.statsGrid} aria-label="Report statistics">
        {stats.map((item) => (
          <article key={item.label} className={styles.statCard}>
            <p className={styles.statLabel}>{item.label}</p>
            <p className={styles.statValue}>{item.value}</p>
            <p className={styles.statDetail}>{item.detail}</p>
          </article>
        ))}
      </section>

      <section className={styles.contentGrid}>
        <article className={`${styles.card} ${styles.performanceCard}`}>
          <div className={`${styles.cardHeader} ${styles.performanceHeader}`}>
            <h2>Performance Overview</h2>
            <span className={styles.muted}>Last 6 months</span>
          </div>
          <div className={styles.performanceMeta}>
            <span className={styles.graphLabel}>Student Performance Graph</span>
            <span className={styles.graphDate}>Oct 2025</span>
          </div>
          <div className={styles.barChartWrap}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 58, right: 6, left: 6, bottom: 0 }} barCategoryGap="18%">
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8b94a1', fontSize: 12 }}
                  dy={8}
                />
                <YAxis hide domain={[0, 100]} />
                <Bar dataKey="score" fill="#E5F588" radius={[4, 4, 4, 4]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Attendance Overview</h2>
          </div>
          <div className={styles.attendanceBody}>
            <div className={styles.donutWrap}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={76}
                    startAngle={330}
                    endAngle={-30}
                    paddingAngle={0}
                    stroke="none"
                  >
                    {attendanceData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.donutCenter}>
                <span className={styles.donutValue}>92%</span>
              </div>
            </div>
            <div className={styles.legend}>
              {attendanceData.map((entry) => (
                <div key={entry.name} className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={{ backgroundColor: entry.color }}
                    aria-hidden="true"
                  />
                  <span className={styles.legendLabel}>{entry.name}</span>
                  <span className={styles.legendCount}>({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className={`${styles.card} ${styles.reportsCard}`}>
          <div className={styles.cardHeader}>
            <h2>Recent Reports</h2>
            <button type="button" className={styles.viewAllButton}>
              View All
            </button>
          </div>
          <ul className={styles.reportList}>
            {visibleReports.map((report, index) => (
              <li key={`${report.title}-${index}`} className={styles.reportItem}>
                <div className={styles.reportIcon} aria-hidden="true">
                  <FileText size={18} />
                </div>
                <div className={styles.reportInfo}>
                  <p className={styles.reportTitle}>{report.title}</p>
                  <p className={styles.reportMeta}>{report.meta}</p>
                </div>
                <button type="button" className={styles.downloadButton} aria-label="Download report">
                  <Download size={18} />
                </button>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

export default Reports;
