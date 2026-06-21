# Venkatesan Agency — Website

A fast, modern one-page website for **Venkatesan Agency**, a building-materials supplier in
Nungambakkam, Chennai. Customers browse materials, build an order, and send it straight to the
shop on **WhatsApp** with their delivery address pre-filled — no backend or database required.

- **Store:** Venkatesan Agency
- **Phone / WhatsApp:** +91 90032 12728
- **Address:** E-Block, No-1, Pushpanagar Main Road, Nungambakkam, Chennai-34
- **Live site:** _add your Netlify / GitHub Pages URL here_

> Built as a real, deployable small-business site: responsive (mobile + desktop), accessible,
> fast (static, ~2.3 MB, lazy-loaded images), and zero-cost to host.

## What's inside

```
venkatesan-agency/
├── index.html          # page markup
├── css/styles.css      # all styling (construction-amber theme)
├── js/main.js          # product list + cart + WhatsApp ordering
├── images/             # material photos (optimised)
├── netlify.toml        # hosting config
└── README.md
```

## How ordering works

There is **no server**. When a customer taps *Send Order on WhatsApp*, the site builds a
`https://wa.me/91...` link containing the chosen materials, quantities, name and delivery
address, and opens WhatsApp Chat directly with Venkatesan Agency. The shop receives a clean,
ready-to-read message. This makes the site free to host and impossible to break server-side.

## Run it locally

Any static file server works. For example, with Python:

```bash
cd venkatesan-agency
python -m http.server 4321
# open http://localhost:4321
```

## Deploy (free) — Netlify

**Easiest — drag & drop:**
1. Go to https://app.netlify.com/drop
2. Drag the whole **`venkatesan-agency`** folder onto the page.
3. You get a live URL (e.g. `https://venkatesan-agency.netlify.app`) in ~30 seconds.
4. (Optional) Create a free Netlify account to rename the site or add a custom domain.

**Or with the Netlify CLI:**
```bash
npm i -g netlify-cli
cd venkatesan-agency
netlify deploy --prod
```

## How to change things later

| Want to change | Edit this |
| --- | --- |
| Phone / WhatsApp number | `WHATSAPP_NUMBER` in `js/main.js` **and** the `tel:` links in `index.html` |
| Materials, descriptions, units | the `PRODUCTS` array in `js/main.js` |
| A material's photo | replace the file in `images/` (keep the same filename) |
| Store address / hours | the Contact section + footer in `index.html` |
| Colours / theme | the CSS variables at the top of `css/styles.css` |

> **Tip:** For the most authentic look, replace the photos in `images/` with real pictures of
> your own stock (same filenames). The current photos are free-to-use stock images.

## Image credits

Material photos are sourced from **Wikimedia Commons** and **Openverse** under licences that
permit commercial use. You may keep them, but using your own product photos is recommended.
