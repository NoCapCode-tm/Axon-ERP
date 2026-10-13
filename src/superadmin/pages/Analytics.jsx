import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { ChevronDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import styles from '../CSS/Analytics.module.css';

// dummy data (replace with API)
const years = ['2024-2025', '2025-2026'];

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

const planRevenue = [
  { label: 'Basic', value: 0.93 },
  { label: 'Pro', value: 1.5 },
  { label: 'Elite', value: 1.19 },
  { label: 'Advanced', value: 0.79 },
  { label: 'Enterprise', value: 0.58 },
];

const topSchools = [
  { id: 1, name: 'Delhi Public School', amount: 820000 },
  { id: 2, name: 'Delhi Public School', amount: 760000 },
  { id: 3, name: 'Delhi Public School', amount: 640000 },
  { id: 4, name: 'Delhi Public School', amount: 510000 },
];

const payments = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  school: 'Greenfield Public School',
  amount: 1200000,
  date: '1 Apr 2025',
  status: i === 2 ? 'Pending' : i === 4 ? 'Failed' : 'Paid',
  plan: 'Elite',
  mode: 'Net banking',
}));

// helpers
const LIME = '#e4f77c';
const MINT = '#d5f5e3';
const tick = { fontSize: 14, fill: '#6b7280' };
const smallTick = { fontSize: 12, fill: '#6b7280' };

const formatFull = (n) => n.toLocaleString('en-IN'); // 12,00,000
const formatShort = (n) => new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(n); // 12L

// pieces
function ChartCard({ title, children }) {
  const [year, setYear] = useState(years[years.length - 1]);
  return (
    <section className={styles.card}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <label className={styles.select}>
          <span className={styles.srOnly}>Year for {title}</span>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown size={18} aria-hidden="true" />
        </label>
      </header>
      {/* TODO: fetch data for `year` and pass it into the chart */}
      <div className={styles.chartBox}>{children(year)}</div>
    </section>
  );
}

function RevenueBars({ data, highlightIndex, small }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }} barCategoryGap="10%">
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={small ? smallTick : tick} interval={0} />
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
          <linearGradient id="analyticsTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={LIME} stopOpacity={0.9} />
            <stop offset="100%" stopColor={LIME} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={tick} interval={0} />
        <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} axisLine={false} tickLine={false} tick={tick} width={36} />
        <Tooltip formatter={(v) => [v, 'Revenue']} />
        <Area type="monotone" dataKey="value" stroke="none" fill="url(#analyticsTrendFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function TopSchools() {
  const max = Math.max(...topSchools.map((s) => s.amount));
  return (
    <section className={styles.card}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Top paying schools</h2>
      </header>
      <ul className={styles.topList}>
        {topSchools.map((s) => {
          const pct = Math.round((s.amount / max) * 100);
          return (
            <li key={s.id} className={styles.topItem}>
              <div className={styles.topRow}>
                <span>{s.name}</span>
                <span>{formatFull(s.amount)}</span>
              </div>
              <div
                className={styles.track}
                role="progressbar"
                aria-label={`${s.name} revenue share`}
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className={styles.fill} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Status({ value }) {
  return <span className={`${styles.status} ${styles[value.toLowerCase()]}`}>{value}</span>;
}

function AllSchools() {
  return (
    <section className={styles.card}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>All Schools</h2>
      </header>

      {/* Desktop: table */}
      <div className={`${styles.tableWrap} ${styles.desktopOnly}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>School Name</th><th>Amount</th><th>Payment Dates</th>
              <th>Status</th><th>Plan</th><th>Payment Mode</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.school}</td>
                <td>{formatFull(p.amount)}</td>
                <td>{p.date}</td>
                <td><Status value={p.status} /></td>
                <td>{p.plan}</td>
                <td>{p.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet + mobile: cards */}
      <div className={`${styles.payCards} ${styles.smallOnly}`}>
        {payments.map((p) => (
          <article key={p.id} className={styles.payCard}>
            <div className={styles.payInfo}>
              <h3 className={styles.payName}>{p.school}</h3>
              <p className={styles.payMeta}>
                <span>{formatShort(p.amount)}</span>
                <span>{p.date}</span>
                <span>{p.mode}</span>
              </p>
            </div>
            <div className={styles.badges}>
              <span className={styles.badge}>{p.plan}</span>
              <span className={`${styles.badge} ${styles[`badge${p.status}`] ?? ''}`}>{p.status}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ---------- page ----------
export default function Analytics() {
  const [menuOpen, setMenuOpen] = useState(false);
  const planHighlight = planRevenue.reduce((best, d, i, arr) => (d.value > arr[best].value ? i : best), 0);

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.page}>
        <Topbar title="Revenue & Analysis" subtitle="Academic Year 2025 - 26" onMenuClick={() => setMenuOpen(true)} />

        <div className={styles.grid}>
          <div className={styles.col}>
            <ChartCard title="Monthly Revenue Overview">
              {() => <RevenueBars data={monthlyRevenue} highlightIndex={monthlyRevenue.length - 1} />}
            </ChartCard>

            <ChartCard title="Revenue Trend">
              {() => <TrendArea data={revenueTrend} />}
            </ChartCard>
          </div>

          <div className={styles.col}>
            <ChartCard title="Plan-wise Revenue">
              {() => <RevenueBars data={planRevenue} highlightIndex={planHighlight} small />}
            </ChartCard>

            <TopSchools />
          </div>
        </div>

        <AllSchools />
      </main>
    </div>
  );
}