import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import type { RoutePath } from '../routes';

export function ActionLink({ to, children, variant = 'primary', className = '' }: {
  to: RoutePath; children: ReactNode; variant?: 'primary' | 'secondary' | 'text'; className?: string;
}) {
  return <a href={`#${to}`} className={`action action-${variant} ${className}`}>{children}</a>;
}

export function Field({ label, hint, error, id: explicitId, ...input }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  const generatedId = useId();
  const id = explicitId ?? generatedId;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`, input['aria-describedby']].filter(Boolean).join(' ') || undefined;
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    <input {...input} id={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} />
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
        <span>{option}</span>
      </label>)}
    </div>
    {describe && <p className="small">Selected: {value}</p>}
    {error && <p id={`${name}-error`} className="small field-error">{error}</p>}
  </fieldset>;
}

export function Note({ title, children, tone = 'neutral' }: {
  title: string; children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'error';
}) {
  return <div className={`note note-${tone}`}><p className="label">{title}</p><p className="small muted">{children}</p></div>;
}

export function PageHeading({ title, children }: { title: string; children?: ReactNode }) {
  return <><h1>{title}</h1>{children && <p className="muted">{children}</p>}</>;
}

export function BackToRooms() {
  return <ActionLink to="/rooms" variant="text" className="short-action">Back to rooms</ActionLink>;
}
