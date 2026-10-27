# Sprint 1 (PA1) Lessons, input to the Project Plan (SCRUM-20)

Supplied by Lộc for Tuấn. Everything below comes from the repository history and PR list; add anything the team remembers that Git does not show.

## What went well

- The monorepo scaffold and GitHub Actions CI (T1.1) and the local Docker Compose stack (T1.2) were in place before any feature code, so Sprint 2 starts with working infrastructure.
- Spec Kit and the constitution were set up early (PR #4), so the spec-before-code rule has tooling behind it.

## What went wrong

1. **Inconsistent PR targets.** PR #4 (Spec Kit) targeted `main`, while PR #3 (PA1) and PR #5 (scaffolding and CI) targeted `dev`, and PR #2 merged `dev` into `main`. The result is a `main` that was missing the scaffold until `dev` was merged. Sprint 2 fixes this with a rule that every PR targets `pa2`.
2. **CI broke after merge preparation.** Two follow-up fix commits were needed (`79ee853` database URL quoting and dependency locking; `51caeba` LaTeX language package and report output path). Run CI on the branch before requesting review.
3. **Status records drifted from reality.** `SPRINT_TASKS.md` marked tasks Done with no status column for Sprint 2, and a deliverable named for T1.1 (`.github/workflows/ci.yml`) was absent from `main`. Sprint 2 added a Status column.
4. **Ownership errors.** SCRUM-22 (Spec Kit) was recorded as Tuấn's although Lộc did it, found only after a status report. Check the Git author before writing the owner.
5. **Unverified Jira keys.** Commit `99cfedb` had to remove PA1 Jira keys nobody could verify. Only record keys after checking them in Jira.
6. **Load concentration.** Lộc carried DevOps, Spec Kit and release duties in Sprint 1 and 2. The risk belongs in the Project Plan's risk table (SCRUM-20); the Project Plan and the smoke test (SCRUM-29, now Sprint 3) were assigned to Tuấn and Khoa for this reason.

## Actions for Sprint 2

- All feature branches branch from and target `pa2`; only the final `pa2` to `dev` PR is opened by Lộc.
- CI must be green before review is requested.
- Update the Status column and Jira in the same sitting as the work.
- Verify owner and Jira key from Git or Jira before writing them in a document.
