# Zen — project notes

Zen is a single-file, dependency-free meditation habit tracker (`index.html`),
installable as a PWA and hosted on GitHub Pages at
https://prithviguru.github.io/zen-prith/.

## Conventions

- **No build step, no dependencies.** Everything ships as static files:
  `index.html`, `sw.js`, `manifest.webmanifest`, and the icons.
- **Bump `CACHE` in `sw.js`** on every user-facing change, or installed
  phones keep serving the old version.
- **Storage keys** are all `zen-*` in `localStorage`:
  `zen-meditation-log` (date → `{rating, minutes}`), `zen-weekly-goal`,
  `zen-goal-history` (goal changes, by week), `zen-name`, `zen-timer`,
  `zen-sound`.
  `zen-meditation-days` is the legacy v1 key, migrated on load.
- **One person per install** — family members share the same URL, so any
  personalization (name, goal) is per-browser and prompted on first run.
  Never hard-code personal details into the app.
- **Verify in a real browser** (Playwright + the pre-installed Chromium)
  before shipping, rather than reasoning about the DOM.

## Backlog

Parked feature ideas live in `BACKLOG.md`, with the research behind each one
so it doesn't get redone. Add to it when an idea comes up mid-conversation;
move an item out when it ships.

## Workflow

Develop on `claude/meditation-tracking-app-*`, then open a PR into `main` and
merge it — merging to `main` is what deploys to GitHub Pages. Each merged PR
is finished; start follow-up work from the latest `main`.
