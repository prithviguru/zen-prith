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

## 3. Cloud sync and accounts

> So history survives deleting the app or switching phones.

**Status:** not started. Design decisions already made with this in mind are
documented in the README's roadmap section — data model, storage seam,
offline-first behaviour, and the migration path for existing local data.

---

## 4. Auto-log sessions from Headspace or Calm

> If a session is done in another app, it should appear here without being
> typed in twice.

**Status:** not started, and the least certain item here — worth a spike
before any of it is promised.

**The obstacle:** neither Headspace nor Calm publishes an API for reading a
user's own session history. What they do both write to is the phone's health
store — Apple Health's *Mindful Minutes* on iOS, Health Connect on Android —
so the health store, not the meditation app, is the realistic integration
point. (Both claims need verifying against current behaviour before building;
this is the kind of thing that changes quietly with app updates.)

**Why that's still hard here:** a PWA can't read Apple Health. HealthKit is
native-only, so the paths are all indirect:

- **Apple Shortcuts** — a shortcut can read Mindful Minutes and POST them to a
  backend, and can be set to run on a schedule or automation. No native app
  needed, but it needs the backend from item 1 and each person has to install
  the shortcut once.
- **A native wrapper** (Capacitor or similar) — real HealthKit access, at the
  cost of app store distribution and giving up the "just share a link" model
  that makes this app easy to hand to family.
- **Manual export/import** — dull, but genuinely free.

**Worth deciding first:** whether sessions logged elsewhere should carry a
rating at all. The health store knows duration, not how the sit felt, so
imported days would arrive unrated — which the app now supports, and is
probably the right answer.

---

## Parking lot

Smaller things mentioned in passing, not yet thought through:

- Yearly heatmap view of all sessions.
- Export/import the log as a JSON file — a cheap backup that needs no
  backend, and a useful stopgap before item 3 exists.
