// scripts/nav_templates.js
// Template for updated sidebar navigation containing all 8 original items + 16 new items

function getNavHtml() {
  return `
        <nav class="space-y-3">
          <!-- หมวดที่ 1: ระบบหลักเดิม (Core MIS - คงไว้ครบถ้วน) -->
          <div class="space-y-1">
            <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span class="flex items-center gap-1.5"><i data-lucide="layers" class="w-3 h-3 text-blue-400"></i> ระบบวิชาการหลัก (เดิม)</span>
              <span class="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-semibold">8 ระบบ</span>
            </div>
            <button onclick="switchTab('tab-dashboard')" id="nav-dashboard" class="nav-tab active-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/30 transition-all duration-150 w-full text-left">
              <i data-lucide="layout-dashboard" class="w-4 h-4 text-amber-300 flex-shrink-0"></i>
              <span class="flex-1 truncate">หน้าหลัก (แดชบอร์ด)</span>
            </button>
            <button onclick="switchTab('tab-grades')" id="nav-grades" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="award" class="w-4 h-4 text-amber-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">1. ผลการเรียน & แก้ 0, ร, มส</span>
            </button>
            <button onclick="switchTab('tab-student')" id="nav-student" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="user-check" class="w-4 h-4 text-cyan-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">2. ตรวจสอบผลการเรียน (ปพ.6)</span>
            </button>
            <button onclick="switchTab('tab-plans')" id="nav-plans" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="file-check-2" class="w-4 h-4 text-emerald-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">3. แผนการสอน & บันทึกหลังสอน</span>
            </button>
            <button onclick="switchTab('tab-supervision')" id="nav-supervision" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="calendar-heart" class="w-4 h-4 text-purple-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">4. นิเทศภายใน & รูบริก สพฐ.</span>
            </button>
            <button onclick="switchTab('tab-timetable')" id="nav-timetable" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="layout-grid" class="w-4 h-4 text-orange-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">5. ตารางสอน & จัดสอนแทน</span>
            </button>
            <button onclick="switchTab('tab-users')" id="nav-users" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">6. กำหนดสิทธิ์ผู้ใช้งาน (RBAC)</span>
            </button>
            <button onclick="switchTab('tab-settings')" id="nav-settings" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="sliders-horizontal" class="w-4 h-4 text-slate-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">7. ตั้งค่าสถานศึกษา & ลายเซ็น</span>
            </button>
          </div>

          <!-- หมวดที่ 2: งานวัดผล & วิชาการเพิ่มเติม (New Academic & Evaluation) -->
          <div class="space-y-1 pt-2 border-t border-slate-800/60">
            <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300/80 flex items-center justify-between">
              <span class="flex items-center gap-1.5"><i data-lucide="graduation-cap" class="w-3 h-3 text-amber-400"></i> วิชาการ & วัดผลประเมินผล</span>
              <span class="text-[9px] bg-amber-950/60 text-amber-300 px-1.5 py-0.2 rounded font-semibold">6 ระบบ</span>
            </div>
            <button onclick="switchTab('tab-pp5')" id="nav-pp5" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="file-spreadsheet" class="w-4 h-4 text-emerald-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">8. ปพ.5 สมบูรณ์แบบ (คะแนน/เวลา/อ่านเขียน)</span>
            </button>
            <button onclick="switchTab('tab-remedial')" id="nav-remedial" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="file-cog" class="w-4 h-4 text-rose-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">9. ยื่นคำร้องแก้ 0 ร มส ออนไลน์</span>
            </button>
            <button onclick="switchTab('tab-exam-schedule')" id="nav-exam-schedule" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="calendar-range" class="w-4 h-4 text-cyan-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">10. ตารางสอบกลางภาค-ปลายภาค</span>
            </button>
            <button onclick="switchTab('tab-research')" id="nav-research" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="book-open-check" class="w-4 h-4 text-indigo-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">11. ส่งงานวิจัยในชั้นเรียนหน้าเดียว (CAR)</span>
            </button>
            <button onclick="switchTab('tab-downloads')" id="nav-downloads" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="folder-down" class="w-4 h-4 text-blue-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">12. คลังดาวน์โหลดสื่องานวิชาการ</span>
            </button>
            <button onclick="switchTab('tab-academic-calendar')" id="nav-academic-calendar" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="calendar-days" class="w-4 h-4 text-yellow-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">13. ปฏิทินวิชาการ & แจ้งเตือน LINE</span>
            </button>
          </div>

          <!-- หมวดที่ 3: งานกิจการนักเรียน & ดูแลช่วยเหลือ (Student Care & Affairs) -->
          <div class="space-y-1 pt-2 border-t border-slate-800/60">
            <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300/80 flex items-center justify-between">
              <span class="flex items-center gap-1.5"><i data-lucide="heart-handshake" class="w-3 h-3 text-cyan-400"></i> กิจการนักเรียน & ดูแลช่วยเหลือ</span>
              <span class="text-[9px] bg-cyan-950/60 text-cyan-300 px-1.5 py-0.2 rounded font-semibold">5 ระบบ</span>
            </div>
            <button onclick="switchTab('tab-attendance-daily')" id="nav-attendance-daily" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="check-check" class="w-4 h-4 text-emerald-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">14. เช็คชื่อเสาธง & กิจวัตร 4 มิติ</span>
            </button>
            <button onclick="switchTab('tab-homevisit')" id="nav-homevisit" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="home" class="w-4 h-4 text-amber-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">15. เยี่ยมบ้านนักเรียนออนไลน์ สพฐ.</span>
            </button>
            <button onclick="switchTab('tab-behavior')" id="nav-behavior" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="shield-alert" class="w-4 h-4 text-purple-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">16. แนะแนว & คะแนนความประพฤติ</span>
            </button>
            <button onclick="switchTab('tab-bmi')" id="nav-bmi" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="scale" class="w-4 h-4 text-teal-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">17. น้ำหนัก-ส่วนสูง & แปลผล BMI</span>
            </button>
            <button onclick="switchTab('tab-savings')" id="nav-savings" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="piggy-bank" class="w-4 h-4 text-pink-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">18. การออมเงินนักเรียนประจำห้อง</span>
            </button>
          </div>

          <!-- หมวดที่ 4: กิจกรรมพัฒนาผู้เรียน & ทะเบียนเรียนรวม (Activities & Registrar) -->
          <div class="space-y-1 pt-2 border-t border-slate-800/60">
            <div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-300/80 flex items-center justify-between">
              <span class="flex items-center gap-1.5"><i data-lucide="compass" class="w-3 h-3 text-purple-400"></i> กิจกรรม & ทะเบียนเรียนรวม</span>
              <span class="text-[9px] bg-purple-950/60 text-purple-300 px-1.5 py-0.2 rounded font-semibold">5 ระบบ</span>
            </div>
            <button onclick="switchTab('tab-clubs')" id="nav-clubs" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="users" class="w-4 h-4 text-sky-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">19. เลือกชุมนุมออนไลน์ & เช็คเวลา</span>
            </button>
            <button onclick="switchTab('tab-scouts')" id="nav-scouts" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="flag" class="w-4 h-4 text-amber-500 flex-shrink-0"></i>
              <span class="flex-1 truncate">20. ลูกเสือ - เนตรนารี</span>
            </button>
            <button onclick="switchTab('tab-dmc-students')" id="nav-dmc-students" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="database" class="w-4 h-4 text-blue-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">21. ฐานข้อมูล นร. & นำเข้า DMC</span>
            </button>
            <button onclick="switchTab('tab-iep')" id="nav-iep" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="sparkles" class="w-4 h-4 text-violet-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">22. แผน IEP & นร. บกพร่อง 9 ประเภท</span>
            </button>
            <button onclick="switchTab('tab-transfers')" id="nav-transfers" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="arrow-left-right" class="w-4 h-4 text-emerald-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">23. แจ้ง นร. ย้ายเข้า-ย้ายออก + LINE</span>
            </button>
          </div>
        </nav>
  `;
}

module.exports = { getNavHtml };
