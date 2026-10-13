const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update tab-timetable toolbar buttons
const oldToolbar = `        <div class="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          <button onclick="printTimetableA4Landscape()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5">
            <i data-lucide="printer" class="w-4 h-4"></i> พิมพ์ตารางสอน (PDF)
          </button>
          <button onclick="openModalSubstitute()" class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5">
            <i data-lucide="user-plus" class="w-4 h-4"></i> บันทึกจัดสอนแทน
          </button>
          <button onclick="openModalAddTimetableSlot()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> เพิ่มคาบสอน
          </button>
        </div>`;

const newToolbar = `        <div class="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          <button onclick="openModalManagePeriods()" class="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5" title="ตั้งค่าคาบเรียนและช่วงเวลา">
            <i data-lucide="clock" class="w-4 h-4"></i> คาบเรียน & เวลา
          </button>
          <button onclick="openModalManageSubjectGroups()" class="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5" title="จัดการกลุ่มสาระและสี">
            <i data-lucide="palette" class="w-4 h-4"></i> จัดการกลุ่มสาระ
          </button>
          <button onclick="printTimetableA4Landscape()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5">
            <i data-lucide="printer" class="w-4 h-4"></i> พิมพ์ตารางสอน (PDF)
          </button>
          <button onclick="openModalSubstitute()" class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5">
            <i data-lucide="user-plus" class="w-4 h-4"></i> บันทึกจัดสอนแทน
          </button>
          <button onclick="openModalAddTimetableSlot()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> เพิ่มคาบสอน
          </button>
        </div>`;

if (!html.includes(oldToolbar)) {
  console.error('ERROR: oldToolbar not found!');
  process.exit(1);
}
html = html.replace(oldToolbar, newToolbar);
console.log('Step 1: Timetable toolbar updated.');

// 2. Update Color Legend Bar to dynamic container
const oldLegend = `        <!-- Color Legend Bar -->
        <div class="pt-2.5 border-t border-slate-200/80 flex items-center gap-2 flex-wrap text-xs">
          <span class="text-slate-500 font-bold text-[11px] mr-1 flex items-center gap-1"><i data-lucide="palette" class="w-3.5 h-3.5"></i> กลุ่มสาระ:</span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-900 border border-cyan-300 shadow-2xs">🔵 วิทย์-คอม</span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-2xs">🟣 คณิต</span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs">🔴 ภาษาไทย</span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">🟠 ภาษาต่างประเทศ</span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">🟢 สังคมศึกษา</span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs">🎨 ศิลปะ</span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-100 text-lime-900 border border-lime-300 shadow-2xs">🎾 สุขศึกษา/พละ</span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">⚪ พัฒนาผู้เรียน</span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">🍱 พักกลางวัน</span>
        </div>`;

const newLegend = `        <!-- Color Legend Bar (Dynamic) -->
        <div id="timetableSubjectLegendBar" class="pt-2.5 border-t border-slate-200/80 flex items-center gap-2 flex-wrap text-xs">
          <!-- Rendered dynamically by renderSubjectGroupLegend() -->
        </div>`;

if (!html.includes(oldLegend)) {
  console.error('ERROR: oldLegend not found!');
  process.exit(1);
}
html = html.replace(oldLegend, newLegend);
console.log('Step 2: Legend bar updated to dynamic container.');

// 3. Add modalManageSubjectGroups and modalManagePeriods right before modalAddUser
const userModalAnchor = `  <!-- ================================================================= -->
  <!-- MODAL: ADD / EDIT USER (เพิ่ม/แก้ไขบัญชีผู้ใช้และสิทธิ์) -->
  <!-- ================================================================= -->`;

const newModals = `  <!-- ================================================================= -->
  <!-- MODAL: MANAGE SUBJECT GROUPS (จัดการกลุ่มสาระการเรียนรู้ & ธีมสี) -->
  <!-- ================================================================= -->
  <div id="modalManageSubjectGroups" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl fade-in max-h-[92vh] flex flex-col">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black">
            <i data-lucide="palette" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-extrabold text-slate-900 text-base sm:text-lg">จัดการกลุ่มสาระการเรียนรู้ & ธีมสี</h3>
            <p class="text-xs text-slate-500">ปรับเพิ่ม ลด หรือแก้ไขกลุ่มสาระ คำนำหน้ารหัสวิชา และสีบัตรตารางสอน</p>
          </div>
        </div>
        <button onclick="closeModal('modalManageSubjectGroups')" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Add / Edit Group Form -->
      <div id="subjectGroupFormBox" class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <div class="flex items-center justify-between">
          <span id="subjectGroupFormTitle" class="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <i data-lucide="plus-circle" class="w-4 h-4 text-teal-600"></i> เพิ่มกลุ่มสาระใหม่
          </span>
          <button id="btnCancelEditGroup" onclick="resetSubjectGroupForm()" class="hidden text-xs text-slate-500 hover:text-slate-800 underline font-semibold">ยกเลิกการแก้ไข</button>
        </div>
        <input type="hidden" id="editSubjectGroupId" value="">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ชื่อกลุ่มสาระ (ทางการ) *</label>
            <input type="text" id="inputGroupName" placeholder="เช่น วิทยาศาสตร์และเทคโนโลยี" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ชื่อย่อ (แสดงบนป้าย) *</label>
            <input type="text" id="inputGroupShort" placeholder="เช่น วิทย์-คอม" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white" required>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-700 mb-1">คำนำหน้า/รหัสวิชาตรวจจับ (คั่นด้วยจุลภาค) *</label>
            <input type="text" id="inputGroupKeywords" placeholder="เช่น ว, วิทย์, ฟิสิกส์, เคมี, ชีว, คอม" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ไอคอน / Emoji</label>
            <input type="text" id="inputGroupDot" placeholder="เช่น 🔵 หรือ 💡" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white">
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">โทนสีบัตรตารางสอน</label>
            <select id="selectGroupColor" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white">
              <option value="cyan">🔵 ฟ้าสดใส (Cyan)</option>
              <option value="indigo">🟣 ม่วงคราม (Indigo)</option>
              <option value="rose">🔴 แดง/ชมพู (Rose)</option>
              <option value="amber">🟠 ส้มเหลือง (Amber)</option>
              <option value="orange">🍱 ส้มสด (Orange)</option>
              <option value="emerald">🟢 เขียวมรกต (Emerald)</option>
              <option value="purple">🎨 ม่วงสด (Purple)</option>
              <option value="lime">🎾 เขียวมะนาว (Lime)</option>
              <option value="teal">🛠️ เขียวน้ำทะเล (Teal)</option>
              <option value="blue">🔷 น้ำเงิน (Blue)</option>
              <option value="slate">⚪ เทาสุภาพ (Slate)</option>
            </select>
          </div>
          <div class="flex items-center gap-2 pt-2 sm:pt-4">
            <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input type="checkbox" id="checkGroupIsBreak" class="rounded text-amber-600 focus:ring-amber-500 w-4 h-4">
              <span>เป็นช่วงเวลาพัก (เช่น พักกลางวัน)</span>
            </label>
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2 border-t border-slate-200">
          <button type="button" onclick="saveSubjectGroupFromForm()" class="btn-ega-primary text-xs py-2 px-4 flex items-center gap-1.5">
            <i data-lucide="check" class="w-4 h-4"></i> บันทึกกลุ่มสาระ
          </button>
        </div>
      </div>

      <!-- Groups List Table -->
      <div class="flex-1 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-3 bg-white min-h-[160px]">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <span class="text-xs font-extrabold text-slate-600">รายการกลุ่มสาระทั้งหมด (<span id="countSubjectGroups">0</span>)</span>
          <button onclick="resetSubjectGroupsToDefault()" class="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 underline">
            <i data-lucide="rotate-ccw" class="w-3 h-3"></i> คืนค่าเริ่มต้น (8 กลุ่มสาระ)
          </button>
        </div>
        <div id="subjectGroupsTableBody" class="space-y-2"></div>
      </div>

      <div class="flex justify-end pt-2 border-t border-slate-200">
        <button type="button" onclick="closeModal('modalManageSubjectGroups')" class="btn-ega-secondary text-xs py-2 px-5 font-bold">ปิดหน้าต่าง</button>
      </div>
    </div>
  </div>

  <!-- ================================================================= -->
  <!-- MODAL: MANAGE PERIODS & TIMES (ตั้งค่าคาบเรียน & ช่วงเวลา) -->
  <!-- ================================================================= -->
  <div id="modalManagePeriods" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl fade-in max-h-[92vh] flex flex-col">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-extrabold text-slate-900 text-base sm:text-lg">ตั้งค่าคาบเรียน & ช่วงเวลาสอน</h3>
            <p class="text-xs text-slate-500">เพิ่ม ลด ปรับเปลี่ยนชื่อคาบ เวลาเริ่มต้น-สิ้นสุด และกำหนดคาบพักกลางวันได้อย่างอิสระ</p>
          </div>
        </div>
        <button onclick="closeModal('modalManagePeriods')" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Add / Edit Period Form -->
      <div id="periodFormBox" class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <div class="flex items-center justify-between">
          <span id="periodFormTitle" class="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <i data-lucide="plus-circle" class="w-4 h-4 text-indigo-600"></i> เพิ่มคาบเรียนใหม่
          </span>
          <button id="btnCancelEditPeriod" onclick="resetPeriodForm()" class="hidden text-xs text-slate-500 hover:text-slate-800 underline font-semibold">ยกเลิกการแก้ไข</button>
        </div>
        <input type="hidden" id="editPeriodId" value="">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ลำดับคาบ (ID) *</label>
            <input type="number" id="inputPeriodId" min="1" max="20" placeholder="1" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white" required>
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-700 mb-1">ชื่อเรียกคาบเรียน *</label>
            <input type="text" id="inputPeriodName" placeholder="เช่น คาบที่ 1 หรือ พักกลางวัน" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ช่วงเวลา (เช่น 08.30-09.20)</label>
            <input type="text" id="inputPeriodTime" placeholder="08.30-09.20" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm bg-white font-mono">
          </div>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
            <input type="checkbox" id="checkPeriodIsBreak" class="rounded text-amber-600 focus:ring-amber-500 w-4 h-4">
            <span>🍱 เป็นเวลาพักรับประทานอาหารกลางวัน (Lunch Break)</span>
          </label>
          <button type="button" onclick="savePeriodFromForm()" class="btn-ega-primary text-xs py-2 px-4 flex items-center justify-center gap-1.5">
            <i data-lucide="check" class="w-4 h-4"></i> บันทึกคาบเรียน
          </button>
        </div>
      </div>

      <!-- Periods List Table -->
      <div class="flex-1 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-3 bg-white min-h-[160px]">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <span class="text-xs font-extrabold text-slate-600">รายการคาบเรียนทั้งหมด (<span id="countPeriods">0</span> คาบ)</span>
          <button onclick="resetPeriodsToDefault()" class="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 underline">
            <i data-lucide="rotate-ccw" class="w-3 h-3"></i> คืนค่ามาตรฐาน (8 คาบ)
          </button>
        </div>
        <div id="periodsTableBody" class="space-y-2"></div>
      </div>

      <div class="flex justify-end pt-2 border-t border-slate-200">
        <button type="button" onclick="closeModal('modalManagePeriods')" class="btn-ega-secondary text-xs py-2 px-5 font-bold">ปิดหน้าต่าง</button>
      </div>
    </div>
  </div>

` + userModalAnchor;

if (!html.includes(userModalAnchor)) {
  console.error('ERROR: userModalAnchor not found!');
  process.exit(1);
}
html = html.replace(userModalAnchor, newModals);
console.log('Step 3: New modals modalManageSubjectGroups & modalManagePeriods inserted.');

// 4. Insert Global Configurations above DEFAULT_MOCK_DATA
const mockDataAnchor = `    // =========================================================================
    // COMPREHENSIVE MOCK & FALLBACK DATASET (ชุดข้อมูลตัวอย่างจำลองสมบูรณ์แบบ)
    // =========================================================================
    const DEFAULT_MOCK_DATA = {`;

const newConfigBlock = `    // =========================================================================
    // TIMETABLE PERIODS & SUBJECT GROUPS CONFIGURATION (คาบเรียน & กลุ่มสาระ)
    // =========================================================================
    const DEFAULT_TIMETABLE_PERIODS = [
      { id: 1, name: 'คาบที่ 1', time: '08.30-09.20', isBreak: false },
      { id: 2, name: 'คาบที่ 2', time: '09.20-10.10', isBreak: false },
      { id: 3, name: 'คาบที่ 3', time: '10.10-11.00', isBreak: false },
      { id: 4, name: 'คาบที่ 4 (พักกลางวัน)', time: '11.00-11.50', isBreak: true },
      { id: 5, name: 'คาบที่ 5', time: '12.40-13.30', isBreak: false },
      { id: 6, name: 'คาบที่ 6', time: '13.30-14.20', isBreak: false },
      { id: 7, name: 'คาบที่ 7', time: '14.20-15.10', isBreak: false },
      { id: 8, name: 'คาบที่ 8', time: '15.10-16.00', isBreak: false }
    ];

    const DEFAULT_SUBJECT_GROUPS = [
      { id: 'sci', name: 'วิทยาศาสตร์และเทคโนโลยี', shortName: 'วิทย์-คอม', keywords: 'ว,วิทย์,ฟิสิกส์,เคมี,ชีว,คอม,คำนวณ,เทคโนโลยี', color: 'cyan', dot: '🔵' },
      { id: 'math', name: 'คณิตศาสตร์', shortName: 'คณิต', keywords: 'ค,คณิต,เลข', color: 'indigo', dot: '🟣' },
      { id: 'thai', name: 'ภาษาไทย', shortName: 'ภาษาไทย', keywords: 'ท,ไทย,วรรณคดี', color: 'rose', dot: '🔴' },
      { id: 'foreign', name: 'ภาษาต่างประเทศ', shortName: 'ภาษาต่างประเทศ', keywords: 'อ,อังกฤษ,English,ภาษา,จีน,ญี่ปุ่น,ฝรั่งเศส,เยอรมัน,เกาหลี', color: 'amber', dot: '🟠' },
      { id: 'social', name: 'สังคมศึกษา ศาสนา และวัฒนธรรม', shortName: 'สังคมศึกษา', keywords: 'ส,สังคม,ประวัติศาสตร์,พุทธ,ภูมิศาสตร์,หน้าที่พลเมือง', color: 'emerald', dot: '🟢' },
      { id: 'art', name: 'ศิลปะ ดนตรี นาฏศิลป์', shortName: 'ศิลปะ', keywords: 'ศ,ศิลปะ,ดนตรี,นาฏศิลป์,ทัศนศิลป์', color: 'purple', dot: '🎨' },
      { id: 'pe', name: 'สุขศึกษาและพลศึกษา', shortName: 'สุขศึกษา/พละ', keywords: 'พ,สุขศึกษา,พลศึกษา,พละ,กีฬา', color: 'lime', dot: '🎾' },
      { id: 'work', name: 'การงานอาชีพ', shortName: 'การงานอาชีพ', keywords: 'ง,การงาน,อาชีพ,เกษตร,คหกรรม,ช่าง', color: 'teal', dot: '🛠️' },
      { id: 'activity', name: 'กิจกรรมพัฒนาผู้เรียน', shortName: 'พัฒนาผู้เรียน', keywords: 'กิจกรรม,แนะแนว,ลูกเสือ,เนตรนารี,ชุมนุม,โฮมรูม,เพื่อสังคม,ยุวกาชาด', color: 'slate', dot: '⚪' },
      { id: 'lunch', name: 'พักกลางวัน', shortName: 'พักกลางวัน', keywords: 'พักกลางวัน,รับประทานอาหาร,อาหารกลางวัน', color: 'orange', dot: '🍱', isBreak: true }
    ];

    const SUBJECT_COLOR_THEMES = {
      cyan: { label: 'ฟ้าสดใส (Cyan)', bg: 'bg-gradient-to-b from-cyan-50/90 to-blue-50/80 hover:from-cyan-100 hover:to-blue-100', border: 'border-cyan-300', badge: 'bg-cyan-100 text-cyan-900 border border-cyan-300', text: 'text-cyan-950', dot: '🔵' },
      indigo: { label: 'ม่วงคราม (Indigo)', bg: 'bg-gradient-to-b from-indigo-50/90 to-violet-50/80 hover:from-indigo-100 hover:to-violet-100', border: 'border-indigo-300', badge: 'bg-indigo-100 text-indigo-900 border border-indigo-300', text: 'text-indigo-950', dot: '🟣' },
      rose: { label: 'แดง/ชมพู (Rose)', bg: 'bg-gradient-to-b from-rose-50/90 to-red-50/80 hover:from-rose-100 hover:to-red-100', border: 'border-rose-300', badge: 'bg-rose-100 text-rose-900 border border-rose-300', text: 'text-rose-950', dot: '🔴' },
      amber: { label: 'ส้มเหลือง (Amber)', bg: 'bg-gradient-to-b from-amber-50/90 to-yellow-50/80 hover:from-amber-100 hover:to-yellow-100', border: 'border-amber-300', badge: 'bg-amber-100 text-amber-900 border border-amber-300', text: 'text-amber-950', dot: '🟠' },
      orange: { label: 'ส้มสด (Orange)', bg: 'bg-gradient-to-b from-amber-50 to-orange-50/70', border: 'border-amber-300', badge: 'bg-amber-100 text-amber-900 border border-amber-300', text: 'text-amber-950', dot: '🍱' },
      emerald: { label: 'เขียวมรกต (Emerald)', bg: 'bg-gradient-to-b from-emerald-50/90 to-teal-50/80 hover:from-emerald-100 hover:to-teal-100', border: 'border-emerald-300', badge: 'bg-emerald-100 text-emerald-900 border border-emerald-300', text: 'text-emerald-950', dot: '🟢' },
      purple: { label: 'ม่วงสด (Purple)', bg: 'bg-gradient-to-b from-purple-50/90 to-fuchsia-50/80 hover:from-purple-100 hover:to-fuchsia-100', border: 'border-purple-300', badge: 'bg-purple-100 text-purple-900 border border-purple-300', text: 'text-purple-950', dot: '🎨' },
      lime: { label: 'เขียวมะนาว (Lime)', bg: 'bg-gradient-to-b from-lime-50/90 to-green-50/80 hover:from-lime-100 hover:to-green-100', border: 'border-lime-300', badge: 'bg-lime-100 text-lime-900 border border-lime-300', text: 'text-lime-950', dot: '🎾' },
      teal: { label: 'เขียวน้ำทะเล (Teal)', bg: 'bg-gradient-to-b from-teal-50/90 to-cyan-50/80 hover:from-teal-100 hover:to-cyan-100', border: 'border-teal-300', badge: 'bg-teal-100 text-teal-900 border border-teal-300', text: 'text-teal-950', dot: '🛠️' },
      blue: { label: 'น้ำเงิน (Blue)', bg: 'bg-gradient-to-b from-blue-50/90 to-indigo-50/80 hover:from-blue-100 hover:to-indigo-100', border: 'border-blue-300', badge: 'bg-blue-100 text-blue-900 border border-blue-300', text: 'text-blue-950', dot: '🔷' },
      slate: { label: 'เทาสุภาพ (Slate)', bg: 'bg-gradient-to-b from-slate-50 to-slate-100/90 hover:from-slate-100 hover:to-slate-200/90', border: 'border-slate-300', badge: 'bg-slate-200 text-slate-800 border border-slate-300', text: 'text-slate-900', dot: '⚪' }
    };

    function normalizePeriods(raw) {
      if (!Array.isArray(raw) || raw.length === 0) return [ ...DEFAULT_TIMETABLE_PERIODS ];
      return raw.map((p, idx) => {
        if (typeof p === 'number' || typeof p === 'string') {
          const num = parseInt(p) || (idx + 1);
          const defaultMatch = DEFAULT_TIMETABLE_PERIODS.find(d => d.id === num);
          if (defaultMatch) return { ...defaultMatch };
          return { id: num, name: 'คาบที่ ' + num, time: '', isBreak: num === 4 };
        }
        return {
          id: parseInt(p.id || p.period) || (idx + 1),
          name: p.name || ('คาบที่ ' + (p.id || p.period || (idx + 1))),
          time: p.time || '',
          isBreak: !!p.isBreak
        };
      });
    }

` + mockDataAnchor;

if (!html.includes(mockDataAnchor)) {
  console.error('ERROR: mockDataAnchor not found!');
  process.exit(1);
}
html = html.replace(mockDataAnchor, newConfigBlock);
console.log('Step 4: Global constants and normalizePeriods added.');

// 5. Update initStateWithMock to load subjectGroups & periods properly
const oldInitMockPeriods = `      state.periods = [ ...DEFAULT_MOCK_DATA.periods ];
      state.days = [ ...DEFAULT_MOCK_DATA.days ];
      periodsData = [ ...DEFAULT_MOCK_DATA.periods ];
      daysData = [ ...DEFAULT_MOCK_DATA.days ];`;

const newInitMockPeriods = `      // Load & normalize custom periods
      try {
        const savedPeriods = localStorage.getItem('fm_timetable_periods');
        if (savedPeriods) state.periods = JSON.parse(savedPeriods);
        else if (savedCore && savedCore.periods) state.periods = savedCore.periods;
      } catch (e) {}
      state.periods = normalizePeriods(state.periods || DEFAULT_TIMETABLE_PERIODS);
      periodsData = state.periods;

      // Load custom subject groups
      try {
        const savedGroups = localStorage.getItem('fm_subject_groups');
        if (savedGroups) state.subjectGroups = JSON.parse(savedGroups);
      } catch (e) {}
      if (!state.subjectGroups || !Array.isArray(state.subjectGroups) || state.subjectGroups.length === 0) {
        state.subjectGroups = [ ...DEFAULT_SUBJECT_GROUPS ];
      }

      state.days = (savedCore && savedCore.days) ? savedCore.days : [ ...DEFAULT_MOCK_DATA.days ];
      daysData = [ ...state.days ];`;

if (!html.includes(oldInitMockPeriods)) {
  console.error('ERROR: oldInitMockPeriods not found!');
  process.exit(1);
}
html = html.replace(oldInitMockPeriods, newInitMockPeriods);
console.log('Step 5: initStateWithMock updated for custom periods and subject groups.');

// 6. Update getSubjectTheme and all timetable functions
const oldSubjectThemeStart = `    function getSubjectTheme(subject) {`;
const oldTimetableSlotConflictAnchor = `    async function checkSlotConflict() {`;

const startIdx = html.indexOf(oldSubjectThemeStart);
const endIdx = html.indexOf(oldTimetableSlotConflictAnchor);

if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
  console.error('ERROR: getSubjectTheme or checkSlotConflict anchor not found!');
  process.exit(1);
}

const replacementJs = `    // =========================================================================
    // DYNAMIC SUBJECT THEMES & TIMETABLE GRID (กลุ่มสาระ & ตารางสอน)
    // =========================================================================
    function getSubjectTheme(subject) {
      if (!subject) return { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-900', badge: 'bg-slate-200 text-slate-800 border-slate-300' };
      const s = subject.trim();
      const groups = (state && state.subjectGroups && state.subjectGroups.length > 0) ? state.subjectGroups : DEFAULT_SUBJECT_GROUPS;

      // Check lunch break exact match first
      const lunchGrp = groups.find(g => g.isBreak || g.id === 'lunch');
      if (s === 'พักกลางวัน' || (lunchGrp && (s.includes('พักกลางวัน') || s === lunchGrp.name))) {
        const t = SUBJECT_COLOR_THEMES[lunchGrp ? lunchGrp.color : 'orange'] || SUBJECT_COLOR_THEMES.orange;
        return { ...t, isBreak: true, groupName: lunchGrp ? lunchGrp.name : 'พักกลางวัน', groupShort: 'พักกลางวัน' };
      }

      for (const grp of groups) {
        const kws = (grp.keywords || '').split(',').map(k => k.trim()).filter(Boolean);
        const match = kws.some(k => {
          if (k.length === 1) return s.startsWith(k);
          return s.includes(k);
        }) || (grp.name && s.includes(grp.name)) || (grp.shortName && s.includes(grp.shortName));

        if (match) {
          const themeInfo = SUBJECT_COLOR_THEMES[grp.color] || SUBJECT_COLOR_THEMES.slate;
          return {
            ...themeInfo,
            isBreak: !!grp.isBreak,
            groupName: grp.name,
            groupShort: grp.shortName || grp.name
          };
        }
      }

      // Default fallback
      const defaultTheme = SUBJECT_COLOR_THEMES.slate;
      return {
        ...defaultTheme,
        isBreak: false,
        groupName: 'ทั่วไป',
        groupShort: 'ทั่วไป'
      };
    }

    function renderSubjectGroupLegend() {
      const container = document.getElementById('timetableSubjectLegendBar');
      if (!container) return;
      const groups = (state && state.subjectGroups && state.subjectGroups.length > 0) ? state.subjectGroups : DEFAULT_SUBJECT_GROUPS;

      let html = \`
        <span class="text-slate-500 font-bold text-[11px] mr-1 flex items-center gap-1">
          <i data-lucide="palette" class="w-3.5 h-3.5"></i> กลุ่มสาระ:
        </span>
      \`;

      groups.forEach(grp => {
        const theme = SUBJECT_COLOR_THEMES[grp.color] || SUBJECT_COLOR_THEMES.slate;
        const dot = grp.dot || theme.dot || '🔵';
        const label = grp.shortName || grp.name;
        html += \`
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold \${theme.badge} shadow-2xs">
            \${dot} \${label}
          </span>
        \`;
      });

      html += \`
        <div class="ml-auto flex items-center gap-2">
          <button onclick="openModalManageSubjectGroups()" class="text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition">
            <i data-lucide="settings" class="w-3.5 h-3.5"></i> จัดการกลุ่มสาระ
          </button>
          <button onclick="openModalManagePeriods()" class="text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition">
            <i data-lucide="clock" class="w-3.5 h-3.5"></i> ตั้งค่าคาบ & เวลา
          </button>
        </div>
      \`;
      container.innerHTML = html;
      if (window.lucide) lucide.createIcons();
    }

    function getDayBadge(day) {
      const map = {
        'จันทร์': { bg: 'bg-amber-50 text-amber-900', border: 'border-l-4 border-l-amber-500', pill: 'bg-amber-400 text-blue-950 font-black', tag: 'จันทร์', sub: 'MON' },
        'อังคาร': { bg: 'bg-pink-50 text-pink-900', border: 'border-l-4 border-l-pink-500', pill: 'bg-pink-400 text-white font-black', tag: 'อังคาร', sub: 'TUE' },
        'พุธ': { bg: 'bg-emerald-50 text-emerald-900', border: 'border-l-4 border-l-emerald-500', pill: 'bg-emerald-500 text-white font-black', tag: 'พุธ', sub: 'WED' },
        'พฤหัสบดี': { bg: 'bg-orange-50 text-orange-900', border: 'border-l-4 border-l-orange-500', pill: 'bg-orange-400 text-white font-black', tag: 'พฤหัสฯ', sub: 'THU' },
        'ศุกร์': { bg: 'bg-sky-50 text-sky-900', border: 'border-l-4 border-l-sky-500', pill: 'bg-sky-400 text-white font-black', tag: 'ศุกร์', sub: 'FRI' }
      };
      return map[day] || { bg: 'bg-slate-50 text-slate-800', border: 'border-l-4 border-l-slate-400', pill: 'bg-slate-500 text-white font-black', tag: day, sub: '' };
    }

    function populatePeriodDropdowns() {
      const ttPeriodSelect = document.getElementById('ttPeriodSelect');
      const subPeriod = document.getElementById('subPeriod');
      const periods = (periodsData && periodsData.length > 0) ? periodsData : DEFAULT_TIMETABLE_PERIODS;

      const optionsHtml = periods.map(p => {
        const pNum = typeof p === 'object' ? (p.period || p.id || 1) : p;
        const pName = typeof p === 'object' && p.name ? p.name : \`คาบ \${pNum}\`;
        const pTime = typeof p === 'object' && p.time ? \` (\${p.time})\` : '';
        const breakTag = (typeof p === 'object' && p.isBreak) ? ' [🍱 พักกลางวัน]' : '';
        return \`<option value="\${pNum}">\${pName}\${pTime}\${breakTag}</option>\`;
      }).join('');

      if (ttPeriodSelect) ttPeriodSelect.innerHTML = optionsHtml;
      if (subPeriod) subPeriod.innerHTML = optionsHtml;
    }

    async function loadTimetableData() {
      // 1. Load custom periods & subject groups from localStorage
      try {
        const savedPeriods = localStorage.getItem('fm_timetable_periods');
        if (savedPeriods) state.periods = JSON.parse(savedPeriods);
      } catch (e) {}
      state.periods = normalizePeriods(state.periods || DEFAULT_TIMETABLE_PERIODS);
      periodsData = state.periods;

      try {
        const savedGroups = localStorage.getItem('fm_subject_groups');
        if (savedGroups) state.subjectGroups = JSON.parse(savedGroups);
      } catch (e) {}
      if (!state.subjectGroups || !Array.isArray(state.subjectGroups) || state.subjectGroups.length === 0) {
        state.subjectGroups = [ ...DEFAULT_SUBJECT_GROUPS ];
      }

      try {
        const data = await callBackend('getTimetables');
        if (data && data.timetables && data.timetables.length > 0) {
          timetablesList = data.timetables;
          substituteList = data.substitutes || [];
          if (data.periods && data.periods.length > 0 && !localStorage.getItem('fm_timetable_periods')) {
            periodsData = normalizePeriods(data.periods);
            state.periods = periodsData;
          }
          daysData = data.days || daysData;
        } else {
          let savedCore = null;
          try {
            const raw = localStorage.getItem('fm_core_data');
            if (raw) savedCore = JSON.parse(raw);
          } catch(e) {}
          if (savedCore && Array.isArray(savedCore.timetables) && savedCore.timetables.length > 0) {
            timetablesList = savedCore.timetables;
            substituteList = savedCore.substitutes || [];
          } else {
            timetablesList = [ ...DEFAULT_MOCK_DATA.timetables ];
            substituteList = [ ...DEFAULT_MOCK_DATA.substitutes ];
          }
          daysData = [ ...DEFAULT_MOCK_DATA.days ];
        }
      } catch (e) {
        let savedCore = null;
        try {
          const raw = localStorage.getItem('fm_core_data');
          if (raw) savedCore = JSON.parse(raw);
        } catch(e) {}
        if (savedCore && Array.isArray(savedCore.timetables) && savedCore.timetables.length > 0) {
          timetablesList = savedCore.timetables;
          substituteList = savedCore.substitutes || [];
        } else {
          timetablesList = [ ...DEFAULT_MOCK_DATA.timetables ];
          substituteList = [ ...DEFAULT_MOCK_DATA.substitutes ];
        }
        daysData = [ ...DEFAULT_MOCK_DATA.days ];
      }

      // Ensure every slot has an id
      timetablesList.forEach((t, i) => {
        if (!t.id) t.id = 'TT_' + t.day + '_' + t.period + '_' + (t.classroom || i);
      });

      // Populate Classroom dropdown
      const classSelect = document.getElementById('timetableClassSelect');
      if (classSelect) {
        const classes = (state.classrooms && state.classrooms.length > 0) ? state.classrooms : DEFAULT_MOCK_DATA.classrooms;
        classSelect.innerHTML = classes.map(c => \`<option value="\${c}">ชั้น \${c}</option>\`).join('');
      }

      // Populate Teacher dropdown
      const teacherSelect = document.getElementById('timetableTeacherSelect');
      if (teacherSelect) {
        const teachers = (state.teachers && state.teachers.length > 0) ? state.teachers : DEFAULT_MOCK_DATA.teachers;
        teacherSelect.innerHTML = teachers.map(t => \`<option value="\${t.name}">ครู\${t.name}</option>\`).join('');
      }

      // Populate Room dropdown
      const roomSelect = document.getElementById('timetableRoomSelect');
      if (roomSelect) {
        const rooms = (state.rooms && state.rooms.length > 0) ? state.rooms : DEFAULT_MOCK_DATA.rooms;
        roomSelect.innerHTML = rooms.map(r => \`<option value="\${r}">\${r}</option>\`).join('');
      }

      populatePeriodDropdowns();
      renderSubjectGroupLegend();
      renderTimetableGrid();
      renderSubstituteTable();
    }

    function quickAddSlot(day, period) {
      openModalAddTimetableSlot();
      if (document.getElementById('ttDaySelect')) document.getElementById('ttDaySelect').value = day;
      if (document.getElementById('ttPeriodSelect')) document.getElementById('ttPeriodSelect').value = period;
      const currentClass = document.getElementById('timetableClassSelect') ? document.getElementById('timetableClassSelect').value : 'ม.1/1';
      if (document.getElementById('ttClassroomSelect')) document.getElementById('ttClassroomSelect').value = currentClass;
      checkSlotConflict();
    }

    function renderTimetableGrid() {
      const table = document.getElementById('timetableMainGrid');
      if (!table) return;

      const currentClass = document.getElementById('timetableClassSelect') ? document.getElementById('timetableClassSelect').value : 'ม.1/1';
      const currentTeacher = document.getElementById('timetableTeacherSelect') ? document.getElementById('timetableTeacherSelect').value : '';
      const currentRoom = document.getElementById('timetableRoomSelect') ? document.getElementById('timetableRoomSelect').value : '';

      // Update Summary Badge / Header Info
      let targetTitle = 'ชั้น ' + currentClass;
      if (currentTimetableMode === 'teacher') targetTitle = currentTeacher ? 'ครู' + currentTeacher : 'ตารางรายครู';
      else if (currentTimetableMode === 'room') targetTitle = currentRoom ? currentRoom : 'ตารางรายห้อง';
      if (document.getElementById('ttSummaryTargetTitle')) document.getElementById('ttSummaryTargetTitle').textContent = targetTitle;

      let academicCount = 0;
      let activityCount = 0;

      // Header row
      let html = \`
        <thead>
          <tr class="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-b-2 border-amber-400 text-xs">
            <th class="p-3.5 border-r border-slate-700/80 w-24 uppercase font-extrabold tracking-wider text-amber-300">
              วัน / คาบ
            </th>
      \`;

      periodsData.forEach(p => {
        const pNum = typeof p === 'object' ? (p.period || p.id || 1) : p;
        const pName = typeof p === 'object' && p.name ? p.name : \`คาบที่ \${pNum}\`;
        const pTimes = ['08.30-09.20', '09.20-10.10', '10.10-11.00', '11.00-11.50', '12.40-13.30', '13.30-14.20', '14.20-15.10', '15.10-16.00'];
        const pTime = typeof p === 'object' && p.time ? p.time : (pTimes[pNum - 1] || '');
        const isBreak = typeof p === 'object' ? (p.isBreak ?? (pNum === 4)) : (pNum === 4);

        if (isBreak) {
          html += \`
            <th class="p-2.5 border-r border-slate-700/80 text-center bg-amber-500/20 min-w-[130px]">
              <span class="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-blue-950 shadow-2xs">
                🍱 \${pName}
              </span>
              <div class="text-[10px] text-amber-300 font-mono font-medium mt-1">\${pTime || 'พักกลางวัน'}</div>
            </th>
          \`;
        } else {
          html += \`
            <th class="p-2.5 border-r border-slate-700/80 text-center min-w-[125px]">
              <span class="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-800/80 text-blue-100 border border-blue-600/60 shadow-2xs">
                \${pName}
              </span>
              <div class="text-[10px] text-blue-200/80 font-mono font-medium mt-1">\${pTime || ''}</div>
            </th>
          \`;
        }
      });
      html += \`</tr></thead><tbody class="divide-y divide-slate-200 bg-white">\`;

      daysData.forEach(day => {
        const dayBadge = getDayBadge(day);
        html += \`
          <tr class="hover:bg-slate-50/40 transition">
            <td class="p-2.5 border-r border-slate-200 align-middle \${dayBadge.bg} \${dayBadge.border} text-center">
              <span class="inline-block px-2.5 py-1 rounded-lg text-xs shadow-2xs \${dayBadge.pill}">
                \${dayBadge.tag}
              </span>
              <div class="text-[10px] font-mono font-bold opacity-75 mt-0.5 tracking-wider text-slate-700">\${dayBadge.sub}</div>
            </td>
        \`;

        periodsData.forEach(p => {
          const pNum = typeof p === 'object' ? (p.period || p.id || 1) : p;
          const pName = typeof p === 'object' && p.name ? p.name : \`คาบที่ \${pNum}\`;
          const isBreak = typeof p === 'object' ? (p.isBreak ?? (pNum === 4)) : (pNum === 4);

          // Find slot based on current mode
          let slot = null;
          if (currentTimetableMode === 'classroom') {
            slot = timetablesList.find(t => t.day === day && parseInt(t.period) === parseInt(pNum) && t.classroom === currentClass);
          } else if (currentTimetableMode === 'teacher') {
            slot = timetablesList.find(t => t.day === day && parseInt(t.period) === parseInt(pNum) && (
              (t.teacher && t.teacher.includes(currentTeacher)) ||
              (t.teacherName && t.teacherName.includes(currentTeacher))
            ));
          } else if (currentTimetableMode === 'room') {
            slot = timetablesList.find(t => t.day === day && parseInt(t.period) === parseInt(pNum) && t.room === currentRoom);
          }

          // Lunch Break Column
          if (isBreak || (slot && (slot.subject === 'พักกลางวัน' || slot.isBreak))) {
            html += \`
              <td class="p-1.5 border-r border-slate-200 align-middle bg-amber-50/50">
                <div class="h-full min-h-[96px] rounded-xl p-2 border border-amber-200/90 bg-gradient-to-b from-amber-50 to-orange-50/70 shadow-2xs flex flex-col items-center justify-center text-center">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900 shadow-2xs">
                    🍱 \${pName}
                  </span>
                  <div class="text-xs font-black text-amber-950 mt-1.5">รับประทานอาหาร</div>
                  <div class="text-[10px] text-amber-800 font-semibold mt-0.5">โรงอาหารกลาง</div>
                </div>
              </td>
            \`;
            return;
          }

          if (slot) {
            const teacher = slot.teacherName || slot.teacher || '';
            const room = slot.room || '-';
            const theme = getSubjectTheme(slot.subject);

            // Separate subject code and name
            let codePart = '';
            let titlePart = slot.subject;
            const parts = slot.subject.split(' ');
            if (parts.length > 1 && parts[0].length <= 8) {
              codePart = parts[0];
              titlePart = parts.slice(1).join(' ');
            }

            if (slot.subject.includes('กิจกรรม') || slot.subject.includes('ลูกเสือ') || slot.subject.includes('ชุมนุม') || slot.subject.includes('แนะแนว') || slot.subject.includes('โฮมรูม')) {
              activityCount++;
            } else {
              academicCount++;
            }

            html += \`
              <td class="p-1.5 border-r border-slate-200 align-middle">
                <div class="h-full min-h-[96px] rounded-xl p-2 sm:p-2.5 border \${theme.border} \${theme.bg} shadow-2xs transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between text-left relative group">
                  <div>
                    <div class="flex items-center justify-between gap-1">
                      \${codePart ? \`<span class="px-1.5 py-0.5 rounded text-[10px] font-mono font-black \${theme.badge}">\${codePart}</span>\` : ''}
                      <span class="text-[10px] text-slate-500 font-mono font-bold">\${slot.classroom || currentClass}</span>
                    </div>
                    <div class="font-extrabold text-xs sm:text-[13px] \${theme.text} mt-1 leading-snug line-clamp-2">
                      \${titlePart}
                    </div>
                  </div>

                  <div class="mt-2 pt-1 border-t border-slate-200/60 space-y-0.5">
                    \${teacher && teacher !== '-' ? \`
                      <div class="text-[11px] text-slate-700 font-semibold flex items-center gap-1 truncate bg-white/70 py-0.5 px-1.5 rounded border border-slate-200/50 shadow-2xs">
                        <i data-lucide="user" class="w-3 h-3 text-slate-400 flex-shrink-0"></i>
                        <span class="truncate">\${teacher}</span>
                      </div>
                    \` : ''}
                    <div class="text-[10px] text-blue-700 font-semibold flex items-center gap-1 truncate">
                      <i data-lucide="map-pin" class="w-3 h-3 text-blue-500 flex-shrink-0"></i>
                      <span class="truncate">\${room}</span>
                    </div>
                  </div>

                  <button onclick="deleteTimetableSlot('\${slot.id}')" class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 bg-white/90 rounded-md p-1 shadow-xs transition" title="ลบคาบนี้">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              </td>
            \`;
          } else {
            html += \`
              <td class="p-1.5 border-r border-slate-200 align-middle">
                <div onclick="quickAddSlot('\${day}', \${pNum})" class="h-full min-h-[96px] border-2 border-dashed border-slate-200/90 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600 transition cursor-pointer group p-2">
                  <i data-lucide="plus" class="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:scale-125 transition-transform"></i>
                  <span class="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 mt-1">+ เพิ่มวิชา</span>
                </div>
              </td>
            \`;
          }
        });
        html += \`</tr>\`;
      });
      html += \`</tbody>\`;
      table.innerHTML = html;

      // Update Summary stats
      if (document.getElementById('ttSummaryAcademicHours')) document.getElementById('ttSummaryAcademicHours').textContent = \`\${academicCount} คาบ/สัปดาห์\`;
      if (document.getElementById('ttSummaryActivityHours')) document.getElementById('ttSummaryActivityHours').textContent = \`\${activityCount} คาบ/สัปดาห์\`;
      if (document.getElementById('timetableStatsBadge')) document.getElementById('timetableStatsBadge').textContent = \`⚡ รวม \${academicCount + activityCount} คาบ/สัปดาห์\`;

      if (window.lucide) lucide.createIcons();
    }

    function printTimetableA4Landscape() {
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

        periodsData.forEach((p, idx) => {
          const pNum = typeof p === 'object' ? (p.period || p.id || 1) : p;
          const pName = typeof p === 'object' && p.name ? p.name : \`คาบที่ \${pNum}\`;
          const pTime = typeof p === 'object' && p.time ? p.time : (pTimes[idx] || '');
          const isBreak = typeof p === 'object' ? (p.isBreak ?? (pNum === 4)) : (pNum === 4);

          // Lunch break
          if (isBreak) {
            rowsHtml += \`
              <td style="padding: 4px 2px; border: 1.5px solid #334155; background: #fef9c3; text-align: center; vertical-align: middle; height: 25.5mm;">
                <div style="font-weight: bold; color: #854d0e; font-size: 9.5pt; line-height: 1.2;">🍱 \${pName}</div>
                <div style="font-size: 8pt; color: #a16207; margin-top: 3px;">(\${pTime || 'พักกลางวัน'} น.)</div>
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

      const colPct = Math.max(7, Math.floor(88 / periodsData.length));
      const printHtml = \`
        <div class="timetable-print-sheet no-break" style="font-family: 'Sarabun', 'TH Sarabun New', sans-serif; padding: 0; color: #000; width: 100%; box-sizing: border-box; page-break-inside: avoid; break-inside: avoid;">
          <div style="text-align: center; margin-bottom: 5px;">
            <div style="font-size: 17pt; font-weight: bold; color: #0f172a; line-height: 1.2;">\${school.name || 'โรงเรียนดงสวรรค์วิทยา'}</div>
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
                  const pName = typeof p === 'object' && p.name ? p.name : \`คาบที่ \${pNum}\`;
                  const pTime = typeof p === 'object' && p.time ? p.time : (pTimes[idx] || '');
                  const isBreak = typeof p === 'object' ? (p.isBreak ?? (pNum === 4)) : (pNum === 4);
                  if (isBreak) {
                    return \`<th style="padding: 4px 2px; border: 1.5px solid #334155; text-align: center; width: \${colPct}%; background: #b45309; color: #ffffff; font-size: 8.5pt; line-height: 1.15; vertical-align: middle;">🍱 \${pName}<br/><span style="font-size: 7.5pt; font-weight: normal; opacity: 0.9;">\${pTime} น.</span></th>\`;
                  }
                  return \`<th style="padding: 4px 2px; border: 1.5px solid #334155; text-align: center; width: \${colPct}%; font-size: 9pt; line-height: 1.15; vertical-align: middle;">\${pName}<br/><span style="font-size: 7.5pt; font-weight: normal; opacity: 0.9;">\${pTime} น.</span></th>\`;
                }).join('')}
              </tr>
            </thead>
            <tbody>
              \${rowsHtml}
            </tbody>
          </table>

          <div style="font-size: 8pt; color: #475569; margin-top: 3px; font-style: italic;">
            * หมายเหตุ: โครงสร้างคาบเรียนและเวลาตามที่สถานศึกษากำหนด
          </div>

          <div class="no-break" style="display: flex; justify-content: space-between; margin-top: 12px; text-align: center; font-size: 9pt; page-break-inside: avoid; break-inside: avoid;">
            <div style="width: 45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top: 3px; font-weight: bold; font-size: 9.5pt;">( .......................................................... )</div>
              <div style="font-size: 8pt; color: #475569; margin-top: 2px;">ครูผู้จัดทำตารางสอน / หัวหน้างานตารางสอน</div>
            </div>
            <div style="width: 45%;">
              <div>ลงชื่อ..........................................................</div>
              <div style="margin-top: 3px; font-weight: bold; font-size: 9.5pt;">( \${school.directorName || 'นางรัษฎาภรณ์ ศิริมาตย์'} )</div>
              <div style="font-size: 8pt; color: #475569; margin-top: 2px;">\${school.directorPosition || 'ผู้อำนวยการโรงเรียนดงสวรรค์วิทยา'}</div>
            </div>
          </div>
        </div>
      \`;

      printDocument(printHtml, 'ตารางสอน_' + targetTitle.replace(/\\s+/g, '_'), 'landscape');
    }

    // =========================================================================
    // TIMETABLE PERIODS & TIME MANAGEMENT UI (จัดการคาบเรียน & ช่วงเวลา)
    // =========================================================================
    function openModalManagePeriods() {
      resetPeriodForm();
      renderPeriodsTable();
      openModal('modalManagePeriods');
      if (window.lucide) lucide.createIcons();
    }

    function renderPeriodsTable() {
      const container = document.getElementById('periodsTableBody');
      const countEl = document.getElementById('countPeriods');
      if (!container) return;
      if (countEl) countEl.textContent = periodsData.length;

      if (!periodsData || periodsData.length === 0) {
        container.innerHTML = '<div class="p-4 text-center text-xs text-slate-400">ยังไม่มีข้อมูลคาบเรียน กรุณากด "เพิ่มคาบเรียน" หรือ "คืนค่ามาตรฐาน"</div>';
        return;
      }

      container.innerHTML = periodsData.map((p, idx) => {
        const pNum = typeof p === 'object' ? (p.period || p.id || (idx + 1)) : p;
        const pName = typeof p === 'object' && p.name ? p.name : \`คาบที่ \${pNum}\`;
        const pTime = typeof p === 'object' && p.time ? p.time : '';
        const isBreak = typeof p === 'object' ? !!p.isBreak : (pNum === 4);

        return \`
          <div class="flex items-center justify-between p-2.5 rounded-xl border \${isBreak ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50/80 border-slate-200'} hover:shadow-xs transition">
            <div class="flex items-center gap-2.5">
              <span class="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs \${isBreak ? 'bg-amber-200 text-amber-900' : 'bg-blue-100 text-blue-900'}">
                \${pNum}
              </span>
              <div>
                <div class="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                  \${pName}
                  \${isBreak ? '<span class="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-blue-950 shadow-2xs">🍱 พักกลางวัน</span>' : ''}
                </div>
                <div class="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                  <i data-lucide="clock" class="w-3 h-3 text-slate-400"></i>
                  \${pTime ? \`\${pTime} น.\` : '<span class="text-slate-400 italic">ไม่ระบุเวลา</span>'}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button onclick="editPeriod(\${pNum})" class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition" title="แก้ไข">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button onclick="deletePeriod(\${pNum})" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 transition" title="ลบ">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        \`;
      }).join('');
      if (window.lucide) lucide.createIcons();
    }

    function resetPeriodForm() {
      const formTitle = document.getElementById('periodFormTitle');
      const btnCancel = document.getElementById('btnCancelEditPeriod');
      const editId = document.getElementById('editPeriodId');
      const inputId = document.getElementById('inputPeriodId');
      const inputName = document.getElementById('inputPeriodName');
      const inputTime = document.getElementById('inputPeriodTime');
      const checkBreak = document.getElementById('checkPeriodIsBreak');

      if (formTitle) formTitle.innerHTML = '<i data-lucide="plus-circle" class="w-4 h-4 text-indigo-600"></i> เพิ่มคาบเรียนใหม่';
      if (btnCancel) btnCancel.classList.add('hidden');
      if (editId) editId.value = '';
      if (inputId) {
        inputId.disabled = false;
        const maxId = periodsData.reduce((m, p) => Math.max(m, (p.id || p.period || 0)), 0);
        inputId.value = maxId + 1;
      }
      if (inputName) inputName.value = \`คาบที่ \${(periodsData.length + 1)}\`;
      if (inputTime) inputTime.value = '';
      if (checkBreak) checkBreak.checked = false;
      if (window.lucide) lucide.createIcons();
    }

    function editPeriod(id) {
      const p = periodsData.find(x => (x.id || x.period) === id);
      if (!p) return;
      const formTitle = document.getElementById('periodFormTitle');
      const btnCancel = document.getElementById('btnCancelEditPeriod');
      const editId = document.getElementById('editPeriodId');
      const inputId = document.getElementById('inputPeriodId');
      const inputName = document.getElementById('inputPeriodName');
      const inputTime = document.getElementById('inputPeriodTime');
      const checkBreak = document.getElementById('checkPeriodIsBreak');

      if (formTitle) formTitle.innerHTML = \`<i data-lucide="edit-3" class="w-4 h-4 text-blue-600"></i> แก้ไขคาบที่ \${id}\`;
      if (btnCancel) btnCancel.classList.remove('hidden');
      if (editId) editId.value = id;
      if (inputId) {
        inputId.value = id;
        inputId.disabled = true;
      }
      if (inputName) inputName.value = p.name || \`คาบที่ \${id}\`;
      if (inputTime) inputTime.value = p.time || '';
      if (checkBreak) checkBreak.checked = !!p.isBreak;

      const formBox = document.getElementById('periodFormBox');
      if (formBox) formBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (window.lucide) lucide.createIcons();
    }

    function savePeriodFromForm() {
      const editId = document.getElementById('editPeriodId').value;
      const idVal = parseInt(document.getElementById('inputPeriodId').value);
      const nameVal = document.getElementById('inputPeriodName').value.trim();
      const timeVal = document.getElementById('inputPeriodTime').value.trim();
      const isBreakVal = document.getElementById('checkPeriodIsBreak').checked;

      if (!idVal || !nameVal) {
        alert('กรุณากรอกลำดับคาบและชื่อเรียกคาบเรียน');
        return;
      }

      if (editId) {
        const idx = periodsData.findIndex(p => (p.id || p.period) == editId);
        if (idx >= 0) {
          periodsData[idx] = {
            id: idVal,
            name: nameVal,
            time: timeVal,
            isBreak: isBreakVal
          };
        }
        showToast(\`แก้ไขคาบที่ \${idVal} เรียบร้อยแล้ว\`);
      } else {
        if (periodsData.some(p => (p.id || p.period) === idVal)) {
          alert(\`คาบที่ \${idVal} มีอยู่แล้ว กรุณาระบุลำดับคาบอื่นหรือแก้ไขคาบเดิม\`);
          return;
        }
        periodsData.push({
          id: idVal,
          name: nameVal,
          time: timeVal,
          isBreak: isBreakVal
        });
        showToast(\`เพิ่มคาบที่ \${idVal} (\${nameVal}) เรียบร้อยแล้ว\`);
      }

      periodsData.sort((a, b) => (a.id || a.period) - (b.id || b.period));
      state.periods = periodsData;
      DEFAULT_MOCK_DATA.periods = periodsData;
      localStorage.setItem('fm_timetable_periods', JSON.stringify(periodsData));
      saveCoreDataToStorage();

      resetPeriodForm();
      renderPeriodsTable();
      populatePeriodDropdowns();
      renderTimetableGrid();
    }

    function deletePeriod(id) {
      if (periodsData.length <= 1) {
        alert('ต้องมีคาบเรียนอย่างน้อย 1 คาบ');
        return;
      }
      if (!confirm(\`ยืนยันลบ คาบที่ \${id} ออกจากตารางสอน?\`)) return;

      periodsData = periodsData.filter(p => (p.id || p.period) !== id);
      state.periods = periodsData;
      DEFAULT_MOCK_DATA.periods = periodsData;
      localStorage.setItem('fm_timetable_periods', JSON.stringify(periodsData));
      saveCoreDataToStorage();

      showToast(\`ลบคาบที่ \${id} เรียบร้อยแล้ว\`);
      renderPeriodsTable();
      resetPeriodForm();
      populatePeriodDropdowns();
      renderTimetableGrid();
    }

    function resetPeriodsToDefault() {
      if (!confirm('ยืนยันคืนค่าคาบเรียนเป็นมาตรฐาน (8 คาบ 08.30 - 16.00 น.)?')) return;
      periodsData = [ ...DEFAULT_TIMETABLE_PERIODS ];
      state.periods = periodsData;
      DEFAULT_MOCK_DATA.periods = periodsData;
      localStorage.setItem('fm_timetable_periods', JSON.stringify(periodsData));
      saveCoreDataToStorage();

      showToast('คืนค่าคาบเรียนมาตรฐาน 8 คาบเรียบร้อยแล้ว');
      renderPeriodsTable();
      resetPeriodForm();
      populatePeriodDropdowns();
      renderTimetableGrid();
    }

    // =========================================================================
    // SUBJECT GROUPS & COLOR MANAGEMENT UI (จัดการกลุ่มสาระ & สี)
    // =========================================================================
    function openModalManageSubjectGroups() {
      resetSubjectGroupForm();
      renderSubjectGroupsTable();
      openModal('modalManageSubjectGroups');
      if (window.lucide) lucide.createIcons();
    }

    function renderSubjectGroupsTable() {
      const container = document.getElementById('subjectGroupsTableBody');
      const countEl = document.getElementById('countSubjectGroups');
      if (!container) return;
      const groups = (state && state.subjectGroups && state.subjectGroups.length > 0) ? state.subjectGroups : DEFAULT_SUBJECT_GROUPS;
      if (countEl) countEl.textContent = groups.length;

      if (!groups || groups.length === 0) {
        container.innerHTML = '<div class="p-4 text-center text-xs text-slate-400">ยังไม่มีข้อมูลกลุ่มสาระ กรุณากด "เพิ่มกลุ่มสาระใหม่" หรือ "คืนค่าเริ่มต้น"</div>';
        return;
      }

      container.innerHTML = groups.map(grp => {
        const theme = SUBJECT_COLOR_THEMES[grp.color] || SUBJECT_COLOR_THEMES.slate;
        const dot = grp.dot || theme.dot || '🔵';
        const label = grp.shortName || grp.name;
        const isBreak = !!grp.isBreak;

        return \`
          <div class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:shadow-xs transition">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black \${theme.badge} shadow-2xs flex-shrink-0">
                \${dot} \${label}
              </span>
              <div class="min-w-0">
                <div class="font-extrabold text-xs sm:text-sm text-slate-900 truncate flex items-center gap-1.5">
                  \${grp.name}
                  \${isBreak ? '<span class="px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-200 text-amber-900">🍱 พักกลางวัน</span>' : ''}
                </div>
                <div class="text-[11px] text-slate-500 truncate mt-0.5">
                  <span class="font-semibold text-slate-600">รหัสตรวจจับ:</span> \${grp.keywords || '-'}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button onclick="editSubjectGroup('\${grp.id}')" class="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition" title="แก้ไข">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button onclick="deleteSubjectGroup('\${grp.id}')" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 transition" title="ลบ">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        \`;
      }).join('');
      if (window.lucide) lucide.createIcons();
    }

    function resetSubjectGroupForm() {
      const formTitle = document.getElementById('subjectGroupFormTitle');
      const btnCancel = document.getElementById('btnCancelEditGroup');
      const editId = document.getElementById('editSubjectGroupId');
      const inputName = document.getElementById('inputGroupName');
      const inputShort = document.getElementById('inputGroupShort');
      const inputKeywords = document.getElementById('inputGroupKeywords');
      const inputDot = document.getElementById('inputGroupDot');
      const selectColor = document.getElementById('selectGroupColor');
      const checkBreak = document.getElementById('checkGroupIsBreak');

      if (formTitle) formTitle.innerHTML = '<i data-lucide="plus-circle" class="w-4 h-4 text-teal-600"></i> เพิ่มกลุ่มสาระใหม่';
      if (btnCancel) btnCancel.classList.add('hidden');
      if (editId) editId.value = '';
      if (inputName) inputName.value = '';
      if (inputShort) inputShort.value = '';
      if (inputKeywords) inputKeywords.value = '';
      if (inputDot) inputDot.value = '🔵';
      if (selectColor) selectColor.value = 'cyan';
      if (checkBreak) checkBreak.checked = false;
      if (window.lucide) lucide.createIcons();
    }

    function editSubjectGroup(id) {
      const groups = (state && state.subjectGroups && state.subjectGroups.length > 0) ? state.subjectGroups : DEFAULT_SUBJECT_GROUPS;
      const grp = groups.find(g => g.id === id);
      if (!grp) return;

      const formTitle = document.getElementById('subjectGroupFormTitle');
      const btnCancel = document.getElementById('btnCancelEditGroup');
      const editId = document.getElementById('editSubjectGroupId');
      const inputName = document.getElementById('inputGroupName');
      const inputShort = document.getElementById('inputGroupShort');
      const inputKeywords = document.getElementById('inputGroupKeywords');
      const inputDot = document.getElementById('inputGroupDot');
      const selectColor = document.getElementById('selectGroupColor');
      const checkBreak = document.getElementById('checkGroupIsBreak');

      if (formTitle) formTitle.innerHTML = \`<i data-lucide="edit-3" class="w-4 h-4 text-blue-600"></i> แก้ไขกลุ่มสาระ: \${grp.name}\`;
      if (btnCancel) btnCancel.classList.remove('hidden');
      if (editId) editId.value = id;
      if (inputName) inputName.value = grp.name || '';
      if (inputShort) inputShort.value = grp.shortName || '';
      if (inputKeywords) inputKeywords.value = grp.keywords || '';
      const theme = SUBJECT_COLOR_THEMES[grp.color] || SUBJECT_COLOR_THEMES.slate;
      if (inputDot) inputDot.value = grp.dot || theme.dot || '🔵';
      if (selectColor) selectColor.value = grp.color || 'slate';
      if (checkBreak) checkBreak.checked = !!grp.isBreak;

      const formBox = document.getElementById('subjectGroupFormBox');
      if (formBox) formBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (window.lucide) lucide.createIcons();
    }

    function saveSubjectGroupFromForm() {
      const editId = document.getElementById('editSubjectGroupId').value;
      const nameVal = document.getElementById('inputGroupName').value.trim();
      const shortVal = document.getElementById('inputGroupShort').value.trim();
      const keywordsVal = document.getElementById('inputGroupKeywords').value.trim();
      const dotVal = document.getElementById('inputGroupDot').value.trim() || '🔵';
      const colorVal = document.getElementById('selectGroupColor').value;
      const isBreakVal = document.getElementById('checkGroupIsBreak').checked;

      if (!nameVal || !shortVal) {
        alert('กรุณากรอกชื่อกลุ่มสาระและชื่อย่อ');
        return;
      }

      if (!state.subjectGroups || !Array.isArray(state.subjectGroups)) {
        state.subjectGroups = [ ...DEFAULT_SUBJECT_GROUPS ];
      }

      if (editId) {
        const idx = state.subjectGroups.findIndex(g => g.id === editId);
        if (idx >= 0) {
          state.subjectGroups[idx] = {
            ...state.subjectGroups[idx],
            name: nameVal,
            shortName: shortVal,
            keywords: keywordsVal,
            dot: dotVal,
            color: colorVal,
            isBreak: isBreakVal
          };
        }
        showToast(\`แก้ไขกลุ่มสาระ "\${shortVal}" สำเร็จแล้ว\`);
      } else {
        const newId = 'grp_' + Date.now();
        state.subjectGroups.push({
          id: newId,
          name: nameVal,
          shortName: shortVal,
          keywords: keywordsVal,
          dot: dotVal,
          color: colorVal,
          isBreak: isBreakVal
        });
        showToast(\`เพิ่มกลุ่มสาระ "\${shortVal}" สำเร็จแล้ว\`);
      }

      localStorage.setItem('fm_subject_groups', JSON.stringify(state.subjectGroups));
      resetSubjectGroupForm();
      renderSubjectGroupsTable();
      renderSubjectGroupLegend();
      renderTimetableGrid();
    }

    function deleteSubjectGroup(id) {
      if (!state.subjectGroups || state.subjectGroups.length <= 1) {
        alert('ต้องมีกลุ่มสาระอย่างน้อย 1 กลุ่ม');
        return;
      }
      const grp = state.subjectGroups.find(g => g.id === id);
      if (!grp) return;
      if (!confirm(\`ยืนยันลบกลุ่มสาระ "\${grp.name}" ออกจากระบบ?\`)) return;

      state.subjectGroups = state.subjectGroups.filter(g => g.id !== id);
      localStorage.setItem('fm_subject_groups', JSON.stringify(state.subjectGroups));
      showToast(\`ลบกลุ่มสาระ "\${grp.shortName || grp.name}" เรียบร้อยแล้ว\`);
      renderSubjectGroupsTable();
      resetSubjectGroupForm();
      renderSubjectGroupLegend();
      renderTimetableGrid();
    }

    function resetSubjectGroupsToDefault() {
      if (!confirm('ยืนยันคืนค่ากลุ่มสาระเป็นมาตรฐาน (8 กลุ่มสาระ + กิจกรรมพัฒนาผู้เรียน + พักกลางวัน)?')) return;
      state.subjectGroups = [ ...DEFAULT_SUBJECT_GROUPS ];
      localStorage.setItem('fm_subject_groups', JSON.stringify(state.subjectGroups));
      showToast('คืนค่ากลุ่มสาระมาตรฐานเรียบร้อยแล้ว');
      renderSubjectGroupsTable();
      resetSubjectGroupForm();
      renderSubjectGroupLegend();
      renderTimetableGrid();
    }

    function openModalAddTimetableSlot() {
      populateCommonDropdowns();
      populatePeriodDropdowns();
      checkSlotConflict();
      openModal('modalAddTimetable');
    }

`;

html = html.slice(0, startIdx) + replacementJs + html.slice(endIdx);
console.log('Step 6: Timetable JS engine replaced.');

// 7. Update handleSaveTimetableSlot to save to timetablesList and core storage
const oldSaveTimetable = `    async function handleSaveTimetableSlot(e) {
      e.preventDefault();
      const teacherSelect = document.getElementById('ttTeacherSelect');
      const teacherName = teacherSelect.options[teacherSelect.selectedIndex].text.split(' (')[0];
      const payload = {
        day: document.getElementById('ttDaySelect').value,
        period: document.getElementById('ttPeriodSelect').value,
        classroom: document.getElementById('ttClassroomSelect').value,
        teacherId: teacherSelect.value,
        teacherName,
        subject: document.getElementById('ttSubjectInput').value,
        room: document.getElementById('ttRoomSelect').value
      };

      const res = await callBackend('saveTimetable', payload);
      if (res && res.success) {
        closeModal('modalAddTimetable');
        loadTimetableData();
      } else {
        alert(res.error || 'ตารางสอนชนกัน ไม่สามารถบันทึกได้');
      }
    }

    async function deleteTimetableSlot(id) {
      if (!confirm('ยืนยันลบคาบสอนนี้ออกจากตาราง?')) return;
      const res = await callBackend('deleteTimetable', { id });
      if (res && res.success) {
        loadTimetableData();
      }
    }`;

const newSaveTimetable = `    async function handleSaveTimetableSlot(e) {
      e.preventDefault();
      const teacherSelect = document.getElementById('ttTeacherSelect');
      const teacherName = teacherSelect.options[teacherSelect.selectedIndex]?.text?.split(' (')[0] || '';
      const payload = {
        id: 'TT_' + Date.now(),
        day: document.getElementById('ttDaySelect').value,
        period: parseInt(document.getElementById('ttPeriodSelect').value),
        classroom: document.getElementById('ttClassroomSelect').value,
        teacherId: teacherSelect.value,
        teacherName,
        subject: document.getElementById('ttSubjectInput').value,
        room: document.getElementById('ttRoomSelect').value
      };

      timetablesList.push(payload);
      saveCoreDataToStorage();

      await callBackend('saveTimetable', payload);
      closeModal('modalAddTimetable');
      showToast(\`บันทึกคาบสอน \${payload.subject} สำเร็จแล้ว\`);
      renderTimetableGrid();
    }

    async function deleteTimetableSlot(id) {
      if (!confirm('ยืนยันลบคาบสอนนี้ออกจากตาราง?')) return;
      timetablesList = timetablesList.filter(t => t.id !== id);
      saveCoreDataToStorage();
      await callBackend('deleteTimetable', { id });
      showToast('ลบคาบสอนเรียบร้อยแล้ว');
      renderTimetableGrid();
    }`;

if (!html.includes(oldSaveTimetable)) {
  console.error('ERROR: oldSaveTimetable not found!');
  process.exit(1);
}
html = html.replace(oldSaveTimetable, newSaveTimetable);
console.log('Step 7: handleSaveTimetableSlot & deleteTimetableSlot updated.');

// 8. Update checkSlotConflict to validate client-side instantly as well
const oldCheckConflict = `      const res = await callBackend('validateTimetable', { day, period, teacherId, classroom, room });
      const box = document.getElementById('conflictAlertBox');
      const text = document.getElementById('conflictAlertText');
      const btn = document.getElementById('btnSubmitTimetableSlot');

      if (res && res.hasConflict) {
        box.classList.remove('hidden');
        text.innerHTML = res.conflicts.map(c => \`<div>• \${c}</div>\`).join('');
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        box.classList.add('hidden');
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
      }`;

const newCheckConflict = `      // Validate against active timetablesList in real time
      const conflicts = [];
      const busyClass = timetablesList.find(t => t.day === day && parseInt(t.period) === parseInt(period) && t.classroom === classroom);
      if (busyClass) conflicts.push(\`ชั้น \${classroom} มีวิชา "\${busyClass.subject}" ในคาบนี้แล้ว\`);

      const busyTeacher = timetablesList.find(t => t.day === day && parseInt(t.period) === parseInt(period) && (
        (teacherId && t.teacherId === teacherId) || (teacherId && t.teacherName && t.teacherName.includes(teacherId))
      ));
      if (busyTeacher) conflicts.push(\`ครูผู้สอนท่านนี้ติดสอนวิชา "\${busyTeacher.subject}" (ชั้น \${busyTeacher.classroom}) ในคาบนี้แล้ว\`);

      if (room && room !== '-') {
        const busyRoom = timetablesList.find(t => t.day === day && parseInt(t.period) === parseInt(period) && t.room === room);
        if (busyRoom) conflicts.push(\`ห้องเรียน "\${room}" กำลังถูกใช้โดยชั้น \${busyRoom.classroom} ในคาบนี้แล้ว\`);
      }

      const box = document.getElementById('conflictAlertBox');
      const text = document.getElementById('conflictAlertText');
      const btn = document.getElementById('btnSubmitTimetableSlot');

      if (conflicts.length > 0) {
        box.classList.remove('hidden');
        text.innerHTML = conflicts.map(c => \`<div>• \${c}</div>\`).join('');
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        box.classList.add('hidden');
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
      }`;

if (!html.includes(oldCheckConflict)) {
  console.error('ERROR: oldCheckConflict not found!');
  process.exit(1);
}
html = html.replace(oldCheckConflict, newCheckConflict);
console.log('Step 8: checkSlotConflict updated with instant client-side validation.');

// 9. Update openModalSubstitute to call populatePeriodDropdowns()
const oldOpenModalSub = `    function openModalSubstitute() {
      populateCommonDropdowns();`;
const newOpenModalSub = `    function openModalSubstitute() {
      populateCommonDropdowns();
      populatePeriodDropdowns();`;

if (html.includes(oldOpenModalSub)) {
  html = html.replace(oldOpenModalSub, newOpenModalSub);
  console.log('Step 9: openModalSubstitute updated.');
}

// 10. Update saveCoreDataToStorage to persist subjectGroups
const oldSaveCore = `          periods: state.periods,
          days: state.days,`;
const newSaveCore = `          periods: state.periods,
          subjectGroups: state.subjectGroups,
          days: state.days,`;

if (html.includes(oldSaveCore)) {
  html = html.replace(oldSaveCore, newSaveCore);
  console.log('Step 10: saveCoreDataToStorage updated.');
}

// 11. Update backup and restore functions
const oldBackupCore = `          periods: state.periods || [],
          days: state.days || [],`;
const newBackupCore = `          periods: state.periods || [],
          subjectGroups: state.subjectGroups || [],
          days: state.days || [],`;

if (html.includes(oldBackupCore)) {
  html = html.replace(oldBackupCore, newBackupCore);
  console.log('Step 11: exportFullSystemBackupJson updated.');
}

const oldRestoreCore = `            if (Array.isArray(data.core.periods)) { state.periods = data.core.periods; periodsData = data.core.periods; }`;
const newRestoreCore = `            if (Array.isArray(data.core.periods)) { state.periods = normalizePeriods(data.core.periods); periodsData = state.periods; localStorage.setItem('fm_timetable_periods', JSON.stringify(periodsData)); }
            if (Array.isArray(data.core.subjectGroups)) { state.subjectGroups = data.core.subjectGroups; localStorage.setItem('fm_subject_groups', JSON.stringify(state.subjectGroups)); }`;

if (html.includes(oldRestoreCore)) {
  html = html.replace(oldRestoreCore, newRestoreCore);
  console.log('Step 12: handleRestoreBackupFile updated.');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('SUCCESS: index.html has been updated cleanly!');
