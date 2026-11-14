import { useEffect, useRef, useState } from 'react';
import { AuthApiError } from './api';
import type { FieldErrors } from './contracts';

export function useAuthForm() {
  const form = useRef<HTMLFormElement>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState('');

  useEffect(() => () => { activeRequest.current?.abort(); }, []);
  useEffect(() => {
    if (Object.keys(errors).length) form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  function validate(fields: FieldErrors) {
    if (activeRequest.current) return false;
    setErrors(fields);
    setMessage(Object.keys(fields).length ? 'Check the highlighted fields and try again.' : '');
    return Object.keys(fields).length === 0;
  }

  async function run<T>(operation: (signal: AbortSignal) => Promise<T>, onSuccess: (value: T) => void) {
    if (activeRequest.current) return;
    const controller = new AbortController();
    activeRequest.current = controller;
    setPending(true);
    setMessage('');
    setErrors({});
    try {
      const result = await operation(controller.signal);
      if (!controller.signal.aborted) onSuccess(result);
    } catch (error) {
      if (!controller.signal.aborted) {
        const failure = error instanceof AuthApiError ? error : new AuthApiError('Something went wrong. Try again.');
        setErrors(failure.fields);
        setMessage(failure.message);
      }
    } finally {
      if (!controller.signal.aborted) setPending(false);
      if (activeRequest.current === controller) activeRequest.current = null;
    }
  }

  return { form, pending, errors, message, validate, run };
}
