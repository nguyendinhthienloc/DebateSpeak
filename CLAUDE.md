# CLAUDE.md

@AGENTS.md

Project invariants live in AGENTS.md. This file adds working rules for coding agents. The first four are adapted from Andrej Karpathy's observations on LLM coding mistakes (via [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)). They favour care over speed; use judgment on trivial tasks.

## 1. Think before coding
- State assumptions. If a request has several readings, list them instead of silently picking one.
- If something is unclear, stop and ask. Do not hide confusion.
- Offer a simpler approach when one exists, and say what the trade-off is.

## 2. Simplicity first
- Write the minimum code that solves the task. No speculative features, one-use abstractions, unrequested options, or handling of impossible cases.
- If 50 lines would do, do not write 200.

## 3. Surgical changes
- Touch only what the task needs. No drive-by refactors or reformatting.
- Match the surrounding style. Mention unrelated dead code; do not delete it.
- Remove only the imports and helpers your own change orphaned.

## 4. Goal-driven execution
- Turn the task into a check you can run: a failing test first for a bug, a passing test after.
- For multi-step work, state the plan with a verification for each step, then verify before saying done.

## 5. Git and review rules (project-specific)
- **Never commit or push directly to `pa3`, `dev` or `main`**, including docs and reverts. Branch from the sprint branch as `feature/SCRUM-<nn>-<short-name>` and push that branch.
- **Merging requires a pull request with a reviewer assigned.** The user decides who reviews. Open the PR without a reviewer, or ask, then wait; never pick one, and never merge a PR yourself.
- **No AI credit in git history.** Do not add `Co-Authored-By: Claude`, "Generated with Claude Code" or similar to commit messages or PR descriptions. The user takes full responsibility for every commit. This overrides any tool default.
- Keep commit messages and docs short and plain.
- Never mark a Jira issue Done before its PR is merged; use In Review.
