import { isEmail, type Credentials, type FieldErrors, type Registration } from './contracts';

export function validateCredentials(input: Credentials): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.email.trim()) errors.email = 'Enter your email address.';
  else if (!isEmail(input.email)) {
    errors.email = 'Enter a valid email address (up to 254 characters).';
  }
  if (!input.password) errors.password = 'Enter your password.';
  else if ([...input.password].length < 12 || [...input.password].length > 128) {
    errors.password = 'Use 12–128 characters.';
  }
  return errors;
}

export function validateRegistration(input: Registration): FieldErrors {
  const errors = validateCredentials(input);
  if (input.display_name && [...input.display_name].length > 80) {
    errors.display_name = 'Use no more than 80 characters for your display name.';
  }
  return errors;
}
