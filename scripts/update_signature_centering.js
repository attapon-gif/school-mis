const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const targetSection = `              <!-- LEFT COLUMN: 4 SIGNATURES -->
              <div style="width: 50%; display: flex; flex-direction: column; justify-content: space-between; padding-right: 8px;">
                
                <div style="margin-bottom: 16px;">
                  <div style="display: flex; align-items: baseline; white-space: nowrap;">
                    <span>ลงชื่อ..........................................................</span>
                    <span style="margin-left: 6px; font-weight: 500;">ครูผู้สอน</span>
                  </div>
                  <div style="padding-left: 35px; margin-top: 2px; font-size: 10.5pt; color: #1e293b; white-space: nowrap;">
                    ( \${teacherName} )
                  </div>
                </div>

                <div style="margin-bottom: 16px;">
                  <div style="display: flex; align-items: baseline; white-space: nowrap;">
                    <span>ลงชื่อ..........................................................</span>
                    <span style="margin-left: 6px; font-weight: 500;">หัวหน้ากลุ่มสาระฯ</span>
                  </div>
                  <div style="padding-left: 35px; margin-top: 2px; font-size: 10.5pt; color: #1e293b; white-space: nowrap;">
                    ( นางสาวสมใจ สดใส )
                  </div>
                </div>

                <div style="margin-bottom: 16px;">
                  <div style="display: flex; align-items: baseline; white-space: nowrap;">
                    <span>ลงชื่อ..........................................................</span>
                    <span style="margin-left: 6px; font-weight: 500;">หัวหน้างานวัดผลฯ</span>
                  </div>
                  <div style="padding-left: 35px; margin-top: 2px; font-size: 10.5pt; color: #1e293b; white-space: nowrap;">
                    ( นายวีระศักดิ์ ยิ่งยง )
                  </div>
                </div>

                <div style="margin-bottom: 4px;">
                  <div style="display: flex; align-items: baseline; white-space: nowrap;">
                    <span>ลงชื่อ..........................................................</span>
                    <span style="margin-left: 6px; font-weight: 500;">หัวหน้าฝ่ายวิชาการ</span>
                  </div>
                  <div style="padding-left: 35px; margin-top: 2px; font-size: 10.5pt; color: #1e293b; white-space: nowrap;">
                    ( นางกัญญาณัฐ ถาจัน )
                  </div>
                </div>

              </div>`;

const replacementSection = `              <!-- LEFT COLUMN: 4 SIGNATURES (CENTERED NAMES DIRECTLY UNDER DOTTED LINE) -->
              <div style="width: 50%; display: flex; flex-direction: column; justify-content: space-between; padding-right: 8px;">
                
                <div style="margin-bottom: 16px;">
                  <div style="display: flex; align-items: baseline;">
                    <div style="width: 220px; text-align: center;">
                      <div style="white-space: nowrap;">ลงชื่อ....................................................</div>
                      <div style="margin-top: 3px; font-size: 10.5pt; font-weight: 500; color: #0f172a; white-space: nowrap;">( \${teacherName} )</div>
                    </div>
                    <div style="margin-left: 8px; font-size: 10.5pt; font-weight: 500; white-space: nowrap;">ครูผู้สอน</div>
                  </div>
                </div>

                <div style="margin-bottom: 16px;">
                  <div style="display: flex; align-items: baseline;">
                    <div style="width: 220px; text-align: center;">
                      <div style="white-space: nowrap;">ลงชื่อ....................................................</div>
                      <div style="margin-top: 3px; font-size: 10.5pt; font-weight: 500; color: #0f172a; white-space: nowrap;">( นางสาวสมใจ สดใส )</div>
                    </div>
                    <div style="margin-left: 8px; font-size: 10.5pt; font-weight: 500; white-space: nowrap;">หัวหน้ากลุ่มสาระฯ</div>
                  </div>
                </div>

                <div style="margin-bottom: 16px;">
                  <div style="display: flex; align-items: baseline;">
                    <div style="width: 220px; text-align: center;">
                      <div style="white-space: nowrap;">ลงชื่อ....................................................</div>
                      <div style="margin-top: 3px; font-size: 10.5pt; font-weight: 500; color: #0f172a; white-space: nowrap;">( นายวีระศักดิ์ ยิ่งยง )</div>
                    </div>
                    <div style="margin-left: 8px; font-size: 10.5pt; font-weight: 500; white-space: nowrap;">หัวหน้างานวัดผลฯ</div>
                  </div>
                </div>

                <div style="margin-bottom: 4px;">
                  <div style="display: flex; align-items: baseline;">
                    <div style="width: 220px; text-align: center;">
                      <div style="white-space: nowrap;">ลงชื่อ....................................................</div>
                      <div style="margin-top: 3px; font-size: 10.5pt; font-weight: 500; color: #0f172a; white-space: nowrap;">( นางกัญญาณัฐ ถาจัน )</div>
                    </div>
                    <div style="margin-left: 8px; font-size: 10.5pt; font-weight: 500; white-space: nowrap;">หัวหน้าฝ่ายวิชาการ</div>
                  </div>
                </div>

              </div>`;

if (html.includes(targetSection)) {
  html = html.replace(targetSection, replacementSection);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully updated left signatures to be centered under dotted lines');
} else {
  // Try CRLF matching
  const targetCRLF = targetSection.replace(/\n/g, '\r\n');
  const replacementCRLF = replacementSection.replace(/\n/g, '\r\n');
  if (html.includes(targetCRLF)) {
    html = html.replace(targetCRLF, replacementCRLF);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Successfully updated left signatures (CRLF)');
  } else {
    console.error('Target signature block not found!');
  }
}
