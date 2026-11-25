# Don't Pick On Me

A standalone page that plays the `DontPickOnMe.riv` file with Rive's official JavaScript runtime. Built to be hosted at [interactive.devjoshi.co.uk](https://interactive.devjoshi.co.uk/) and linked from the [Dev Joshi portfolio](https://devjoshi.co.uk/).

The page is headerless: the default `PLAY` artboard is a full-bleed 1080×1080 scene, so a copied Portfolio header would only shrink it. A small "Back to portfolio" link sits in the corner instead.

## Local preview

Serve the repo root over HTTP (the runtime cannot load the `.riv` from a `file://` URL):

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open http://localhost:3000/ (serve) or http://localhost:8080/.

There is no build step and no bundler. `index.html` loads `@rive-app/canvas@2.55.1` from jsDelivr.

## GitHub Pages

1. Push this repository to GitHub (the site files live at the root of `main`).
2. In the repo: **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**, branch **main**, folder **/ (root)**.
4. Save. Pages will pick up the `CNAME` file and serve the site at `interactive.devjoshi.co.uk` once DNS is in place.

The empty `.nojekyll` file tells Pages not to process the site with Jekyll.

## DNS

In the DNS for `devjoshi.co.uk`, add a **CNAME** record:

| Host | Type | Value |
| --- | --- | --- |
| `interactive` | CNAME | `<user>.github.io` |

Replace `<user>` with the GitHub username or organization that owns the repository (for example `devjoshi.github.io`). After DNS propagates, GitHub Pages will issue a TLS certificate for the custom domain automatically.

## What's in the `.riv`

The file's default artboard is **PLAY** (1080×1080). It autoplays **State Machine 1**. Pointer hover and click are handled inside the file through data-binding (no extra JavaScript inputs). A Rive watermark intro plays for about two seconds before the mushroom scene; re-exporting from a paid Rive plan should remove it.
