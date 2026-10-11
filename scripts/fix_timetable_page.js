const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update printDocument to use tight 3mm 5mm margin for landscape and add print CSS rules
const oldPrintDocPattern = /function printDocument\(htmlContent,\s*title\s*=\s*'[^']*',\s*orientation\s*=\s*'[^']*'\)\s*\{[\s\S]*?const pageMargin = isLandscape \? '6mm 8mm 6mm 8mm' : '8mm 12mm 10mm 12mm';/;

const newPrintDocStart = `function printDocument(htmlContent, title = 'พิมพ์เอกสาร', orientation = 'portrait') {
      const isLandscape = orientation === 'landscape';
      const pageSize = isLandscape ? 'A4 landscape' : 'A4 portrait';
      const pageMargin = isLandscape ? '3mm 5mm 3mm 5mm' : '8mm 12mm 10mm 12mm';`;

if (oldPrintDocPattern.test(html)) {
  html = html.replace(oldPrintDocPattern, newPrintDocStart);
  console.log('1. Updated printDocument pageMargin for landscape');
} else {
  console.error('1. oldPrintDocPattern NOT MATCHED!');
}

// Update the printWindow style tag to ensure strict page fit and avoid breaks
const oldStyleBlockPattern = /<style>\s*@page \{\s*size: \$\{pageSize\};[\s\S]*?@media print \{\s*body \{\s*margin: 0;\s*padding: 0;\s*\}\s*\}\s*<\/style>/;

const newStyleBlock = `<style>
    @page {
      size: \${pageSize} !important;
      margin: \${pageMargin} !important;
    }
    * {
      box-sizing: border-box !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #000000 !important;
      font-family: 'Sarabun', 'TH Sarabun New', 'TH Sarabun PSK', sans-serif !important;
    }
    @media print {
      html, body {
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      table, tr, td, th {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .no-break {
        page-break-inside: avoid !important;
        page-break-before: avoid !important;
        page-break-after: avoid !important;
        break-inside: avoid !important;
      }
    }
  </style>`;

if (oldStyleBlockPattern.test(html)) {
  html = html.replace(oldStyleBlockPattern, newStyleBlock);
  console.log('2. Updated printWindow style block with strict single-page rules');
} else {
  console.error('2. oldStyleBlockPattern NOT MATCHED!');
}

// 2. Replace printTimetableA4Landscape with ultra-compact single-page fit layout
const oldTimetableFuncPattern = /function printTimetableA4Landscape\(\)\s*\{[\s\S]*?printDocument\(printHtml,\s*'ตารางสอน_'.*?,\s*'landscape'\);\s*\}/;

const newTimetableFunc = `function printTimetableA4Landscape() {
      const school = state.schoolInfo || DEFAULT_MOCK_DATA.schoolInfo;
      const currentClass = document.getElementById('timetableClassSelect') ? document.getElementById('timetableClassSelect').value : 'ม.1/1';
      const currentTeacher = document.getElementById('timetableTeacherSelect') ? document.getElementById('timetableTeacherSelect').value : '';
      const currentRoom = document.getElementById('timetableRoomSelect') ? document.getElementById('timetableRoomSelect').value : '';

      let targetTitle = 'ชั้นเรียน ' + currentClass;
      if (currentTimetableMode === 'teacher') targetTitle = 'ครูผู้สอน: ครู' + currentTeacher;
      else if (currentTimetableMode === 'room') targetTitle = 'ห้องปฏิบัติการ: ' + currentRoom;

      const pTimes = ['08.30-09.20', '09.20-10.10', '10.10-11.00', '11.00-11.50', '12.40-13.30', '13.30-14.20', '14.20-15.10', '15.10-16.00'];

      const dayColors = {
        'จันทร์': '#fef3c7',
        'อังคาร': '#fce7f3',
        'พุธ': '#d1fae5',
        'พฤหัสบดี': '#ffedd5',
        'ศุกร์': '#e0f2fe'
      };

      let rowsHtml = '';
      daysData.forEach(day => {
        const dColor = dayColors[day] || '#f8fafc';
        rowsHtml += \`<tr>
          <td style="padding: 2px 2px; border: 1px solid #334155; font-weight: bold; background: \${dColor}; text-align: center; font-size: 8.5pt; width: 55px;">
            \${day}
          </td>\`;

        periodsData.forEach(p => {
          const pNum = typeof p === 'object' ? (p.period || p.id || 1) : p;

          // Period 4: Lunch break
          if (pNum === 4) {
            rowsHtml += \`
              <td style="padding: 2px 2px; border: 1px solid #334155; background: #fef9c3; text-align: center; vertical-align: middle;">
                <div style="font-weight: bold; color: #854d0e; font-size: 7.5pt; line-height: 1.1;">🍱 พักกลางวัน</div>
                <div style="font-size: 6.5pt; color: #a16207; margin-top: 1px;">(11.00 - 11.50 น.)</div>
                <div style="font-size: 6.5pt; color: #713f12;">โรงอาหารกลาง</div>
              </td>
            \`;
            return;
          }

          let slot = null;
          if (currentTimetableMode === 'classroom') {
            slot = timetablesList.find(t => t.day === day && parseInt(t.period) === parseInt(pNum) && t.classroom === currentClass);
          } else if (currentTimetableMode === 'teacher') {
            slot = timetablesList.find(t => t.day === day && parseInt(t.period) === parseInt(pNum) && (
              (t.teacher && t.teacher.includes(currentTeacher)) || (t.teacherName && t.teacherName.includes(currentTeacher))
            ));
          } else if (currentTimetableMode === 'room') {
            slot = timetablesList.find(t => t.day === day && parseInt(t.period) === parseInt(pNum) && t.room === currentRoom);
          }

          if (slot) {
            const teacher = slot.teacherName || slot.teacher || '';
            const room = slot.room || '';
            rowsHtml += \`
              <td style="padding: 2px 2px; border: 1px solid #334155; text-align: center; vertical-align: middle; background: #ffffff;">
                <div style="font-weight: bold; color: #0f172a; font-size: 7.5pt; line-height: 1.15;">\${slot.subject}</div>
                \${teacher && teacher !== '-' ? \`<div style="font-size: 6.5pt; color: #334155; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">👤 \${teacher}</div>\` : ''}
                \${room ? \`<div style="font-size: 6.5pt; color: #1d4ed8; margin-top: 1px; font-weight: 600;">📍 \${room}</div>\` : ''}
              </td>
            \`;
          } else {
            rowsHtml += \`<td style="padding: 2px 2px; border: 1px solid #cbd5e1; text-align: center; color: #cbd5e1; background: #ffffff; font-size: 7pt;">-</td>\`;
          }
        });
        rowsHtml += \`</tr>\`;
      });

      const printHtml = \`
        <div class="no-break" style="font-family: 'Sarabun', 'TH Sarabun New', sans-serif; padding: 2px 4px; color: #000; width: 100%; box-sizing: border-box; page-break-inside: avoid !important; break-inside: avoid !important;">
          <div style="text-align: center; line-height: 1.15; margin-bottom: 4px;">
            <div style="font-size: 13pt; font-weight: bold; color: #0f172a;">\${school.name || 'โรงเรียนฝันใหม่'}</div>
            <div style="font-size: 9.5pt; font-weight: bold; color: #1e3a8a; margin-top: 1px;">
              ตารางเรียน / ตารางสอน ภาคเรียนที่ \${school.term || '1'} ปีการศึกษา \${school.academicYear || '2569'}
            </div>
            <div style="font-size: 8.5pt; font-weight: bold; color: #475569; margin-top: 1px;">
              [ \${targetTitle} ]
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-top: 4px; font-size: 8pt; border: 1.5px solid #1e293b; table-layout: fixed;">
            <thead>
              <tr style="background: #1e3a8a; color: #ffffff;">
                <th style="padding: 2px 2px; border: 1px solid #334155; width: 55px; font-size: 8pt;">วัน / คาบ</th>
                \${periodsData.map((p, idx) => {
                  const pNum = typeof p === 'object' ? (p.period || p.id || 1) : p;
                  if (pNum === 4) {
                    return \`<th style="padding: 2px 2px; border: 1px solid #334155; text-align: center; width: 10.5%; background: #b45309; color: #ffffff; font-size: 7.5pt; line-height: 1.1;">คาบที่ 4 (พักกลางวัน)<br/><span style="font-size: 6.5pt; font-weight: normal; opacity: 0.9;">\${pTimes[idx] || ''} น.</span></th>\`;
                  }
                  return \`<th style="padding: 2px 2px; border: 1px solid #334155; text-align: center; width: 11.5%; font-size: 7.5pt; line-height: 1.1;">คาบที่ \${pNum}<br/><span style="font-size: 6.5pt; font-weight: normal; opacity: 0.9;">\${pTimes[idx] || ''} น.</span></th>\`;
                }).join('')}
              </tr>
            </thead>
            <tbody>
              \${rowsHtml}
            </tbody>
          </table>

          <div style="font-size: 6.5pt; color: #475569; margin-top: 3px; font-style: italic;">
            * หมายเหตุ: คาบเรียนละ 50 นาที • คาบที่ 4 (11.00 - 11.50 น.) เป็นเวลาพักรับประทานอาหารกลางวัน
          </div>

          <div class="no-break" style="display: flex; justify-content: space-between; margin-top: 8px; text-align: center; font-size: 8pt; page-break-inside: avoid !important; break-inside: avoid !important;">
            <div style="width: 45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top: 1px; font-weight: bold; font-size: 8pt;">( นายอรรถพล ฉาไธสง )</div>
              <div style="font-size: 7pt; color: #475569;">ครูผู้จัดทำตารางสอน / หัวหน้างานตารางสอน</div>
            </div>
            <div style="width: 45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top: 1px; font-weight: bold; font-size: 8pt;">( \${school.directorName || 'ดร.วิชัย เกียรติสกุล'} )</div>
              <div style="font-size: 7pt; color: #475569;">\${school.directorPosition || 'ผู้อำนวยการสถานศึกษา'}</div>
            </div>
          </div>
        </div>
      \`;

      printDocument(printHtml, 'ตารางสอน_' + targetTitle.replace(/\\s+/g, '_'), 'landscape');
    }`;

if (oldTimetableFuncPattern.test(html)) {
  html = html.replace(oldTimetableFuncPattern, newTimetableFunc);
  console.log('3. Updated printTimetableA4Landscape with compact single-page layout');
} else {
  console.error('3. oldTimetableFuncPattern NOT MATCHED!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done optimizing timetable for single-page printing!');
