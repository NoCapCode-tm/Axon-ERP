import { useState } from 'react';
import Modal, { ModalForm, ModalFooter, Field, FormRow } from './Modal';

// TODO: replace with the real category list from your backend
const CATEGORIES = ['Technical issue', 'Billing & fees', 'Account & access', 'Feature request', 'Other'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const ASSIGNEES = ['Priya M', 'Arjun K', 'Neha S'];

const EMPTY = { schoolName: '', schoolId: '', subject: '', category: '', priority: '', assignee: '', description: '' };

// key order = on-screen order, so focus goes to the first invalid field from the top
const REQUIRED = {
  schoolName: 'Enter the school name',
  schoolId: 'Enter the school ID',
  subject: 'Enter a subject',
  category: 'Select a category',
  priority: 'Select a priority',
  assignee: 'Select an assignee',
  description: 'Describe the issue',
};

function validate(v) {
  const e = {};
  for (const [key, message] of Object.entries(REQUIRED)) {
    if (!String(v[key]).trim()) e[key] = message;
  }
  return e;
}

function TicketForm({ onClose, onSubmit, assignees }) {
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
      schoolName: values.schoolName.trim(),
      schoolId: values.schoolId.trim(),
      subject: values.subject.trim(),
      category: values.category,
      priority: values.priority,
      assignee: values.assignee,
      description: values.description.trim(),
    });
    onClose();
  };

  const bind = (name) => ({ name, value: values[name], onChange: handleChange, error: errors[name] });

  return (
    <ModalForm onSubmit={handleSubmit}>
      <FormRow>
        <Field label="School name" required autoComplete="off" {...bind('schoolName')} />
        <Field label="School ID" required autoComplete="off" {...bind('schoolId')} />
      </FormRow>

      <FormRow>
        <Field label="Subject" required autoComplete="off" {...bind('subject')} />
        <Field label="Category" required as="select" options={CATEGORIES} placeholder="Select a category" {...bind('category')} />
      </FormRow>

      <FormRow>
        <Field label="Priority" required as="select" options={PRIORITIES} placeholder="Select a priority" {...bind('priority')} />
        <Field label="Preferred assignee" required as="select" options={assignees} placeholder="Select an assignee" {...bind('assignee')} />
      </FormRow>

      <Field label="Describe the issue" required as="textarea" rows={3} {...bind('description')} />

      <ModalFooter onCancel={onClose} submitLabel="Create Ticket" />
    </ModalForm>
  );
}

// open / onClose: controlled by the page. onSubmit(ticket): called with the validated values.
export default function NewTicketModal({ open, onClose, onSubmit, assignees = ASSIGNEES }) {
  return (
    <Modal open={open} title="Raise a new ticket" onClose={onClose} dismissOnOverlay={false}>
      <TicketForm onClose={onClose} onSubmit={onSubmit} assignees={assignees} />
    </Modal>
  );
}