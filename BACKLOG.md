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

## 6. Live on the desktop rather than in a window

> A small always-visible calendar sitting on the desktop, like a widget,
> instead of an app window you open.

**Status:** not started, and not possible as a web app — this is the one
request so far that the PWA approach can't reach at all.

**Why:** desktop widgets are a native surface. macOS widgets are WidgetKit
extensions shipped inside a signed native app; Windows widgets likewise come
from a packaged app. A web page cannot render into either. Web apps also
can't ask to be always-on-top, borderless, or pinned behind other windows —
those are window-manager powers no browser exposes.

**The paths, honestly:**

- **A native wrapper** (Tauri or Electron) loading the same `index.html`.
  Gets a real always-on-top, transparent, borderless window. Costs the thing
  that has made this project pleasant: no build step, no signing, no
  installer, and "just open the link" for family. Tauri is the lighter of the
  two.
- **A genuine macOS widget** in Swift. The best result and the most work —
  and it hits a wall the wrapper doesn't: **a native widget cannot read the
  app's data.** Everything lives in browser `localStorage`, which is private
  to the browser. A widget would need the data somewhere it can reach, which
  means cloud sync (item 3) or an exported file, first.
- **Live with a window.** Installed as a desktop app it already runs in its
  own frameless-ish window; a third-party utility can pin it always-on-top.
  Zero engineering, most of the benefit.

**Worth noting:** the meeting-gap nudge is the part of "desktop app" that
actually changes behaviour, and it does *not* need any of this — a
notification from an open window is enough. It is already built and parked in
PR #19, waiting on a Google OAuth client ID; worth landing that before
spending a native wrapper on ambience.

---

## 7. Today is hard to pick out in the calendar

> Looking at the grid, you can't tell which day is today.

**Status:** not started. Reported from real use — a visual fix, not a
behaviour change.

**Why it's weak right now:** today's only marker is `.day.today { color:
var(--accent) }` — sage `#a3b18a` instead of the usual `#e8e4dc`. Those two
are close in *lightness*; they differ mainly in hue, which is the weakest
signal at 14px on a dark background, and the first thing to go under sunlight
or for anyone slightly colour-blind. It also has real competition: a logged
day already draws a ring and goes semibold, and now carries up to three
coloured dots, all of which shout louder than a slightly greener numeral. The
day most likely to be logged is today, so today is exactly where the marker
gets drowned out.

**Constraint that shaped the current design:** today used to be marked with a
dot, and that slot now belongs to the ratings — so whatever replaces it has
to work *alongside* a ring and up to three dots, not compete for the same
space.

**Options worth mocking up:**

- **A filled disc behind the number** — sage wash (`--accent-soft`) as the
  day's background. Reads instantly, survives the ring and dots, and is the
  most conventional calendar idiom. Risk: it's the heaviest option on a page
  whose whole character is restraint.
- **A ring in accent colour** — reuse the logged ring, in sage rather than
  bone. Cheap, but collides directly with the "logged" ring, and a logged
  today would have to say two things with one shape.
- **A small label under the number** — a "today" tick or caret below the day.
  Clear and calm, but the space under the number is where the dots live.
- **Weight and brightness rather than hue** — keep today bone-white while
  dimming every other day slightly. Fits the aesthetic best and needs no new
  element; needs testing to check it doesn't just make the calendar look
  greyed out.

**Worth checking while in there:** the same question applies to the `WK`
column — the current week isn't distinguished from past ones either.

---

## Parking lot

Smaller things mentioned in passing, not yet thought through:

- Yearly heatmap view of all sessions.
- Export/import the log as a JSON file — a cheap backup that needs no
  backend, and a useful stopgap before item 3 exists.
