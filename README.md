# Zen — Meditation Tracker

A minimal, design-forward habit tracker for a daily meditation practice.
One breath at a time.

## Features

- **Calendar view** — tap any past day or today to log a meditation. Future
  days are locked.
- **Nothing is required but the day itself.** Save with no rating and no
  length to simply mark that you sat; that session shows as an outline dot.
- **Several sessions a day.** A day holds a list of sessions. Tapping a logged
  day shows what's already recorded — time, rating, length — and offers another;
  tapping a row edits or removes just that session. The calendar carries one dot
  per session, up to three, with a small tick when there are more.
- **Session ratings** — a session can be rated Good, Okay, or Not great, shown
  as a small green, amber, or terracotta dot; an unrated session is an outline.
  Every logged day keeps the same quiet ring, so the calendar stays calm.
- **Session length** — optionally record how long you sat, from the same
  sheet as the rating. Sessions logged without a length stay valid.
- **Times are recorded.** A session started from the timer keeps the time it
  began; one added by hand keeps the time it was entered.
- **Built-in timer** — "Begin session" runs a countdown (5–30 min) or an
  open-ended sit, keeps the screen awake, chimes when a countdown ends, and
  opens the rating sheet with the length already filled in. Elapsed time is
  derived from the clock and the start is saved, so locking the phone or
  closing the app mid-sit doesn't lose the session.
- **Weekly goal** — *days* this week against your goal (e.g. 3/5), so two
  sessions on Monday don't buy Tuesday off; the tile
  glows when the goal is met. Tap it to set the goal (1–7 sessions per week).
- **Every past week, in the calendar** — a `WK` column shows each row as
  `3/4` against your goal, since a month grid's rows are already
  Sunday–Saturday weeks. Weeks that hit the goal show in sage. Counts follow
  the true week, including days in a neighbouring month, and each week is
  measured against the goal that was set *at the time* — changing your goal
  today doesn't rewrite last month's results.
- **The stats follow the month you're viewing.** On the current month the
  first tile reads *This week*; navigate away and it becomes *Weeks met* for
  that month, since "this week" means nothing in a month you're not in.
- **Onboarding** — a new install opens on a short, five-screen welcome: your
  name, how many days a week you're aiming for, and a walkthrough of what can
  be logged, drawn with the calendar's own dots so it can't drift from the
  real thing. Skippable, and nothing is saved until the last screen, so an
  abandoned run leaves nothing behind. Anyone already using Zen never sees it.
- **Personal greeting** — a time-aware "Good morning, <name>" header. The name
  is asked for during onboarding; tap the greeting to change it later.
- **Monthly counts** at a glance — days meditated, and Good-rated *sessions*,
  for the month being viewed.
- **Local & private** — everything is stored in your browser's `localStorage`.
  No accounts, no servers, no tracking.

## Running it

It's a single static file with zero dependencies and no build step:

```sh
open index.html          # macOS
xdg-open index.html      # Linux
```

or serve it if you prefer:

```sh
python3 -m http.server
# → http://localhost:8000
```

## Roadmap: cloud sync & accounts

Today all data is device-local (`localStorage`), which is deliberate for v1.
The planned evolution is user log-ins with cloud-stored data, so a reinstall
or new device restores your history. Design decisions already made with that
in mind:

- **Data model**: a map of ISO date string to that day's sessions
  (`{"2026-08-04": {sessions: [{rating, minutes, at}]}}`). A session is the
  row: this maps 1:1 to a backend table of `(user_id, date, rating, minutes,
  at)` rows — no migration gymnastics needed.
- **Storage seam**: all persistence goes through the `load()`/`save()`
  helpers in `index.html`. Cloud sync means swapping those internals for a
  backend adapter (likely Supabase: hosted auth + Postgres, generous free
  tier), not restructuring the app.
- **Offline-first stays**: `localStorage` remains as the local cache; the
  backend becomes the source of truth, synced when online. The service
  worker already handles offline shell loading.
- **Migration path**: on a user's first sign-in, upload the local day set,
  then merge server-side. Existing users lose nothing.

