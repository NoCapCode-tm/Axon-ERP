import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, CalendarClock, ChevronDown, ChevronLeft, ChevronRight, IndianRupee, Plus, Wallet,
} from 'lucide-react';
import s from '../CSS/StaffProfile.module.css';

/* ---------- shared helpers ---------- */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (n) => String(n).padStart(2, '0');

function initials(name) {
  const clean = name.replace(/^(mrs|mr|ms|dr)\.?\s+/i, '').trim();
  return clean.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

// size comes from the parent: set --avatar-size on any ancestor
export function Avatar({ name, photo }) {
  if (photo) return <img src={photo} alt={name} className={s.avatar} />;
  return (
    <span className={`${s.avatar} ${s.avatarFallback}`} role="img" aria-label={name}>
      {initials(name)}
    </span>
  );
}

function BackButton({ onClick, label }) {
  return (
    <button type="button" className={s.back} onClick={onClick} aria-label={label}>
      <ArrowLeft size={24} aria-hidden="true" />
    </button>
  );
}

function InfoList({ rows }) {
  return (
    <dl className={s.info}>
      {rows.map(([k, v]) => (
        <div key={k} className={s.infoRow}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Donut({ percent }) {
  const r = 48;
  const c = 2 * Math.PI * r;
  return (
    <div className={s.donut}>
      <svg viewBox="0 0 120 120" role="img" aria-label={`Attendance ${percent}%`}>
        <circle className={s.donutTrack} cx="60" cy="60" r={r} fill="none" strokeWidth="16" />
        <circle
          className={s.donutFill}
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="16"
          strokeDasharray={`${(c * percent) / 100} ${c}`}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span className={s.donutText}>{percent}%</span>
    </div>
  );
}

function LinkCard({ area, title, onClick }) {
  return (
    <section className={`${s.card} ${s.linkCard}`} style={{ gridArea: area }}>
      <h3 className={s.cardTitle}>{title}</h3>
      <button type="button" className={s.btn} onClick={onClick}>View More</button>
    </section>
  );
}

/* =====================================================================
   ATTENDANCE VIEW  (calendar + report)
   ===================================================================== */

// laptop starts on Monday with long labels, tablet/mobile start on Sunday
const DAYS_LAPTOP = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
const DAYS_SMALL = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// dummy, replace with API: 'present' | 'absent' | 'leave' | undefined (weekend / no class)
function getDayStatus(date) {
  const dow = date.getDay();
  if (dow === 0 || dow === 6) return undefined;
  const d = date.getDate();
  if (d % 17 === 0) return 'absent';
  if (d % 11 === 0) return 'leave';
  return 'present';
}

// dummy, replace with API: one row per month
function buildReport(year, now) {
  return MONTHS.map((m, i) => {
    const started = new Date(year, i, 1) <= now;
    return {
      month: `${m}, ${year}`,
      present: started ? 28 : 0,
      absent: started ? 2 : 0,
      late: started ? 1 : 0,
      percent: started ? 95 : 0,
    };
  });
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// null = empty slot, Date = real day
function buildCells(year, month, weekStart) {
  const lead = (new Date(year, month, 1).getDay() - weekStart + 7) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  const cells = Array(lead).fill(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(year, month, d));
  return cells;
}

function Calendar({ getStatus }) {
  const small = useMediaQuery('(max-width: 1024px)');
  const weekStart = small ? 0 : 1;
  const labels = small ? DAYS_SMALL : DAYS_LAPTOP;
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const cells = useMemo(() => buildCells(view.y, view.m, weekStart), [view, weekStart]);

  const move = (delta) =>
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  return (
    <section className={s.card}>
      <h2 className={s.cardTitle}>Calendar</h2>

      <div className={s.calendar}>
        <div className={s.monthBar}>
          <button type="button" className={s.monthBtn} onClick={() => move(-1)} aria-label="Previous month">
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <span className={s.monthLabel} aria-live="polite">{MONTHS[view.m]}, {view.y}</span>
          <button type="button" className={s.monthBtn} onClick={() => move(1)} aria-label="Next month">
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>

        <div className={s.weekRow} aria-hidden="true">
          {labels.map((l) => <span key={l}>{l}</span>)}
        </div>

        <div className={s.days}>
          {cells.map((date, i) => {
            if (!date) return <span key={`e-${i}`} />;
            const status = isSameDay(date, today) ? 'today' : getStatus(date);
            return (
              <span key={date.getDate()} className={`${s.day} ${status ? s[status] : ''}`} title={status}>
                {date.getDate()}
              </span>
            );
          })}
        </div>

        <ul className={s.calLegend}>
          <li><span className={`${s.dot} ${s.present}`} />Present</li>
          <li><span className={`${s.dot} ${s.absent}`} />Absent</li>
          <li><span className={`${s.dot} ${s.leave}`} />Leave</li>
          <li><span className={`${s.dot} ${s.today}`} />Today</li>
        </ul>
      </div>
    </section>
  );
}

function AttendanceReport({ rows, onDownload }) {
  return (
    <section className={s.card}>
      <header className={s.cardHead}>
        <h2 className={s.cardTitle}>Attendance Report</h2>
        <button type="button" className={s.btn} onClick={onDownload}>Download</button>
      </header>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Present</th>
              <th scope="col">Absent</th>
              <th scope="col">Late</th>
              <th scope="col">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.month}>
                <td>{r.month}</td>
                <td>{pad(r.present)}</td>
                <td>{pad(r.absent)}</td>
                <td>{pad(r.late)}</td>
                <td>{r.percent ? `${r.percent}%` : '00'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AttendanceView({ staff, onBack }) {
  const rows = useMemo(() => buildReport(new Date().getFullYear(), new Date()), []);

  const handleDownload = () => {
    // TODO: download attendance report for staff.id
    console.log('download attendance report', staff.id);
  };

  return (
    <div className={s.wrap}>
      <BackButton onClick={onBack} label="Back to profile" />
      <div className={s.attLayout}>
        <Calendar getStatus={getDayStatus} />
        <AttendanceReport rows={rows} onDownload={handleDownload} />
      </div>
    </div>
  );
}

/* =====================================================================
   ACTIVITY VIEW  (Activity Log tab + Fees History tab)
   ===================================================================== */

const TABS = [
  { id: 'activity', label: 'Activity Log' },
  { id: 'fees', label: 'Fees History' },
];

const ACTIVITY_RANGES = ['Last 1 Week', 'Last 1 Month', 'Last 3 Months'];
const SALARY_RANGES = ['This Year', 'Last Year'];

// dummy, replace with API. highlight = new / unread
const activityItems = [
  ...Array.from({ length: 4 }, () => ({ title: 'Attendance Marked Present', text: 'Attendance was marked', date: '08/21/2026', highlight: true })),
  { title: 'Assignment Submitted', text: 'Science project report uploaded', date: '08/21/2026', highlight: true },
  ...Array.from({ length: 3 }, () => ({ title: 'Assignment Submitted', text: 'Science project report uploaded', date: '08/21/2026' })),
  ...Array.from({ length: 4 }, () => ({ title: 'Quiz Completed', text: 'Scored 18/20', date: '08/21/2026' })),
].map((a, i) => ({ ...a, id: i }));

// dummy, replace with API
const salaryInfo = {
  type: 'Monthly',
  base: 30000,
  allowance: 7000,
  cycle: 'End of every month',
  method: 'Bank transfer',
  account: 'XXXX XXXX 0123',
};

const money = (n) => `₹ ${n}`;

// dummy, replace with API: one row per month
function buildSalaryHistory(year) {
  const gross = (salaryInfo.base + salaryInfo.allowance).toLocaleString('en-IN');
  return MONTHS.map((_, i) => ({
    id: i,
    period: `01.${pad(i + 1)}.${year}`,
    payDate: `05.${pad(i + 1)}.${year}`,
    status: i < 4 ? 'Paid' : 'Pending',
    gross,
    method: 'Bank Transfer',
  }));
}

function Select({ value, options, onChange, label, variant = 'lime' }) {
  return (
    <span className={`${s.select} ${variant === 'lime' ? s.selectLime : s.selectLine}`}>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={18} aria-hidden="true" />
    </span>
  );
}

function Tabs({ value, onChange }) {
  return (
    <div className={s.tabs} role="tablist">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          className={`${s.tab} ${value === t.id ? s.tabActive : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function ActivityLog() {
  const [range, setRange] = useState(ACTIVITY_RANGES[0]); // TODO: refetch when range changes
  return (
    <section className={s.card}>
      <header className={s.cardHead}>
        <h2 className={s.cardTitle}>Activity Log</h2>
        <Select value={range} options={ACTIVITY_RANGES} onChange={setRange} label="Activity range" />
      </header>

      <ul className={s.log}>
        {activityItems.map((a) => (
          <li key={a.id} className={`${s.logItem} ${a.highlight ? s.logNew : ''}`}>
            <p className={s.logTitle}>{a.title}</p>
            <p className={s.logText}>{a.text}</p>
            <time className={s.logDate}>{a.date}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatCards() {
  const items = [
    { label: 'Salary Type', value: salaryInfo.type, Icon: Wallet },
    { label: 'Base Salary', value: money(salaryInfo.base), Icon: IndianRupee },
    { label: 'Allowance', value: money(salaryInfo.allowance), Icon: Plus },
    { label: 'Payment Cycle', value: salaryInfo.cycle, Icon: CalendarClock },
  ];
  return (
    <ul className={s.stats}>
      {items.map(({ label, value, Icon }) => (
        <li key={label} className={s.stat}>
          <span className={s.statIcon}><Icon size={32} aria-hidden="true" /></span>
          <span className={s.statBody}>
            <span className={s.statLabel}>{label}</span>
            <span className={s.statValue}>{value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function PaySlip({ staff, onDownload }) {
  const year = new Date().getFullYear();
  const options = useMemo(() => MONTHS.map((m) => `${m} ${year}`), [year]);
  const [month, setMonth] = useState(options[Math.max(0, new Date().getMonth() - 1)]);

  const idx = options.indexOf(month);
  const last = new Date(year, idx + 1, 0).getDate();
  const m = pad(idx + 1);
  const yy = String(year).slice(2);
  const gross = salaryInfo.base + salaryInfo.allowance;

  const fields = [
    ['Employee name', staff.name],
    ['Employee ID', staff.id],
    ['Designation', staff.designation],
    ['Payment date', `${last}/${m}/${year}`],
    ['Pay period', `01/${m}/${yy} - ${last}/${m}/${yy}`],
  ];

  return (
    <section className={s.card}>
      <header className={s.cardHead}>
        <h2 className={s.cardTitle}>Pay slip</h2>
        <div className={s.headTools}>
          <Select value={month} options={options} onChange={setMonth} label="Pay slip month" variant="line" />
          <button type="button" className={s.textBtn} onClick={() => onDownload(month)}>Download</button>
        </div>
      </header>

      <div className={s.slip}>
        <h3 className={s.slipTitle}>Pay slip</h3>

        <dl className={s.slipFields}>
          {fields.map(([k, v]) => (
            <div key={k} className={s.slipField}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <h4 className={s.slipSub}>Salary Summary</h4>
        <dl className={s.summary}>
          <div><dt>Base Salary</dt><dd>{money(salaryInfo.base)}</dd></div>
          <div><dt>Allowance</dt><dd>{money(salaryInfo.allowance)}</dd></div>
          <div className={s.summaryTotal}><dt>Total Gross Salary</dt><dd>{money(gross)}</dd></div>
        </dl>

        <p className={s.slipMeta}>
          Payment method : {salaryInfo.method}<br />
          Account Number : {salaryInfo.account}<br />
          Generated on : {`${last}/${m}/${yy}`}
        </p>
      </div>
    </section>
  );
}

function SalaryHistory() {
  const [range, setRange] = useState(SALARY_RANGES[0]);
  const year = new Date().getFullYear() - (range === 'Last Year' ? 1 : 0);
  const rows = useMemo(() => buildSalaryHistory(year), [year]);

  return (
    <section className={s.card}>
      <header className={s.cardHead}>
        <h2 className={s.cardTitle}>Salary History</h2>
        <Select value={range} options={SALARY_RANGES} onChange={setRange} label="Salary range" />
      </header>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">Pay period</th>
              <th scope="col">Pay date</th>
              <th scope="col">Status</th>
              <th scope="col">Gross Salary</th>
              <th scope="col">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.period}</td>
                <td>{r.payDate}</td>
                <td className={r.status === 'Paid' ? s.paid : s.pending}>{r.status}</td>
                <td>{r.gross}</td>
                <td>{r.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ActivityView({ staff, onBack }) {
  const [tab, setTab] = useState('activity');

  const handleDownload = (month) => {
    // TODO: download pay slip for staff.id and month
    console.log('download pay slip', staff.id, month);
  };

  return (
    <div className={s.wrap}>
      <BackButton onClick={onBack} label="Back to profile" />
      <Tabs value={tab} onChange={setTab} />

      {tab === 'activity' ? (
        <ActivityLog />
      ) : (
        <>
          <StatCards />
          <PaySlip staff={staff} onDownload={handleDownload} />
          <SalaryHistory />
        </>
      )}
    </div>
  );
}

/* =====================================================================
   PROFILE (default export). Attendance + Activity open inside this
   component, so StaffManagement.jsx needs no changes.
   ===================================================================== */

// `staff` shape is in buildProfile() inside StaffManagement.jsx
// onAction(type) is still called for: 'message' | 'legal-docs' | 'timetable' | 'documents'
// 'attendance' and 'activity' are handled here
export default function StaffProfile({ staff, onBack, onAction }) {
  const [subView, setSubView] = useState(null); // null | 'attendance' | 'activity'

  const total = staff.presentDays + staff.absentDays;
  const presentPct = Math.round((staff.presentDays / total) * 100);

  const open = (type) => {
    window.scrollTo({ top: 0 });
    setSubView(type);
  };

  const handleAction = (type) => {
    if (type === 'attendance' || type === 'activity') open(type);
    else onAction?.(type);
  };

  if (subView === 'attendance') return <AttendanceView staff={staff} onBack={() => open(null)} />;
  if (subView === 'activity') return <ActivityView staff={staff} onBack={() => open(null)} />;

  return (
    <div className={s.wrap}>
      <BackButton onClick={onBack} label="Back to employee list" />

      <div className={s.actions}>
        <button type="button" className={s.btn} onClick={() => handleAction('message')}>Message</button>
        <button type="button" className={s.btn} onClick={() => handleAction('legal-docs')}>View Legal Documents</button>
      </div>

      <section className={`${s.card} ${s.header}`}>
        <Avatar name={staff.name} photo={staff.photo} />
        <div className={s.headMain}>
          <h2 className={s.name}>{staff.name}</h2>
          <dl className={s.meta}>
            <div className={s.infoRow}><dt>Teacher ID</dt><dd>{staff.id}</dd></div>
            <div className={s.infoRow}><dt>Designation</dt><dd>{staff.designation}</dd></div>
            <div className={s.infoRow}><dt>Contact</dt><dd>{staff.contact}</dd></div>
          </dl>
        </div>
      </section>

      <div className={s.grid}>
        <section className={s.card} style={{ gridArea: 'personal' }}>
          <h3 className={s.cardTitle}>Personal Information</h3>
          <InfoList rows={[
            ['Name', staff.name], ['DOB', staff.dob], ['Blood Group', staff.bloodGroup],
            ['Phone', staff.contact], ['Email', staff.email], ['Address', staff.address],
          ]} />
        </section>

        <section className={s.card} style={{ gridArea: 'professional' }}>
          <h3 className={s.cardTitle}>Professional Information</h3>
          <InfoList rows={[
            ['Employee ID', staff.id], ['Joining date', staff.joined], ['Qualification', staff.qualification],
            ['Experience', staff.experience], ['Assigned Class', staff.assignedClass], ['Assigned Subject', staff.subject],
          ]} />
        </section>

        <section className={s.card} style={{ gridArea: 'attendance' }}>
          <div className={s.cardHead}>
            <h3 className={s.cardTitle}>Attendance Summary</h3>
            <button type="button" className={s.btn} onClick={() => handleAction('attendance')}>View Details</button>
          </div>
          <div className={s.attBody}>
            <Donut percent={presentPct} />
            <ul className={s.legend}>
              <li><span className={`${s.swatch} ${s.swatchPresent}`} />Present <span>{staff.presentDays} Days ({presentPct}%)</span></li>
              <li><span className={`${s.swatch} ${s.swatchAbsent}`} />Absent <span>{staff.absentDays} Days ({100 - presentPct}%)</span></li>
            </ul>
          </div>
        </section>

        <LinkCard area="activity" title="Activity Log" onClick={() => handleAction('activity')} />
        <LinkCard area="timetable" title="Timetable" onClick={() => handleAction('timetable')} />
        <LinkCard area="documents" title="Documents collected" onClick={() => handleAction('documents')} />
      </div>
    </div>
  );
}