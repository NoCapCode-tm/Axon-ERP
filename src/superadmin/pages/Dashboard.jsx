import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { Landmark, CheckSquare, Bell, ChevronDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import styles from '../CSS/Dashboard.module.css';

//dummy data
const quickActions = [
  { id: 'add-school', label: 'Add School', to: '/superadmin/schools' },
  { id: 'send-notification', label: 'Send Notification', to: '/superadmin/notifications' },
  { id: 'add-plan', label: 'Add Plan', to: '/superadmin/subscriptions' },
  { id: 'view-reports', label: 'View Reports', to: '/superadmin/analytics' },
];

const stats = [
  { id: 'schools', label: 'Total Schools', value: '142', hint: '8% active.' },
  { id: 'subs', label: 'Active Subscription', value: '142', hint: '8% active.' },
  { id: 'revenue', label: 'Monthly Revenue', value: '5L', hint: '8% active.' },
  { id: 'users', label: 'Total Users', value: '4532', hint: '8% active.' },
];

const years = ['2024-2025', '2025-2026'];

const planRevenue = [
  { label: 'Basic', value: 0.93 },
  { label: 'Pro', value: 1.5 },
  { label: 'Elite', value: 1.19 },
  { label: 'Advanced', value: 0.79 },
  { label: 'Enterprise', value: 0.58 },
];

const monthlyRevenue = [
  { label: 'Jan', value: 3.3 }, { label: 'Feb', value: 4.5 }, { label: 'Mar', value: 2.8 },
  { label: 'Apr', value: 3.7 }, { label: 'May', value: 1.5 }, { label: 'Jun', value: 3.3 },
  { label: 'Jul', value: 4.0 }, { label: 'Aug', value: 3.3 }, { label: 'Sep', value: 4.0 },
  { label: 'Oct', value: 5.0 },
];

const revenueTrend = [
  { label: 'Jan', value: 38 }, { label: 'Feb', value: 55 }, { label: 'Mar', value: 40 },
  { label: 'Apr', value: 45 }, { label: 'May', value: 65 }, { label: 'Jun', value: 88 },
  { label: 'Jul', value: 90 }, { label: 'Aug', value: 78 }, { label: 'Sep', value: 62 },
  { label: 'Oct', value: 55 }, { label: 'Nov', value: 60 }, { label: 'Dec', value: 100 },
];

const activity = Array.from({ length: 5 }, (_, i) => ({
  id: `act${i}`, title: 'New school added', meta: 'Sunrise International School', time: '2 min ago', unread: i === 0,
}));

const alerts = Array.from({ length: 5 }, (_, i) => ({
  id: `alert${i}`, title: 'Subscription renewed', meta: 'Heritage Academy - Pro Plan', time: '1 hr ago', unread: i === 0,
}));

//chart colors 
const LIME = '#e4f77c';
const MINT = '#d5f5e3';
const tick = { fontSize: 14, fill: '#6b7280' };

function SectionCard({ title, actionLabel, onAction, aside, children }) {
  return (
    <section className={styles.card}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {actionLabel && <button type="button" className={styles.btn} onClick={onAction}>{actionLabel}</button>}
        {aside}
      </header>
      {children}
    </section>
  );
}

// Card with the year dropdown.
function ChartCard({ title, children }) {
  const [year, setYear] = useState(years[years.length - 1]);
  const dropdown = (
    <label className={styles.select}>
      <span className={styles.srOnly}>Year for {title}</span>
      <select value={year} onChange={(e) => setYear(e.target.value)}>
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
      <ChevronDown size={18} aria-hidden="true" />
    </label>
  );
  return (
    <SectionCard title={title} aside={dropdown}>
      <div className={styles.chartBox}>{typeof children === 'function' ? children(year) : children}</div>
    </SectionCard>
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

function RevenueBars({ data, highlightIndex }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }} barCategoryGap="10%">
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={tick} />
        <YAxis hide domain={[0, 'dataMax']} />
        <Tooltip cursor={{ fill: 'transparent' }} formatter={(v) => [`₹${v}L`, 'Revenue']} />
        <Bar dataKey="value">
          {data.map((d, i) => <Cell key={d.label} fill={i === highlightIndex ? LIME : MINT} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function TrendArea({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={LIME} stopOpacity={0.9} />
            <stop offset="100%" stopColor={LIME} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={tick} />
        <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} axisLine={false} tickLine={false} tick={tick} width={36} />
        <Tooltip formatter={(v) => [v, 'Revenue']} />
        <Area type="monotone" dataKey="value" stroke="none" fill="url(#trendFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function FeedList({ items, icon: Icon }) {
  return (
    <ul className={styles.list}>
      {items.map((it) => (
        <li key={it.id} className={`${styles.feedItem} ${it.unread ? styles.highlight : ''}`}>
          <Icon size={26} aria-hidden="true" />
          <div className={styles.feedText}>
            <p className={styles.rowTitle}>{it.title}</p>
            <p className={styles.rowMeta}>{it.meta}</p>
          </div>
          <span className={styles.time}>{it.time}</span>
        </li>
      ))}
    </ul>
  );
}

// page 
export default function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const planHighlight = planRevenue.reduce((best, d, i, arr) => (d.value > arr[best].value ? i : best), 0);

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.page}>
        <Topbar
          title="Dashboard"
          subtitle="Academic year 2025-2026"
          onMenuClick={() => setMenuOpen(true)}
        />

        <div className={styles.actions}>
          {quickActions.map((a) => (
            <button key={a.id} type="button" className={styles.btn} onClick={() => navigate(a.to)}>{a.label}</button>
          ))}
        </div>

        <div className={styles.stats}>
          {stats.map((s) => <StatCard key={s.id} {...s} />)}
        </div>

        <div className={styles.grid}>
          <div className={styles.charts}>
            <ChartCard title="Plan-wise Revenue">
              {() => <RevenueBars data={planRevenue} highlightIndex={planHighlight} />}
            </ChartCard>

            <ChartCard title="Monthly Revenue Overview">
              {() => <RevenueBars data={monthlyRevenue} highlightIndex={monthlyRevenue.length - 1} />}
            </ChartCard>

            <ChartCard title="Revenue Trend">
              {() => <TrendArea data={revenueTrend} />}
            </ChartCard>
          </div>

          <div className={styles.side}>
            <SectionCard title="Recently Activity" actionLabel="View More" onAction={() => navigate('/superadmin/schools')}>
              <FeedList items={activity} icon={Landmark} />
            </SectionCard>

            <SectionCard
              title="Alerts"
              aside={<span className={styles.bellBadge}><Bell size={20} aria-hidden="true" /></span>}
            >
              <FeedList items={alerts} icon={CheckSquare} />
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}