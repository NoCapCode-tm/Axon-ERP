import { useState } from 'react';
import { Plus, User, UserCog, UserMinus } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import AddPlanModal from '../components/AddPlanModal.jsx';
import styles from '../CSS/Subscription.module.css';

// TODO: replace with API data
const stats = [
  { label: 'Total active subscription', note: 'up 12% from last year', value: '101' },
  { label: 'New subscription', note: 'up 8% from last month', value: '15' },
  { label: 'Renewals', note: 'up 15% from last month', value: '23' },
  { label: 'Cancelled', note: 'down 5% from last month', value: '04' },
];

const transactions = [
  { id: 1, school: 'Greenfield Public School', plan: 'Basic', amount: '19,999', status: 'Paid' },
  { id: 2, school: 'Greenfield Public School', plan: 'Basic', amount: '19,999', status: 'Pending' },
  { id: 3, school: 'Greenfield Public School', plan: 'Basic', amount: '19,999', status: 'Failed' },
  { id: 4, school: 'Greenfield Public School', plan: 'Basic', amount: '19,999', status: 'Paid' },
];

const plans = ['Basic', 'Pro', 'Elite', 'Advance', 'Enterprise'].map((name) => ({
  id: name,
  name,
  price: '5,999',
  duration: '1 year',
  features: 'Attendance, Student management',
  buyers: 28,
}));

const history = [
  { id: 1, school: 'Greenfield Public School', plan: 'Pro', start: '1 Apr 2025', end: '31 Mar 2026', amount: '11,999', status: 'Paid' },
  { id: 2, school: 'Greenfield Public School', plan: 'Pro', start: '1 Apr 2025', end: '31 Mar 2026', amount: '11,999', status: 'Pending' },
  { id: 3, school: 'Greenfield Public School', plan: 'Pro', start: '1 Apr 2025', end: '31 Mar 2026', amount: '11,999', status: 'Failed' },
  { id: 4, school: 'Greenfield Public School', plan: 'Pro', start: '1 Apr 2025', end: '31 Mar 2026', amount: '11,999', status: 'Paid' },
  { id: 5, school: 'Greenfield Public School', plan: 'Pro', start: '1 Apr 2025', end: '31 Mar 2026', amount: '11,999', status: 'Paid' },
];

function Status({ value }) {
  return <span className={`${styles.status} ${styles[value.toLowerCase()]}`}>{value}</span>;
}

function Actions({ onView, onEdit, onRemove }) {
  return (
    <div className={styles.actions}>
      <button className={styles.actionBtn} aria-label="View" title="View" onClick={onView}><User size={18} /></button>
      <button className={styles.actionBtn} aria-label="Edit" title="Edit" onClick={onEdit}><UserCog size={18} /></button>
      <button className={styles.actionBtn} aria-label="Remove" title="Remove" onClick={onRemove}><UserMinus size={18} /></button>
    </div>
  );
}

export default function Subscription() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [addPlanOpen, setAddPlanOpen] = useState(false);

  // plan = { name, price, maxUsers (null = no limit), description, features: [ids] }
  const handleAddPlan = (plan) => {
    // TODO: POST to your API, then refresh the plan list
    console.log('New plan', plan);
  };

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.page}>
      <Topbar title="Subscription" subtitle="Academic Year 2025 - 26" onMenuClick={() => setMenuOpen(true)} />

      <div className={styles.grid}>
        {/* LEFT COLUMN (desktop) */}
        <div className={styles.col}>
          <section className={`${styles.card} ${styles.plans}`}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>Plan Details</h2>
              <button type="button" className={styles.primaryBtn} onClick={() => setAddPlanOpen(true)}>
                Add new plan <Plus size={18} />
              </button>
            </div>

            {/* Desktop: table */}
            <div className={`${styles.tableWrap} ${styles.desktopOnly}`}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Plan Name</th><th>Price</th><th>Duration</th>
                    <th>Features</th><th>Active Buyers</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.price}</td>
                      <td>{p.duration}</td>
                      <td className={styles.features}>{p.features}</td>
                      <td>{p.buyers} schools</td>
                      <td><Actions /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tablet + mobile: cards */}
            <div className={`${styles.planCards} ${styles.smallOnly}`}>
              {plans.map((p) => (
                <article key={p.id} className={styles.planCard}>
                  <div className={styles.planInfo}>
                    <h3 className={styles.planName}>{p.name} Plan</h3>
                    <p className={styles.planMeta}>
                      <span>Rs. {p.price}</span>
                      <span>{p.duration}</span>
                      <span>{p.buyers} Schools</span>
                    </p>
                    <p className={styles.planFeatures}>{p.features}</p>
                  </div>
                  <Actions />
                </article>
              ))}
            </div>
          </section>

          <section className={`${styles.card} ${styles.history}`}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>Subscription History</h2>
              <button className={styles.primaryBtn}>View More</button>
            </div>
            <div className={styles.tableWrap}>
              <table className={`${styles.table} ${styles.historyTable}`}>
                <thead>
                  <tr>
                    <th>School Name</th><th>Plan</th><th>Start Date</th><th>End Date</th>
                    <th>Amount</th><th>Active Buyer</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id}>
                      <td>{h.school}</td>
                      <td>{h.plan}</td>
                      <td>{h.start}</td>
                      <td>{h.end}</td>
                      <td>{h.amount}</td>
                      <td><Status value={h.status} /></td>
                      <td><Actions /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (desktop) */}
        <div className={styles.col}>
          <section className={`${styles.card} ${styles.stats}`}>
            <h2 className={styles.cardTitle}>Subscription Plan</h2>
            <ul className={styles.statList}>
              {stats.map((s) => (
                <li key={s.label} className={styles.stat}>
                  <div>
                    <p className={styles.statLabel}>{s.label}</p>
                    <p className={styles.statNote}>{s.note}</p>
                  </div>
                  <span className={styles.statValue}>{s.value}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${styles.card} ${styles.transactions}`}>
            <h2 className={styles.cardTitle}>Recent Transactions</h2>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr><th>School Name</th><th>Plan</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.school}</td>
                      <td>{t.plan}</td>
                      <td>{t.amount}</td>
                      <td><Status value={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      </main>

      <AddPlanModal open={addPlanOpen} onClose={() => setAddPlanOpen(false)} onSubmit={handleAddPlan} />
    </div>
  );
}