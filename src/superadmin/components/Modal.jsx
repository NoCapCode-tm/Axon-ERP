import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown , X} from "lucide-react";
import styles from "../CSS/Modal.module.css";


//overlay
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Escape closes, Tab stays inside, page scroll is locked, and focus goes back to the button that opened it.
// dismissOnOverlay={false} stops a stray click outside from wiping a half-filled form.
export default function Modal({
  open,
  title,
  onClose,
  dismissOnOverlay = true,
  children,
}) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    (dialog.querySelector("input, select, textarea") ?? dialog).focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") return onCloseRef.current();
      if (e.key !== "Tab") return;
      const items = dialog.querySelectorAll(FOCUSABLE);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(e) =>
        dismissOnOverlay && e.target === e.currentTarget && onClose()
      }
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </header>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function ModalForm({ onSubmit, children }) {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {children}
    </form>
  );
}

export function ModalFooter({ onCancel, submitLabel }) {
  return (
    <div className={styles.footer}>
      <button type="button" className={styles.btn} onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" className={styles.btn}>
        {submitLabel}
      </button>
    </div>
  );
}

//form fields
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Two fields side by side (one column on very small screens)
export function FormRow({ children }) {
  return <div className={styles.row}>{children}</div>;
}

// as: 'input' (default) | 'select' | 'textarea'
export function Field({
  label,
  name,
  as = "input",
  type = "text",
  options = [],
  placeholder,
  required,
  value,
  onChange,
  error,
  ...rest
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const common = {
    id,
    name,
    value,
    onChange,
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    ...rest,
  };
  const cls = `${styles.control} ${error ? styles.invalid : ""}`;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true">*</span>}
      </label>

      {as === "select" ? (
        <div className={styles.selectWrap}>
          <select
            {...common}
            className={`${cls} ${value ? "" : styles.placeholder}`}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ChevronDown
            size={20}
            className={styles.chevron}
            aria-hidden="true"
          />
        </div>
      ) : as === "textarea" ? (
        <textarea
          rows={2}
          placeholder={placeholder}
          className={cls}
          {...common}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={cls}
          {...common}
        />
      )}

      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
