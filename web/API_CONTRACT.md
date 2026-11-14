# Auth API contract

This is the backend handoff for the existing account screens. The frontend is
connected to the endpoints below, but the backend currently only has `/health`.

## Connect

Set `VITE_API_BASE_URL` in the root `.env` and restart Vite:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

The default is `/api/v1` on the frontend origin. All endpoints below use **POST**
with JSON. Requests include cookies and `X-DebateSpeak-Client: web`.
For separate origins, allow the frontend's exact origin, credentials, POST,
`Content-Type` and `X-DebateSpeak-Client` in CORS; do not use a wildcard origin.

## Endpoints

Paths are relative to the API prefix. All request fields are strings and required
unless marked optional. Return the exact HTTP status and response shape shown.

| Action | Endpoint | Request fields | Success |
| --- | --- | --- | --- |
| Register | `/auth/register` | `email`, `password`, `cefr_level`, optional `display_name` | **201** with the user object below |
| Sign in | `/auth/login` | `email`, `password` | **200** with the full response below |
| Request password reset | `/auth/forgot-password` | `email` | **202** `{"status":"accepted"}` |
| Send verification code | `/auth/resend-verification` | `email` | **202** `{"status":"accepted"}` |
| Verify email | `/auth/verify-email` | `email`, `code` | **200** `{"status":"verified"}` |
| Reset password | `/auth/reset-password` | `email`, `code`, `password` (new password) | **200** `{"status":"reset"}` |

Example reset request:

```json
{"email":"learner@example.com","code":"123456","password":"new example password"}
```

Login response example. For registration, return only the object inside `user`:

```json
{
  "access_token": "example-token",
  "token_type": "bearer",
  "expires_in": 900,
  "user": {
    "id": "d817b684-08e9-49c0-806a-a045fb7f060c",
    "email": "learner@example.com",
    "display_name": "Learner",
    "cefr_level": "B1",
    "created_at": "2026-11-14T08:00:00Z"
  }
}
```

## Field rules

- **Email:** valid address, up to 254 characters.
- **Password:** 12–128 Unicode characters. Preserve spaces exactly as entered.
- **Display name:** nonblank, up to 80 Unicode characters; default to `Learner` when omitted.
- **Level:** `A2`, `B1`, `B2` or `C1`. The frontend defaults to `B1`.
- **Code:** 6–128 characters. The backend controls expiry and single use.
- **User:** UUID `id`; UTC `created_at` ending in `Z` or `+00:00`.
- **Token:** nonempty, no whitespace; `expires_in` is a number of seconds,
  greater than 0 and at most 2,147,483.

## Errors

| HTTP status | Meaning |
| --- | --- |
| 401 | Wrong sign-in details |
| 409 | Email already registered |
| 400 / 401 / 410 | Invalid or expired verification/reset code |
| 422 | Invalid fields |
| 429 | Too many attempts |
| 5xx | Service failure |

Example 422 response (standard FastAPI validation errors also work):

```json
{
  "code": "validation_error",
  "detail": "Invalid input",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

The frontend uses the status and field names to show its own error messages.

## Integration notes

The backend handles password hashing, email delivery, rate limits, expiring
single-use codes and session revocation after reset. Both code-request endpoints
must return the same 202 response for known and unknown emails.

Registration returns to sign-in. Verification/reset do not sign in automatically.
Verification success and Profile offer Change password: request a fresh reset
code at `/auth/forgot-password`, then submit it to `/auth/reset-password`.
Email verification codes are not password-reset credentials. Email is carried
between these screens in memory; code/password fields start empty on navigation.
Reload or expiry clears the frontend session; refresh/logout are not connected.
Agree on the unverified-login flow before enforcing verification: the frontend
has no dedicated redirect for it yet. Rooms, profile and audio remain previews.

Use the [integration checklist](../specs/001-frontend-baseline/quickstart.md)
to check these flows against the real backend.

Investigation note (2026-11-14): this checkout has no registered auth router or
verification/reset handler in `api/app/main.py`. A frontend navigation fix alone
cannot make a real password change succeed against that backend. Verify actual
email delivery, code validation, password hashing/persistence and session
revocation when the endpoints are integrated; do not count mocked tests as proof.
