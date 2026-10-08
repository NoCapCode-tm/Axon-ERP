import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  CirclePlus,
  UserRound,
  UserRoundCog,
  UserRoundMinus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AddSchoolModal from "../components/AddSchoolModal";
import styles from "../CSS/Schoollist.module.css";

const baseSchool = {
  name: "Sunrise International School",
  schoolId: "SCH001",
  email: "admin@sunrise.edu",
  admin: "Rajan Mehta",
  plan: "Pro",
  students: 1240,
  status: "Active",
  joined: "12 Aug 2025",
};

const schools = Array.from({ length: 14 }, (_, i) => ({
  ...baseSchool,
  id: i + 1,
  status: i === 1 ? "Suspended" : i === 2 ? "Pending" : "Active",
}));

const ITEMS_PER_PAGE = 14;

function getStatusClass(status, styles) {
  if (status === "Suspended") return styles.suspended;
  if (status === "Pending") return styles.pending;
  return styles.active;
}

// "Sunrise International School" -> "Sunrise Internat..."
function truncateText(text, max) {
  return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text;
}

// "rajan.mehta@sunrise.edu" -> "rajan.mehta@..."  (keeps everything before @)
function truncateEmail(email, max) {
  const [local = "", domain] = email.split("@");
  if (domain === undefined) return truncateText(email, max);
 
  const keep = max - 4; // room for "@..."
  return local.length > keep
    ? `${local.slice(0, keep).trimEnd()}...@...`
    : `${local}@...`;
}


// "12 Aug 2025" -> "12 Aug, 2025" (desktop table format)
function formatTableDate(date) {
  return date.replace(/^(\d+\s\w+)\s/, "$1, ");
}

function SchoolActions({ school, navigate, styles }) {
  return (
    <div className={styles.actionButtons}>
      <button
        type="button"
        className={styles.actionButton}
        title="View school"
        aria-label={`View ${school.name}`}
        onClick={() => console.log("View school", school.id)}
      >
        <UserRound size={19} />
      </button>

      <button
        type="button"
        className={styles.actionButton}
        title="Manage users"
        aria-label={`Manage users of ${school.name}`}
        onClick={() => navigate("/superadmin/users")}
      >
        <UserRoundCog size={19} />
      </button>

      <button
        type="button"
        className={styles.actionButton}
        title="Suspend school"
        aria-label={`Suspend ${school.name}`}
        onClick={() => console.log("Suspend school", school.id)}
      >
        <UserRoundMinus size={19} />
      </button>
    </div>
  );
}

export default function Schoollist() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [addSchoolOpen, setAddSchoolOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSchools = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return schools;

    return schools.filter(
      (school) =>
        school.name.toLowerCase().includes(query) ||
        school.schoolId.toLowerCase().includes(query) ||
        school.email.toLowerCase().includes(query) ||
        school.admin.toLowerCase().includes(query)
    );
  }, [search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSchools.length / ITEMS_PER_PAGE)
  );

  const visibleSchools = filteredSchools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <div className={styles.shell}>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className={styles.page}>
        <Topbar
          title="School Management"
          subtitle="Academic Year 2025 - 26"
          onMenuClick={() => setMenuOpen(true)}
        />

        <section className={styles.schoolCard}>
          {/* HEADER */}
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>All Schools</h2>

            <div className={styles.headerActions}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search school by name"
                  value={search}
                  onChange={handleSearch}
                  aria-label="Search school by name"
                />
                <Search
                  size={26}
                  className={styles.searchIcon}
                  aria-hidden="true"
                />
              </div>

              <button
                type="button"
                className={styles.addButton}
                onClick={() => setAddSchoolOpen(true)}
              >
                <span>Add school</span>
                <CirclePlus size={20} />
              </button>
            </div>
          </div>

          {/* ================= DESKTOP TABLE ================= */}
          <div className={styles.desktopTable}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>School Name</th>
                    <th>School ID</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Plan</th>
                    <th>Students</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleSchools.map((school) => (
                    <tr key={school.id}>
                      <td>
                        <span
                          className={styles.tableSchoolName}
                          title={school.name}
                        >
                          {truncateText(school.name, 20)}
                        </span>
                      </td>
                      <td>{school.schoolId}</td>
                      <td>
                        <span
                          className={styles.tableEmail}
                          title={school.email}
                        >
                          {truncateEmail(school.email, 20)}
                        </span>
                      </td>
                      <td>{school.admin}</td>
                      <td>{school.plan}</td>
                      <td>{school.students}</td>
                      <td>
                        <span
                          className={`${styles.status} ${getStatusClass(
                            school.status,
                            styles
                          )}`}
                        >
                          {school.status}
                        </span>
                      </td>
                      <td>{formatTableDate(school.joined)}</td>
                      <td>
                        <SchoolActions
                          school={school}
                          navigate={navigate}
                          styles={styles}
                        />
                      </td>
                    </tr>
                  ))}

                  {visibleSchools.length === 0 && (
                    <tr>
                      <td colSpan={9} className={styles.mobileNoResults}>
                        No schools found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= TABLET / MOBILE CARDS ================= */}
          <div className={styles.mobileSchools}>
            {visibleSchools.map((school) => (
              <article className={styles.schoolItem} key={school.id}>
                <div className={styles.schoolInfo}>
                  <h3 className={styles.mobileSchoolName} title={school.name}>
                    {truncateText(school.name, 28)}
                  </h3>

                  <div className={styles.mobileDetails}>
                    <span>{school.schoolId}</span>
                    <span className={styles.dot}>•</span>
                    <span className={styles.mobileAdmin}>{school.admin}</span>
                    <span className={styles.dot}>•</span>
                    <span>Student - {school.students.toLocaleString()}</span>
                  </div>

                  <div className={styles.mobileDetails}>
                    <span className={styles.mobileEmail} title={school.email}>
                      {truncateEmail(school.email, 22)}
                    </span>
                    <span className={styles.dot}>•</span>
                    <span>{school.joined}</span>
                  </div>

                  <div className={styles.badges}>
                    <span className={styles.planBadge}>{school.plan}</span>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(
                        school.status,
                        styles
                      )}`}
                    >
                      {school.status}
                    </span>
                  </div>
                </div>

                <SchoolActions
                  school={school}
                  navigate={navigate}
                  styles={styles}
                />
              </article>
            ))}

            {visibleSchools.length === 0 && (
              <div className={styles.mobileNoResults}>No schools found</div>
            )}
          </div>

          {/* PAGINATION */}
          <div className={styles.pagination}>
            <p className={styles.showingText}>
              Showing{" "}
              {filteredSchools.length === 0
                ? 0
                : Math.min(currentPage * ITEMS_PER_PAGE, filteredSchools.length)}{" "}
              of {filteredSchools.length} schools
            </p>

            <div className={styles.pageControls}>
              <button
                type="button"
                className={styles.pageArrow}
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={25} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    type="button"
                    key={page}
                    className={`${styles.pageNumber} ${
                      currentPage === page ? styles.currentPage : ""
                    }`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                className={styles.pageArrow}
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={25} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <AddSchoolModal
        open={addSchoolOpen}
        onClose={() => setAddSchoolOpen(false)}
        onSubmit={(school) => {
          console.log("new school", school);
          setAddSchoolOpen(false);
        }}
      />
    </div>
  );
}