# Auth API: backend handoff

**Status:** the frontend calls these endpoints; the backend currently only has
`/health`. Implement the six POST endpoints below to connect the account screens.

## Connection

Default prefix: `/api/v1`. Override with `VITE_API_BASE_URL` in the root `.env`
and restart Vite. Use JSON. Requests include cookies and
`X-DebateSpeak-Client: web`; allow the frontend origin and these headers in CORS.
Replace the backend’s current wildcard origin before enabling credentials.

## Endpoints

| POST path | Request fields | Exact success |
| --- | --- | --- |
| `/auth/register` | `email`, `password`, `cefr_level`, optional `display_name` | 201, user object below |
| `/auth/login` | `email`, `password` | 200, login object below |
| `/auth/forgot-password` | `email` | 202, `{"status":"accepted"}` |
| `/auth/resend-verification` | `email` | 202, `{"status":"accepted"}` |
| `/auth/verify-email` | `email`, `code` | 200, `{"status":"verified"}` |
| `/auth/reset-password` | `email`, `code`, `password` | 200, `{"status":"reset"}` |

All request values are strings. Example user:

```json
{"id":"d817b684-08e9-49c0-806a-a045fb7f060c","email":"learner@example.com","display_name":"Learner","cefr_level":"B1","created_at":"2026-11-14T08:00:00Z"}
```

Login wraps that user:

```json
{"access_token":"example-token","token_type":"bearer","expires_in":900,"user":{"id":"d817b684-08e9-49c0-806a-a045fb7f060c","email":"learner@example.com","display_name":"Learner","cefr_level":"B1","created_at":"2026-11-14T08:00:00Z"}}
```

## Values and errors

- Email: valid address, up to 254 characters. Password: 12–128 Unicode characters;
  preserve spaces. Display name: nonblank, up to 80 characters; default `Learner`.
- CEFR: `A2`, `B1`, `B2` or `C1` (frontend default `B1`). User ID: UUID.
  Creation time: UTC (`Z` or `+00:00`). Token: nonempty, no whitespace;
  expiry: positive seconds, at most 2,147,483.
- Code: 6–128 characters, entered from email. The backend sets expiry and single use.
- Errors: 401 wrong login; 409 duplicate registration; 400/401/410 invalid or
  expired code; 422 invalid fields; 429 too many attempts; 5xx service failure.
- For field errors, return e.g.
  `{"code":"validation_error","detail":"Invalid input","errors":[{"field":"email","message":"Invalid email"}]}`.
  Standard FastAPI 422 errors also work. The UI uses its own safe error text.

## Before connecting

Use identical 202 responses for known/unknown emails on both code-request
endpoints. Implement password hashing, rate limits, email delivery, expiring
single-use codes and session revocation after reset on the backend.

Registration returns to sign-in. Verification/reset do not sign in automatically.
Login survives only until reload or expiry; refresh/logout are not wired yet.
Verification-required login has no dedicated frontend redirect yet: agree that
flow before enforcing it. Rooms/profile/audio remain previews, with no API calls.
