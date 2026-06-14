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
  const row = template.content.firstElementChild.cloneNode(true);
  row.querySelector('[data-icon]').src             = item.icon;
  row.querySelector('[data-category]').textContent = item.category;
  row.querySelector('[data-score]').textContent   = item.score;
  row.style.setProperty('--cat-color', COLORS[item.category]);
  list.appendChild(row);
}
