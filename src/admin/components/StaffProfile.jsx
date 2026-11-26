import { ArrowLeft } from 'lucide-react';
import s from '../CSS/StaffProfile.module.css';

function initials(name) {
  const clean = name.replace(/^(mrs|mr|ms|dr)\.?\s+/i, '').trim();
  return clean.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
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

// `staff` shape is in buildProfile() inside StaffManagement.jsx
// onAction(type): 'message' | 'legal-docs' | 'attendance' | 'activity' | 'timetable' | 'documents'
export default function StaffProfile({ staff, onBack, onAction }) {
  const total = staff.presentDays + staff.absentDays;
  const presentPct = Math.round((staff.presentDays / total) * 100);

  return (
    <div className={s.wrap}>
      <button type="button" className={s.back} onClick={onBack} aria-label="Back to employee list">
        <ArrowLeft size={24} aria-hidden="true" />
      </button>

      <div className={s.actions}>
        <button type="button" className={s.btn} onClick={() => onAction('message')}>Message</button>
        <button type="button" className={s.btn} onClick={() => onAction('legal-docs')}>View Legal Documents</button>
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
            <button type="button" className={s.btn} onClick={() => onAction('attendance')}>View Details</button>
          </div>
          <div className={s.attBody}>
            <Donut percent={presentPct} />
            <ul className={s.legend}>
              <li><span className={`${s.swatch} ${s.swatchPresent}`} />Present <span>{staff.presentDays} Days ({presentPct}%)</span></li>
              <li><span className={`${s.swatch} ${s.swatchAbsent}`} />Absent <span>{staff.absentDays} Days ({100 - presentPct}%)</span></li>
            </ul>
          </div>
        </section>

        <LinkCard area="activity" title="Activity Log" onClick={() => onAction('activity')} />
        <LinkCard area="timetable" title="Timetable" onClick={() => onAction('timetable')} />
        <LinkCard area="documents" title="Documents collected" onClick={() => onAction('documents')} />
      </div>
    </div>
  );
}