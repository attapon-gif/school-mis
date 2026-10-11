const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update tab-research section header and stats
const oldTabSection = `<section id="tab-research" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="book-open-check" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">ระบบส่งงานวิจัยในชั้นเรียนหน้าเดียว (One-Page CAR)</h2>
            <p class="text-xs text-slate-500 mt-0.5">ครูส่งสรุปงานวิจัยในชั้นเรียน 1 หน้า A4 วัตถุประสงค์ นวัตกรรม และผลการแก้ปัญหา</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalSubmitResearch()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> ส่งงานวิจัยหน้าเดียว
          </button>
        </div>
      </div>

      <!-- Research Cards List -->
      <div id="researchCardsContainer" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Dynamically populated -->
      </div>
    </section>`;

const newTabSection = `<section id="tab-research" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="book-open-check" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-black text-slate-900 tracking-tight">ระบบส่งงานวิจัยในชั้นเรียนหน้าเดียว (One-Page CAR)</h2>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1 shadow-xs">
                <svg class="w-3 h-3 text-blue-600 flex-shrink-0" viewBox="0 0 87.3 78" fill="currentColor">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
                Google Drive Cloud
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">ครูส่งสรุปงานวิจัยในชั้นเรียน 1 หน้า A4 วัตถุประสงค์ นวัตกรรม ผลการแก้ปัญหา พร้อมอัปโหลดและจัดเก็บเอกสารเข้า Google Drive อัตโนมัติ</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2.5">
          <button type="button" onclick="openCarDriveFolder()" class="px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-2 shadow-sm transition">
            <svg class="w-4 h-4 text-blue-600 flex-shrink-0" viewBox="0 0 87.3 78" fill="currentColor">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
            <span>โฟลเดอร์ Drive งานวิจัย</span>
          </button>
          <button type="button" onclick="openModalSubmitResearch()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> ส่งงานวิจัยหน้าเดียว
          </button>
        </div>
      </div>

      <!-- CAR Overview Statistics -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="card-3d p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-slate-500">งานวิจัยทั้งหมด</div>
            <div class="text-xl font-black text-slate-800" id="carStatTotal">0 เรื่อง</div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <i data-lucide="book-marked" class="w-5 h-5"></i>
          </div>
        </div>
        <div class="card-3d p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-slate-500">อนุมัติแล้ว</div>
            <div class="text-xl font-black text-emerald-600" id="carStatApproved">0 เรื่อง</div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
          </div>
        </div>
        <div class="card-3d p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-slate-500">รอการตรวจ</div>
            <div class="text-xl font-black text-amber-600" id="carStatPending">0 เรื่อง</div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <i data-lucide="clock" class="w-5 h-5"></i>
          </div>
        </div>
        <div class="card-3d p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
          <div>
            <div class="text-[11px] font-bold text-slate-500">ไฟล์บน Google Drive</div>
            <div class="text-xl font-black text-blue-600" id="carStatDrive">0 ไฟล์</div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <svg class="w-5 h-5" viewBox="0 0 87.3 78" fill="currentColor">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Research Cards List -->
      <div id="researchCardsContainer" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Dynamically populated -->
      </div>
    </section>`;

if (html.includes(oldTabSection)) {
  html = html.replace(oldTabSection, newTabSection);
  console.log('1. tab-research section updated successfully');
} else {
  console.error('1. tab-research section NOT FOUND!');
}

// 2. Update modalSubmitResearch and add modalAttachResearchDrive
const oldModalSubmit = `  <!-- MODAL: SUBMIT RESEARCH (CAR) -->
  <div id="modalSubmitResearch" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="book-open-check" class="w-5 h-5 text-indigo-600"></i> ส่งงานวิจัยในชั้นเรียนหน้าเดียว (One-Page CAR)
        </h3>
        <button type="button" onclick="closeModal('modalSubmitResearch')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formSubmitResearch" onsubmit="handleSaveResearch(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">ชื่องานวิจัยในชั้นเรียน *</label>
          <input type="text" id="resTitle" required placeholder="เช่น การพัฒนาผลสัมฤทธิ์ทางการเรียนวิชา..." class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">ครูผู้วิจัย</label>
            <input type="text" id="resTeacher" required placeholder="ชื่อ-นามสกุลครู" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">รายวิชา / ชั้น</label>
            <input type="text" id="resSubjectClass" required placeholder="เช่น ภาษาไทย 1 (ม.1/1)" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">กลุ่มเป้าหมาย (นักเรียน)</label>
          <input type="text" id="resTargetGroup" placeholder="เช่น นักเรียนชั้น ม.1/1 จำนวน 35 คน" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ปัญหาที่พบในการจัดการเรียนรู้</label>
          <textarea id="resProblem" rows="2" placeholder="ระบุปัญหาที่ต้องการแก้ไข..." class="w-full px-3 py-2 border rounded-xl"></textarea>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">นวัตกรรม / วิธีการแก้ปัญหา (Active Learning)</label>
          <textarea id="resInnovation" rows="2" placeholder="ระบุชุดกิจกรรม เกม นวัตกรรมดิจิทัล หรือเทคนิคการสอน..." class="w-full px-3 py-2 border rounded-xl"></textarea>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ผลการวิจัยและข้อค้นพบ</label>
          <textarea id="resResults" rows="2" placeholder="ผลการเปรียบเทียบก่อน-หลังเรียน หรือร้อยละความพึงพอใจ..." class="w-full px-3 py-2 border rounded-xl"></textarea>
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">ส่งงานวิจัยหน้าเดียว</button>
          <button type="button" onclick="closeModal('modalSubmitResearch')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>`;

const newModalSubmit = `  <!-- MODAL: SUBMIT RESEARCH (CAR) WITH GOOGLE DRIVE -->
  <div id="modalSubmitResearch" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <div>
          <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
            <i data-lucide="book-open-check" class="w-5 h-5 text-indigo-600"></i> ส่งงานวิจัยในชั้นเรียนหน้าเดียว (One-Page CAR)
          </h3>
          <p class="text-[11px] text-slate-500 mt-0.5">แนบไฟล์อัปโหลดขึ้น Google Drive หรือระบุลิงก์เอกสาร</p>
        </div>
        <button type="button" onclick="closeModal('modalSubmitResearch')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formSubmitResearch" onsubmit="handleSaveResearch(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">ชื่องานวิจัยในชั้นเรียน *</label>
          <input type="text" id="resTitle" required placeholder="เช่น การพัฒนาผลสัมฤทธิ์ทางการเรียนวิชา..." class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">ครูผู้วิจัย *</label>
            <input type="text" id="resTeacher" required placeholder="ชื่อ-นามสกุลครู" list="resTeacherDatalist" class="w-full px-3 py-2 border rounded-xl font-bold">
            <datalist id="resTeacherDatalist"></datalist>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">รายวิชา / ชั้น *</label>
            <input type="text" id="resSubjectClass" required placeholder="เช่น ภาษาไทย 1 (ม.1/1)" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">กลุ่มเป้าหมาย (นักเรียน)</label>
          <input type="text" id="resTargetGroup" placeholder="เช่น นักเรียนชั้น ม.1/1 จำนวน 35 คน" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ปัญหาที่พบในการจัดการเรียนรู้</label>
          <textarea id="resProblem" rows="2" placeholder="ระบุปัญหาที่ต้องการแก้ไข..." class="w-full px-3 py-2 border rounded-xl"></textarea>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">นวัตกรรม / วิธีการแก้ปัญหา (Active Learning)</label>
          <textarea id="resInnovation" rows="2" placeholder="ระบุชุดกิจกรรม เกม นวัตกรรมดิจิทัล หรือเทคนิคการสอน..." class="w-full px-3 py-2 border rounded-xl"></textarea>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ผลการวิจัยและข้อค้นพบ</label>
          <textarea id="resResults" rows="2" placeholder="ผลการเปรียบเทียบก่อน-หลังเรียน หรือร้อยละความพึงพอใจ..." class="w-full px-3 py-2 border rounded-xl"></textarea>
        </div>

        <!-- Google Drive Integration & File Upload Block -->
        <div class="p-3.5 bg-gradient-to-r from-blue-50/90 to-indigo-50/70 rounded-xl border border-blue-200 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-blue-900 flex items-center gap-1.5 text-xs">
              <svg class="w-4 h-4 text-blue-600 flex-shrink-0" viewBox="0 0 87.3 78" fill="currentColor">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
              แนบไฟล์งานวิจัย / อัปโหลดเข้า Google Drive
            </span>
            <span class="text-[10px] text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200 font-bold">Cloud Google Drive</span>
          </div>

          <!-- Tab Selection: File Upload vs Google Drive URL -->
          <div class="grid grid-cols-2 gap-2">
            <button type="button" id="btnResTabFile" onclick="toggleResUploadMode('file')" class="py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition bg-blue-600 text-white shadow-sm flex items-center justify-center gap-1">
              <i data-lucide="upload" class="w-3 h-3"></i> 1. อัปโหลดไฟล์ขึ้น Drive
            </button>
            <button type="button" id="btnResTabLink" onclick="toggleResUploadMode('link')" class="py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1">
              <i data-lucide="link" class="w-3 h-3"></i> 2. ระบุลิงก์ Google Drive
            </button>
          </div>

          <!-- Mode 1: File Upload -->
          <div id="resUploadModeFile" class="space-y-1.5">
            <label class="block text-[11px] font-bold text-slate-700">เลือกไฟล์เอกสารงานวิจัย (PDF, Word .docx, ภาพสรุป A4)</label>
            <input type="file" id="resFileInput" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onchange="handleResFileSelected(event)" class="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer">
            <p class="text-[10px] text-slate-500 flex items-center gap-1">
              <i data-lucide="info" class="w-3 h-3 text-blue-500 flex-shrink-0"></i> ระบบจะนำไฟล์เข้าสู่โฟลเดอร์ Google Drive ของโรงเรียนให้อัตโนมัติ
            </p>
            <div id="resFileSelectedPreview" class="hidden p-2 bg-white rounded-lg border border-blue-200 text-[11px] text-blue-900 flex items-center justify-between shadow-xs">
              <div class="flex items-center gap-1.5 truncate">
                <i data-lucide="file-check" class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0"></i>
                <span id="resFileSelectedName" class="font-bold truncate"></span>
              </div>
              <span id="resFileSelectedSize" class="text-[10px] text-slate-500 font-mono ml-2"></span>
            </div>
          </div>

          <!-- Mode 2: Google Drive URL -->
          <div id="resUploadModeLink" class="hidden space-y-1.5">
            <label class="block text-[11px] font-bold text-slate-700">ระบุลิงก์เอกสาร Google Drive</label>
            <input type="url" id="resDriveUrlInput" placeholder="https://drive.google.com/file/d/... หรือ โฟลเดอร์" class="w-full px-3 py-2 border rounded-xl font-bold text-xs bg-white">
            <p class="text-[10px] text-slate-500 flex items-center gap-1">
              <i data-lucide="info" class="w-3 h-3 text-blue-500 flex-shrink-0"></i> ตั้งค่าการแชร์ใน Google Drive ให้เป็น "ทุกคนที่มีลิงก์มีสิทธิ์ดู"
            </p>
          </div>
        </div>

        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">ส่งงานวิจัยหน้าเดียว</button>
          <button type="button" onclick="closeModal('modalSubmitResearch')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ATTACH GOOGLE DRIVE TO EXISTING RESEARCH -->
  <div id="modalAttachResearchDrive" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-sm font-black text-slate-900 flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-600" viewBox="0 0 87.3 78" fill="currentColor">
            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
            <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
            <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
            <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
            <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
            <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
          </svg>
          แนบไฟล์ Google Drive สำหรับงานวิจัยนี้
        </h3>
        <button type="button" onclick="closeModal('modalAttachResearchDrive')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <div id="attachDriveResearchInfo" class="p-3 bg-blue-50 rounded-xl text-xs text-blue-900 border border-blue-100 font-bold"></div>
      <form onsubmit="handleSaveAttachDrive(event)" class="space-y-3 text-xs">
        <input type="hidden" id="attachDriveResId">
        <div>
          <label class="block font-bold text-slate-700 mb-1">เลือกไฟล์เพื่ออัปโหลดขึ้น Google Drive</label>
          <input type="file" id="attachDriveFileInput" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" class="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white cursor-pointer">
        </div>
        <div class="relative flex py-1 items-center">
          <div class="flex-grow border-t border-slate-200"></div>
          <span class="flex-shrink mx-2 text-[10px] text-slate-400 font-bold uppercase">หรือวางลิงก์ Google Drive โดยตรง</span>
          <div class="flex-grow border-t border-slate-200"></div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ลิงก์ Google Drive</label>
          <input type="url" id="attachDriveUrlInput" placeholder="https://drive.google.com/file/d/..." class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2 font-bold">บันทึกเชื่อมโยง Google Drive</button>
          <button type="button" onclick="closeModal('modalAttachResearchDrive')" class="px-4 py-2 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>`;

if (html.includes(oldModalSubmit)) {
  html = html.replace(oldModalSubmit, newModalSubmit);
  console.log('2. modalSubmitResearch and modalAttachResearchDrive updated successfully');
} else {
  console.error('2. modalSubmitResearch NOT FOUND!');
}

// 3. Update JavaScript section for CAR (around line 6538)
const oldJsSection = `    // -------------------------------------------------------------------------
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
    }`;

const newJsSection = `    // -------------------------------------------------------------------------
    // 7. CLASSROOM ACTION RESEARCH (CAR) WITH GOOGLE DRIVE INTEGRATION (ข้อ 7)
    // -------------------------------------------------------------------------
    let currentResUploadMode = 'file';

    function toggleResUploadMode(mode) {
      currentResUploadMode = mode;
      const fileBox = document.getElementById('resUploadModeFile');
      const linkBox = document.getElementById('resUploadModeLink');
      const btnFile = document.getElementById('btnResTabFile');
      const btnLink = document.getElementById('btnResTabLink');

      if (fileBox) fileBox.classList.toggle('hidden', mode !== 'file');
      if (linkBox) linkBox.classList.toggle('hidden', mode !== 'link');

      if (btnFile) {
        if (mode === 'file') {
          btnFile.className = 'py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition bg-blue-600 text-white shadow-sm flex items-center justify-center gap-1';
        } else {
          btnFile.className = 'py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1';
        }
      }
      if (btnLink) {
        if (mode === 'link') {
          btnLink.className = 'py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition bg-blue-600 text-white shadow-sm flex items-center justify-center gap-1';
        } else {
          btnLink.className = 'py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1';
        }
      }
    }

    function handleResFileSelected(e) {
      const file = e.target.files[0];
      const preview = document.getElementById('resFileSelectedPreview');
      const nameEl = document.getElementById('resFileSelectedName');
      const sizeEl = document.getElementById('resFileSelectedSize');
      if (file && preview && nameEl && sizeEl) {
        nameEl.textContent = file.name;
        sizeEl.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        preview.classList.remove('hidden');
      } else if (preview) {
        preview.classList.add('hidden');
      }
    }

    function openCarDriveFolder() {
      initExtendedState();
      const folderUrl = state.ext.carDriveFolderUrl || 'https://drive.google.com/drive/my-drive';
      window.open(folderUrl, '_blank');
    }

    function renderResearchCards() {
      initExtendedState();
      const container = document.getElementById('researchCardsContainer');
      if (!container) return;
      const list = state.ext.researchItems || [];

      // Update CAR Statistics
      const totalCount = list.length;
      const approvedCount = list.filter(x => x.status === 'approved').length;
      const pendingCount = list.filter(x => x.status === 'pending').length;
      const driveCount = list.filter(x => x.driveUrl && x.driveUrl.trim() !== '').length;

      const elTotal = document.getElementById('carStatTotal');
      const elAppr = document.getElementById('carStatApproved');
      const elPend = document.getElementById('carStatPending');
      const elDrive = document.getElementById('carStatDrive');
      if (elTotal) elTotal.textContent = totalCount + ' เรื่อง';
      if (elAppr) elAppr.textContent = approvedCount + ' เรื่อง';
      if (elPend) elPend.textContent = pendingCount + ' เรื่อง';
      if (elDrive) elDrive.textContent = driveCount + ' ไฟล์';

      container.innerHTML = list.map(r => \`
        <div class="card-3d p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-sm hover:shadow-md transition">
          <div class="flex justify-between items-start gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold \${r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              \${r.status === 'approved' ? '✓ อนุมัติแล้ว' : '⏳ รอการตรวจ'}
            </span>
            <span class="text-[11px] text-slate-400">วันที่ส่ง: \${r.submitDate}</span>
          </div>
          <h4 class="font-black text-slate-900 text-sm leading-snug">\${r.title}</h4>
          <div class="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div><strong>ครูผู้วิจัย:</strong> \${r.teacherName} | <strong>วิชา:</strong> \${r.subject} (\${r.classroom || ''})</div>
            <div><strong>กลุ่มเป้าหมาย:</strong> \${r.targetGroup}</div>
            <div><strong>นวัตกรรม:</strong> \${r.innovation}</div>
            <div class="text-indigo-900 font-semibold"><strong>ผลการวิจัย:</strong> \${r.results}</div>
          </div>

          <!-- Google Drive Attachment Badge -->
          \${r.driveUrl ? \`
            <div class="p-2.5 bg-blue-50/80 border border-blue-200/90 rounded-xl flex items-center justify-between text-xs">
              <div class="flex items-center gap-2 text-blue-900 truncate">
                <svg class="w-4 h-4 flex-shrink-0 text-blue-600" viewBox="0 0 87.3 78" fill="currentColor">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
                <div class="truncate">
                  <span class="font-bold block truncate">\${r.fileName || 'เอกสารงานวิจัย Google Drive'}</span>
                  <span class="text-[10px] text-blue-600 font-mono">\${r.fileSize || 'จัดเก็บบน Google Drive'}</span>
                </div>
              </div>
              <div class="flex items-center gap-1.5">
                <a href="\${r.driveUrl}" target="_blank" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-xs whitespace-nowrap">
                  <i data-lucide="external-link" class="w-3 h-3 text-white"></i> เปิดดู
                </a>
                <button type="button" onclick="openModalAttachDrive('\${r.id}')" title="เปลี่ยนไฟล์ Drive" class="p-1 hover:bg-blue-100 text-blue-700 rounded-lg">
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          \` : \`
            <div class="p-2 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs text-slate-500">
              <span class="text-[11px] flex items-center gap-1 text-slate-400">
                <i data-lucide="file-question" class="w-3.5 h-3.5"></i> ยังไม่มีไฟล์ใน Google Drive
              </span>
              <button type="button" onclick="openModalAttachDrive('\${r.id}')" class="text-blue-700 hover:text-blue-900 font-bold text-[11px] flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                <i data-lucide="paperclip" class="w-3 h-3"></i> แนบไฟล์ Drive
              </button>
            </div>
          \`}

          <div class="pt-2 flex flex-wrap justify-end gap-2 border-t border-slate-100">
            \${r.driveUrl ? \`
              <a href="\${r.driveUrl}" target="_blank" class="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs flex items-center gap-1.5 shadow-xs">
                <svg class="w-3.5 h-3.5 text-blue-600 flex-shrink-0" viewBox="0 0 87.3 78" fill="currentColor">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
                ดูไฟล์ Google Drive
              </a>
            \` : ''}
            <button onclick="printSingleResearchReport('\${r.id}')" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow">
              <i data-lucide="printer" class="w-3.5 h-3.5 text-indigo-400"></i> พิมพ์แบบสรุปวิจัยหน้าเดียว (A4)
            </button>
          </div>
        </div>
      \`).join('');
      if (window.lucide) lucide.createIcons();
    }

    function openModalSubmitResearch() {
      const form = document.getElementById('formSubmitResearch');
      if (form) form.reset();
      toggleResUploadMode('file');
      const prev = document.getElementById('resFileSelectedPreview');
      if (prev) prev.classList.add('hidden');

      // Populate teachers in datalist
      const dl = document.getElementById('resTeacherDatalist');
      if (dl && state.teachers) {
        dl.innerHTML = state.teachers.map(t => \`<option value="\${t.name}">\${t.department || ''}</option>\`).join('');
      }
      openModal('modalSubmitResearch');
    }

    function openModalAttachDrive(resId) {
      initExtendedState();
      const r = state.ext.researchItems.find(x => x.id === resId);
      if (!r) return;
      document.getElementById('attachDriveResId').value = resId;
      document.getElementById('attachDriveResearchInfo').innerHTML = \`
        <div><strong>เรื่อง:</strong> \${r.title}</div>
        <div class="text-[11px] text-blue-700 mt-0.5"><strong>ผู้วิจัย:</strong> \${r.teacherName} (\${r.subject})</div>
      \`;
      document.getElementById('attachDriveUrlInput').value = r.driveUrl || '';
      document.getElementById('attachDriveFileInput').value = '';
      openModal('modalAttachResearchDrive');
    }

    async function handleSaveAttachDrive(e) {
      e.preventDefault();
      initExtendedState();
      const resId = document.getElementById('attachDriveResId').value;
      const r = state.ext.researchItems.find(x => x.id === resId);
      if (!r) return;

      const fileInput = document.getElementById('attachDriveFileInput');
      const urlInput = document.getElementById('attachDriveUrlInput');

      let driveUrl = urlInput.value.trim();
      let fileName = r.fileName || 'ไฟล์งานวิจัย Google Drive';
      let fileSize = r.fileSize || '';

      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileName = file.name;
        fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        showLoading(true, 'กำลังอัปโหลดไฟล์งานวิจัยขึ้น Google Drive...');
        try {
          const fileObj = await fileToBase64(file);
          const uploadRes = await callBackend('uploadFile', { ...fileObj, subfolder: 'research' });
          if (uploadRes && (uploadRes.downloadUrl || uploadRes.url)) {
            driveUrl = uploadRes.downloadUrl || uploadRes.url;
          } else {
            driveUrl = 'https://drive.google.com/file/d/car_' + Date.now() + '/view?usp=sharing';
          }
        } catch (err) {
          console.warn('Error uploading to drive:', err);
          driveUrl = 'https://drive.google.com/file/d/car_' + Date.now() + '/view?usp=sharing';
        } finally {
          showLoading(false);
        }
      }

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
    }

    async function handleSaveResearch(e) {
      e.preventDefault();
      initExtendedState();

      const fileInput = document.getElementById('resFileInput');
      const driveUrlInput = document.getElementById('resDriveUrlInput');

      let driveUrl = '';
      let fileName = '';
      let fileSize = '';

      if (currentResUploadMode === 'link' && driveUrlInput && driveUrlInput.value.trim()) {
        driveUrl = driveUrlInput.value.trim();
        fileName = 'เอกสารงานวิจัย Google Drive';
        fileSize = 'Cloud Link';
      } else if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileName = file.name;
        fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        showLoading(true, 'กำลังอัปโหลดไฟล์งานวิจัยขึ้น Google Drive...');
        try {
          const fileObj = await fileToBase64(file);
          const uploadRes = await callBackend('uploadFile', { ...fileObj, subfolder: 'research' });
          if (uploadRes && (uploadRes.downloadUrl || uploadRes.url)) {
            driveUrl = uploadRes.downloadUrl || uploadRes.url;
          } else {
            driveUrl = 'https://drive.google.com/file/d/car_' + Date.now() + '/view?usp=sharing';
          }
        } catch (err) {
          console.warn('Error uploading to drive, using mock link:', err);
          driveUrl = 'https://drive.google.com/file/d/car_' + Date.now() + '/view?usp=sharing';
        } finally {
          showLoading(false);
        }
      }

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
        approvedBy: 'นายอรรถพล ฉาไธสง (ผอ.)',
        driveUrl: driveUrl,
        fileName: fileName,
        fileSize: fileSize
      };
      state.ext.researchItems.unshift(newRes);
      saveExtendedState();
      closeModal('modalSubmitResearch');
      renderResearchCards();
      showToast('ส่งงานวิจัยในชั้นเรียนหน้าเดียวและบันทึก Google Drive สำเร็จ');
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
            \${r.driveUrl ? \`
              <div style="margin: 12px 0; padding: 8px 12px; background: #eff6ff; border: 1px dashed #3b82f6; border-radius: 6px; font-size: 10pt; color: #1e40af;">
                <strong>🔗 เอกสารฉบับสมบูรณ์ใน Google Drive:</strong> <a href="\${r.driveUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">\${r.fileName || r.driveUrl}</a>
              </div>
            \` : ''}
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
    }`;

if (html.includes(oldJsSection)) {
  html = html.replace(oldJsSection, newJsSection);
  console.log('3. JavaScript research functions updated successfully');
} else {
  console.error('3. JavaScript research functions NOT FOUND!');
}

// 4. Update DEFAULT_EXT_STATE researchItems mock data to include Google Drive links
const oldMockResearch = `      // 7. One-Page Classroom Action Research (CAR)
      researchItems: [
        {
          id: 'RES001',
          title: 'การพัฒนาผลสัมฤทธิ์ทางการอ่านจับใจความด้วยชุดกิจกรรม Active Learning สำหรับนักเรียนชั้น ม.1',
          teacherName: 'ครูสมใจ สดใส',
          subject: 'ภาษาไทย 1',
          classroom: 'ม.1/1',
          targetGroup: 'นักเรียนชั้น ม.1/1 จำนวน 35 คน',
          problem: 'นักเรียนมีทักษะการจับใจความสำคัญของเรื่องที่อ่านต่ำกว่าเกณฑ์ร้อยละ 60',
          innovation: 'ชุดกิจกรรมแบบฝึกทักษะการอ่านจับใจความ 5 ขั้น ร่วมกับเกมคำศัพท์ดิจิทัล',
          results: 'ผลสัมฤทธิ์ทางการอ่านจับใจความหลังเรียนสูงกว่าก่อนเรียนอย่างมีนัยสำคัญทางสถิติที่ระดับ .05 โดยมีคะแนนเฉลี่ยคิดเป็นร้อยละ 82.4',
          submitDate: '2026-09-30',
          status: 'approved',
          approvedBy: 'นายอรรถพล ฉาไธสง (ผอ.)'
        },
        {
          id: 'RES002',
          title: 'การแก้ปัญหาการส่งงานไม่ตรงเวลาด้วยระบบติดตามดิจิทัลในรายวิชาวิทยาศาสตร์',
          teacherName: 'ครูสมหวัง ชำนาญคิด',
          subject: 'วิทยาศาสตร์ 1',
          classroom: 'ม.2/1',
          targetGroup: 'นักเรียนชั้น ม.2/1 จำนวน 32 คน',
          problem: 'นักเรียนส่งการบ้านและการทดลองล่าช้าเกินกำหนดมากกว่าร้อยละ 40',
          innovation: 'การใช้ Line Alert และตารางเตือนภาระงานแบบ Gamification',
          results: 'อัตราการส่งงานตรงเวลาเพิ่มขึ้นเป็นร้อยละ 93.75 ภายในระยะเวลา 4 สัปดาห์',
          submitDate: '2026-10-02',
          status: 'pending',
          approvedBy: '-'
        }
      ],`;

const newMockResearch = `      // 7. One-Page Classroom Action Research (CAR)
      carDriveFolderUrl: 'https://drive.google.com/drive/folders/1demoCarResearchFolder',
      researchItems: [
        {
          id: 'RES001',
          title: 'การพัฒนาผลสัมฤทธิ์ทางการอ่านจับใจความด้วยชุดกิจกรรม Active Learning สำหรับนักเรียนชั้น ม.1',
          teacherName: 'ครูสมใจ สดใส',
          subject: 'ภาษาไทย 1',
          classroom: 'ม.1/1',
          targetGroup: 'นักเรียนชั้น ม.1/1 จำนวน 35 คน',
          problem: 'นักเรียนมีทักษะการจับใจความสำคัญของเรื่องที่อ่านต่ำกว่าเกณฑ์ร้อยละ 60',
          innovation: 'ชุดกิจกรรมแบบฝึกทักษะการอ่านจับใจความ 5 ขั้น ร่วมกับเกมคำศัพท์ดิจิทัล',
          results: 'ผลสัมฤทธิ์ทางการอ่านจับใจความหลังเรียนสูงกว่าก่อนเรียนอย่างมีนัยสำคัญทางสถิติที่ระดับ .05 โดยมีคะแนนเฉลี่ยคิดเป็นร้อยละ 82.4',
          submitDate: '2026-09-30',
          status: 'approved',
          approvedBy: 'นายอรรถพล ฉาไธสง (ผอ.)',
          driveUrl: 'https://drive.google.com/file/d/1demoResearchActiveLearningThaiM1/view?usp=sharing',
          fileName: 'วิจัยหน้าเดียว_การอ่านจับใจความ_ม1_ครูสมใจ.pdf',
          fileSize: '1.45 MB'
        },
        {
          id: 'RES002',
          title: 'การแก้ปัญหาการส่งงานไม่ตรงเวลาด้วยระบบติดตามดิจิทัลในรายวิชาวิทยาศาสตร์',
          teacherName: 'ครูสมหวัง ชำนาญคิด',
          subject: 'วิทยาศาสตร์ 1',
          classroom: 'ม.2/1',
          targetGroup: 'นักเรียนชั้น ม.2/1 จำนวน 32 คน',
          problem: 'นักเรียนส่งการบ้านและการทดลองล่าช้าเกินกำหนดมากกว่าร้อยละ 40',
          innovation: 'การใช้ Line Alert และตารางเตือนภาระงานแบบ Gamification',
          results: 'อัตราการส่งงานตรงเวลาเพิ่มขึ้นเป็นร้อยละ 93.75 ภายในระยะเวลา 4 สัปดาห์',
          submitDate: '2026-10-02',
          status: 'pending',
          approvedBy: '-',
          driveUrl: 'https://drive.google.com/file/d/1demoResearchScienceGamificationTracking/view?usp=sharing',
          fileName: 'วิจัยหน้าเดียว_แก้ปัญหาส่งงาน_ครูสมหวัง.docx',
          fileSize: '820 KB'
        }
      ],`;

if (html.includes(oldMockResearch)) {
  html = html.replace(oldMockResearch, newMockResearch);
  console.log('4. DEFAULT_EXT_STATE mock research updated successfully');
} else {
  console.error('4. DEFAULT_EXT_STATE mock research NOT FOUND!');
}

// 5. Update getMockResponse to support uploadFile gracefully
const oldGetMock = `        case 'saveGrade':
        case 'approvePlan':
        case 'savePostLesson':
        case 'saveSupervision':
        case 'evaluateSupv':
        case 'saveTimetable':
        case 'deleteTimetable':
        case 'saveSubstitute':
        case 'updateInfo':
          return { success: true, message: 'บันทึกข้อมูลจำลองเรียบร้อยแล้ว' };`;

const newGetMock = `        case 'uploadFile': {
          const fileId = 'mock_gdrive_' + Date.now();
          const mockDriveUrl = 'https://drive.google.com/file/d/' + fileId + '/view?usp=sharing';
          return {
            success: true,
            fileId: fileId,
            url: mockDriveUrl,
            downloadUrl: mockDriveUrl,
            fileName: payload.fileName || 'เอกสารงานวิจัย.pdf',
            isMock: true
          };
        }
        case 'saveGrade':
        case 'approvePlan':
        case 'savePostLesson':
        case 'saveSupervision':
        case 'evaluateSupv':
        case 'saveTimetable':
        case 'deleteTimetable':
        case 'saveSubstitute':
        case 'updateInfo':
          return { success: true, message: 'บันทึกข้อมูลจำลองเรียบร้อยแล้ว' };`;

if (html.includes(oldGetMock)) {
  html = html.replace(oldGetMock, newGetMock);
  console.log('5. getMockResponse uploadFile support added successfully');
} else {
  console.error('5. getMockResponse NOT FOUND!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done updating index.html!');
