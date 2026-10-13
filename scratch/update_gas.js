const fs = require('fs');
let gas = fs.readFileSync('google-apps-script/Index.html', 'utf8');

// Normalize to LF
let normalized = gas.replace(/\r\n/g, '\n');

// 1. Fix line 1418 </section></section> -> </section>
if (normalized.includes('</section></section>')) {
  normalized = normalized.replace('</section></section>', '</section>');
  console.log('GAS line 1418 fixed');
}

// 2. Identify the exact chunk from transfersTableBody to </main>
const sTag = '<tbody id="transfersTableBody" class="divide-y divide-slate-200 bg-white">';
const eTag = '<!-- ================================================================= -->\n  <!-- MODAL: IMPORT STUDENTS FROM EXCEL';

const sIdx = normalized.indexOf(sTag);
const eIdx = normalized.indexOf(eTag);

console.log('GAS sIdx:', sIdx, 'eIdx:', eIdx);
if (sIdx === -1 || eIdx === -1) {
  console.error('GAS Could not locate section bounds');
  process.exit(1);
}

// Extract the same replacement from index.html!
const indexContent = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');
const indexSIdx = indexContent.indexOf(sTag);
const indexEIdx = indexContent.indexOf(eTag);
const newChunk = indexContent.substring(indexSIdx, indexEIdx);

normalized = normalized.substring(0, sIdx) + newChunk + normalized.substring(eIdx);
console.log('GAS Section 24 HTML updated: OK');

// 3. Update JavaScript logic
const jsStartTag = 'function syncPrintCenterClass(val) {';
const jsEndTag = '<!-- MAIN SITE FOOTER -->';

const jsStartIdx = normalized.indexOf(jsStartTag);
const jsEndIdx = normalized.indexOf(jsEndTag);

console.log('GAS jsStartIdx:', jsStartIdx, 'jsEndIdx:', jsEndIdx);
if (jsStartIdx !== -1 && jsEndIdx !== -1) {
  const scriptCloseIdx = normalized.lastIndexOf('</script>', jsEndIdx);

  const indexJsStartIdx = indexContent.indexOf('let activePrintCategory = \'all\';');
  const indexJsEndIdx = indexContent.indexOf('<!-- MAIN SITE FOOTER -->');
  const indexScriptCloseIdx = indexContent.lastIndexOf('</script>', indexJsEndIdx);
  const newJsChunk = indexContent.substring(indexJsStartIdx, indexScriptCloseIdx);

  normalized = normalized.substring(0, jsStartIdx) + newJsChunk + normalized.substring(scriptCloseIdx);
  console.log('GAS Print Center JS updated: OK');
}

fs.writeFileSync('google-apps-script/Index.html', normalized, 'utf8');
console.log('google-apps-script/Index.html updated successfully!');
