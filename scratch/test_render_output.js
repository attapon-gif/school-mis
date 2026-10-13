const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

global.lucide = { createIcons: () => {} };
global.window = { lucide: global.lucide };
global.escapeHtml = (str) => str;

const elements = {
  printCenterCardsContainer: { innerHTML: '' },
  printCenterCategorySelect: { value: 'all' },
  printCenterSearchInput: { value: '' },
  printCenterClassSelect: { value: 'ป.6/1' },
  printCenterCountBadge: { textContent: '' },
  printCenterClearSearchBtn: { classList: { add: () => {}, remove: () => {} } }
};

global.document = {
  getElementById: (id) => elements[id] || null,
  querySelectorAll: () => []
};

// Extract script chunk for Print Center
const sIdx = content.indexOf('const PRINT_CENTER_DOCS = [');
const eIdx = content.indexOf('function triggerPrintCenterQuick');

const scriptChunk = content.substring(sIdx, eIdx);

eval(scriptChunk);

renderPrintCenterCards();

const container = elements.printCenterCardsContainer;
console.log('Generated HTML length:', container.innerHTML.length);
console.log('Contains category 1?', container.innerHTML.includes('หมวดที่ 1'));
console.log('Contains category 6?', container.innerHTML.includes('หมวดที่ 6'));
console.log('Contains ปพ.6?', container.innerHTML.includes('ปพ.6'));
console.log('Contains ป้ายล็อกเกอร์?', container.innerHTML.includes('ป้ายล็อกเกอร์'));
console.log('Contains School MIS CSV?', container.innerHTML.includes('School MIS CSV'));
console.log('Total document cards rendered:', (container.innerHTML.match(/triggerPrintCenterDoc/g) || []).length);
