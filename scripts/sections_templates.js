// scripts/sections_templates.js
// Generates complete HTML sections for all 16 new modules

function getSectionsHtml() {
  return `
    <!-- ================================================================= -->
    <!-- MODULE 8: ปพ.5 สมบูรณ์แบบ (TAB-PP5) [ข้อ 13] -->
    <!-- ================================================================= -->
    <section id="tab-pp5" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="file-spreadsheet" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">แบบรายงานผลการพัฒนาคุณภาพผู้เรียน (ปพ.5) สมบูรณ์แบบ</h2>
            <p class="text-xs text-slate-500 mt-0.5">รวมคะแนนเก็บ กลางภาค ปลายภาค เวลาเรียน คุณลักษณะ 8 ประการ และอ่านคิดวิเคราะห์</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalAddPp5Score()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> บันทึกคะแนน ปพ.5
          </button>
          <button type="button" onclick="printPp5Report()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-emerald-400"></i> พิมพ์แบบ ปพ.5 (สพฐ.)
          </button>
        </div>
      </div>

      <!-- Filters & Ratio Settings -->
      <div class="card-3d p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 border border-slate-200">
        <div class="flex flex-wrap items-center gap-3">
          <div>
            <label class="font-bold text-slate-700 mr-1.5">ชั้นเรียน:</label>
            <select id="pp5FilterClass" onchange="renderPp5Table()" class="px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-bold">
              <option value="ม.1/1">มัธยมศึกษาปีที่ 1/1</option>
              <option value="ม.1/2">มัธยมศึกษาปีที่ 1/2</option>
              <option value="ม.2/1">มัธยมศึกษาปีที่ 2/1</option>
              <option value="ป.6/1">ประถมศึกษาปีที่ 6/1</option>
            </select>
          </div>
          <div>
            <label class="font-bold text-slate-700 mr-1.5">รายวิชา:</label>
            <select id="pp5FilterSubject" onchange="renderPp5Table()" class="px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-bold">
              <option value="ท21101">ท21101 ภาษาไทย 1</option>
              <option value="ค21101">ค21101 คณิตศาสตร์ 1</option>
              <option value="ว21101">ว21101 วิทยาศาสตร์ 1</option>
              <option value="อ21101">อ21101 ภาษาอังกฤษ 1</option>
            </select>
          </div>
          <div>
            <label class="font-bold text-slate-700 mr-1.5">สัดส่วนคะแนน:</label>
            <span class="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              เก็บ 50 : กลางภาค 20 : ปลายภาค 30 (รวม 100)
            </span>
          </div>
        </div>
        <div class="text-[11px] text-slate-500 font-medium">
          * เวลาเรียนเชื่อมโยงจากระบบเข้าแถวหน้าเสาธงอัตโนมัติ (เกณฑ์สิทธิ์สอบ $\ge$ 80%)
        </div>
      </div>

      <!-- PP5 Table -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-900 text-white font-bold text-center">
              <tr>
                <th class="p-3 border-r border-slate-800 w-12" rowspan="2">ที่</th>
                <th class="p-3 border-r border-slate-800 text-left min-w-[150px]" rowspan="2">ชื่อ - นามสกุล</th>
                <th class="p-3 border-r border-slate-800 w-24" rowspan="2">เวลาเรียน<br><span class="text-[10px] text-cyan-300">(คาบ / %)</span></th>
                <th class="p-2 border-b border-r border-slate-800 bg-slate-800" colspan="3">การวัดและประเมินผลการเรียนรู้</th>
                <th class="p-3 border-r border-slate-800 w-16 bg-blue-950" rowspan="2">รวม<br>(100)</th>
                <th class="p-3 border-r border-slate-800 w-16 bg-blue-950" rowspan="2">ระดับ<br>ผลการเรียน</th>
                <th class="p-3 border-r border-slate-800 w-24" rowspan="2">คุณลักษณะ<br>อันพึงประสงค์ (8)</th>
                <th class="p-3 border-r border-slate-800 w-24" rowspan="2">การอ่าน คิด<br>วิเคราะห์ & เขียน</th>
                <th class="p-3 w-16" rowspan="2">จัดการ</th>
              </tr>
              <tr class="bg-slate-800 text-[11px]">
                <th class="p-1.5 border-r border-slate-700 w-16">เก็บ (50)</th>
                <th class="p-1.5 border-r border-slate-700 w-16">กลางภาค (20)</th>
                <th class="p-1.5 border-r border-slate-700 w-16">ปลายภาค (30)</th>
              </tr>
            </thead>
            <tbody id="pp5TableBody" class="divide-y divide-slate-200 bg-white">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 9: ยื่นคำร้องแก้ 0 ร มส ออนไลน์ (TAB-REMEDIAL) [ข้อ 14] -->
    <!-- ================================================================= -->
    <section id="tab-remedial" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="file-cog" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">ระบบยื่นคำร้องแก้ 0, ร, มส ออนไลน์ & ติดตามภาระงาน</h2>
            <p class="text-xs text-slate-500 mt-0.5">นร.ยื่นคำร้อง $\rightarrow$ ครูสั่งงาน $\rightarrow$ ครูประจำวิชาตรวจรับงาน $\rightarrow$ แอดมินอนุมัติเปลี่ยนเกรด</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalSubmitRemedialRequest()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="send" class="w-4 h-4"></i> นักเรียนยื่นคำร้องแก้ตัว
          </button>
          <button type="button" onclick="printRemedialSummary()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-cyan-400"></i> พิมพ์บัญชีขอแก้ผลการเรียน
          </button>
        </div>
      </div>

      <!-- Remedial Workflow Pipeline Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="card-3d p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div class="text-[11px] font-bold text-amber-800">1. ยื่นคำร้องแล้ว</div>
          <div class="text-2xl font-black text-amber-900 mt-1" id="statRemPending">1</div>
          <div class="text-[10px] text-amber-700 mt-0.5">รอมอบหมายภาระงาน</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div class="text-[11px] font-bold text-blue-800">2. กำลังทำภาระงาน</div>
          <div class="text-2xl font-black text-blue-900 mt-1" id="statRemWorking">1</div>
          <div class="text-[10px] text-blue-700 mt-0.5">นร.อยู่ระหว่างแก้ตัว</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div class="text-[11px] font-bold text-emerald-800">3. ครูตรวจผ่านแล้ว</div>
          <div class="text-2xl font-black text-emerald-900 mt-1" id="statRemPassed">1</div>
          <div class="text-[10px] text-emerald-700 mt-0.5">ครูประจำวิชาส่งงานแล้ว</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-purple-50 border border-purple-200">
          <div class="text-[11px] font-bold text-purple-800">4. อนุมัติเกรดแล้ว</div>
          <div class="text-2xl font-black text-purple-900 mt-1" id="statRemApproved">2</div>
          <div class="text-[10px] text-purple-700 mt-0.5">แอดมินปรับเกรดเข้าสู่ระบบ</div>
        </div>
      </div>

      <!-- Remedial Table -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900 text-white font-bold">
              <tr>
                <th class="p-3">รหัสคำร้อง</th>
                <th class="p-3">นักเรียน / ชั้น</th>
                <th class="p-3">รายวิชา</th>
                <th class="p-3 text-center">เกรดเดิม</th>
                <th class="p-3">ภาระงานที่มอบหมาย</th>
                <th class="p-3">ครูประจำวิชา</th>
                <th class="p-3 text-center">ครูตรวจงาน</th>
                <th class="p-3 text-center">แอดมินอนุมัติ</th>
                <th class="p-3 text-center">สถานะ</th>
                <th class="p-3 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody id="remedialTableBody" class="divide-y divide-slate-200 bg-white">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 10: จัดตารางสอบกลางภาค-ปลายภาค (TAB-EXAM-SCHEDULE) [ข้อ 11] -->
    <!-- ================================================================= -->
    <section id="tab-exam-schedule" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="calendar-range" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">การจัดตารางสอบกลางภาค / ปลายภาคเรียน (Conflict-Free)</h2>
            <p class="text-xs text-slate-500 mt-0.5">ตรวจสอบวิชา/ห้อง/ครูคุมสอบไม่ซ้ำกัน สั่งพิมพ์ตารางสอบ และส่งแจ้งเตือนเข้า LINE</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalAddExamPeriod()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> เพิ่มคาบสอบใหม่
          </button>
          <button type="button" onclick="printExamSchedule('student')" class="bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-cyan-300"></i> ตารางสอบ นร.
          </button>
          <button type="button" onclick="printExamSchedule('proctor')" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-amber-300"></i> ตารางคุมสอบครู
          </button>
          <button type="button" onclick="sendExamLineAlert()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow">
            <i data-lucide="send" class="w-4 h-4"></i> ส่งแจ้งเตือน LINE
          </button>
        </div>
      </div>

      <!-- Exam Conflict Warning Banner -->
      <div id="examConflictBanner" class="hidden p-3.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 text-xs font-bold flex items-center gap-2">
        <i data-lucide="alert-triangle" class="w-5 h-5 text-rose-600 flex-shrink-0"></i>
        <span id="examConflictMessage">ตรวจพบการชนกันของตารางสอบ!</span>
      </div>

      <!-- Exam Grid -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="p-4 bg-slate-900 text-white flex justify-between items-center text-xs">
          <div class="font-bold flex items-center gap-2">
            <i data-lucide="calendar" class="w-4 h-4 text-cyan-400"></i>
            <span>ตารางการสอบวัดผลกลางภาคเรียนที่ 1/2569 (โรงเรียนฝันใหม่)</span>
          </div>
          <span class="px-2.5 py-1 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-500/30">
            ระบบตรวจสอบความขัดแย้ง: เปิดใช้งาน (Smart Conflict-Free)
          </span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th class="p-3">วันที่สอบ</th>
                <th class="p-3">คาบ / เวลา</th>
                <th class="p-3">ระดับชั้น</th>
                <th class="p-3">รหัส - ชื่อวิชา</th>
                <th class="p-3">ห้องสอบ</th>
                <th class="p-3">ครูคุมสอบ 1</th>
                <th class="p-3">ครูคุมสอบ 2</th>
                <th class="p-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody id="examScheduleTableBody" class="divide-y divide-slate-200 bg-white">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 11: วิจัยในชั้นเรียนหน้าเดียว (TAB-RESEARCH) [ข้อ 7] -->
    <!-- ================================================================= -->
    <section id="tab-research" class="tab-content hidden space-y-6">
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
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 12: คลังดาวน์โหลดสื่องานวิชาการ (TAB-DOWNLOADS) [ข้อ 8] -->
    <!-- ================================================================= -->
    <section id="tab-downloads" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="folder-down" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">คลังดาวน์โหลดสื่องานวิชาการ & แบบฟอร์ม สพฐ.</h2>
            <p class="text-xs text-slate-500 mt-0.5">ศูนย์รวมเอกสารวิชาการ แบบฟอร์ม ปพ. คู่มือหลักสูตร และแผนการสอนตัวอย่าง</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalAddDownloadResource()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="upload-cloud" class="w-4 h-4"></i> แอดมินเพิ่มไฟล์วิชาการ
          </button>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex flex-wrap gap-2 text-xs" id="downloadCategoryPills">
        <button onclick="filterDownloads('all')" class="px-3 py-1.5 rounded-xl font-bold bg-blue-600 text-white shadow-sm">ทั้งหมด</button>
        <button onclick="filterDownloads('แบบฟอร์ม ปพ.')" class="px-3 py-1.5 rounded-xl font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100">แบบฟอร์ม ปพ.</button>
        <button onclick="filterDownloads('คู่มือหลักสูตร')" class="px-3 py-1.5 rounded-xl font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100">คู่มือหลักสูตร</button>
        <button onclick="filterDownloads('วิจัยและนวัตกรรม')" class="px-3 py-1.5 rounded-xl font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100">วิจัยและนวัตกรรม</button>
        <button onclick="filterDownloads('ระเบียบวิชาการ')" class="px-3 py-1.5 rounded-xl font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100">ระเบียบวิชาการ</button>
      </div>

      <!-- Downloads Grid -->
      <div id="downloadsGridContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Dynamically populated -->
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 13: ปฏิทินวิชาการ & แจ้งเตือน LINE (TAB-ACADEMIC-CALENDAR) [ข้อ 1] -->
    <!-- ================================================================= -->
    <section id="tab-academic-calendar" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="calendar-days" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">ปฏิทินปฏิบัติงานวิชาการ & แจ้งเตือนกลุ่ม LINE</h2>
            <p class="text-xs text-slate-500 mt-0.5">บันทึกกิจกรรมวิชาการ ตั้งเวลาล่วงหน้า และยิงแจ้งเตือนเข้ากลุ่ม LINE อัตโนมัติ</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalAddCalendarEvent()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="calendar-plus" class="w-4 h-4"></i> เพิ่มกิจกรรมวิชาการ
          </button>
          <button type="button" onclick="openModalLineConfig()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow">
            <i data-lucide="settings-2" class="w-4 h-4"></i> ตั้งค่า LINE Token
          </button>
          <button type="button" onclick="printAcademicCalendar()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-amber-300"></i> พิมพ์ปฏิทิน
          </button>
        </div>
      </div>

      <!-- LINE Status Card -->
      <div class="card-3d p-4 rounded-xl flex items-center justify-between bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            <i data-lucide="message-square" class="w-4 h-4"></i>
          </div>
          <div>
            <div class="font-bold">สถานะการเชื่อมต่อ LINE Notify: <span class="text-emerald-700 font-extrabold">🟢 พร้อมใช้งาน</span></div>
            <div class="text-[11px] text-emerald-700" id="lineTargetChannel">กลุ่มเป้าหมาย: กลุ่มวิชาการโรงเรียนฝันใหม่ (สพฐ.)</div>
          </div>
        </div>
        <button type="button" onclick="testSendLineNotifyQuick()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1">
          <i data-lucide="send" class="w-3.5 h-3.5"></i> ทดสอบยิงข้อความ
        </button>
      </div>

      <!-- Calendar Events Agenda List -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="p-4 bg-slate-900 text-white font-bold text-xs flex justify-between items-center">
          <span class="flex items-center gap-2"><i data-lucide="list-checks" class="w-4 h-4 text-amber-400"></i> รายการกิจกรรมวิชาการประจำภาคเรียน</span>
          <span class="text-[11px] text-slate-400">ระบบแจ้งเตือนอัตโนมัติ 07.00 น.</span>
        </div>
        <div class="p-4 divide-y divide-slate-100" id="calendarEventsList">
          <!-- Dynamically populated -->
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 14: บันทึกเข้าแถวหน้าเสาธง & กิจวัตร 4 มิติ (TAB-ATTENDANCE-DAILY) [ข้อ 2] -->
    <!-- ================================================================= -->
    <section id="tab-attendance-daily" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="check-check" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">บันทึกเวลาเข้าแถวหน้าเสาธง & กิจวัตรประจำวัน 4 มิติ</h2>
            <p class="text-xs text-slate-500 mt-0.5">เข้าแถว $\rightarrow$ ลิงก์เวลาเรียนทุกวิชา + อาหารกลางวัน + ดื่มนม + แปรงฟัน (อนุบาล-ป.6) อัตโนมัติ (แก้ไขปรับลดได้)</p>
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

      <!-- Date & Class Selector + Quick Action -->
      <div class="card-3d p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 border border-slate-200">
        <div class="flex flex-wrap items-center gap-3">
          <div>
            <label class="font-bold text-slate-700 mr-1.5">วันที่:</label>
            <input type="date" id="attendanceDateInput" value="2026-10-10" onchange="loadAttendanceForDate()" class="px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-bold">
          </div>
          <div>
            <label class="font-bold text-slate-700 mr-1.5">ชั้นเรียน:</label>
            <select id="attendanceClassSelect" onchange="loadAttendanceForDate()" class="px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-bold">
              <option value="ม.1/1">มัธยมศึกษาปีที่ 1/1</option>
              <option value="ม.1/2">มัธยมศึกษาปีที่ 1/2</option>
              <option value="ป.6/1">ประถมศึกษาปีที่ 6/1</option>
            </select>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" onclick="quickCheckAllPresent()" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm">
            <i data-lucide="check-circle-2" class="w-4 h-4"></i> มาครบทุกคน (Check All)
          </button>
        </div>
      </div>

      <!-- 4-in-1 Attendance Table -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-900 text-white font-bold text-center">
              <tr>
                <th class="p-3 border-r border-slate-800 w-12" rowspan="2">เลขที่</th>
                <th class="p-3 border-r border-slate-800 text-left min-w-[150px]" rowspan="2">ชื่อ - สกุล</th>
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

    <!-- ================================================================= -->
    <!-- MODULE 15: เยี่ยมบ้านนักเรียนออนไลน์ สพฐ. (TAB-HOMEVISIT) [ข้อ 6] -->
    <!-- ================================================================= -->
    <section id="tab-homevisit" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="home" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">ระบบงานเยี่ยมบ้านนักเรียนออนไลน์ (แบบฟอร์ม สพฐ.)</h2>
            <p class="text-xs text-slate-500 mt-0.5">บันทึกข้อมูลสภาพครอบครัว แนบรูปภาพบ้าน/ผู้ปกครอง ลายเซ็นดิจิทัล และพิมพ์รายงาน 2 หน้า A4</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalNewHomeVisit()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> บันทึกการเยี่ยมบ้านใหม่
          </button>
        </div>
      </div>

      <!-- Home Visit Cards Grid -->
      <div id="homeVisitCardsContainer" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Dynamically populated -->
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 16: แนะแนว & คะแนนความประพฤติ (TAB-BEHAVIOR) [ข้อ 12] -->
    <!-- ================================================================= -->
    <section id="tab-behavior" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="shield-alert" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">งานแนะแนว & ระบบคะแนนความประพฤติ (Merit / Demerit)</h2>
            <p class="text-xs text-slate-500 mt-0.5">คะแนนเริ่มต้น 100 คะแนน ทำผิดตัดคะแนน ทำดีบวกคะแนนเพิ่ม พร้อมพิมพ์ใบเตือนพฤติกรรม</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalAddBehaviorRecord('demerit')" class="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow">
            <i data-lucide="minus-circle" class="w-4 h-4"></i> ตัดคะแนน (ทำผิด)
          </button>
          <button type="button" onclick="openModalAddBehaviorRecord('merit')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> เพิ่มคะแนน (ทำความดี)
          </button>
          <button type="button" onclick="printBehaviorSummaryReport()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-purple-300"></i> พิมพ์สรุปความประพฤติ
          </button>
        </div>
      </div>

      <!-- Behavior Students Table -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="p-4 bg-slate-900 text-white font-bold text-xs flex justify-between items-center">
          <span>รายชื่อนักเรียนและคะแนนความประพฤติคงเหลือ (ชั้น ม.1/1)</span>
          <span class="text-[11px] text-slate-400">เกณฑ์มาตรฐาน: เต็ม 100 | ต่ำกว่า 60 แจ้งผู้ปกครอง</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th class="p-3 w-12 text-center">เลขที่</th>
                <th class="p-3">รหัสนักเรียน</th>
                <th class="p-3">ชื่อ - นามสกุล</th>
                <th class="p-3 text-center">คะแนนคงเหลือ</th>
                <th class="p-3">สถานะพฤติกรรม</th>
                <th class="p-3">รายการล่าสุด</th>
                <th class="p-3 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody id="behaviorTableBody" class="divide-y divide-slate-200 bg-white">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
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
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 18: การออมเงินนักเรียน (TAB-SAVINGS) [ข้อ 4] -->
    <!-- ================================================================= -->
    <section id="tab-savings" class="tab-content hidden space-y-6">
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

      <!-- Savings Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card-3d p-4 rounded-xl bg-pink-50 border border-pink-200">
          <div class="text-xs font-bold text-pink-800">ยอดเงินออมสะสมทั้งห้อง</div>
          <div class="text-2xl font-black text-pink-900 mt-1" id="statSavingsTotal">9,700 ฿</div>
          <div class="text-[11px] text-pink-700 mt-0.5">ชั้นเรียน ม.1/1 (6 บัญชี)</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div class="text-xs font-bold text-emerald-800">ยอดเงินฝากสัปดาห์นี้</div>
          <div class="text-2xl font-black text-emerald-900 mt-1">260 ฿</div>
          <div class="text-[11px] text-emerald-700 mt-0.5">เฉลี่ย 43.3 บาท/คน</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div class="text-xs font-bold text-blue-800">นักเรียนที่มีการออมสม่ำเสมอ</div>
          <div class="text-2xl font-black text-blue-900 mt-1">100 %</div>
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

    <!-- ================================================================= -->
    <!-- MODULE 19: เลือกชุมนุมออนไลน์ (TAB-CLUBS) [ข้อ 9] -->
    <!-- ================================================================= -->
    <section id="tab-clubs" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="users" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">การเลือกชุมนุมออนไลน์ & เช็คเวลาเรียนชุมนุม</h2>
            <p class="text-xs text-slate-500 mt-0.5">ครูจัดตั้งชุมนุม นักเรียนเลือกสมัครออนไลน์ ครูเช็คเวลาเรียน และพิมพ์รายชื่อสรุปส่งวิชาการ</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalCreateClub()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> จัดตั้งชุมนุมใหม่
          </button>
          <button type="button" onclick="printClubsReport()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-sky-400"></i> พิมพ์สรุปรายชื่อและเวลาเรียน
          </button>
        </div>
      </div>

      <!-- Clubs Cards Grid -->
      <div id="clubsGridContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Dynamically populated -->
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 20: ลูกเสือ-เนตรนารี (TAB-SCOUTS) [ข้อ 10] -->
    <!-- ================================================================= -->
    <section id="tab-scouts" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="flag" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">กิจกรรมพัฒนาผู้เรียน: ลูกเสือ - เนตรนารี</h2>
            <p class="text-xs text-slate-500 mt-0.5">เช็คชื่อเข้าร่วมกิจกรรมรายสัปดาห์ ประเมินผลผ่านกิจกรรมวิชาพิเศษ และพิมพ์เอกสารสรุป</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalAddScoutActivity()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> บันทึกกิจกรรมประจำสัปดาห์
          </button>
          <button type="button" onclick="printScoutsReport()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-amber-400"></i> พิมพ์สรุปกิจกรรมลูกเสือ
          </button>
        </div>
      </div>

      <!-- Scout Troops & Activity List -->
      <div id="scoutsContainer" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Dynamically populated -->
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 21: ฐานข้อมูล นร. & นำเข้า Excel DMC (TAB-DMC-STUDENTS) [ข้อ 5] -->
    <!-- ================================================================= -->
    <section id="tab-dmc-students" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="database" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">ฐานข้อมูลนักเรียน & นำเข้าไฟล์ Excel DMC (สพฐ.)</h2>
            <p class="text-xs text-slate-500 mt-0.5">ดึงข้อมูลจาก Excel ระบบ DMC สพฐ. เพื่อเป็นฐานข้อมูลหลัก พิมพ์ป้ายล็อกเกอร์ หรือพิมพ์ข้อมูลวิชาการ</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalImportDmcExcel()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="file-up" class="w-4 h-4"></i> นำเข้าไฟล์ Excel DMC
          </button>
          <button type="button" onclick="printLockerNameTags()" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="tags" class="w-4 h-4 text-amber-300"></i> พิมพ์ป้ายใส่ล็อกเกอร์ / โต๊ะ
          </button>
          <button type="button" onclick="printDmcStudentDatabaseReport()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-cyan-400"></i> พิมพ์ทะเบียนข้อมูลวิชาการ
          </button>
        </div>
      </div>

      <!-- DMC Students Table -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="p-4 bg-slate-900 text-white font-bold text-xs flex justify-between items-center">
          <span class="flex items-center gap-2"><i data-lucide="users" class="w-4 h-4 text-cyan-400"></i> ทะเบียนข้อมูลนักเรียนรายบุคคล (DMC Database)</span>
          <span class="text-[11px] text-slate-400" id="dmcTotalCountBadge">ทั้งหมด 6 คน</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th class="p-3 w-12 text-center">เลขที่</th>
                <th class="p-3">รหัส DMC</th>
                <th class="p-3">รหัส นร.</th>
                <th class="p-3">เลขประจำตัวประชาชน</th>
                <th class="p-3">ชื่อ - สกุล</th>
                <th class="p-3 text-center">เพศ</th>
                <th class="p-3">ชั้นเรียน</th>
                <th class="p-3">เบอร์โทรผู้ปกครอง</th>
                <th class="p-3 text-center">ป้ายล็อกเกอร์</th>
                <th class="p-3 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody id="dmcStudentsTableBody" class="divide-y divide-slate-200 bg-white">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 22: แผน IEP & นักเรียนที่มีความบกพร่อง 9 ประเภท (TAB-IEP) [ข้อ 15] -->
    <!-- ================================================================= -->
    <section id="tab-iep" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="sparkles" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">การจัดการศึกษาพิเศษ & แผน IEP นักเรียนเรียนรวม (9 ประเภท)</h2>
            <p class="text-xs text-slate-500 mt-0.5">ครูที่ปรึกษาเพิ่มรายชื่อ ส่งแผน IEP และสรุปสถิตินักเรียนที่มีความบกพร่องทั้ง 9 ประเภท สพฐ.</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalAddIepStudent()" class="btn-ega-primary text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
            <i data-lucide="user-plus" class="w-4 h-4"></i> เพิ่มรายชื่อ นร. เรียนรวม
          </button>
          <button type="button" onclick="printIepSummaryReport()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-violet-400"></i> พิมพ์สรุปรายงานเรียนรวม (สพฐ.)
          </button>
        </div>
      </div>

      <!-- 9 Disability Types Summary Badges -->
      <div class="card-3d p-4 rounded-xl bg-violet-50 border border-violet-200 text-xs">
        <div class="font-bold text-violet-900 mb-2 flex items-center gap-1.5">
          <i data-lucide="info" class="w-4 h-4 text-violet-600"></i> จำแนกตาม 9 ประเภทความบกพร่องทางการศึกษา (สพฐ.):
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-violet-800">
          <div>1. ทางการเห็น (0 คน)</div>
          <div>2. ทางการได้ยิน (0 คน)</div>
          <div>3. ทางสติปัญญา (0 คน)</div>
          <div>4. ทางร่างกาย/การเคลื่อนไหว/สุขภาพ (1 คน)</div>
          <div class="font-bold text-violet-950">5. ทางการเรียนรู้ LD (1 คน)</div>
          <div>6. ทางการพูดและภาษา (0 คน)</div>
          <div>7. ทางพฤติกรรมหรืออารมณ์ (0 คน)</div>
          <div>8. ออทิสติก (0 คน)</div>
          <div>9. พิการซ้อน (0 คน)</div>
        </div>
      </div>

      <!-- IEP Students Table -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900 text-white font-bold">
              <tr>
                <th class="p-3">รหัส นร.</th>
                <th class="p-3">ชื่อ - นามสกุล</th>
                <th class="p-3">ชั้นเรียน</th>
                <th class="p-3">ประเภทความบกพร่อง (9 ประเภท)</th>
                <th class="p-3">ความต้องการจำเป็นพิเศษ</th>
                <th class="p-3">ครูผู้รับผิดชอบ / ที่ปรึกษา</th>
                <th class="p-3 text-center">แผน IEP</th>
                <th class="p-3 text-center">ผลการประเมิน</th>
                <th class="p-3 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody id="iepStudentsTableBody" class="divide-y divide-slate-200 bg-white">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 23: แจ้ง นร. ย้ายเข้า-ย้ายออก & แจ้งเตือน LINE (TAB-TRANSFERS) [ข้อ 16] -->
    <!-- ================================================================= -->
    <section id="tab-transfers" class="tab-content hidden space-y-6">
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="arrow-left-right" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-slate-900 tracking-tight">ระบบแจ้งนักเรียนย้ายเข้า - ย้ายออก & แจ้งเตือนผ่าน LINE</h2>
            <p class="text-xs text-slate-500 mt-0.5">ครูแอดมินบันทึกการรับย้ายและจำหน่ายนักเรียน พร้อมยิงแจ้งเตือนเด้งเข้ากลุ่ม LINE อัตโนมัติ</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button type="button" onclick="openModalAddTransfer('transfer_in')" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow">
            <i data-lucide="user-plus" class="w-4 h-4"></i> บันทึกนักเรียนย้ายเข้า
          </button>
          <button type="button" onclick="openModalAddTransfer('transfer_out')" class="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow">
            <i data-lucide="user-minus" class="w-4 h-4"></i> บันทึกนักเรียนย้ายออก
          </button>
          <button type="button" onclick="printTransfersReport()" class="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow">
            <i data-lucide="printer" class="w-4 h-4 text-emerald-400"></i> พิมพ์ทะเบียนการย้าย
          </button>
        </div>
      </div>

      <!-- Transfers Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card-3d p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div class="text-xs font-bold text-emerald-800">นักเรียนย้ายเข้า (ภาคเรียนนี้)</div>
          <div class="text-2xl font-black text-emerald-900 mt-1" id="statTransferIn">1 คน</div>
          <div class="text-[11px] text-emerald-700 mt-0.5">เพิ่มเข้าสู่ระบบทะเบียนแล้ว</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-rose-50 border border-rose-200">
          <div class="text-xs font-bold text-rose-800">นักเรียนย้ายออก (ภาคเรียนนี้)</div>
          <div class="text-2xl font-black text-rose-900 mt-1" id="statTransferOut">1 คน</div>
          <div class="text-[11px] text-rose-700 mt-0.5">จำหน่ายออกจากระบบทะเบียนแล้ว</div>
        </div>
        <div class="card-3d p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div class="text-xs font-bold text-blue-800">ยอดนักเรียนคงเหลือสุทธิ</div>
          <div class="text-2xl font-black text-blue-900 mt-1">145 คน</div>
          <div class="text-[11px] text-blue-700 mt-0.5">ข้อมูลอัปเดตแบบเรียลไทม์</div>
        </div>
      </div>

      <!-- Transfers Table -->
      <div class="card-3d rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900 text-white font-bold">
              <tr>
                <th class="p-3">วันที่</th>
                <th class="p-3 text-center">ประเภท</th>
                <th class="p-3">รหัส นร.</th>
                <th class="p-3">ชื่อ - นามสกุล</th>
                <th class="p-3">ชั้นเรียน</th>
                <th class="p-3">โรงเรียนเดิม / ปลายทาง</th>
                <th class="p-3">สาเหตุการย้าย</th>
                <th class="p-3">เลขที่หนังสือ</th>
                <th class="p-3 text-center">แจ้งเตือน LINE</th>
                <th class="p-3 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody id="transfersTableBody" class="divide-y divide-slate-200 bg-white">
              <!-- Dynamically populated -->
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

module.exports = { getSectionsHtml };
