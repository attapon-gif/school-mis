const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

console.log('Step 1: Adding Menu 24 to sidebar...');

// 1. In Sidebar: Update badge from 5 ระบบ to 6 ระบบ, and add button 24 after button 23
const oldBadge = `<span class="bg-indigo-900/60 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded-full border border-indigo-700/40">5 ระบบ</span>`;
const newBadge = `<span class="bg-indigo-900/60 text-indigo-300 text-[10px] px-1.5 py-0.5 rounded-full border border-indigo-700/40">6 ระบบ</span>`;
if (html.includes(oldBadge)) {
  html = html.replace(oldBadge, newBadge);
}

const navTransfersAnchor = `<button onclick="switchTab('tab-transfers')" id="nav-transfers" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="arrow-left-right" class="w-4 h-4 text-emerald-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">23. แจ้ง นร. ย้ายเข้า-ย้ายออก + LINE</span>
            </button>`;

const newNavButton = navTransfersAnchor + `
            <button onclick="switchTab('tab-print-center')" id="nav-print-center" class="nav-tab flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150 w-full text-left">
              <i data-lucide="printer" class="w-4 h-4 text-rose-400 flex-shrink-0"></i>
              <span class="flex-1 truncate">24. ดาวน์โหลด / สั่งพิมพ์เอกสาร</span>
            </button>`;

if (!html.includes(navTransfersAnchor)) {
  console.error('ERROR: navTransfersAnchor not found!');
  process.exit(1);
}
html = html.replace(navTransfersAnchor, newNavButton);
console.log('Sidebar Menu 24 button added.');

// 2. Add Section tab-print-center in HTML
console.log('Step 2: Adding tab-print-center section HTML...');

const sectionTransfersEnd = `        </div>
      </div>
    </section>
  



  </main>`;

const printCenterSectionHtml = `        </div>
      </div>
    </section>

    <!-- ================================================================= -->
    <!-- MODULE 24: ศูนย์รวมดาวน์โหลด & สั่งพิมพ์เอกสารวิชาการ (TAB-PRINT-CENTER) -->
    <!-- ================================================================= -->
    <section id="tab-print-center" class="tab-content hidden space-y-6">
      <!-- Header Banner -->
      <div class="card-3d p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 bg-gradient-to-r from-rose-50/70 via-white to-pink-50/70">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl shadow-sm">
            <i data-lucide="printer" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-black text-slate-900 tracking-tight">24. ศูนย์รวมดาวน์โหลด & สั่งพิมพ์เอกสารวิชาการ</h2>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300">รวม 26+ รายการ</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">รวมทุกเอกสาร ปพ.1-ปพ.6, เล่ม ปพ.5, ตารางสอนแนวนอน, ป้ายล็อกเกอร์, เช็คชื่อ, โภชนาการ และแบบฟอร์มทางการ สั่งพิมพ์ได้ในคลิกเดียว</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" onclick="triggerPrintCenterQuick('p6_batch')" class="btn-ega-primary text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow">
            <i data-lucide="award" class="w-4 h-4"></i> พิมพ์ ปพ.6 ยกห้อง
          </button>
          <button type="button" onclick="triggerPrintCenterQuick('pp5_full')" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow">
            <i data-lucide="book-open" class="w-4 h-4 text-emerald-300"></i> พิมพ์เล่ม ปพ.5
          </button>
          <button type="button" onclick="triggerPrintCenterQuick('timetable')" class="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow">
            <i data-lucide="calendar" class="w-4 h-4 text-indigo-300"></i> ตารางสอนแนวนอน
          </button>
        </div>
      </div>

      <!-- Filter Controls: Classroom + Category + Live Search -->
      <div class="card-3d p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-1.5">
            <label class="font-bold text-slate-700 whitespace-nowrap"><i data-lucide="school" class="w-3.5 h-3.5 inline text-blue-600"></i> ระดับชั้น/ห้องเรียน:</label>
            <select id="printCenterClassSelect" onchange="syncPrintCenterClass(this.value)" class="px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-rose-500">
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
          <div class="flex items-center gap-1.5">
            <label class="font-bold text-slate-700 whitespace-nowrap"><i data-lucide="filter" class="w-3.5 h-3.5 inline text-rose-600"></i> หมวดหมู่เอกสาร:</label>
            <select id="printCenterCategorySelect" onchange="renderPrintCenterCards()" class="px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-800 shadow-2xs focus:ring-2 focus:ring-rose-500">
              <option value="all">📂 เอกสารทุกหมวดหมู่ (แสดงทั้งหมด)</option>
              <option value="grades">🏆 งานวัดผล & ปพ. (ปพ.1, ปพ.5, ปพ.6, ตัดเกรด, CSV)</option>
              <option value="plans">📚 งานแผนการสอน & นิเทศ (แผน, รูบริก 100 คะแนน, สอนแทน)</option>
              <option value="timetables">🗓️ งานตารางสอน & ปฏิทินวิชาการ (A4 แนวนอน, ปฏิทิน 2569)</option>
              <option value="student_affairs">💚 งานกิจวัตร & ดูแลช่วยเหลือ (เสาธง, BMI, ความประพฤติ, ออมเงิน, เยี่ยมบ้าน)</option>
              <option value="dmc_locker">🗃️ งานทะเบียนนักเรียน & ล็อกเกอร์ (ป้าย 5 ช่อง, ป้ายโต๊ะ, ทะเบียน DMC, ย้ายเข้า-ออก)</option>
              <option value="activities_templates">🎯 กิจกรรม, CAR & แม่แบบดาวน์โหลด (ชุมนุม, ลูกเสือ, IEP, วิจัย, แม่แบบ Excel)</option>
            </select>
          </div>
          <div class="relative">
            <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"></i>
            <input type="text" id="printCenterSearchInput" oninput="renderPrintCenterCards()" placeholder="🔍 ค้นหาชื่อเอกสาร หรือแบบฟอร์ม..." class="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white font-normal shadow-2xs focus:ring-2 focus:ring-rose-500 w-52 sm:w-64">
          </div>
        </div>
        <div>
          <span id="printCenterCountBadge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 font-bold border border-rose-200 text-xs">
            ⚡ พร้อมสั่งพิมพ์ 26 รายการ
          </span>
        </div>
      </div>

      <!-- Document Cards Container -->
      <div id="printCenterCardsContainer" class="space-y-6">
        <!-- Rendered dynamically -->
      </div>
    </section>
`;

const mainCloseIdx = html.indexOf('</main>');
if (mainCloseIdx === -1) {
  console.error('ERROR: </main> not found!');
  process.exit(1);
}
html = html.slice(0, mainCloseIdx) + printCenterSectionHtml + '\n  ' + html.slice(mainCloseIdx);
console.log('tab-print-center HTML inserted.');

// 3. In switchTab, add renderer call
console.log('Step 3: Updating switchTab function...');
const switchTabAnchor = `else if (tabId === 'tab-transfers') renderTransfersTable();`;
const newSwitchTab = switchTabAnchor + `\n      else if (tabId === 'tab-print-center') renderPrintCenter();`;
if (!html.includes(switchTabAnchor)) {
  console.error('ERROR: switchTabAnchor not found!');
  process.exit(1);
}
html = html.replace(switchTabAnchor, newSwitchTab);
console.log('switchTab updated.');

// 4. Add JavaScript logic for print center
console.log('Step 4: Inserting Print Center JavaScript logic...');
const printCenterJs = `
    // -------------------------------------------------------------------------
    // MODULE 24: ศูนย์รวมดาวน์โหลด & สั่งพิมพ์เอกสารวิชาการ (PRINT & DOWNLOAD CENTER)
    // -------------------------------------------------------------------------
    const PRINT_CENTER_DOCS = [
      // 1. Grades & Transcripts
      {
        id: 'doc_p6_batch',
        category: 'grades',
        categoryName: 'งานวัดผล & ผลการเรียน (ปพ.1 - ปพ.6)',
        categoryColor: 'blue',
        title: 'ปพ.6 สมุดรายงานผลการพัฒนาคุณภาพผู้เรียน (ปพ.6 ยกห้องเรียน)',
        code: 'ปพ.6 (ห้อง)',
        badge: 'รายงาน ปพ.6',
        desc: 'พิมพ์แบบรายงานผลการเรียนและพัฒนาการรายบุคคลครบทุกคนในห้องเรียนที่เลือก พร้อมคำนวณเกรดเฉลี่ย GPA และผลสัมฤทธิ์',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์ ปพ.6 ยกห้อง',
        btnClass: 'btn-ega-primary',
        icon: 'award',
        action: function() {
          const cls = document.getElementById('printCenterClassSelect')?.value || 'ป.6/1';
          const p6Sel = document.getElementById('p6BatchClassSelect');
          if (p6Sel) p6Sel.value = cls;
          if (typeof onP6BatchClassChange === 'function') onP6BatchClassChange();
          printClassroomP6Batch();
        }
      },
      {
        id: 'doc_p6_single',
        category: 'grades',
        categoryName: 'งานวัดผล & ผลการเรียน (ปพ.1 - ปพ.6)',
        categoryColor: 'blue',
        title: 'ปพ.6 รายบุคคล (บัตรรายงานผลการเรียนรายคน)',
        code: 'ปพ.6 (รายคน)',
        badge: 'ปพ.6 รายคน',
        desc: 'พิมพ์สมุดรายงานผลการเรียน ปพ.6 สำหรับนักเรียนรายบุคคล พร้อมสรุปคะแนนเก็บ กลางภาค ปลายภาค และคุณลักษณะ',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์ ปพ.6 รายคน',
        btnClass: 'bg-blue-600 hover:bg-blue-700 text-white font-bold',
        icon: 'user-check',
        action: function() {
          printStudentReport();
        }
      },
      {
        id: 'doc_pp5_full',
        category: 'grades',
        categoryName: 'งานวัดผล & ผลการเรียน (ปพ.1 - ปพ.6)',
        categoryColor: 'blue',
        title: 'ปพ.5 สมุดบันทึกผลการพัฒนาคุณภาพผู้เรียน (เล่มสมบูรณ์ทั้งเล่ม)',
        code: 'ปพ.5 เต็มเล่ม',
        badge: 'ปพ.5 สมบูรณ์',
        desc: 'พิมพ์เล่ม ปพ.5 เต็มรูปเล่ม รวมปก, คำชี้แจง, โครงสร้างรายวิชา, ตัวชี้วัด, คุณลักษณะ 8 ด้าน, อ่านคิดวิเคราะห์ และสรุปผลตัดเกรด',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์เล่ม ปพ.5 ทั้งเล่ม',
        btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold',
        icon: 'book-open',
        action: function() {
          printPp5Report('all');
        }
      },
      {
        id: 'doc_pp5_summary',
        category: 'grades',
        categoryName: 'งานวัดผล & ผลการเรียน (ปพ.1 - ปพ.6)',
        categoryColor: 'blue',
        title: 'แบบรายงานสรุปผลการเรียนและอนุมัติผลการเรียน ปพ.5 (หน้าสรุปเกรด)',
        code: 'ปพ.5 อนุมัติ',
        badge: 'หน้าอนุมัติเกรด',
        desc: 'พิมพ์เฉพาะหน้าสรุปผลสัมฤทธิ์ทางการเรียน ร้อยละผลการประเมิน พร้อมช่องลงนามครูผู้สอน หัวหน้าวิชาการ และผู้อำนวยการ',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์หน้าสรุปอนุมัติ ปพ.5',
        btnClass: 'bg-emerald-800 hover:bg-emerald-900 text-white font-bold',
        icon: 'file-check',
        action: function() {
          printPp5Report('publish');
        }
      },
      {
        id: 'doc_grade_room_summary',
        category: 'grades',
        categoryName: 'งานวัดผล & ผลการเรียน (ปพ.1 - ปพ.6)',
        categoryColor: 'blue',
        title: 'แบบรายงานผลการเรียนเฉลี่ยและสรุปเกรดรวมรายห้องเรียน (Grade Summary)',
        code: 'สรุปเกรดห้อง',
        badge: 'เกรดเฉลี่ยห้อง',
        desc: 'พิมพ์ตารางคะแนนรวมและเกรดทุกรายวิชาของนักเรียนทุกคนในห้องเรียนที่เลือก พร้อมคะแนนเฉลี่ยร้อยละ',
        orientation: 'A4 Landscape',
        btnText: 'พิมพ์สรุปเกรดประจำห้อง',
        btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold',
        icon: 'bar-chart-3',
        action: function() {
          const cls = document.getElementById('printCenterClassSelect')?.value || 'ป.6/1';
          printClassroomTotalSummaryReport(cls);
        }
      },
      {
        id: 'doc_remedial_form',
        category: 'grades',
        categoryName: 'งานวัดผล & ผลการเรียน (ปพ.1 - ปพ.6)',
        categoryColor: 'blue',
        title: 'บัญชีรายชื่อและแบบคำร้องขอสอบแก้ตัว 0, ร, มส (PDF ทางการ)',
        code: 'แบบแก้ 0 ร มส',
        badge: 'สอบแก้ตัว',
        desc: 'พิมพ์บัญชีคุมคำร้องขอยื่นแก้ผลการเรียน 0, ร, มส พร้อมระบุภาระงานที่มอบหมาย วันที่ดำเนินการ และผลการตัดสินแก้ตัว',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์บัญชีแก้ 0, ร, มส',
        btnClass: 'bg-amber-600 hover:bg-amber-700 text-white font-bold',
        icon: 'alert-circle',
        action: function() {
          printRemedialSummary();
        }
      },
      {
        id: 'doc_exam_schedule',
        category: 'grades',
        categoryName: 'งานวัดผล & ผลการเรียน (ปพ.1 - ปพ.6)',
        categoryColor: 'blue',
        title: 'ตารางสอบกลางภาค & ตารางสอบปลายภาคเรียน (ตารางสอบนักเรียน)',
        code: 'ตารางสอบ',
        badge: 'ตารางสอบนักเรียน',
        desc: 'พิมพ์ตารางสอบวัดผลการเรียนรู้รายวิชา วัน เวลา ห้องสอบ และข้อปฏิบัติในการเข้าห้องสอบ',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์ตารางสอบนักเรียน',
        btnClass: 'bg-slate-800 hover:bg-slate-900 text-white font-bold',
        icon: 'calendar-clock',
        action: function() {
          printExamSchedule('student');
        }
      },
      {
        id: 'doc_schoolmis_csv',
        category: 'grades',
        categoryName: 'งานวัดผล & ผลการเรียน (ปพ.1 - ปพ.6)',
        categoryColor: 'blue',
        title: 'ส่งออกไฟล์ CSV คะแนน ปพ.5 สำหรับนำเข้าโปรแกรม School MIS ของ สพฐ.',
        code: 'School MIS CSV',
        badge: 'ดาวน์โหลด CSV',
        desc: 'ส่งออกไฟล์ข้อมูลคะแนนเก็บ คะแนนปลายภาค และเกรดตามโครงสร้างมาตรฐาน เพื่อนำเข้าสู่ระบบ School MIS ทันที',
        orientation: 'ไฟล์ .csv',
        btnText: 'ดาวน์โหลดไฟล์ School MIS (.csv)',
        btnClass: 'bg-teal-600 hover:bg-teal-700 text-white font-bold',
        icon: 'file-spreadsheet',
        action: function() {
          exportSchoolMisCsv();
        }
      },

      // 2. Plans & Supervision
      {
        id: 'doc_plans_summary',
        category: 'plans',
        categoryName: 'งานแผนการสอน, นิเทศภายใน & จัดสอนแทน',
        categoryColor: 'emerald',
        title: 'เล่มแผนการจัดการเรียนรู้ฉบับสมบูรณ์ (พร้อมบันทึกหลังสอน & ลายเซ็นดิจิทัล ผอ.)',
        code: 'เล่มแผนการสอน',
        badge: 'แผน + ลายเซ็น',
        desc: 'พิมพ์เอกสารแผนการจัดการเรียนรู้ของครูผู้สอน พร้อมประทับตราลายเซ็นดิจิทัลผู้อำนวยการโรงเรียนดงสวรรค์วิทยาอัตโนมัติ',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์แผนการสอนปัจจุบัน',
        btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold',
        icon: 'file-text',
        action: function() {
          printCurrentFullPlan();
        }
      },
      {
        id: 'doc_supervision_report',
        category: 'plans',
        categoryName: 'งานแผนการสอน, นิเทศภายใน & จัดสอนแทน',
        categoryColor: 'emerald',
        title: 'แบบบันทึกการนิเทศการจัดการเรียนรู้ 5 ด้าน 100 คะแนน (รูบริก สพฐ.)',
        code: 'รายงานนิเทศ',
        badge: 'รูบริก 100 คะแนน',
        desc: 'พิมพ์แบบรายงานผลการนิเทศชั้นเรียนรายบุคคล สรุปจุดเด่น ข้อเสนอแนะ และเกณฑ์การประเมิน 5 ด้านพร้อมลายเซ็นผู้นิเทศ',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์แบบรายงานนิเทศล่าสุด',
        btnClass: 'bg-teal-700 hover:bg-teal-800 text-white font-bold',
        icon: 'check-square',
        action: function() {
          const list = state.supervisions || [];
          if (list.length > 0) printSupervisionReport(list[0].id);
          else showToast('ยังไม่มีรายการนิเทศภายใน กรุณาสร้างรายการก่อน');
        }
      },
      {
        id: 'doc_substitute_order',
        category: 'plans',
        categoryName: 'งานแผนการสอน, นิเทศภายใน & จัดสอนแทน',
        categoryColor: 'emerald',
        title: 'คำสั่งและแบบเสนอขออนุมัติจัดสอนแทน (Smart Substitute Teaching Order)',
        code: 'ใบสอนแทน',
        badge: 'คำสั่งสอนแทน',
        desc: 'พิมพ์หนังสือขออนุมัติจัดสอนแทน บันทึกภาระงานสอนที่แลกเปลี่ยน พร้อมคำสั่งอนุมัติของผู้อำนวยการโรงเรียน',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์คำสั่งจัดสอนแทน',
        btnClass: 'bg-cyan-700 hover:bg-cyan-800 text-white font-bold',
        icon: 'repeat',
        action: function() {
          const list = state.substitutes || [];
          if (list.length > 0) printSubstituteOrder(list[0].id);
          else showToast('ยังไม่มีรายการขอจัดสอนแทน');
        }
      },

      // 3. Timetables & Calendars
      {
        id: 'doc_timetable_landscape',
        category: 'timetables',
        categoryName: 'งานตารางสอน & ปฏิทินปฏิบัติงานวิชาการ',
        categoryColor: 'indigo',
        title: 'ตารางสอนและตารางเรียน A4 แนวนอน (Official Timetable Landscape)',
        code: 'ตารางสอนแนวนอน',
        badge: 'A4 แนวนอน',
        desc: 'พิมพ์ตารางสอนครูรายบุคคล หรือตารางเรียนประจำห้อง สีสันแยกตามวัน จันทร์-ศุกร์ พร้อมชื่อวิชา รหัสวิชา และห้องเรียน',
        orientation: 'A4 Landscape',
        btnText: 'พิมพ์ตารางสอน A4 แนวนอน',
        btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold',
        icon: 'table',
        action: function() {
          printTimetableA4Landscape();
        }
      },
      {
        id: 'doc_academic_calendar',
        category: 'timetables',
        categoryName: 'งานตารางสอน & ปฏิทินปฏิบัติงานวิชาการ',
        categoryColor: 'indigo',
        title: 'ปฏิทินปฏิบัติงานวิชาการประจำปีการศึกษา 2569 (12 เดือน / กำหนดการ สพป.)',
        code: 'ปฏิทินวิชาการ',
        badge: 'ปฏิทิน 2569',
        desc: 'พิมพ์ปฏิทินแผนปฏิบัติงานวิชาการรอบปี กิจกรรมสำคัญ วันสอบ วันเปิด-ปิดภาคเรียน และวันส่งงาน ปพ. ต่างๆ',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์ปฏิทินวิชาการ',
        btnClass: 'bg-purple-700 hover:bg-purple-800 text-white font-bold',
        icon: 'calendar',
        action: function() {
          printAcademicCalendar();
        }
      },

      // 4. Student Affairs & Routines
      {
        id: 'doc_daily_attendance',
        category: 'student_affairs',
        categoryName: 'งานกิจการนักเรียน & ดูแลช่วยเหลือนักเรียน',
        categoryColor: 'amber',
        title: 'แบบบันทึกเวลาเรียนและกิจวัตรประจำวัน 4 มิติ (เสาธง/อาหาร/นม/แปรงฟัน)',
        code: 'เช็คชื่อ 4 มิติ',
        badge: 'กิจวัตรประจำวัน',
        desc: 'พิมพ์แบบรายงานเวลาเข้าแถวหน้าเสาธง เวลาเรียนทุกวิชา การรับประทานอาหารกลางวัน ดื่มนมโรงเรียน และแปรงฟันประจำวัน',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์แบบบันทึกเวลาเรียนประจำวัน',
        btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold',
        icon: 'check-check',
        action: function() {
          const cls = document.getElementById('printCenterClassSelect')?.value || 'ป.6/1';
          const sel = document.getElementById('attendanceClassSelect');
          if (sel) sel.value = cls;
          printDailyAttendanceReport();
        }
      },
      {
        id: 'doc_bmi_report',
        category: 'student_affairs',
        categoryName: 'งานกิจการนักเรียน & ดูแลช่วยเหลือนักเรียน',
        categoryColor: 'amber',
        title: 'แบบรายงานสรุปผลการประเมินการเจริญเติบโตและภาวะโภชนาการ (BMI ประจำห้อง)',
        code: 'รายงาน BMI',
        badge: 'โภชนาการนักเรียน',
        desc: 'พิมพ์เอกสารสรุปน้ำหนัก ส่วนสูง ค่าดัชนีมวลกาย (BMI) ภาวะโภชนาการ และเกณฑ์ส่วนสูงตามอายุ พร้อมสถิติสรุปภาพรวม',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์รายงานโภชนาการ BMI',
        btnClass: 'bg-teal-600 hover:bg-teal-700 text-white font-bold',
        icon: 'scale',
        action: function() {
          const cls = document.getElementById('printCenterClassSelect')?.value || 'ป.6/1';
          const sel = document.getElementById('bmiClassFilter');
          if (sel) sel.value = cls;
          printBmiReport();
        }
      },
      {
        id: 'doc_behavior_report',
        category: 'student_affairs',
        categoryName: 'งานกิจการนักเรียน & ดูแลช่วยเหลือนักเรียน',
        categoryColor: 'amber',
        title: 'แบบรายงานสรุปคะแนนความประพฤติและวินัยนักเรียน (Merit / Demerit Report)',
        code: 'คะแนนความประพฤติ',
        badge: 'คะแนนวินัย',
        desc: 'พิมพ์รายงานคะแนนความประพฤติคงเหลือ (เต็ม 100) สถานะยอดเยี่ยม/เฝ้าระวัง/ตักเตือน แยกตามห้องเรียนและระดับชั้น',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์สรุปคะแนนความประพฤติ',
        btnClass: 'bg-rose-700 hover:bg-rose-800 text-white font-bold',
        icon: 'shield-alert',
        action: function() {
          const cls = document.getElementById('printCenterClassSelect')?.value || 'ป.6/1';
          const sel = document.getElementById('behaviorClassFilter');
          if (sel) sel.value = cls;
          printBehaviorSummaryReport();
        }
      },
      {
        id: 'doc_savings_report',
        category: 'student_affairs',
        categoryName: 'งานกิจการนักเรียน & ดูแลช่วยเหลือนักเรียน',
        categoryColor: 'amber',
        title: 'รายงานสรุปบัญชีเงินฝากออมทรัพย์นักเรียนประจำห้องเรียน (สมุดเงินออม)',
        code: 'สมุดเงินออม',
        badge: 'บัญชีเงินออม',
        desc: 'พิมพ์รายงานยอดเงินออมสะสม ยอดเงินฝากล่าสุด และสรุปยอดเงินรวมของห้องเรียนเพื่อส่งเสริมวินัยทางการเงิน',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์สรุปบัญชีเงินออม',
        btnClass: 'bg-pink-700 hover:bg-pink-800 text-white font-bold',
        icon: 'piggy-bank',
        action: function() {
          const cls = document.getElementById('printCenterClassSelect')?.value || 'ป.6/1';
          const sel = document.getElementById('savingsClassFilter');
          if (sel) sel.value = cls;
          printSavingsReport();
        }
      },
      {
        id: 'doc_homevisit_report',
        category: 'student_affairs',
        categoryName: 'งานกิจการนักเรียน & ดูแลช่วยเหลือนักเรียน',
        categoryColor: 'amber',
        title: 'แบบบันทึกการเยี่ยมบ้านนักเรียนออนไลน์ สพฐ. (พร้อมพิกัด GPS และรูปถ่าย)',
        code: 'แบบเยี่ยมบ้าน',
        badge: 'เยี่ยมบ้าน สพฐ.',
        desc: 'พิมพ์แบบบันทึกการเยี่ยมบ้าน สภาพแวดล้อมครอบครัว รายได้ ความต้องการช่วยเหลือ พร้อมภาพถ่ายและแผนที่',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์แบบบันทึกเยี่ยมบ้านล่าสุด',
        btnClass: 'bg-amber-700 hover:bg-amber-800 text-white font-bold',
        icon: 'home',
        action: function() {
          const list = state.ext?.homeVisits || [];
          if (list.length > 0) printSingleHomeVisitReport(list[0].id);
          else showToast('ยังไม่มีรายการเยี่ยมบ้านในระบบ');
        }
      },

      // 5. DMC & Student Records
      {
        id: 'doc_locker_sheet',
        category: 'dmc_locker',
        categoryName: 'งานทะเบียนนักเรียน, DMC & ล็อกเกอร์',
        categoryColor: 'purple',
        title: 'ป้ายรายชื่อนักเรียนใส่ล็อกเกอร์เหล็กห้องวิชาการ (ขนาดมาตรฐาน 5 ช่องว่าง)',
        code: 'ป้ายล็อกเกอร์ 5 ช่อง',
        badge: 'ล็อกเกอร์วิชาการ',
        desc: 'พิมพ์ใบรายชื่อนักเรียนใส่ช่องล็อกเกอร์เหล็กประจำห้องวิชาการ ตาราง 5 ช่องว่างสำหรับตรวจเช็คการส่งงาน/เอกสาร',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์ป้ายล็อกเกอร์ห้องนี้',
        btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold',
        icon: 'layout-grid',
        action: function() {
          const cls = document.getElementById('printCenterClassSelect')?.value || 'ป.6/1';
          const sel = document.getElementById('dmcFilterClass');
          if (sel) sel.value = cls;
          printLockerRoomStudentSheet(false);
        }
      },
      {
        id: 'doc_locker_all_rooms',
        category: 'dmc_locker',
        categoryName: 'งานทะเบียนนักเรียน, DMC & ล็อกเกอร์',
        categoryColor: 'purple',
        title: 'ป้ายล็อกเกอร์เหล็กครบทั้ง 15 ห้องเรียนรวดเดียว (Batch Locker Print)',
        code: 'ล็อกเกอร์ 15 ห้อง',
        badge: 'พิมพ์ยกโรงเรียน',
        desc: 'สั่งพิมพ์ป้ายล็อกเกอร์เหล็กของนักเรียนทุกชั้นเรียน (อ.2 - ม.3 รวม 15 ห้อง 346 คน) ต่อเนื่องในชุดเดียว',
        orientation: 'A4 Portrait (15 แผ่น)',
        btnText: 'พิมพ์ครบทั้ง 15 ห้องรวดเดียว',
        btnClass: 'bg-teal-800 hover:bg-teal-900 text-white font-bold',
        icon: 'printer',
        action: function() {
          printLockerRoomStudentSheet(true);
        }
      },
      {
        id: 'doc_desk_tags',
        category: 'dmc_locker',
        categoryName: 'งานทะเบียนนักเรียน, DMC & ล็อกเกอร์',
        categoryColor: 'purple',
        title: 'ป้ายชื่อนักเรียนติดโต๊ะสอบ / โต๊ะเรียนประจำห้อง (Desk Tags Sheet)',
        code: 'ป้ายติดโต๊ะสอบ',
        badge: 'ป้ายชื่อติดโต๊ะ',
        desc: 'พิมพ์ป้ายชื่อ เลขประจำตัว และเลขที่นักเรียน สำหรับตัดแปะติดโต๊ะเรียนหรือโต๊ะสอบกลางภาค-ปลายภาค',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์ป้ายชื่อติดโต๊ะสอบ',
        btnClass: 'bg-indigo-700 hover:bg-indigo-800 text-white font-bold',
        icon: 'tag',
        action: function() {
          printLockerNameTags();
        }
      },
      {
        id: 'doc_dmc_directory',
        category: 'dmc_locker',
        categoryName: 'งานทะเบียนนักเรียน, DMC & ล็อกเกอร์',
        categoryColor: 'purple',
        title: 'ทะเบียนข้อมูลนักเรียนรายบุคคล DMC โรงเรียนดงสวรรค์วิทยา (DMC Database)',
        code: 'ทะเบียน DMC',
        badge: 'ทะเบียนนักเรียน',
        desc: 'พิมพ์สมุดทะเบียนประวัตินักเรียน เลข 13 หลัก ชื่อบิดามารดา ที่อยู่ และสถานะทางการศึกษา',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์สมุดทะเบียน DMC',
        btnClass: 'bg-slate-800 hover:bg-slate-900 text-white font-bold',
        icon: 'database',
        action: function() {
          printDmcStudentDatabaseReport();
        }
      },
      {
        id: 'doc_transfers_report',
        category: 'dmc_locker',
        categoryName: 'งานทะเบียนนักเรียน, DMC & ล็อกเกอร์',
        categoryColor: 'purple',
        title: 'ทะเบียนคุมนักเรียนย้ายเข้า - ย้ายออก (สพฐ. & หนังสือส่งตัว)',
        code: 'ทะเบียนรับย้าย',
        badge: 'ย้ายเข้า-ออก',
        desc: 'พิมพ์รายงานสรุปยอดนักเรียนย้ายเข้า ย้ายออก พร้อมเลขที่หนังสือส่งตัว โรงเรียนต้นทาง/ปลายทาง',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์ทะเบียนนักเรียนย้าย',
        btnClass: 'bg-emerald-700 hover:bg-emerald-800 text-white font-bold',
        icon: 'arrow-left-right',
        action: function() {
          printTransfersReport();
        }
      },

      // 6. Activities, CAR & Download Templates
      {
        id: 'doc_clubs_report',
        category: 'activities_templates',
        categoryName: 'กิจกรรมพัฒนาผู้เรียน, วิจัย CAR & แม่แบบดาวน์โหลด',
        categoryColor: 'rose',
        title: 'แบบรายงานเวลาเรียนและประเมินผลกิจกรรมชุมนุม (Club Attendance)',
        code: 'รายงานชุมนุม',
        badge: 'กิจกรรมชุมนุม',
        desc: 'พิมพ์แบบบันทึกเวลาเรียน ผลการประเมิน ผ่าน/ไม่ผ่าน ของนักเรียนในกิจกรรมชุมนุมทุกกลุ่มสาระ',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์รายงานกิจกรรมชุมนุม',
        btnClass: 'bg-sky-700 hover:bg-sky-800 text-white font-bold',
        icon: 'users',
        action: function() {
          printClubsReport();
        }
      },
      {
        id: 'doc_scouts_report',
        category: 'activities_templates',
        categoryName: 'กิจกรรมพัฒนาผู้เรียน, วิจัย CAR & แม่แบบดาวน์โหลด',
        categoryColor: 'rose',
        title: 'ทะเบียนกองลูกเสือ - เนตรนารีและผลการประเมินวิชาพิเศษ (Scout Registry)',
        code: 'ทะเบียนลูกเสือ',
        badge: 'ลูกเสือ-เนตรนารี',
        desc: 'พิมพ์ทะเบียนกองลูกเสือสำรอง สามัญ และสามัญรุ่นใหญ่ พร้อมผลการประเมินกิจกรรมและวิชาพิเศษ',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์ทะเบียนลูกเสือ',
        btnClass: 'bg-amber-700 hover:bg-amber-800 text-white font-bold',
        icon: 'flag',
        action: function() {
          printScoutsReport();
        }
      },
      {
        id: 'doc_iep_report',
        category: 'activities_templates',
        categoryName: 'กิจกรรมพัฒนาผู้เรียน, วิจัย CAR & แม่แบบดาวน์โหลด',
        categoryColor: 'rose',
        title: 'แผนการจัดการศึกษาเฉพาะบุคคล (IEP) นักเรียนบกพร่อง 9 ประเภท',
        code: 'แผน IEP',
        badge: 'เรียนรวม IEP',
        desc: 'พิมพ์สรุปแผนการจัดการศึกษาเฉพาะบุคคล (IEP) เป้าหมายระยะสั้น-ระยะยาว และการประเมินความก้าวหน้า',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์สรุปแผน IEP',
        btnClass: 'bg-violet-700 hover:bg-violet-800 text-white font-bold',
        icon: 'sparkles',
        action: function() {
          printIepSummaryReport();
        }
      },
      {
        id: 'doc_car_report',
        category: 'activities_templates',
        categoryName: 'กิจกรรมพัฒนาผู้เรียน, วิจัย CAR & แม่แบบดาวน์โหลด',
        categoryColor: 'rose',
        title: 'แบบสรุปงานวิจัยในชั้นเรียนหน้าเดียว (One-Page CAR Summary Report)',
        code: 'วิจัยหน้าเดียว',
        badge: 'วิจัย CAR',
        desc: 'พิมพ์แบบสรุปผลการวิจัยในชั้นเรียนหน้าเดียว วัตถุประสงค์ นวัตกรรม ผลลัพธ์ และลิงก์เอกสารฉบับเต็ม',
        orientation: 'A4 Portrait',
        btnText: 'พิมพ์สรุปงานวิจัย CAR',
        btnClass: 'bg-blue-800 hover:bg-blue-900 text-white font-bold',
        icon: 'flask-conical',
        action: function() {
          const list = state.ext?.researchItems || [];
          if (list.length > 0) printSingleResearchReport(list[0].id);
          else showToast('ยังไม่มีงานวิจัย CAR ในระบบ กรุณาส่งงานวิจัยก่อน');
        }
      },
      {
        id: 'doc_excel_template',
        category: 'activities_templates',
        categoryName: 'กิจกรรมพัฒนาผู้เรียน, วิจัย CAR & แม่แบบดาวน์โหลด',
        categoryColor: 'rose',
        title: 'แม่แบบไฟล์ Excel สำหรับนำเข้ารายชื่อนักเรียน (.xlsx / .csv Template)',
        code: 'แม่แบบ Excel',
        badge: 'ดาวน์โหลดไฟล์',
        desc: 'ดาวน์โหลดไฟล์แม่แบบ Excel พร้อมหัวคอลัมน์มาตรฐานสำหรับกรอกรายชื่อนักเรียนและนำเข้าสู่ระบบ School MIS',
        orientation: 'ไฟล์ .xlsx',
        btnText: 'ดาวน์โหลดแม่แบบ Excel (.xlsx)',
        btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold',
        icon: 'download',
        action: function() {
          downloadStudentExcelTemplate();
        }
      }
    ];

    function syncPrintCenterClass(val) {
      // Sync selected classroom across app selectors so prints use this class automatically
      ['p6BatchClassSelect', 'attendanceClassSelect', 'bmiClassFilter', 'savingsClassFilter', 'behaviorClassFilter', 'dmcFilterClass', 'gradeFilterClass', 'pp5FilterClass'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.value = val;
          // Trigger change event if appropriate
          if (id === 'p6BatchClassSelect' && typeof onP6BatchClassChange === 'function') onP6BatchClassChange();
        }
      });
      showToast(\`เลือกระดับชั้น \${val} สำหรับการสั่งพิมพ์เอกสารเรียบร้อย\`);
    }

    function renderPrintCenter() {
      if (!state.ext) initExtendedState();
      renderPrintCenterCards();
    }

    function renderPrintCenterCards() {
      const container = document.getElementById('printCenterCardsContainer');
      if (!container) return;

      const categoryFilter = document.getElementById('printCenterCategorySelect')?.value || 'all';
      const searchQ = (document.getElementById('printCenterSearchInput')?.value || '').trim().toLowerCase();

      let filteredDocs = PRINT_CENTER_DOCS;
      if (categoryFilter !== 'all') {
        filteredDocs = filteredDocs.filter(d => d.category === categoryFilter);
      }
      if (searchQ) {
        filteredDocs = filteredDocs.filter(d =>
          d.title.toLowerCase().includes(searchQ) ||
          d.code.toLowerCase().includes(searchQ) ||
          d.desc.toLowerCase().includes(searchQ) ||
          d.categoryName.toLowerCase().includes(searchQ)
        );
      }

      // Update count badge
      const countBadge = document.getElementById('printCenterCountBadge');
      if (countBadge) {
        countBadge.textContent = \`⚡ พร้อมสั่งพิมพ์ \${filteredDocs.length} รายการ\`;
      }

      if (filteredDocs.length === 0) {
        container.innerHTML = \`
          <div class="card-3d p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 opacity-40"></i>
            <h4 class="text-base font-bold text-slate-700">ไม่พบเอกสารที่ค้นหา</h4>
            <p class="text-xs text-slate-400 mt-1">กรุณาลองพิมพ์คำค้นอื่น หรือเปลี่ยนหมวดหมู่เอกสาร</p>
          </div>
        \`;
        if (window.lucide) lucide.createIcons();
        return;
      }

      // Group by category
      const categories = [
        { key: 'grades', name: '🏆 งานวัดผล & ผลการเรียน (ปพ.1 - ปพ.6)', border: 'border-blue-200', bg: 'bg-blue-50/50', badge: 'bg-blue-100 text-blue-800' },
        { key: 'plans', name: '📚 งานแผนการสอน, นิเทศภายใน & จัดสอนแทน', border: 'border-emerald-200', bg: 'bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-800' },
        { key: 'timetables', name: '🗓️ งานตารางสอน & ปฏิทินปฏิบัติงานวิชาการ', border: 'border-indigo-200', bg: 'bg-indigo-50/50', badge: 'bg-indigo-100 text-indigo-800' },
        { key: 'student_affairs', name: '💚 งานกิจการนักเรียน & ดูแลช่วยเหลือนักเรียน', border: 'border-amber-200', bg: 'bg-amber-50/50', badge: 'bg-amber-100 text-amber-800' },
        { key: 'dmc_locker', name: '🗃️ งานทะเบียนนักเรียน, DMC & ล็อกเกอร์', border: 'border-purple-200', bg: 'bg-purple-50/50', badge: 'bg-purple-100 text-purple-800' },
        { key: 'activities_templates', name: '🎯 กิจกรรมพัฒนาผู้เรียน, วิจัย CAR & แม่แบบดาวน์โหลด', border: 'border-rose-200', bg: 'bg-rose-50/50', badge: 'bg-rose-100 text-rose-800' }
      ];

      let html = '';
      categories.forEach(cat => {
        const catDocs = filteredDocs.filter(d => d.category === cat.key);
        if (catDocs.length === 0) return;

        html += \`
          <div class="space-y-3">
            <div class="flex items-center justify-between pb-1.5 border-b-2 \${cat.border}">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-black text-slate-900 tracking-tight">\${cat.name}</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${cat.badge}">\${catDocs.length} ฉบับ</span>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              \${catDocs.map(doc => \`
                <div class="card-3d p-4 rounded-2xl border border-slate-200 bg-white hover:border-rose-300 hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase \${cat.badge}">
                        \${doc.code}
                      </span>
                      <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <i data-lucide="file" class="w-3 h-3"></i> \${doc.orientation}
                      </span>
                    </div>
                    <h4 class="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1.5 line-clamp-2">
                      \${doc.title}
                    </h4>
                    <p class="text-[11px] text-slate-500 leading-relaxed mb-4 line-clamp-3">
                      \${doc.desc}
                    </p>
                  </div>
                  <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button type="button" onclick="triggerPrintCenterDoc('\${doc.id}')" class="\${doc.btnClass} w-full text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs">
                      <i data-lucide="\${doc.icon || 'printer'}" class="w-3.5 h-3.5"></i>
                      <span>\${doc.btnText}</span>
                    </button>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      });

      container.innerHTML = html;
      if (window.lucide) lucide.createIcons();
    }

    function triggerPrintCenterDoc(docId) {
      const doc = PRINT_CENTER_DOCS.find(d => d.id === docId);
      if (doc && typeof doc.action === 'function') {
        doc.action();
      }
    }

    function triggerPrintCenterQuick(type) {
      if (type === 'p6_batch') {
        const cls = document.getElementById('printCenterClassSelect')?.value || 'ป.6/1';
        const p6Sel = document.getElementById('p6BatchClassSelect');
        if (p6Sel) p6Sel.value = cls;
        if (typeof onP6BatchClassChange === 'function') onP6BatchClassChange();
        printClassroomP6Batch();
      } else if (type === 'pp5_full') {
        printPp5Report('all');
      } else if (type === 'timetable') {
        printTimetableA4Landscape();
      }
    }
`;

const lastScriptIdx = html.lastIndexOf('</script>');
if (lastScriptIdx === -1) {
  console.error('ERROR: </script> not found!');
  process.exit(1);
}
html = html.slice(0, lastScriptIdx) + printCenterJs + '\n  ' + html.slice(lastScriptIdx);
console.log('Print Center JS logic inserted.');

fs.writeFileSync('index.html', html, 'utf8');
console.log('SUCCESS: index.html updated with Menu 24!');
