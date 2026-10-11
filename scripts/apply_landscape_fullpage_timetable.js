const fs = require('fs');

// Restore from git to have clean index.html first
const { execSync } = require('child_process');
const gitExe = 'C:\\Users\\funma\\AppData\\Local\\GitHubDesktop\\app-3.6.7\\resources\\app\\git\\cmd\\git.exe';
execSync(`"${gitExe}" checkout index.html`);
console.log('Restored clean index.html');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove static "size: A4 portrait" from head print styles
const oldHeadPagePattern = /(@media\s+print\s*\{\s*)@page\s*\{\s*size:\s*A4\s+portrait;\s*margin:\s*8mm\s+12mm\s+10mm\s+12mm;\s*\}/;
if (oldHeadPagePattern.test(html)) {
  html = html.replace(oldHeadPagePattern, `$1@page {\n        margin: 8mm 12mm 10mm 12mm;\n      }`);
  console.log('1. Removed static "size: A4 portrait" from head print styles');
} else {
  console.log('1. Head page style already clean');
}

// 2. Replace printDocument with 100% compliant @page CSS + print toolbar (with escaped closing script tag)
const oldPrintDocPattern = /function printDocument\(htmlContent,\s*title\s*=\s*'[^']*',\s*orientation\s*=\s*'[^']*'\)\s*\{[\s\S]*?if\s*\(!popupOpened\)\s*\{[\s\S]*?setTimeout\(\(\)\s*=>\s*printArea\.classList\.add\('hidden'\),\s*500\);\s*\}\s*\}\s*\}/;

const newPrintDoc = `function printDocument(htmlContent, title = 'พิมพ์เอกสาร', orientation = 'portrait') {
      const isLandscape = orientation === 'landscape';
      const pageSize = isLandscape ? 'A4 landscape' : 'A4 portrait';
      const pageMargin = isLandscape ? '5mm 8mm 5mm 8mm' : '8mm 12mm 10mm 12mm';

      // Update in-page dynamic print style so fallback window.print() also respects orientation (NO !important inside @page)
      let styleEl = document.getElementById('dynamicPrintOrientationStyle');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'dynamicPrintOrientationStyle';
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = \`@page { size: \${pageSize}; margin: \${pageMargin}; }\`;

      const printArea = document.getElementById('printableArea');
      if (printArea) {
        printArea.innerHTML = htmlContent;
        printArea.classList.remove('hidden');
      }

      let popupOpened = false;
      try {
        const winWidth = isLandscape ? 1200 : 900;
        const winHeight = isLandscape ? 850 : 1100;
        const printWindow = window.open('', '_blank', \`width=\${winWidth},height=\${winHeight}\`);
        if (printWindow && printWindow.document) {
          popupOpened = true;
          printWindow.document.open();
          printWindow.document.write(\`<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>\${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: \${pageSize};
      margin: \${pageMargin};
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
      width: 100% !important;
    }
    .no-print {
      display: none !important;
    }
    @media print {
      @page {
        size: \${pageSize};
        margin: \${pageMargin};
      }
      .no-print {
        display: none !important;
      }
      html, body {
        width: 100% !important;
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
  </style>
</head>
<body style="margin: 0; padding: 0;">
  <div class="no-print" style="position: sticky; top: 0; z-index: 9999; background: #0f172a; color: #f8fafc; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); font-family: sans-serif; font-size: 13px;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="background: #22c55e; color: white; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold;">พร้อมพิมพ์</span>
      <span style="font-weight: bold;">\${title} (\${isLandscape ? 'A4 แนวนอน 1 หน้าเต็ม' : 'A4 แนวตั้ง'})</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 6px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">🖨️ สั่งพิมพ์ (Print)</button>
      <button onclick="window.close()" style="background: #475569; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">ปิดหน้าต่าง</button>
    </div>
  </div>

  <div style="padding: \${isLandscape ? '2px 4px' : '10px 15px'};">
    \${htmlContent}
  </div>

  <script>
    function triggerPrint() {
      window.focus();
      window.print();
    }
    if (document.readyState === 'complete') {
      setTimeout(triggerPrint, 350);
    } else {
      window.addEventListener('load', function() {
        setTimeout(triggerPrint, 350);
      });
    }
  \\x3C/script>
</body>
</html>\`);
          printWindow.document.close();
        }
      } catch (err) {
        console.warn('Popup print window failed, using in-page window.print()', err);
        popupOpened = false;
      }

      if (!popupOpened) {
        setTimeout(() => {
          window.print();
          setTimeout(() => {
            if (printArea) printArea.classList.add('hidden');
          }, 1000);
        }, 150);
      } else {
        if (printArea) {
          setTimeout(() => printArea.classList.add('hidden'), 500);
        }
      }
    }`;

if (oldPrintDocPattern.test(html)) {
  html = html.replace(oldPrintDocPattern, newPrintDoc);
  console.log('2. Updated printDocument with clean @page syntax and print toolbar');
} else {
  console.error('2. oldPrintDocPattern NOT MATCHED!');
}

// 3. Replace printTimetableA4Landscape with Full-Page A4 Landscape layout
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
          <td style="padding: 4px 2px; border: 1px solid #334155; font-weight: bold; background: \${dColor}; text-align: center; font-size: 9.5pt; width: 62px; height: 23mm;">
            \${day}
          </td>\`;

        periodsData.forEach(p => {
          const pNum = typeof p === 'object' ? (p.period || p.id || 1) : p;

          // Period 4: Lunch break
          if (pNum === 4) {
            rowsHtml += \`
              <td style="padding: 4px 2px; border: 1px solid #334155; background: #fef9c3; text-align: center; vertical-align: middle; height: 23mm;">
                <div style="font-weight: bold; color: #854d0e; font-size: 8.5pt; line-height: 1.2;">🍱 พักกลางวัน</div>
                <div style="font-size: 7.5pt; color: #a16207; margin-top: 3px;">(11.00 - 11.50 น.)</div>
                <div style="font-size: 7.5pt; color: #713f12; margin-top: 2px;">โรงอาหารกลาง</div>
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
              <td style="padding: 4px 3px; border: 1px solid #334155; text-align: center; vertical-align: middle; background: #ffffff; height: 23mm;">
                <div style="font-weight: bold; color: #0f172a; font-size: 8.5pt; line-height: 1.25;">\${slot.subject}</div>
                \${teacher && teacher !== '-' ? \`<div style="font-size: 7.5pt; color: #334155; margin-top: 3px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">👤 \${teacher}</div>\` : ''}
                \${room ? \`<div style="font-size: 7.5pt; color: #1d4ed8; margin-top: 2px; font-weight: 600;">📍 \${room}</div>\` : ''}
              </td>
            \`;
          } else {
            rowsHtml += \`<td style="padding: 4px 2px; border: 1px solid #cbd5e1; text-align: center; vertical-align: middle; color: #cbd5e1; background: #ffffff; font-size: 8pt; height: 23mm;">-</td>\`;
          }
        });
        rowsHtml += \`</tr>\`;
      });

      const printHtml = \`
        <div class="timetable-print-sheet no-break" style="font-family: 'Sarabun', 'TH Sarabun New', sans-serif; padding: 0; color: #000; width: 100%; box-sizing: border-box; page-break-inside: avoid; break-inside: avoid;">
          <div style="text-align: center; margin-bottom: 6px;">
            <div style="font-size: 16pt; font-weight: bold; color: #0f172a; line-height: 1.2;">\${school.name || 'โรงเรียนฝันใหม่'}</div>
            <div style="font-size: 11pt; font-weight: bold; color: #1e3a8a; margin-top: 2px;">
              ตารางเรียน / ตารางสอน ภาคเรียนที่ \${school.term || '1'} ปีการศึกษา \${school.academicYear || '2569'}
            </div>
            <div style="font-size: 10pt; font-weight: bold; color: #475569; margin-top: 2px;">
              [ \${targetTitle} ]
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 8.5pt; border: 1.5px solid #1e293b; table-layout: fixed;">
            <thead>
              <tr style="background: #1e3a8a; color: #ffffff; height: 36px;">
                <th style="padding: 4px 2px; border: 1px solid #334155; width: 62px; font-size: 9pt; text-align: center; vertical-align: middle;">วัน / คาบ</th>
                \${periodsData.map((p, idx) => {
                  const pNum = typeof p === 'object' ? (p.period || p.id || 1) : p;
                  if (pNum === 4) {
                    return \`<th style="padding: 4px 2px; border: 1px solid #334155; text-align: center; width: 10.5%; background: #b45309; color: #ffffff; font-size: 8pt; line-height: 1.15; vertical-align: middle;">คาบที่ 4 (พักกลางวัน)<br/><span style="font-size: 7pt; font-weight: normal; opacity: 0.9;">\${pTimes[idx] || ''} น.</span></th>\`;
                  }
                  return \`<th style="padding: 4px 2px; border: 1px solid #334155; text-align: center; width: 11.5%; font-size: 8.5pt; line-height: 1.15; vertical-align: middle;">คาบที่ \${pNum}<br/><span style="font-size: 7pt; font-weight: normal; opacity: 0.9;">\${pTimes[idx] || ''} น.</span></th>\`;
                }).join('')}
              </tr>
            </thead>
            <tbody>
              \${rowsHtml}
            </tbody>
          </table>

          <div style="font-size: 7.5pt; color: #475569; margin-top: 4px; font-style: italic;">
            * หมายเหตุ: คาบเรียนละ 50 นาที • คาบที่ 4 (11.00 - 11.50 น.) เป็นเวลาพักรับประทานอาหารกลางวัน
          </div>

          <div class="no-break" style="display: flex; justify-content: space-between; margin-top: 10px; text-align: center; font-size: 8.5pt; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top: 3px; font-weight: bold; font-size: 9pt;">( นายอรรถพล ฉาไธสง )</div>
              <div style="font-size: 7.5pt; color: #475569; margin-top: 2px;">ครูผู้จัดทำตารางสอน / หัวหน้างานตารางสอน</div>
            </div>
            <div style="width: 45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top: 3px; font-weight: bold; font-size: 9pt;">( \${school.directorName || 'ดร.วิชัย เกียรติสกุล'} )</div>
              <div style="font-size: 7.5pt; color: #475569; margin-top: 2px;">\${school.directorPosition || 'ผู้อำนวยการสถานศึกษา'}</div>
            </div>
          </div>
        </div>
      \`;

      printDocument(printHtml, 'ตารางสอน_' + targetTitle.replace(/\\s+/g, '_'), 'landscape');
    }`;

if (oldTimetableFuncPattern.test(html)) {
  html = html.replace(oldTimetableFuncPattern, newTimetableFunc);
  console.log('3. Updated printTimetableA4Landscape with Full-Page A4 Landscape layout');
} else {
  console.error('3. oldTimetableFuncPattern NOT MATCHED!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done optimizing timetable for A4 Landscape Full Page printing!');
