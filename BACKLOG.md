# Zen — backlog

Ideas parked for later, roughly in the order they came up. Nothing here is
committed to a date. When one gets picked up, it moves out of this file and
into a PR; the notes below exist so the thinking doesn't have to be redone.

---

## 1. Daily reminder push notification

> "Did you meditate today?" each morning.

**Status:** researched, not started. Paused deliberately — see the open
question below.

**Why it isn't trivial:** a web app can't schedule its own notification for
tomorrow. The browser API for that (Notification Triggers) never shipped, and
background wake-ups are Chromium-only and unreliable. Real push requires a
server to send a message to Apple's or Google's push service, which then wakes
the service worker. GitHub Pages serves static files only, so this is the
first feature that needs a backend.

**Three pieces to build:**

1. A "Remind me each morning" toggle in the app. Tapping it requests
   notification permission and creates a push subscription, which is sent to
   the backend with the person's preferred time and timezone. The permission
   prompt must be triggered by a real tap — it can't fire on load.
2. Storage for the subscriptions (endpoint, keys, hour, timezone).
3. A scheduled job that runs regularly, finds whose local morning it is, and
   sends the pushes. `sw.js` gains a `push` handler to display the
   notification and a `notificationclick` handler to open the app.

**Hosting options priced out (Aug 2026):**

- **Cloudflare Workers** — free tier covers cron triggers and KV storage, no
  inactivity pause. Simplest if push is all we want.
- **Supabase** — free tier is 500 MB database, 50k monthly active users;
  Pro is $25/mo. Far beyond what a family needs, so effectively free. Free
  projects pause after 7 days of inactivity, but a daily cron job keeps the
  project awake, so this cancels itself out. Better choice if item 3 (cloud
  sync) is happening anyway — one backend instead of two.

**iOS constraints:** web push works only for PWAs installed to the home
screen, on iOS 16.4+. Apple throttles background delivery more than Android,
so a notification can arrive late, and a long-unused app may have its
subscription dropped (the app re-subscribes on next open).

**Nice-to-have once it works:** skip the reminder on days already logged —
the thing a plain phone alarm can't do, and the main argument for building
this over just setting an alarm.

**Open question:** Cloudflare or Supabase? Depends on whether cloud sync lands
in the same stretch of work.

---

## 2. Log session length in minutes

> Record how many minutes you meditated, not just that you did.

**Status:** not started.

**Sketch:** the rating sheet gains a duration alongside good/okay/not great —
probably a few preset chips (10 / 15 / 20 / 30 min) plus a custom option,
since a stepper for arbitrary minutes is slow on a phone. Duration should be
optional so logging a session never becomes a chore; a day with a rating and
no duration must stay valid.

**Data model impact:** entries become objects rather than plain strings —
`{"2026-08-04": {"rating": "good", "minutes": 20}}` instead of
`{"2026-08-04": "good"}`. Needs a migration on load like the v1 → v2 one
already in `load()`, and the cloud-sync table in item 3 gains a nullable
`minutes` column.

**Opens up:** total minutes this week/month as a dashboard stat, average
session length, and a weekly goal expressed in minutes rather than sessions.
Worth deciding at build time whether the weekly goal stays "sessions per
week" or becomes switchable to "minutes per week".

---

## 3. Cloud sync and accounts

> So history survives deleting the app or switching phones.

**Status:** not started. Design decisions already made with this in mind are
documented in the README's roadmap section — data model, storage seam,
offline-first behaviour, and the migration path for existing local data.

---

## Parking lot

Smaller things mentioned in passing, not yet thought through:

- Yearly heatmap view of all sessions.
- Export/import the log as a JSON file — a cheap backup that needs no
  backend, and a useful stopgap before item 3 exists.
