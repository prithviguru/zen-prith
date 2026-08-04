# Zen — Meditation Tracker

A minimal, design-forward habit tracker for a daily meditation practice.
One breath at a time.

## Features

- **Calendar view** — tap any past day or today to mark whether you meditated;
  tap again to unmark. Future days are locked.
- **Streak tracking** — your current consecutive-day streak (it survives until
  the end of today, so a missed morning doesn't break it prematurely).
- **Monthly & all-time counts** at a glance.
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
