const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update tab-bmi section HTML
const oldTabBmi = `    <!-- ================================================================= -->
    <!-- MODULE 17: น้ำหนัก-ส่วนสูง & แปลผล BMI (TAB-BMI) [ข้อ 3] -->
    <!-- ================================================================= -->
    <section id="tab-bmi" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="scale" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">ระบบน้ำหนัก-ส่วนสูง & แปลผลภาวะโภชนาการ (BMI)</h2>
            <p class="text-xs text-slate-500 mt-0.5">ครูที่ปรึกษาคีย์น้ำหนักส่วนสูง คำนวณ BMI อัตโนมัติ แปลผลสมส่วน/ผอม/อ้วน/เตี้ย</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="saveBmiRecords()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="save" class="w-4 h-4"></i> บันทึกข้อมูลน้ำหนักส่วนสูง
          </button>
          <button type="button" onclick="printBmiReport()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-teal-400"></i> พิมพ์รายงานภาวะโภชนาการ
          </button>
        </div>
      </div>

      <!-- BMI Table -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900 text-white font-bold text-center">
              <tr>
                <th class="p-3 w-12">เลขที่</th>
                <th class="p-3 text-left">ชื่อ - สกุล</th>
                <th class="p-3 w-28">น้ำหนัก (กก.)</th>
                <th class="p-3 w-28">ส่วนสูง (ซม.)</th>
                <th class="p-3 w-24">ดัชนี BMI</th>
                <th class="p-3 w-32">ภาวะโภชนาการ</th>
                <th class="p-3 w-32">เกณฑ์ส่วนสูง</th>
                <th class="p-3 w-20">จัดการ</th>
              </tr>
            </thead>
            <tbody id="bmiTableBody" class="divide-y divide-slate-200 bg-white">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>`;

const newTabBmi = `    <!-- ================================================================= -->
    <!-- MODULE 17: น้ำหนัก-ส่วนสูง & แปลผล BMI (TAB-BMI) [ข้อ 3] -->
    <!-- ================================================================= -->
    <section id="tab-bmi" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 bg-gradient-to-r from-white via-teal-50/20 to-white">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="scale" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">ระบบน้ำหนัก-ส่วนสูง & แปลผลภาวะโภชนาการ (BMI)</h2>
            <p class="text-xs text-slate-500 mt-0.5">ครูที่ปรึกษาคีย์น้ำหนักส่วนสูง คำนวณ BMI อัตโนมัติ แปลผลสมส่วน/ผอม/อ้วน/เตี้ย ตามเกณฑ์กรมอนามัย</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalAddBmiEntry()" class="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md">
            <i data-lucide="user-plus" class="w-4 h-4 text-teal-200"></i> บันทึกข้อมูลน้ำหนักส่วนสูง
          </button>
          <button type="button" onclick="saveBmiRecords()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="save" class="w-4 h-4"></i> บันทึกข้อมูลที่แก้ไข
          </button>
          <button type="button" onclick="printBmiReport()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-teal-400"></i> พิมพ์รายงานภาวะโภชนาการ
          </button>
        </div>
      </div>

      <!-- Filter & Classroom Controls -->
      <div class="card-3d p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-700 whitespace-nowrap"><i data-lucide="school" class="w-4 h-4 inline text-blue-600"></i> ชั้นเรียน:</span>
            <select id="bmiClassFilter" onchange="renderBmiTable()" class="px-3 py-1.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-800 shadow-2xs focus:ring-2 focus:ring-teal-500">
              <option value="ม.3/1" selected>ชั้น ม.3/1</option>
              <option value="ม.2/1">ชั้น ม.2/1</option>
              <option value="ม.1/1">ชั้น ม.1/1</option>
              <option value="ป.6/1">ชั้น ป.6/1</option>
              <option value="ป.6/2">ชั้น ป.6/2</option>
              <option value="ป.5/1">ชั้น ป.5/1</option>
              <option value="ป.4/1">ชั้น ป.4/1</option>
              <option value="ป.3/1">ชั้น ป.3/1</option>
              <option value="ป.2/1">ชั้น ป.2/1</option>
              <option value="ป.1/1">ชั้น ป.1/1</option>
              <option value="ป.1/2">ชั้น ป.1/2</option>
              <option value="อ.3/1">ชั้น อ.3/1</option>
              <option value="อ.3/2">ชั้น อ.3/2</option>
              <option value="อ.2/1">ชั้น อ.2/1</option>
              <option value="อ.2/2">ชั้น อ.2/2</option>
              <option value="all">ทั้งหมด (ทุกชั้นเรียน 346 คน)</option>
            </select>
          </div>
          <div class="relative">
            <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"></i>
            <input type="text" id="bmiSearchInput" oninput="renderBmiTable()" placeholder="🔍 ค้นหาชื่อ-สกุล, รหัส หรือเลขที่..." class="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white font-normal shadow-2xs focus:ring-2 focus:ring-teal-500 w-56 sm:w-64">
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span id="bmiStudentCountBadge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 font-bold border border-teal-200 text-xs">
            ⚡ รวม 17 คน (ชั้น ม.3/1)
          </span>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div class="card-3d p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-800">🥗 สมส่วน (ปกติ)</span>
            <span class="text-base">🟢</span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-emerald-950 mt-1" id="statBmiNormal">0 คน</div>
          <div class="text-[11px] text-emerald-700 mt-0.5" id="statBmiNormalPct">0% ของห้อง</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-rose-50 border border-rose-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-rose-800">🍔 ท้วม / เริ่มอ้วน / อ้วน</span>
            <span class="text-base">🔴</span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-rose-950 mt-1" id="statBmiOverweight">0 คน</div>
          <div class="text-[11px] text-rose-700 mt-0.5">น้ำหนักเกินเกณฑ์</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-sky-50 border border-sky-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-sky-800">📉 ค่อนข้างผอม / ผอม</span>
            <span class="text-base">🔵</span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-sky-950 mt-1" id="statBmiUnderweight">0 คน</div>
          <div class="text-[11px] text-sky-700 mt-0.5">น้ำหนักต่ำกว่าเกณฑ์</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-purple-50 border border-purple-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-purple-800">📏 เกณฑ์ส่วนสูง</span>
            <span class="text-base">🟣</span>
          </div>
          <div class="text-xl sm:text-2xl font-black text-purple-950 mt-1" id="statBmiHeightNormal">0 คน</div>
          <div class="text-[11px] text-purple-700 mt-0.5">สูงตามเกณฑ์มาตรฐาน</div>
        </div>
      </div>

      <!-- BMI Table -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900 text-white font-bold text-center">
              <tr>
                <th class="p-3 w-12">เลขที่</th>
                <th class="p-3 w-20">รหัส</th>
                <th class="p-3 text-left">ชื่อ - สกุล</th>
                <th class="p-3 w-20">ชั้น</th>
                <th class="p-3 w-28">น้ำหนัก (กก.)</th>
                <th class="p-3 w-28">ส่วนสูง (ซม.)</th>
                <th class="p-3 w-24">ดัชนี BMI</th>
                <th class="p-3 w-32">ภาวะโภชนาการ</th>
                <th class="p-3 w-32">เกณฑ์ส่วนสูง</th>
                <th class="p-3 w-20">จัดการ</th>
              </tr>
            </thead>
            <tbody id="bmiTableBody" class="divide-y divide-slate-200 bg-white">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>`;

if (!html.includes(oldTabBmi)) {
  console.error('ERROR: oldTabBmi not found!');
  process.exit(1);
}
html = html.replace(oldTabBmi, newTabBmi);
console.log('Step 1: tab-bmi section HTML updated.');

// 2. Add modalAddBmiEntry modal right before modalAddTransfer
const modalTransferAnchor = `  <!-- MODAL: ADD STUDENT TRANSFER (IN / OUT) -->`;

const newBmiModal = `  <!-- MODAL: ADD / EDIT BMI ENTRY (บันทึกน้ำหนัก-ส่วนสูง) -->
  <div id="modalAddBmiEntry" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="scale" class="w-5 h-5 text-teal-600"></i> บันทึกข้อมูลน้ำหนัก-ส่วนสูง (BMI)
        </h3>
        <button type="button" onclick="closeModal('modalAddBmiEntry')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formAddBmiEntry" onsubmit="handleSaveBmiEntry(event)" class="space-y-3.5 text-xs">
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block font-bold text-slate-700">นักเรียน *</label>
            <span id="bmiStudentSelect_count" class="text-[10px] text-slate-400 font-bold">346 คนทั้งหมด</span>
          </div>
          <div class="relative mb-1.5">
            <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"></i>
            <input type="text" id="bmiStudentSelect_search" oninput="filterStudentSelect('bmiStudentSelect', this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('bmiStudentSelect').focus();}" placeholder="🔍 ค้นหาชื่อ-สกุล, รหัส 4 หลัก หรือพิมพ์ชั้น..." class="w-full pl-8 pr-8 py-1.5 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 font-normal shadow-2xs">
            <button type="button" onclick="document.getElementById('bmiStudentSelect_search').value=''; filterStudentSelect('bmiStudentSelect','');" class="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs" title="ล้างคำค้น">✕</button>
          </div>
          <select id="bmiStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-xs"></select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">น้ำหนัก (กิโลกรัม) *</label>
            <input type="number" id="inputBmiWeight" step="0.1" min="5" max="200" placeholder="เช่น 45.5" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-slate-900">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ส่วนสูง (เซนติเมตร) *</label>
            <input type="number" id="inputBmiHeight" step="0.1" min="50" max="230" placeholder="เช่น 155.0" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-slate-900">
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">วันที่ชั่งน้ำหนัก-วัดส่วนสูง</label>
          <input type="date" id="inputBmiDate" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white text-slate-900">
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">บันทึกข้อมูล BMI</button>
          <button type="button" onclick="closeModal('modalAddBmiEntry')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

` + modalTransferAnchor;

if (!html.includes(modalTransferAnchor)) {
  console.error('ERROR: modalTransferAnchor not found!');
  process.exit(1);
}
html = html.replace(modalTransferAnchor, newBmiModal);
console.log('Step 2: modalAddBmiEntry modal inserted.');

// 3. Update BMI JavaScript logic
const oldBmiJsStart = `    // -------------------------------------------------------------------------
    // 3. BMI & NUTRITION TRACKING (ข้อ 3)
    // -------------------------------------------------------------------------
    function renderBmiTable() {`;

const oldBmiJsEnd = `    // -------------------------------------------------------------------------
    // 4. STUDENT SAVINGS SYSTEM (ข้อ 4)
    // -------------------------------------------------------------------------`;

const bStart = html.indexOf(oldBmiJsStart);
const bEnd = html.indexOf(oldBmiJsEnd);

if (bStart === -1 || bEnd === -1 || bStart >= bEnd) {
  console.error('ERROR: BMI JS anchors not found!');
  process.exit(1);
}

const newBmiJs = `    // -------------------------------------------------------------------------
    // 3. BMI & NUTRITION TRACKING (ข้อ 3)
    // -------------------------------------------------------------------------
    function generateDefaultBmiRecord(t, idx) {
      const [stuId, citId, title, fname, lname, gender, room, num] = t;
      const shortTitle = title === 'เด็กชาย' ? 'ด.ช.' : (title === 'เด็กหญิง' ? 'ด.ญ.' : title);
      const seed = (parseInt(stuId, 10) * 17 + (num || (idx + 1)) * 13) % 100;

      let baseH = 158;
      let baseW = 48;

      if (room.startsWith('อ.2')) { baseH = 106; baseW = 17.5; }
      else if (room.startsWith('อ.3')) { baseH = 112; baseW = 19.5; }
      else if (room.startsWith('ป.1')) { baseH = 118; baseW = 21.5; }
      else if (room.startsWith('ป.2')) { baseH = 124; baseW = 24.5; }
      else if (room.startsWith('ป.3')) { baseH = 129; baseW = 27.5; }
      else if (room.startsWith('ป.4')) { baseH = 135; baseW = 32.0; }
      else if (room.startsWith('ป.5')) { baseH = 141; baseW = 36.5; }
      else if (room.startsWith('ป.6')) { baseH = 147; baseW = 41.5; }
      else if (room.startsWith('ม.1')) { baseH = 154; baseW = 46.5; }
      else if (room.startsWith('ม.2')) { baseH = 159; baseW = 50.0; }
      else if (room.startsWith('ม.3')) { baseH = 164; baseW = 54.5; }

      if (gender === 'ชาย') { baseH += 2.5; baseW += 2.0; }

      const hVar = ((seed % 17) - 8);
      let wVar = ((seed % 19) - 8);
      if (seed % 11 === 0) wVar += 12;
      else if (seed % 13 === 0) wVar -= 7;

      const height = parseFloat((baseH + hVar * 0.7).toFixed(1));
      const weight = parseFloat(Math.max(13, (baseW + wVar * 0.8)).toFixed(1));
      const hM = height / 100;
      const bmi = parseFloat((weight / (hM * hM)).toFixed(1));

      let nutritionStatus = 'สมส่วน';
      if (bmi < 16.0) nutritionStatus = 'ผอม';
      else if (bmi < 18.5) nutritionStatus = 'ค่อนข้างผอม';
      else if (bmi <= 22.9) nutritionStatus = 'สมส่วน';
      else if (bmi <= 24.9) nutritionStatus = 'ท้วม';
      else if (bmi <= 29.9) nutritionStatus = 'เริ่มอ้วน';
      else nutritionStatus = 'อ้วน';

      let heightStatus = 'สูงตามเกณฑ์';
      let minH = baseH - 5;
      if (height < minH - 6) heightStatus = 'เตี้ย';
      else if (height < minH) heightStatus = 'ค่อนข้างเตี้ย';
      else if (height > baseH + 8) heightStatus = 'สูงกว่าเกณฑ์';

      return {
        studentId: stuId,
        number: num || (idx + 1),
        name: \`\${shortTitle}\${fname} \${lname}\`,
        classroom: room,
        gender: gender,
        weight,
        height,
        bmi,
        nutritionStatus,
        heightStatus,
        recordedDate: '2026-06-15'
      };
    }

    function ensureBmiRecordsLoaded() {
      initExtendedState();
      if (!state.ext.bmiRecords || state.ext.bmiRecords.length === 0) {
        state.ext.bmiRecords = DONGSAWAN_346_STUDENTS_TUPLES.map((t, idx) => generateDefaultBmiRecord(t, idx));
        saveExtendedState();
      }
    }

    function renderBmiTable() {
      ensureBmiRecordsLoaded();
      const tbody = document.getElementById('bmiTableBody');
      if (!tbody) return;

      const selectedClass = document.getElementById('bmiClassFilter') ? document.getElementById('bmiClassFilter').value : 'ม.3/1';
      const searchQuery = document.getElementById('bmiSearchInput') ? document.getElementById('bmiSearchInput').value.trim().toLowerCase() : '';

      let list = state.ext.bmiRecords || [];

      // Filter by classroom
      if (selectedClass && selectedClass !== 'all') {
        list = list.filter(r => r.classroom === selectedClass);
      }

      // Filter by search query
      if (searchQuery) {
        list = list.filter(r => {
          return (r.name && r.name.toLowerCase().includes(searchQuery)) ||
                 (r.studentId && r.studentId.includes(searchQuery)) ||
                 (r.classroom && r.classroom.toLowerCase().includes(searchQuery)) ||
                 (String(r.number) === searchQuery);
        });
      }

      // Update summary KPI stats
      const totalCount = list.length;
      let normalCount = 0;
      let overCount = 0;
      let underCount = 0;
      let heightNormalCount = 0;

      list.forEach(r => {
        if (r.nutritionStatus === 'สมส่วน') normalCount++;
        else if (['ท้วม', 'เริ่มอ้วน', 'อ้วน'].includes(r.nutritionStatus)) overCount++;
        else if (['ค่อนข้างผอม', 'ผอม'].includes(r.nutritionStatus)) underCount++;

        if (r.heightStatus === 'สูงตามเกณฑ์' || r.heightStatus === 'สูงกว่าเกณฑ์') heightNormalCount++;
      });

      const normalPct = totalCount > 0 ? Math.round((normalCount / totalCount) * 100) : 0;

      if (document.getElementById('statBmiNormal')) document.getElementById('statBmiNormal').textContent = \`\${normalCount} คน\`;
      if (document.getElementById('statBmiNormalPct')) document.getElementById('statBmiNormalPct').textContent = \`\${normalPct}% ของห้อง\`;
      if (document.getElementById('statBmiOverweight')) document.getElementById('statBmiOverweight').textContent = \`\${overCount} คน\`;
      if (document.getElementById('statBmiUnderweight')) document.getElementById('statBmiUnderweight').textContent = \`\${underCount} คน\`;
      if (document.getElementById('statBmiHeightNormal')) document.getElementById('statBmiHeightNormal').textContent = \`\${heightNormalCount} คน\`;

      const badgeEl = document.getElementById('bmiStudentCountBadge');
      if (badgeEl) {
        badgeEl.textContent = \`⚡ รวม \${totalCount} คน (\${selectedClass === 'all' ? 'ทุกชั้นเรียน' : 'ชั้น ' + selectedClass})\`;
      }

      if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="p-6 text-center text-xs text-slate-400">ไม่พบข้อมูลนักเรียนตามเงื่อนไขที่เลือก</td></tr>';
        return;
      }

      tbody.innerHTML = list.map(r => {
        let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        if (r.nutritionStatus === 'อ้วน' || r.nutritionStatus === 'เริ่มอ้วน') badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';
        else if (r.nutritionStatus === 'ท้วม') badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
        else if (r.nutritionStatus === 'ค่อนข้างผอม' || r.nutritionStatus === 'ผอม') badgeColor = 'bg-sky-100 text-sky-800 border-sky-300';

        let heightBadge = 'bg-teal-50 text-teal-800 border-teal-200';
        if (r.heightStatus === 'เตี้ย' || r.heightStatus === 'ค่อนข้างเตี้ย') heightBadge = 'bg-amber-50 text-amber-800 border-amber-200';

        return \`
          <tr class="hover:bg-teal-50/20 transition border-b border-slate-100">
            <td class="p-3 text-center font-bold text-slate-700">\${r.number}</td>
            <td class="p-3 text-center font-mono font-bold text-slate-500">\${r.studentId}</td>
            <td class="p-3 font-bold text-slate-900">
              \${r.name}
            </td>
            <td class="p-3 text-center">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">\${r.classroom}</span>
            </td>
            <td class="p-3 text-center">
              <input type="number" step="0.1" value="\${r.weight}" onchange="updateBmiValue('\${r.studentId}', 'weight', this.value)" class="w-20 px-2 py-1 border border-slate-300 rounded-lg text-center font-bold text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500">
            </td>
            <td class="p-3 text-center">
              <input type="number" step="0.1" value="\${r.height}" onchange="updateBmiValue('\${r.studentId}', 'height', this.value)" class="w-20 px-2 py-1 border border-slate-300 rounded-lg text-center font-bold text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500">
            </td>
            <td class="p-3 text-center font-black text-slate-800 font-mono">\${Number(r.bmi).toFixed(1)}</td>
            <td class="p-3 text-center">
              <span class="px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-2xs \${badgeColor}">\${r.nutritionStatus}</span>
            </td>
            <td class="p-3 text-center">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold border \${heightBadge}">\${r.heightStatus}</span>
            </td>
            <td class="p-3 text-center">
              <button onclick="recalculateBmiRow('\${r.studentId}')" title="คำนวณใหม่" class="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition">
                <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
              </button>
            </td>
          </tr>
        \`;
      }).join('');
      if (window.lucide) lucide.createIcons();
    }

    function updateBmiValue(stuId, field, val) {
      ensureBmiRecordsLoaded();
      const r = state.ext.bmiRecords.find(x => x.studentId === stuId);
      if (r) {
        r[field] = parseFloat(val) || 0;
        if (r.height > 0) {
          const hM = r.height / 100;
          r.bmi = parseFloat((r.weight / (hM * hM)).toFixed(1));
          if (r.bmi < 16.0) r.nutritionStatus = 'ผอม';
          else if (r.bmi < 18.5) r.nutritionStatus = 'ค่อนข้างผอม';
          else if (r.bmi <= 22.9) r.nutritionStatus = 'สมส่วน';
          else if (r.bmi <= 24.9) r.nutritionStatus = 'ท้วม';
          else if (r.bmi <= 29.9) r.nutritionStatus = 'เริ่มอ้วน';
          else r.nutritionStatus = 'อ้วน';

          let baseH = 155;
          if (r.classroom && r.classroom.startsWith('อ.')) baseH = 108;
          else if (r.classroom && (r.classroom.startsWith('ป.1') || r.classroom.startsWith('ป.2') || r.classroom.startsWith('ป.3'))) baseH = 124;
          else if (r.classroom && r.classroom.startsWith('ป.')) baseH = 142;

          let minH = baseH - 5;
          if (r.height < minH - 6) r.heightStatus = 'เตี้ย';
          else if (r.height < minH) r.heightStatus = 'ค่อนข้างเตี้ย';
          else if (r.height > baseH + 8) r.heightStatus = 'สูงกว่าเกณฑ์';
          else r.heightStatus = 'สูงตามเกณฑ์';
        }
        saveExtendedState();
        renderBmiTable();
      }
    }

    function recalculateBmiRow(stuId) {
      ensureBmiRecordsLoaded();
      const r = state.ext.bmiRecords.find(x => x.studentId === stuId);
      if (r) {
        updateBmiValue(stuId, 'weight', r.weight);
        showToast('คำนวณดัชนี BMI และแปลผลเรียบร้อย');
      }
    }

    function openModalAddBmiEntry() {
      populateStudentSelect('bmiStudentSelect');
      document.getElementById('inputBmiWeight').value = '';
      document.getElementById('inputBmiHeight').value = '';
      document.getElementById('inputBmiDate').value = new Date().toISOString().split('T')[0];
      openModal('modalAddBmiEntry');
    }

    function handleSaveBmiEntry(e) {
      e.preventDefault();
      ensureBmiRecordsLoaded();
      const stuId = document.getElementById('bmiStudentSelect').value;
      const weight = parseFloat(document.getElementById('inputBmiWeight').value) || 0;
      const height = parseFloat(document.getElementById('inputBmiHeight').value) || 0;
      const date = document.getElementById('inputBmiDate').value;

      if (!stuId || weight <= 0 || height <= 0) {
        alert('กรุณากรอกข้อมูลน้ำหนักและส่วนสูงให้ถูกต้อง');
        return;
      }

      let r = state.ext.bmiRecords.find(x => x.studentId === stuId);
      if (r) {
        r.weight = weight;
        r.height = height;
        r.recordedDate = date;
      } else {
        const stuObj = state.ext.dmcStudents.find(x => x.studentId === stuId) || { name: 'นักเรียน', classroom: 'ม.1/1', number: 1 };
        r = {
          studentId: stuId,
          number: stuObj.number || 1,
          name: stuObj.name,
          classroom: stuObj.classroom || 'ม.1/1',
          gender: stuObj.gender || 'ชาย',
          weight,
          height,
          bmi: 0,
          nutritionStatus: 'สมส่วน',
          heightStatus: 'สูงตามเกณฑ์',
          recordedDate: date
        };
        state.ext.bmiRecords.push(r);
      }

      updateBmiValue(stuId, 'weight', weight);
      closeModal('modalAddBmiEntry');
      showToast(\`บันทึกข้อมูลน้ำหนัก-ส่วนสูงของ \${r.name} สำเร็จแล้ว\`);
    }

    function saveBmiRecords() {
      saveExtendedState();
      showToast('💾 บันทึกข้อมูลน้ำหนักและส่วนสูงทั้งหมดเรียบร้อยแล้ว');
    }

    function printBmiReport() {
      ensureBmiRecordsLoaded();
      const selectedClass = document.getElementById('bmiClassFilter') ? document.getElementById('bmiClassFilter').value : 'ม.3/1';
      let recs = state.ext.bmiRecords || [];
      if (selectedClass && selectedClass !== 'all') {
        recs = recs.filter(r => r.classroom === selectedClass);
      }

      let normalCount = 0;
      let overCount = 0;
      let underCount = 0;
      let heightNormalCount = 0;

      recs.forEach(r => {
        if (r.nutritionStatus === 'สมส่วน') normalCount++;
        else if (['ท้วม', 'เริ่มอ้วน', 'อ้วน'].includes(r.nutritionStatus)) overCount++;
        else if (['ค่อนข้างผอม', 'ผอม'].includes(r.nutritionStatus)) underCount++;

        if (r.heightStatus === 'สูงตามเกณฑ์' || r.heightStatus === 'สูงกว่าเกณฑ์') heightNormalCount++;
      });

      let rows = recs.map(r => \`
        <tr>
          <td style="text-align:center; padding:5px 3px; border:1px solid #334155; font-size:10pt;">\${r.number}</td>
          <td style="text-align:center; padding:5px 3px; border:1px solid #334155; font-size:10pt; font-family:monospace;">\${r.studentId}</td>
          <td style="padding:5px 6px; border:1px solid #334155; font-size:10pt; font-weight:bold;">\${r.name}</td>
          <td style="text-align:center; padding:5px 3px; border:1px solid #334155; font-size:10pt;">\${r.classroom}</td>
          <td style="text-align:center; padding:5px 3px; border:1px solid #334155; font-size:10pt;">\${r.weight}</td>
          <td style="text-align:center; padding:5px 3px; border:1px solid #334155; font-size:10pt;">\${r.height}</td>
          <td style="text-align:center; padding:5px 3px; border:1px solid #334155; font-size:10pt; font-weight:bold;">\${Number(r.bmi).toFixed(1)}</td>
          <td style="text-align:center; padding:5px 3px; border:1px solid #334155; font-size:10pt; font-weight:bold;">\${r.nutritionStatus}</td>
          <td style="text-align:center; padding:5px 3px; border:1px solid #334155; font-size:10pt;">\${r.heightStatus}</td>
        </tr>
      \`).join('');

      const html = \`
        <div style="font-family:'Sarabun', 'TH Sarabun New', sans-serif; padding:10px; color:#000;">
          <div style="text-align:center; margin-bottom:12px;">
            <div style="font-size:16pt; font-weight:bold; color:#0f172a;">โรงเรียนดงสวรรค์วิทยา</div>
            <div style="font-size:13pt; font-weight:bold; color:#1e3a8a; margin-top:2px;">
              แบบรายงานสรุปผลการประเมินการเจริญเติบโตและภาวะโภชนาการ (BMI)
            </div>
            <div style="font-size:11pt; color:#475569; margin-top:2px;">
              ภาคเรียนที่ 1 ปีการศึกษา 2569 | [ \${selectedClass === 'all' ? 'รายงานรวมทุกระดับชั้น (346 คน)' : 'ชั้นเรียน ' + selectedClass} ]
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:10pt; font-weight:bold; color:#334155;">
            <div>จำนวนนักเรียนทั้งหมด: \${recs.length} คน</div>
            <div>สมส่วน: \${normalCount} คน | น้ำหนักเกินเกณฑ์: \${overCount} คน | น้ำหนักต่ำกว่าเกณฑ์: \${underCount} คน</div>
          </div>

          <table style="width:100%; border-collapse:collapse; font-size:10pt; border:2px solid #0f172a;">
            <thead>
              <tr style="background:#1e3a8a; color:#ffffff; height:32px;">
                <th style="padding:4px; border:1px solid #334155; width:45px;">เลขที่</th>
                <th style="padding:4px; border:1px solid #334155; width:65px;">รหัส</th>
                <th style="padding:4px; border:1px solid #334155; text-align:left;">ชื่อ - นามสกุล</th>
                <th style="padding:4px; border:1px solid #334155; width:55px;">ชั้น</th>
                <th style="padding:4px; border:1px solid #334155; width:75px;">น้ำหนัก (กก.)</th>
                <th style="padding:4px; border:1px solid #334155; width:75px;">ส่วนสูง (ซม.)</th>
                <th style="padding:4px; border:1px solid #334155; width:65px;">ดัชนี BMI</th>
                <th style="padding:4px; border:1px solid #334155; width:95px;">ภาวะโภชนาการ</th>
                <th style="padding:4px; border:1px solid #334155; width:95px;">เกณฑ์ส่วนสูง</th>
              </tr>
            </thead>
            <tbody>
              \${rows}
            </tbody>
          </table>

          <div style="display:flex; justify-content:space-between; margin-top:25px; text-align:center; font-size:10pt;">
            <div style="width:45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top:4px; font-weight:bold;">( .......................................................... )</div>
              <div style="font-size:9pt; color:#475569; margin-top:2px;">ครูประจำชั้น / ผู้ตรวจวัดโภชนาการ</div>
            </div>
            <div style="width:45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top:4px; font-weight:bold;">( นางรัษฎาภรณ์ ศิริมาตย์ )</div>
              <div style="font-size:9pt; color:#475569; margin-top:2px;">ผู้อำนวยการโรงเรียนดงสวรรค์วิทยา</div>
            </div>
          </div>
        </div>
      \`;

      printDocument(html, 'รายงานภาวะโภชนาการ_BMI_' + selectedClass, 'portrait');
    }

`;

html = html.slice(0, bStart) + newBmiJs + html.slice(bEnd);
console.log('Step 3: BMI JavaScript logic updated.');

// 4. In initDongsawanData: auto-populate bmiRecords
const dmcAnchor = `      // Populate dailyAttendance from real students of currentClass if empty`;
const bmiInitBlock = `      // Populate bmiRecords for all 346 students if empty
      if (!state.ext.bmiRecords || state.ext.bmiRecords.length === 0) {
        state.ext.bmiRecords = DONGSAWAN_346_STUDENTS_TUPLES.map((t, idx) => generateDefaultBmiRecord(t, idx));
      }

` + dmcAnchor;

if (!html.includes(dmcAnchor)) {
  console.error('ERROR: dmcAnchor not found!');
  process.exit(1);
}
html = html.replace(dmcAnchor, bmiInitBlock);
console.log('Step 4: initDongsawanData updated with automatic BMI records population.');

fs.writeFileSync('index.html', html, 'utf8');
console.log('SUCCESS: index.html has been updated with full BMI data and UI!');
