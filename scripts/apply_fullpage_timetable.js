const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update printDocument pageMargin
html = html.replace(
  "const pageMargin = isLandscape ? '5mm 8mm 5mm 8mm' : '8mm 12mm 10mm 12mm';",
  "const pageMargin = isLandscape ? '4mm 6mm 4mm 6mm' : '8mm 12mm 10mm 12mm';"
);
html = html.replace(
  "<div style=\"padding: ${isLandscape ? '2px 4px' : '10px 15px'};\相对",
  ""
); // Just in case

// Make sure body container has no unnecessary extra padding in landscape
html = html.replace(
  "<div style=\"padding: ${isLandscape ? '2px 4px' : '10px 15px'};\相对",
  "<div style=\"padding: ${isLandscape ? '0' : '10px 15px'};\相对"
);
html = html.replace(
  "<div style=\"padding: ${isLandscape ? '2px 4px' : '10px 15px'};\"><div class=\"timetable-print-sheet",
  "<div style=\"padding: ${isLandscape ? '0' : '10px 15px'};\"><div class=\"timetable-print-sheet"
);
html = html.replace(
  "<div style=\"padding: ${isLandscape ? '2px 4px' : '10px 15px'};\相对",
  ""
);

html = html.replace(
  "<div style=\"padding: ${isLandscape ? '2px 4px' : '10px 15px'};\相對",
  ""
);

html = html.replace(
  "`<div style=\"padding: ${isLandscape ? '2px 4px' : '10px 15px'};\相對",
  ""
);

// Standardize the outer wrapper in printDocument
html = html.replace(
  "<div style=\"padding: ${isLandscape ? '2px 4px' : '10px 15px'};\相對",
  ""
);

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
          <td style="padding: 4px 2px; border: 1.5px solid #334155; font-weight: bold; background: \${dColor}; text-align: center; font-size: 11pt; width: 65px; height: 25.5mm; vertical-align: middle;">
            \${day}
          </td>\`;

        periodsData.forEach(p => {
          const pNum = typeof p === 'object' ? (p.period || p.id || 1) : p;

          // Period 4: Lunch break
          if (pNum === 4) {
            rowsHtml += \`
              <td style="padding: 4px 2px; border: 1.5px solid #334155; background: #fef9c3; text-align: center; vertical-align: middle; height: 25.5mm;">
                <div style="font-weight: bold; color: #854d0e; font-size: 9.5pt; line-height: 1.2;">🍱 พักกลางวัน</div>
                <div style="font-size: 8pt; color: #a16207; margin-top: 3px;">(11.00 - 11.50 น.)</div>
                <div style="font-size: 8pt; color: #713f12; margin-top: 2px;">โรงอาหารกลาง</div>
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
              <td style="padding: 4px 3px; border: 1.5px solid #334155; text-align: center; vertical-align: middle; background: #ffffff; height: 25.5mm;">
                <div style="font-weight: bold; color: #0f172a; font-size: 9.5pt; line-height: 1.25;">\${slot.subject}</div>
                \${teacher && teacher !== '-' ? \`<div style="font-size: 8.5pt; color: #334155; margin-top: 3px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">👤 \${teacher}</div>\` : ''}
                \${room ? \`<div style="font-size: 8.5pt; color: #1d4ed8; margin-top: 2px; font-weight: 600;">📍 \${room}</div>\` : ''}
              </td>
            \`;
          } else {
            rowsHtml += \`<td style="padding: 4px 2px; border: 1.5px solid #cbd5e1; text-align: center; vertical-align: middle; color: #cbd5e1; background: #ffffff; font-size: 8pt; height: 25.5mm;">-</td>\`;
          }
        });
        rowsHtml += \`</tr>\`;
      });

      const printHtml = \`
        <div class="timetable-print-sheet no-break" style="font-family: 'Sarabun', 'TH Sarabun New', sans-serif; padding: 0; color: #000; width: 100%; box-sizing: border-box; page-break-inside: avoid; break-inside: avoid;">
          <div style="text-align: center; margin-bottom: 5px;">
            <div style="font-size: 17pt; font-weight: bold; color: #0f172a; line-height: 1.2;">\${school.name || 'โรงเรียนฝันใหม่'}</div>
            <div style="font-size: 12pt; font-weight: bold; color: #1e3a8a; margin-top: 2px;">
              ตารางเรียน / ตารางสอน ภาคเรียนที่ \${school.term || '1'} ปีการศึกษา \${school.academicYear || '2569'}
            </div>
            <div style="font-size: 11pt; font-weight: bold; color: #475569; margin-top: 2px;">
              [ \${targetTitle} ]
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 9pt; border: 2px solid #1e293b; table-layout: fixed;">
            <thead>
              <tr style="background: #1e3a8a; color: #ffffff; height: 38px;">
                <th style="padding: 4px 2px; border: 1.5px solid #334155; width: 65px; font-size: 10pt; text-align: center; vertical-align: middle;">วัน / คาบ</th>
                \${periodsData.map((p, idx) => {
                  const pNum = typeof p === 'object' ? (p.period || p.id || 1) : p;
                  if (pNum === 4) {
                    return \`<th style="padding: 4px 2px; border: 1.5px solid #334155; text-align: center; width: 10.5%; background: #b45309; color: #ffffff; font-size: 8.5pt; line-height: 1.15; vertical-align: middle;">คาบที่ 4 (พักกลางวัน)<br/><span style="font-size: 7.5pt; font-weight: normal; opacity: 0.9;">\${pTimes[idx] || ''} น.</span></th>\`;
                  }
                  return \`<th style="padding: 4px 2px; border: 1.5px solid #334155; text-align: center; width: 11.5%; font-size: 9pt; line-height: 1.15; vertical-align: middle;">คาบที่ \${pNum}<br/><span style="font-size: 7.5pt; font-weight: normal; opacity: 0.9;">\${pTimes[idx] || ''} น.</span></th>\`;
                }).join('')}
              </tr>
            </thead>
            <tbody>
              \${rowsHtml}
            </tbody>
          </table>

          <div style="font-size: 8pt; color: #475569; margin-top: 3px; font-style: italic;">
            * หมายเหตุ: คาบเรียนละ 50 นาที • คาบที่ 4 (11.00 - 11.50 น.) เป็นเวลาพักรับประทานอาหารกลางวัน
          </div>

          <div class="no-break" style="display: flex; justify-content: space-between; margin-top: 12px; text-align: center; font-size: 9pt; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top: 3px; font-weight: bold; font-size: 9.5pt;">( นายอรรถพล ฉาไธสง )</div>
              <div style="font-size: 8pt; color: #475569; margin-top: 2px;">ครูผู้จัดทำตารางสอน / หัวหน้างานตารางสอน</div>
            </div>
            <div style="width: 45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top: 3px; font-weight: bold; font-size: 9.5pt;">( \${school.directorName || 'ดร.วิชัย เกียรติสกุล'} )</div>
              <div style="font-size: 8pt; color: #475569; margin-top: 2px;">\${school.directorPosition || 'ผู้อำนวยการสถานศึกษา'}</div>
            </div>
          </div>
        </div>
      \`;

      printDocument(printHtml, 'ตารางสอน_' + targetTitle.replace(/\\s+/g, '_'), 'landscape');
    }`;

if (oldTimetableFuncPattern.test(html)) {
  html = html.replace(oldTimetableFuncPattern, newTimetableFunc);
  console.log('Updated printTimetableA4Landscape with full-height 25.5mm rows');
} else {
  console.error('oldTimetableFuncPattern NOT MATCHED!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully written index.html');
