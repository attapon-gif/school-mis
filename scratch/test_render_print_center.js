const fs = require('fs');
const vm = require('vm');

let html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];

const elements = {};
function getEl(id) {
  if (!elements[id]) {
    elements[id] = {
      id: id,
      value: id.includes('Class') ? 'ป.6/1' : (id.includes('Category') ? 'all' : ''),
      textContent: '',
      innerHTML: '',
      classList: { add: () => {}, remove: () => {}, contains: () => false },
      addEventListener: () => {}
    };
  }
  return elements[id];
}

const sandbox = {
  window: { location: { search: '' }, innerWidth: 1200 },
  document: {
    getElementById: (id) => getEl(id),
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  tailwind: { config: {} },
  setInterval: () => 1,
  clearInterval: () => {},
  setTimeout: () => 1,
  clearTimeout: () => {},
  URLSearchParams: URLSearchParams,
  console: console
};

vm.runInNewContext(scripts[4][1], sandbox);
vm.runInNewContext(scripts[5][1], sandbox);

console.log('Testing renderPrintCenter()...');
try {
  sandbox.renderPrintCenter();
  console.log('renderPrintCenter succeeded without error!');
  console.log('Container HTML length:', elements['printCenterCardsContainer'].innerHTML.length);
  console.log('First 500 chars of container HTML:\n', elements['printCenterCardsContainer'].innerHTML.slice(0, 500));
} catch (e) {
  console.error('ERROR in renderPrintCenter:', e);
}
