const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Replace modalAddExamPeriod HTML block
const modalStartTarget = '<!-- MODAL: ADD EXAM PERIOD -->';
const modalEndTarget = '<!-- MODAL: SUBMIT RESEARCH (CAR) WITH GOOGLE DRIVE -->';

const idxModalStart = content.indexOf(modalStartTarget);
const idxModalEnd = content.indexOf(modalEndTarget);

if (idxModalStart === -1 || idxModalEnd === -1) {
  console.error('Could not find modalAddExamPeriod boundaries');
  process.exit(1);
}

const newModalHtml = `<!-- MODAL: ADD EXAM PERIOD -->
  <div id="modalAddExamPeriod" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="calendar-range" class="w-5 h-5 text-cyan-600"></i> เพิ่มคาบสอบในตารางสอบ
        </h3>
        <button type="button" onclick="closeModal('modalAddExamPeriod')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formAddExamPeriod" onsubmit="handleSaveExamPeriod(event)" class="space-y-3.5 text-xs">
        <div class="grid grid-cols-2 gap-2.5">
          <div>
            <label class="block font-bold text-slate-700 mb-1">วันที่สอบ *</label>
            <input type="date" id="examDate" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-slate-900">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ระดับชั้น *</label>
            <select id="examClassroom" class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-slate-900">
              <option value="ม.3/1">มัธยมศึกษาปีที่ 3/1</option>
              <option value="ม.2/1">มัธยมศึกษาปีที่ 2/1</option>
              <option value="ม.1/1">มัธยมศึกษาปีที่ 1/1</option>
              <option value="ป.6/1">ประถมศึกษาปีที่ 6/1</option>
              <option value="ป.6/2">ประถมศึกษาปีที่ 6/2</option>
              <option value="ป.5/1">ประถมศึกษาปีที่ 5/1</option>
              <option value="ป.4/1">ประถมศึกษาปีที่ 4/1</option>
              <option value="ป.3/1">ประถมศึกษาปีที่ 3/1</option>
              <option value="ป.2/1">ประถมศึกษาปีที่ 2/1</option>
              <option value="ป.1/1">ประถมศึกษาปีที่ 1/1</option>
              <option value="ป.1/2">ประถมศึกษาปีที่ 1/2</option>
              <option value="อ.3/1">อนุบาล 3/1</option>
              <option value="อ.3/2">อนุบาล 3/2</option>
              <option value="อ.2/1">อนุบาล 2/1</option>
              <option value="อ.2/2">อนุบาล 2/2</option>
            </select>
          </div>
        </div>

        <!-- FREE TIME SELECTOR (กำหนดเวลาสอบได้อย่างอิสระ) -->
        <div class="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-50/90 via-sky-50/70 to-blue-50/90 border-2 border-cyan-200/90 space-y-2.5 shadow-xs">
          <div class="flex items-center justify-between">
            <label class="block font-black text-blue-950 text-xs flex items-center gap-1.5">
              <i data-lucide="clock" class="w-4 h-4 text-cyan-600"></i> กำหนดช่วงเวลาสอบอย่างอิสระ (เริ่ม - สิ้นสุด) *
            </label>
            <span id="examDurationBadge" class="text-[11px] bg-white border border-cyan-300 text-cyan-900 font-black px-2.5 py-0.5 rounded-full shadow-xs">
              ⏱️ 1 ชม. 30 นาที
            </span>
          </div>

          <!-- Free Time Pickers -->
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <span class="text-[11px] font-bold text-slate-600 block mb-1">⏰ เวลาเริ่มสอบ</span>
              <input type="time" id="examStartTime" required value="08:30" onchange="onExamTimeInputChange()" class="w-full px-3 py-2 border border-slate-300 rounded-xl font-black text-sm bg-white text-slate-900 focus:border-cyan-600 outline-none shadow-xs cursor-pointer">
            </div>
            <div>
              <span class="text-[11px] font-bold text-slate-600 block mb-1">🏁 เวลาสิ้นสุด</span>
              <input type="time" id="examEndTime" required value="10:00" onchange="onExamTimeInputChange()" class="w-full px-3 py-2 border border-slate-300 rounded-xl font-black text-sm bg-white text-slate-900 focus:border-cyan-600 outline-none shadow-xs cursor-pointer">
            </div>
          </div>

          <!-- Quick presets pills -->
          <div>
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">หรือคลิกเลือกช่วงเวลายอดนิยมด่วน:</span>
            <div class="flex flex-wrap gap-1.5">
              <button type="button" onclick="setExamTimeRange('08:30', '09:30')" class="px-2 py-0.5 rounded-lg bg-white hover:bg-cyan-100 text-[10px] font-bold text-slate-700 border border-slate-200 transition shadow-xs cursor-pointer">08:30-09:30 (1 ชม.)</button>
              <button type="button" onclick="setExamTimeRange('08:30', '10:00')" class="px-2 py-0.5 rounded-lg bg-white hover:bg-cyan-100 text-[10px] font-bold text-cyan-800 border border-cyan-300 transition shadow-xs cursor-pointer">08:30-10:00 (1.5 ชม.)</button>
              <button type="button" onclick="setExamTimeRange('10:15', '11:45')" class="px-2 py-0.5 rounded-lg bg-white hover:bg-cyan-100 text-[10px] font-bold text-slate-700 border border-slate-200 transition shadow-xs cursor-pointer">10:15-11:45 (1.5 ชม.)</button>
              <button type="button" onclick="setExamTimeRange('13:00', '14:00')" class="px-2 py-0.5 rounded-lg bg-white hover:bg-cyan-100 text-[10px] font-bold text-slate-700 border border-slate-200 transition shadow-xs cursor-pointer">13:00-14:00 (1 ชม.)</button>
              <button type="button" onclick="setExamTimeRange('13:00', '14:30')" class="px-2 py-0.5 rounded-lg bg-white hover:bg-cyan-100 text-[10px] font-bold text-slate-700 border border-slate-200 transition shadow-xs cursor-pointer">13:00-14:30 (1.5 ชม.)</button>
              <button type="button" onclick="setExamTimeRange('14:45', '15:45')" class="px-2 py-0.5 rounded-lg bg-white hover:bg-cyan-100 text-[10px] font-bold text-slate-700 border border-slate-200 transition shadow-xs cursor-pointer">14:45-15:45 (1 ชม.)</button>
            </div>
          </div>

          <!-- Free Custom Label for Period -->
          <div class="pt-1.5 border-t border-cyan-200/80 flex items-center gap-2">
            <span class="text-[10px] font-bold text-cyan-950 shrink-0">ข้อความช่วงเวลา:</span>
            <input type="text" id="examPeriod" required value="08:30 - 10:00 น." placeholder="เช่น 08:30 - 10:00 น." class="flex-1 px-3 py-1.5 text-xs border border-cyan-300 rounded-xl font-bold bg-white text-slate-900 focus:border-cyan-600 outline-none shadow-xs">
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">ห้องสอบ *</label>
            <input type="text" id="examRoom" required placeholder="เช่น ห้อง 111" class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-slate-900">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">รหัสวิชา *</label>
            <input type="text" id="examSubjectCode" required placeholder="เช่น ท21101" class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-slate-900">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ชื่อวิชา *</label>
            <input type="text" id="examSubjectName" required placeholder="เช่น ภาษาไทย 1" class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-slate-900">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">ครูคุมสอบหลัก *</label>
            <input type="text" id="examProctor1" required placeholder="ชื่อครูคุมสอบ 1" class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-slate-900">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ครูคุมสอบร่วม</label>
            <input type="text" id="examProctor2" placeholder="ชื่อครูคุมสอบ 2" class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-slate-900">
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold shadow-md">บันทึกคาบสอบ (ตรวจไม่ชน)</button>
          <button type="button" onclick="closeModal('modalAddExamPeriod')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  `;

content = content.substring(0, idxModalStart) + newModalHtml + content.substring(idxModalEnd);
console.log('1. Replaced modalAddExamPeriod HTML with free time selector.');

// 2. Replace openModalAddExamPeriod and handleSaveExamPeriod functions
const funcStartTarget = 'function openModalAddExamPeriod() {';
const funcEndTarget = 'function deleteExamPeriod(id) {';

const idxFuncStart = content.indexOf(funcStartTarget);
const idxFuncEnd = content.indexOf(funcEndTarget, idxFuncStart);

if (idxFuncStart === -1 || idxFuncEnd === -1) {
  console.error('Could not find exam functions boundaries');
  process.exit(1);
}

const newFunctions = `function openModalAddExamPeriod() {
      document.getElementById('formAddExamPeriod').reset();
      const dateEl = document.getElementById('examDate');
      if (dateEl) dateEl.value = '2026-11-05';
      setExamTimeRange('08:30', '10:00');

      // Populate all school classrooms dynamically if available
      const clsSelect = document.getElementById('examClassroom');
      if (clsSelect && state.classrooms && state.classrooms.length > 0) {
        clsSelect.innerHTML = state.classrooms.map(c => \`<option value="\${c}">\${c.startsWith('ม.') || c.startsWith('ป.') || c.startsWith('อ.') ? ('ชั้น ' + c) : c}</option>\`).join('');
      }

      openModal('modalAddExamPeriod');
      if (window.lucide && typeof lucide.createIcons === 'function') {
        try { lucide.createIcons(); } catch (e) {}
      }
    }

    function setExamTimeRange(start, end) {
      const sInput = document.getElementById('examStartTime');
      const eInput = document.getElementById('examEndTime');
      if (sInput) sInput.value = start;
      if (eInput) eInput.value = end;
      onExamTimeInputChange();
    }

    function onExamTimeInputChange() {
      const sInput = document.getElementById('examStartTime');
      const eInput = document.getElementById('examEndTime');
      const periodInput = document.getElementById('examPeriod');
      const durationBadge = document.getElementById('examDurationBadge');

      const start = sInput ? sInput.value : '08:30';
      const end = eInput ? eInput.value : '10:00';

      if (periodInput) {
        periodInput.value = \`\${start} - \${end} น.\`;
      }

      if (durationBadge && start && end) {
        const [h1, m1] = start.split(':').map(Number);
        const [h2, m2] = end.split(':').map(Number);
        let totalMin = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (totalMin > 0) {
          const hours = Math.floor(totalMin / 60);
          const mins = totalMin % 60;
          let text = '⏱️ ';
          if (hours > 0) text += \`\${hours} ชม. \`;
          if (mins > 0) text += \`\${mins} นาที\`;
          durationBadge.textContent = text.trim();
          durationBadge.className = 'text-[11px] bg-white border border-cyan-300 text-cyan-900 font-black px-2.5 py-0.5 rounded-full shadow-xs';
        } else {
          durationBadge.textContent = '⚠️ เวลาสิ้นสุดต้องหลังเวลาเริ่ม';
          durationBadge.className = 'text-[11px] bg-rose-100 border border-rose-300 text-rose-800 font-black px-2.5 py-0.5 rounded-full shadow-xs';
        }
      }
    }

    function handleSaveExamPeriod(e) {
      e.preventDefault();
      initExtendedState();
      const date = document.getElementById('examDate').value;
      const startTime = document.getElementById('examStartTime')?.value || '';
      const endTime = document.getElementById('examEndTime')?.value || '';
      const period = (document.getElementById('examPeriod')?.value || '').trim() || \`\${startTime} - \${endTime} น.\`;
      const classroom = document.getElementById('examClassroom').value;
      const room = document.getElementById('examRoom').value.trim();
      const subjectCode = document.getElementById('examSubjectCode').value.trim();
      const subjectName = document.getElementById('examSubjectName').value.trim();
      const proctor1 = document.getElementById('examProctor1').value.trim();
      const proctor2 = document.getElementById('examProctor2').value.trim();

      if (startTime && endTime && startTime >= endTime) {
        alert('⚠️ เวลาสอบไม่ถูกต้อง: เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น');
        return;
      }

      // SMART CONFLICT CHECK (Free Time Overlap Check)
      const conflict = state.ext.examSchedules.find(ex => {
        if (ex.date !== date) return false;

        // Check if time ranges overlap
        let isOverlap = false;
        if (startTime && endTime && ex.startTime && ex.endTime) {
          isOverlap = (startTime < ex.endTime && endTime > ex.startTime);
        } else {
          isOverlap = (ex.period === period);
        }
        if (!isOverlap) return false;

        // 1. Same classroom taking 2 exams at the same time
        if (ex.classroom === classroom) return true;
        // 2. Same exam room used twice
        if (ex.room && ex.room.toLowerCase() === room.toLowerCase()) return true;
        // 3. Same proctor in 2 places
        if (ex.proctor1 === proctor1 || (proctor2 && ex.proctor2 === proctor2)) return true;
        return false;
      });

      if (conflict) {
        alert('❌ ตรวจพบความขัดแย้งในตารางสอบ!\n- ห้องสอบ ครูคุมสอบ หรือชั้นเรียนนี้มีตารางสอบซ้อนทับอยู่ในช่วงเวลาเดียวกัน');
        return;
      }

      state.ext.examSchedules.push({
        id: 'EX' + String(Date.now()).slice(-4),
        type: 'midterm',
        term: '1/2569',
        date,
        period,
        startTime,
        endTime,
        classroom,
        subjectCode,
        subjectName,
        room,
        proctor1,
        proctor2
      });

      saveExtendedState();
      closeModal('modalAddExamPeriod');
      renderExamScheduleTable();
      showToast('เพิ่มคาบสอบสำเร็จ (ผ่านการตรวจไม่ชนกัน)');
    }

    `;

content = content.substring(0, idxFuncStart) + newFunctions + content.substring(idxFuncEnd);
console.log('2. Replaced exam functions with free time selection logic.');

fs.writeFileSync('index.html', content, 'utf8');
console.log('Saved index.html successfully!');
