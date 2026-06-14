# Results Summary Component

A responsive results summary card built as a [Frontend Mentor](https://www.frontendmentor.io) challenge. The card shows a test score, a percentile comparison, and a color-coded breakdown of four category scores (Reaction, Memory, Verbal, Visual).

![Preview](./preview.jpg)

**Features**
- Responsive: single column on mobile (≤599px), two columns on desktop (≥600px)
- All interactive elements have hover and focus states
- Summary data is loaded dynamically from `data.json` — no hardcoded content

## Links

- **Live Site:** _Add once deployed_
- **Repository:** _Add once on GitHub_

## Built With

- **HTML5** — semantic structure (`<main>`, `<article>`, `<section>`, `<template>`)
- **Native CSS** — no preprocessor, no framework
  - Three `@layer` cascade (`reset → base → components`) for predictable style priority
  - **OKLCH** color space with **relative color syntax** for perceptually uniform tints
  - **CSS Grid** for the mobile-first to two-column responsive transition
  - **`:focus-visible`** for keyboard-only focus rings
- **Vanilla JavaScript** — no bundler, no framework
  - `<template>` + `cloneNode(true)` for the 4 summary rows
  - `fetch('./data.json')` for dynamic data
  - Per-row CSS custom property (`--cat-color`) set by JS, consumed by CSS via relative color syntax
- **Hanken Grotesk** variable font via local `@font-face` (no external font request)

## What I Learned

### CSS `@layer` makes the cascade predictable
Declaring `@layer reset, base, components;` at the top of the stylesheet means component styles always win over base styles, regardless of selector specificity. Design tokens in `base` can never be accidentally overridden by component styles.

### OKLCH is perceptually uniform
HSL's "L" isn't tied to human perception — `hsl(60, 100%, 50%)` (yellow) looks much brighter than `hsl(240, 100%, 50%)` (blue) at the same L. OKLCH's L is calibrated to vision, so all four category tints in this project look proportionally identical. The tradeoff: the style guide gave HSL values, so each color was converted to OKLCH once and stored as a CSS custom property.

### Relative color syntax derives tints cleanly
One CSS rule handles all four category tints:

```css
.summary__row {
  background: oklch(from var(--cat-color) l c h / 0.1);
  color: var(--cat-color);
}
```

`oklch(from X l c h / 0.1)` reads as: take the source color, parse as OKLCH, keep the same L/C/H, force alpha to 0.1. One rule, any color.

### The `<template>` element is parsed-but-not-rendered
Browsers parse `<template>` content as HTML but don't render it. The content lives in `.content` (a `DocumentFragment`). Cloning it via `template.content.cloneNode(true)` gives a fresh copy ready to fill with data.

**Gotcha I hit:** `template.content.cloneNode(true)` returns a `DocumentFragment`, not an `Element`. Setting `.style` on a DocumentFragment throws `TypeError: Cannot read properties of undefined`. The fix: clone `firstElementChild` from the fragment to get the `<li>` directly.

### `fetch()` needs an HTTP server
You can't `fetch('./data.json')` over `file://` — browsers block it for security. VS Code's Live Server extension (or any static file server) is required for the data to load.

## How to Run

1. Open the folder in VS Code
2. Right-click `index.html` → **Open with Live Server** (install the extension first if needed)
3. Visit `http://127.0.0.1:5500`

Or use any static server:

```bash
npx serve .
# or
python -m http.server 8000
```

## Project Structure

```
.
├── index.html              # Semantic HTML scaffold
├── style.css               # All styles, organized in 3 @layer sections
├── main.js                 # Data fetch + row rendering
├── data.json               # Summary categories (the dynamic data)
├── PLAN.md                 # Full plan and decision log
├── style-guide.md          # Design tokens (with OKLCH values)
├── preview.jpg             # Preview image
├── assets/
│   ├── fonts/              # Hanken Grotesk (variable + static weights)
│   └── images/             # Favicon + category icons
└── design/                 # Reference designs (mobile, desktop, active states)
```

## Acknowledgments

- Challenge and design by [Frontend Mentor](https://www.frontendmentor.io)
- Font: [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk)
