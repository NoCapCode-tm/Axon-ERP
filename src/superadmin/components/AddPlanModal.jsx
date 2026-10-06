import { useState } from 'react';
import { CheckSquare, Banknote, Archive, CalendarDays, Shield, PhoneCall, FileText, Sparkles, GitBranch, Bus, Monitor, IdCard } from 'lucide-react';
import Modal, { ModalForm, ModalFooter, Field, FormRow } from './Modal';
import styles from '../CSS/AddPlanModal.module.css';

const FEATURES = [
  { id: 'attendance', label: 'Attendance Module', icon: CheckSquare },
  { id: 'fees', label: 'Fee Management', icon: Banknote },
  { id: 'material', label: 'Material Management', icon: Archive },
  { id: 'timetable', label: 'Timetable Builder', icon: CalendarDays },
  { id: 'badge', label: 'Badge Color', icon: Shield },
  { id: 'sms', label: 'SMS Notification', icon: PhoneCall },
  { id: 'reports', label: 'Custom Reports', icon: FileText },
  { id: 'ai-grades', label: 'AI Grade Predictions', icon: Sparkles },
  { id: 'multi-branch', label: 'Multi Branch Support', icon: GitBranch },
  { id: 'transport', label: 'Transport Tracking', icon: Bus },
  { id: 'exams', label: 'Exam & Results Portal', icon: Monitor },
  { id: 'hr', label: 'HR & Payroll', icon: IdCard },
];

const EMPTY = { name: '', price: '', maxUsers: '', description: '' };

function validate(v, features) {
  const e = {};
  if (!v.name.trim()) e.name = 'Enter a plan name';

  if (v.price === '') e.price = 'Enter the annual price';
  else if (!(Number(v.price) > 0)) e.price = 'Price must be more than 0';

  if (v.maxUsers !== '' && !(Number.isInteger(Number(v.maxUsers)) && Number(v.maxUsers) >= 1)) {
    e.maxUsers = 'Enter a whole number, 1 or more';
  }
  if (features.length === 0) e.features = 'Select at least one feature';
  return e;
}

function PlanForm({ onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY);
  const [features, setFeatures] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => (er[name] ? { ...er, [name]: undefined } : er));
  };

  const toggleFeature = (id) => {
    setFeatures((list) => (list.includes(id) ? list.filter((f) => f !== id) : [...list, id]));
    setErrors((er) => (er.features ? { ...er, features: undefined } : er));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values, features);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey === 'features') {
      e.currentTarget.querySelector('[data-feature]')?.focus();
      return;
    }
    if (firstKey) {
      e.currentTarget.elements[firstKey]?.focus();
      return;
    }
    onSubmit?.({
      name: values.name.trim(),
      price: Number(values.price),
      maxUsers: values.maxUsers === '' ? null : Number(values.maxUsers), // null = no limit
      description: values.description.trim(),
      features,
    });
    onClose();
  };

  const bind = (name) => ({ name, value: values[name], onChange: handleChange, error: errors[name] });

  return (
    <ModalForm onSubmit={handleSubmit}>
      <Field label="Plan Name" required placeholder="Enter a plan name" autoComplete="off" {...bind('name')} />

      <FormRow>
        <Field label="Annual Price" required type="number" inputMode="numeric" min="0" placeholder="e.g., 20,000" {...bind('price')} />
        <Field label="Max Users" type="number" inputMode="numeric" min="1" placeholder="Set a user limit" {...bind('maxUsers')} />
      </FormRow>

      <Field label="Description" as="textarea" placeholder="Describe what this plan includes" {...bind('description')} />

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Included Features<span aria-hidden="true">*</span></legend>
        <div className={styles.grid}>
          {FEATURES.map(({ id, label, icon: Icon }) => {
            const on = features.includes(id);
            return (
              <button
                key={id}
                type="button"
                data-feature
                aria-pressed={on}
                className={`${styles.feature} ${on ? styles.on : ''}`}
                onClick={() => toggleFeature(id)}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        {errors.features && <p className={styles.error} role="alert">{errors.features}</p>}
      </fieldset>

      <ModalFooter onCancel={onClose} submitLabel="Add Plan" />
    </ModalForm>
  );
}

// open / onClose: controlled by the page. onSubmit(plan): called with the validated values.
export default function AddPlanModal({ open, onClose, onSubmit }) {
  return (
    <Modal open={open} title="Add new plan" onClose={onClose} dismissOnOverlay={false}>
      <PlanForm onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  );
}