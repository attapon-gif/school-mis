const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Target start and end of printStudentReport
const startMarker = "function printStudentReport(targetStudentId) {";
const endMarker = "function exportProblemStudentsPDF() {";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found! startIndex:", startIndex, "endIndex:", endIndex);
  process.exit(1);
}

const replacement = `function printStudentReport(targetStudentId) {
      const allGradesRaw = (state.grades && state.grades.length > 0) ? state.grades : (DEFAULT_MOCK_DATA.grades || []);
      let stu = state.activeStudent;
      let grades = state.activeStudentGrades || [];
      let gpa = state.activeStudentGPA || (document.getElementById('stuCardGPA') ? document.getElementById('stuCardGPA').textContent : '0.00');

      if (targetStudentId) {
        const foundGrades = allGradesRaw.filter(g => g.studentId === targetStudentId);
        if (foundGrades.length > 0) {
          grades = foundGrades;
          stu = {
            id: targetStudentId,
            name: foundGrades[0].studentName,
            classroom: foundGrades[0].classroom,
            number: foundGrades[0].studentNumber || 1
          };
          let totalPts = 0;
          let totalCrs = 0;
          grades.forEach(g => {
            const cr = parseFloat(g.credits) || 1.0;
            const gr = parseFloat(g.grade);
            if (!isNaN(gr)) {
              totalPts += gr * cr;
              totalCrs += cr;
            }
          });
          gpa = totalCrs > 0 ? (totalPts / totalCrs).toFixed(2) : '0.00';
        }
      }

      if (!stu) {
        alert('กรุณาเลือกหรือเข้าสู่ระบบนักเรียนก่อนสั่งพิมพ์ ปพ.6\\n(สามารถคลิกปุ่ม "บัญชีทดสอบด่วน" ในหน้าระบบนักเรียนเพื่อเข้าสู่ระบบได้ทันที)');
        return;
      }

      const school = state.schoolInfo || {};
      const logoElem = document.getElementById('headerSchoolLogo');
      const logoBase64 = (logoElem && logoElem.src) ? logoElem.src : (school.logoUrl || '');

      // Determine Classroom text & room
      let classText = stu.classroom || 'มัธยมศึกษาปีที่ 1';
      let roomNo = '1';
      if (classText.includes('/')) {
        const parts = classText.split('/');
        roomNo = parts[1] || '1';
        const prefix = parts[0];
        if (prefix.includes('ม.')) classText = 'ชั้นมัธยมศึกษาปีที่ ' + prefix.replace('ม.', '').trim();
        else if (prefix.includes('ป.')) classText = 'ชั้นประถมศึกษาปีที่ ' + prefix.replace('ป.', '').trim();
        else classText = 'ชั้น ' + prefix.trim();
      } else {
        classText = 'ชั้น' + classText;
      }

      // Calculate Weights and Score lookup
      let basicCredits = 0;
      let extraCredits = 0;
      let basicEarnedCredits = 0;
      let extraEarnedCredits = 0;

      // Group into Basic and Additional Subjects
      const basicSubjects = [];
      const extraSubjects = [];

      grades.forEach((g) => {
        const cr = parseFloat(g.credits) || 1.0;
        const isExtra = String(g.courseCode).charAt(2) === '2' || (g.courseCode && g.courseCode.includes('201')) || (g.type === 'เพิ่มเติม');
        const grNum = parseFloat(g.grade);
        const isPass = !isNaN(grNum) && grNum > 0;

        // Score 100 Calculation
        let scoreVal = g.total !== undefined ? g.total : (g.scoreTotal !== undefined ? g.scoreTotal : null);
        if (scoreVal === null) {
          if (g.grade === '4') scoreVal = 86;
          else if (g.grade === '3.5') scoreVal = 77;
          else if (g.grade === '3') scoreVal = 72;
          else if (g.grade === '2.5') scoreVal = 67;
          else if (g.grade === '2') scoreVal = 62;
          else if (g.grade === '1.5') scoreVal = 56;
          else if (g.grade === '1') scoreVal = 51;
          else if (g.grade === '0') scoreVal = 42;
          else scoreVal = 0;
        }

        const subjectItem = {
          courseCode: g.courseCode,
          courseName: g.courseName,
          credits: cr,
          score: scoreVal,
          grade: g.grade,
          remark: g.remark || '',
          typeText: isExtra ? 'เพิ่มเติม' : 'พื้นฐาน'
        };

        if (isExtra) {
          extraCredits += cr;
          if (isPass) extraEarnedCredits += cr;
          extraSubjects.push(subjectItem);
        } else {
          basicCredits += cr;
          if (isPass) basicEarnedCredits += cr;
          basicSubjects.push(subjectItem);
        }
      });

      let rowIdx = 1;
      let subjectRows = '';

      if (basicSubjects.length > 0) {
        subjectRows += \`
          <tr style="background-color: #f5f5f5; font-weight: bold; height: 23px;">
            <td colspan="8" style="border: 1px solid #000; text-align: left; padding-left: 8px; font-size: 11px;">รายวิชาพื้นฐาน</td>
          </tr>
        \`;
        basicSubjects.forEach(s => {
          subjectRows += \`
            <tr style="height: 25px;">
              <td style="border: 1px solid #000; text-align: center;">\${rowIdx++}</td>
              <td style="border: 1px solid #000; text-align: center; font-family: monospace; font-weight: bold;">\${s.courseCode}</td>
              <td style="border: 1px solid #000; text-align: left; padding-left: 8px;">\${s.courseName}</td>
              <td style="border: 1px solid #000; text-align: center;">\${s.typeText}</td>
              <td style="border: 1px solid #000; text-align: center;">\${s.credits.toFixed(1)}</td>
              <td style="border: 1px solid #000; text-align: center; font-weight: bold;">\${s.score}</td>
              <td style="border: 1px solid #000; text-align: center; font-weight: bold; font-size: 12px;">\${s.grade}</td>
              <td style="border: 1px solid #000; text-align: center; font-size: 10px;">\${s.remark}</td>
            </tr>
          \`;
        });
      }

      if (extraSubjects.length > 0) {
        subjectRows += \`
          <tr style="background-color: #f5f5f5; font-weight: bold; height: 23px;">
            <td colspan="8" style="border: 1px solid #000; text-align: left; padding-left: 8px; font-size: 11px;">รายวิชาเพิ่มเติม</td>
          </tr>
        \`;
        extraSubjects.forEach(s => {
          subjectRows += \`
            <tr style="height: 25px;">
              <td style="border: 1px solid #000; text-align: center;">\${rowIdx++}</td>
              <td style="border: 1px solid #000; text-align: center; font-family: monospace; font-weight: bold;">\${s.courseCode}</td>
              <td style="border: 1px solid #000; text-align: left; padding-left: 8px;">\${s.courseName}</td>
              <td style="border: 1px solid #000; text-align: center;">\${s.typeText}</td>
              <td style="border: 1px solid #000; text-align: center;">\${s.credits.toFixed(1)}</td>
              <td style="border: 1px solid #000; text-align: center; font-weight: bold;">\${s.score}</td>
              <td style="border: 1px solid #000; text-align: center; font-weight: bold; font-size: 12px;">\${s.grade}</td>
              <td style="border: 1px solid #000; text-align: center; font-size: 10px;">\${s.remark}</td>
            </tr>
          \`;
        });
      }

      // Standard Activities (ก11101 - ก11106 ตามแบบชีต PP6)
      const activityRows = \`
        <tr style="background-color: #f5f5f5; font-weight: bold; height: 23px;">
          <td colspan="8" style="border: 1px solid #000; text-align: left; padding-left: 8px; font-size: 11px;">กิจกรรมพัฒนาผู้เรียน</td>
        </tr>
        <tr style="height: 24px;">
          <td style="border: 1px solid #000; text-align: center;">1</td>
          <td style="border: 1px solid #000; text-align: center; font-family: monospace;">ก11101</td>
          <td style="border: 1px solid #000; text-align: left; padding-left: 8px;">กิจกรรมแนะแนว</td>
          <td style="border: 1px solid #000; text-align: center;">กิจกรรม</td>
          <td style="border: 1px solid #000; text-align: center;">-</td>
          <td style="border: 1px solid #000; text-align: center;">40 ชม.</td>
          <td style="border: 1px solid #000; text-align: center; font-weight: bold;">ผ่าน</td>
          <td style="border: 1px solid #000; text-align: center;"></td>
        </tr>
        <tr style="height: 24px;">
          <td style="border: 1px solid #000; text-align: center;">2</td>
          <td style="border: 1px solid #000; text-align: center; font-family: monospace;">ก11102</td>
          <td style="border: 1px solid #000; text-align: left; padding-left: 8px;">กิจกรรมลูกเสือ เนตรนารี ยุวกาชาด</td>
          <td style="border: 1px solid #000; text-align: center;">กิจกรรม</td>
          <td style="border: 1px solid #000; text-align: center;">-</td>
          <td style="border: 1px solid #000; text-align: center;">40 ชม.</td>
          <td style="border: 1px solid #000; text-align: center; font-weight: bold;">ผ่าน</td>
          <td style="border: 1px solid #000; text-align: center;"></td>
        </tr>
        <tr style="height: 24px;">
          <td style="border: 1px solid #000; text-align: center;">3</td>
          <td style="border: 1px solid #000; text-align: center; font-family: monospace;">ก11105</td>
          <td style="border: 1px solid #000; text-align: left; padding-left: 8px;">กิจกรรมชุมนุม</td>
          <td style="border: 1px solid #000; text-align: center;">กิจกรรม</td>
          <td style="border: 1px solid #000; text-align: center;">-</td>
          <td style="border: 1px solid #000; text-align: center;">30 ชม.</td>
          <td style="border: 1px solid #000; text-align: center; font-weight: bold;">ผ่าน</td>
          <td style="border: 1px solid #000; text-align: center;"></td>
        </tr>
        <tr style="height: 24px;">
          <td style="border: 1px solid #000; text-align: center;">4</td>
          <td style="border: 1px solid #000; text-align: center; font-family: monospace;">ก11106</td>
          <td style="border: 1px solid #000; text-align: left; padding-left: 8px;">กิจกรรมเพื่อสาธารณะประโยชน์และสังคม</td>
          <td style="border: 1px solid #000; text-align: center;">กิจกรรม</td>
          <td style="border: 1px solid #000; text-align: center;">-</td>
          <td style="border: 1px solid #000; text-align: center;">10 ชม.</td>
          <td style="border: 1px solid #000; text-align: center; font-weight: bold;">ผ่าน</td>
          <td style="border: 1px solid #000; text-align: center;"></td>
        </tr>
      \`;

      // Determine advisor name
      let advisorName = 'นายเดชา นามกันยา';
      if (stu.classroom && stu.classroom.includes('1/2')) advisorName = 'นางสาวปราณี ศรีสุข';

      const directorName = school.directorName || 'นางรัษฎาภรณ์ อ่อนนิ่ม';
      const studentCodeDisplay = (stu.id && stu.id.startsWith('S67')) ? stu.id.replace('S67', '60') : (stu.id || '6072');

      const reportHtml = \`
        <div style="font-family: 'Sarabun', 'TH Sarabun New', 'TH Sarabun PSK', sans-serif; line-height: 1.35; color: #000; padding: 10px 15px; max-width: 820px; margin: 0 auto; box-sizing: border-box;">
          
          <!-- HEADER SECTION (ถอดแบบตาม ปพ.6 สพฐ. ในชีต PP6 ของ PP5-MY-2569) -->
          <div style="display: flex; align-items: flex-start; margin-bottom: 4px;">
            <div style="width: 75px; flex-shrink: 0; text-align: left;">
              \${logoBase64 ? \`<img src="\${logoBase64}" style="max-height: 75px; display: inline-block;" alt="ตรา สพฐ.">\` : ''}
            </div>
            <div style="flex-grow: 1; text-align: center; margin-right: 75px;">
              <h2 style="font-size: 19px; font-weight: bold; margin: 0 0 2px 0; letter-spacing: -0.2px;">แบบรายงานผลการพัฒนาคุณภาพผู้เรียนรายบุคคล (ปพ.6)</h2>
              <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">
                \${classText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ภาคเรียนที่ \${school.term || '1'} &nbsp;&nbsp; ปีการศึกษา \${school.academicYear || '2569'}
              </div>
              <div style="font-size: 13.5px; font-weight: bold; margin-bottom: 2px;">\${school.name || 'โรงเรียนดงสวรรค์วิทยา'} &nbsp;&nbsp; อำเภอนากลาง &nbsp;&nbsp; จังหวัดหนองบัวลำภู</div>
              <div style="font-size: 11.5px; color: #333;">\${school.subTitle || 'สังกัด สำนักงานเขตพื้นที่การศึกษาประถมศึกษาหนองบัวลำภู เขต 2'}</div>
            </div>
          </div>

          <!-- STUDENT INFO SUBHEADER WITH UNDERLINE -->
          <div style="display: flex; justify-content: space-between; font-size: 13px; border-bottom: 1.5px solid #000; padding-bottom: 3px; margin-bottom: 8px;">
            <span><strong>เลขที่:</strong> &nbsp; \${stu.number || 1}</span>
            <span><strong>เลขประจำตัวนักเรียน:</strong> &nbsp; <span style="font-family: monospace; font-weight: bold;">\${studentCodeDisplay}</span></span>
            <span><strong>ชื่อ-สกุล:</strong> &nbsp; <strong>\${stu.name}</strong></span>
            <span><strong>ห้อง:</strong> &nbsp; \${roomNo}</span>
          </div>

          <!-- MAIN 8-COLUMN TABLE (ถอดแบบตรงตามชีต PP6) -->
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11.5px; margin-bottom: 10px;" border="1" cellpadding="3" cellspacing="0">
            <thead>
              <tr style="background-color: #f2f2f2; font-weight: bold; height: 28px; text-align: center;">
                <th style="width: 6%; border: 1px solid #000;">ลำดับ</th>
                <th style="width: 13%; border: 1px solid #000;">รหัสวิชา</th>
                <th style="width: 32%; border: 1px solid #000; text-align: left; padding-left: 8px;">ชื่อวิชา</th>
                <th style="width: 11%; border: 1px solid #000;">ประเภท</th>
                <th style="width: 10%; border: 1px solid #000;">หน่วยกิต</th>
                <th style="width: 11%; border: 1px solid #000;">คะแนน (100)</th>
                <th style="width: 10%; border: 1px solid #000;">ผลการเรียน</th>
                <th style="width: 7%; border: 1px solid #000;">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              \${subjectRows}
              \${activityRows}
            </tbody>
          </table>

          <!-- BOTTOM SECTION: SUMMARY BOX (LEFT) & SIGNATURE BOX (RIGHT) -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; font-size: 11.5px;">
            
            <!-- LEFT COLUMN: SUMMARY TABLES -->
            <div style="width: 52%;">
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 6px;" border="1" cellpadding="2.5" cellspacing="0">
                <tr style="background-color: #f2f2f2; font-weight: bold; text-align: center; height: 23px;">
                  <td colspan="2" style="border: 1px solid #000;">สรุปผลการประเมินผลการเรียนรู้</td>
                </tr>
                <tr style="height: 22px;">
                  <td style="border: 1px solid #000; padding-left: 8px;">จำนวนหน่วยกิต/น้ำหนักวิชาพื้นฐานที่ได้</td>
                  <td style="border: 1px solid #000; text-align: center; width: 30%; font-weight: bold;">\${basicEarnedCredits.toFixed(1)} / \${basicCredits.toFixed(1)}</td>
                </tr>
                <tr style="height: 22px;">
                  <td style="border: 1px solid #000; padding-left: 8px;">จำนวนหน่วยกิต/น้ำหนักวิชาเพิ่มเติมที่ได้</td>
                  <td style="border: 1px solid #000; text-align: center; font-weight: bold;">\${extraEarnedCredits.toFixed(1)} / \${extraCredits.toFixed(1)}</td>
                </tr>
                <tr style="height: 22px;">
                  <td style="border: 1px solid #000; padding-left: 8px;">รวมจำนวนหน่วยกิต/น้ำหนักที่ได้</td>
                  <td style="border: 1px solid #000; text-align: center; font-weight: bold;">\${(basicEarnedCredits + extraEarnedCredits).toFixed(1)} / \${(basicCredits + extraCredits).toFixed(1)}</td>
                </tr>
                <tr style="height: 22px; background-color: #fdfdfd;">
                  <td style="border: 1px solid #000; padding-left: 8px; font-weight: bold;">ระดับผลการเรียนเฉลี่ย (GPA)</td>
                  <td style="border: 1px solid #000; text-align: center; font-weight: black; font-size: 13px; color: #1e3a8a;">\${gpa}</td>
                </tr>
              </table>

              <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;" border="1" cellpadding="2.5" cellspacing="0">
                <tr style="background-color: #f2f2f2; font-weight: bold; text-align: center; height: 23px;">
                  <td colspan="2" style="border: 1px solid #000;">สรุปผลการประเมินคุณภาพผู้เรียน</td>
                </tr>
                <tr style="height: 22px;">
                  <td style="border: 1px solid #000; padding-left: 8px;">ผลการประเมินคุณลักษณะอันพึงประสงค์ (8 ประการ)</td>
                  <td style="border: 1px solid #000; text-align: center; width: 30%; font-weight: bold; color: #047857;">ดีเยี่ยม (3)</td>
                </tr>
                <tr style="height: 22px;">
                  <td style="border: 1px solid #000; padding-left: 8px;">ผลการประเมินการอ่าน คิดวิเคราะห์และเขียน</td>
                  <td style="border: 1px solid #000; text-align: center; font-weight: bold; color: #6b21a8;">ดีเยี่ยม (3)</td>
                </tr>
                <tr style="height: 22px;">
                  <td style="border: 1px solid #000; padding-left: 8px;">ผลการประเมินกิจกรรมพัฒนาผู้เรียน</td>
                  <td style="border: 1px solid #000; text-align: center; font-weight: bold; color: #1d4ed8;">ผ่าน</td>
                </tr>
              </table>
            </div>

            <!-- RIGHT COLUMN: 3 SIGNATURE BLOCKS (ตามชีต PP6) -->
            <div style="width: 46%; display: flex; flex-direction: column; justify-content: space-between; min-height: 195px; text-align: center; font-size: 11.5px;">
              <div>
                <p style="margin: 0;">(ลงชื่อ)..........................................................................</p>
                <p style="margin: 2px 0 0; font-weight: bold;">( \${advisorName} )</p>
                <p style="margin: 1px 0 0; font-size: 10.5px; color: #444;">ครูที่ปรึกษา\${classText}</p>
              </div>

              <div style="position: relative; margin-top: 14px;">
                \${school.signatureUrl ? \`<img src="\${school.signatureUrl}" style="position: absolute; left: 50%; transform: translateX(-50%) translateY(-22%); max-height: 44px; opacity: 0.85; pointer-events: none;" alt="signature">\` : ''}
                <p style="margin: 0;">(ลงชื่อ)..........................................................................</p>
                <p style="margin: 2px 0 0; font-weight: bold;">( \${directorName} )</p>
                <p style="margin: 1px 0 0; font-size: 10.5px; color: #444;">ผู้อำนวยการโรงเรียน &nbsp; วันที่ 31 มีนาคม 2570</p>
              </div>

              <div style="margin-top: 14px;">
                <p style="margin: 0;">(ลงชื่อ)..........................................................................</p>
                <p style="margin: 2px 0 0;">( .......................................................................... )</p>
                <p style="margin: 1px 0 0; font-size: 10.5px; color: #444;">ผู้ปกครอง</p>
              </div>
            </div>

          </div>

        </div>
      \`;

      printDocument(reportHtml, 'ปพ.6 - ' + (stu.name || 'แบบรายงานผลการพัฒนาผู้เรียนรายบุคคล'));
    }

    `;

content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(indexPath, content, 'utf8');
console.log("Successfully upgraded printStudentReport in index.html!");
