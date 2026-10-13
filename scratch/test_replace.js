const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Fix 1: line 1418 </section></section> -> </section>
content = content.replace('</section></section>', '</section>');

// Fix 2: remove lines 3386-3388 from before tab-print-center, and put </div>\n  </div> right after </main>
// First check the exact chunk
const strayChunk = `          </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 24: ศูนย์รวมดาวน์โหลด & สั่งพิมพ์เอกสารวิชาการ (TAB-PRINT-CENTER) -->`;

console.log('Stray chunk found?', content.includes(strayChunk));

const targetAfterMain = `    </section>

  </main>`;

console.log('Target after main found?', content.includes(targetAfterMain));
