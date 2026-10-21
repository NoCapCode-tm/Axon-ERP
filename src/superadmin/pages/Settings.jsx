import { useEffect, useId, useRef, useState } from 'react';
import {
  Settings as SettingsIcon, Sun, ShieldCheck, LogIn, History, Info, ChevronDown, PlusCircle,
  CalendarDays, User, LayoutGrid, MousePointer2,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import styles from '../CSS/Settings.module.css';

// dummy data
const tabs = [
  {
    id: 'general', label: 'General Settings', icon: SettingsIcon,
    subtitle: 'Manage basic platform information and regional preferences',
  },
  {
    id: 'branding', label: 'Branding & Appearance', icon: Sun,
    subtitle: 'Customize platform branding and visual appearance',
  },
  {
    id: 'security', label: 'Security Settings', icon: ShieldCheck,
    subtitle: 'Configure authentication and access security',
  },
  {
    id: 'payment', label: 'Payment Gateway', icon: LogIn,
    subtitle: 'Manage payment gateway integration',
  },
  {
    id: 'audit', label: 'Audit & Activity Log', title: 'Audit & Activity Logs', icon: History,
    subtitle: 'View and manage platform activity logs',
  },
  {
    id: 'about', label: 'About Platform', icon: Info,
    subtitle: 'View platform information and status',
  },
];

const initialSettings = {
  platformName: 'Axon ERP',
  companyName: 'Axon Technologies Pvt. Ltd.',
  supportEmail: 'support@axonerp.com',
  supportPhone: '+91 9876543210',
  website: 'https://www.axonerp.com',
  timeZone: 'Asia/Kolkata',
  dateFormat: 'DD-MM-YYYY',
  language: 'en',
  timeFormat: '12h',
  primaryColor: '#5f5f5f',
  secondaryColor: '#1e293b',
  accentColor: '#616161',
  theme: 'light',
  layout: 'modern',
  minPassword: '8',
  maxFailedLogins: '5',
  sessionTimeout: '30',
  lockDuration: '15',
  forcePasswordReset: false,
  twoFactor: true,
  loginNotifications: true,
};

const timeZones = [
  ['Asia/Kolkata', '(GMT+05:30) Asia/Kolkata'],
  ['Asia/Dubai', '(GMT+04:00) Asia/Dubai'],
  ['Europe/London', '(GMT+00:00) Europe/London'],
  ['America/New_York', '(GMT-05:00) America/New_York'],
];
const dateFormats = [['DD-MM-YYYY', 'DD-MM-YYYY'], ['MM-DD-YYYY', 'MM-DD-YYYY'], ['YYYY-MM-DD', 'YYYY-MM-DD']];
const languages = [['en', 'English'], ['hi', 'Hindi']];
const timeFormats = [['12h', '12 Hour (AM/PM)'], ['24h', '24 Hour']];
const themes = [['light', 'Light'], ['dark', 'Dark'], ['system', 'Match device']];
const layouts = [['modern', 'Modern'], ['classic', 'Classic'], ['compact', 'Compact']];

const auditLogs = [
  { id: 'log-1', date: '2026-05-09', user: 'John Doe', module: 'Security', action: 'Update Password' },
  { id: 'log-2', date: '2026-05-09', user: 'System', module: 'Backup', action: 'System Backup' },
  { id: 'log-3', date: '2026-05-08', user: 'Priya M', module: 'Subscription', action: 'Renew Plan' },
  { id: 'log-4', date: '2026-05-08', user: 'John Doe', module: 'Feature Control', action: 'Update Feature' },
  { id: 'log-5', date: '2026-05-07', user: 'Arjun K', module: 'Schools', action: 'Add School' },
  { id: 'log-6', date: '2026-05-07', user: 'System', module: 'Backup', action: 'System Backup' },
  { id: 'log-7', date: '2026-05-06', user: 'Neha S', module: 'Support', action: 'Close Ticket' },
  { id: 'log-8', date: '2026-05-05', user: 'John Doe', module: 'Security', action: 'Enable 2FA' },
];

const uniqueOptions = (key, allLabel) => [
  ['all', allLabel],
  ...[...new Set(auditLogs.map((l) => l[key]))].sort().map((v) => [v, v]),
];
const userOptions = uniqueOptions('user', 'All Users');
const moduleOptions = uniqueOptions('module', 'All Modules');
const actionOptions = uniqueOptions('action', 'All Actions');

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const platformInfo = [
  ['ERP Version', 'v2.5.0'],
  ['Build Number', '20260509.1'],
  ['Release Date', '09 May 2026'],
  ['Environment', 'Production'],
  ['Server Status', 'Operational'],
];

const brandAssets = ['Primary Logo', 'Dark Logo', 'Favicon', 'Login Page Logo'];

const gateways = [
  { id: 'razorpay', name: 'Razorpay', status: 'Active' },
  { id: 'stripe', name: 'stripe', status: 'Active' },
  { id: 'paypal', name: 'PayPal', status: 'Inactive' },
];

/* ---------- small building blocks ---------- */

function Field({ label, children }) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      {children(id)}
    </div>
  );
}

function TextField({ label, value, onChange, type = 'text', ...rest }) {
  return (
    <Field label={label}>
      {(id) => <input id={id} className={styles.control} type={type} value={value} onChange={onChange} {...rest} />}
    </Field>
  );
}

function SelectField({ label, value, onChange, options, icon: EndIcon = ChevronDown }) {
  return (
    <Field label={label}>
      {(id) => (
        <div className={styles.selectWrap}>
          <select id={id} className={styles.control} value={value} onChange={onChange}>
            {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <EndIcon size={18} aria-hidden="true" />
        </div>
      )}
    </Field>
  );
}

function ColorField({ label, value, onChange }) {
  const valid = /^#[0-9a-f]{6}$/i.test(value);
  return (
    <Field label={label}>
      {(id) => (
        <div className={styles.colorField}>
          <input
            type="color"
            className={styles.swatch}
            value={valid ? value : '#000000'}
            onChange={onChange}
            aria-label={`${label} picker`}
          />
          <input id={id} className={styles.hex} type="text" value={value} onChange={onChange} maxLength={7} />
        </div>
      )}
    </Field>
  );
}

function Switch({ label, checked, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <span className={styles.toggleLabel}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={styles.switch}
        onClick={onChange}
      >
        <span className={styles.knob} />
      </button>
    </div>
  );
}

// keeps a chosen image in the browser and cleans up the temporary URL
function useImagePreview() {
  const [src, setSrc] = useState(null);
  useEffect(() => () => { if (src) URL.revokeObjectURL(src); }, [src]);
  const onChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSrc(URL.createObjectURL(file)); // TODO: upload the file to your API
  };
  return [src, onChange];
}

function LogoTile({ label }) {
  const [src, onChange] = useImagePreview();
  const inputRef = useRef(null);
  return (
    <div className={styles.logoTile}>
      <p className={styles.tileLabel}>{label}</p>
      <div className={styles.tileBox}>
        {src ? (
          <img src={src} alt={`${label} preview`} className={styles.tileImg} />
        ) : (
          <>
            <span className={styles.tileDot} aria-hidden="true" />
            <span className={styles.tileWord}>Axon</span>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onChange} />
      <button type="button" className={styles.linkBtn} onClick={() => inputRef.current?.click()}>
        Change<span className={styles.srOnly}> {label}</span>
      </button>
    </div>
  );
}

function SaveBar({ onSave }) {
  const [saved, setSaved] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const handle = () => {
    onSave();
    setSaved(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className={styles.saveBar}>
      <span className={styles.srOnly} role="status">{saved ? 'Settings saved' : ''}</span>
      <button type="button" className={styles.saveBtn} onClick={handle}>
        {saved ? 'Saved' : 'Save changes'}
      </button>
    </div>
  );
}

/* ---------- tab panels ---------- */

function GeneralTab({ s, set }) {
  const [src, onChange] = useImagePreview();
  const inputRef = useRef(null);
  return (
    <>
      <div className={styles.twoCol}>
        <section>
          <h3 className={styles.sectionTitle}>Platform Information</h3>
          <div className={styles.grid2}>
            <TextField label="Platform Name" value={s.platformName} onChange={set('platformName')} />
            <TextField label="Company Name" value={s.companyName} onChange={set('companyName')} />
            <TextField label="Support Email" type="email" value={s.supportEmail} onChange={set('supportEmail')} />
            <TextField label="Support Phone" type="tel" value={s.supportPhone} onChange={set('supportPhone')} />
            <TextField label="Website URL" type="url" value={s.website} onChange={set('website')} />
          </div>
        </section>

        <section>
          <h3 className={styles.sectionTitle}>Platform Logo</h3>
          <div className={styles.bigLogo}>
            {src ? <img src={src} alt="Platform logo preview" className={styles.bigLogoImg} /> : <p className={styles.bigWord}>Axon</p>}
            <input ref={inputRef} type="file" accept="image/*" hidden onChange={onChange} />
            <button type="button" className={styles.linkBtn} onClick={() => inputRef.current?.click()}>Change Logo</button>
            <p className={styles.hint}>Recommended 512x512 px</p>
          </div>
        </section>
      </div>

      <section className={styles.block}>
        <h3 className={styles.sectionTitle}>Regional Settings</h3>
        <div className={styles.grid4}>
          <SelectField label="Time Zone" value={s.timeZone} onChange={set('timeZone')} options={timeZones} />
          <SelectField label="Date Format" value={s.dateFormat} onChange={set('dateFormat')} options={dateFormats} />
          <SelectField label="Default Language" value={s.language} onChange={set('language')} options={languages} />
          <SelectField label="Time Format" value={s.timeFormat} onChange={set('timeFormat')} options={timeFormats} />
        </div>
      </section>
    </>
  );
}

function BrandingTab({ s, set }) {
  return (
    <div className={`${styles.twoCol} ${styles.brandCols}`}>
      <section>
        <h3 className={styles.sectionTitle}>Brand Assets</h3>
        <div className={styles.assetsGrid}>
          {brandAssets.map((a) => <LogoTile key={a} label={a} />)}
        </div>
      </section>

      <section>
        <h3 className={styles.sectionTitle}>Theme</h3>
        <div className={styles.grid3}>
          <ColorField label="Primary Color" value={s.primaryColor} onChange={set('primaryColor')} />
          <ColorField label="Secondary Color" value={s.secondaryColor} onChange={set('secondaryColor')} />
          <ColorField label="Accent Color" value={s.accentColor} onChange={set('accentColor')} />
        </div>
        <div className={`${styles.grid2} ${styles.gridGap}`}>
          <SelectField label="Default Theme" value={s.theme} onChange={set('theme')} options={themes} />
          <SelectField label="Dashboard Layout" value={s.layout} onChange={set('layout')} options={layouts} />
        </div>
      </section>
    </div>
  );
}

function SecurityTab({ s, set, toggle }) {
  return (
    <div className={`${styles.twoCol} ${styles.securityCols}`}>
      <section>
        <h3 className={styles.sectionTitle}>Authentication</h3>
        <div className={styles.grid2}>
          <TextField label="Password Minimum Length" type="number" min="6" max="64" value={s.minPassword} onChange={set('minPassword')} />
          <TextField label="Failed Login Attempts" type="number" min="1" value={s.maxFailedLogins} onChange={set('maxFailedLogins')} />
          <TextField label="Session Timeout (Minutes)" type="number" min="1" value={s.sessionTimeout} onChange={set('sessionTimeout')} />
          <TextField label="Account Lock Duration (Minutes)" type="number" min="1" value={s.lockDuration} onChange={set('lockDuration')} />
        </div>
      </section>

      <section>
        <h3 className={styles.sectionTitle}>Access Security</h3>
        <Switch label="Force Password Reset" checked={s.forcePasswordReset} onChange={toggle('forcePasswordReset')} />
        <Switch label="Two Factor Authentication (2FA)" checked={s.twoFactor} onChange={toggle('twoFactor')} />
        <Switch label="Login Notifications" checked={s.loginNotifications} onChange={toggle('loginNotifications')} />
        <div className={styles.toggleRow}>
          <span className={styles.toggleLabel}>Active Sessions</span>
          {/* TODO: open the sessions list */}
          <button type="button" className={styles.viewBtn} onClick={() => console.log('view sessions')}>View</button>
        </div>
      </section>
    </div>
  );
}

function PaymentTab() {
  // TODO: open configure / add gateway modals
  return (
    <div className={styles.gatewayGrid}>
      {gateways.map((g) => (
        <div key={g.id} className={styles.gateway}>
          {/* text stand-ins. Swap for the real logo images */}
          <p className={`${styles.brandMark} ${styles[`brand_${g.id}`]}`}>
            {g.id === 'paypal' ? <><span>Pay</span><span className={styles.paypalLight}>Pal</span></> : g.name}
          </p>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>Status</span>
            <span className={`${styles.badge} ${g.status === 'Active' ? styles.badgeActive : styles.badgeInactive}`}>{g.status}</span>
          </div>
          <button type="button" className={styles.configBtn} onClick={() => console.log('configure', g.id)}>
            Configure<span className={styles.srOnly}> {g.name}</span>
          </button>
        </div>
      ))}

      <button type="button" className={styles.addGateway} onClick={() => console.log('add gateway')}>
        <PlusCircle size={32} aria-hidden="true" />
        <span className={styles.addTitle}>Add New Gateway</span>
        <span className={styles.addHint}>Integrate new payment options</span>
      </button>
    </div>
  );
}

function AuditTab() {
  const emptyFilters = { from: '', to: '', user: 'all', module: 'all', action: 'all' };
  const [draft, setDraft] = useState(emptyFilters);      // what is typed in the filters
  const [applied, setApplied] = useState(emptyFilters);  // what the Search button applied
  const dateLabelId = useId();
  const update = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  const logs = auditLogs.filter(
    (l) =>
      (!applied.from || l.date >= applied.from) &&
      (!applied.to || l.date <= applied.to) &&
      (applied.user === 'all' || l.user === applied.user) &&
      (applied.module === 'all' || l.module === applied.module) &&
      (applied.action === 'all' || l.action === applied.action)
  );

  // downloads the logs the table is showing
  const handleExport = () => {
    const lines = [['Timestamp', 'User', 'Module', 'Action'], ...logs.map((l) => [formatDate(l.date), l.user, l.module, l.action])]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([lines], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.field}>
          <span id={dateLabelId} className={styles.label}>Date Range</span>
          <div className={styles.dateRange} role="group" aria-labelledby={dateLabelId}>
            <CalendarDays size={20} aria-hidden="true" />
            <input
              type="date"
              className={styles.dateInput}
              aria-label="From date"
              value={draft.from}
              max={draft.to || undefined}
              onChange={update('from')}
            />
            <span aria-hidden="true">to</span>
            <input
              type="date"
              className={styles.dateInput}
              aria-label="To date"
              value={draft.to}
              min={draft.from || undefined}
              onChange={update('to')}
            />
          </div>
        </div>
        <SelectField label="User" value={draft.user} onChange={update('user')} options={userOptions} icon={User} />
        <SelectField label="Module" value={draft.module} onChange={update('module')} options={moduleOptions} icon={LayoutGrid} />
        <SelectField label="Action" value={draft.action} onChange={update('action')} options={actionOptions} icon={MousePointer2} />

        <div className={styles.filterActions}>
          <button type="button" className={styles.filterBtn} onClick={() => setApplied(draft)}>Search</button>
          <button type="button" className={styles.filterBtn} onClick={handleExport}>Export Logs</button>
        </div>
      </div>

      <div className={styles.logWrap}>
        <table className={styles.logTable}>
          <thead>
            <tr>
              <th scope="col">Timestamp</th>
              <th scope="col">User</th>
              <th scope="col">Module</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td className={styles.dateCell}>{formatDate(l.date)}</td>
                <td>{l.user}</td>
                <td>{l.module}</td>
                <td>{l.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className={styles.emptyNote}>No logs match these filters.</p>}
      </div>
    </>
  );
}

function AboutTab() {
  return (
    <dl className={styles.aboutGrid}>
      {platformInfo.map(([label, value]) => (
        <div key={label} className={styles.aboutItem}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- page ---------- */

export default function Settings() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('general');
  const [settings, setSettings] = useState(initialSettings);
  const tabRefs = useRef({});

  const set = (key) => (e) => setSettings((s) => ({ ...s, [key]: e.target.value }));
  const toggle = (key) => () => setSettings((s) => ({ ...s, [key]: !s[key] }));

  // TODO: send `settings` to your API
  const handleSave = () => console.log('save settings', settings);

  // keeps the selected tab visible when the tab bar scrolls (phones)
  useEffect(() => {
    tabRefs.current[active]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  const handleKeys = (e) => {
    const i = tabs.findIndex((t) => t.id === active);
    let next = null;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(tabs[next].id);
    tabRefs.current[tabs[next].id]?.focus();
  };

  const current = tabs.find((t) => t.id === active);
  const Icon = current.icon;
  const hasSave = ['general', 'branding', 'security'].includes(active);

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.page}>
        <Topbar
          title="Settings"
          subtitle="Academic Year 2025 - 26"
          onMenuClick={() => setMenuOpen(true)}
        />

        <div className={styles.tabs} role="tablist" aria-label="Settings sections" onKeyDown={handleKeys}>
          {tabs.map((t) => (
            <button
              key={t.id}
              ref={(el) => { tabRefs.current[t.id] = el; }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={active === t.id ? 0 : -1}
              className={`${styles.tab} ${active === t.id ? styles.tabActive : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <section
          className={styles.card}
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
        >
          <header className={styles.panelHead}>
            <Icon className={styles.panelIcon} aria-hidden="true" />
            <div>
              <h2 className={styles.panelTitle}>{current.title ?? current.label}</h2>
              <p className={styles.panelSub}>{current.subtitle}</p>
            </div>
          </header>

          {active === 'general' && <GeneralTab s={settings} set={set} />}
          {active === 'branding' && <BrandingTab s={settings} set={set} />}
          {active === 'security' && <SecurityTab s={settings} set={set} toggle={toggle} />}
          {active === 'payment' && <PaymentTab />}
          {active === 'audit' && <AuditTab />}
          {active === 'about' && <AboutTab />}

          {hasSave && <SaveBar onSave={handleSave} />}
        </section>
      </main>
    </div>
  );
}