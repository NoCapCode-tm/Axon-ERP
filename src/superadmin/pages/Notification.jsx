import { useEffect, useState } from 'react';
import {
  Search, SlidersHorizontal, PlusCircle, Grip, CalendarDays, Users,
  LayoutDashboard, Mail, MailPlus, BellRing, History, Megaphone,
  Landmark, School, Building2, ArrowUp, ArrowRight, ArrowDown,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Modal, { Field } from '../components/Modal';
import styles from '../CSS/Notification.module.css';

// ---------- dummy data ----------

const TOTAL_SCHOOLS = 236;

const initialAnnouncements = [
  { id: 'a1', title: 'Q4 Platform Maintenance Window', message: 'The platform will undergo maintenance on Dec 5, 2025 from 11:00 PM to Dec 6, 2025 02:00 AM IST. All services may be temporarily unavailable.', priority: 'High', status: 'Published', type: 'General', date: 'Dec 1, 2025, 10:30 AM', audience: `All Schools (${TOTAL_SCHOOLS})`, channels: ['dashboard', 'email'], read: 182, total: TOTAL_SCHOOLS },
  { id: 'a2', title: 'Q4 Platform Maintenance Window', message: 'The platform will undergo maintenance on Dec 5, 2025 from 11:00 PM to Dec 6, 2025 02:00 AM IST. All services may be temporarily unavailable.', priority: 'High', status: 'Published', type: 'General', date: 'Dec 1, 2025, 10:30 AM', audience: `All Schools (${TOTAL_SCHOOLS})`, channels: ['dashboard', 'email'], read: 182, total: TOTAL_SCHOOLS },
  { id: 'a3', title: 'Q4 Platform Maintenance Window', message: 'The platform will undergo maintenance on Dec 5, 2025 from 11:00 PM to Dec 6, 2025 02:00 AM IST. All services may be temporarily unavailable.', priority: 'High', status: 'Published', type: 'General', date: 'Dec 1, 2025, 10:30 AM', audience: `All Schools (${TOTAL_SCHOOLS})`, channels: ['dashboard', 'email'], read: 182, total: TOTAL_SCHOOLS },
  { id: 'a4', title: 'Q4 Platform Maintenance Window', message: 'The platform will undergo maintenance on Dec 5, 2025 from 11:00 PM to Dec 6, 2025 02:00 AM IST. All services may be temporarily unavailable.', priority: 'High', status: 'Published', type: 'General', date: 'Dec 1, 2025, 10:30 AM', audience: `All Schools (${TOTAL_SCHOOLS})`, channels: ['dashboard', 'email'], read: 182, total: TOTAL_SCHOOLS },
];

const TYPES = [
  { id: 'General', label: 'General Announcements' },
  { id: 'Warning', label: 'Warning/Inquiry' },
];

const AUDIENCES = [
  { id: 'all', label: 'All Schools', icon: Landmark },
  { id: 'specific', label: 'Specific Schools', icon: School },
  { id: 'individual', label: 'Individual School', icon: Building2 },
];

const PRIORITIES = [
  { id: 'High', icon: ArrowUp },
  { id: 'Medium', icon: ArrowRight },
  { id: 'Low', icon: ArrowDown },
];

const CHANNELS = [
  { id: 'dashboard', label: 'Dashboard Notification', hint: 'Show as a banner on every school dashboard', icon: BellRing },
  { id: 'email', label: 'Email Notification', hint: 'Send to the registered email of each school', icon: MailPlus },
];

const channelMeta = {
  dashboard: { label: 'Dashboard', icon: LayoutDashboard },
  email: { label: 'Email', icon: Mail },
};

const EMPTY = { type: 'General', title: '', message: '', audience: 'all', priority: 'Medium', channels: [], scheduleOn: false, scheduledAt: '' };

// ---------- helpers ----------

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

function validate(v) {
  const e = {};
  if (!v.title.trim()) e.title = 'Enter an announcement title';
  if (!v.message.trim()) e.message = 'Enter a message';
  if (v.channels.length === 0) e.channels = 'Select at least one delivery channel';
  if (v.scheduleOn && !v.scheduledAt) e.scheduledAt = 'Pick a date and time';
  return e;
}

const formatDate = (d) =>
  d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

// ---------- pieces ----------

function AnnouncementItem({ a }) {
  const pct = a.total ? Math.round((a.read / a.total) * 100) : 0;
  return (
    <li className={styles.item}>
      <Grip className={styles.itemIcon} size={32} aria-hidden="true" />
      <h3 className={styles.itemTitle}>{a.title}</h3>

      <div className={styles.tags}>
        <span className={styles.tag}>{a.priority}</span>
        <span className={styles.tag}>{a.status}</span>
        <span className={styles.tag}>{a.type}</span>
      </div>

      <p className={styles.desc}>{a.message}</p>

      <div className={styles.meta}>
        <span className={styles.metaItem}><CalendarDays size={18} aria-hidden="true" />{a.date}</span>
        <span className={styles.metaItem}><Users size={18} aria-hidden="true" />{a.audience}</span>
      </div>

      <div className={styles.channels}>
        {a.channels.map((c) => {
          const { label, icon: Icon } = channelMeta[c];
          return <span key={c} className={styles.channelTag}><Icon size={18} aria-hidden="true" />{label}</span>;
        })}
      </div>

      <div className={styles.read}>
        <span>Read</span>
        <span className={styles.readCount}>{a.read}/{a.total}</span>
        <div className={styles.bar} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Read rate">
          <div className={styles.barFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.percent}>{pct}%</span>
      </div>
    </li>
  );
}

function AnnouncementForm({ onPublish }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (patch) => setValues((v) => ({ ...v, ...patch }));
  const clearError = (key) => setErrors((er) => (er[key] ? { ...er, [key]: undefined } : er));

  const handleText = (e) => {
    const { name, value } = e.target;
    set({ [name]: value });
    clearError(name);
  };

  const toggleChannel = (id) => {
    setValues((v) => ({
      ...v,
      channels: v.channels.includes(id) ? v.channels.filter((c) => c !== id) : [...v.channels, id],
    }));
    clearError('channels');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      (e.currentTarget.elements[firstKey] ?? e.currentTarget.querySelector('[data-channel]'))?.focus();
      return;
    }
    onPublish(values);
    setValues(EMPTY);
  };

  const handleReset = () => {
    setValues(EMPTY);
    setErrors({});
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>Communication Type</legend>
        <div className={styles.chips}>
          {TYPES.map((t) => (
            <button key={t.id} type="button" className={styles.chip} aria-pressed={values.type === t.id} onClick={() => set({ type: t.id })}>
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Field label="Title" name="title" placeholder="Enter announcement title" autoComplete="off" value={values.title} onChange={handleText} error={errors.title} />

      <Field label="Message" name="message" as="textarea" rows={6} placeholder="Enter your message here" value={values.message} onChange={handleText} error={errors.message} />

      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>Audience Group</legend>
        <div className={styles.chips}>
          {AUDIENCES.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" className={styles.chip} aria-pressed={values.audience === id} onClick={() => set({ audience: id })}>
              <Icon size={20} aria-hidden="true" />{label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>Priority Level</legend>
        <div className={styles.chips}>
          {PRIORITIES.map(({ id, icon: Icon }) => (
            <button key={id} type="button" className={`${styles.chip} ${styles.chipPlain}`} aria-pressed={values.priority === id} onClick={() => set({ priority: id })}>
              <Icon size={18} aria-hidden="true" />{id}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>Delivery Channels</legend>
        {CHANNELS.map(({ id, label, hint, icon: Icon }) => (
          <button key={id} type="button" data-channel className={styles.channel} aria-pressed={values.channels.includes(id)} onClick={() => toggleChannel(id)}>
            <Icon size={28} aria-hidden="true" />
            <span>
              <span className={styles.channelName}>{label}</span>
              <span className={styles.channelHint}>{hint}</span>
            </span>
          </button>
        ))}

        <button type="button" className={styles.channel} aria-pressed={values.scheduleOn} onClick={() => set({ scheduleOn: !values.scheduleOn })}>
          <History size={28} aria-hidden="true" />
          <span className={styles.channelName}>Scheduled for later</span>
        </button>

        {values.scheduleOn && (
          <>
            <input
              type="datetime-local"
              name="scheduledAt"
              aria-label="Schedule date and time"
              className={styles.scheduleInput}
              value={values.scheduledAt}
              onChange={handleText}
            />
            {errors.scheduledAt && <p className={styles.error} role="alert">{errors.scheduledAt}</p>}
          </>
        )}
        {errors.channels && <p className={styles.error} role="alert">{errors.channels}</p>}
      </fieldset>

      <div className={styles.formActions}>
        <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={handleReset}>Reset</button>
        <button type="submit" className={styles.btn}><Megaphone size={22} aria-hidden="true" />Publish Announcement</button>
      </div>
    </form>
  );
}

// ---------- page ----------

export default function Notifications() {
  const isDesktop = useMediaQuery('(min-width: 1201px)');
  const isMobile = useMediaQuery('(max-width: 640px)');

  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState(initialAnnouncements);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false); // tablet
  const [creating, setCreating] = useState(false);   // mobile full page

  const visible = items.filter((a) =>
    `${a.title} ${a.message}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const handlePublish = (v) => {
    const audience = AUDIENCES.find((a) => a.id === v.audience);
    const when = v.scheduleOn ? new Date(v.scheduledAt) : new Date();
    const next = {
      id: `a${Date.now()}`,
      title: v.title.trim(),
      message: v.message.trim(),
      priority: v.priority,
      status: v.scheduleOn ? 'Scheduled' : 'Published',
      type: v.type,
      date: formatDate(when),
      audience: v.audience === 'all' ? `All Schools (${TOTAL_SCHOOLS})` : audience.label,
      channels: v.channels,
      read: 0,
      total: TOTAL_SCHOOLS,
    };
    setItems((list) => [next, ...list]);
    setModalOpen(false);
    setCreating(false);
  };

  const openCreate = () => (isMobile ? setCreating(true) : setModalOpen(true));

  const list = (
    <section className={`${styles.card} ${styles.listCard}`}>
      <form className={styles.toolbar} onSubmit={(e) => e.preventDefault()} role="search">
        <input
          type="search"
          className={styles.searchInput}
          aria-label="Search announcements"
          placeholder="Search announcements"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className={styles.btn}>
          <Search size={22} aria-hidden="true" />Search Announcement
        </button>

        {isDesktop ? (
          <button type="button" className={styles.filterBtn} aria-label="Filter announcements">
            <SlidersHorizontal size={20} aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className={styles.btn} onClick={openCreate} aria-label="New announcement">
            <span className={styles.newBtnText}>New Announcement</span>
            <PlusCircle size={20} aria-hidden="true" />
          </button>
        )}
      </form>

      {visible.length ? (
        <ul className={styles.list}>
          {visible.map((a) => <AnnouncementItem key={a.id} a={a} />)}
        </ul>
      ) : (
        <p className={styles.empty}>No announcements match your search.</p>
      )}
    </section>
  );

  const createCard = (
    <section className={styles.card}>
      <h2 className={styles.formTitle}>Create New Announcement</h2>
      <AnnouncementForm onPublish={handlePublish} />
      {isMobile && (
        <button type="button" className={`${styles.btn} ${styles.btnGhost}`} style={{ width: '100%', marginTop: 12 }} onClick={() => setCreating(false)}>
          Back to announcements
        </button>
      )}
    </section>
  );

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.page}>
        <Topbar title="Notifications" subtitle="Academic Year 2025 - 26" onMenuClick={() => setMenuOpen(true)} />

        {isDesktop ? (
          <div className={styles.grid}>
            {list}
            {createCard}
          </div>
        ) : isMobile && creating ? (
          createCard
        ) : (
          list
        )}
      </main>

      {!isDesktop && (
        <Modal open={modalOpen} title="Create New Announcement" onClose={() => setModalOpen(false)} dismissOnOverlay={false}>
          <AnnouncementForm onPublish={handlePublish} />
        </Modal>
      )}
    </div>
  );
}