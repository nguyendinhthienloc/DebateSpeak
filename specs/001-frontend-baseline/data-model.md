# Frontend data

| Data | Contents | Lifetime |
| --- | --- | --- |
| User | ID, email, display name, CEFR, creation time | Returned by register/login |
| Session | Access token, user, expiry | Memory; cleared on reload/expiry |
| Recovery form | Email, code, new password where needed | Component memory; code/password clear on success or navigation |
| Room settings | Format, duration, assignment, stance | Memory; reset on reload |

Field limits and response shapes are in [the auth contract](../../web/API_CONTRACT.md).
Room duration is 1–30 minutes (default 10); partner stance is opposite to the
selected stance. Room/lobby/profile sample content has no database relationship
in this frontend. No database schema or migration is added by this baseline.
