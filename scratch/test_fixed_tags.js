const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// 1. Fix line 1418 </section></section> -> </section>
content = content.replace('</section></section>', '</section>');

// 2. Remove stray chunk before tab-print-center
const strayChunk = `          </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 24: ศูนย์รวมดาวน์โหลด & สั่งพิมพ์เอกสารวิชาการ (TAB-PRINT-CENTER) -->`;

const cleanChunk = `    <!-- ================================================================= -->
    <!-- MODULE 24: ศูนย์รวมดาวน์โหลด & สั่งพิมพ์เอกสารวิชาการ (TAB-PRINT-CENTER) -->`;

content = content.replace(strayChunk, cleanChunk);

// 3. Put </div>\n  </div> right after </main>
const targetAfterMain = `    </section>

  </main>`;

const closedMain = `    </section>

  </main>
      </div>
    </div>`;

content = content.replace(targetAfterMain, closedMain);

// Now run full tag check on content up to <script
const lines = content.split('\n');
const stack = [];
for (let i = 0; i < 6010; i++) {
  const lineNo = i + 1;
  const line = lines[i];
  if (!line) continue;
  const tagRegex = /<\/?([a-zA-Z0-9]+)(?:\s+[^>]*)?>/g;
  let match;
  while ((match = tagRegex.exec(line)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const isClosing = fullTag.startsWith('</');
    const isSelfClosing = fullTag.endsWith('/>') || ['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tagName);
    if (isSelfClosing) continue;

    if (isClosing) {
      if (stack.length === 0) {
        console.log(`Line ${lineNo}: Extra closing tag </${tagName}> with empty stack`);
      } else {
        const top = stack[stack.length - 1];
        if (top.tag === tagName) {
          stack.pop();
        } else {
          console.log(`Line ${lineNo}: Mismatched </${tagName}> (expected </${top.tag}> from line ${top.line}: ${top.text})`);
          const idx = stack.map(s => s.tag).lastIndexOf(tagName);
          if (idx !== -1) {
            stack.splice(idx, 1);
          }
        }
      }
    } else {
      stack.push({ tag: tagName, line: lineNo, text: fullTag.slice(0, 50) });
    }
  }
}

console.log('\nRemaining unclosed tags at line 6010:');
stack.forEach(s => console.log(`  Line ${s.line}: <${s.tag}>  --> ${s.text}`));
