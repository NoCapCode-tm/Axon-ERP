import { useMemo, useState } from 'react';
import { Search, PlusCircle, User, UserCog, UserMinus, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import NewTicketModal from '../components/NewTicketModal.jsx';
import styles from '../CSS/Ticket.module.css';

// dummy data
const agents = [
  { id: 'a1', name: 'Priya M', tickets: 14, resolved: 11 },
  { id: 'a2', name: 'Arjun K', tickets: 18, resolved: 15 },
  { id: 'a3', name: 'Neha S', tickets: 12, resolved: 9 },
];

const schools = ['Ryan International', 'Sunrise International', 'Heritage Academy', 'Delhi Public School', 'Green Valley School'];
const subjects = [
  'Unable to export student reports',
  'Fee receipts not generating',
  'SMS alerts not delivered',
  'Timetable not saving',
  'Teachers cannot log in',
];
const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Open', 'In progress', 'Resolved'];
const assignees = ['Priya M', 'Arjun K', 'Neha S'];
const times = ['2 hrs ago', '5 hrs ago', '1 day ago', '2 days ago', '4 days ago'];

const allTickets = Array.from({ length: 25 }, (_, i) => ({
  id: `TK-${String(65 - i).padStart(3, '0')}`,
  school: schools[i % schools.length],
  subject: subjects[i % subjects.length],
  priority: priorities[i % 3 === 0 ? 0 : i % 3],
  status: statuses[i % 4 === 3 ? 2 : i % 4 === 2 ? 1 : 0],
  assignee: assignees[i % assignees.length],
  created: times[i % times.length],
}));

const PAGE_SIZE = 11;

const rowActions = [
  { id: 'view', label: 'View ticket', icon: User },
  { id: 'reassign', label: 'Reassign ticket', icon: UserCog },
  { id: 'unassign', label: 'Unassign ticket', icon: UserMinus },
];

const statusClass = (s) =>
  s === 'Open' ? styles.statusOpen : s === 'In progress' ? styles.statusProgress : styles.statusDone;

function AgentCard({ name, tickets, resolved }) {
  const pct = tickets ? Math.round((resolved / tickets) * 100) : 0;
  return (
    <div className={`${styles.card} ${styles.agent}`}>
      <span className={styles.avatar} aria-hidden="true">{name.charAt(0)}</span>
      <div className={styles.agentBody}>
        <div className={styles.agentTop}>
          <p className={styles.agentName}>{name}</p>
          <span className={styles.agentPct}>{pct}%</span>
        </div>
        <p className={styles.agentStats}>{tickets} tickets &nbsp; {resolved} resolved</p>
        <div
          className={styles.bar}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name} resolved ${pct}%`}
        >
          <div className={styles.barFill} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

function RowActions({ ticket, onAction }) {
  return (
    <div className={styles.actionGroup}>
      {rowActions.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={styles.iconBtn}
          title={label}
          aria-label={`${label} ${ticket.id}`}
          onClick={() => onAction(id, ticket)}
        >
          <Icon size={20} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

export default function Ticket() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? allTickets.filter((t) => t.school.toLowerCase().includes(q)) : allTickets;
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  // TODO: connect these to your modals / API
  const handleAction = (type, ticket) => console.log(type, ticket);
  const handleNewTicket = () => setModal('new-ticket');
  const closeModal = () => setModal(null);

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.page}>
        <Topbar
          title="Support & Tickets"
          subtitle="Academic Year 2025 - 26"
          onMenuClick={() => setMenuOpen(true)}
        />

        {/* 3 across on laptop, 2 on tablet, stacked under the list on mobile */}
        <div className={styles.agents}>
          {agents.map((a) => <AgentCard key={a.id} {...a} />)}
        </div>

        <section className={styles.card}>
          <div className={styles.toolbar}>
            <label className={styles.search}>
              <span className={styles.srOnly}>Search school by name</span>
              <input type="search" placeholder="Search school by name" value={query} onChange={handleSearch} />
              <Search size={26} aria-hidden="true" />
            </label>
            <button type="button" className={styles.newBtn} onClick={handleNewTicket}>
              New Ticket <PlusCircle size={22} aria-hidden="true" />
            </button>
          </div>

          {/* laptop: table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Ticket ID</th>
                  <th scope="col">School</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Status</th>
                  <th scope="col">Assignee</th>
                  <th scope="col">Created</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.school}</td>
                    <td className={styles.subject}>{t.subject}</td>
                    <td>{t.priority}</td>
                    <td className={statusClass(t.status)}>{t.status}</td>
                    <td>{t.assignee}</td>
                    <td>{t.created}</td>
                    <td><RowActions ticket={t} onAction={handleAction} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* tablet + mobile: cards */}
          <ul className={styles.cardList}>
            {rows.map((t) => (
              <li key={t.id} className={styles.ticketCard}>
                <h3 className={styles.ticketSchool}>{t.school}</h3>
                <div className={styles.ticketMeta}>
                  <span>{t.id}</span>
                  <span className={styles.bullet}>{t.subject}</span>
                  <span>{t.assignee}</span>
                  <span className={styles.bullet}>{t.created}</span>
                </div>
                <div className={styles.ticketActions}>
                  <RowActions ticket={t} onAction={handleAction} />
                </div>
                <div className={styles.pills}>
                  <span className={styles.pill}>{t.priority}</span>
                  <span className={styles.pill}>{t.status}</span>
                </div>
              </li>
            ))}
          </ul>

          {rows.length === 0 && (
            <p className={styles.empty}>No tickets found for "{query}". Check the school name and try again.</p>
          )}

          <footer className={styles.footer}>
            <p className={styles.showing}>Showing {rows.length} of {filtered.length} tickets</p>
            <nav className={styles.pager} aria-label="Ticket pages">
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

      <NewTicketModal
        open={modal === 'new-ticket'}
        onClose={closeModal}
        onSubmit={(ticket) => console.log('new ticket', ticket)}
      />
    </div>
  );
}