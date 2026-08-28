# Email

A record of the "what's new" emails sent to the people using Zen, and the
images those emails point at.

## Sent

| Date | Subject | Covered | File |
| --- | --- | --- | --- |
| 2026-08-28 | What's new in Zen | The weekly-goal celebration, several sessions a day with timestamps, and the three-screen welcome | [`sent/2026-08-28-whats-new.html`](sent/2026-08-28-whats-new.html) |

Archived as sent, with one deliberate difference: the copy that actually went
out had `confetti.png` inlined as a `data:` URI, because it was sent by
pasting the rendered page into Gmail and Gmail re-hosts pasted images on its
own servers — which is how the picture reaches people whose client blocks
external images. The file here keeps the `https://` reference instead, since a
70 KB base64 blob makes the source unreadable and the two differ by one
attribute.

## Writing another one

Things learned the hard way, worth not relearning:

- **Don't put a link to the app behind a button.** On iOS a home-screen web
  app has its own storage and iOS never hands a link to it, so tapping one
  opens a *separate, empty* copy in Safari — which runs the welcome flow and
  reads as "my sessions are gone". Tell people to open Zen from their home
  screen instead, and keep the link as a footnote for anyone who hasn't
  installed it.
- **Corporate Gmail blocks external images by default**, so a block that
  depends on an image needs alt text and a headline that carry it alone.
- **Preheader text only works when real HTML is sent**, not pasted — pasting
  drops `display:none` content and the client previews the first visible text
  instead.
- **Tables and inline styles**, not modern CSS. Background colours belong on
  the tables, because Gmail strips `<body>`.

## Images

`confetti.png` — the weekly-goal celebration, captured from the running app at
2x and exported at 640px wide so it stays crisp shown at 320px. PNG-8, 256
colours, ~52 KB, kept small because most of this is read on a phone.

Served by GitHub Pages at
`https://prithviguru.github.io/zen-prith/email/confetti.png`. That URL is the
reason these live in the repo at all — mail clients need somewhere real to
fetch from. **Don't move or rename it**; anything already sent points at it.

Nothing in the app fetches any of this. It is deliberately outside `SHELL` in
`sw.js`, so it is never precached and adding a file here needs no `CACHE` bump.
