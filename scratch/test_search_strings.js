const fs = require('fs');

// Check the exact lines in index.html around line 1418, 3380-3475, and 19770-19920
const content = fs.readFileSync('index.html', 'utf8');

console.log('Check 1418:', content.includes('</section></section>'));
console.log('Check 3386-3388 stray chunk:', content.includes('          </div>\n      </div>\n    </section>\n\n    <!-- ================================================================= -->\n    <!-- MODULE 24: ศูนย์รวมดาวน์โหลด & สั่งพิมพ์เอกสารวิชาการ (TAB-PRINT-CENTER) -->'));
console.log('Check renderPrintCenterCards exists:', content.includes('function renderPrintCenterCards()'));
