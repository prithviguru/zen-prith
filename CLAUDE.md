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
  `zen-meditation-log` (date → `{sessions: [{rating, minutes, at}]}`), `zen-weekly-goal`,
  `zen-goal-history` (goal changes, by week), `zen-name`, `zen-onboarded`,
  `zen-timer`, `zen-sound`.
  `zen-meditation-days` is the legacy v1 key, migrated on load.
- **One person per install** — family members share the same URL, so any
  personalization (name, goal) is per-browser and collected by the onboarding
  flow on first run. Never hard-code personal details into the app.
- **Onboarding runs once, on a genuinely new install.** It is gated on
  `zen-onboarded` *and* `zen-name` being unset, so nobody already using Zen is
  ever shown it. It writes nothing until the last step — an abandoned run
  leaves no half-set name or goal and simply asks again.
- **A rounded surface means "you can press this."** Cards and filled shapes
  are reserved for controls and the calendar; plain data sits straight on the
  page, divided by hairlines. When everything wore the same rounded card, a
  screen with three facts and one action read as five things to press.
- **Distinguish by lightness, not hue.** Sage-on-bone reads as barely
  different at small sizes, fails in sunlight, and is invisible to some
  colour-blind viewers — which is exactly how "today" got lost in the
  calendar. Colour still carries the *ratings*, where three distinct hues sit
  side by side in the log sheet, each next to its name.
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
