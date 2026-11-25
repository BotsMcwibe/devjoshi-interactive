# Don't Pick On Me

A standalone page that runs `DontPickOnMe.riv` with Rive's official JavaScript runtime and looks like a project page on [devjoshi.co.uk](https://devjoshi.co.uk/): same header, type, spacing and footer. Plain HTML/CSS/JS, no build step, no framework.

Target address: `interactive.devjoshi.co.uk`. For now it is served from GitHub Pages at the `github.io` project URL (see below).

## Files

```
index.html            page: header, hero, mocked-up description, footer
style.css             styles (written from scratch to match the Portfolio, see notes below)
main.js               header/menu behaviour + Rive canvases
favicon.svg
assets/DontPickOnMe.riv
assets/fonts/FuturaPT-Medium.woff2
.nojekyll
```

All paths are relative, so the site works from `/` or from a subpath such as `/devjoshi-interactive/`.

## Local preview

The runtime can't load the `.riv` from `file://`; serve the folder over HTTP:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Page layout

- **Header**: Work / About on the left, "Dev Joshi" wordmark in the centre, LinkedIn / Instagram on the right; hamburger + full-screen menu at ≤932px. Links go to the real `devjoshi.co.uk` URLs.
- **Hero**: the full `PLAY` artboard (1080×1080, square), centred and capped to the viewport height. Hover and click the mushrooms. The file starts with a ~2s Rive watermark intro (a free-plan export); this is part of the `PLAY` artboard.
- **Description** (**PLACEHOLDER TEXT**, see below) with small live Rive canvases between the paragraphs, in the same grid style the site uses for image groups.
- **Footer**: empty, same height as the site's.

### Small canvases (all from the same `.riv`, one shared download)

| Where | Artboard | How it's rendered |
|---|---|---|
| Grid 1, cell 1 | `Shromp` | animation `Shromp PUSH 1 (Nudge)`, looping |
| Grid 1, cell 2 | `Shromp` | animation `Shromp PUSH 2 (Bald)`, looping |
| Grid 1, cell 3 | `Shromp` | animation `Shromp PUSH 3 (Cry)`, looping |
| Grid 2, cells 1–3 | `Shroomie` | animations `Shroomie IDLE` → `HOVER` on mouse-over → `DEATH` then `REGROW` on click; body/cap colours set at runtime through the file's view model (`bodyColor`, `capColour`) |

Notes: other animations in the file that aren't used yet are `Shromp IDLE`, `Shromp HOVER` and `Shromp PUSH 3 (Worm)`. The artboards' own state machines are not used for the small canvases because they replay the watermark intro; the hero uses `PLAY`'s state machine. Canvases start when they scroll near the viewport and pause when they leave it. They use the deprecated-but-supported linear-animation playback of the pinned runtime (`@rive-app/canvas@2.55.1`), with its console warnings suppressed in `main.js`.

## Placeholder content

The title, subtitle, paragraphs and credits in `index.html` are **invented placeholder text** (there is also an HTML comment saying so). Replace them before launch. The `.title`, `.subtitle`, plain `<p>` and `.gap` credits line map to the Portfolio's text styles.

## Font

The Portfolio uses **Futura PT** from an Adobe Fonts (Typekit) web project. That kit is domain-locked: tested in headless Chromium, it loads on `devjoshi.co.uk` and reports `wf-inactive` on `github.io` and other origins, so it can't be used here as is.

This repo ships the supplied **Futura PT Medium** (`assets/fonts/FuturaPT-Medium.woff2`, converted from the TTF) via `@font-face`. Only that one weight was supplied, so it stands in for 300–500 and bold (700) is synthesised by the browser. The Portfolio uses lighter weights (300/400) for body text and nav, so the text here looks slightly heavier than the real site. Add `Futura PT Book/Light/Bold` files (or use the Adobe web project below) for an exact match.
Font fallback stack: `"Futura PT", Futura, "Jost", "Century Gothic", "Avenir Next", "Trebuchet MS", sans-serif`.

> Licence note: Futura PT is a commercial ParaType font (see the EULA in the font download). This repository is public; check the licence allows redistributing the web font file this way, or switch to the Adobe Fonts option below.

**To get the real font through Adobe Fonts instead:** in your Adobe Fonts web project (the one with Futura PT), add `interactive.devjoshi.co.uk` and `botsmcwibe.github.io` to the project's domains, then paste the project's one-line stylesheet into `<head>` in `index.html` (before `style.css`) and remove the `@font-face` block:

```html
<link rel="stylesheet" href="https://use.typekit.net/YOUR_PROJECT_ID.css" />
```

then set the family name Adobe gives you (e.g. `futura-pt`) first in `body { font-family: … }` in `style.css`.

## GitHub Pages

1. Settings → Pages → **Deploy from a branch**, branch **main**, folder **/ (root)**.
2. Test URL: `https://botsmcwibe.github.io/devjoshi-interactive/`.

### Moving to interactive.devjoshi.co.uk later

1. Add a file named `CNAME` at the repo root containing exactly: `interactive.devjoshi.co.uk`
2. DNS for `devjoshi.co.uk`: add a **CNAME** record, host `interactive`, value `botsmcwibe.github.io`.
3. In Settings → Pages set the custom domain to `interactive.devjoshi.co.uk` and tick **Enforce HTTPS** once the certificate is issued.

(The `CNAME` file is deliberately **not** committed yet: with it, GitHub redirects the `github.io` URL to a domain whose DNS isn't set up.)
