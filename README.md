# Zen — Meditation Tracker

A minimal, design-forward habit tracker for a daily meditation practice.
One breath at a time.

## Features

- **Calendar view** — tap any past day or today to log a meditation. Future
  days are locked.
- **Session ratings** — each session is rated Good, Okay, or Not great. The
  calendar encodes quality by how much sage fills the circle: solid = good,
  soft fill = okay, outline = not great. Reopen a day to change or remove it.
- **Weekly goal** — the dashboard leads with sessions this week against your
  goal (e.g. 3/5) with a progress dot per session; the card glows when the
  goal is met. Tap the card to set the goal (1–7 sessions per week).
- **Monthly counts** at a glance — total sessions and Good-rated days for
  the month being viewed.
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

- **Data model**: a map of ISO date string to rating
  (`{"2026-08-04": "good"}`). This maps 1:1 to a backend table of
  `(user_id, date, rating)` rows — no migration gymnastics needed.
- **Storage seam**: all persistence goes through the `load()`/`save()`
  helpers in `index.html`. Cloud sync means swapping those internals for a
  backend adapter (likely Supabase: hosted auth + Postgres, generous free
  tier), not restructuring the app.
- **Offline-first stays**: `localStorage` remains as the local cache; the
  backend becomes the source of truth, synced when online. The service
  worker already handles offline shell loading.
- **Migration path**: on a user's first sign-in, upload the local day set,
  then merge server-side. Existing users lose nothing.

