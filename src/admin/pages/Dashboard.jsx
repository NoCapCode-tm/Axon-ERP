import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis,
} from 'recharts';
import { ChevronDown, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import styles from '../CSS/Dashboard.module.css';

/* ---------- dummy data (replace with API data) ---------- */

const quickActions = [
  { id: 'add-students', label: 'Add Students', to: '/admin/students' },
  { id: 'add-teacher', label: 'Add Teacher', to: '/admin/staff' },
  { id: 'create-timetable', label: 'Create Timetable', to: '/admin/timetable' },
  { id: 'collect-fees', label: 'Collect Fees', to: '/admin/finance' },
];

const stats = [
  { id: 'students', label: 'Total Students', value: '1240', hint: '20 joined this month' },
  { id: 'teachers', label: 'Total Teachers', value: '84', hint: 'Across all departments' },
  { id: 'sections', label: 'Total Sections', value: '42', hint: 'No change' },
  { id: 'attendance', label: 'Total Attendance', value: '96.2%', hint: 'Overall percentage' },
];

const roles = ['Student', 'Teacher'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const attendanceData = {
  Student: [52, 78, 50, 68, 50, 45, 60, 50, 80, 50, 62],
  Teacher: [90, 94, 92, 96, 91, 95, 93, 97, 94, 92, 95],
};

const years = ['2025', '2026'];

const studentSplit = [
  { name: 'Male', value: 8000, fill: '#b8d8c8' },   // inner ring
  { name: 'Female', value: 12000, fill: '#e4f77c' }, // outer ring
];
const TOTAL_STUDENTS = 20000;

// values in lakhs (L)
const feeData = {
  '2025': [
    { term: 'Term 1', collected: 26, pending: 24, overdue: 10 },
    { term: 'Term 2', collected: 28, pending: 22, overdue: 9 },
    { term: 'Term 3', collected: 24, pending: 26, overdue: 11 },
    { term: 'Term 4', collected: 27, pending: 23, overdue: 8 },
  ],
  '2026': [
    { term: 'Term 1', collected: 28, pending: 28, overdue: 10 },
    { term: 'Term 2', collected: 30, pending: 26, overdue: 9 },
    { term: 'Term 3', collected: 32, pending: 24, overdue: 8 },
    { term: 'Term 4', collected: 29, pending: 27, overdue: 12 },
  ],
};

const feeSeries = [
  { key: 'collected', label: 'Collected', color: '#c9db78' },
  { key: 'pending', label: 'Pending', color: '#e4f77c' },
  { key: 'overdue', label: 'Overdue', color: '#b8d8c8' },
];

/* ---------- chart styling ---------- */

const LIME = '#e4f77c';
const tick = { fontSize: 14, fill: '#14181f' };

function useIsMobile(query = '(max-width: 640px)') {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatch(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return match;
}

/* ---------- small building blocks ---------- */

function Select({ label, value, onChange, options, variant = 'plain' }) {
  return (
    <label className={`${styles.select} ${variant === 'lime' ? styles.selectLime : styles.selectPlain}`}>
      <span className={styles.srOnly}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={18} aria-hidden="true" />
    </label>
  );
}

function SectionCard({ title, aside, className = '', children }) {
  return (
    <section className={`${styles.card} ${className}`}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {aside}
      </header>
      {children}
    </section>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className={`${styles.card} ${styles.stat}`}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statHint}>{hint}</p>
    </div>
  );
}

/* ---------- charts ---------- */

function AttendanceChart({ role, month, isMobile }) {
  const data = attendanceData[role].map((value, i) => ({
    label: isMobile ? String(i + 1) : `${i + 1} ${month}`,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={LIME} stopOpacity={0.95} />
            <stop offset="100%" stopColor={LIME} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={tick} interval={0} />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
          axisLine={false}
          tickLine={false}
          tick={tick}
          width={36}
        />
        <Tooltip formatter={(v) => [`${v}%`, 'Attendance']} />
        <Area type="monotone" dataKey="value" stroke={LIME} strokeWidth={2} fill="url(#attendanceFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function StudentDistribution() {
  const female = studentSplit.find((s) => s.name === 'Female');
  const male = studentSplit.find((s) => s.name === 'Male');

  return (
    <div className={styles.donutWrap}>
      <div className={styles.donutBox}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={studentSplit}
            innerRadius="55%"
            outerRadius="100%"
            barSize={20}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, TOTAL_STUDENTS]} tick={false} />
            <RadialBar dataKey="value" background={{ fill: '#f5f5f5' }} cornerRadius={20} />
            <Tooltip formatter={(v, name) => [v.toLocaleString('en-IN'), name]} />
          </RadialBarChart>
        </ResponsiveContainer>
        <p className={styles.donutCenter}>
          {TOTAL_STUDENTS}
          <br />
          Students
        </p>
      </div>

      <ul className={styles.legend}>
        <li><span className={styles.dot} style={{ background: female.fill }} />
          <span><strong>{female.value}</strong><br />Female</span></li>
        <li><span className={styles.dot} style={{ background: male.fill }} />
          <span><strong>{male.value}</strong><br />Male</span></li>
      </ul>
    </div>
  );
}

function FeeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }} barCategoryGap="22%" barGap={6}>
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="term" axisLine={false} tickLine={false} tick={tick} />
        <YAxis
          domain={[0, 80]}
          ticks={[0, 20, 40, 60, 80]}
          tickFormatter={(v) => (v === 0 ? '0' : `${v}L`)}
          axisLine={false}
          tickLine={false}
          tick={tick}
          width={44}
        />
        <Tooltip cursor={{ fill: 'transparent' }} formatter={(v, name) => [`₹${v}L`, name]} />
        {feeSeries.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={s.color}
            radius={20}
            maxBarSize={20}
            background={{ fill: '#f8f8f8', radius: 20 }}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- page ---------- */

export default function Dashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [menuOpen, setMenuOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState('');

  const [role, setRole] = useState('Student');
  const [month, setMonth] = useState('Jan');
  const [feeYear, setFeeYear] = useState(years[years.length - 1]);

  const goTo = (to) => { setOptionsOpen(false); navigate(to); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/admin/students?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.page}>
        <Topbar
          title="Dashboard"
          subtitle="Academic Year 2025 - 26"
          onMenuClick={() => setMenuOpen(true)}
        />

        {/* search: tablet + mobile only */}
        <form className={styles.search} onSubmit={handleSearch} role="search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student by name"
            aria-label="Search student by name"
          />
          <button type="submit" aria-label="Search"><Search size={26} /></button>
        </form>

        {/* quick actions: row on laptop/tablet, dropdown on mobile */}
        <div className={styles.actions}>
          {quickActions.map((a) => (
            <button key={a.id} type="button" className={styles.btn} onClick={() => goTo(a.to)}>{a.label}</button>
          ))}
        </div>

        <div className={styles.optionsWrap}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnIcon}`}
            aria-expanded={optionsOpen}
            onClick={() => setOptionsOpen((o) => !o)}
          >
            Options <ChevronDown size={18} aria-hidden="true" />
          </button>
          {optionsOpen && (
            <div className={styles.menu} role="menu">
              {quickActions.map((a) => (
                <button key={a.id} role="menuitem" onClick={() => goTo(a.to)}>{a.label}</button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.stats}>
          {stats.map((s) => <StatCard key={s.id} {...s} />)}
        </div>

        <SectionCard
          title="Attendance Trend"
          aside={
            <>
              {/* laptop/tablet: two selects */}
              <div className={styles.filters}>
                <Select label="Attendance for" value={role} onChange={setRole} options={roles} />
                <Select label="Month" value={month} onChange={setMonth} options={months} />
              </div>

              {/* mobile: single Filter button */}
              <div className={styles.filterWrap}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnIcon}`}
                  aria-expanded={filterOpen}
                  onClick={() => setFilterOpen((o) => !o)}
                >
                  Filter <ChevronDown size={18} aria-hidden="true" />
                </button>
                {filterOpen && (
                  <div className={styles.filterPanel}>
                    <Select label="Attendance for" value={role} onChange={setRole} options={roles} />
                    <Select label="Month" value={month} onChange={setMonth} options={months} />
                  </div>
                )}
              </div>
            </>
          }
        >
          <div className={styles.chartBox}>
            <AttendanceChart role={role} month={month} isMobile={isMobile} />
          </div>
        </SectionCard>

        <div className={styles.row}>
          <SectionCard title="Student Distribution" className={styles.distribution}>
            <StudentDistribution />
          </SectionCard>

          <SectionCard
            title="Fee Collection"
            aside={<Select label="Year for fee collection" value={feeYear} onChange={setFeeYear} options={years} variant="lime" />}
          >
            <div className={styles.chartBox}>
              <FeeChart data={feeData[feeYear]} />
            </div>
            <ul className={`${styles.legend} ${styles.legendRow}`}>
              {feeSeries.map((s) => (
                <li key={s.key}><span className={styles.swatch} style={{ background: s.color }} />{s.label}</li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}