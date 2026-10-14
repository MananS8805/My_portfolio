# Manan Sheth — portfolio

A static site (HTML + CSS + vanilla JS, no build step). The design takes its cues from matthieugivelet.com: a white grotesk layout, `[ bracketed ]` labels, a percentage loader, line-by-line reveals and borders that draw in as you scroll.

```
index.html
assets/
  css/style.css      styles, type scale, animations, dark theme
  js/data.js         ALL content: projects, skills, recognition, blog fallback
  js/main.js         loader, reveals, cursor, previews, overlay, $MANAN, terminal
  img/               project screenshots (from your GitHub repos)
  files/Manan_Sheth_Resume.pdf
```

## Run locally

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Deploy

Live at **https://manansheth.vercel.app** (Vercel project `manansheth`).

Every push to `main` deploys to production automatically. Pushes to other branches get a preview URL. There is no build step: Vercel serves this folder as-is.

To deploy by hand without pushing:

```bash
npx vercel@latest deploy --prod
```

## Editing content

Everything lives in `assets/js/data.js`:

- **Projects:** add an object to `PROJECTS`. Set `featured: true` to show it under "Selected works". `cover.type` can be `phone`, `window`, `wall` or `type`.
- **Résumé:** replace `assets/files/Manan_Sheth_Resume.pdf` and keep the same filename.
- **Blog:** loads live from `mananshethblogs.wordpress.com`, so new posts appear on their own. `POSTS_FALLBACK` is only shown if WordPress can't be reached.

## Turning on the APK / installer downloads

Projects with a `release` entry (NiveshRL, Sporty, WallLearn, F1 Predictor) ask GitHub for their **latest release** when they're opened. Until a release exists, the button reads "release coming soon". To switch one on:

1. Build the file:
   - WallLearn (`VocabLearn` repo): `./gradlew assembleRelease` gives you `app/build/outputs/apk/release/*.apk`
   - NiveshRL: build with PyInstaller, then compile `packaging/installer.iss` with Inno Setup to get a `*.exe`
   - Sporty: `cd android && ./gradlew assembleRelease` gives you `app/build/outputs/apk/release/*.apk`
   - F1 Predictor: `flutter build apk --release`
2. On GitHub, go to the repo → **Releases** → **Draft a new release**. Tag it (e.g. `v1.0.0`), attach the `.apk` / `.exe`, and publish.

That's it. The site finds the first asset ending in `.apk` or `.exe` and shows "↓ Android APK · v1.0.0 · 12.4 MB".

## The surprises

- **$MANAN:** a live "stock" in the header and inside the hero's name. It drifts upward as visitors explore. Opening sections, projects, the résumé or email triggers "market news" toasts. Clicking the chart buys.
- **Terminal:** press `/` (or click the ticker). Try `help`, `ls`, `open niveshrl`, `quote`, `buy 100`, `resume`, `sudo hire-manan`.
- **Lights off:** a dark theme with a circular reveal, in the footer under [ Secrets ].

## Fonts

The inspiration site uses GT Standard, which is a paid font. This site uses **Geist** and **Geist Mono** from Google Fonts, which are free and very close in feel. If you buy a GT Standard licence, add an `@font-face` rule and change `--font` in `style.css`.
