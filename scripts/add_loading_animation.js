const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add #globalLoading element before #printableArea
const targetPrintable = '  <!-- PRINTABLE AREA (FOR PDF) -->\n  <div id="printableArea" class="hidden printable-area"></div>';

const loadingHtml = `  <!-- ================================================================= -->
  <!-- GLOBAL LOADING & ANTI-DOUBLE CLICK OVERLAY (ระบบอนิเมชั่นป้องกันกดซ้ำ) -->
  <!-- ================================================================= -->
  <div id="globalLoading" class="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] hidden flex flex-col items-center justify-center p-4 transition-all duration-300">
    <div class="card-3d bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <!-- Animated Spinner with Multi-layer Glow -->
      <div class="relative w-20 h-20 flex items-center justify-center">
        <!-- Outer Glowing Ring -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 opacity-25 blur-lg animate-pulse"></div>
        <!-- Spinning Ring -->
        <div class="w-16 h-16 rounded-full border-4 border-slate-200/80 border-t-blue-600 border-r-indigo-500 animate-spin"></div>
        <!-- Inner Center Pulse Icon -->
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="w-7 h-7 text-blue-600 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
      </div>

      <!-- Text Messages -->
      <div class="space-y-1.5 w-full">
        <h4 id="globalLoadingText" class="text-base font-black text-slate-900 tracking-tight leading-snug">กำลังประมวลผลข้อมูล...</h4>
        <p id="globalLoadingSubtext" class="text-xs text-slate-500 font-medium">กรุณารอสักครู่ ระบบกำลังสื่อสารกับคลาวด์และบันทึกข้อมูล</p>
      </div>

      <!-- Anti-Double Click Protection Badge -->
      <div class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200/80 rounded-xl text-[11px] font-bold text-blue-800">
        <span class="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
        <span>ระบบกำลังทำงาน (ล็อคการคลิกซ้ำ)</span>
      </div>
    </div>
  </div>

  <!-- PRINTABLE AREA (FOR PDF) -->
  <div id="printableArea" class="hidden printable-area"></div>`;

if (html.includes(targetPrintable)) {
  html = html.replace(targetPrintable, loadingHtml);
  console.log('1. globalLoading HTML overlay inserted successfully');
} else {
  console.error('1. targetPrintable NOT FOUND!');
}

// 2. Upgrade showLoading and add lockButton helper function
const oldShowLoading = `    function showLoading(show, text = 'กำลังประมวลผลผ่าน Google Apps Script...') {
      const el = document.getElementById('globalLoading');
      const textEl = document.getElementById('globalLoadingText');
      if (el) {
        if (show) {
          if (textEl) textEl.textContent = text;
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    }`;

const newShowLoading = `    // Global state to prevent duplicate parallel operations
    let isGlobalProcessing = false;

    // Helper to lock and show spinner inside specific buttons to prevent double-clicks
    function lockButton(btn, loadingText = 'กำลังดำเนินการ...') {
      if (!btn) return () => {};
      const originalHtml = btn.innerHTML;
      const originalDisabled = btn.disabled;
      btn.disabled = true;
      btn.classList.add('opacity-70', 'cursor-not-allowed', 'pointer-events-none');
      btn.innerHTML = \`
        <span class="inline-flex items-center justify-center gap-2">
          <svg class="animate-spin w-4 h-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span>\${loadingText}</span>
        </span>
      \`;

      return function unlock() {
        btn.disabled = originalDisabled;
        btn.classList.remove('opacity-70', 'cursor-not-allowed', 'pointer-events-none');
        btn.innerHTML = originalHtml;
        if (window.lucide) lucide.createIcons();
      };
    }

    function showLoading(show, text = 'กำลังประมวลผลข้อมูล...', subtext = 'กรุณารอสักครู่ ระบบกำลังสื่อสารกับคลาวด์และบันทึกข้อมูล') {
      isGlobalProcessing = !!show;
      const el = document.getElementById('globalLoading');
      const textEl = document.getElementById('globalLoadingText');
      const subEl = document.getElementById('globalLoadingSubtext');
      if (el) {
        if (show) {
          if (textEl) textEl.textContent = text;
          if (subEl) subEl.textContent = subtext;
          el.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        } else {
          el.classList.add('hidden');
          document.body.style.overflow = '';
        }
      }
    }`;

if (html.includes(oldShowLoading)) {
  html = html.replace(oldShowLoading, newShowLoading);
  console.log('2. showLoading and lockButton upgraded successfully');
} else {
  console.error('2. oldShowLoading NOT FOUND!');
}

// 3. Upgrade callBackend to show meaningful loading messages and keep loading active until response
const oldCallBackend = `    function callBackend(action, payload = {}) {
      showLoading(true);
      return new Promise((resolve, reject) => {`;

const newCallBackend = `    function callBackend(action, payload = {}) {
      let loadingMsg = 'กำลังประมวลผลข้อมูล...';
      let loadingSub = 'กรุณารอสักครู่ ระบบกำลังสื่อสารกับคลาวด์';
      if (action === 'uploadFile') {
        loadingMsg = 'กำลังอัปโหลดไฟล์ขึ้น Google Drive...';
        loadingSub = 'กำลังจัดเก็บไฟล์ในโฟลเดอร์ของโรงเรียนบน Google Drive';
      } else if (action === 'saveGrade' || action === 'saveGradeRecord') {
        loadingMsg = 'กำลังบันทึกและคำนวณเกรด...';
      } else if (action === 'savePlan' || action === 'reviewPlan') {
        loadingMsg = 'กำลังบันทึกข้อมูลแผนการจัดการเรียนรู้...';
      } else if (action === 'saveSupervision' || action === 'evaluateSupervision') {
        loadingMsg = 'กำลังบันทึกผลการนิเทศการสอน...';
      } else if (action === 'saveTimetable') {
        loadingMsg = 'กำลังตรวจสอบและบันทึกตารางสอน...';
      } else if (action === 'importStudents') {
        loadingMsg = 'กำลังนำเข้ารายชื่อนักเรียน...';
        loadingSub = 'กำลังตรวจสอบรหัสประจำตัวและจัดเก็บข้อมูล';
      }

      showLoading(true, loadingMsg, loadingSub);
      return new Promise((resolve, reject) => {`;

if (html.includes(oldCallBackend)) {
  html = html.replace(oldCallBackend, newCallBackend);
  console.log('3. callBackend loading messages upgraded successfully');
} else {
  console.error('3. oldCallBackend NOT FOUND!');
}

// 4. Update handleSaveResearch to lock submit button and prevent duplicate submission
const oldHandleSaveRes = `    async function handleSaveResearch(e) {
      e.preventDefault();
      initExtendedState();

      const fileInput = document.getElementById('resFileInput');`;

const newHandleSaveRes = `    async function handleSaveResearch(e) {
      e.preventDefault();
      if (isGlobalProcessing) return; // Prevent double trigger
      initExtendedState();

      const submitBtn = e.target.querySelector('button[type="submit"]');
      const unlockBtn = lockButton(submitBtn, 'กำลังบันทึกและส่ง Drive...');
      showLoading(true, 'กำลังบันทึกงานวิจัยในชั้นเรียน...', 'กำลังเตรียมข้อมูลและจัดเก็บไฟล์ขึ้น Google Drive');

      const fileInput = document.getElementById('resFileInput');`;

if (html.includes(oldHandleSaveRes)) {
  html = html.replace(oldHandleSaveRes, newHandleSaveRes);
  console.log('4. handleSaveResearch anti-double click added successfully');
} else {
  console.error('4. oldHandleSaveRes NOT FOUND!');
}

// And ensure unlockBtn and showLoading(false) in handleSaveResearch finish:
const oldHandleSaveResEnd = `      state.ext.researchItems.unshift(newRes);
      saveExtendedState();
      closeModal('modalSubmitResearch');
      renderResearchCards();
      showToast('ส่งงานวิจัยในชั้นเรียนหน้าเดียวและบันทึก Google Drive สำเร็จ');
    }`;

const newHandleSaveResEnd = `      state.ext.researchItems.unshift(newRes);
      saveExtendedState();
      closeModal('modalSubmitResearch');
      renderResearchCards();
      unlockBtn();
      showLoading(false);
      showToast('ส่งงานวิจัยในชั้นเรียนหน้าเดียวและบันทึก Google Drive สำเร็จ');
    }`;

if (html.includes(oldHandleSaveResEnd)) {
  html = html.replace(oldHandleSaveResEnd, newHandleSaveResEnd);
  console.log('5. handleSaveResearch end unlock added successfully');
} else {
  console.error('5. oldHandleSaveResEnd NOT FOUND!');
}

// 6. Update handleSaveAttachDrive to prevent double click
const oldHandleAttach = `    async function handleSaveAttachDrive(e) {
      e.preventDefault();
      initExtendedState();
      const resId = document.getElementById('attachDriveResId').value;`;

const newHandleAttach = `    async function handleSaveAttachDrive(e) {
      e.preventDefault();
      if (isGlobalProcessing) return;
      initExtendedState();
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const unlockBtn = lockButton(submitBtn, 'กำลังเชื่อมต่อ Drive...');
      showLoading(true, 'กำลังเชื่อมโยงไฟล์ Google Drive...', 'กำลังตรวจสอบไฟล์และสิทธิ์การเข้าถึง');
      const resId = document.getElementById('attachDriveResId').value;`;

if (html.includes(oldHandleAttach)) {
  html = html.replace(oldHandleAttach, newHandleAttach);
  console.log('6. handleSaveAttachDrive anti-double click added successfully');
} else {
  console.error('6. oldHandleAttach NOT FOUND!');
}

// And unlock at end of handleSaveAttachDrive
const oldHandleAttachEnd = `      if (driveUrl) {
        r.driveUrl = driveUrl;
        r.fileName = fileName;
        r.fileSize = fileSize;
        saveExtendedState();
        closeModal('modalAttachResearchDrive');
        renderResearchCards();
        showToast('เชื่อมโยงไฟล์ Google Drive เรียบร้อยแล้ว');
      } else {
        showToast('กรุณาเลือกไฟล์หรือระบุลิงก์ Google Drive');
      }
    }`;

const newHandleAttachEnd = `      unlockBtn();
      showLoading(false);
      if (driveUrl) {
        r.driveUrl = driveUrl;
        r.fileName = fileName;
        r.fileSize = fileSize;
        saveExtendedState();
        closeModal('modalAttachResearchDrive');
        renderResearchCards();
        showToast('เชื่อมโยงไฟล์ Google Drive เรียบร้อยแล้ว');
      } else {
        showToast('กรุณาเลือกไฟล์หรือระบุลิงก์ Google Drive');
      }
    }`;

if (html.includes(oldHandleAttachEnd)) {
  html = html.replace(oldHandleAttachEnd, newHandleAttachEnd);
  console.log('7. handleSaveAttachDrive end unlock added successfully');
} else {
  console.error('7. oldHandleAttachEnd NOT FOUND!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done updating index.html with loading animations and anti-double click!');
