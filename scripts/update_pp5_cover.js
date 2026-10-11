const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const startMarker = 'const coverHtml = `';
const endMarker = 'let scoreRows = list.map(';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
  const newCoverBody = `const coverHtml = \`
        <div class="page-container no-break" style="page-break-after: always; padding: 4px 6px; font-family:'Sarabun', 'TH Sarabun New', 'TH Sarabun PSK', sans-serif; color: #000; box-sizing: border-box; page-break-inside: avoid; break-inside: avoid;">
          
          <!-- HEADER -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
            <div style="width: 50px;"></div>
            <div style="text-align: center; flex: 1;">
              \${logoBase64 ? \`<img src="\${logoBase64}" style="max-height: 85px; display: inline-block; margin-bottom: 6px;">\` : ''}
              <h1 style="font-size: 20pt; font-weight: bold; margin: 0; letter-spacing: -0.2px; line-height: 1.2;">แบบบันทึกผลการพัฒนาคุณภาพผู้เรียน</h1>
              <h2 style="font-size: 15pt; font-weight: bold; margin: 4px 0 0 0; line-height: 1.2;">\${schoolName} &nbsp;&nbsp; \${district}</h2>
              <div style="font-size: 11pt; color: #333; margin-top: 3px;">\${jurisdiction}</div>
            </div>
            <div style="width: 50px; text-align: right; font-size: 14pt; font-weight: bold;">ปพ.5</div>
          </div>

          <!-- COURSE INFO BOX (3 COLUMNS TABLE, PREVENT UNWANTED WRAPPING) -->
          <div style="border: 1.5px solid #000; padding: 10px 14px; margin-top: 12px; margin-bottom: 14px; background-color: #fcfcfc;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12pt; line-height: 1.8;">
              <tr>
                <td style="width: 38%; white-space: nowrap;"><strong>\${classText}</strong></td>
                <td style="width: 36%; white-space: nowrap;"><strong>\${termYear}</strong></td>
                <td style="width: 26%; white-space: nowrap; text-align: right;"><strong>เวลา \${weeklyHours} ชั่วโมง/สัปดาห์</strong></td>
              </tr>
              <tr>
                <td style="white-space: nowrap;"><strong>รายวิชา:</strong> \${courseName}</td>
                <td style="white-space: nowrap;"><strong>รหัสวิชา:</strong> \${courseCode}</td>
                <td style="white-space: nowrap; text-align: right;"><strong>จำนวน:</strong> \${credits} หน่วยการเรียน</td>
              </tr>
              <tr>
                <td style="white-space: nowrap;"><strong>ครูผู้สอน:</strong> \${teacherName}</td>
                <td style="white-space: nowrap;"><strong>ครูที่ปรึกษา:</strong> \${advisorName}</td>
                <td style="white-space: nowrap; text-align: right;"><strong>วันอนุมัติผล:</strong> 31 มีนาคม 2570</td>
              </tr>
            </table>
          </div>

          <!-- SUMMARY TABLE 1: GRADE DISTRIBUTION -->
          <div style="margin-bottom: 14px;">
            <div style="font-size: 12pt; font-weight: bold; margin-bottom: 5px;">1. สรุปผลการเรียน (จำนวนนักเรียนทั้งหมด \${totalStudents} คน)</div>
            <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 10.5pt; border: 1.5px solid #000;">
              <thead>
                <tr style="background-color: #f1f5f9; font-weight: bold; height: 28px;">
                  <th style="border: 1px solid #000; width: 14%;">ระดับผลการเรียน</th>
                  <th style="border: 1px solid #000; width: 8%;">4</th>
                  <th style="border: 1px solid #000; width: 8%;">3.5</th>
                  <th style="border: 1px solid #000; width: 8%;">3</th>
                  <th style="border: 1px solid #000; width: 8%;">2.5</th>
                  <th style="border: 1px solid #000; width: 8%;">2</th>
                  <th style="border: 1px solid #000; width: 8%;">1.5</th>
                  <th style="border: 1px solid #000; width: 8%;">1</th>
                  <th style="border: 1px solid #000; width: 8%;">0</th>
                  <th style="border: 1px solid #000; width: 8%;">ร</th>
                  <th style="border: 1px solid #000; width: 8%;">มส</th>
                  <th style="border: 1px solid #000; width: 10%; background-color: #e2e8f0;">รวม</th>
                </tr>
              </thead>
              <tbody>
                <tr style="height: 27px;">
                  <td style="border: 1px solid #000; font-weight: bold; text-align: left; padding-left: 8px;">จำนวน (คน)</td>
                  <td style="border: 1px solid #000;">\${gradeCounts['4']}</td>
                  <td style="border: 1px solid #000;">\${gradeCounts['3.5']}</td>
                  <td style="border: 1px solid #000;">\${gradeCounts['3']}</td>
                  <td style="border: 1px solid #000;">\${gradeCounts['2.5']}</td>
                  <td style="border: 1px solid #000;">\${gradeCounts['2']}</td>
                  <td style="border: 1px solid #000;">\${gradeCounts['1.5']}</td>
                  <td style="border: 1px solid #000;">\${gradeCounts['1']}</td>
                  <td style="border: 1px solid #000;">\${gradeCounts['0']}</td>
                  <td style="border: 1px solid #000;">\${gradeCounts['ร']}</td>
                  <td style="border: 1px solid #000;">\${gradeCounts['มส']}</td>
                  <td style="border: 1px solid #000; font-weight: bold; background-color: #f8fafc;">\${totalStudents}</td>
                </tr>
                <tr style="height: 27px;">
                  <td style="border: 1px solid #000; font-weight: bold; text-align: left; padding-left: 8px;">คิดเป็นร้อยละ</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((gradeCounts['4']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((gradeCounts['3.5']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((gradeCounts['3']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((gradeCounts['2.5']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((gradeCounts['2']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((gradeCounts['1.5']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((gradeCounts['1']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((gradeCounts['0']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((gradeCounts['ร']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((gradeCounts['มส']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000; font-weight: bold; background-color: #f8fafc;">100%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- SUMMARY TABLES 2 & 3: TRAITS & READING -->
          <div style="display: flex; justify-content: space-between; gap: 16px; margin-bottom: 16px;">
            <div style="width: 50%;">
              <div style="font-size: 11.5pt; font-weight: bold; margin-bottom: 5px;">2. สรุปผลคุณลักษณะอันพึงประสงค์ 8 ประการ</div>
              <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 10pt; border: 1.5px solid #000;">
                <tr style="background-color: #f1f5f9; font-weight: bold; height: 26px;">
                  <th style="border: 1px solid #000; width: 28%;">ระดับ</th>
                  <th style="border: 1px solid #000;">ดีเยี่ยม (3)</th>
                  <th style="border: 1px solid #000;">ดี (2)</th>
                  <th style="border: 1px solid #000;">ผ่าน (1)</th>
                  <th style="border: 1px solid #000;">ไม่ผ่าน (0)</th>
                </tr>
                <tr style="height: 25px;">
                  <td style="border: 1px solid #000; font-weight: bold;">จำนวน (คน)</td>
                  <td style="border: 1px solid #000;">\${traitsCounts['3']}</td>
                  <td style="border: 1px solid #000;">\${traitsCounts['2']}</td>
                  <td style="border: 1px solid #000;">\${traitsCounts['1']}</td>
                  <td style="border: 1px solid #000;">\${traitsCounts['0']}</td>
                </tr>
                <tr style="height: 25px;">
                  <td style="border: 1px solid #000; font-weight: bold;">ร้อยละ</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((traitsCounts['3']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((traitsCounts['2']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((traitsCounts['1']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((traitsCounts['0']/totalStudents)*100).toFixed(1) : 0}%</td>
                </tr>
              </table>
            </div>

            <div style="width: 50%;">
              <div style="font-size: 11.5pt; font-weight: bold; margin-bottom: 5px;">3. สรุปผลการอ่าน คิด วิเคราะห์ และเขียน</div>
              <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 10pt; border: 1.5px solid #000;">
                <tr style="background-color: #f1f5f9; font-weight: bold; height: 26px;">
                  <th style="border: 1px solid #000; width: 28%;">ระดับ</th>
                  <th style="border: 1px solid #000;">ดีเยี่ยม (3)</th>
                  <th style="border: 1px solid #000;">ดี (2)</th>
                  <th style="border: 1px solid #000;">ผ่าน (1)</th>
                  <th style="border: 1px solid #000;">ไม่ผ่าน (0)</th>
                </tr>
                <tr style="height: 25px;">
                  <td style="border: 1px solid #000; font-weight: bold;">จำนวน (คน)</td>
                  <td style="border: 1px solid #000;">\${readingCounts['3']}</td>
                  <td style="border: 1px solid #000;">\${readingCounts['2']}</td>
                  <td style="border: 1px solid #000;">\${readingCounts['1']}</td>
                  <td style="border: 1px solid #000;">\${readingCounts['0']}</td>
                </tr>
                <tr style="height: 25px;">
                  <td style="border: 1px solid #000; font-weight: bold;">ร้อยละ</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((readingCounts['3']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((readingCounts['2']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((readingCounts['1']/totalStudents)*100).toFixed(1) : 0}%</td>
                  <td style="border: 1px solid #000;">\${totalStudents > 0 ? ((readingCounts['0']/totalStudents)*100).toFixed(1) : 0}%</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- APPROVAL WORKFLOW SECTION -->
          <div style="border-top: 1.5px solid #000; padding-top: 12px; margin-top: 6px;">
            <div style="font-weight: bold; text-align: center; margin-bottom: 14px; font-size: 13pt; letter-spacing: 0.5px;">การอนุมัติผลการเรียน</div>
            
            <div style="display: flex; justify-content: space-between; align-items: stretch; gap: 16px;">
              
              <!-- LEFT COLUMN: 4 SIGNATURES -->
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

              </div>

              <!-- RIGHT COLUMN: OFFICIAL APPROVAL BOX -->
              <div style="width: 50%; border: 1.5px solid #000; padding: 14px 16px; background: #fafafa; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="text-align: center; margin-bottom: 8px; font-weight: bold; font-size: 11.5pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">
                  เพื่อโปรดพิจารณาอนุมัติผลการเรียน
                </div>
                
                <div style="text-align: center; margin-bottom: 12px;">
                  <div style="white-space: nowrap;">ลงชื่อ..........................................................</div>
                  <div style="margin-top: 3px; font-weight: bold; font-size: 10.5pt;">( นายธาดา ภูพวก )</div>
                  <div style="font-size: 10pt; color: #475569; margin-top: 1px;">รองผู้อำนวยการสถานศึกษา</div>
                  <div style="font-size: 9pt; color: #64748b; margin-top: 1px;">วันที่ ...... เดือน ........................ พ.ศ. ..........</div>
                </div>

                <div style="border-top: 1px dashed #94a3b8; padding-top: 10px; text-align: center;">
                  <div style="display: flex; justify-content: center; gap: 24px; margin-bottom: 8px; font-size: 10.5pt;">
                    <label style="cursor: default;"><input type="checkbox" checked disabled> <strong>[✓] อนุมัติ</strong></label>
                    <label style="cursor: default;"><input type="checkbox" disabled> [ ] ไม่อนุมัติ</label>
                  </div>
                  
                  <div style="white-space: nowrap;">ลงชื่อ..........................................................</div>
                  <div style="margin-top: 3px; font-weight: bold; font-size: 11pt;">( \${directorName} )</div>
                  <div style="font-size: 10pt; color: #334155; margin-top: 1px; font-weight: 500;">ผู้อำนวยการสถานศึกษา</div>
                  <div style="font-size: 9pt; color: #64748b; margin-top: 1px;">วันที่ 31 มีนาคม 2570</div>
                </div>

              </div>

            </div>
          </div>

        </div>
      \`;

      // ==========================================
      // SECTION B: SCORE & ATTENDANCE SHEET (ชีต ScoreTerm & ScoreVicha)
      // ==========================================
      `;

  html = html.substring(0, startIndex) + newCoverBody + html.substring(endIndex);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully updated coverHtml via index slice!');
} else {
  console.error('Markers not found! startIndex:', startIndex, 'endIndex:', endIndex);
}
