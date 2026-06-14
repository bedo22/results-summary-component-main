# Project Plan — Results Summary Component

## 1. Stack & Decisions (recap)

| Decision              | Choice                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| HTML                  | Plain semantic HTML5                                                                              |
| CSS                   | Native, no preprocessor                                                                           |
| CSS architecture      | Three `@layer`: `reset, base, components`                                                         |
| CSS color space       | OKLCH (per updated `style-guide.md`)                                                              |
| Modern CSS features   | `color-mix()`, relative color syntax `oklch(from …)`, `:focus-visible`, CSS Grid, `@media (min-width: …)` |
| JavaScript            | Plain JS, ES module                                                                               |
| Templating            | `<template>` + `cloneNode(true)`                                                                  |
| Data                  | `fetch('./data.json')`                                                                            |
| Server                | VS Code Live Server extension (you have it)                                                       |
| Build tooling         | None                                                                                              |
| Folder structure      | Flat at project root                                                                              |
| Responsive strategy   | Mobile-first, Grid, `min-width: 600px`                                                            |
| Fonts                 | Local `@font-face` from `assets/fonts/`                                                           |
| Per-category color    | JS sets `--cat-color` per row; CSS derives tint via relative color syntax                         |

## 2. File structure

Files we will create or replace:

```
results-summary-component-main/
├── index.html              ← REWRITE (full scaffold below)
├── style.css               ← NEW
├── main.js                 ← NEW
├── data.json               ← (exists, unchanged)
├── style-guide.md          ← (exists, updated with OKLCH values)
├── assets/                 ← (exists, unchanged)
│   ├── fonts/
│   │   ├── HankenGrotesk-VariableFont_wght.ttf
│   │   └── static/
│   │       ├── HankenGrotesk-Medium.ttf     (500)
│   │       ├── HankenGrotesk-Bold.ttf       (700)
│   │       └── HankenGrotesk-ExtraBold.ttf  (800)
│   └── images/
│       ├── favicon-32x32.png
│       ├── icon-reaction.svg
│       ├── icon-memory.svg
│       ├── icon-verbal.svg
│       └── icon-visual.svg
├── design/                 ← (exists, used for visual verification)
│   ├── desktop-design.jpg
│   ├── mobile-design.jpg
│   └── active-states.jpg
└── preview.jpg
```

Untouched: `AGENTS.md`, `CLAUDE.md`, `README.md`, `README-template.md`, `.gitignore`.

## 3. Design tokens (OKLCH palette to use)

From the updated `style-guide.md`. These will be defined once as custom properties in `:root` (inside `@layer base`):

```css
/* category colors (also used by JS via COLORS map) */
--color-reaction: oklch(0.6843 0.2045 24.3);
--color-memory:   oklch(0.8139 0.1654 75.39);
--color-verbal:   oklch(0.7085 0.1426 168.5);
--color-visual:   oklch(0.4208 0.2542 265.77);

/* header background gradient (left slate blue → right royal blue) */
--gradient-bg-start: oklch(0.5884 0.2364 285.76);
--gradient-bg-end:   oklch(0.4611 0.2661 270.02);

/* score circle radial gradient (violet blue center → transparent edge) */
--gradient-circle-start: oklch(0.4388 0.2322 283.49);
--gradient-circle-end:   oklch(0.4102 0.2416 269.47 / 0%);

/* neutrals */
--color-white:          oklch(1 0 0);
--color-pale-blue:      oklch(0.9575 0.02 265.9);   /* page background */
--color-light-lavender: oklch(0.8491 0.0778 285.38); /* "of 100", description */
--color-dark-gray-blue: oklch(0.3576 0.0549 268.3); /* body text, button bg */

/* spacing / radii / typography (we'll pick these as we go) */
```

## 4. HTML scaffold (final, locked)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" sizes="32x32" href="./assets/images/favicon-32x32.png">
  <title>Frontend Mentor | Results summary component</title>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <main>
    <article class="card">
      <section class="result">
        <h1 class="result__title">Your Result</h1>

        <div class="result__score" aria-label="Your score: 76 of 100">
          <span class="result__score-number">76</span>
          <span class="result__score-of">of 100</span>
        </div>

        <p class="result__rating">Great</p>
        <p class="result__description">You scored higher than 65% of the people who have taken these tests.</p>
      </section>

      <section class="summary">
        <h2 class="summary__title">Summary</h2>

        <ul class="summary__list" id="summary-list">
          <template id="summary-row-template">
            <li class="summary__row">
              <img class="summary__icon" data-icon alt="">
              <span class="summary__category" data-category></span>
              <span class="summary__score"><strong data-score></strong> / 100</span>
            </li>
          </template>
        </ul>

        <button type="button" class="summary__continue">Continue</button>
      </section>
    </article>
  </main>

  <script type="module" src="./main.js"></script>
</body>
</html>
```

Note: the score "76", the "Great" label, and the "65%" copy are **hardcoded** in HTML. Only the 4 summary rows come from `data.json`. (We could derive all of it from JSON, but the score/result content is single-instance — not worth the complexity.)

## 5. CSS plan (`style.css`)

Top of file:

```css
@layer reset, base, components;
```

### `@layer reset`

- `*, *::before, *::after { box-sizing: border-box; }`
- `body, h1, h2, p, ul, figure { margin: 0; }`
- `ul { padding: 0; list-style: none; }`
- `img { display: block; max-width: 100%; }`
- `button { font: inherit; cursor: pointer; border: 0; background: none; }`

### `@layer base`

- `@font-face` declarations for weights 500, 700, 800 (paths relative to `style.css`, so `./assets/fonts/...`)
- `:root` custom properties (the OKLCH palette above)
- `html` and `body`: `font-family: 'Hanken Grotesk', system-ui, sans-serif; font-size: 18px; color: var(--color-dark-gray-blue);`
- `body`: `background: var(--color-pale-blue); min-height: 100dvh; display: grid; place-items: center; padding: …;`
- `.card`: max-width, rounded corners, shadow, overflow: hidden, the mobile-first `display: grid; grid-template-columns: 1fr;`

### `@layer components`

- `.result` — gradient background (`linear-gradient(180deg, var(--gradient-bg-start), var(--gradient-bg-end))`), padding, text-align center, white text
- `.result__title` — small uppercase label, light-lavender color
- `.result__score` — the circle: `border-radius: 50%`, `aspect-ratio: 1`, the radial gradient background, padding, flex column centered
- `.result__score-number` — very large, weight 800, white
- `.result__score-of` — small, light-lavender, weight 700
- `.result__rating` — large, weight 700, white
- `.result__description` — small paragraph, light-lavender, max-width for readability
- `.summary` — white background, padding
- `.summary__title` — bold heading
- `.summary__list` — flex column, gap
- `.summary__row` — flex row, padding, rounded, `background: oklch(from var(--cat-color) l c h / 0.1); color: var(--cat-color);` (JS sets `--cat-color`)
- `.summary__icon` — fixed size, e.g. 20px
- `.summary__category` — bold, inherits the row's `color`
- `.summary__score` — pushed to the right (flex `margin-left: auto`), the `<strong>` inside is dark-gray-blue, the " / 100" is light-lavender
- `.summary__continue` — full-width button, dark-gray-blue bg, white text, rounded, padding

### Responsive (in `components`)

- `@media (min-width: 600px) { .card { grid-template-columns: 1fr 1fr; } }`
- At desktop, the `.result` may need slightly different padding/circle size to match `desktop-design.jpg` — fine-tune against the design.

### Hover / focus (in `components`)

- `.summary__continue:hover { background: …; }` (slight lightening or shift)
- `.summary__continue:focus-visible { outline: …; outline-offset: …; }` (visible focus ring only for keyboard nav)

## 6. JavaScript plan (`main.js`)

```js
const COLORS = {
  Reaction: 'oklch(0.6843 0.2045 24.3)',
  Memory:   'oklch(0.8139 0.1654 75.39)',
  Verbal:   'oklch(0.7085 0.1426 168.5)',
  Visual:   'oklch(0.4208 0.2542 265.77)',
};

const list     = document.getElementById('summary-list');
const template = document.getElementById('summary-row-template');

const data = await (await fetch('./data.json')).json();

for (const item of data) {
  const row = template.content.cloneNode(true);
  row.querySelector('[data-icon]').src            = item.icon;
  row.querySelector('[data-category]').textContent = item.category;
  row.querySelector('[data-score]').textContent   = item.score;
  row.style.setProperty('--cat-color', COLORS[item.category]);
  list.appendChild(row);
}
```

Top-level `await` works because the script is `type="module"`. No need for an event listener on `DOMContentLoaded`.

## 7. Build order

Each phase is small and ends in a visible, verifiable state.

| #  | Phase                         | Deliverable                                                                | Verify by                                                                                            |
| -- | ----------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1  | HTML scaffold                 | Replace `index.html` with the final version                                | Open in browser — see the title, headings, button, empty summary list                                |
| 2  | CSS — `reset` layer           | Add the three-layer header and the reset rules                             | Unstyled page, but margins/spacing are sane                                                          |
| 3  | CSS — `base` layer            | Add `@font-face`, `:root` tokens, body styles                              | Page has font, OKLCH pale-blue background, card is centered (but unstyled)                           |
| 4  | CSS — `.card` layout          | Grid, rounded, shadow, mobile single-column                               | Card visible as a rounded block on the pale-blue bg                                                  |
| 5  | CSS — `.result` section       | Gradient, title, score circle, rating, description                        | Compare to `design/mobile-design.jpg` — header section should match                                  |
| 6  | CSS — `.summary` section (static) | Title, empty list, button                                              | Compare to `design/mobile-design.jpg` — summary section layout matches                                |
| 7  | CSS — responsive              | `@media (min-width: 600px)` flips to two columns                          | Resize browser: at 600px+ the two columns appear                                                      |
| 8  | CSS — hover & focus           | Button states                                                             | Tab to the button — focus ring visible; hover changes bg                                              |
| 9  | JS — `main.js`                | Fetch + render loop                                                       | Reload — 4 summary rows appear with correct category, icon, score, and tinted background              |
| 10 | Polish                        | Tweak spacing, font weights, paddings to match design                     | Compare to `design/desktop-design.jpg`, `design/mobile-design.jpg`, `design/active-states.jpg`       |

## 8. Verification checklist

After all phases, check:

- [ ] Mobile (≤375px) — single-column card, header on top, summary below
- [ ] Desktop (≥600px) — two-column card, header on left with gradient
- [ ] Score circle has the radial gradient (violet blue center, transparent edge)
- [ ] Score "76" is very large and white; "of 100" is small and light lavender
- [ ] Each summary row has a faint tint matching its category color
- [ ] Category name in each row is the saturated category color
- [ ] Score "80 / 100" — the "80" is bold/dark, " / 100" is muted
- [ ] "Continue" button: dark-gray-blue bg, white text, rounded, full width of the summary column
- [ ] Tab key reveals visible focus ring on the button
- [ ] Hover on the button changes the background
- [ ] No external font requests (DevTools Network tab — only the local TTF files)
- [ ] No hardcoded rows leaking into the page (DevTools Elements tab — exactly 4 `<li>`s after JS runs)

## 9. Notes & non-goals

- **No build step.** The HTML loads `style.css` and `main.js` directly. Live Server is required for `fetch('./data.json')` to work — without a server, opening `index.html` directly will show the card but with an empty summary list.
- **No frameworks, no libraries.** Everything is hand-written.
- **No `npm install`.** Zero dependencies.
- **The hardcoded "76", "Great", and the 65% copy** stay in HTML (we agreed the score/rating text is single-instance — not worth pulling from data).
- **README** — not part of the build. You can fill out `README-template.md` whenever you want; doesn't affect the project.
