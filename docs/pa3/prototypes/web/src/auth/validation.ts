import { isEmail, type Credentials, type FieldErrors, type ProfileUpdate, type Registration } from './contracts';

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

export function validateProfile(input: Required<ProfileUpdate>): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.display_name) errors.display_name = 'Enter a display name.';
  else if ([...input.display_name].length > 80) errors.display_name = 'Use no more than 80 characters for your display name.';
  if (input.native_language && [...input.native_language].length > 64) {
    errors.native_language = 'Use no more than 64 characters.';
  }
  if (input.goals.length > 5 || input.goals.some(goal => [...goal].length > 120)) {
    errors.goals = 'Use up to 5 goals of up to 120 characters each.';
  }
  return errors;
}
