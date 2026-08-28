# Email assets

Images referenced by the "what's new" emails sent to the people using Zen.
They live here only because GitHub Pages already serves this repository, so
`https://prithviguru.github.io/zen-prith/email/<file>` is a stable public URL
that mail clients can load.

Nothing in the app fetches these. They are deliberately **not** in `SHELL` in
`sw.js`, so they are never precached and adding one needs no `CACHE` bump.

- `confetti.png` — the weekly-goal celebration, captured from the running app
  at 2x and exported at 640px wide to stay crisp when shown at 320px in an
  email. PNG-8, 256 colours, ~52 KB. Kept small because a lot of people read
  mail on cellular.
