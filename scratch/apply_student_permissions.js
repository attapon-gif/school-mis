const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Header Toolbar ID
const oldHeaderToolbar = `<!-- Quick Action Toolbar on Header -->
          <div class="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">`;

const newHeaderToolbar = `<!-- Quick Action Toolbar on Header -->
          <div id="headerQuickActionToolbar" class="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">`;

if (!content.includes(oldHeaderToolbar)) {
  console.error('Could not find oldHeaderToolbar');
  process.exit(1);
}
content = content.replace(oldHeaderToolbar, newHeaderToolbar);
console.log('1. Added id="headerQuickActionToolbar"');

// 2. Teacher Batch Bar ID
const oldTeacherBar = `<!-- HOMEROOM TEACHER BAR: พิมพ์ ปพ.6 รายห้องเรียน (ข้อ 3) -->
      <div class="card-3d p-5 rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-white to-blue-50/90 shadow-sm">`;

const newTeacherBar = `<!-- HOMEROOM TEACHER BAR: พิมพ์ ปพ.6 รายห้องเรียน (ข้อ 3) -->
      <div id="p6TeacherBatchBar" class="card-3d p-5 rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-white to-blue-50/90 shadow-sm">`;

if (!content.includes(oldTeacherBar)) {
  console.error('Could not find oldTeacherBar');
  process.exit(1);
}
content = content.replace(oldTeacherBar, newTeacherBar);
console.log('2. Added id="p6TeacherBatchBar"');

// 3. Navigation Sections IDs & Add Student Navigation
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

if (!content.includes(oldNavStart)) {
  console.error('Could not find oldNavStart');
  process.exit(1);
}
content = content.replace(oldNavStart, newNavStart);
console.log('3. Added nav-section-student and nav-section-core');

// หมวดที่ 2
const oldSec2 = `<!-- หมวดที่ 2: งานวัดผล & วิชาการเพิ่มเติม (New Academic & Evaluation) -->
          <div class="space-y-1 pt-2 border-t border-slate-800/60">`;
const newSec2 = `<!-- หมวดที่ 2: งานวัดผล & วิชาการเพิ่มเติม (New Academic & Evaluation) -->
          <div id="nav-section-academic" class="space-y-1 pt-2 border-t border-slate-800/60">`;
if (content.includes(oldSec2)) {
  content = content.replace(oldSec2, newSec2);
  console.log('4. Added id="nav-section-academic"');
}

// หมวดที่ 3
const oldSec3 = `<!-- หมวดที่ 3: งานกิจการนักเรียน & ดูแลช่วยเหลือ (Student Care & Affairs) -->
          <div class="space-y-1 pt-2 border-t border-slate-800/60">`;
const newSec3 = `<!-- หมวดที่ 3: งานกิจการนักเรียน & ดูแลช่วยเหลือ (Student Care & Affairs) -->
          <div id="nav-section-affairs" class="space-y-1 pt-2 border-t border-slate-800/60">`;
if (content.includes(oldSec3)) {
  content = content.replace(oldSec3, newSec3);
  console.log('5. Added id="nav-section-affairs"');
}

// หมวดที่ 4
const oldSec4 = `<!-- หมวดที่ 4: กิจกรรมพัฒนาผู้เรียน & ทะเบียนเรียนรวม (Activities & Registrar) -->
          <div class="space-y-1 pt-2 border-t border-slate-800/60">`;
const newSec4 = `<!-- หมวดที่ 4: กิจกรรมพัฒนาผู้เรียน & ทะเบียนเรียนรวม (Activities & Registrar) -->
          <div id="nav-section-activities" class="space-y-1 pt-2 border-t border-slate-800/60">`;
if (content.includes(oldSec4)) {
  content = content.replace(oldSec4, newSec4);
  console.log('6. Added id="nav-section-activities"');
}

// 4. Update applyRolePermissions
const oldApplyPerms = `function applyRolePermissions(role) {
      initUserManagementState();
      const perms = state.rolePermissions[role]?.permissions || {};

      const navDashboard = document.getElementById('nav-dashboard');
      const navGrades = document.getElementById('nav-grades');
      const navStudent = document.getElementById('nav-student');
      const navPlans = document.getElementById('nav-plans');
      const navSupv = document.getElementById('nav-supervision');
      const navTimetable = document.getElementById('nav-timetable');
      const navUsers = document.getElementById('nav-users');
      const navSettings = document.getElementById('nav-settings');

      // Set visibility based on permissions
      if (navDashboard) perms.dashboard !== false ? navDashboard.classList.remove('hidden') : navDashboard.classList.add('hidden');
      if (navGrades) perms.grades ? navGrades.classList.remove('hidden') : navGrades.classList.add('hidden');
      if (navStudent) perms.studentP6 ? navStudent.classList.remove('hidden') : navStudent.classList.add('hidden');
      if (navPlans) (perms.plansSubmit || perms.plansReview) ? navPlans.classList.remove('hidden') : navPlans.classList.add('hidden');
      if (navSupv) perms.supervision ? navSupv.classList.remove('hidden') : navSupv.classList.add('hidden');
      if (navTimetable) perms.timetable ? navTimetable.classList.remove('hidden') : navTimetable.classList.add('hidden');
      if (navUsers) perms.users ? navUsers.classList.remove('hidden') : navUsers.classList.add('hidden');
      if (navSettings) perms.settings ? navSettings.classList.remove('hidden') : navSettings.classList.add('hidden');
    }`;

const newApplyPerms = `function applyRolePermissions(role) {
      initUserManagementState();
      const isStudent = (role === 'student');

      const secCore = document.getElementById('nav-section-core');
      const secAcademic = document.getElementById('nav-section-academic');
      const secAffairs = document.getElementById('nav-section-affairs');
      const secActivities = document.getElementById('nav-section-activities');
      const secStudent = document.getElementById('nav-section-student');
      const headerToolbar = document.getElementById('headerQuickActionToolbar');
      const p6TeacherBar = document.getElementById('p6TeacherBatchBar');

      if (isStudent) {
        if (secCore) secCore.classList.add('hidden');
        if (secAcademic) secAcademic.classList.add('hidden');
        if (secAffairs) secAffairs.classList.add('hidden');
        if (secActivities) secActivities.classList.add('hidden');
        if (secStudent) secStudent.classList.remove('hidden');
        if (headerToolbar) headerToolbar.classList.add('hidden');
        if (p6TeacherBar) p6TeacherBar.classList.add('hidden');
        return;
      }

      // Non-student (Staff / Teachers / Administrators)
      if (secCore) secCore.classList.remove('hidden');
      if (secAcademic) secAcademic.classList.remove('hidden');
      if (secAffairs) secAffairs.classList.remove('hidden');
      if (secActivities) secActivities.classList.remove('hidden');
      if (secStudent) secStudent.classList.add('hidden');
      if (headerToolbar) headerToolbar.classList.remove('hidden');
      if (p6TeacherBar) p6TeacherBar.classList.remove('hidden');

      const perms = state.rolePermissions[role]?.permissions || {};

      const navDashboard = document.getElementById('nav-dashboard');
      const navGrades = document.getElementById('nav-grades');
      const navStudent = document.getElementById('nav-student');
      const navPlans = document.getElementById('nav-plans');
      const navSupv = document.getElementById('nav-supervision');
      const navTimetable = document.getElementById('nav-timetable');
      const navUsers = document.getElementById('nav-users');
      const navSettings = document.getElementById('nav-settings');

      if (navDashboard) perms.dashboard !== false ? navDashboard.classList.remove('hidden') : navDashboard.classList.add('hidden');
      if (navGrades) perms.grades !== false ? navGrades.classList.remove('hidden') : navGrades.classList.add('hidden');
      if (navStudent) navStudent.classList.remove('hidden');
      if (navPlans) (perms.plansSubmit || perms.plansReview) !== false ? navPlans.classList.remove('hidden') : navPlans.classList.add('hidden');
      if (navSupv) perms.supervision !== false ? navSupv.classList.remove('hidden') : navSupv.classList.add('hidden');
      if (navTimetable) perms.timetable !== false ? navTimetable.classList.remove('hidden') : navTimetable.classList.add('hidden');
      if (navUsers) perms.users ? navUsers.classList.remove('hidden') : navUsers.classList.add('hidden');
      if (navSettings) perms.settings ? navSettings.classList.remove('hidden') : navSettings.classList.add('hidden');
    }`;

if (!content.includes(oldApplyPerms)) {
  console.error('Could not find oldApplyPerms');
  process.exit(1);
}
content = content.replace(oldApplyPerms, newApplyPerms);
console.log('7. Updated applyRolePermissions');

// 5. Update switchTab with student security check
const oldSwitchTab = `function switchTab(tabId) {
      state.currentTab = tabId;
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      const target = document.getElementById(tabId);
      if (target) target.classList.remove('hidden');

      document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.className = 'nav-tab flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left';
      });
      const navBtnId = 'nav-' + tabId.replace('tab-', '');
      const activeNavBtn = document.getElementById(navBtnId);
      if (activeNavBtn) {
        activeNavBtn.className = 'nav-tab active-tab flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/30 transition-all duration-150 w-full text-left';
      }`;

const newSwitchTab = `function switchTab(tabId) {
      if (state.currentRole === 'student') {
        const allowedStudentTabs = ['tab-student', 'tab-remedial'];
        if (!allowedStudentTabs.includes(tabId)) {
          if (typeof showToast === 'function') {
            showToast('บัญชีนักเรียนสามารถเข้าถึงได้เฉพาะพอร์ทัลผลการเรียน ปพ.6 และยื่นคำร้องแก้ตัว');
          }
          tabId = 'tab-student';
        }
      }

      state.currentTab = tabId;
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      const target = document.getElementById(tabId);
      if (target) target.classList.remove('hidden');

      document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.className = 'nav-tab flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left';
      });
      const navBtnId = 'nav-' + tabId.replace('tab-', '');
      const activeNavBtn = document.getElementById(navBtnId);
      if (activeNavBtn) {
        activeNavBtn.className = 'nav-tab active-tab flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/30 transition-all duration-150 w-full text-left';
      }

      if (state.currentRole === 'student') {
        const stuBtn = document.getElementById(tabId === 'tab-student' ? 'nav-student-only' : 'nav-remedial-student');
        if (stuBtn) {
          stuBtn.className = 'nav-tab active-tab flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/30 transition-all duration-150 w-full text-left';
        }
      }`;

if (!content.includes(oldSwitchTab)) {
  console.error('Could not find oldSwitchTab');
  process.exit(1);
}
content = content.replace(oldSwitchTab, newSwitchTab);
console.log('8. Updated switchTab with student permission check');

fs.writeFileSync('index.html', content, 'utf8');
console.log('Saved index.html successfully!');
