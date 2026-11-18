import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, SquarePen, Trash2, Upload, CalendarDays } from 'lucide-react';
import s from '../CSS/AddTeacherWizard.module.css';

/* ---------- static data (replace with API data) ---------- */

const STEPS = [
  { id: 'basic', label: 'Basic Info.', title: 'Basic Information', subtitle: 'Enter the personal details of the employee' },
  { id: 'professional', label: 'Professional Info.', title: 'Professional Information', subtitle: 'Enter the professional details of the employee' },
  { id: 'role', label: 'Role Assignment', title: 'Role Assignment', subtitle: 'Assign role to the employee' },
  { id: 'documents', label: 'Document Upload', title: 'Documents Uploaded', subtitle: 'Upload the necessary documents' },
  { id: 'salary', label: 'Salary', title: 'Salary Details', subtitle: 'Enter the salary details of the employee' },
  { id: 'review', label: 'Review', title: 'Review', subtitle: 'Check everything before you submit' },
];

const GENDERS = ['Male', 'Female', 'Other'];
const CITIES = ['Indore', 'Bhopal', 'Mumbai', 'Pune', 'New Delhi', 'Bengaluru'];
const STATES = ['Madhya Pradesh', 'Maharashtra', 'Delhi', 'Karnataka'];
const COUNTRIES = ['India'];
const SUBJECTS = ['Science', 'Maths', 'English', 'Hindi', 'Social Science', 'Computer Science'];
const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const SECTIONS = ['A', 'B', 'C', 'D'];
const ROLES = ['Subject Teacher', 'Class Teacher', 'Coordinator'];
const PAYMENT_MODES = ['Bank transfer', 'Cheque', 'Cash'];

const DOC_SLOTS = [
  { key: 'aadhar', title: 'Aadhar card' },
  { key: 'birth', title: 'Birth Certificate' },
  { key: 'degree', title: 'Degree certificate' },
  { key: 'other', title: 'Additional Documents' },
];

const MAX_FILE_MB = 5;
const DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const INITIAL = {
  name: '', dob: '', gender: '', email: '', phone: '',
  city: '', state: '', pincode: '', country: '', photo: null,
  employeeId: '', joiningDate: '', qualification: '', experience: '', designation: '',
  subject: '', classes: [], section: '', role: '',
  documents: { aadhar: null, birth: null, degree: null, other: null },
  basicSalary: '', allowances: '', deductions: '', paymentMode: '',
};

const REQUIRED = {
  basic: ['name', 'dob', 'email', 'phone', 'city', 'state', 'pincode', 'country'],
  professional: ['employeeId', 'joiningDate', 'qualification', 'experience', 'designation'],
  role: ['subject', 'classes', 'section', 'role'],
  documents: [],
  salary: ['basicSalary', 'paymentMode'],
  review: [],
};

/* ---------- helpers ---------- */

const todayISO = () => new Date().toISOString().slice(0, 10);
const digitsOnly = (v, max) => v.replace(/\D/g, '').slice(0, max);
const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} mb`;

function validate(stepId, f) {
  const errors = {};

  REQUIRED[stepId].forEach((key) => {
    const v = f[key];
    if (Array.isArray(v) ? v.length === 0 : !String(v).trim()) errors[key] = 'This field is required';
  });

  if (stepId === 'basic') {
    if (!errors.email && !/^\S+@\S+\.\S+$/.test(f.email)) errors.email = 'Enter a valid email address';
    if (!errors.phone && f.phone.length !== 10) errors.phone = 'Enter a 10 digit phone number';
    if (!errors.pincode && f.pincode.length !== 6) errors.pincode = 'Enter a 6 digit pincode';
    if (!errors.dob) {
      const limit = new Date();
      limit.setFullYear(limit.getFullYear() - 18);
      if (new Date(f.dob) > limit) errors.dob = 'Employee must be at least 18 years old';
    }
  }

  if (stepId === 'professional') {
    if (!errors.experience && !(Number(f.experience) >= 0 && Number(f.experience) <= 60)) {
      errors.experience = 'Enter years between 0 and 60';
    }
    if (!errors.joiningDate && f.dob && f.joiningDate < f.dob) {
      errors.joiningDate = 'Joining date cannot be before date of birth';
    }
  }

  if (stepId === 'documents') {
    const busy = Object.values(f.documents).some((d) => d && d.status === 'uploading');
    if (busy) errors.documents = 'Wait for the uploads to finish';
  }

  if (stepId === 'salary') {
    ['basicSalary', 'allowances', 'deductions'].forEach((k) => {
      if (!errors[k] && f[k] !== '' && !(Number(f[k]) >= 0)) errors[k] = 'Enter a valid amount';
    });
  }

  return errors;
}

/* ---------- form building blocks ---------- */

function Field({ id, label, required, error, span, children }) {
  return (
    <div className={`${s.field} ${span === 2 ? s.span2 : ''} ${span === 4 ? s.span4 : ''}`}>
      <label htmlFor={id} className={s.label}>
        {label}
        {required && '*'}
      </label>
      {children}
      {error && <p className={s.error} id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
}

function TextInput({ id, value, onChange, error, ...rest }) {
  return (
    <input
      id={id}
      className={s.control}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-err` : undefined}
      {...rest}
    />
  );
}

function SelectInput({ id, value, onChange, options, placeholder, error }) {
  return (
    <div className={s.selectWrap}>
      <select
        id={id}
        className={`${s.control} ${s.select} ${value ? '' : s.placeholder}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className={s.selectIcon} size={22} aria-hidden="true" />
    </div>
  );
}

function DateInput({ id, value, onChange, error, max }) {
  return (
    <div className={s.selectWrap}>
      <input
        id={id}
        type="date"
        max={max}
        className={`${s.control} ${s.date} ${value ? '' : s.placeholder}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      <CalendarDays className={s.selectIcon} size={26} aria-hidden="true" />
    </div>
  );
}

// dropdown with checkboxes (Class 1, Class 2 ...)
function ClassPicker({ id, value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = (c) => onChange(value.includes(c) ? value.filter((x) => x !== c) : [...value, c]);
  const ordered = CLASSES.filter((c) => value.includes(c));

  return (
    <div className={s.selectWrap} ref={ref}>
      <button
        type="button"
        id={id}
        className={`${s.control} ${s.select} ${s.pickerBtn} ${ordered.length ? '' : s.placeholder}`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={s.pickerText}>{ordered.length ? ordered.join(', ') : 'Select class'}</span>
      </button>
      <ChevronDown className={`${s.selectIcon} ${open ? s.flip : ''}`} size={22} aria-hidden="true" />

      {open && (
        <ul className={s.panel}>
          {CLASSES.map((c) => (
            <li key={c}>
              <label className={s.check}>
                <input type="checkbox" checked={value.includes(c)} onChange={() => toggle(c)} />
                <span className={s.box}><Check size={16} strokeWidth={3} aria-hidden="true" /></span>
                {c}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PhotoUpload({ file, onPick, error }) {
  const inputRef = useRef(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!file) { setUrl(null); return undefined; }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  return (
    <div className={`${s.field} ${s.span4}`}>
      <span className={s.label}>Photo</span>
      <button type="button" className={s.photo} onClick={() => inputRef.current?.click()}>
        {url
          ? <img src={url} alt="Selected employee" className={s.photoImg} />
          : <span>Click to upload photo</span>}
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/png,image/jpeg"
        onChange={(e) => { onPick(e.target.files?.[0]); e.target.value = ''; }}
      />
      {error && <p className={s.error} role="alert">{error}</p>}
    </div>
  );
}

function DocCard({ title, doc, onPick, onRemove }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const pick = (file) => { if (file) onPick(file); };

  return (
    <div className={s.docCard}>
      <h3 className={s.docTitle}>{title}</h3>

      <div
        className={`${s.drop} ${dragging ? s.dropActive : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]); }}
      >
        <span className={s.dropIcon}><Upload size={26} aria-hidden="true" /></span>
        <p className={s.dropText}>Drag and drop files here</p>
        <p className={s.dropHint}>PDF, JPEG, PNG (max {MAX_FILE_MB}mb)</p>
        <button type="button" className={s.browse} onClick={() => inputRef.current?.click()}>
          Browse files
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }}
      />

      {doc && (
        <>
          <div className={s.fileRow}>
            <div className={s.fileInfo}>
              <p className={s.fileName}>{doc.file.name}</p>
              <p className={s.fileSize}>{formatSize(doc.file.size)}</p>
            </div>
            <div className={s.fileActions}>
              <button type="button" className={s.roundBtn} aria-label={`Replace ${title}`} onClick={() => inputRef.current?.click()}>
                <SquarePen size={20} aria-hidden="true" />
              </button>
              <button type="button" className={s.roundBtn} aria-label={`Remove ${title}`} onClick={onRemove}>
                <Trash2 size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
          {doc.error ? (
            <p className={s.error} role="alert">{doc.error}</p>
          ) : (
            <div className={s.status} role="status">
              <span className={s.track}>
                <span className={`${s.fill} ${doc.status === 'uploading' ? s.fillRun : ''}`} />
              </span>
              <span className={s.statusText}>{doc.status === 'uploading' ? 'Uploading' : 'Uploaded'}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------- review step ---------- */

function ReviewSection({ title, onEdit, rows }) {
  return (
    <section className={s.review}>
      <header className={s.reviewHead}>
        <h3 className={s.reviewTitle}>{title}</h3>
        <button type="button" className={s.linkBtn} onClick={onEdit}>Edit</button>
      </header>
      <dl className={s.reviewList}>
        {rows.map(([k, v]) => (
          <div key={k} className={s.reviewRow}>
            <dt>{k}</dt>
            <dd>{v || '-'}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ReviewStep({ f, goTo }) {
  const docNames = DOC_SLOTS.map((d) => [d.title, f.documents[d.key]?.file.name || 'Not uploaded']);
  return (
    <div className={s.reviewWrap}>
      <ReviewSection title="Basic information" onEdit={() => goTo(0)} rows={[
        ['Name', f.name], ['Date of birth', f.dob], ['Gender', f.gender], ['Email', f.email],
        ['Phone', f.phone], ['City', f.city], ['State', f.state], ['Pincode', f.pincode],
        ['Country', f.country], ['Photo', f.photo?.name || 'Not uploaded'],
      ]} />
      <ReviewSection title="Professional information" onEdit={() => goTo(1)} rows={[
        ['Employee ID', f.employeeId], ['Joining date', f.joiningDate], ['Qualification', f.qualification],
        ['Experience', `${f.experience} years`], ['Designation', f.designation],
      ]} />
      <ReviewSection title="Role assignment" onEdit={() => goTo(2)} rows={[
        ['Subject', f.subject], ['Classes', CLASSES.filter((c) => f.classes.includes(c)).join(', ')],
        ['Section', f.section], ['Role', f.role],
      ]} />
      <ReviewSection title="Documents" onEdit={() => goTo(3)} rows={docNames} />
      <ReviewSection title="Salary" onEdit={() => goTo(4)} rows={[
        ['Basic salary', f.basicSalary], ['Allowances', f.allowances || '0'],
        ['Deductions', f.deductions || '0'], ['Payment mode', f.paymentMode],
      ]} />
    </div>
  );
}

/* ---------- wizard ---------- */

export default function AddTeacherWizard({ onCancel, onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  const formRef = useRef(null);
  const headingRef = useRef(null);
  const timers = useRef([]);
  const firstRender = useRef(true);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  // clear pending fake-upload timers on unmount
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // move focus + scroll to the top when the step changes
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
    setDirty(true);
  };

  const pickPhoto = (file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setErrors((e) => ({ ...e, photo: 'Photo must be a JPEG or PNG' }));
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setErrors((e) => ({ ...e, photo: `Photo must be under ${MAX_FILE_MB}mb` }));
      return;
    }
    set('photo')(file);
  };

  const setDoc = (key, doc) => {
    setForm((f) => ({ ...f, documents: { ...f.documents, [key]: doc } }));
    setErrors((e) => { const n = { ...e }; delete n.documents; return n; });
    setDirty(true);
  };

  const pickDoc = (key, file) => {
    if (!DOC_TYPES.includes(file.type)) {
      setDoc(key, { file, status: 'error', error: 'Only PDF, JPEG or PNG files are allowed' });
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setDoc(key, { file, status: 'error', error: `File must be under ${MAX_FILE_MB}mb` });
      return;
    }
    setDoc(key, { file, status: 'uploading' });
    // TODO: replace this timer with the real upload request
    const t = setTimeout(() => {
      setForm((f) => (f.documents[key]?.file === file
        ? { ...f, documents: { ...f.documents, [key]: { file, status: 'uploaded' } } }
        : f));
    }, 900);
    timers.current.push(t);
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (isLast) {
      // TODO: send `form` to the API (use FormData for the files)
      onSubmit?.(form);
      return;
    }

    const found = validate(current.id, form);
    // a document with a file error blocks the step too
    const badDoc = Object.values(form.documents).some((d) => d && d.error);
    if (badDoc) found.documents = 'Fix or remove the files with errors';

    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setStep((n) => n + 1);
  };

  const handlePrev = () => { setErrors({}); setStep((n) => n - 1); };

  const handleCancel = () => {
    if (!dirty || window.confirm('Discard this teacher? Your entries will be lost.')) onCancel?.();
  };

  const goTo = (n) => { setErrors({}); setStep(n); };

  return (
    <section className={s.card}>
      <ol className={s.stepper} aria-label="Progress">
        {STEPS.map((st, i) => (
          <li key={st.id} className={s.stepItem} aria-current={i === step ? 'step' : undefined}>
            <span className={`${s.bar} ${i === step ? s.barActive : ''}`} />
            <span className={s.stepLabel}>{st.label}</span>
          </li>
        ))}
      </ol>

      <p className={s.stepCount}>Step {step + 1} of {STEPS.length}</p>
      <h2 className={s.title} tabIndex={-1} ref={headingRef}>{current.title}</h2>
      <p className={s.subtitle}>{current.subtitle}</p>

      <form ref={formRef} noValidate onSubmit={handleNext}>
        {current.id === 'basic' && (
          <div className={s.grid}>
            <Field id="name" label="Name" required span={2} error={errors.name}>
              <TextInput id="name" value={form.name} onChange={set('name')} error={errors.name} placeholder="Enter Full Name" autoComplete="off" />
            </Field>
            <Field id="dob" label="Date of Birth" required error={errors.dob}>
              <DateInput id="dob" value={form.dob} onChange={set('dob')} error={errors.dob} max={todayISO()} />
            </Field>
            <Field id="gender" label="Gender">
              <SelectInput id="gender" value={form.gender} onChange={set('gender')} options={GENDERS} placeholder="Select gender" />
            </Field>

            <Field id="email" label="Email" required span={2} error={errors.email}>
              <TextInput id="email" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="Enter email address" autoComplete="off" />
            </Field>
            <Field id="phone" label="Phone" required span={2} error={errors.phone}>
              <TextInput id="phone" type="tel" inputMode="numeric" value={form.phone} onChange={(v) => set('phone')(digitsOnly(v, 10))} error={errors.phone} placeholder="Enter phone number" autoComplete="off" />
            </Field>

            <Field id="city" label="City" required error={errors.city}>
              <SelectInput id="city" value={form.city} onChange={set('city')} options={CITIES} placeholder="Select city" error={errors.city} />
            </Field>
            <Field id="state" label="State" required error={errors.state}>
              <SelectInput id="state" value={form.state} onChange={set('state')} options={STATES} placeholder="Select state" error={errors.state} />
            </Field>
            <Field id="pincode" label="Pincode" required error={errors.pincode}>
              <TextInput id="pincode" inputMode="numeric" value={form.pincode} onChange={(v) => set('pincode')(digitsOnly(v, 6))} error={errors.pincode} placeholder="Enter pincode" autoComplete="off" />
            </Field>
            <Field id="country" label="Country" required error={errors.country}>
              <SelectInput id="country" value={form.country} onChange={set('country')} options={COUNTRIES} placeholder="Select country" error={errors.country} />
            </Field>

            <PhotoUpload file={form.photo} onPick={pickPhoto} error={errors.photo} />
          </div>
        )}

        {current.id === 'professional' && (
          <div className={s.grid}>
            <Field id="employeeId" label="Employee ID" required span={2} error={errors.employeeId}>
              <TextInput id="employeeId" value={form.employeeId} onChange={set('employeeId')} error={errors.employeeId} placeholder="Enter ID" autoComplete="off" />
            </Field>
            <Field id="joiningDate" label="Joining Date" required span={2} error={errors.joiningDate}>
              <DateInput id="joiningDate" value={form.joiningDate} onChange={set('joiningDate')} error={errors.joiningDate} />
            </Field>
            <Field id="qualification" label="Qualification" required span={2} error={errors.qualification}>
              <TextInput id="qualification" value={form.qualification} onChange={set('qualification')} error={errors.qualification} placeholder="Enter Qualification" autoComplete="off" />
            </Field>
            <Field id="experience" label="Experience" required span={2} error={errors.experience}>
              <TextInput id="experience" inputMode="decimal" value={form.experience} onChange={(v) => set('experience')(v.replace(/[^\d.]/g, '').slice(0, 4))} error={errors.experience} placeholder="Enter Years of Experience" autoComplete="off" />
            </Field>
            <Field id="designation" label="Designation" required span={4} error={errors.designation}>
              <TextInput id="designation" value={form.designation} onChange={set('designation')} error={errors.designation} placeholder="Enter Designation" autoComplete="off" />
            </Field>
          </div>
        )}

        {current.id === 'role' && (
          <div className={s.grid}>
            <Field id="subject" label="Subject" required span={2} error={errors.subject}>
              <SelectInput id="subject" value={form.subject} onChange={set('subject')} options={SUBJECTS} placeholder="Select subject" error={errors.subject} />
            </Field>
            <Field id="classes" label="Class" required span={2} error={errors.classes}>
              <ClassPicker id="classes" value={form.classes} onChange={set('classes')} error={errors.classes} />
            </Field>
            <Field id="section" label="Section" required span={2} error={errors.section}>
              <SelectInput id="section" value={form.section} onChange={set('section')} options={SECTIONS} placeholder="Select section" error={errors.section} />
            </Field>
            <Field id="role" label="Role Assignment" required span={2} error={errors.role}>
              <SelectInput id="role" value={form.role} onChange={set('role')} options={ROLES} placeholder="Select role" error={errors.role} />
            </Field>
          </div>
        )}

        {current.id === 'documents' && (
          <>
            <div className={s.docGrid}>
              {DOC_SLOTS.map((d) => (
                <DocCard
                  key={d.key}
                  title={d.title}
                  doc={form.documents[d.key]}
                  onPick={(file) => pickDoc(d.key, file)}
                  onRemove={() => setDoc(d.key, null)}
                />
              ))}
            </div>
            {errors.documents && <p className={`${s.error} ${s.formError}`} role="alert">{errors.documents}</p>}
          </>
        )}

        {current.id === 'salary' && (
          <div className={s.grid}>
            <Field id="basicSalary" label="Basic Salary" required span={2} error={errors.basicSalary}>
              <TextInput id="basicSalary" inputMode="decimal" value={form.basicSalary} onChange={(v) => set('basicSalary')(v.replace(/[^\d.]/g, ''))} error={errors.basicSalary} placeholder="Enter basic salary" autoComplete="off" />
            </Field>
            <Field id="paymentMode" label="Payment Mode" required span={2} error={errors.paymentMode}>
              <SelectInput id="paymentMode" value={form.paymentMode} onChange={set('paymentMode')} options={PAYMENT_MODES} placeholder="Select payment mode" error={errors.paymentMode} />
            </Field>
            <Field id="allowances" label="Allowances" span={2} error={errors.allowances}>
              <TextInput id="allowances" inputMode="decimal" value={form.allowances} onChange={(v) => set('allowances')(v.replace(/[^\d.]/g, ''))} error={errors.allowances} placeholder="Enter allowances" autoComplete="off" />
            </Field>
            <Field id="deductions" label="Deductions" span={2} error={errors.deductions}>
              <TextInput id="deductions" inputMode="decimal" value={form.deductions} onChange={(v) => set('deductions')(v.replace(/[^\d.]/g, ''))} error={errors.deductions} placeholder="Enter deductions" autoComplete="off" />
            </Field>
          </div>
        )}

        {current.id === 'review' && <ReviewStep f={form} goTo={goTo} />}

        <div className={s.actions}>
          {step === 0 ? (
            <button type="button" className={s.btn} onClick={handleCancel}>Cancel</button>
          ) : (
            <button type="button" className={s.btn} onClick={handlePrev}>Previous</button>
          )}
          <button type="submit" className={s.btn}>{isLast ? 'Submit' : 'Save & Next'}</button>
        </div>
      </form>
    </section>
  );
}