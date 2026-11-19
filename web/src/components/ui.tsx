import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import type { RoutePath } from '../routes';

export function ActionLink({ to, children, variant = 'primary', className = '', current = false }: {
  to: RoutePath; children: ReactNode; variant?: 'primary' | 'secondary' | 'text'; className?: string; current?: boolean;
}) {
  return <a href={`#${to}`} className={`action action-${variant} ${className}`} aria-current={current ? 'page' : undefined}>{children}</a>;
}

export function Field({ label, hint, error, trailingAction, id: explicitId, ...input }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string; trailingAction?: ReactNode }) {
  const generatedId = useId();
  const id = explicitId ?? generatedId;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`, input['aria-describedby']].filter(Boolean).join(' ') || undefined;
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    {trailingAction ? <div className={`field-control${error ? ' field-control-invalid' : ''}`}>
      <input {...input} id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} />
      {trailingAction}
    </div> : <input {...input} id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} />}
    {hint && <p id={`${id}-hint`} className="small muted">{hint}</p>}
    {error && <p id={`${id}-error`} className="small field-error">{error}</p>}
  </div>;
}

export function Choices({ label, options, value, onChange, describe = false, error }: {
  label: string; options: readonly string[]; value: string; onChange: (value: string) => void; describe?: boolean; error?: string;
}) {
  const name = useId();
  return <fieldset className="field" aria-invalid={error ? true : undefined}
    aria-describedby={error ? `${name}-error` : undefined} tabIndex={error ? -1 : undefined}>
    <legend>{label}</legend>
    <div className="choices">
      {options.map(option => <label className="choice" key={option}>
        <input type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} />
        <span>{value === option && <Check className="choice-check" size={16} aria-hidden="true" />}{option}</span>
      </label>)}
    </div>
    {describe && value && <p className="sr-only">Selected: {value}</p>}
    {error && <p id={`${name}-error`} className="small field-error">{error}</p>}
  </fieldset>;
}

export function Note({ title, children, tone = 'neutral' }: {
  title: string; children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'error';
}) {
  return <div className={`note note-${tone}`}><p className="label">{title}</p><p className="small muted">{children}</p></div>;
}

export function PageHeading({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="page-heading"><h1>{title}</h1>{children && <p className="lead">{children}</p>}</div>;
}

export function BackToRooms() {
  return <ActionLink to="/rooms" variant="text" className="short-action">Back to rooms</ActionLink>;
}

/** Step label and progress bar. Moves focus to the label when the step changes and `focus` is true. */
export function StepIndicator({ current, labels, focus = true }: { current: number; labels: readonly string[]; focus?: boolean }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const shown = useRef(current);
  useEffect(() => {
    if (shown.current === current) return;
    shown.current = current;
    if (focus) heading.current?.focus();
  }, [current, focus]);
  return <div className="step-indicator">
    <h2 ref={heading} tabIndex={-1} className="label">Step {current} of {labels.length} · {labels[current - 1]}</h2>
    <div className="step-bar" aria-hidden="true">
      {labels.map((label, index) => <span key={label} className={index < current ? 'done' : undefined} />)}
    </div>
  </div>;
}
