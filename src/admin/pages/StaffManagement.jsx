import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye, Phone, PlusCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import styles from '../CSS/StaffManagement.module.css';

/* ---------- dummy data (replace with API data) ---------- */

const PAGE_SIZE = 17;
const TOTAL_STAFF = 200;

const tabs = [
  { id: 'admission', label: 'Employee admission' },
  { id: 'profile', label: 'Employee profile' },
];

const staffList = Array.from({ length: TOTAL_STAFF }, (_, i) => ({
  id: String(123 + i).padStart(5, '0'),
  name: 'Aishwarya Negi',
  subject: 'Science',
  classTeacherOf: 'X-A',
  classes: ['5C', '6A', '6B'],
  contact: '9876543210',
  status: 'Paid',
  joined: '12/10/2015',
}));

const columns = [
  'Employee ID', 'Name', 'Subject', 'Classes Assigned', 'Contact', 'Status', 'Joined Date', 'Action',
];

/* ---------- helpers ---------- */

// 1 2 3 … 12 style page list
function getPageItems(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const items = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...items].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push('gap-' + p);
    out.push(p);
  });
  return out;
}

/* ---------- small building blocks ---------- */

function Tabs({ value, onChange }) {
  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          className={`${styles.tab} ${value === t.id ? styles.tabActive : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function IconButton({ label, onClick, href, children }) {
  const props = { className: styles.iconBtn, 'aria-label': label };
  if (href) return <a href={href} {...props}>{children}</a>;
  return <button type="button" onClick={onClick} {...props}>{children}</button>;
}

function Pagination({ page, totalPages, onChange }) {
  return (
    <nav className={styles.pager} aria-label="Pagination">
      <button
        type="button"
        className={styles.pageBtn}
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>

      {getPageItems(page, totalPages).map((p) =>
        typeof p === 'string' ? (
          <span key={p} className={styles.pageGap} aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={`${styles.pageBtn} ${p === page ? styles.pageActive : ''}`}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        className={styles.pageBtn}
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight size={22} aria-hidden="true" />
      </button>
    </nav>
  );
}

/* ---------- page ---------- */

export default function StaffManagement() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState('admission');
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(TOTAL_STAFF / PAGE_SIZE);
  const rows = useMemo(
    () => staffList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page]
  );

  const viewStaff = (id) => navigate(`/admin/staff/${id}`);
  const addTeacher = () => navigate('/admin/staff/new');

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.page}>
        <Topbar
          title="Teacher & Staff"
          subtitle="Academic Year 2025 - 26"
          onMenuClick={() => setMenuOpen(true)}
        />

        <Tabs value={tab} onChange={setTab} />

        {tab === 'admission' ? (
          <section className={styles.card}>
            <header className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Teacher and Staff Records</h2>
              <button type="button" className={`${styles.btn} ${styles.btnIcon}`} onClick={addTeacher}>
                Add Teacher <PlusCircle size={22} aria-hidden="true" />
              </button>
            </header>

            {/* laptop: table */}
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {columns.map((c) => <th key={c} scope="col">{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s, i) => (
                    <tr key={`${s.id}-${i}`}>
                      <td>{s.id}</td>
                      <td>{s.name}</td>
                      <td>{s.subject}</td>
                      <td>{s.classes.join(', ')}</td>
                      <td>{s.contact}</td>
                      <td>{s.status}</td>
                      <td>{s.joined}</td>
                      <td>
                        <IconButton label={`View ${s.name}`} onClick={() => viewStaff(s.id)}>
                          <Eye size={26} aria-hidden="true" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* tablet + mobile: cards */}
            <ul className={styles.list}>
              {rows.map((s, i) => (
                <li key={`${s.id}-${i}`} className={styles.item}>
                  <span className={styles.itemId}>{s.id}</span>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{s.name}</p>
                    <p className={styles.itemMeta}>
                      {s.classTeacherOf}
                      <span className={styles.sep} aria-hidden="true" />
                      {s.classes.join(', ')}
                      <span className={styles.sep} aria-hidden="true" />
                      <span className={styles.paid}>{s.status}</span>
                    </p>
                  </div>
                  <div className={styles.itemActions}>
                    <IconButton label={`Call ${s.name}`} href={`tel:${s.contact}`}>
                      <Phone size={24} aria-hidden="true" />
                    </IconButton>
                    <IconButton label={`View ${s.name}`} onClick={() => viewStaff(s.id)}>
                      <Eye size={26} aria-hidden="true" />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>

            <footer className={styles.footer}>
              <p className={styles.count}>
                Showing {rows.length} of {TOTAL_STAFF} teachers &amp; staff
              </p>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </footer>
          </section>
        ) : (
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Employee profile</h2>
            <p className={styles.empty}>Select a teacher from Employee admission to see their profile.</p>
          </section>
        )}
      </main>
    </div>
  );
}