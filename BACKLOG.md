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

## 2. Stats built on session length

> Now that minutes are recorded, do something with them.

**Status:** not started. Manual minute entry shipped — entries are
`{"2026-08-04": {"rating": "good", "minutes": 20}}`, with `minutes`
optional — so the data is accumulating and these are all additive.

**Candidates:** total minutes this week or month as a dashboard stat, average
session length, longest sit. The dashboard only has room for three tiles, so
adding one means deciding what it replaces.

**Bigger question:** should the weekly goal be expressible in *minutes* per
week rather than sessions per week? That's a real fork — it changes the goal
sheet, the "3/5" tile, and what "met" means. Worth waiting until there's a
few months of duration data to see whether sessions or minutes is the
motivating number.

---

## 3. Built-in timer / stopwatch

> Start a timer when you sit; it logs the duration automatically when you
> finish.

**Status:** not started, and no longer blocked — the `minutes` field and the
manual entry it falls back to are both shipped. The timer becomes the
automatic way to fill that field in, and stays optional: sessions done away
from the phone are still logged by hand.

**Sketch:** a start button on the main screen. Either count up (open-ended)
or count down from a target (10/15/20 min) — worth supporting both, since
people sit both ways. On finish, the rating sheet opens with the duration
already filled in, so a logged session is one tap instead of two decisions.
The breathing dot in the header is the obvious visual for a running timer.

**Technical notes, mostly about the timer surviving real phone use:**

- **Never count intervals.** Background tabs throttle `setInterval` badly and
  locked phones stop it altogether. Store the start timestamp and derive
  elapsed time from `Date.now()` on each tick, so the display is correct
  after the screen has been off for twenty minutes.
- **Persist the start timestamp** to `localStorage`. Closing the app mid-sit
  (or iOS evicting it from memory) should not lose the session — on next
  open, a running timer resumes with the correct elapsed time.
- **Keep the screen awake** while the timer runs via the Wake Lock API
  (Chrome, and Safari 16.4+), releasing it on finish. Optional, but a screen
  that dims mid-sit is annoying.
- **A chime at the end is harder than it looks.** iOS only allows audio after
  a user gesture, and a backgrounded PWA can't reliably make noise. A
  countdown that ends while the phone is locked probably needs a local
  notification, which ties back to the push work in item 1.

**Open question:** should a completed timer log the session automatically, or
still ask for the rating first? Leaning toward always asking — the rating is
the point of the app — but with the duration pre-filled.

---

## 4. Cloud sync and accounts

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
