const fs = require('fs');

let content = fs.readFileSync('google-apps-script/Index.html', 'utf8');

const oldHeaderToolbar = `<!-- Quick Action Toolbar on Header -->
          <div class="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">`;
const newHeaderToolbar = `<!-- Quick Action Toolbar on Header -->
          <div id="headerQuickActionToolbar" class="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">`;
if (content.includes(oldHeaderToolbar)) content = content.replace(oldHeaderToolbar, newHeaderToolbar);

const oldTeacherBar = `<!-- HOMEROOM TEACHER BAR: พิมพ์ ปพ.6 รายห้องเรียน (ข้อ 3) -->
      <div class="card-3d p-5 rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-white to-blue-50/90 shadow-sm">`;
const newTeacherBar = `<!-- HOMEROOM TEACHER BAR: พิมพ์ ปพ.6 รายห้องเรียน (ข้อ 3) -->
      <div id="p6TeacherBatchBar" class="card-3d p-5 rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-white to-blue-50/90 shadow-sm">`;
if (content.includes(oldTeacherBar)) content = content.replace(oldTeacherBar, newTeacherBar);

const oldNavStart = `<nav class="space-y-3">
          <!-- หมวดที่ 1: ระบบหลักเดิม (Core MIS - คงไว้ครบถ้วน) -->
          <div class="space-y-1">`;
const newNavStart = `<nav class="space-y-3">
          <!-- หมวดเฉพาะ: พอร์ทัลนักเรียน & ผู้ปกครอง (สำหรับ Role: Student เท่านั้น) -->
          <div id="nav-section-student" class="space-y-1.5 hidden">
            <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center justify-between">
              <span class="flex items-center gap-1.5"><i data-lucide="user-check" class="w-3 h-3 text-cyan-400"></i> พอร์ทัลนักเรียน & ผู้ปกครอง</span>
              <span class="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded font-semibold">2 ระบบ</span>
            </div>
            <button onclick="switchTab('tab-student')" id="nav-student-only" class="nav-tab active-tab flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/30 transition-all duration-150 w-full text-left">
              <i data-lucide="graduation-cap" class="w-4 h-4 text-amber-300 flex-shrink-0"></i>
              <span class="flex-1 truncate">ตรวจสอบผลการเรียน (ปพ.6)</span>
            </button>
            <button onclick="switchTab('tab-remedial')" id="nav-remedial-student" class="nav-tab flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="file-edit" class="w-4 h-4 text-rose-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">ยื่นคำร้องแก้ 0, ร, มส ออนไลน์</span>
            </button>
          </div>

          <!-- หมวดที่ 1: ระบบหลักเดิม (Core MIS - คงไว้ครบถ้วน) -->
          <div id="nav-section-core" class="space-y-1">`;
if (content.includes(oldNavStart)) content = content.replace(oldNavStart, newNavStart);

const oldSec2 = `<!-- หมวดที่ 2: งานวัดผล & วิชาการเพิ่มเติม (New Academic & Evaluation) -->
          <div class="space-y-1 pt-2 border-t border-slate-800/60">`;
const newSec2 = `<!-- หมวดที่ 2: งานวัดผล & วิชาการเพิ่มเติม (New Academic & Evaluation) -->
          <div id="nav-section-academic" class="space-y-1 pt-2 border-t border-slate-800/60">`;
if (content.includes(oldSec2)) content = content.replace(oldSec2, newSec2);

const oldSec3 = `<!-- หมวดที่ 3: งานกิจการนักเรียน & ดูแลช่วยเหลือ (Student Care & Affairs) -->
          <div class="space-y-1 pt-2 border-t border-slate-800/60">`;
const newSec3 = `<!-- หมวดที่ 3: งานกิจการนักเรียน & ดูแลช่วยเหลือ (Student Care & Affairs) -->
          <div id="nav-section-affairs" class="space-y-1 pt-2 border-t border-slate-800/60">`;
if (content.includes(oldSec3)) content = content.replace(oldSec3, newSec3);

const oldSec4 = `<!-- หมวดที่ 4: กิจกรรมพัฒนาผู้เรียน & ทะเบียนเรียนรวม (Activities & Registrar) -->
          <div class="space-y-1 pt-2 border-t border-slate-800/60">`;
const newSec4 = `<!-- หมวดที่ 4: กิจกรรมพัฒนาผู้เรียน & ทะเบียนเรียนรวม (Activities & Registrar) -->
          <div id="nav-section-activities" class="space-y-1 pt-2 border-t border-slate-800/60">`;
if (content.includes(oldSec4)) content = content.replace(oldSec4, newSec4);

// Functions
const rootIndex = fs.readFileSync('index.html', 'utf8');

const applyPermsStart = 'function applyRolePermissions(role) {';
const applyPermsEnd = 'function selectStudentById(studentId) {';
const rootApplyPerms = rootIndex.substring(rootIndex.indexOf(applyPermsStart), rootIndex.indexOf(applyPermsEnd));
const gasIdxStart = content.indexOf(applyPermsStart);
const gasIdxEnd = content.indexOf(applyPermsEnd);
if (gasIdxStart !== -1 && gasIdxEnd !== -1) {
  content = content.substring(0, gasIdxStart) + rootApplyPerms + content.substring(gasIdxEnd);
}

const switchTabStart = 'function switchTab(tabId) {';
const switchTabEnd = '// Close mobile drawer';
const rootSwitchTab = rootIndex.substring(rootIndex.indexOf(switchTabStart), rootIndex.indexOf(switchTabEnd));
const gasSwitchStart = content.indexOf(switchTabStart);
const gasSwitchEnd = content.indexOf(switchTabEnd);
if (gasSwitchStart !== -1 && gasSwitchEnd !== -1) {
  content = content.substring(0, gasSwitchStart) + rootSwitchTab + content.substring(gasSwitchEnd);
}

fs.writeFileSync('google-apps-script/Index.html', content, 'utf8');
console.log('Synced google-apps-script/Index.html successfully!');
