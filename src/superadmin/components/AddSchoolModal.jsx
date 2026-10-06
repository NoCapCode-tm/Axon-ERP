import { useState } from 'react';
import Modal, { ModalForm, ModalFooter, Field, FormRow, isEmail } from './Modal';

const PLANS = ['Basic', 'Pro', 'Elite', 'Advanced', 'Enterprise'];
const EMPTY = { name: '', email: '', phone: '', address: '', adminName: '', adminEmail: '', plan: '', password: '' };

// Keys are added in the same order as the fields on screen, so the first error is the top-most one.
function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Enter the school name';

  if (!v.email.trim()) e.email = "Enter the school's email address";
  else if (!isEmail(v.email.trim())) e.email = 'Enter a valid email address';

  const digits = v.phone.replace(/\D/g, '');
  if (!v.phone.trim()) e.phone = "Enter the school's phone number";
  else if (digits.length < 10 || digits.length > 13) e.phone = 'Enter a valid phone number';

  if (!v.address.trim()) e.address = "Enter the school's address";
  if (!v.adminName.trim()) e.adminName = "Enter the admin's name";

  if (!v.adminEmail.trim()) e.adminEmail = "Enter the admin's email";
  else if (!isEmail(v.adminEmail.trim())) e.adminEmail = 'Enter a valid email address';

  if (!v.plan) e.plan = 'Select a plan';
  if (v.password.length < 8) e.password = 'Use at least 8 characters';
  return e;
}

// The form lives in its own component. Modal unmounts it when closed, so it always opens empty.
function SchoolForm({ onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => (er[name] ? { ...er, [name]: undefined } : er));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      e.currentTarget.elements[firstKey]?.focus();
      return;
    }
    onSubmit?.({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
      adminName: values.adminName.trim(),
      adminEmail: values.adminEmail.trim(),
    });
    onClose();
  };

  const bind = (name) => ({ name, value: values[name], onChange: handleChange, error: errors[name] });

  return (
    <ModalForm onSubmit={handleSubmit}>
      <Field label="School Name" required placeholder="Enter School Name" autoComplete="off" {...bind('name')} />
      <Field label="Email" required type="email" placeholder="Enter school's email address" {...bind('email')} />
      <Field label="Phone" required type="tel" placeholder="Enter school's phone number" {...bind('phone')} />
      <Field label="Address" required placeholder="Enter school's address" autoComplete="off" {...bind('address')} />

      <FormRow>
        <Field label="Admin Name" required placeholder="Enter name" autoComplete="off" {...bind('adminName')} />
        <Field label="Admin Email" required type="email" placeholder="Enter email" autoComplete="off" {...bind('adminEmail')} />
      </FormRow>

      <FormRow>
        <Field label="Plan Selection" required as="select" options={PLANS} placeholder="Select a plan" {...bind('plan')} />
        <Field label="Password (min. 8)" required type="password" placeholder="Enter password" autoComplete="new-password" {...bind('password')} />
      </FormRow>

      <ModalFooter onCancel={onClose} submitLabel="Add School" />
    </ModalForm>
  );
}

// open / onClose: controlled by the page. onSubmit(school): called with the validated values.
export default function AddSchoolModal({ open, onClose, onSubmit }) {
  return (
    <Modal open={open} title="Add school" onClose={onClose} dismissOnOverlay={false}>
      <SchoolForm onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  );
}