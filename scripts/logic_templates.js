// scripts/logic_templates.js
// JavaScript logic, state management, event handlers, and official print engines for all 16 new modules

function getLogicJs() {
  return `
    // =========================================================================
    // 16 NEW MODULES - STATE INITIALIZATION & LOGIC
    // =========================================================================

    function initExtendedState() {
      if (!state.ext) {
        try {
          const savedExt = localStorage.getItem('fm_mis_extended_data');
          state.ext = savedExt ? JSON.parse(savedExt) : JSON.parse(JSON.stringify(DEFAULT_EXT_STATE));
        } catch (e) {
          state.ext = JSON.parse(JSON.stringify(DEFAULT_EXT_STATE));
        }
      }
      // Ensure all keys exist
      for (const k of Object.keys(DEFAULT_EXT_STATE)) {
        if (!state.ext[k]) {
          state.ext[k] = JSON.parse(JSON.stringify(DEFAULT_EXT_STATE[k]));
        }
      }
    }

    function saveExtendedState() {
      try {
        localStorage.setItem('fm_mis_extended_data', JSON.stringify(state.ext));
      } catch (e) {
        console.warn('Failed to save extended state', e);
      }
    }

    // Populate student select dropdowns across modals
    function populateStudentSelect(selectId, defaultStudentId = null) {
      const el = document.getElementById(selectId);
      if (!el) return;
      initExtendedState();
      const list = (state.ext.dmcStudents && state.ext.dmcStudents.length > 0) 
        ? state.ext.dmcStudents 
        : (state.students || []);
      el.innerHTML = list.map(s => {
        const id = s.studentId || s.id;
        const name = s.name || (s.title + s.firstName + ' ' + s.lastName);
        const cls = s.classroom || s.class || '';
        const selected = (id === defaultStudentId) ? 'selected' : '';
        return \`<option value="\${id}" \${selected}>\${name} (\${cls})</option>\`;
      }).join('');
    }

    // -------------------------------------------------------------------------
    // 1. ACADEMIC CALENDAR & LINE NOTIFY (ข้อ 1)
    // -------------------------------------------------------------------------
    function renderAcademicCalendarList() {
      initExtendedState();
      const container = document.getElementById('calendarEventsList');
      if (!container) return;
      const list = state.ext.academicCalendar || [];
      if (list.length === 0) {
        container.innerHTML = '<div class="p-6 text-center text-slate-400">ยังไม่มีกิจกรรมวิชาการในปฏิทิน</div>';
        return;
      }
      container.innerHTML = list.map((item, idx) => {
        let badgeColor = 'bg-blue-100 text-blue-700 border-blue-200';
        let priorityText = 'ปกติ';
        if (item.priority === 'urgent') { badgeColor = 'bg-rose-100 text-rose-700 border-rose-200'; priorityText = 'ด่วนที่สุด'; }
        else if (item.priority === 'high') { badgeColor = 'bg-amber-100 text-amber-800 border-amber-200'; priorityText = 'สำคัญมาก'; }
        else if (item.priority === 'medium') { badgeColor = 'bg-cyan-100 text-cyan-800 border-cyan-200'; priorityText = 'ปานกลาง'; }

        return \`
          <div class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 p-2 rounded-xl transition">
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex flex-col items-center justify-center font-bold flex-shrink-0">
                <span class="text-[10px] uppercase">\${new Date(item.date).toLocaleDateString('th-TH', { month: 'short' })}</span>
                <span class="text-base leading-none font-black">\${new Date(item.date).getDate()}</span>
              </div>
              <div>
                <div class="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <span>\${item.title}</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border \${badgeColor}">\${priorityText}</span>
                  \${item.notifyLine ? '<span class="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5"><i data-lucide="bell" class="w-3 h-3"></i> แจ้งเตือน LINE</span>' : ''}
                </div>
                <div class="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                  <span>⏰ \${item.time || 'ไม่ระบุเวลา'}</span>
                  <span>📍 \${item.location || 'ในโรงเรียน'}</span>
                  <span>👤 ผู้รับผิดชอบ: \${item.owner || '-'}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1.5 self-end sm:self-center">
              <button onclick="sendLineAlertForCalendarEvent('\${item.id}')" title="ยิงแจ้งเตือนเข้า LINE กลุ่มทันที" class="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition flex items-center gap-1">
                <i data-lucide="send" class="w-3 h-3"></i> แจ้ง LINE
              </button>
              <button onclick="deleteCalendarEvent('\${item.id}')" title="ลบกิจกรรม" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        \`;
      }).join('');
      if (window.lucide) lucide.createIcons();
    }

    function openModalAddCalendarEvent() {
      document.getElementById('formAddCalendarEvent').reset();
      document.getElementById('calDate').value = new Date().toISOString().split('T')[0];
      openModal('modalAddCalendarEvent');
    }

    function handleSaveCalendarEvent(e) {
      e.preventDefault();
      initExtendedState();
      const title = document.getElementById('calTitle').value.trim();
      const date = document.getElementById('calDate').value;
      const time = document.getElementById('calTime').value.trim();
      const location = document.getElementById('calLocation').value.trim();
      const owner = document.getElementById('calOwner').value.trim();
      const priority = document.getElementById('calPriority').value;
      const notifyLine = document.getElementById('calNotifyLine').checked;

      const newEvent = {
        id: 'CAL' + String(Date.now()).slice(-4),
        title, date, time, location, owner, priority, notifyLine, notified: false
      };
      state.ext.academicCalendar.push(newEvent);
      saveExtendedState();
      closeModal('modalAddCalendarEvent');
      renderAcademicCalendarList();
      showToast('บันทึกกิจกรรมวิชาการเรียบร้อยแล้ว');

      if (notifyLine) {
        sendLineAlertForCalendarEvent(newEvent.id);
      }
    }

    function deleteCalendarEvent(id) {
      if (!confirm('ต้องการลบกิจกรรมวิชาการนี้ใช่หรือไม่?')) return;
      initExtendedState();
      state.ext.academicCalendar = state.ext.academicCalendar.filter(x => x.id !== id);
      saveExtendedState();
      renderAcademicCalendarList();
      showToast('ลบกิจกรรมเรียบร้อยแล้ว');
    }

    function openModalLineConfig() {
      initExtendedState();
      document.getElementById('lineChannelName').value = state.ext.lineConfig?.channelName || '';
      document.getElementById('lineToken').value = state.ext.lineConfig?.token || '';
      openModal('modalLineConfig');
    }

    function handleSaveLineConfig(e) {
      e.preventDefault();
      initExtendedState();
      state.ext.lineConfig = {
        ...state.ext.lineConfig,
        channelName: document.getElementById('lineChannelName').value.trim(),
        token: document.getElementById('lineToken').value.trim()
      };
      saveExtendedState();
      const chEl = document.getElementById('lineTargetChannel');
      if (chEl) chEl.textContent = 'กลุ่มเป้าหมาย: ' + state.ext.lineConfig.channelName;
      closeModal('modalLineConfig');
      showToast('บันทึกการตั้งค่า LINE Notify สำเร็จ');
    }

    function sendLineAlertForCalendarEvent(eventId) {
      initExtendedState();
      const ev = state.ext.academicCalendar.find(x => x.id === eventId);
      if (!ev) return;
      const msg = \`📢 [แจ้งเตือนกิจกรรมวิชาการ]\n📌 ชื่องาน: \${ev.title}\n📅 วันที่: \${ev.date} เวลา: \${ev.time || 'ตามกำหนดการ'}\n📍 สถานที่: \${ev.location || 'โรงเรียนฝันใหม่'}\n👤 ผู้รับผิดชอบ: \${ev.owner || '-'}\n🔔 ระดับ: \${ev.priority}\`;
      simulateLinePush(msg);
      ev.notified = true;
      saveExtendedState();
      renderAcademicCalendarList();
    }

    function testSendLineNotifyQuick() {
      const msg = '🔔 [ทดสอบการเชื่อมต่อระบบวิชาการ] ระบบบริหารงานวิชาการสถานศึกษา (School MIS FM) เชื่อมต่อ LINE Notify สำเร็จ 100%';
      simulateLinePush(msg);
    }

    function simulateLinePush(message) {
      showToast('📲 ส่งข้อความเข้า LINE กลุ่มสำเร็จ: ' + message.split('\\n')[0]);
      console.log('--- LINE NOTIFY SIMULATION ---');
      console.log(message);
      console.log('------------------------------');
    }

    function printAcademicCalendar() {
      initExtendedState();
      const list = state.ext.academicCalendar || [];
      let rows = list.map((item, i) => \`
        <tr>
          <td style="text-align:center; padding:8px; border:1px solid #999;">\${i + 1}</td>
          <td style="text-align:center; padding:8px; border:1px solid #999;">\${item.date}</td>
          <td style="text-align:center; padding:8px; border:1px solid #999;">\${item.time || '-'}</td>
          <td style="padding:8px; border:1px solid #999; font-weight:bold;">\${item.title}</td>
          <td style="padding:8px; border:1px solid #999;">\${item.location || '-'}</td>
          <td style="padding:8px; border:1px solid #999;">\${item.owner || '-'}</td>
        </tr>
      \`).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:20px;">
            <h2 style="font-size:18pt; margin:0; font-weight:bold;">ปฏิทินปฏิบัติงานวิชาการ ประจำภาคเรียนที่ 1 ปีการศึกษา 2569</h2>
            <h3 style="font-size:14pt; margin:5px 0 0; font-weight:normal;">โรงเรียนฝันใหม่ สำนักงานเขตพื้นที่การศึกษาประถมศึกษาหนองบัวลำภู เขต 1</h3>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:11pt;">
            <thead>
              <tr style="background:#f2f2f2;">
                <th style="padding:8px; border:1px solid #999; width:40px;">ที่</th>
                <th style="padding:8px; border:1px solid #999; width:90px;">วันที่</th>
                <th style="padding:8px; border:1px solid #999; width:100px;">เวลา</th>
                <th style="padding:8px; border:1px solid #999;">กิจกรรม / ภารกิจวิชาการ</th>
                <th style="padding:8px; border:1px solid #999; width:140px;">สถานที่</th>
                <th style="padding:8px; border:1px solid #999; width:120px;">ผู้รับผิดชอบ</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>
          <div style="margin-top:40px; display:flex; justify-content:space-between; text-align:center; font-size:11pt;">
            <div></div>
            <div style="width:250px;">
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(นายอรรถพล ฉาไธสง)</p>
              <p>ผู้อำนวยการโรงเรียนฝันใหม่</p>
            </div>
          </div>
        </div>
      \`;
      printDocument(html, 'ปฏิทินปฏิบัติงานวิชาการ_2569.pdf', 'portrait');
    }

    // -------------------------------------------------------------------------
    // 2. DAILY ATTENDANCE & 4-IN-1 ROUTINES (ข้อ 2)
    // -------------------------------------------------------------------------
    function loadAttendanceForDate() {
      renderDailyAttendanceTable();
    }

    function renderDailyAttendanceTable() {
      initExtendedState();
      const tbody = document.getElementById('dailyAttendanceTableBody');
      if (!tbody) return;
      const recs = state.ext.dailyAttendance.records || [];

      tbody.innerHTML = recs.map(r => {
        return \`
          <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="p-3 text-center font-bold text-slate-700">\${r.number}</td>
            <td class="p-3 font-bold text-slate-900">\${r.name}</td>
            <td class="p-3 text-center bg-blue-50/40">
              <select onchange="updateAttendanceFlag('\${r.studentId}', this.value)" class="px-2 py-1 border rounded-lg text-xs font-bold bg-white text-slate-800">
                <option value="present" \${r.flag === 'present' ? 'selected' : ''}>🟢 มา</option>
                <option value="late" \${r.flag === 'late' ? 'selected' : ''}>🟡 สาย</option>
                <option value="leave" \${r.flag === 'leave' ? 'selected' : ''}>🔵 ลา</option>
                <option value="absent" \${r.flag === 'absent' ? 'selected' : ''}>🔴 ขาด</option>
              </select>
            </td>
            <td class="p-3 text-center">
              <input type="checkbox" onchange="updateRoutineCheck('\${r.studentId}', 'periodAll', this.checked)" \${r.periodAll ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600 cursor-pointer">
            </td>
            <td class="p-3 text-center">
              <input type="checkbox" onchange="updateRoutineCheck('\${r.studentId}', 'lunch', this.checked)" \${r.lunch ? 'checked' : ''} class="w-4 h-4 rounded text-emerald-600 cursor-pointer">
            </td>
            <td class="p-3 text-center">
              <input type="checkbox" onchange="updateRoutineCheck('\${r.studentId}', 'milk', this.checked)" \${r.milk ? 'checked' : ''} class="w-4 h-4 rounded text-cyan-600 cursor-pointer">
            </td>
            <td class="p-3 text-center">
              <input type="checkbox" onchange="updateRoutineCheck('\${r.studentId}', 'brushTeeth', this.checked)" \${r.brushTeeth ? 'checked' : ''} class="w-4 h-4 rounded text-indigo-600 cursor-pointer">
            </td>
            <td class="p-3">
              <input type="text" value="\${r.remark || ''}" onchange="updateAttendanceRemark('\${r.studentId}', this.value)" placeholder="ระบุเหตุผล..." class="w-full px-2 py-1 border rounded-lg text-[11px]">
            </td>
          </tr>
        \`;
      }).join('');
    }

    function updateAttendanceFlag(stuId, flagVal) {
      initExtendedState();
      const r = state.ext.dailyAttendance.records.find(x => x.studentId === stuId);
      if (r) {
        r.flag = flagVal;
        // Auto sync routines
        const isPresentOrLate = (flagVal === 'present' || flagVal === 'late');
        r.periodAll = isPresentOrLate;
        r.lunch = isPresentOrLate;
        r.milk = isPresentOrLate;
        r.brushTeeth = isPresentOrLate;
        saveExtendedState();
        renderDailyAttendanceTable();
      }
    }

    function updateRoutineCheck(stuId, key, isChecked) {
      initExtendedState();
      const r = state.ext.dailyAttendance.records.find(x => x.studentId === stuId);
      if (r) {
        r[key] = isChecked;
        saveExtendedState();
      }
    }

    function updateAttendanceRemark(stuId, val) {
      initExtendedState();
      const r = state.ext.dailyAttendance.records.find(x => x.studentId === stuId);
      if (r) {
        r.remark = val;
        saveExtendedState();
      }
    }

    function quickCheckAllPresent() {
      initExtendedState();
      state.ext.dailyAttendance.records.forEach(r => {
        r.flag = 'present';
        r.periodAll = true;
        r.lunch = true;
        r.milk = true;
        r.brushTeeth = true;
      });
      saveExtendedState();
      renderDailyAttendanceTable();
      showToast('เช็คมาเรียนและทำกิจวัตรครบทุกคนแล้ว');
    }

    function saveDailyAttendance() {
      saveExtendedState();
      showToast('บันทึกเวลาเรียนและกิจวัตรประจำวันเรียบร้อยแล้ว');
    }

    function printDailyAttendanceReport() {
      initExtendedState();
      const date = document.getElementById('attendanceDateInput')?.value || new Date().toISOString().split('T')[0];
      const cls = document.getElementById('attendanceClassSelect')?.value || 'ม.1/1';
      const recs = state.ext.dailyAttendance.records || [];

      let rows = recs.map(r => \`
        <tr>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.number}</td>
          <td style="padding:6px; border:1px solid #999;">\${r.name}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999; font-weight:bold;">\${r.flag === 'present' ? 'มา' : r.flag === 'late' ? 'สาย' : r.flag === 'leave' ? 'ลา' : 'ขาด'}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.periodAll ? '✓' : '-'}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.lunch ? '✓' : '-'}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.milk ? '✓' : '-'}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.brushTeeth ? '✓' : '-'}</td>
          <td style="padding:6px; border:1px solid #999; font-size:10pt;">\${r.remark || ''}</td>
        </tr>
      \`).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">แบบบันทึกเวลาเรียนและกิจวัตรประจำวัน (เข้าแถว/อาหาร/นม/แปรงฟัน)</h2>
            <p style="font-size:11pt; margin:5px 0 0;">ชั้น \${cls} ประจำวันที่ \${date} | โรงเรียนฝันใหม่ สพป.หนองบัวลำภู เขต 1</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10.5pt;">
            <thead>
              <tr style="background:#f2f2f2; text-align:center;">
                <th style="padding:6px; border:1px solid #999; width:35px;">เลขที่</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;">ชื่อ - สกุล</th>
                <th style="padding:6px; border:1px solid #999; width:65px;">เข้าแถว</th>
                <th style="padding:6px; border:1px solid #999; width:65px;">เวลาเรียน</th>
                <th style="padding:6px; border:1px solid #999; width:70px;">อาหารกลางวัน</th>
                <th style="padding:6px; border:1px solid #999; width:65px;">ดื่มนม</th>
                <th style="padding:6px; border:1px solid #999; width:65px;">แปรงฟัน</th>
                <th style="padding:6px; border:1px solid #999;">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>
          <div style="margin-top:30px; display:flex; justify-content:space-between; text-align:center; font-size:11pt;">
            <div>
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(ครูสมใจ สดใส)</p>
              <p>ครูประจำชั้น / ครูผู้บันทึก</p>
            </div>
            <div>
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(นายอรรถพล ฉาไธสง)</p>
              <p>ผู้อำนวยการโรงเรียนฝันใหม่</p>
            </div>
          </div>
        </div>
      \`;
      printDocument(html, 'แบบบันทึกเวลาเรียนและกิจวัตร_\${cls}.pdf', 'portrait');
    }

    // -------------------------------------------------------------------------
    // 3. BMI & NUTRITION TRACKING (ข้อ 3)
    // -------------------------------------------------------------------------
    function renderBmiTable() {
      initExtendedState();
      const tbody = document.getElementById('bmiTableBody');
      if (!tbody) return;
      const recs = state.ext.bmiRecords || [];

      tbody.innerHTML = recs.map(r => {
        let badgeColor = 'bg-emerald-100 text-emerald-800';
        if (r.nutritionStatus === 'อ้วน') badgeColor = 'bg-rose-100 text-rose-800';
        else if (r.nutritionStatus === 'เริ่มอ้วน' || r.nutritionStatus === 'ท้วม') badgeColor = 'bg-amber-100 text-amber-800';
        else if (r.nutritionStatus === 'ค่อนข้างผอม' || r.nutritionStatus === 'ผอม') badgeColor = 'bg-sky-100 text-sky-800';

        return \`
          <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="p-3 text-center font-bold text-slate-700">\${r.number}</td>
            <td class="p-3 font-bold text-slate-900">\${r.name}</td>
            <td class="p-3 text-center">
              <input type="number" step="0.1" value="\${r.weight}" onchange="updateBmiValue('\${r.studentId}', 'weight', this.value)" class="w-20 px-2 py-1 border rounded-lg text-center font-bold text-xs">
            </td>
            <td class="p-3 text-center">
              <input type="number" step="0.1" value="\${r.height}" onchange="updateBmiValue('\${r.studentId}', 'height', this.value)" class="w-20 px-2 py-1 border rounded-lg text-center font-bold text-xs">
            </td>
            <td class="p-3 text-center font-black text-slate-800">\${r.bmi.toFixed(1)}</td>
            <td class="p-3 text-center">
              <span class="px-2.5 py-1 rounded-full text-[11px] font-bold border \${badgeColor}">\${r.nutritionStatus}</span>
            </td>
            <td class="p-3 text-center font-semibold text-slate-700">\${r.heightStatus}</td>
            <td class="p-3 text-center">
              <button onclick="recalculateBmiRow('\${r.studentId}')" title="คำนวณใหม่" class="p-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-700 transition">
                <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
              </button>
            </td>
          </tr>
        \`;
      }).join('');
      if (window.lucide) lucide.createIcons();
    }

    function updateBmiValue(stuId, field, val) {
      initExtendedState();
      const r = state.ext.bmiRecords.find(x => x.studentId === stuId);
      if (r) {
        r[field] = parseFloat(val) || 0;
        // Recalculate BMI
        if (r.height > 0) {
          const hM = r.height / 100;
          r.bmi = r.weight / (hM * hM);
          if (r.bmi < 16.0) r.nutritionStatus = 'ผอม';
          else if (r.bmi < 18.5) r.nutritionStatus = 'ค่อนข้างผอม';
          else if (r.bmi <= 22.9) r.nutritionStatus = 'สมส่วน';
          else if (r.bmi <= 24.9) r.nutritionStatus = 'ท้วม';
          else if (r.bmi <= 29.9) r.nutritionStatus = 'เริ่มอ้วน';
          else r.nutritionStatus = 'อ้วน';

          if (r.height < 145) r.heightStatus = 'เตี้ย';
          else if (r.height < 150) r.heightStatus = 'ค่อนข้างเตี้ย';
          else r.heightStatus = 'สูงตามเกณฑ์';
        }
        saveExtendedState();
        renderBmiTable();
      }
    }

    function recalculateBmiRow(stuId) {
      initExtendedState();
      const r = state.ext.bmiRecords.find(x => x.studentId === stuId);
      if (r) {
        updateBmiValue(stuId, 'weight', r.weight);
        showToast('คำนวณดัชนี BMI เรียบร้อย');
      }
    }

    function saveBmiRecords() {
      saveExtendedState();
      showToast('บันทึกข้อมูลน้ำหนักส่วนสูงเรียบร้อยแล้ว');
    }

    function printBmiReport() {
      initExtendedState();
      const recs = state.ext.bmiRecords || [];
      let rows = recs.map(r => \`
        <tr>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.number}</td>
          <td style="padding:6px; border:1px solid #999;">\${r.name}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.weight} กก.</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.height} ซม.</td>
          <td style="text-align:center; padding:6px; border:1px solid #999; font-weight:bold;">\${r.bmi.toFixed(1)}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.nutritionStatus}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.heightStatus}</td>
        </tr>
      \`).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">แบบรายงานสรุปผลการประเมินการเจริญเติบโตและภาวะโภชนาการ (BMI)</h2>
            <p style="font-size:11pt; margin:5px 0 0;">ภาคเรียนที่ 1 ปีการศึกษา 2569 | โรงเรียนฝันใหม่ สพป.หนองบัวลำภู เขต 1</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10.5pt;">
            <thead>
              <tr style="background:#f2f2f2; text-align:center;">
                <th style="padding:6px; border:1px solid #999; width:35px;">เลขที่</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;">ชื่อ - นามสกุล</th>
                <th style="padding:6px; border:1px solid #999; width:90px;">น้ำหนัก</th>
                <th style="padding:6px; border:1px solid #999; width:90px;">ส่วนสูง</th>
                <th style="padding:6px; border:1px solid #999; width:80px;">ค่า BMI</th>
                <th style="padding:6px; border:1px solid #999; width:120px;">ภาวะโภชนาการ</th>
                <th style="padding:6px; border:1px solid #999; width:120px;">เกณฑ์ส่วนสูงตามอายุ</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>
          <div style="margin-top:35px; display:flex; justify-content:space-between; text-align:center; font-size:11pt;">
            <div>
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(ครูสมใจ สดใส)</p>
              <p>ครูประจำชั้น / ผู้ตรวจวัด</p>
            </div>
            <div>
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(นายอรรถพล ฉาไธสง)</p>
              <p>ผู้อำนวยการโรงเรียนฝันใหม่</p>
            </div>
          </div>
        </div>
      \`;
      printDocument(html, 'รายงานภาวะโภชนาการ_BMI.pdf', 'portrait');
    }

    // -------------------------------------------------------------------------
    // 4. STUDENT SAVINGS SYSTEM (ข้อ 4)
    // -------------------------------------------------------------------------
    function renderSavingsTable() {
      initExtendedState();
      const tbody = document.getElementById('savingsTableBody');
      if (!tbody) return;
      const recs = state.ext.savingsRecords || [];

      let totalBal = 0;
      tbody.innerHTML = recs.map(r => {
        totalBal += r.balance;
        return \`
          <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="p-3 text-center font-bold text-slate-700">\${r.number}</td>
            <td class="p-3 font-bold text-slate-900">\${r.name}</td>
            <td class="p-3 text-center font-black text-pink-700 text-sm">\${r.balance.toLocaleString()} ฿</td>
            <td class="p-3 text-center text-slate-500 text-[11px]">\${r.lastDate}</td>
            <td class="p-3 text-center font-bold text-xs">
              <span class="\${r.lastType === 'deposit' ? 'text-emerald-600' : 'text-rose-600'}">
                \${r.lastType === 'deposit' ? '+' : '-'}\${r.lastAmount} ฿
              </span>
            </td>
            <td class="p-3 text-right">
              <button onclick="openModalAddSavingsEntry('\${r.studentId}')" class="px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs border border-pink-200 transition">
                ฝาก/ถอน
              </button>
            </td>
          </tr>
        \`;
      }).join('');

      const statEl = document.getElementById('statSavingsTotal');
      if (statEl) statEl.textContent = totalBal.toLocaleString() + ' ฿';
    }

    function openModalAddSavingsEntry(defaultStuId = null) {
      document.getElementById('formSavingsEntry').reset();
      document.getElementById('savDate').value = new Date().toISOString().split('T')[0];
      populateStudentSelect('savStudentSelect', defaultStuId);
      openModal('modalAddSavingsEntry');
    }

    function handleSaveSavingsEntry(e) {
      e.preventDefault();
      initExtendedState();
      const stuId = document.getElementById('savStudentSelect').value;
      const type = document.getElementById('savType').value;
      const amount = parseFloat(document.getElementById('savAmount').value) || 0;
      const date = document.getElementById('savDate').value;

      const r = state.ext.savingsRecords.find(x => x.studentId === stuId);
      if (r) {
        if (type === 'withdraw' && amount > r.balance) {
          alert('ยอดเงินคงเหลือไม่พอสำหรับการถอน (คงเหลือ: ' + r.balance + ' บาท)');
          return;
        }
        r.balance = type === 'deposit' ? r.balance + amount : r.balance - amount;
        r.lastDate = date;
        r.lastType = type;
        r.lastAmount = amount;

        state.ext.savingsLogs.push({
          id: 'LOG' + String(Date.now()).slice(-4),
          date, studentId: stuId, name: r.name, type, amount, recordedBy: 'ครูประจำชั้น'
        });

        saveExtendedState();
        closeModal('modalAddSavingsEntry');
        renderSavingsTable();
        showToast(\`บันทึก\${type === 'deposit' ? 'ฝากเงิน' : 'ถอนเงิน'} \${amount} บาท สำเร็จ\`);
      }
    }

    function printSavingsReport() {
      initExtendedState();
      const recs = state.ext.savingsRecords || [];
      let total = 0;
      let rows = recs.map(r => {
        total += r.balance;
        return \`
          <tr>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.number}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.studentId}</td>
            <td style="padding:6px; border:1px solid #999;">\${r.name}</td>
            <td style="text-align:right; padding:6px; border:1px solid #999; font-weight:bold;">\${r.balance.toLocaleString()} บาท</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.lastDate}</td>
          </tr>
        \`;
      }).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">รายงานสรุปบัญชีเงินฝากออมทรัพย์นักเรียน</h2>
            <p style="font-size:11pt; margin:5px 0 0;">ชั้นมัธยมศึกษาปีที่ 1/1 | โรงเรียนฝันใหม่ สพป.หนองบัวลำภู เขต 1</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10.5pt;">
            <thead>
              <tr style="background:#f2f2f2; text-align:center;">
                <th style="padding:6px; border:1px solid #999; width:40px;">ที่</th>
                <th style="padding:6px; border:1px solid #999; width:90px;">รหัสนักเรียน</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;">ชื่อ - สกุล</th>
                <th style="padding:6px; border:1px solid #999; width:130px; text-align:right;">ยอดเงินออมสะสม</th>
                <th style="padding:6px; border:1px solid #999; width:110px;">ทำรายการล่าสุด</th>
              </tr>
            </thead>
            <tbody>
              \${rows}
              <tr style="background:#fafafa; font-weight:bold;">
                <td colspan="3" style="text-align:center; padding:8px; border:1px solid #999;">รวมยอดเงินออมทั้งสิ้น</td>
                <td style="text-align:right; padding:8px; border:1px solid #999; color:#b91c1c;">\${total.toLocaleString()} บาท</td>
                <td style="border:1px solid #999;"></td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top:35px; display:flex; justify-content:space-between; text-align:center; font-size:11pt;">
            <div>
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(ครูสมใจ สดใส)</p>
              <p>ครูประจำชั้น / ผู้ดูแลบัญชีออมทรัพย์</p>
            </div>
            <div>
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(นายอรรถพล ฉาไธสง)</p>
              <p>ผู้อำนวยการโรงเรียนฝันใหม่</p>
            </div>
          </div>
        </div>
      \`;
      printDocument(html, 'รายงานเงินออมนักเรียน.pdf', 'portrait');
    }

    // -------------------------------------------------------------------------
    // 5. DMC EXCEL IMPORT & LOCKER TAGS (ข้อ 5)
    // -------------------------------------------------------------------------
    function renderDmcStudentsTable() {
      initExtendedState();
      const tbody = document.getElementById('dmcStudentsTableBody');
      if (!tbody) return;
      const list = state.ext.dmcStudents || [];

      tbody.innerHTML = list.map((s, i) => \`
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
          <td class="p-3 text-center font-bold text-slate-700">\${s.number || (i + 1)}</td>
          <td class="p-3 font-mono text-slate-500 text-[11px]">\${s.dmcId}</td>
          <td class="p-3 font-mono font-bold text-blue-700">\${s.studentId}</td>
          <td class="p-3 font-mono text-slate-600">\${s.citizenId}</td>
          <td class="p-3 font-bold text-slate-900">\${s.title}\${s.firstName} \${s.lastName}</td>
          <td class="p-3 text-center">\${s.gender}</td>
          <td class="p-3 font-semibold text-slate-700">\${s.classroom}</td>
          <td class="p-3 text-slate-500 text-[11px]">\${s.phone || '-'}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
              \${s.lockerNo || ('L-' + (100 + i))}
            </span>
          </td>
          <td class="p-3 text-right">
            <button onclick="printSingleLockerTag('\${s.studentId}')" title="พิมพ์ป้ายล็อกเกอร์คนนี้" class="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition">
              <i data-lucide="tag" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      \`).join('');

      const badge = document.getElementById('dmcTotalCountBadge');
      if (badge) badge.textContent = \`ทั้งหมด \${list.length} คน\`;
      if (window.lucide) lucide.createIcons();
    }

    function openModalImportDmcExcel() {
      openModal('modalImportDmcExcel');
    }

    function processDmcExcelImport() {
      const fileInput = document.getElementById('dmcFileInput');
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('กรุณาเลือกไฟล์ Excel (.xlsx, .xls) จากระบบ DMC ก่อน');
        return;
      }
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          if (!window.XLSX) {
            alert('ไม่พบไลบรารี XLSX กำลังโหลด...');
            return;
          }
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(firstSheet);

          if (json && json.length > 0) {
            initExtendedState();
            json.forEach((row, i) => {
              const newStu = {
                dmcId: String(row['รหัสประจำตัว'] || row['รหัส DMC'] || (1040520000 + i)),
                studentId: 'S' + String(Date.now()).slice(-4) + i,
                citizenId: String(row['เลขประจำตัวประชาชน'] || '1409900000000'),
                title: row['คำนำหน้า'] || 'ด.ช.',
                firstName: row['ชื่อ'] || 'นักเรียนใหม่',
                lastName: row['นามสกุล'] || '',
                gender: row['เพศ'] || 'ชาย',
                classroom: row['ชั้น'] || row['ชั้นเรียน'] || 'ม.1/1',
                number: parseInt(row['เลขที่']) || (i + 1),
                birthDate: row['วันเกิด'] || '2556-01-01',
                parentName: row['ชื่อผู้ปกครอง'] || '',
                phone: row['เบอร์โทร'] || '',
                lockerNo: 'L-' + (101 + i),
                status: 'กำลังศึกษา'
              };
              state.ext.dmcStudents.push(newStu);
            });
            saveExtendedState();
            closeModal('modalImportDmcExcel');
            renderDmcStudentsTable();
            showToast(\`นำเข้าข้อมูลนักเรียนจาก DMC สำเร็จ \${json.length} รายการ\`);
          } else {
            alert('ไม่พบแถวข้อมูลในไฟล์ Excel ที่เลือก');
          }
        } catch (err) {
          alert('เกิดข้อผิดพลาดในการอ่านไฟล์: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }

    function printLockerNameTags() {
      initExtendedState();
      const list = state.ext.dmcStudents || [];
      let cards = list.map((s, i) => \`
        <div style="width:48%; border:2px dashed #2563eb; border-radius:12px; padding:15px; margin-bottom:15px; box-sizing:border-box; background:#f8fafc; text-align:center;">
          <div style="font-size:10pt; color:#64748b; font-weight:bold;">โรงเรียนฝันใหม่ • สพฐ.</div>
          <div style="font-size:16pt; font-weight:black; color:#1e3a8a; margin:8px 0 4px;">\${s.title}\${s.firstName} \${s.lastName}</div>
          <div style="font-size:11pt; color:#334155;">ชั้น \${s.classroom} | เลขที่ \${s.number || (i+1)}</div>
          <div style="margin-top:10px; display:inline-block; background:#1e40af; color:#fff; padding:4px 12px; border-radius:6px; font-weight:bold; font-size:12pt; font-family:monospace;">
            ล็อกเกอร์: \${s.lockerNo || ('L-' + (101 + i))}
          </div>
        </div>
      \`).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:10px;">
          <h2 style="text-align:center; font-size:16pt; margin-bottom:15px; font-weight:bold;">ป้ายชื่อติดล็อกเกอร์ / โต๊ะเรียนนักเรียน (Locker Name Tags)</h2>
          <div style="display:flex; flex-wrap:wrap; justify-content:space-between;">
            \${cards}
          </div>
        </div>
      \`;
      printDocument(html, 'ป้ายชื่อติดล็อกเกอร์_DMC.pdf', 'portrait');
    }

    function printSingleLockerTag(stuId) {
      initExtendedState();
      const s = state.ext.dmcStudents.find(x => x.studentId === stuId);
      if (!s) return;
      const html = \`
        <div style="font-family:'Sarabun', sans-serif; display:flex; justify-content:center; align-items:center; min-height:80vh;">
          <div style="width:380px; border:3px solid #1e40af; border-radius:16px; padding:25px; text-align:center; background:#ffffff;">
            <div style="font-size:12pt; color:#64748b; font-weight:bold;">โรงเรียนฝันใหม่ • สพป.หนองบัวลำภู เขต 1</div>
            <div style="font-size:20pt; font-weight:black; color:#1e3a8a; margin:15px 0 8px;">\${s.title}\${s.firstName} \${s.lastName}</div>
            <div style="font-size:14pt; color:#334155;">ชั้น \${s.classroom} | เลขที่ \${s.number}</div>
            <div style="margin-top:15px; display:inline-block; background:#1e40af; color:#fff; padding:6px 20px; border-radius:8px; font-weight:bold; font-size:16pt; font-family:monospace;">
              ล็อกเกอร์: \${s.lockerNo || 'L-101'}
            </div>
          </div>
        </div>
      \`;
      printDocument(html, \`ป้ายล็อกเกอร์_\${s.firstName}.pdf\`, 'portrait');
    }

    function printDmcStudentDatabaseReport() {
      initExtendedState();
      const list = state.ext.dmcStudents || [];
      let rows = list.map((s, i) => \`
        <tr>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${s.number || (i+1)}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999; font-family:monospace;">\${s.studentId}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999; font-family:monospace;">\${s.citizenId}</td>
          <td style="padding:6px; border:1px solid #999; font-weight:bold;">\${s.title}\${s.firstName} \${s.lastName}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${s.gender}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${s.classroom}</td>
          <td style="padding:6px; border:1px solid #999;">\${s.parentName || '-'}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${s.phone || '-'}</td>
        </tr>
      \`).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">ทะเบียนข้อมูลนักเรียนรายบุคคล (DMC Student Database)</h2>
            <p style="font-size:11pt; margin:5px 0 0;">ปีการศึกษา 2569 | โรงเรียนฝันใหม่ สพป.หนองบัวลำภู เขต 1</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10pt;">
            <thead>
              <tr style="background:#f2f2f2; text-align:center;">
                <th style="padding:6px; border:1px solid #999; width:35px;">ที่</th>
                <th style="padding:6px; border:1px solid #999; width:75px;">รหัส นร.</th>
                <th style="padding:6px; border:1px solid #999; width:110px;">เลขบัตรประชาชน</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;">ชื่อ - นามสกุล</th>
                <th style="padding:6px; border:1px solid #999; width:45px;">เพศ</th>
                <th style="padding:6px; border:1px solid #999; width:65px;">ชั้นเรียน</th>
                <th style="padding:6px; border:1px solid #999;">ชื่อผู้ปกครอง</th>
                <th style="padding:6px; border:1px solid #999; width:90px;">เบอร์โทรศัพท์</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>
        </div>
      \`;
      printDocument(html, 'ทะเบียนข้อมูลนักเรียน_DMC.pdf', 'landscape');
    }

    // -------------------------------------------------------------------------
    // 6. ONLINE HOME VISIT SYSTEM (สพฐ.) (ข้อ 6)
    // -------------------------------------------------------------------------
    function renderHomeVisitsGrid() {
      initExtendedState();
      const container = document.getElementById('homeVisitCardsContainer');
      if (!container) return;
      const list = state.ext.homeVisits || [];

      if (list.length === 0) {
        container.innerHTML = '<div class="p-8 text-center text-slate-400 col-span-2">ยังไม่มีประวัติการเยี่ยมบ้านนักเรียน</div>';
        return;
      }

      container.innerHTML = list.map(v => \`
        <div class="card-3d p-5 rounded-2xl border border-slate-200 bg-white space-y-3.5 shadow-sm">
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <i data-lucide="home" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">\${v.name} (\${v.class})</h4>
                <p class="text-[11px] text-slate-500">วันที่เยี่ยม: \${v.visitDate} | ครูผู้เยี่ยม: \${v.teacherName}</p>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ✓ ลงลายเซ็นครบถ้วน
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div><strong>ผู้ปกครอง:</strong> \${v.parentName}</div>
            <div><strong>สถานภาพ:</strong> \${v.familyStatus}</div>
            <div><strong>ที่อยู่อาศัย:</strong> \${v.housingType}</div>
            <div><strong>รายได้ครอบครัว:</strong> \${v.incomeMonthly.toLocaleString()} ฿/เดือน</div>
          </div>

          <div class="text-xs text-slate-600 space-y-1">
            <div><strong>ปัญหาที่พบ:</strong> \${v.problemObserved}</div>
            <div class="text-amber-800"><strong>การช่วยเหลือที่จำเป็น:</strong> \${v.assistanceNeeded}</div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <img src="\${v.photoHouseUrl}" alt="สภาพบ้าน" class="w-full h-24 object-cover rounded-xl border border-slate-200">
            <img src="\${v.photoFamilyUrl}" alt="รูปถ่ายครอบครัว" class="w-full h-24 object-cover rounded-xl border border-slate-200">
          </div>

          <div class="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button onclick="printSingleHomeVisitReport('\${v.id}')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow">
              <i data-lucide="printer" class="w-3.5 h-3.5 text-amber-400"></i> พิมพ์แบบรายงาน สพฐ. (2 หน้า)
            </button>
          </div>
        </div>
      \`).join('');
      if (window.lucide) lucide.createIcons();
    }

    function openModalNewHomeVisit() {
      document.getElementById('formHomeVisit').reset();
      document.getElementById('hvDate').value = new Date().toISOString().split('T')[0];
      populateStudentSelect('hvStudentSelect');
      openModal('modalNewHomeVisit');
    }

    function handleSaveHomeVisit(e) {
      e.preventDefault();
      initExtendedState();
      const stuId = document.getElementById('hvStudentSelect').value;
      const stuObj = state.ext.dmcStudents.find(x => x.studentId === stuId) || { name: 'นักเรียน' };

      const newVisit = {
        id: 'HV' + String(Date.now()).slice(-4),
        studentId: stuId,
        name: stuObj.title ? (stuObj.title + stuObj.firstName + ' ' + stuObj.lastName) : stuObj.name,
        class: stuObj.classroom || 'ม.1/1',
        visitDate: document.getElementById('hvDate').value,
        teacherName: 'ครูสมใจ สดใส',
        parentName: document.getElementById('hvParentName').value.trim() || 'ผู้ปกครอง',
        familyStatus: document.getElementById('hvFamilyStatus').value,
        housingType: document.getElementById('hvHousingType').value,
        incomeMonthly: 15000,
        commuteMethod: 'เดินเท้า / จักรยาน',
        hobby: 'ช่วยงานบ้าน',
        problemObserved: document.getElementById('hvProblem').value.trim() || 'สภาพปกติ',
        assistanceNeeded: document.getElementById('hvAssistance').value.trim() || 'ติดตามดูแลการเรียน',
        teacherSigned: document.getElementById('hvTeacherSign').checked,
        parentSigned: document.getElementById('hvParentSign').checked,
        photoHouseUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80',
        photoFamilyUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80'
      };

      state.ext.homeVisits.unshift(newVisit);
      saveExtendedState();
      closeModal('modalNewHomeVisit');
      renderHomeVisitsGrid();
      showToast('บันทึกการเยี่ยมบ้านนักเรียนเรียบร้อยแล้ว');
    }

    function printSingleHomeVisitReport(visitId) {
      initExtendedState();
      const v = state.ext.homeVisits.find(x => x.id === visitId);
      if (!v) return;

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000; line-height:1.6;">
          <div style="text-align:center; margin-bottom:20px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">แบบรายงานการเยี่ยมบ้านนักเรียน (ระบบดูแลช่วยเหลือนักเรียน สพฐ.)</h2>
            <h3 style="font-size:12pt; margin:4px 0 0; font-weight:normal;">โรงเรียนฝันใหม่ สำนักงานเขตพื้นที่การศึกษาประถมศึกษาหนองบัวลำภู เขต 1</h3>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:11pt; margin-bottom:15px;">
            <tr>
              <td style="padding:6px; width:60%;"><strong>ชื่อ - นามสกุลนักเรียน:</strong> \${v.name}</td>
              <td style="padding:6px;"><strong>ชั้น:</strong> \${v.class}</td>
            </tr>
            <tr>
              <td style="padding:6px;"><strong>วันที่เยี่ยมบ้าน:</strong> \${v.visitDate}</td>
              <td style="padding:6px;"><strong>ครูผู้เยี่ยมบ้าน:</strong> \${v.teacherName}</td>
            </tr>
            <tr>
              <td style="padding:6px;"><strong>ชื่อผู้ปกครองที่ให้ข้อมูล:</strong> \${v.parentName}</td>
              <td style="padding:6px;"><strong>สถานภาพครอบครัว:</strong> \${v.familyStatus}</td>
            </tr>
            <tr>
              <td style="padding:6px;"><strong>ลักษณะที่อยู่อาศัย:</strong> \${v.housingType}</td>
              <td style="padding:6px;"><strong>รายได้เฉลี่ย:</strong> \${v.incomeMonthly.toLocaleString()} บาท/เดือน</td>
            </tr>
          </table>

          <div style="border:1px solid #ccc; padding:12px; border-radius:8px; margin-bottom:15px; font-size:11pt;">
            <p style="margin:0 0 6px;"><strong>1. สภาพแวดล้อมและปัญหาที่พบ:</strong> \${v.problemObserved}</p>
            <p style="margin:0;"><strong>2. ข้อเสนอแนะและความต้องการช่วยเหลือ:</strong> \${v.assistanceNeeded}</p>
          </div>

          <div style="margin:20px 0; text-align:center;">
            <p style="font-weight:bold; font-size:11pt; margin-bottom:10px;">ภาพถ่ายบรรยากาศการเยี่ยมบ้านและสภาพที่อยู่อาศัย</p>
            <div style="display:flex; justify-content:center; gap:20px;">
              <div style="border:1px solid #ccc; padding:6px; border-radius:8px; width:260px;">
                <img src="\${v.photoHouseUrl}" style="width:100%; height:160px; object-fit:cover; border-radius:6px;">
                <div style="font-size:10pt; margin-top:4px;">สภาพบ้านและที่พักอาศัย</div>
              </div>
              <div style="border:1px solid #ccc; padding:6px; border-radius:8px; width:260px;">
                <img src="\${v.photoFamilyUrl}" style="width:100%; height:160px; object-fit:cover; border-radius:6px;">
                <div style="font-size:10pt; margin-top:4px;">ภาพถ่ายร่วมกับผู้ปกครอง</div>
              </div>
            </div>
          </div>

          <div style="margin-top:40px; display:flex; justify-content:space-between; text-align:center; font-size:11pt;">
            <div style="width:250px;">
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(\${v.parentName})</p>
              <p>ผู้ปกครองนักเรียน</p>
            </div>
            <div style="width:250px;">
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(\${v.teacherName})</p>
              <p>ครูประจำชั้น / ครูผู้เยี่ยมบ้าน</p>
            </div>
          </div>
        </div>
      \`;
      printDocument(html, \`รายงานเยี่ยมบ้าน_\${v.name}.pdf\`, 'portrait');
    }

    // -------------------------------------------------------------------------
    // 7. CLASSROOM ACTION RESEARCH (CAR) (ข้อ 7)
    // -------------------------------------------------------------------------
    function renderResearchCards() {
      initExtendedState();
      const container = document.getElementById('researchCardsContainer');
      if (!container) return;
      const list = state.ext.researchItems || [];

      container.innerHTML = list.map(r => \`
        <div class="card-3d p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-sm">
          <div class="flex justify-between items-start">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold \${r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              \${r.status === 'approved' ? '✓ อนุมัติแล้ว' : '⏳ รอการตรวจ'}
            </span>
            <span class="text-[11px] text-slate-400">วันที่ส่ง: \${r.submitDate}</span>
          </div>
          <h4 class="font-black text-slate-900 text-sm leading-snug">\${r.title}</h4>
          <div class="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div><strong>ครูผู้วิจัย:</strong> \${r.teacherName} | <strong>วิชา:</strong> \${r.subject} (\${r.classroom})</div>
            <div><strong>กลุ่มเป้าหมาย:</strong> \${r.targetGroup}</div>
            <div><strong>นวัตกรรม:</strong> \${r.innovation}</div>
            <div class="text-indigo-900 font-semibold"><strong>ผลการวิจัย:</strong> \${r.results}</div>
          </div>
          <div class="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button onclick="printSingleResearchReport('\${r.id}')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow">
              <i data-lucide="printer" class="w-3.5 h-3.5 text-indigo-400"></i> พิมพ์แบบสรุปวิจัยหน้าเดียว (A4)
            </button>
          </div>
        </div>
      \`).join('');
      if (window.lucide) lucide.createIcons();
    }

    function openModalSubmitResearch() {
      document.getElementById('formSubmitResearch').reset();
      openModal('modalSubmitResearch');
    }

    function handleSaveResearch(e) {
      e.preventDefault();
      initExtendedState();
      const newRes = {
        id: 'RES' + String(Date.now()).slice(-4),
        title: document.getElementById('resTitle').value.trim(),
        teacherName: document.getElementById('resTeacher').value.trim() || 'ครูผู้สอน',
        subject: document.getElementById('resSubjectClass').value.trim(),
        classroom: 'ม.1/1',
        targetGroup: document.getElementById('resTargetGroup').value.trim(),
        problem: document.getElementById('resProblem').value.trim(),
        innovation: document.getElementById('resInnovation').value.trim(),
        results: document.getElementById('resResults').value.trim(),
        submitDate: new Date().toISOString().split('T')[0],
        status: 'approved',
        approvedBy: 'นายอรรถพล ฉาไธสง (ผอ.)'
      };
      state.ext.researchItems.unshift(newRes);
      saveExtendedState();
      closeModal('modalSubmitResearch');
      renderResearchCards();
      showToast('ส่งงานวิจัยในชั้นเรียนหน้าเดียวเรียบร้อยแล้ว');
    }

    function printSingleResearchReport(resId) {
      initExtendedState();
      const r = state.ext.researchItems.find(x => x.id === resId);
      if (!r) return;

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000; line-height:1.6;">
          <div style="text-align:center; margin-bottom:15px; border-bottom:2px solid #1e40af; padding-bottom:10px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold; color:#1e40af;">แบบสรุปรายงานการวิจัยในชั้นเรียนหน้าเดียว (One-Page CAR)</h2>
            <p style="font-size:11pt; margin:4px 0 0;">โรงเรียนฝันใหม่ สำนักงานเขตพื้นที่การศึกษาประถมศึกษาหนองบัวลำภู เขต 1</p>
          </div>
          <div style="font-size:11pt;">
            <p style="margin:6px 0;"><strong>ชื่องานวิจัย:</strong> \${r.title}</p>
            <p style="margin:6px 0;"><strong>ผู้วิจัย:</strong> \${r.teacherName} | <strong>กลุ่มสาระฯ/วิชา:</strong> \${r.subject}</p>
            <p style="margin:6px 0;"><strong>กลุ่มเป้าหมาย:</strong> \${r.targetGroup}</p>
            <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:10px; border-radius:8px; margin:10px 0;">
              <p style="margin:0 0 6px;"><strong>1. ความสำคัญและความเป็นมาของปัญหา:</strong> \${r.problem}</p>
              <p style="margin:0 0 6px;"><strong>2. นวัตกรรม/วิธีแก้ปัญหา (Active Learning):</strong> \${r.innovation}</p>
              <p style="margin:0;"><strong>3. ผลการวิจัยและข้อค้นพบ:</strong> \${r.results}</p>
            </div>
          </div>
          <div style="margin-top:40px; display:flex; justify-content:space-between; text-align:center; font-size:11pt;">
            <div>
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(\${r.teacherName})</p>
              <p>ครูผู้ทำวิจัย</p>
            </div>
            <div>
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(นายอรรถพล ฉาไธสง)</p>
              <p>ผู้อำนวยการโรงเรียนฝันใหม่</p>
            </div>
          </div>
        </div>
      \`;
      printDocument(html, \`วิจัยหน้าเดียว_\${r.teacherName}.pdf\`, 'portrait');
    }

    // -------------------------------------------------------------------------
    // 8. ACADEMIC MEDIA DOWNLOADS (ข้อ 8)
    // -------------------------------------------------------------------------
    function renderDownloadsGrid(filterCat = 'all') {
      initExtendedState();
      const container = document.getElementById('downloadsGridContainer');
      if (!container) return;
      let list = state.ext.academicDownloads || [];
      if (filterCat !== 'all') {
        list = list.filter(x => x.category === filterCat);
      }

      container.innerHTML = list.map(item => \`
        <div class="card-3d p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between gap-3 shadow-sm">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">
              <i data-lucide="file-text" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">\${item.category}</span>
              <h4 class="font-bold text-slate-900 text-xs sm:text-sm mt-1 leading-snug">\${item.title}</h4>
              <p class="text-[11px] text-slate-400 mt-1">ไฟล์ \${item.fileType} • ขนาด \${item.size} • อัปเดต \${item.updated}</p>
            </div>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[11px] text-slate-400">ดาวน์โหลดแล้ว \${item.downloads} ครั้ง</span>
            <button onclick="downloadResourceItem('\${item.id}')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> ดาวน์โหลด
            </button>
          </div>
        </div>
      \`).join('');
      if (window.lucide) lucide.createIcons();
    }

    function filterDownloads(cat) {
      renderDownloadsGrid(cat);
    }

    function openModalAddDownloadResource() {
      document.getElementById('formAddDownload').reset();
      openModal('modalAddDownload');
    }

    function handleSaveDownload(e) {
      e.preventDefault();
      initExtendedState();
      const newDl = {
        id: 'DL' + String(Date.now()).slice(-4),
        title: document.getElementById('dlTitle').value.trim(),
        category: document.getElementById('dlCategory').value,
        fileType: document.getElementById('dlFileType').value,
        size: '1.5 MB',
        updated: new Date().toISOString().split('T')[0],
        downloads: 0,
        downloadUrl: document.getElementById('dlUrl').value.trim() || '#'
      };
      state.ext.academicDownloads.unshift(newDl);
      saveExtendedState();
      closeModal('modalAddDownload');
      renderDownloadsGrid();
      showToast('เพิ่มสื่องานวิชาการเรียบร้อยแล้ว');
    }

    function downloadResourceItem(id) {
      initExtendedState();
      const item = state.ext.academicDownloads.find(x => x.id === id);
      if (item) {
        item.downloads++;
        saveExtendedState();
        renderDownloadsGrid();
        showToast('กำลังดาวน์โหลดไฟล์: ' + item.title);
      }
    }

    // -------------------------------------------------------------------------
    // 9. ONLINE CLUBS (ข้อ 9)
    // -------------------------------------------------------------------------
    function renderClubsGrid() {
      initExtendedState();
      const container = document.getElementById('clubsGridContainer');
      if (!container) return;
      const list = state.ext.clubs || [];

      container.innerHTML = list.map(c => {
        const isFull = c.currentMembers >= c.maxMembers;
        const percent = Math.min(100, Math.round((c.currentMembers / c.maxMembers) * 100));
        return \`
          <div class="card-3d p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between gap-3 shadow-sm">
            <div>
              <div class="flex justify-between items-start">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold \${isFull ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
                  \${isFull ? 'เต็มแล้ว (Closed)' : 'เปิดรับสมัคร (Open)'}
                </span>
                <span class="text-xs font-bold text-slate-500">\${c.grades}</span>
              </div>
              <h4 class="font-black text-slate-900 text-sm mt-2">\${c.name}</h4>
              <p class="text-xs text-slate-500 mt-1">\${c.desc}</p>
              <div class="text-xs text-slate-700 mt-2 space-y-0.5">
                <div><strong>ครูที่ปรึกษา:</strong> \${c.advisor}</div>
                <div><strong>สถานที่:</strong> \${c.room}</div>
              </div>
            </div>

            <div class="space-y-2 pt-2 border-t border-slate-100">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-slate-600">สมาชิก: \${c.currentMembers} / \${c.maxMembers} คน</span>
                <span class="\${isFull ? 'text-rose-600' : 'text-emerald-600'}">\${percent}%</span>
              </div>
              <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div class="h-full \${isFull ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full" style="width:\${percent}%"></div>
              </div>
              <button onclick="registerStudentToClub('\${c.id}')" \${isFull ? 'disabled' : ''} class="w-full py-2 rounded-xl text-xs font-bold \${isFull ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'btn-ega-primary'} transition">
                \${isFull ? 'สมาชิกเต็มจำนวนแล้ว' : 'สมัครเข้าร่วมชุมนุมนี้'}
              </button>
            </div>
          </div>
        \`;
      }).join('');
    }

    function openModalCreateClub() {
      document.getElementById('formCreateClub').reset();
      openModal('modalCreateClub');
    }

    function handleSaveClub(e) {
      e.preventDefault();
      initExtendedState();
      const newClub = {
        id: 'CLB' + String(Date.now()).slice(-4),
        name: document.getElementById('clubName').value.trim(),
        advisor: document.getElementById('clubAdvisor').value.trim(),
        room: document.getElementById('clubRoom').value.trim(),
        maxMembers: parseInt(document.getElementById('clubMax').value) || 30,
        currentMembers: 0,
        grades: document.getElementById('clubGrades').value.trim(),
        desc: document.getElementById('clubDesc').value.trim()
      };
      state.ext.clubs.push(newClub);
      saveExtendedState();
      closeModal('modalCreateClub');
      renderClubsGrid();
      showToast('จัดตั้งชุมนุมใหม่สำเร็จ');
    }

    function registerStudentToClub(clubId) {
      initExtendedState();
      const c = state.ext.clubs.find(x => x.id === clubId);
      if (c && c.currentMembers < c.maxMembers) {
        c.currentMembers++;
        saveExtendedState();
        renderClubsGrid();
        showToast('สมัครเข้าร่วม ' + c.name + ' เรียบร้อยแล้ว');
      }
    }

    function printClubsReport() {
      initExtendedState();
      const clubs = state.ext.clubs || [];
      let rows = clubs.map((c, i) => \`
        <tr>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${i+1}</td>
          <td style="padding:6px; border:1px solid #999; font-weight:bold;">\${c.name}</td>
          <td style="padding:6px; border:1px solid #999;">\${c.advisor}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${c.room}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${c.currentMembers} / \${c.maxMembers} คน</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${c.grades}</td>
        </tr>
      \`).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">สรุปบัญชีรายชื่อกิจกรรมชุมนุมและจำนวนสมาชิก</h2>
            <p style="font-size:11pt; margin:5px 0 0;">ภาคเรียนที่ 1 ปีการศึกษา 2569 | โรงเรียนฝันใหม่</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10.5pt;">
            <thead>
              <tr style="background:#f2f2f2; text-align:center;">
                <th style="padding:6px; border:1px solid #999; width:40px;">ที่</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;">ชื่อชุมนุม</th>
                <th style="padding:6px; border:1px solid #999;">ครูที่ปรึกษา</th>
                <th style="padding:6px; border:1px solid #999; width:130px;">สถานที่</th>
                <th style="padding:6px; border:1px solid #999; width:100px;">จำนวนสมาชิก</th>
                <th style="padding:6px; border:1px solid #999; width:100px;">ระดับชั้น</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>
        </div>
      \`;
      printDocument(html, 'รายงานกิจกรรมชุมนุม_2569.pdf', 'portrait');
    }

    // -------------------------------------------------------------------------
    // 10. SCOUTS & GIRL GUIDES (ข้อ 10)
    // -------------------------------------------------------------------------
    function renderScoutsGrid() {
      initExtendedState();
      const container = document.getElementById('scoutsContainer');
      if (!container) return;
      const troops = state.ext.scoutTroops || [];
      const activities = state.ext.scoutAttendance || [];

      container.innerHTML = troops.map(t => {
        let actsHtml = activities.map(a => \`
          <div class="py-2 flex justify-between items-center text-xs border-b border-slate-100">
            <div>
              <div class="font-bold text-slate-900">\${a.topic}</div>
              <div class="text-[11px] text-slate-500">วันที่: \${a.date} | มาเรียน: \${a.present} คน</div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">✓ ผ่านเกณฑ์</span>
          </div>
        \`).join('');

        return \`
          <div class="card-3d p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <i data-lucide="flag" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="font-black text-slate-900 text-sm">\${t.name}</h4>
                <p class="text-[11px] text-slate-500">\${t.level} • ผู้กำกับ: \${t.master}</p>
              </div>
            </div>
            <div class="text-xs text-slate-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
              <div><strong>กำหนดเวลาจัดกิจกรรม:</strong> \${t.day}</div>
              <div><strong>สมาชิกทั้งหมด:</strong> \${t.totalMembers} นาย</div>
            </div>
            <div class="pt-1">
              <div class="text-xs font-bold text-slate-800 mb-1">บันทึกกิจกรรมประจำสัปดาห์:</div>
              <div class="divide-y divide-slate-100">\${actsHtml}</div>
            </div>
          </div>
        \`;
      }).join('');
      if (window.lucide) lucide.createIcons();
    }

    function openModalAddScoutActivity() {
      document.getElementById('formScoutActivity').reset();
      document.getElementById('scoutDate').value = new Date().toISOString().split('T')[0];
      openModal('modalAddScoutActivity');
    }

    function handleSaveScoutActivity(e) {
      e.preventDefault();
      initExtendedState();
      const newAct = {
        date: document.getElementById('scoutDate').value,
        troopId: document.getElementById('scoutTroopSelect').value,
        topic: document.getElementById('scoutTopic').value.trim(),
        present: parseInt(document.getElementById('scoutPresent').value) || 40,
        absent: 0,
        passed: true
      };
      state.ext.scoutAttendance.unshift(newAct);
      saveExtendedState();
      closeModal('modalAddScoutActivity');
      renderScoutsGrid();
      showToast('บันทึกกิจกรรมลูกเสือเรียบร้อยแล้ว');
    }

    function printScoutsReport() {
      initExtendedState();
      const acts = state.ext.scoutAttendance || [];
      let rows = acts.map((a, i) => \`
        <tr>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${i+1}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${a.date}</td>
          <td style="padding:6px; border:1px solid #999; font-weight:bold;">\${a.topic}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${a.present} นาย</td>
          <td style="text-align:center; padding:6px; border:1px solid #999; font-weight:bold; color:#047857;">ผ่านเกณฑ์</td>
        </tr>
      \`).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">สรุปการจัดกิจกรรมลูกเสือ - เนตรนารี ประจำภาคเรียน</h2>
            <p style="font-size:11pt; margin:5px 0 0;">กองลูกเสือสามัญรุ่นใหญ่ | โรงเรียนฝันใหม่</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10.5pt;">
            <thead>
              <tr style="background:#f2f2f2; text-align:center;">
                <th style="padding:6px; border:1px solid #999; width:40px;">สัปดาห์</th>
                <th style="padding:6px; border:1px solid #999; width:100px;">วันที่</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;">หัวข้อกิจกรรม / วิชาพิเศษ</th>
                <th style="padding:6px; border:1px solid #999; width:110px;">เข้าร่วม</th>
                <th style="padding:6px; border:1px solid #999; width:100px;">ผลการประเมิน</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>
        </div>
      \`;
      printDocument(html, 'สรุปกิจกรรมลูกเสือ.pdf', 'portrait');
    }

    // -------------------------------------------------------------------------
    // 11. MIDTERM & FINAL EXAM SCHEDULER (ข้อ 11)
    // -------------------------------------------------------------------------
    function renderExamScheduleTable() {
      initExtendedState();
      const tbody = document.getElementById('examScheduleTableBody');
      if (!tbody) return;
      const list = state.ext.examSchedules || [];

      tbody.innerHTML = list.map(item => \`
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
          <td class="p-3 font-bold text-slate-900">\${item.date}</td>
          <td class="p-3 font-semibold text-cyan-800">\${item.period}</td>
          <td class="p-3 font-bold text-slate-700">\${item.classroom}</td>
          <td class="p-3 font-bold text-slate-900">\${item.subjectName} (\${item.subjectCode})</td>
          <td class="p-3 font-mono font-bold text-slate-700">\${item.room}</td>
          <td class="p-3 text-slate-800">\${item.proctor1}</td>
          <td class="p-3 text-slate-500">\${item.proctor2 || '-'}</td>
          <td class="p-3 text-right">
            <button onclick="deleteExamPeriod('\${item.id}')" title="ลบคาบสอบนี้" class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      \`).join('');
      if (window.lucide) lucide.createIcons();
    }

    function openModalAddExamPeriod() {
      document.getElementById('formAddExamPeriod').reset();
      document.getElementById('examDate').value = '2026-11-05';
      openModal('modalAddExamPeriod');
    }

    function handleSaveExamPeriod(e) {
      e.preventDefault();
      initExtendedState();
      const date = document.getElementById('examDate').value;
      const period = document.getElementById('examPeriod').value;
      const classroom = document.getElementById('examClassroom').value;
      const room = document.getElementById('examRoom').value.trim();
      const subjectCode = document.getElementById('examSubjectCode').value.trim();
      const subjectName = document.getElementById('examSubjectName').value.trim();
      const proctor1 = document.getElementById('examProctor1').value.trim();
      const proctor2 = document.getElementById('examProctor2').value.trim();

      // SMART CONFLICT CHECK
      const conflict = state.ext.examSchedules.find(ex => {
        if (ex.date !== date || ex.period !== period) return false;
        // 1. Same classroom taking 2 exams at the same time
        if (ex.classroom === classroom) return true;
        // 2. Same room used twice
        if (ex.room === room) return true;
        // 3. Same proctor in 2 places
        if (ex.proctor1 === proctor1 || (proctor2 && ex.proctor2 === proctor2)) return true;
        return false;
      });

      if (conflict) {
        alert('❌ ตรวจพบความขัดแย้งในตารางสอบ!\\n- ห้องสอบ ครูคุมสอบ หรือชั้นเรียนนี้มีตารางสอบอยู่แล้วในคาบเดียวกัน');
        return;
      }

      state.ext.examSchedules.push({
        id: 'EX' + String(Date.now()).slice(-4),
        type: 'midterm', term: '1/2569',
        date, period, classroom, subjectCode, subjectName, room, proctor1, proctor2
      });

      saveExtendedState();
      closeModal('modalAddExamPeriod');
      renderExamScheduleTable();
      showToast('เพิ่มคาบสอบสำเร็จ (ผ่านการตรวจไม่ชนกัน)');
    }

    function deleteExamPeriod(id) {
      if (!confirm('ต้องการลบคาบสอบนี้ใช่หรือไม่?')) return;
      initExtendedState();
      state.ext.examSchedules = state.ext.examSchedules.filter(x => x.id !== id);
      saveExtendedState();
      renderExamScheduleTable();
      showToast('ลบคาบสอบเรียบร้อยแล้ว');
    }

    function sendExamLineAlert() {
      const msg = '📅 [แจ้งตารางสอบกลางภาคเรียนที่ 1/2569]\\nโรงเรียนฝันใหม่เริ่มสอบวันที่ 5 พ.ย. 2569\\nนักเรียนสามารถตรวจสอบตารางสอบและห้องสอบได้ในระบบ School MIS';
      simulateLinePush(msg);
    }

    function printExamSchedule(type) {
      initExtendedState();
      const list = state.ext.examSchedules || [];
      let rows = list.map((item, i) => \`
        <tr>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${i+1}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.date}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.period}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.classroom}</td>
          <td style="padding:6px; border:1px solid #999; font-weight:bold;">\${item.subjectName} (\${item.subjectCode})</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.room}</td>
          <td style="padding:6px; border:1px solid #999;">\${type === 'student' ? '-' : (item.proctor1 + (item.proctor2 ? ', ' + item.proctor2 : ''))}</td>
        </tr>
      \`).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">\${type === 'student' ? 'ตารางสอบวัดผลกลางภาคเรียน (สำหรับนักเรียน)' : 'ตารางหน้าที่กำกับการสอบวัดผล (สำหรับครูคุมสอบ)'}</h2>
            <p style="font-size:11pt; margin:5px 0 0;">ภาคเรียนที่ 1 ปีการศึกษา 2569 | โรงเรียนฝันใหม่ สพป.หนองบัวลำภู เขต 1</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10.5pt;">
            <thead>
              <tr style="background:#f2f2f2; text-align:center;">
                <th style="padding:6px; border:1px solid #999; width:35px;">ที่</th>
                <th style="padding:6px; border:1px solid #999; width:90px;">วันที่สอบ</th>
                <th style="padding:6px; border:1px solid #999; width:130px;">คาบ / เวลาสอบ</th>
                <th style="padding:6px; border:1px solid #999; width:75px;">ระดับชั้น</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;">วิชาที่สอบ</th>
                <th style="padding:6px; border:1px solid #999; width:80px;">ห้องสอบ</th>
                <th style="padding:6px; border:1px solid #999; width:160px;">\${type === 'student' ? 'หมายเหตุ' : 'ครูคุมสอบ'}</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>
        </div>
      \`;
      printDocument(html, \`ตารางสอบ_\${type}.pdf\`, 'landscape');
    }

    // -------------------------------------------------------------------------
    // 12. GUIDANCE & BEHAVIOR MERIT/DEMERIT (ข้อ 12)
    // -------------------------------------------------------------------------
    function renderBehaviorTable() {
      initExtendedState();
      const tbody = document.getElementById('behaviorTableBody');
      if (!tbody) return;

      const students = state.ext.dmcStudents || [];
      const records = state.ext.behaviorRecords || [];

      tbody.innerHTML = students.map((s, idx) => {
        const stuLogs = records.filter(r => r.studentId === s.studentId);
        let score = 100;
        stuLogs.forEach(l => { score += l.score; });
        score = Math.max(0, Math.min(100, score));

        let badge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">🟢 ยอดเยี่ยม (ปกติ)</span>';
        if (score < 60) badge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">🔴 ต้องตักเตือน / แจ้ง ผปค.</span>';
        else if (score < 80) badge = '<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">🟡 เฝ้าระวังพฤติกรรม</span>';

        const lastLog = stuLogs[stuLogs.length - 1];
        const lastDesc = lastLog ? \`\${lastLog.category} (\${lastLog.score > 0 ? '+' : ''}\${lastLog.score})\` : '-';

        return \`
          <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="p-3 text-center font-bold text-slate-700">\${s.number || (idx + 1)}</td>
            <td class="p-3 font-mono font-bold text-blue-700">\${s.studentId}</td>
            <td class="p-3 font-bold text-slate-900">\${s.title}\${s.firstName} \${s.lastName}</td>
            <td class="p-3 text-center font-black text-sm \${score < 60 ? 'text-rose-600' : 'text-slate-800'}">\${score}</td>
            <td class="p-3">\${badge}</td>
            <td class="p-3 text-xs text-slate-600">\${lastDesc}</td>
            <td class="p-3 text-right">
              <button onclick="openModalAddBehaviorRecord('demerit', '\${s.studentId}')" title="ตัดคะแนน" class="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold mr-1">
                - ตัด
              </button>
              <button onclick="openModalAddBehaviorRecord('merit', '\${s.studentId}')" title="บวกคะแนนความดี" class="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold">
                + เพิ่ม
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function openModalAddBehaviorRecord(type = 'demerit', defaultStuId = null) {
      document.getElementById('formBehaviorRecord').reset();
      document.getElementById('behType').value = type;
      document.getElementById('behDate').value = new Date().toISOString().split('T')[0];
      populateStudentSelect('behStudentSelect', defaultStuId);

      const titleEl = document.getElementById('modalBehaviorTitle');
      const scoreLabel = document.getElementById('behScoreLabel');
      const btnSave = document.getElementById('btnSaveBehavior');

      if (type === 'demerit') {
        titleEl.innerHTML = '<i data-lucide="minus-circle" class="w-5 h-5 text-rose-600"></i> บันทึกตัดคะแนนความประพฤติ (ทำผิดระเบียบ)';
        scoreLabel.textContent = 'คะแนนที่ตัด (แต้ม) *';
        document.getElementById('behScore').value = 5;
        btnSave.className = 'flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 font-bold rounded-xl';
        btnSave.textContent = 'บันทึกการตัดคะแนน';
      } else {
        titleEl.innerHTML = '<i data-lucide="plus-circle" class="w-5 h-5 text-emerald-600"></i> บันทึกเพิ่มคะแนนความดี (Merit)';
        scoreLabel.textContent = 'คะแนนที่เพิ่ม (แต้ม) *';
        document.getElementById('behScore').value = 5;
        btnSave.className = 'flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 font-bold rounded-xl';
        btnSave.textContent = 'บันทึกการเพิ่มคะแนนความดี';
      }
      openModal('modalAddBehaviorRecord');
      if (window.lucide) lucide.createIcons();
    }

    function handleSaveBehaviorRecord(e) {
      e.preventDefault();
      initExtendedState();
      const type = document.getElementById('behType').value;
      const stuId = document.getElementById('behStudentSelect').value;
      const stuObj = state.ext.dmcStudents.find(x => x.studentId === stuId) || { name: 'นักเรียน' };
      const rawScore = parseInt(document.getElementById('behScore').value) || 5;
      const score = (type === 'demerit') ? -Math.abs(rawScore) : Math.abs(rawScore);

      state.ext.behaviorRecords.push({
        id: 'BEH' + String(Date.now()).slice(-4),
        studentId: stuId,
        name: stuObj.title ? (stuObj.title + stuObj.firstName + ' ' + stuObj.lastName) : stuObj.name,
        class: stuObj.classroom || 'ม.1/1',
        date: document.getElementById('behDate').value,
        type,
        category: document.getElementById('behCategory').value.trim(),
        score,
        recordedBy: 'ครูผู้บันทึก',
        remark: document.getElementById('behRemark').value.trim()
      });

      saveExtendedState();
      closeModal('modalAddBehaviorRecord');
      renderBehaviorTable();
      showToast(\`บันทึก\${type === 'demerit' ? 'ตัดคะแนน' : 'เพิ่มคะแนนความดี'} \${Math.abs(score)} แต้ม เรียบร้อย\`);
    }

    function printBehaviorSummaryReport() {
      initExtendedState();
      const students = state.ext.dmcStudents || [];
      const records = state.ext.behaviorRecords || [];

      let rows = students.map((s, idx) => {
        let score = 100;
        records.filter(r => r.studentId === s.studentId).forEach(l => { score += l.score; });
        score = Math.max(0, Math.min(100, score));
        return \`
          <tr>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${s.number || (idx+1)}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${s.studentId}</td>
            <td style="padding:6px; border:1px solid #999; font-weight:bold;">\${s.title}\${s.firstName} \${s.lastName}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${s.classroom}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999; font-weight:bold; \${score < 60 ? 'color:#b91c1c;' : ''}">\${score} / 100</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${score >= 80 ? 'ดีเยี่ยม' : score >= 60 ? 'ผ่านเกณฑ์' : 'ต้องปรับปรุง'}</td>
          </tr>
        \`;
      }).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">รายงานสรุปคะแนนความประพฤตินักเรียน (เต็ม 100 คะแนน)</h2>
            <p style="font-size:11pt; margin:5px 0 0;">งานแนะแนวและฝ่ายกิจการนักเรียน | โรงเรียนฝันใหม่ สพป.หนองบัวลำภู เขต 1</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10.5pt;">
            <thead>
              <tr style="background:#f2f2f2; text-align:center;">
                <th style="padding:6px; border:1px solid #999; width:35px;">เลขที่</th>
                <th style="padding:6px; border:1px solid #999; width:85px;">รหัสนักเรียน</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;">ชื่อ - นามสกุล</th>
                <th style="padding:6px; border:1px solid #999; width:75px;">ชั้นเรียน</th>
                <th style="padding:6px; border:1px solid #999; width:110px;">คะแนนคงเหลือ</th>
                <th style="padding:6px; border:1px solid #999; width:110px;">สถานะการประเมิน</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>
        </div>
      \`;
      printDocument(html, 'รายงานคะแนนความประพฤติ.pdf', 'portrait');
    }

    // -------------------------------------------------------------------------
    // 13. COMPREHENSIVE PHOR PHOR 5 (ปพ.5) (ข้อ 13)
    // -------------------------------------------------------------------------
    function renderPp5Table() {
      initExtendedState();
      const tbody = document.getElementById('pp5TableBody');
      if (!tbody) return;
      const list = state.ext.pp5Scores || [];

      tbody.innerHTML = list.map(item => {
        const attPercent = Math.round((item.attendedPeriods / item.totalPeriods) * 100);
        let gradeBadge = 'bg-blue-100 text-blue-800';
        if (item.grade === '0') gradeBadge = 'bg-rose-100 text-rose-800';
        else if (item.grade === '4') gradeBadge = 'bg-emerald-100 text-emerald-800';

        return \`
          <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-center">
            <td class="p-3 font-bold text-slate-700 border-r border-slate-100">\${item.number}</td>
            <td class="p-3 text-left font-bold text-slate-900 border-r border-slate-100">\${item.name}</td>
            <td class="p-3 border-r border-slate-100">
              <div class="font-bold text-slate-800">\${item.attendedPeriods}/\${item.totalPeriods}</div>
              <div class="text-[10px] font-bold \${attPercent < 80 ? 'text-rose-600' : 'text-emerald-600'}">\${attPercent}%</div>
            </td>
            <td class="p-3 font-semibold border-r border-slate-100">\${item.collectedScore}</td>
            <td class="p-3 font-semibold border-r border-slate-100">\${item.midtermScore}</td>
            <td class="p-3 font-semibold border-r border-slate-100">\${item.finalScore}</td>
            <td class="p-3 font-black text-slate-900 bg-blue-50/50 border-r border-slate-100">\${item.totalScore}</td>
            <td class="p-3 font-black border-r border-slate-100">
              <span class="px-2 py-0.5 rounded text-xs font-black \${gradeBadge}">\${item.grade}</span>
            </td>
            <td class="p-3 font-bold text-slate-700 border-r border-slate-100">\${item.traitsAverage === 3 ? 'ดีเยี่ยม (3)' : item.traitsAverage === 2 ? 'ดี (2)' : 'ผ่าน (1)'}</td>
            <td class="p-3 font-bold text-slate-700 border-r border-slate-100">\${item.readingThinkingWriting === 3 ? 'ดีเยี่ยม (3)' : 'ดี (2)'}</td>
            <td class="p-3 text-right">
              <button onclick="openModalAddPp5Score('\${item.studentId}')" title="แก้ไขคะแนน ปพ.5" class="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              </button>
            </td>
          </tr>
        \`;
      }).join('');
      if (window.lucide) lucide.createIcons();
    }

    function openModalAddPp5Score(defaultStuId = null) {
      document.getElementById('formPp5Score').reset();
      populateStudentSelect('pp5StudentSelect', defaultStuId);
      if (defaultStuId) {
        initExtendedState();
        const scoreObj = state.ext.pp5Scores.find(x => x.studentId === defaultStuId);
        if (scoreObj) {
          document.getElementById('pp5EditStudentId').value = scoreObj.studentId;
          document.getElementById('pp5ScoreCollected').value = scoreObj.collectedScore;
          document.getElementById('pp5ScoreMidterm').value = scoreObj.midtermScore;
          document.getElementById('pp5ScoreFinal').value = scoreObj.finalScore;
          document.getElementById('pp5ScoreTraits').value = scoreObj.traitsAverage;
          document.getElementById('pp5ScoreReading').value = scoreObj.readingThinkingWriting;
        }
      }
      openModal('modalAddPp5Score');
    }

    function handleSavePp5Score(e) {
      e.preventDefault();
      initExtendedState();
      const stuId = document.getElementById('pp5StudentSelect').value;
      const collected = parseFloat(document.getElementById('pp5ScoreCollected').value) || 0;
      const midterm = parseFloat(document.getElementById('pp5ScoreMidterm').value) || 0;
      const final = parseFloat(document.getElementById('pp5ScoreFinal').value) || 0;
      const traits = parseInt(document.getElementById('pp5ScoreTraits').value) || 3;
      const reading = parseInt(document.getElementById('pp5ScoreReading').value) || 3;

      const total = collected + midterm + final;
      let grade = '0';
      if (total >= 80) grade = '4';
      else if (total >= 75) grade = '3.5';
      else if (total >= 70) grade = '3';
      else if (total >= 65) grade = '2.5';
      else if (total >= 60) grade = '2';
      else if (total >= 55) grade = '1.5';
      else if (total >= 50) grade = '1';
      else grade = '0';

      const stuObj = state.ext.dmcStudents.find(x => x.studentId === stuId) || { name: 'นักเรียน' };

      const existingIdx = state.ext.pp5Scores.findIndex(x => x.studentId === stuId);
      const scoreRecord = {
        studentId: stuId,
        name: stuObj.title ? (stuObj.title + stuObj.firstName + ' ' + stuObj.lastName) : stuObj.name,
        number: stuObj.number || 1,
        classroom: stuObj.classroom || 'ม.1/1',
        subjectCode: 'ท21101',
        subjectName: 'ภาษาไทย 1',
        totalPeriods: 40,
        attendedPeriods: 39,
        collectedScore: collected,
        midtermScore: midterm,
        finalScore: final,
        totalScore: total,
        grade,
        desirableTraits: [traits, traits, traits, traits, traits, traits, traits, traits],
        traitsAverage: traits,
        readingThinkingWriting: reading
      };

      if (existingIdx !== -1) {
        state.ext.pp5Scores[existingIdx] = scoreRecord;
      } else {
        state.ext.pp5Scores.push(scoreRecord);
      }

      saveExtendedState();
      closeModal('modalAddPp5Score');
      renderPp5Table();
      showToast('บันทึกคะแนนและตัดเกรด ปพ.5 สำเร็จ');
    }

    function printPp5Report() {
      initExtendedState();
      const list = state.ext.pp5Scores || [];
      let rows = list.map(item => {
        const attP = Math.round((item.attendedPeriods / item.totalPeriods) * 100);
        return \`
          <tr>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.number}</td>
            <td style="padding:6px; border:1px solid #999; font-weight:bold;">\${item.name}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.attendedPeriods}/\${item.totalPeriods} (\${attP}%)</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.collectedScore}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.midtermScore}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.finalScore}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999; font-weight:bold;">\${item.totalScore}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999; font-weight:black; font-size:11pt;">\${item.grade}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.traitsAverage === 3 ? 'ดีเยี่ยม' : 'ดี'}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.readingThinkingWriting === 3 ? 'ดีเยี่ยม' : 'ดี'}</td>
          </tr>
        \`;
      }).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">แบบรายงานผลการพัฒนาคุณภาพผู้เรียน (ปพ.5)</h2>
            <h3 style="font-size:12pt; margin:4px 0 0; font-weight:normal;">รายวิชา ท21101 ภาษาไทย 1 | ชั้นมัธยมศึกษาปีที่ 1/1 ภาคเรียนที่ 1/2569</h3>
            <p style="font-size:10pt; margin:2px 0 0; color:#555;">โรงเรียนฝันใหม่ สพป.หนองบัวลำภู เขต 1</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10pt;">
            <thead>
              <tr style="background:#f2f2f2; text-align:center;">
                <th style="padding:6px; border:1px solid #999; width:35px;" rowspan="2">เลขที่</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;" rowspan="2">ชื่อ - นามสกุล</th>
                <th style="padding:6px; border:1px solid #999; width:95px;" rowspan="2">เวลาเรียน (คาบ/%)</th>
                <th style="padding:4px; border:1px solid #999;" colspan="3">คะแนนการประเมิน</th>
                <th style="padding:6px; border:1px solid #999; width:55px;" rowspan="2">รวม (100)</th>
                <th style="padding:6px; border:1px solid #999; width:55px;" rowspan="2">เกรด</th>
                <th style="padding:6px; border:1px solid #999; width:80px;" rowspan="2">คุณลักษณะ (8)</th>
                <th style="padding:6px; border:1px solid #999; width:80px;" rowspan="2">อ่าน คิด เขียน</th>
              </tr>
              <tr style="background:#f9f9f9; text-align:center; font-size:9pt;">
                <th style="padding:4px; border:1px solid #999; width:60px;">เก็บ (50)</th>
                <th style="padding:4px; border:1px solid #999; width:60px;">กลางภาค (20)</th>
                <th style="padding:4px; border:1px solid #999; width:60px;">ปลายภาค (30)</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>
          <div style="margin-top:35px; display:flex; justify-content:space-between; text-align:center; font-size:11pt;">
            <div>
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(ครูสมใจ สดใส)</p>
              <p>ครูผู้สอนประจำวิชา</p>
            </div>
            <div>
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(นายอรรถพล ฉาไธสง)</p>
              <p>ผู้อำนวยการโรงเรียนฝันใหม่</p>
            </div>
          </div>
        </div>
      \`;
      printDocument(html, 'แบบรายงาน_ปพ5_ภาษาไทย1.pdf', 'portrait');
    }

    // -------------------------------------------------------------------------
    // 14. ONLINE REMEDIAL WORKFLOW (ข้อ 14)
    // -------------------------------------------------------------------------
    function renderRemedialTable() {
      initExtendedState();
      const tbody = document.getElementById('remedialTableBody');
      if (!tbody) return;
      const list = state.ext.remedialRequests || [];

      tbody.innerHTML = list.map(r => {
        let statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">รอมอบหมายงาน</span>';
        if (r.status === 'working') statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">กำลังทำภาระงาน</span>';
        else if (r.status === 'teacher_passed') statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">ครูตรวจผ่านแล้ว</span>';
        else if (r.status === 'admin_approved') statusBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">แอดมินอนุมัติแล้ว</span>';

        return \`
          <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="p-3 font-mono font-bold text-slate-700">\${r.id}</td>
            <td class="p-3 font-bold text-slate-900">\${r.name} (\${r.classroom})</td>
            <td class="p-3 font-semibold text-slate-800">\${r.courseName} (\${r.courseCode})</td>
            <td class="p-3 text-center font-bold text-rose-600">\${r.originalGrade}</td>
            <td class="p-3 text-xs text-slate-600 max-w-[200px] truncate">\${r.assignedTask || 'ยังไม่ได้มอบหมาย'}</td>
            <td class="p-3 text-slate-700">\${r.teacherName}</td>
            <td class="p-3 text-center">
              <button onclick="toggleRemedialTeacherPass('\${r.id}')" class="px-2 py-1 rounded text-xs font-bold \${r.teacherChecked ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 border'}">
                \${r.teacherChecked ? '✓ ส่งงานแล้ว' : 'ยังไม่ส่ง'}
              </button>
            </td>
            <td class="p-3 text-center">
              <span class="\${r.adminApproved ? 'text-purple-700 font-bold' : 'text-slate-400'}">
                \${r.adminApproved ? '✓ ปรับเกรด 1' : 'รออนุมัติ'}
              </span>
            </td>
            <td class="p-3 text-center">\${statusBadge}</td>
            <td class="p-3 text-right">
              \${!r.adminApproved ? \`
                <button onclick="approveRemedialGrade('\${r.id}')" class="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm">
                  อนุมัติเปลี่ยนเกรด
                </button>
              \` : '<span class="text-xs text-emerald-600 font-bold">เสร็จสิ้น</span>'}
            </td>
          </tr>
        \`;
      }).join('');
    }

    function openModalSubmitRemedialRequest() {
      document.getElementById('formRemedialRequest').reset();
      populateStudentSelect('remStudentSelect');
      openModal('modalRemedialRequest');
    }

    function handleSaveRemedialRequest(e) {
      e.preventDefault();
      initExtendedState();
      const stuId = document.getElementById('remStudentSelect').value;
      const stuObj = state.ext.dmcStudents.find(x => x.studentId === stuId) || { name: 'นักเรียน' };

      const newReq = {
        id: 'REM' + String(Date.now()).slice(-4),
        studentId: stuId,
        name: stuObj.title ? (stuObj.title + stuObj.firstName + ' ' + stuObj.lastName) : stuObj.name,
        classroom: stuObj.classroom || 'ม.1/1',
        courseCode: 'ท21101',
        courseName: document.getElementById('remSubject').value.trim(),
        originalGrade: document.getElementById('remGradeOriginal').value,
        teacherName: document.getElementById('remTeacher').value.trim(),
        requestDate: new Date().toISOString().split('T')[0],
        assignedTask: document.getElementById('remAssignedTask').value.trim(),
        taskDueDate: '-',
        teacherChecked: false,
        adminApproved: false,
        newGrade: '1',
        status: 'working',
        resolvedDate: '-'
      };

      state.ext.remedialRequests.unshift(newReq);
      saveExtendedState();
      closeModal('modalRemedialRequest');
      renderRemedialTable();
      showToast('นักเรียนยื่นคำร้องแก้ตัวออนไลน์สำเร็จ');
    }

    function toggleRemedialTeacherPass(id) {
      initExtendedState();
      const r = state.ext.remedialRequests.find(x => x.id === id);
      if (r) {
        r.teacherChecked = !r.teacherChecked;
        if (r.teacherChecked) r.status = 'teacher_passed';
        else r.status = 'working';
        saveExtendedState();
        renderRemedialTable();
        showToast(r.teacherChecked ? 'ครูประจำวิชาบันทึก: ส่งงานแล้ว' : 'ยกเลิกการส่งงาน');
      }
    }

    function approveRemedialGrade(id) {
      initExtendedState();
      const r = state.ext.remedialRequests.find(x => x.id === id);
      if (r) {
        if (!r.teacherChecked) {
          if (!confirm('ครูประจำวิชายังไม่ได้ติ๊กส่งงาน คุณต้องการอนุมัติเปลี่ยนเกรดทันทีใช่หรือไม่?')) return;
        }
        r.adminApproved = true;
        r.status = 'admin_approved';
        r.resolvedDate = new Date().toISOString().split('T')[0];
        saveExtendedState();
        renderRemedialTable();
        showToast('แอดมินอนุมัติเปลี่ยนเกรดเป็น ' + r.newGrade + ' เรียบร้อยแล้ว');
      }
    }

    function printRemedialSummary() {
      initExtendedState();
      const list = state.ext.remedialRequests || [];
      let rows = list.map((r, i) => \`
        <tr>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${i+1}</td>
          <td style="padding:6px; border:1px solid #999; font-weight:bold;">\${r.name}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.classroom}</td>
          <td style="padding:6px; border:1px solid #999;">\${r.courseName} (\${r.courseCode})</td>
          <td style="text-align:center; padding:6px; border:1px solid #999; color:#b91c1c; font-weight:bold;">\${r.originalGrade}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999; color:#047857; font-weight:bold;">\${r.adminApproved ? r.newGrade : '-'}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.teacherName}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.adminApproved ? 'อนุมัติแล้ว' : 'อยู่ระหว่างแก้'}</td>
        </tr>
      \`).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">บัญชีรายชื่อนักเรียนที่ขอแก้ผลการเรียน (0, ร, มส)</h2>
            <p style="font-size:11pt; margin:5px 0 0;">กลุ่มบริหารงานวิชาการ | โรงเรียนฝันใหม่ สพป.หนองบัวลำภู เขต 1</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10.5pt;">
            <thead>
              <tr style="background:#f2f2f2; text-align:center;">
                <th style="padding:6px; border:1px solid #999; width:35px;">ที่</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;">ชื่อ - นามสกุล</th>
                <th style="padding:6px; border:1px solid #999; width:65px;">ชั้น</th>
                <th style="padding:6px; border:1px solid #999;">รายวิชา</th>
                <th style="padding:6px; border:1px solid #999; width:65px;">เกรดเดิม</th>
                <th style="padding:6px; border:1px solid #999; width:65px;">เกรดใหม่</th>
                <th style="padding:6px; border:1px solid #999;">ครูประจำวิชา</th>
                <th style="padding:6px; border:1px solid #999; width:95px;">สถานะ</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>
        </div>
      \`;
      printDocument(html, 'บัญชีแก้ผลการเรียน_0_ร_มส.pdf', 'portrait');
    }

    // -------------------------------------------------------------------------
    // 15. IEP & 9 DISABILITY TYPES (ข้อ 15)
    // -------------------------------------------------------------------------
    function renderIepTable() {
      initExtendedState();
      const tbody = document.getElementById('iepStudentsTableBody');
      if (!tbody) return;
      const list = state.ext.iepStudents || [];

      tbody.innerHTML = list.map(item => \`
        <tr class="hover:bg-slate-50 transition border-b border-slate-100">
          <td class="p-3 font-mono font-bold text-violet-700">\${item.studentId}</td>
          <td class="p-3 font-bold text-slate-900">\${item.name}</td>
          <td class="p-3 text-slate-700 font-semibold">\${item.classroom}</td>
          <td class="p-3 text-xs text-violet-900 font-bold">\${item.disabilityType}</td>
          <td class="p-3 text-xs text-slate-600">\${item.specialNeed}</td>
          <td class="p-3 text-slate-800">\${item.advisor}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              \${item.iepStatus}
            </span>
          </td>
          <td class="p-3 text-center font-bold text-slate-700">\${item.evalResult}</td>
          <td class="p-3 text-right">
            <button onclick="printSingleIepPlan('\${item.id}')" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1">
              <i data-lucide="printer" class="w-3 h-3 text-violet-300"></i> แผน IEP
            </button>
          </td>
        </tr>
      \`).join('');
      if (window.lucide) lucide.createIcons();
    }

    function openModalAddIepStudent() {
      document.getElementById('formAddIepStudent').reset();
      populateStudentSelect('iepStudentSelect');
      openModal('modalAddIepStudent');
    }

    function handleSaveIepStudent(e) {
      e.preventDefault();
      initExtendedState();
      const stuId = document.getElementById('iepStudentSelect').value;
      const stuObj = state.ext.dmcStudents.find(x => x.studentId === stuId) || { name: 'นักเรียน' };

      const newIep = {
        id: 'IEP' + String(Date.now()).slice(-4),
        studentId: stuId,
        name: stuObj.title ? (stuObj.title + stuObj.firstName + ' ' + stuObj.lastName) : stuObj.name,
        classroom: stuObj.classroom || 'ม.1/1',
        disabilityType: document.getElementById('iepDisabilitySelect').value,
        specialNeed: document.getElementById('iepSpecialNeed').value.trim() || 'การดูแลพิเศษรายบุคคล',
        advisor: document.getElementById('iepAdvisor').value.trim() || 'ครูประจำชั้น',
        iepStatus: 'มีแผน IEP พร้อมดำเนินการ',
        evalResult: 'กำลังพัฒนาตามแผน',
        iepFileUrl: '#'
      };

      state.ext.iepStudents.unshift(newIep);
      saveExtendedState();
      closeModal('modalAddIepStudent');
      renderIepTable();
      showToast('บันทึกข้อมูลนักเรียนเรียนรวมและแผน IEP สำเร็จ');
    }

    function printSingleIepPlan(iepId) {
      initExtendedState();
      const item = state.ext.iepStudents.find(x => x.id === iepId);
      if (!item) return;

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000; line-height:1.6;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">แผนการจัดการศึกษาเฉพาะบุคคล (Individualized Education Program: IEP)</h2>
            <h3 style="font-size:12pt; margin:4px 0 0; font-weight:normal;">สำหรับนักเรียนพิการเรียนรวมตามเกณฑ์ สพฐ. 9 ประเภทความบกพร่อง</h3>
            <p style="font-size:10pt; color:#555; margin:2px 0 0;">โรงเรียนฝันใหม่ สพป.หนองบัวลำภู เขต 1</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:11pt; margin-bottom:15px;">
            <tr>
              <td style="padding:6px; width:55%;"><strong>ชื่อนักเรียน:</strong> \${item.name}</td>
              <td style="padding:6px;"><strong>ชั้นเรียน:</strong> \${item.classroom}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:6px;"><strong>ประเภทความบกพร่อง:</strong> \${item.disabilityType}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:6px;"><strong>ความต้องการจำเป็นพิเศษ:</strong> \${item.specialNeed}</td>
            </tr>
            <tr>
              <td style="padding:6px;"><strong>ครูผู้รับผิดชอบแผน:</strong> \${item.advisor}</td>
              <td style="padding:6px;"><strong>สถานะการประเมิน:</strong> \${item.evalResult}</td>
            </tr>
          </table>
          <div style="border:1px solid #ccc; padding:12px; border-radius:8px; font-size:11pt; margin-bottom:20px;">
            <h4 style="margin:0 0 8px; font-weight:bold;">แนวทางการจัดการเรียนรู้และสิ่งอำนวยความสะดวก:</h4>
            <p style="margin:0 0 6px;">1. ปรับลดภาระงานและเพิ่มเวลาในการทำแบบฝึกหัดและการสอบ</p>
            <p style="margin:0 0 6px;">2. จัดหาสื่อเทคโนโลยีดิจิทัลช่วยสอนตามความบกพร่องเฉพาะบุคคล</p>
            <p style="margin:0;">3. ประสานความร่วมมือกับผู้ปกครองในการฝึกทักษะการใช้ชีวิตประจำวัน</p>
          </div>
          <div style="margin-top:40px; display:flex; justify-content:space-between; text-align:center; font-size:11pt;">
            <div>
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(\${item.advisor})</p>
              <p>ครูผู้จัดทำแผน IEP</p>
            </div>
            <div>
              <p>(ลงชื่อ)......................................................</p>
              <p style="font-weight:bold;">(นายอรรถพล ฉาไธสง)</p>
              <p>ผู้อำนวยการโรงเรียนฝันใหม่</p>
            </div>
          </div>
        </div>
      \`;
      printDocument(html, \`แผนIEP_\${item.name}.pdf\`, 'portrait');
    }

    function printIepSummaryReport() {
      initExtendedState();
      const list = state.ext.iepStudents || [];
      let rows = list.map((item, i) => \`
        <tr>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${i+1}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.studentId}</td>
          <td style="padding:6px; border:1px solid #999; font-weight:bold;">\${item.name}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.classroom}</td>
          <td style="padding:6px; border:1px solid #999;">\${item.disabilityType}</td>
          <td style="padding:6px; border:1px solid #999;">\${item.specialNeed}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${item.advisor}</td>
        </tr>
      \`).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">รายงานสรุปข้อมูลนักเรียนเรียนรวมและการจัดการศึกษาพิเศษ (สพฐ.)</h2>
            <p style="font-size:11pt; margin:5px 0 0;">จำแนกตาม 9 ประเภทความบกพร่อง | โรงเรียนฝันใหม่</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10pt;">
            <thead>
              <tr style="background:#f2f2f2; text-align:center;">
                <th style="padding:6px; border:1px solid #999; width:35px;">ที่</th>
                <th style="padding:6px; border:1px solid #999; width:80px;">รหัส นร.</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;">ชื่อ - นามสกุล</th>
                <th style="padding:6px; border:1px solid #999; width:65px;">ชั้น</th>
                <th style="padding:6px; border:1px solid #999;">ประเภทความบกพร่อง</th>
                <th style="padding:6px; border:1px solid #999;">ความต้องการจำเป็น</th>
                <th style="padding:6px; border:1px solid #999; width:120px;">ครูผู้ดูแล</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>
        </div>
      \`;
      printDocument(html, 'สรุปรายงานนักเรียนเรียนรวม_สพฐ.pdf', 'landscape');
    }

    // -------------------------------------------------------------------------
    // 16. STUDENT TRANSFERS & LINE ALERT (ข้อ 16)
    // -------------------------------------------------------------------------
    function renderTransfersTable() {
      initExtendedState();
      const tbody = document.getElementById('transfersTableBody');
      if (!tbody) return;
      const list = state.ext.studentTransfers || [];

      tbody.innerHTML = list.map(t => {
        const isTransferIn = (t.type === 'transfer_in');
        return \`
          <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="p-3 font-semibold text-slate-800">\${t.date}</td>
            <td class="p-3 text-center">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold \${isTransferIn ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}">
                \${isTransferIn ? '🟢 ย้ายเข้า' : '🔴 ย้ายออก'}
              </span>
            </td>
            <td class="p-3 font-mono font-bold text-blue-700">\${t.studentId}</td>
            <td class="p-3 font-bold text-slate-900">\${t.name}</td>
            <td class="p-3 font-semibold text-slate-700">\${t.classroom}</td>
            <td class="p-3 text-xs text-slate-600">\${isTransferIn ? 'จาก: ' + t.fromSchool : 'ไป: ' + t.toSchool}</td>
            <td class="p-3 text-xs text-slate-500">\${t.reason || '-'}</td>
            <td class="p-3 font-mono text-slate-500 text-[11px]">\${t.docNumber || '-'}</td>
            <td class="p-3 text-center text-emerald-600 font-bold text-xs">✓ ส่งแล้ว</td>
            <td class="p-3 text-right">
              <button onclick="resendTransferLineAlert('\${t.id}')" title="ยิงแจ้งเตือน LINE ซ้ำ" class="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition">
                LINE ซ้ำ
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function openModalAddTransfer(type = 'transfer_in') {
      document.getElementById('formStudentTransfer').reset();
      document.getElementById('trfType').value = type;
      document.getElementById('trfDate').value = new Date().toISOString().split('T')[0];
      const titleEl = document.getElementById('modalTransferTitle');
      const schoolLabel = document.getElementById('trfSchoolLabel');
      const schoolInput = document.getElementById('trfSchool');
      const btnSave = document.getElementById('btnSaveTransfer');

      if (type === 'transfer_in') {
        titleEl.innerHTML = '<i data-lucide="user-plus" class="w-5 h-5 text-emerald-600"></i> บันทึกนักเรียนย้ายเข้า';
        schoolLabel.textContent = 'โรงเรียนเดิมที่ย้ายมา *';
        schoolInput.placeholder = 'เช่น โรงเรียนบ้านหนองบัวใหญ่';
        btnSave.className = 'flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 font-bold rounded-xl';
        btnSave.textContent = 'บันทึกรับย้ายเข้า';
      } else {
        titleEl.innerHTML = '<i data-lucide="user-minus" class="w-5 h-5 text-rose-600"></i> บันทึกนักเรียนย้ายออก (จำหน่าย)';
        schoolLabel.textContent = 'โรงเรียนปลายทางที่ย้ายไป *';
        schoolInput.placeholder = 'เช่น โรงเรียนอนุบาลขอนแก่น';
        btnSave.className = 'flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 font-bold rounded-xl';
        btnSave.textContent = 'บันทึกจำหน่ายย้ายออก';
      }
      openModal('modalAddTransfer');
      if (window.lucide) lucide.createIcons();
    }

    function handleSaveStudentTransfer(e) {
      e.preventDefault();
      initExtendedState();
      const type = document.getElementById('trfType').value;
      const name = document.getElementById('trfName').value.trim();
      const cls = document.getElementById('trfClass').value.trim();
      const date = document.getElementById('trfDate').value;
      const school = document.getElementById('trfSchool').value.trim();
      const reason = document.getElementById('trfReason').value.trim();
      const docNo = document.getElementById('trfDocNo').value.trim();
      const sendLine = document.getElementById('trfSendLine').checked;

      const newId = 'TRF' + String(Date.now()).slice(-4);
      const stuId = 'S' + String(Date.now()).slice(-4);

      const record = {
        id: newId,
        type,
        date,
        studentId: stuId,
        name,
        classroom: cls,
        fromSchool: (type === 'transfer_in') ? school : 'โรงเรียนฝันใหม่',
        toSchool: (type === 'transfer_in') ? 'โรงเรียนฝันใหม่' : school,
        reason,
        docNumber: docNo,
        lineAlertSent: sendLine
      };

      state.ext.studentTransfers.unshift(record);
      saveExtendedState();
      closeModal('modalAddTransfer');
      renderTransfersTable();
      showToast(\`บันทึกนักเรียน\${type === 'transfer_in' ? 'ย้ายเข้า' : 'ย้ายออก'} สำเร็จ\`);

      if (sendLine) {
        resendTransferLineAlert(newId);
      }
    }

    function resendTransferLineAlert(trfId) {
      initExtendedState();
      const t = state.ext.studentTransfers.find(x => x.id === trfId);
      if (!t) return;
      const isTransferIn = (t.type === 'transfer_in');
      const msg = \`📢 [แจ้งเตือนงานทะเบียนนักเรียน]\n\${isTransferIn ? '🟢 นักเรียนย้ายเข้าใหม่' : '🔴 นักเรียนย้ายออก (จำหน่าย)'}: \${t.name} (ชั้น \${t.classroom})\n\${isTransferIn ? '🏫 ย้ายมาจาก: ' + t.fromSchool : '🏫 ย้ายไปยัง: ' + t.toSchool}\n📅 วันที่: \${t.date}\n📄 หนังสือส่งตัว: \${t.docNumber || '-'}\`;
      simulateLinePush(msg);
    }

    function printTransfersReport() {
      initExtendedState();
      const list = state.ext.studentTransfers || [];
      let rows = list.map((t, i) => \`
        <tr>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${i+1}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${t.date}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999; font-weight:bold;">\${t.type === 'transfer_in' ? 'ย้ายเข้า' : 'ย้ายออก'}</td>
          <td style="padding:6px; border:1px solid #999; font-weight:bold;">\${t.name}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${t.classroom}</td>
          <td style="padding:6px; border:1px solid #999;">\${t.type === 'transfer_in' ? t.fromSchool : t.toSchool}</td>
          <td style="padding:6px; border:1px solid #999;">\${t.reason || '-'}</td>
          <td style="text-align:center; padding:6px; border:1px solid #999;">\${t.docNumber || '-'}</td>
        </tr>
      \`).join('');

      const html = \`
        <div style="font-family:'Sarabun', sans-serif; padding:15px; color:#000;">
          <div style="text-align:center; margin-bottom:15px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold;">ทะเบียนประวัตินักเรียนย้ายเข้า - ย้ายออก</h2>
            <p style="font-size:11pt; margin:5px 0 0;">งานทะเบียนนักเรียน | โรงเรียนฝันใหม่ สพป.หนองบัวลำภู เขต 1</p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10.5pt;">
            <thead>
              <tr style="background:#f2f2f2; text-align:center;">
                <th style="padding:6px; border:1px solid #999; width:35px;">ที่</th>
                <th style="padding:6px; border:1px solid #999; width:90px;">วันที่</th>
                <th style="padding:6px; border:1px solid #999; width:75px;">ประเภท</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;">ชื่อ - นามสกุล</th>
                <th style="padding:6px; border:1px solid #999; width:65px;">ชั้น</th>
                <th style="padding:6px; border:1px solid #999;">สถานศึกษาเดิม / ปลายทาง</th>
                <th style="padding:6px; border:1px solid #999;">สาเหตุการย้าย</th>
                <th style="padding:6px; border:1px solid #999; width:110px;">เลขที่หนังสือ</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>
        </div>
      \`;
      printDocument(html, 'ทะเบียนนักเรียนย้ายเข้า_ย้ายออก.pdf', 'landscape');
    }

    // -------------------------------------------------------------------------
    // MASTER TAB RENDERER HOOK
    // -------------------------------------------------------------------------
    function initExtendedTabRenderers() {
      initExtendedState();
      // Hook into tab renderers
      renderPp5Table();
      renderRemedialTable();
      renderExamScheduleTable();
      renderResearchCards();
      renderDownloadsGrid();
      renderAcademicCalendarList();
      renderDailyAttendanceTable();
      renderHomeVisitsGrid();
      renderBehaviorTable();
      renderBmiTable();
      renderSavingsTable();
      renderClubsGrid();
      renderScoutsGrid();
      renderDmcStudentsTable();
      renderIepTable();
      renderTransfersTable();
    }
  `;
}

module.exports = { getLogicJs };
