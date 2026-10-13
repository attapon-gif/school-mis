const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

console.log('Step 1: Updating tab-attendance-daily HTML...');

const oldAttendanceHtmlStart = '<section id="tab-attendance-daily" class="tab-content hidden space-y-6">';
const oldAttendanceHtmlEnd = '<!-- ================================================================= -->\n    <!-- MODULE 15: เยี่ยมบ้านนักเรียนออนไลน์';

const startAttIdx = html.indexOf(oldAttendanceHtmlStart);
const endAttIdx = html.indexOf(oldAttendanceHtmlEnd);

if (startAttIdx === -1 || endAttIdx === -1) {
  console.error('ERROR: Attendance HTML anchors not found!');
  process.exit(1);
}

const newAttendanceHtml = `<section id="tab-attendance-daily" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="check-check" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">บันทึกเวลาเข้าแถวหน้าเสาธง & กิจวัตรประจำวัน 4 มิติ</h2>
            <p class="text-xs text-slate-500 mt-0.5">เข้าแถว ➔ ลิงก์เวลาเรียนทุกวิชา + อาหารกลางวัน + ดื่มนม + แปรงฟัน (อนุบาล-ป.6) อัตโนมัติ (แก้ไขปรับลดได้)</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="saveDailyAttendance()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="save" class="w-4 h-4"></i> บันทึกข้อมูลประจำวัน
          </button>
          <button type="button" onclick="printDailyAttendanceReport()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-emerald-400"></i> พิมพ์แบบบันทึกประจำวัน
          </button>
        </div>
      </div>

      <!-- Date & Class Selector + Live Search + Quick Actions -->
      <div class="card-3d p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-1.5">
            <label class="font-bold text-slate-700 whitespace-nowrap"><i data-lucide="calendar" class="w-3.5 h-3.5 inline text-emerald-600"></i> วันที่:</label>
            <input type="date" id="attendanceDateInput" value="2026-10-10" onchange="loadAttendanceForDate()" class="px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-emerald-500">
          </div>
          <div class="flex items-center gap-1.5">
            <label class="font-bold text-slate-700 whitespace-nowrap"><i data-lucide="school" class="w-3.5 h-3.5 inline text-blue-600"></i> ชั้นเรียน:</label>
            <select id="attendanceClassSelect" onchange="loadAttendanceForDate()" class="px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-emerald-500">
              <option value="ป.6/1" selected>ชั้นประถมศึกษาปีที่ 6/1 (19 คน)</option>
              <option value="ป.6/2">ชั้นประถมศึกษาปีที่ 6/2 (19 คน)</option>
              <option value="ป.5/1">ชั้นประถมศึกษาปีที่ 5/1 (35 คน)</option>
              <option value="ป.4/1">ชั้นประถมศึกษาปีที่ 4/1 (32 คน)</option>
              <option value="ป.3/1">ชั้นประถมศึกษาปีที่ 3/1 (34 คน)</option>
              <option value="ป.2/1">ชั้นประถมศึกษาปีที่ 2/1 (33 คน)</option>
              <option value="ป.1/1">ชั้นประถมศึกษาปีที่ 1/1 (23 คน)</option>
              <option value="ป.1/2">ชั้นประถมศึกษาปีที่ 1/2 (23 คน)</option>
              <option value="ม.3/1">ชั้นมัธยมศึกษาปีที่ 3/1 (17 คน)</option>
              <option value="ม.2/1">ชั้นมัธยมศึกษาปีที่ 2/1 (34 คน)</option>
              <option value="ม.1/1">ชั้นมัธยมศึกษาปีที่ 1/1 (22 คน)</option>
              <option value="อ.3/1">ชั้นอนุบาล 3/1 (15 คน)</option>
              <option value="อ.3/2">ชั้นอนุบาล 3/2 (16 คน)</option>
              <option value="อ.2/1">ชั้นอนุบาล 2/1 (12 คน)</option>
              <option value="อ.2/2">ชั้นอนุบาล 2/2 (12 คน)</option>
            </select>
          </div>
          <div class="relative">
            <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"></i>
            <input type="text" id="attendanceSearchInput" oninput="renderDailyAttendanceTable()" placeholder="🔍 ค้นหาชื่อ-สกุล, รหัส หรือเลขที่..." class="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white font-normal shadow-2xs focus:ring-2 focus:ring-emerald-500 w-52 sm:w-60">
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span id="attendanceCountBadge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-xs">
            ⚡ รวม 19 คน (ชั้น ป.6/1)
          </span>
          <button type="button" onclick="quickCheckAllPresent()" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm text-xs">
            <i data-lucide="check-circle-2" class="w-4 h-4"></i> มาครบทุกคน (Check All)
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div class="card-3d p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-800">🟢 มาเรียนปกติ</span>
            <span class="text-base">✅</span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-emerald-950 mt-1" id="statAttPresent">19 คน</div>
          <div class="text-[11px] text-emerald-700 mt-0.5" id="statAttPresentPct">100% ของห้อง</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-amber-800">🟡 มาสาย</span>
            <span class="text-base">⏰</span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-amber-950 mt-1" id="statAttLate">0 คน</div>
          <div class="text-[11px] text-amber-700 mt-0.5">เข้าแถวหลังเวลา</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-sky-50 border border-sky-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-sky-800">🔵 มีใบลา / กิจ / ป่วย</span>
            <span class="text-base">📝</span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-sky-950 mt-1" id="statAttLeave">0 คน</div>
          <div class="text-[11px] text-sky-700 mt-0.5">ลากิจหรือลาป่วย</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-rose-50 border border-rose-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-rose-800">🔴 ขาดเรียน</span>
            <span class="text-base">❌</span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-rose-950 mt-1" id="statAttAbsent">0 คน</div>
          <div class="text-[11px] text-rose-700 mt-0.5">ไม่แจ้งเหตุผล</div>
        </div>
      </div>

      <!-- 4-in-1 Attendance Table -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-900 text-white font-bold text-center">
              <tr>
                <th class="p-3 border-r border-slate-800 w-12" rowspan="2">เลขที่</th>
                <th class="p-3 border-r border-slate-800 text-left min-w-[160px]" rowspan="2">ชื่อ - สกุล</th>
                <th class="p-3 border-r border-slate-800 w-32 bg-blue-950" rowspan="2">1. เข้าแถวหน้าเสาธง</th>
                <th class="p-2 border-b border-r border-slate-800 bg-slate-800" colspan="4">2. กิจวัตรที่เชื่อมโยงอัตโนมัติ (คลิกปรับลด/แก้ไขได้)</th>
                <th class="p-3 w-40" rowspan="2">หมายเหตุ</th>
              </tr>
              <tr class="bg-slate-800 text-[11px]">
                <th class="p-2 border-r border-slate-700 w-24">เวลาเรียนทุกวิชา</th>
                <th class="p-2 border-r border-slate-700 w-24">อาหารกลางวัน</th>
                <th class="p-2 border-r border-slate-700 w-24">ดื่มนมโรงเรียน</th>
                <th class="p-2 border-r border-slate-700 w-24">แปรงฟัน</th>
              </tr>
            </thead>
            <tbody id="dailyAttendanceTableBody" class="divide-y divide-slate-200 bg-white">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    `;

html = html.slice(0, startAttIdx) + newAttendanceHtml + html.slice(endAttIdx);
console.log('Step 1 complete: tab-attendance-daily HTML replaced.');

console.log('Step 2: Updating tab-savings HTML...');
const oldSavHtmlStart = '<section id="tab-savings" class="tab-content hidden space-y-6">';
const oldSavHtmlEnd = '<!-- ================================================================= -->\n    <!-- MODULE 19:';

const startSavIdx = html.indexOf(oldSavHtmlStart);
const endSavIdx = html.indexOf(oldSavHtmlEnd);

if (startSavIdx !== -1 && endSavIdx !== -1) {
  const newSavingsHtml = `<section id="tab-savings" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="piggy-bank" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">ระบบการออมเงินนักเรียนประจำห้องเรียน</h2>
            <p class="text-xs text-slate-500 mt-0.5">บันทึกยอดเงินฝาก-ถอน บัญชีเงินออมห้องเรียน และพิมพ์สมุดเงินฝากสะสม</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalAddSavingsEntry()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="circle-dollar-sign" class="w-4 h-4"></i> บันทึกการฝาก-ถอนเงิน
          </button>
          <button type="button" onclick="printSavingsReport()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-pink-400"></i> พิมพ์สรุปยอดเงินออม
          </button>
        </div>
      </div>

      <!-- Savings Filter & Class Selector -->
      <div class="card-3d p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-1.5">
            <label class="font-bold text-slate-700 whitespace-nowrap"><i data-lucide="school" class="w-3.5 h-3.5 inline text-pink-600"></i> ชั้นเรียน:</label>
            <select id="savingsClassFilter" onchange="renderSavingsTable()" class="px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-pink-500">
              <option value="ป.6/1" selected>ชั้นประถมศึกษาปีที่ 6/1</option>
              <option value="ป.6/2">ชั้นประถมศึกษาปีที่ 6/2</option>
              <option value="ป.5/1">ชั้นประถมศึกษาปีที่ 5/1</option>
              <option value="ป.4/1">ชั้นประถมศึกษาปีที่ 4/1</option>
              <option value="ป.3/1">ชั้นประถมศึกษาปีที่ 3/1</option>
              <option value="ป.2/1">ชั้นประถมศึกษาปีที่ 2/1</option>
              <option value="ป.1/1">ชั้นประถมศึกษาปีที่ 1/1</option>
              <option value="ป.1/2">ชั้นประถมศึกษาปีที่ 1/2</option>
              <option value="ม.3/1">ชั้นมัธยมศึกษาปีที่ 3/1</option>
              <option value="ม.2/1">ชั้นมัธยมศึกษาปีที่ 2/1</option>
              <option value="ม.1/1">ชั้นมัธยมศึกษาปีที่ 1/1</option>
              <option value="อ.3/1">ชั้นอนุบาล 3/1</option>
              <option value="อ.3/2">ชั้นอนุบาล 3/2</option>
              <option value="อ.2/1">ชั้นอนุบาล 2/1</option>
              <option value="อ.2/2">ชั้นอนุบาล 2/2</option>
              <option value="all">ทั้งหมด (ทุกชั้นเรียน 346 คน)</option>
            </select>
          </div>
          <div class="relative">
            <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"></i>
            <input type="text" id="savingsSearchInput" oninput="renderSavingsTable()" placeholder="🔍 ค้นหาชื่อ-สกุล, รหัส หรือเลขที่..." class="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white font-normal shadow-2xs focus:ring-2 focus:ring-pink-500 w-52 sm:w-60">
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span id="savingsCountBadge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-800 font-bold border border-pink-200 text-xs">
            ⚡ รวม 19 บัญชี (ชั้น ป.6/1)
          </span>
        </div>
      </div>

      <!-- Savings Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card-3d p-4 rounded-xl bg-pink-50 border border-pink-200">
          <div class="text-xs font-bold text-pink-800">ยอดเงินออมสะสมทั้งห้อง</div>
          <div class="text-2xl font-black text-pink-900 mt-1" id="statSavingsTotal">0 ฿</div>
          <div class="text-[11px] text-pink-700 mt-0.5" id="statSavingsRoomDesc">ชั้นเรียน ป.6/1</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div class="text-xs font-bold text-emerald-800">ยอดเงินฝากเฉลี่ยต่อคน</div>
          <div class="text-2xl font-black text-emerald-950 mt-1" id="statSavingsAvg">0 ฿</div>
          <div class="text-[11px] text-emerald-700 mt-0.5">ส่งเสริมวินัยการออม</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div class="text-xs font-bold text-blue-800">นักเรียนที่มีการออมสม่ำเสมอ</div>
          <div class="text-2xl font-black text-blue-900 mt-1" id="statSavingsActivePct">100 %</div>
          <div class="text-[11px] text-blue-700 mt-0.5">ผ่านเกณฑ์ส่งเสริมการออม</div>
        </div>
      </div>

      <!-- Savings Table -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900 text-white font-bold text-center">
              <tr>
                <th class="p-3 w-12">เลขที่</th>
                <th class="p-3 text-left">ชื่อ - นามสกุล</th>
                <th class="p-3 w-32">ยอดเงินออมสะสม</th>
                <th class="p-3 w-28">ทำรายการล่าสุด</th>
                <th class="p-3 w-28">ประเภท / ยอด</th>
                <th class="p-3 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody id="savingsTableBody" class="divide-y divide-slate-200 bg-white">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    `;
  html = html.slice(0, startSavIdx) + newSavingsHtml + html.slice(endSavIdx);
  console.log('Step 2 complete: tab-savings HTML replaced.');
}

console.log('Step 3: Updating daily attendance JavaScript logic...');
const oldAttJsStart = `    // -------------------------------------------------------------------------
    // 2. DAILY ATTENDANCE & 4-IN-1 ROUTINES (ข้อ 2)
    // -------------------------------------------------------------------------`;

const oldAttJsEnd = `    // -------------------------------------------------------------------------
    // 3. BMI & NUTRITION TRACKING (ข้อ 3)
    // -------------------------------------------------------------------------`;

const attJsStartIdx = html.indexOf(oldAttJsStart);
const attJsEndIdx = html.indexOf(oldAttJsEnd);

if (attJsStartIdx === -1 || attJsEndIdx === -1) {
  console.error('ERROR: Attendance JS anchors not found!');
  process.exit(1);
}

const newAttJs = `    // -------------------------------------------------------------------------
    // 2. DAILY ATTENDANCE & 4-IN-1 ROUTINES (ข้อ 2: เช็คชื่อเสาธง & กิจวัตร 4 มิติ)
    // -------------------------------------------------------------------------
    function getDailyAttendanceStorageKey(date, cls) {
      return \`\${date}_\${cls}\`;
    }

    function ensureAttendanceRecordsForClassAndDate(date, cls) {
      initExtendedState();
      if (!state.ext.dailyAttendance) {
        state.ext.dailyAttendance = {
          currentDate: date,
          currentClass: cls,
          records: [],
          byDateAndClass: {}
        };
      }
      if (!state.ext.dailyAttendance.byDateAndClass) {
        state.ext.dailyAttendance.byDateAndClass = {};
      }

      const key = getDailyAttendanceStorageKey(date, cls);
      let recs = state.ext.dailyAttendance.byDateAndClass[key];

      // If not stored for this date and class, or if existing records have wrong class, build from tuples
      if (!recs || !Array.isArray(recs) || recs.length === 0 || (recs[0] && recs[0].classroom && recs[0].classroom !== cls)) {
        const tuples = (typeof DONGSAWAN_346_STUDENTS_TUPLES !== 'undefined')
          ? DONGSAWAN_346_STUDENTS_TUPLES.filter(t => t[6] === cls)
          : [];

        const isKinderOrPrathom = cls.startsWith('อ.') || cls.startsWith('ป.');

        recs = tuples.map((t, idx) => {
          const [stuId, citId, title, fname, lname, gender, room, num] = t;
          const shortTitle = title === 'เด็กชาย' ? 'ด.ช.' : (title === 'เด็กหญิง' ? 'ด.ญ.' : title);
          return {
            studentId: stuId,
            citizenId: citId,
            name: \`\${shortTitle}\${fname} \${lname}\`,
            number: num || (idx + 1),
            classroom: room,
            gender: gender,
            flag: 'present',
            periodAll: true,
            lunch: true,
            milk: true,
            brushTeeth: isKinderOrPrathom,
            remark: ''
          };
        });

        state.ext.dailyAttendance.byDateAndClass[key] = recs;
      }

      state.ext.dailyAttendance.currentDate = date;
      state.ext.dailyAttendance.currentClass = cls;
      state.ext.dailyAttendance.records = recs;
      return recs;
    }

    function loadAttendanceForDate() {
      const dateInput = document.getElementById('attendanceDateInput');
      const classSelect = document.getElementById('attendanceClassSelect');
      const date = (dateInput && dateInput.value) ? dateInput.value : (new Date().toISOString().split('T')[0]);
      const cls = (classSelect && classSelect.value) ? classSelect.value : 'ป.6/1';

      ensureAttendanceRecordsForClassAndDate(date, cls);
      renderDailyAttendanceTable();
    }

    function renderDailyAttendanceTable() {
      initExtendedState();
      const dateInput = document.getElementById('attendanceDateInput');
      const classSelect = document.getElementById('attendanceClassSelect');
      const date = (dateInput && dateInput.value) ? dateInput.value : (state.ext.dailyAttendance?.currentDate || new Date().toISOString().split('T')[0]);
      const cls = (classSelect && classSelect.value) ? classSelect.value : (state.ext.dailyAttendance?.currentClass || 'ป.6/1');

      if (dateInput && !dateInput.value) dateInput.value = date;
      if (classSelect && !classSelect.value) classSelect.value = cls;

      // Ensure records for this date and classroom
      const allRecs = ensureAttendanceRecordsForClassAndDate(date, cls);

      // Update badge
      const countBadge = document.getElementById('attendanceCountBadge');
      if (countBadge) {
        countBadge.innerHTML = \`⚡ รวม \${allRecs.length} คน (ชั้น \${cls})\`;
      }

      // Calculate statistics
      const presentCount = allRecs.filter(r => r.flag === 'present').length;
      const lateCount = allRecs.filter(r => r.flag === 'late').length;
      const leaveCount = allRecs.filter(r => r.flag === 'leave').length;
      const absentCount = allRecs.filter(r => r.flag === 'absent').length;
      const total = allRecs.length;
      const presentPct = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

      const statPresent = document.getElementById('statAttPresent');
      const statPresentPct = document.getElementById('statAttPresentPct');
      const statLate = document.getElementById('statAttLate');
      const statLeave = document.getElementById('statAttLeave');
      const statAbsent = document.getElementById('statAttAbsent');

      if (statPresent) statPresent.textContent = \`\${presentCount} คน\`;
      if (statPresentPct) statPresentPct.textContent = \`\${presentPct}% ของห้อง\`;
      if (statLate) statLate.textContent = \`\${lateCount} คน\`;
      if (statLeave) statLeave.textContent = \`\${leaveCount} คน\`;
      if (statAbsent) statAbsent.textContent = \`\${absentCount} คน\`;

      // Live search filter
      const searchQ = (document.getElementById('attendanceSearchInput')?.value || '').trim().toLowerCase();
      let filtered = allRecs;
      if (searchQ) {
        filtered = allRecs.filter(r =>
          (r.name && r.name.toLowerCase().includes(searchQ)) ||
          (r.studentId && r.studentId.includes(searchQ)) ||
          (String(r.number).includes(searchQ))
        );
      }

      const tbody = document.getElementById('dailyAttendanceTableBody');
      if (!tbody) return;

      if (filtered.length === 0) {
        tbody.innerHTML = \`
          <tr>
            <td colspan="8" class="p-8 text-center text-slate-400">
              <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
              ไม่พบข้อมูลนักเรียนตามเงื่อนไขที่ค้นหา
            </td>
          </tr>
        \`;
        if (window.lucide) lucide.createIcons();
        return;
      }

      tbody.innerHTML = filtered.map(r => {
        let flagBadge = 'bg-emerald-50 text-emerald-800 border-emerald-300';
        if (r.flag === 'late') flagBadge = 'bg-amber-50 text-amber-800 border-amber-300';
        else if (r.flag === 'leave') flagBadge = 'bg-sky-50 text-sky-800 border-sky-300';
        else if (r.flag === 'absent') flagBadge = 'bg-rose-50 text-rose-800 border-rose-300';

        return \`
          <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="p-3 text-center font-bold text-slate-700">\${r.number}</td>
            <td class="p-3">
              <div class="font-bold text-slate-900">\${r.name}</div>
              <div class="text-[10px] text-slate-400 font-mono">รหัส: \${r.studentId} | ชั้น \${r.classroom || cls}</div>
            </td>
            <td class="p-3 text-center bg-blue-50/30">
              <select onchange="updateAttendanceFlag('\${r.studentId}', this.value)" class="px-2.5 py-1.5 border rounded-lg text-xs font-bold \${flagBadge} shadow-2xs">
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
              <input type="text" value="\${r.remark || ''}" onchange="updateAttendanceRemark('\${r.studentId}', this.value)" placeholder="ระบุเหตุผล..." class="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-[11px] bg-white focus:ring-1 focus:ring-blue-500">
            </td>
          </tr>
        \`;
      }).join('');

      if (window.lucide) lucide.createIcons();
    }

    function updateAttendanceFlag(stuId, flagVal) {
      initExtendedState();
      const date = document.getElementById('attendanceDateInput')?.value || state.ext.dailyAttendance?.currentDate || new Date().toISOString().split('T')[0];
      const cls = document.getElementById('attendanceClassSelect')?.value || state.ext.dailyAttendance?.currentClass || 'ป.6/1';
      const key = getDailyAttendanceStorageKey(date, cls);

      const recs = state.ext.dailyAttendance.byDateAndClass?.[key] || state.ext.dailyAttendance.records || [];
      const r = recs.find(x => x.studentId === stuId);
      if (r) {
        r.flag = flagVal;
        const isPresentOrLate = (flagVal === 'present' || flagVal === 'late');
        const isKinderOrPrathom = cls.startsWith('อ.') || cls.startsWith('ป.');
        r.periodAll = isPresentOrLate;
        r.lunch = isPresentOrLate;
        r.milk = isPresentOrLate;
        r.brushTeeth = isPresentOrLate ? isKinderOrPrathom : false;
        saveExtendedState();
        renderDailyAttendanceTable();
      }
    }

    function updateRoutineCheck(stuId, keyProp, isChecked) {
      initExtendedState();
      const date = document.getElementById('attendanceDateInput')?.value || state.ext.dailyAttendance?.currentDate || new Date().toISOString().split('T')[0];
      const cls = document.getElementById('attendanceClassSelect')?.value || state.ext.dailyAttendance?.currentClass || 'ป.6/1';
      const key = getDailyAttendanceStorageKey(date, cls);

      const recs = state.ext.dailyAttendance.byDateAndClass?.[key] || state.ext.dailyAttendance.records || [];
      const r = recs.find(x => x.studentId === stuId);
      if (r) {
        r[keyProp] = isChecked;
        saveExtendedState();
      }
    }

    function updateAttendanceRemark(stuId, val) {
      initExtendedState();
      const date = document.getElementById('attendanceDateInput')?.value || state.ext.dailyAttendance?.currentDate || new Date().toISOString().split('T')[0];
      const cls = document.getElementById('attendanceClassSelect')?.value || state.ext.dailyAttendance?.currentClass || 'ป.6/1';
      const key = getDailyAttendanceStorageKey(date, cls);

      const recs = state.ext.dailyAttendance.byDateAndClass?.[key] || state.ext.dailyAttendance.records || [];
      const r = recs.find(x => x.studentId === stuId);
      if (r) {
        r.remark = val;
        saveExtendedState();
      }
    }

    function quickCheckAllPresent() {
      initExtendedState();
      const date = document.getElementById('attendanceDateInput')?.value || state.ext.dailyAttendance?.currentDate || new Date().toISOString().split('T')[0];
      const cls = document.getElementById('attendanceClassSelect')?.value || state.ext.dailyAttendance?.currentClass || 'ป.6/1';
      const key = getDailyAttendanceStorageKey(date, cls);

      const recs = state.ext.dailyAttendance.byDateAndClass?.[key] || state.ext.dailyAttendance.records || [];
      const isKinderOrPrathom = cls.startsWith('อ.') || cls.startsWith('ป.');
      recs.forEach(r => {
        r.flag = 'present';
        r.periodAll = true;
        r.lunch = true;
        r.milk = true;
        r.brushTeeth = isKinderOrPrathom;
      });
      saveExtendedState();
      renderDailyAttendanceTable();
      showToast(\`เช็คมาเรียนและทำกิจวัตรครบทุกคนแล้ว (ชั้น \${cls} รวม \${recs.length} คน)\`);
    }

    function saveDailyAttendance() {
      initExtendedState();
      const cls = document.getElementById('attendanceClassSelect')?.value || state.ext.dailyAttendance?.currentClass || 'ป.6/1';
      saveExtendedState();
      showToast(\`บันทึกเวลาเรียนและกิจวัตรประจำวัน ชั้น \${cls} เรียบร้อยแล้ว\`);
    }

    function printDailyAttendanceReport() {
      initExtendedState();
      const dateInput = document.getElementById('attendanceDateInput');
      const date = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];
      const cls = document.getElementById('attendanceClassSelect')?.value || 'ป.6/1';
      const recs = ensureAttendanceRecordsForClassAndDate(date, cls);

      const thaiDate = (typeof formatThaiDate === 'function') ? formatThaiDate(date) : date;

      const presentCount = recs.filter(r => r.flag === 'present').length;
      const lateCount = recs.filter(r => r.flag === 'late').length;
      const leaveCount = recs.filter(r => r.flag === 'leave').length;
      const absentCount = recs.filter(r => r.flag === 'absent').length;
      const lunchCount = recs.filter(r => r.lunch).length;
      const milkCount = recs.filter(r => r.milk).length;
      const brushCount = recs.filter(r => r.brushTeeth).length;
      const total = recs.length;

      let rows = recs.map(r => \`
        <tr>
          <td style="text-align:center; padding:5px; border:1px solid #666;">\${r.number}</td>
          <td style="text-align:center; padding:5px; border:1px solid #666; font-family:monospace;">\${r.studentId}</td>
          <td style="padding:5px 8px; border:1px solid #666; font-weight:bold;">\${r.name}</td>
          <td style="text-align:center; padding:5px; border:1px solid #666; font-weight:bold; color:\${r.flag === 'present' ? '#047857' : (r.flag === 'late' ? '#b45309' : (r.flag === 'leave' ? '#0369a1' : '#b91c1c'))};">
            \${r.flag === 'present' ? 'มา' : (r.flag === 'late' ? 'สาย' : (r.flag === 'leave' ? 'ลา' : 'ขาด'))}
          </td>
          <td style="text-align:center; padding:5px; border:1px solid #666;">\${r.periodAll ? '✓' : '-'}</td>
          <td style="text-align:center; padding:5px; border:1px solid #666;">\${r.lunch ? '✓' : '-'}</td>
          <td style="text-align:center; padding:5px; border:1px solid #666;">\${r.milk ? '✓' : '-'}</td>
          <td style="text-align:center; padding:5px; border:1px solid #666;">\${r.brushTeeth ? '✓' : '-'}</td>
          <td style="padding:5px 8px; border:1px solid #666; font-size:9.5pt;">\${r.remark || '-'}</td>
        </tr>
      \`).join('');

      const htmlDoc = \`
        <div style="font-family:'Sarabun', 'Prompt', sans-serif; padding:15px; color:#1e293b; max-width:960px; margin:0 auto; line-height:1.4;">
          <div style="text-align:center; margin-bottom:15px; border-bottom:2px solid #0f172a; padding-bottom:10px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold; color:#0f172a;">แบบบันทึกเวลาเรียนและการปฏิบัติกิจวัตรประจำวัน 4 มิติ</h2>
            <p style="font-size:11pt; margin:4px 0 0; color:#334155;">
              <strong>ชั้น \${cls}</strong> | ประจำวันที่ \${thaiDate} | ภาคเรียนที่ 1 ปีการศึกษา 2569
            </p>
            <p style="font-size:10pt; margin:2px 0 0; color:#64748b;">
              โรงเรียนดงสวรรค์วิทยา สำนักงานเขตพื้นที่การศึกษาประถมศึกษาหนองบัวลำภู เขต 2
            </p>
          </div>

          <!-- สรุปสถิติประจำวัน -->
          <table style="width:100%; border-collapse:collapse; font-size:10pt; margin-bottom:12px; background:#f8fafc;">
            <tr style="text-align:center;">
              <td style="padding:6px; border:1px solid #94a3b8; font-weight:bold;">นักเรียนทั้งหมด: \${total} คน</td>
              <td style="padding:6px; border:1px solid #94a3b8; color:#047857; font-weight:bold;">มา: \${presentCount} คน</td>
              <td style="padding:6px; border:1px solid #94a3b8; color:#b45309; font-weight:bold;">สาย: \${lateCount} คน</td>
              <td style="padding:6px; border:1px solid #94a3b8; color:#0369a1; font-weight:bold;">ลา: \${leaveCount} คน</td>
              <td style="padding:6px; border:1px solid #94a3b8; color:#b91c1c; font-weight:bold;">ขาด: \${absentCount} คน</td>
              <td style="padding:6px; border:1px solid #94a3b8;">ดื่มนม: \${milkCount} คน</td>
              <td style="padding:6px; border:1px solid #94a3b8;">แปรงฟัน: \${brushCount} คน</td>
            </tr>
          </table>

          <!-- ตารางรายชื่อ -->
          <table style="width:100%; border-collapse:collapse; font-size:10pt;">
            <thead>
              <tr style="background:#e2e8f0; text-align:center; font-weight:bold;">
                <th style="padding:6px; border:1px solid #666; width:35px;">เลขที่</th>
                <th style="padding:6px; border:1px solid #666; width:65px;">รหัส</th>
                <th style="padding:6px; border:1px solid #666; text-align:left;">ชื่อ - สกุล</th>
                <th style="padding:6px; border:1px solid #666; width:60px;">เข้าแถว</th>
                <th style="padding:6px; border:1px solid #666; width:55px;">เรียน</th>
                <th style="padding:6px; border:1px solid #666; width:65px;">อาหาร</th>
                <th style="padding:6px; border:1px solid #666; width:55px;">ดื่มนม</th>
                <th style="padding:6px; border:1px solid #666; width:55px;">แปรงฟัน</th>
                <th style="padding:6px; border:1px solid #666; width:120px;">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>\${rows}</tbody>
          </table>

          <!-- ลงชื่อ -->
          <div style="margin-top:35px; display:flex; justify-content:space-between; text-align:center; font-size:10.5pt;">
            <div style="width:45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top:4px; font-weight:bold;">( .......................................................... )</div>
              <div style="font-size:9pt; color:#475569; margin-top:2px;">ครูประจำชั้น / ผู้บันทึกเวลาเรียน</div>
            </div>
            <div style="width:45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top:4px; font-weight:bold;">( นางรัษฎาภรณ์ ศิริมาตย์ )</div>
              <div style="font-size:9pt; color:#475569; margin-top:2px;">ผู้อำนวยการโรงเรียนดงสวรรค์วิทยา</div>
            </div>
          </div>
        </div>
      \`;

      printDocument(htmlDoc, 'แบบบันทึกเวลาเรียนและกิจวัตร_' + cls + '_' + date + '.pdf', 'portrait');
    }

`;

html = html.slice(0, attJsStartIdx) + newAttJs + html.slice(attJsEndIdx);
console.log('Step 3 complete: Daily attendance JS logic updated.');

console.log('Step 4: Updating Savings JavaScript logic...');
const oldSavJsStart = `    // -------------------------------------------------------------------------
    // 4. STUDENT SAVINGS SYSTEM (ข้อ 4)
    // -------------------------------------------------------------------------`;

const oldSavJsEnd = `    // -------------------------------------------------------------------------
    // 5. DMC EXCEL IMPORT & LOCKER TAGS (ข้อ 5)
    // -------------------------------------------------------------------------`;

const savJsStartIdx = html.indexOf(oldSavJsStart);
const savJsEndIdx = html.indexOf(oldSavJsEnd);

if (savJsStartIdx !== -1 && savJsEndIdx !== -1) {
  const newSavJs = `    // -------------------------------------------------------------------------
    // 4. STUDENT SAVINGS SYSTEM (ข้อ 4: การออมเงินนักเรียนประจำห้องเรียน)
    // -------------------------------------------------------------------------
    function ensureSavingsRecordsLoaded() {
      initExtendedState();
      if (!state.ext.savingsRecords || state.ext.savingsRecords.length === 0) {
        if (typeof DONGSAWAN_346_STUDENTS_TUPLES !== 'undefined' && Array.isArray(DONGSAWAN_346_STUDENTS_TUPLES)) {
          const sampleAmounts = [150, 200, 350, 420, 500, 650, 780, 850, 1000, 1200, 1500, 2100];
          state.ext.savingsRecords = DONGSAWAN_346_STUDENTS_TUPLES.map((t, idx) => {
            const [stuId, citId, title, fname, lname, gender, room, num] = t;
            const shortTitle = title === 'เด็กชาย' ? 'ด.ช.' : (title === 'เด็กหญิง' ? 'ด.ญ.' : title);
            const bal = sampleAmounts[(idx * 7) % sampleAmounts.length];
            const depositAmount = ((idx % 3) + 1) * 20;
            return {
              studentId: stuId,
              name: \`\${shortTitle}\${fname} \${lname}\`,
              classroom: room,
              number: num || (idx + 1),
              balance: bal,
              lastDate: '2026-10-10',
              lastType: 'deposit',
              lastAmount: depositAmount
            };
          });
          saveExtendedState();
        }
      }
    }

    function renderSavingsTable() {
      ensureSavingsRecordsLoaded();
      const tbody = document.getElementById('savingsTableBody');
      if (!tbody) return;

      const classFilter = document.getElementById('savingsClassFilter')?.value || 'ป.6/1';
      const searchQ = (document.getElementById('savingsSearchInput')?.value || '').trim().toLowerCase();

      let recs = state.ext.savingsRecords || [];
      if (classFilter && classFilter !== 'all') {
        recs = recs.filter(r => r.classroom === classFilter);
      }
      if (searchQ) {
        recs = recs.filter(r =>
          (r.name && r.name.toLowerCase().includes(searchQ)) ||
          (r.studentId && r.studentId.includes(searchQ)) ||
          (String(r.number).includes(searchQ))
        );
      }

      // Update badge and summary cards
      const countBadge = document.getElementById('savingsCountBadge');
      if (countBadge) {
        countBadge.textContent = \`⚡ รวม \${recs.length} บัญชี (ชั้น \${classFilter === 'all' ? 'ทุกห้องเรียน' : classFilter})\`;
      }

      let totalBal = 0;
      recs.forEach(r => { totalBal += (r.balance || 0); });
      const avgBal = recs.length > 0 ? Math.round(totalBal / recs.length) : 0;

      const statEl = document.getElementById('statSavingsTotal');
      if (statEl) statEl.textContent = totalBal.toLocaleString() + ' ฿';

      const descEl = document.getElementById('statSavingsRoomDesc');
      if (descEl) descEl.textContent = \`ชั้นเรียน \${classFilter === 'all' ? 'ทุกห้อง' : classFilter} (\${recs.length} บัญชี)\`;

      const avgEl = document.getElementById('statSavingsAvg');
      if (avgEl) avgEl.textContent = avgBal.toLocaleString() + ' ฿';

      if (recs.length === 0) {
        tbody.innerHTML = \`
          <tr>
            <td colspan="6" class="p-8 text-center text-slate-400">
              <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
              ไม่พบข้อมูลบัญชีเงินออม
            </td>
          </tr>
        \`;
        if (window.lucide) lucide.createIcons();
        return;
      }

      tbody.innerHTML = recs.map(r => {
        return \`
          <tr class="hover:bg-slate-50 transition border-b border-slate-100">
            <td class="p-3 text-center font-bold text-slate-700">\${r.number}</td>
            <td class="p-3">
              <div class="font-bold text-slate-900">\${r.name}</div>
              <div class="text-[10px] text-slate-400 font-mono">รหัส: \${r.studentId} | ชั้น \${r.classroom}</div>
            </td>
            <td class="p-3 text-center font-black text-pink-700 text-sm">\${(r.balance || 0).toLocaleString()} ฿</td>
            <td class="p-3 text-center text-slate-500 text-[11px]">\${r.lastDate || '-'}</td>
            <td class="p-3 text-center font-bold text-xs">
              <span class="\${r.lastType === 'deposit' ? 'text-emerald-600' : 'text-rose-600'}">
                \${r.lastType === 'deposit' ? '+' : '-'}\${r.lastAmount || 0} ฿
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

      if (window.lucide) lucide.createIcons();
    }

    function openModalAddSavingsEntry(defaultStuId = null) {
      document.getElementById('formSavingsEntry').reset();
      document.getElementById('savDate').value = new Date().toISOString().split('T')[0];
      populateStudentSelect('savStudentSelect', defaultStuId);
      openModal('modalAddSavingsEntry');
    }

    function handleSaveSavingsEntry(e) {
      e.preventDefault();
      ensureSavingsRecordsLoaded();
      const stuId = document.getElementById('savStudentSelect').value;
      const type = document.getElementById('savType').value;
      const amount = parseFloat(document.getElementById('savAmount').value) || 0;
      const date = document.getElementById('savDate').value;

      const r = state.ext.savingsRecords.find(x => x.studentId === stuId);
      if (r) {
        if (type === 'withdraw' && amount > r.balance) {
          alert('ยอดเงินคงเหลือไม่เพียงพอสำหรับการถอนเงิน');
          return;
        }
        if (type === 'deposit') {
          r.balance += amount;
        } else {
          r.balance -= amount;
        }
        r.lastDate = date;
        r.lastType = type;
        r.lastAmount = amount;

        if (!state.ext.savingsLogs) state.ext.savingsLogs = [];
        state.ext.savingsLogs.push({
          id: 'SAV_' + Date.now(),
          studentId: stuId,
          studentName: r.name,
          classroom: r.classroom,
          type: type,
          amount: amount,
          balanceAfter: r.balance,
          date: date
        });

        saveExtendedState();
        closeModal('modalAddSavingsEntry');
        renderSavingsTable();
        showToast(\`บันทึกรายการ \${type === 'deposit' ? 'ฝากเงิน' : 'ถอนเงิน'} \${amount} บาท ให้กับ \${r.name} เรียบร้อยแล้ว\`);
      }
    }

    function printSavingsReport() {
      ensureSavingsRecordsLoaded();
      const classFilter = document.getElementById('savingsClassFilter')?.value || 'ป.6/1';
      let recs = state.ext.savingsRecords || [];
      if (classFilter && classFilter !== 'all') {
        recs = recs.filter(r => r.classroom === classFilter);
      }

      let total = 0;
      let rows = recs.map(r => {
        total += (r.balance || 0);
        return \`
          <tr>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.number}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999; font-family:monospace;">\${r.studentId}</td>
            <td style="padding:6px; border:1px solid #999; font-weight:bold;">\${r.name}</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.classroom}</td>
            <td style="text-align:right; padding:6px; border:1px solid #999; font-weight:bold; color:#be185d;">\${(r.balance || 0).toLocaleString()} บาท</td>
            <td style="text-align:center; padding:6px; border:1px solid #999;">\${r.lastDate || '-'}</td>
          </tr>
        \`;
      }).join('');

      const htmlDoc = \`
        <div style="font-family:'Sarabun', 'Prompt', sans-serif; padding:15px; color:#1e293b; max-width:960px; margin:0 auto; line-height:1.4;">
          <div style="text-align:center; margin-bottom:15px; border-bottom:2px solid #0f172a; padding-bottom:10px;">
            <h2 style="font-size:16pt; margin:0; font-weight:bold; color:#0f172a;">รายงานสรุปบัญชีเงินฝากออมทรัพย์นักเรียน</h2>
            <p style="font-size:11pt; margin:4px 0 0; color:#334155;">
              <strong>ชั้น \${classFilter === 'all' ? 'ทุกห้องเรียน' : classFilter}</strong> | โรงเรียนดงสวรรค์วิทยา สพป.หนองบัวลำภู เขต 2
            </p>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:10pt;">
            <thead>
              <tr style="background:#f1f5f9; text-align:center; font-weight:bold;">
                <th style="padding:6px; border:1px solid #999; width:40px;">ที่</th>
                <th style="padding:6px; border:1px solid #999; width:70px;">รหัส</th>
                <th style="padding:6px; border:1px solid #999; text-align:left;">ชื่อ - สกุล</th>
                <th style="padding:6px; border:1px solid #999; width:65px;">ชั้น</th>
                <th style="padding:6px; border:1px solid #999; width:120px; text-align:right;">ยอดเงินออมสะสม</th>
                <th style="padding:6px; border:1px solid #999; width:100px;">ทำรายการล่าสุด</th>
              </tr>
            </thead>
            <tbody>
              \${rows}
              <tr style="background:#f8fafc; font-weight:bold;">
                <td colspan="4" style="text-align:center; padding:8px; border:1px solid #999;">รวมยอดเงินออมทั้งสิ้น (\${recs.length} บัญชี)</td>
                <td style="text-align:right; padding:8px; border:1px solid #999; color:#be185d; font-size:11pt;">\${total.toLocaleString()} บาท</td>
                <td style="border:1px solid #999;"></td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top:35px; display:flex; justify-content:space-between; text-align:center; font-size:10.5pt;">
            <div style="width:45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top:4px; font-weight:bold;">( .......................................................... )</div>
              <div style="font-size:9pt; color:#475569; margin-top:2px;">ครูประจำชั้น / ผู้ดูแลบัญชีเงินออม</div>
            </div>
            <div style="width:45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top:4px; font-weight:bold;">( นางรัษฎาภรณ์ ศิริมาตย์ )</div>
              <div style="font-size:9pt; color:#475569; margin-top:2px;">ผู้อำนวยการโรงเรียนดงสวรรค์วิทยา</div>
            </div>
          </div>
        </div>
      \`;

      printDocument(htmlDoc, 'รายงานเงินออมนักเรียน_' + classFilter + '.pdf', 'portrait');
    }

`;
  html = html.slice(0, savJsStartIdx) + newSavJs + html.slice(savJsEndIdx);
  console.log('Step 4 complete: Savings JS logic updated.');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('SUCCESS: index.html updated successfully!');
