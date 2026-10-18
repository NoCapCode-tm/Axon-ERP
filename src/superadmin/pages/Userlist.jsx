import { useMemo, useState } from 'react';
import {
  Search, Landmark, GraduationCap, Headset,
  User, UserCog, UserMinus, UserCheck, ChevronLeft, ChevronRight,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import styles from '../CSS/Userlist.module.css';

// dummy data
const stats = [
  { id: 'admins', value: '284', label: 'School Admins', icon: Landmark },
  { id: 'teachers', value: '1,842', label: 'Teachers', icon: GraduationCap },
  { id: 'support', value: '96', label: 'Support Staff', icon: Headset },
];

const schools = [
  { name: 'Delhi Public School', domain: 'dps.edu' },
  { name: 'Ryan International', domain: 'ryan.edu' },
  { name: 'Sunrise International', domain: 'sunrise.edu' },
  { name: 'Heritage Academy', domain: 'heritage.edu' },
  { name: 'Green Valley School', domain: 'gvs.edu' },
];

const people = [
  'Arjun Sharma', 'Priya Mehta', 'Rohan Verma', 'Neha Singh', 'Karan Patel', 'Ananya Iyer',
  'Vikram Joshi', 'Sneha Reddy', 'Rahul Gupta', 'Meera Nair', 'Aman Khanna', 'Divya Rao',
  'Sanjay Mishra', 'Pooja Desai', 'Nikhil Bose', 'Kavya Menon', 'Imran Shaikh',
];

const titles = ['School Admin', 'School Admin', 'Teacher', 'Support Staff'];

const initialUsers = Array.from({ length: 51 }, (_, i) => {
  const [first, last] = people[i % people.length].split(' ');
  const school = schools[i % schools.length];
  return {
    id: `user-${i + 1}`,
    name: `${first} ${last}`,
    title: titles[i % titles.length],
    school: school.name,
    email: `${first.toLowerCase()}.${last.charAt(0).toLowerCase()}@${school.domain}`,
    status: i % 7 === 6 ? 'Inactive' : 'Active',
  };
});

const PAGE_SIZE = 17;

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className={`${styles.card} ${styles.stat}`}>
      <span className={styles.avatar} aria-hidden="true"><Icon size={28} /></span>
      <div>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

// shared by the table row and the mobile card
function RowActions({ user, onAction }) {
  const active = user.status === 'Active';
  const buttons = [
    { id: 'view', label: 'View user', icon: User },
    { id: 'manage', label: 'Manage user', icon: UserCog },
    active
      ? { id: 'toggle', label: 'Deactivate user', icon: UserMinus }
      : { id: 'toggle', label: 'Activate user', icon: UserCheck },
  ];
  return (
    <div className={styles.actionGroup}>
      {buttons.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={styles.iconBtn}
          title={label}
          aria-label={`${label}: ${user.name}`}
          onClick={() => onAction(id, user)}
        >
          <Icon size={20} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

export default function AllUsers() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? users.filter((u) => u.school.toLowerCase().includes(q)) : users;
  }, [users, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleAction = (type, user) => {
    if (type === 'toggle') {
      // TODO: call your API, then update state
      setUsers((list) =>
        list.map((u) => (u.id === user.id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u))
      );
      return;
    }
    // TODO: open view / manage modals
    console.log(type, user);
  };

  // downloads whatever the search currently shows, all pages
  const handleExport = () => {
    const header = ['User Name', 'User Title', 'School Name', 'Email ID', 'Status'];
    const lines = [header, ...filtered.map((u) => [u.name, u.title, u.school, u.email, u.status])]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([lines], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusClass = (s) => (s === 'Active' ? styles.statusActive : styles.statusInactive);

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.page}>
        <Topbar
          title="All Users"
          subtitle="Academic Year 2025 - 26"
          onMenuClick={() => setMenuOpen(true)}
        />

        <div className={styles.stats}>
          {stats.map((s) => <StatCard key={s.id} {...s} />)}
        </div>

        <section className={styles.main}>
          <div className={styles.panel}>
            <div className={styles.toolbar}>
              <label className={styles.search}>
                <span className={styles.srOnly}>Search school by name</span>
                <input type="search" placeholder="Search school by name" value={query} onChange={handleSearch} />
                <Search size={26} aria-hidden="true" />
              </label>
              <button type="button" className={styles.exportBtn} onClick={handleExport}>Export</button>
            </div>

            {/* laptop: table */}
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">User Name</th>
                    <th scope="col">User Title</th>
                    <th scope="col">School Name</th>
                    <th scope="col">Email ID</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.title}</td>
                      <td>{u.school}</td>
                      <td className={styles.email}>{u.email}</td>
                      <td className={statusClass(u.status)}>{u.status}</td>
                      <td><RowActions user={u} onAction={handleAction} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* tablet + mobile: cards */}
            <ul className={styles.cardList}>
              {rows.map((u) => (
                <li key={u.id} className={styles.userCard}>
                  <div className={styles.userHead}>
                    <h3 className={styles.userName}>{u.name}</h3>
                    <RowActions user={u} onAction={handleAction} />
                  </div>
                  <dl className={styles.details}>
                    <dt>User Title</dt>
                    <dd>{u.title}</dd>
                    <dt>School Name</dt>
                    <dd>{u.school}</dd>
                    <dt>Email ID</dt>
                    <dd><a href={`mailto:${u.email}`}>{u.email}</a></dd>
                    <dt>Status</dt>
                    <dd className={statusClass(u.status)}>{u.status}</dd>
                  </dl>
                </li>
              ))}
            </ul>

            {rows.length === 0 && (
              <p className={styles.empty}>No users found for "{query}". Check the school name and try again.</p>
            )}
          </div>

          <footer className={styles.footer}>
            <p className={styles.showing}>Showing {rows.length} of {filtered.length} users</p>
            <nav className={styles.pager} aria-label="User pages">
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage(current - 1)}
                disabled={current === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`${styles.pageBtn} ${n === current ? styles.pageActive : ''}`}
                  onClick={() => setPage(n)}
                  aria-current={n === current ? 'page' : undefined}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage(current + 1)}
                disabled={current === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </nav>
          </footer>
        </section>
      </main>
    </div>
  );
}