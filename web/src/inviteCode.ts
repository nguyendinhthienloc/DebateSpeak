/** Returns an 8-character invite code in canonical form, or undefined when the input is not one. */
export function normalizeInviteCode(value: string): string | undefined {
  const code = value.replace(/[\s-]/g, '').toUpperCase();
  return /^[A-Z0-9]{8}$/.test(code) ? code : undefined;
}
