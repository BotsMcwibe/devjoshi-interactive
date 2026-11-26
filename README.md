# Don't Pick On Me

A standalone page that plays `DontPickOnMe.riv` with Rive's official JavaScript runtime, styled like a project page on [devjoshi.co.uk](https://devjoshi.co.uk/): same header, type, spacing and footer. Plain HTML, CSS and JS with no build step.

Target address: `interactive.devjoshi.co.uk`. Until then it runs from GitHub Pages at https://botsmcwibe.github.io/devjoshi-interactive/.

## Files

```
index.html            header, hero, description, animation row, footer
style.css
main.js               menu, scroll shadow and the Rive canvases
favicon.png           copied from devjoshi.co.uk
assets/DontPickOnMe.riv
assets/fonts/         Jost 400 / 500 / 700 (woff2) and its OFL licence
```

All paths are relative, so the site works from `/` or from a subpath like `/devjoshi-interactive/`.

## Local preview

The `.riv` can't load from `file://`, so serve the folder:

```bash
python3 -m http.server 8080
```

## Page

- **Header**: Work and About on the left, "Dev Joshi" centred, LinkedIn and Instagram on the right (icons copied from the main site). At 932px and below it becomes a hamburger with a full-screen menu. Links point to the real devjoshi.co.uk pages. The "Dev Joshi" wordmark is an inline SVG of the text set in Futura PT Medium (see Fonts). The tab title is `Dev Joshi - Don't Pick On Me`, like the main site's project pages.
- **Hero**: the `PLAY` artboard in a 2:1 band on desktop (the scene is cropped in with CSS and the band uses the artboard's own green `#59E477`, so it is seamless) and square on mobile. The file starts with a short Rive watermark splash from the free-plan export. The band is black while it plays and fades to the artboard green once the scene appears. `main.js` finds that moment by sampling a pixel of the canvas, because the runtime emits no event for it.
- **Description**: two equal columns on desktop like the project pages, with the text on the left and one live Shroomie centred in the right column. On mobile the Shroomie sits under the text.
- **Row of three**: Shromp playing `PUSH 1 (Nudge)`, `PUSH 2 (Bald)` and `PUSH 3 (Cry)` in a loop.

All canvases share a single download of the `.riv`, start when they scroll near the viewport and pause when they leave it.

The small canvases play the linear animations (`Shromp PUSH ...`, `Shroomie IDLE / HOVER / DEATH / REGROW`) rather than each artboard's state machine, because the state machines replay the Rive watermark intro on every canvas. The Shroomie's hover and click are handled in `main.js`, and its colours come from the file's view model (`bodyColor`, `capColour`). The pinned runtime (`@rive-app/canvas@2.55.1`) still supports linear animations; its deprecation warnings are switched off in `main.js`.

## Placeholder content

The title, subtitle, description paragraph and credits line in `index.html` are **placeholder text I invented**. Replace them before launch.

## Fonts

devjoshi.co.uk uses Futura PT through an Adobe Fonts kit. Adobe's terms don't allow downloading and self-hosting those files, and that kit only loads on its own domain (checked: it loads on devjoshi.co.uk and reports inactive on github.io), so the real Futura PT can't be used here as is. Futura PT itself is a paid ParaType font with no free licence.

This repo uses [Jost](https://github.com/indestructible-type/Jost) (SIL Open Font License, files from `@fontsource/jost`, licence in `assets/fonts/Jost-OFL.txt`), a free Futura-style typeface. The site's weights are mapped like this: 700 for the title and credit labels, 500 for the wordmark, 400 for everything else (nav, subtitle and body). `size-adjust` in `style.css` scales each weight so the text widths match the real site to within about 1%.

The one exception is the header wordmark. On the real site it is plain text in Futura PT Medium (weight 500, 27px), and Jost's letters differ visibly at that size (the J, for one). Here it is drawn from the outlines of the Futura PT Medium file supplied by the site owner, as an image of the logo text rather than a font file, which is the kind of use ParaType's desktop licence covers. Check the licence you hold if in doubt.

To use the real Futura PT: make an Adobe Fonts web project with Futura PT, add `interactive.devjoshi.co.uk` and `botsmcwibe.github.io` to its domains, put its stylesheet link in `<head>` before `style.css`, and put the family name Adobe gives you (usually `futura-pt`) first in `font-family` in `style.css`.

## GitHub Pages

Settings → Pages → deploy from branch `main`, folder `/ (root)`.

### Moving to interactive.devjoshi.co.uk

1. Add a file called `CNAME` at the repo root containing exactly `interactive.devjoshi.co.uk`.
2. At your DNS provider add a CNAME record: host `interactive`, value `botsmcwibe.github.io`.
3. In Settings → Pages set the custom domain to `interactive.devjoshi.co.uk` and turn on Enforce HTTPS once the certificate is issued.

The `CNAME` file is left out for now. With it, GitHub redirects the `github.io` address to a domain that has no DNS yet.
