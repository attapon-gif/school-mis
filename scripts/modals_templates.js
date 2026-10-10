// scripts/modals_templates.js
// Generates modal dialogs for the 16 new modules

function getModalsHtml() {
  return `
  <!-- MODAL: ADD / EDIT PP5 SCORE -->
  <div id="modalAddPp5Score" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="file-spreadsheet" class="w-5 h-5 text-emerald-600"></i> บันทึกผลการเรียน ปพ.5 รายบุคคล
        </h3>
        <button type="button" onclick="closeModal('modalAddPp5Score')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formPp5Score" onsubmit="handleSavePp5Score(event)" class="space-y-3 text-xs">
        <input type="hidden" id="pp5EditStudentId">
        <div>
          <label class="block font-bold text-slate-700 mb-1">นักเรียน *</label>
          <select id="pp5StudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white"></select>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">คะแนนเก็บ (เต็ม 50)</label>
            <input type="number" id="pp5ScoreCollected" min="0" max="50" step="0.5" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">กลางภาค (เต็ม 20)</label>
            <input type="number" id="pp5ScoreMidterm" min="0" max="20" step="0.5" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ปลายภาค (เต็ม 30)</label>
            <input type="number" id="pp5ScoreFinal" min="0" max="30" step="0.5" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">คุณลักษณะอันพึงประสงค์ (0-3)</label>
            <select id="pp5ScoreTraits" class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
              <option value="3">3 - ดีเยี่ยม</option>
              <option value="2">2 - ดี</option>
              <option value="1">1 - ผ่าน</option>
              <option value="0">0 - ไม่ผ่าน</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">อ่าน คิดวิเคราะห์ เขียน (0-3)</label>
            <select id="pp5ScoreReading" class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
              <option value="3">3 - ดีเยี่ยม</option>
              <option value="2">2 - ดี</option>
              <option value="1">1 - ผ่าน</option>
              <option value="0">0 - ไม่ผ่าน</option>
            </select>
          </div>
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">บันทึกคะแนน ปพ.5</button>
          <button type="button" onclick="closeModal('modalAddPp5Score')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: REMEDIAL REQUEST -->
  <div id="modalRemedialRequest" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="file-cog" class="w-5 h-5 text-rose-600"></i> ยื่นคำร้องขอแก้ผลการเรียน (0, ร, มส)
        </h3>
        <button type="button" onclick="closeModal('modalRemedialRequest')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formRemedialRequest" onsubmit="handleSaveRemedialRequest(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">นักเรียนที่ติด 0, ร, มส *</label>
          <select id="remStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white"></select>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">รายวิชา</label>
            <input type="text" id="remSubject" required placeholder="เช่น ท21101 ภาษาไทย 1" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">เกรดเดิม</label>
            <select id="remGradeOriginal" class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
              <option value="0">0 (ผลการเรียนต่ำกว่าเกณฑ์)</option>
              <option value="ร">ร (รอการตัดสินผล)</option>
              <option value="มส">มส (เวลาเรียนไม่ถึง 80%)</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ครูประจำวิชาผู้รับผิดชอบ</label>
          <input type="text" id="remTeacher" required placeholder="เช่น ครูสมใจ สดใส" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ภาระงานที่ครูมอบหมาย</label>
          <textarea id="remAssignedTask" rows="2" placeholder="ระบุแบบฝึกหัด ชิ้นงาน หรือการสอบแก้ตัว..." class="w-full px-3 py-2 border rounded-xl font-bold"></textarea>
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">ยื่นคำร้องแก้เกรด</button>
          <button type="button" onclick="closeModal('modalRemedialRequest')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ADD EXAM PERIOD -->
  <div id="modalAddExamPeriod" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="calendar-range" class="w-5 h-5 text-cyan-600"></i> เพิ่มคาบสอบในตารางสอบ
        </h3>
        <button type="button" onclick="closeModal('modalAddExamPeriod')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formAddExamPeriod" onsubmit="handleSaveExamPeriod(event)" class="space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">วันที่สอบ *</label>
            <input type="date" id="examDate" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">คาบ / ช่วงเวลา *</label>
            <select id="examPeriod" class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
              <option value="คาบ 1 (08:30 - 09:30)">คาบ 1 (08:30 - 09:30)</option>
              <option value="คาบ 2 (09:40 - 10:40)">คาบ 2 (09:40 - 10:40)</option>
              <option value="คาบ 3 (10:50 - 11:50)">คาบ 3 (10:50 - 11:50)</option>
              <option value="คาบ 4 (13:00 - 14:00)">คาบ 4 (13:00 - 14:00)</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">ระดับชั้น *</label>
            <select id="examClassroom" class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
              <option value="ม.1/1">มัธยมศึกษาปีที่ 1/1</option>
              <option value="ม.1/2">มัธยมศึกษาปีที่ 1/2</option>
              <option value="ม.2/1">มัธยมศึกษาปีที่ 2/1</option>
              <option value="ป.6/1">ประถมศึกษาปีที่ 6/1</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ห้องสอบ *</label>
            <input type="text" id="examRoom" required placeholder="เช่น ห้อง 111" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">รหัสวิชา</label>
            <input type="text" id="examSubjectCode" required placeholder="เช่น ท21101" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ชื่อวิชา</label>
            <input type="text" id="examSubjectName" required placeholder="เช่น ภาษาไทย 1" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">ครูคุมสอบหลัก *</label>
            <input type="text" id="examProctor1" required placeholder="ชื่อครูคุมสอบ 1" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ครูคุมสอบร่วม</label>
            <input type="text" id="examProctor2" placeholder="ชื่อครูคุมสอบ 2" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">บันทึกคาบสอบ (ตรวจไม่ชน)</button>
          <button type="button" onclick="closeModal('modalAddExamPeriod')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: SUBMIT RESEARCH (CAR) -->
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
  </div>

  <!-- MODAL: ADD ACADEMIC DOWNLOAD RESOURCE -->
  <div id="modalAddDownload" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="upload-cloud" class="w-5 h-5 text-blue-600"></i> เพิ่มไฟล์สื่องานวิชาการ & แบบฟอร์ม
        </h3>
        <button type="button" onclick="closeModal('modalAddDownload')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formAddDownload" onsubmit="handleSaveDownload(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">ชื่อเอกสาร / สื่อวิชาการ *</label>
          <input type="text" id="dlTitle" required placeholder="เช่น แบบฟอร์ม ปพ.5 ฉบับมาตรฐาน" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">หมวดหมู่</label>
            <select id="dlCategory" class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
              <option value="แบบฟอร์ม ปพ.">แบบฟอร์ม ปพ.</option>
              <option value="คู่มือหลักสูตร">คู่มือหลักสูตร</option>
              <option value="วิจัยและนวัตกรรม">วิจัยและนวัตกรรม</option>
              <option value="ระเบียบวิชาการ">ระเบียบวิชาการ</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ประเภทไฟล์</label>
            <select id="dlFileType" class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
              <option value="PDF">PDF</option>
              <option value="DOCX">Word (DOCX)</option>
              <option value="XLSX">Excel (XLSX)</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ลิงก์ดาวน์โหลด (Google Drive / URL)</label>
          <input type="url" id="dlUrl" placeholder="https://..." class="w-full px-3 py-2 border rounded-xl font-bold font-mono">
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">บันทึกสื่อวิชาการ</button>
          <button type="button" onclick="closeModal('modalAddDownload')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ADD ACADEMIC CALENDAR EVENT -->
  <div id="modalAddCalendarEvent" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="calendar-plus" class="w-5 h-5 text-yellow-600"></i> เพิ่มกิจกรรมปฏิทินวิชาการ
        </h3>
        <button type="button" onclick="closeModal('modalAddCalendarEvent')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formAddCalendarEvent" onsubmit="handleSaveCalendarEvent(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">ชื่อกิจกรรมวิชาการ *</label>
          <input type="text" id="calTitle" required placeholder="เช่น การนิเทศการสอนรอบที่ 1" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">วันที่จัดกิจกรรม *</label>
            <input type="date" id="calDate" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">เวลา</label>
            <input type="text" id="calTime" placeholder="เช่น 08:30 - 15:30" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">สถานที่จัดกิจกรรม</label>
          <input type="text" id="calLocation" placeholder="เช่น ห้องประชุมเพชรพิทยา" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">ผู้รับผิดชอบ</label>
            <input type="text" id="calOwner" placeholder="เช่น ครูสมใจ สดใส" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ระดับความสำคัญ</label>
            <select id="calPriority" class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
              <option value="normal">ปกติ (ทั่วไป)</option>
              <option value="medium">ปานกลาง</option>
              <option value="high">สำคัญมาก</option>
              <option value="urgent">ด่วนที่สุด</option>
            </select>
          </div>
        </div>
        <div class="flex items-center gap-2 pt-1">
          <input type="checkbox" id="calNotifyLine" checked class="w-4 h-4 rounded text-emerald-600">
          <label for="calNotifyLine" class="font-bold text-slate-700">ส่งแจ้งเตือนเข้า LINE กลุ่มเมื่อถึงกำหนดเวลา</label>
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">บันทึกกิจกรรม</button>
          <button type="button" onclick="closeModal('modalAddCalendarEvent')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: LINE CONFIG -->
  <div id="modalLineConfig" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="settings-2" class="w-5 h-5 text-emerald-600"></i> ตั้งค่าการแจ้งเตือนผ่าน LINE
        </h3>
        <button type="button" onclick="closeModal('modalLineConfig')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formLineConfig" onsubmit="handleSaveLineConfig(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">ชื่อกลุ่มเป้าหมาย (Channel Name)</label>
          <input type="text" id="lineChannelName" value="กลุ่มวิชาการโรงเรียนฝันใหม่ (สพฐ.)" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">LINE Notify Token / Webhook Token</label>
          <input type="password" id="lineToken" value="LINE_NOTIFY_DEMO_TOKEN_FM_STUDIO" class="w-full px-3 py-2 border rounded-xl font-mono">
          <p class="text-[11px] text-slate-400 mt-1">สามารถสร้าง Token ได้จาก <a href="https://notify-bot.line.me" target="_blank" class="text-blue-600 underline">notify-bot.line.me</a></p>
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl">บันทึกการตั้งค่า</button>
          <button type="button" onclick="testSendLineNotifyQuick()" class="px-3 py-2.5 border rounded-xl text-emerald-700 font-bold border-emerald-300 bg-emerald-50">ทดสอบส่ง</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: NEW HOME VISIT -->
  <div id="modalNewHomeVisit" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="home" class="w-5 h-5 text-amber-600"></i> บันทึกการเยี่ยมบ้านนักเรียน (แบบฟอร์ม สพฐ.)
        </h3>
        <button type="button" onclick="closeModal('modalNewHomeVisit')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formHomeVisit" onsubmit="handleSaveHomeVisit(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">นักเรียนที่ได้รับการเยี่ยมบ้าน *</label>
          <select id="hvStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white"></select>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">วันที่เยี่ยมบ้าน *</label>
            <input type="date" id="hvDate" value="2026-10-10" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ชื่อผู้ปกครองที่ให้ข้อมูล</label>
            <input type="text" id="hvParentName" placeholder="เช่น นายประเสริฐ บุญรอด" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">สถานภาพครอบครัว</label>
            <select id="hvFamilyStatus" class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
              <option value="บิดามารดาอยู่ร่วมกัน">บิดามารดาอยู่ร่วมกัน</option>
              <option value="บิดามารดาแยกกันอยู่">บิดามารดาแยกกันอยู่</option>
              <option value="บิดาหรือมารดาเสียชีวิต">บิดาหรือมารดาเสียชีวิต</option>
              <option value="อยู่กับญาติ / ผู้อุปการะ">อยู่กับญาติ / ผู้อุปการะ</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ลักษณะที่อยู่อาศัย</label>
            <select id="hvHousingType" class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
              <option value="บ้านตนเอง มั่นคงแข็งแรง">บ้านตนเอง มั่นคงแข็งแรง</option>
              <option value="บ้านเช่า / หอพัก">บ้านเช่า / หอพัก</option>
              <option value="บ้านพักคนงาน">บ้านพักคนงาน</option>
              <option value="สภาพทรุดโทรม / ไม่ปลอดภัย">สภาพทรุดโทรม / ไม่ปลอดภัย</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ปัญหาที่พบ / สภาพแวดล้อม</label>
          <textarea id="hvProblem" rows="2" placeholder="ระบุด้านการเรียน ด้านเศรษฐกิจ หรือสุขภาพ..." class="w-full px-3 py-2 border rounded-xl"></textarea>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ความช่วยเหลือที่ต้องการจากโรงเรียน (ทุนการศึกษา / อื่นๆ)</label>
          <input type="text" id="hvAssistance" placeholder="เช่น ขอรับทุนปัจจัยพื้นฐานนักเรียนยากจน" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div class="font-bold text-slate-800">การยืนยันและลายเซ็นดิจิทัล</div>
          <div class="flex items-center gap-3">
            <label class="flex items-center gap-1.5"><input type="checkbox" id="hvTeacherSign" checked class="w-4 h-4 rounded text-blue-600"> ครูลงนามรับรอง</label>
            <label class="flex items-center gap-1.5"><input type="checkbox" id="hvParentSign" checked class="w-4 h-4 rounded text-emerald-600"> ผู้ปกครองลงนามรับรอง</label>
          </div>
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">บันทึกรายงานเยี่ยมบ้าน</button>
          <button type="button" onclick="closeModal('modalNewHomeVisit')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: BEHAVIOR RECORD (MERIT / DEMERIT) -->
  <div id="modalAddBehaviorRecord" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 id="modalBehaviorTitle" class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="shield-alert" class="w-5 h-5 text-purple-600"></i> บันทึกคะแนนความประพฤติ
        </h3>
        <button type="button" onclick="closeModal('modalAddBehaviorRecord')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formBehaviorRecord" onsubmit="handleSaveBehaviorRecord(event)" class="space-y-3 text-xs">
        <input type="hidden" id="behType" value="demerit">
        <div>
          <label class="block font-bold text-slate-700 mb-1">นักเรียน *</label>
          <select id="behStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white"></select>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">วันที่บันทึก *</label>
            <input type="date" id="behDate" value="2026-10-10" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1" id="behScoreLabel">คะแนนที่ตัด (แต้ม) *</label>
            <input type="number" id="behScore" min="1" max="50" value="5" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ฐานความผิด / พฤติกรรมความดี *</label>
          <input type="text" id="behCategory" required placeholder="เช่น มาสาย, ทะเลาะวิวาท, ช่วยเหลืองานโรงเรียน" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">หมายเหตุเพิ่มเติม</label>
          <textarea id="behRemark" rows="2" placeholder="รายละเอียดพฤติกรรมและการตักเตือน..." class="w-full px-3 py-2 border rounded-xl"></textarea>
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" id="btnSaveBehavior" class="flex-1 btn-ega-primary py-2.5 font-bold">บันทึกพฤติกรรม</button>
          <button type="button" onclick="closeModal('modalAddBehaviorRecord')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ADD SAVINGS ENTRY -->
  <div id="modalAddSavingsEntry" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="circle-dollar-sign" class="w-5 h-5 text-pink-600"></i> บันทึกการออมเงิน (ฝาก - ถอน)
        </h3>
        <button type="button" onclick="closeModal('modalAddSavingsEntry')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formSavingsEntry" onsubmit="handleSaveSavingsEntry(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">นักเรียน *</label>
          <select id="savStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white"></select>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">ประเภทรายการ</label>
            <select id="savType" class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
              <option value="deposit">🟢 ฝากเงิน (Deposit)</option>
              <option value="withdraw">🔴 ถอนเงิน (Withdraw)</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">จำนวนเงิน (บาท) *</label>
            <input type="number" id="savAmount" min="1" step="1" value="20" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">วันที่ทำรายการ</label>
          <input type="date" id="savDate" value="2026-10-10" required class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">บันทึกยอดเงิน</button>
          <button type="button" onclick="closeModal('modalAddSavingsEntry')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: CREATE CLUB -->
  <div id="modalCreateClub" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="plus-circle" class="w-5 h-5 text-sky-600"></i> จัดตั้งชุมนุมใหม่
        </h3>
        <button type="button" onclick="closeModal('modalCreateClub')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formCreateClub" onsubmit="handleSaveClub(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">ชื่อชุมนุม *</label>
          <input type="text" id="clubName" required placeholder="เช่น ชุมนุมวิทยาศาสตร์แสนสนุก" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">ครูที่ปรึกษาชุมนุม</label>
            <input type="text" id="clubAdvisor" required placeholder="ชื่อคุณครู" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">จำนวนรับสูงสุด (คน)</label>
            <input type="number" id="clubMax" min="5" max="100" value="30" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">สถานที่จัดกิจกรรม</label>
            <input type="text" id="clubRoom" placeholder="เช่น ห้อง 211" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">ระดับชั้นที่รับ</label>
            <input type="text" id="clubGrades" value="ม.1 - ม.3" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">คำอธิบายกิจกรรมชุมนุม</label>
          <textarea id="clubDesc" rows="2" placeholder="รายละเอียดการจัดกิจกรรม..." class="w-full px-3 py-2 border rounded-xl"></textarea>
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">เปิดรับสมัครชุมนุม</button>
          <button type="button" onclick="closeModal('modalCreateClub')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ADD SCOUT ACTIVITY -->
  <div id="modalAddScoutActivity" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="flag" class="w-5 h-5 text-amber-600"></i> บันทึกกิจกรรมลูกเสือ - เนตรนารี
        </h3>
        <button type="button" onclick="closeModal('modalAddScoutActivity')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formScoutActivity" onsubmit="handleSaveScoutActivity(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">กอง / หน่วยลูกเสือ</label>
          <select id="scoutTroopSelect" class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
            <option value="SCT001">กองลูกเสือสามัญรุ่นใหญ่ กองที่ 1 (ม.1)</option>
            <option value="SCT002">กองเนตรนารีสามัญรุ่นใหญ่ กองที่ 1 (ม.1)</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">วันที่ทำกิจกรรม *</label>
            <input type="date" id="scoutDate" value="2026-10-10" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">จำนวนที่มา (คน)</label>
            <input type="number" id="scoutPresent" value="44" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">หัวข้อกิจกรรม / วิชาพิเศษ *</label>
          <input type="text" id="scoutTopic" required placeholder="เช่น การปฐมพยาบาลเบื้องต้น, เงื่อนเชือก" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">บันทึกกิจกรรมลูกเสือ</button>
          <button type="button" onclick="closeModal('modalAddScoutActivity')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: IMPORT DMC EXCEL -->
  <div id="modalImportDmcExcel" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="file-up" class="w-5 h-5 text-blue-600"></i> นำเข้าไฟล์ Excel DMC (สพฐ.)
        </h3>
        <button type="button" onclick="closeModal('modalImportDmcExcel')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <div class="space-y-3 text-xs">
        <div class="p-4 border-2 border-dashed border-blue-300 rounded-2xl bg-blue-50/50 text-center space-y-2">
          <i data-lucide="file-spreadsheet" class="w-10 h-10 text-blue-600 mx-auto"></i>
          <div class="font-bold text-slate-800">เลือกไฟล์ Excel ที่ดาวน์โหลดจากระบบ DMC</div>
          <p class="text-[11px] text-slate-500">รองรับไฟล์ .xlsx หรือ .xls จาก Data Management Center</p>
          <input type="file" id="dmcFileInput" accept=".xlsx, .xls" class="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer">
        </div>
        <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 space-y-1">
          <div class="font-bold">คอลัมน์ที่ระบบรองรับอัตโนมัติ:</div>
          <div>รหัสประจำตัว, เลขบัตรประชาชน, คำนำหน้า, ชื่อ, นามสกุล, ชั้น, เลขที่, วันเกิด</div>
        </div>
        <div class="pt-2 flex gap-2">
          <button type="button" onclick="processDmcExcelImport()" class="flex-1 btn-ega-primary py-2.5 font-bold">นำเข้าฐานข้อมูลวิชาการ</button>
          <button type="button" onclick="closeModal('modalImportDmcExcel')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: ADD IEP STUDENT -->
  <div id="modalAddIepStudent" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="sparkles" class="w-5 h-5 text-violet-600"></i> เพิ่มนักเรียนเรียนรวม & แผน IEP
        </h3>
        <button type="button" onclick="closeModal('modalAddIepStudent')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formAddIepStudent" onsubmit="handleSaveIepStudent(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">นักเรียน *</label>
          <select id="iepStudentSelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white"></select>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ประเภทความบกพร่อง (9 ประเภท สพฐ.) *</label>
          <select id="iepDisabilitySelect" required class="w-full px-3 py-2 border rounded-xl font-bold bg-white">
            <option value="1. บุคคลที่มีความบกพร่องทางการเห็น">1. บุคคลที่มีความบกพร่องทางการเห็น</option>
            <option value="2. บุคคลที่มีความบกพร่องทางการได้ยิน">2. บุคคลที่มีความบกพร่องทางการได้ยิน</option>
            <option value="3. บุคคลที่มีความบกพร่องทางสติปัญญา">3. บุคคลที่มีความบกพร่องทางสติปัญญา</option>
            <option value="4. บุคคลที่มีความบกพร่องทางร่างกาย หรือการเคลื่อนไหว หรือสุขภาพ">4. บุคคลที่มีความบกพร่องทางร่างกาย หรือการเคลื่อนไหว หรือสุขภาพ</option>
            <option value="5. บุคคลที่มีความบกพร่องทางการเรียนรู้ (LD)" selected>5. บุคคลที่มีความบกพร่องทางการเรียนรู้ (LD)</option>
            <option value="6. บุคคลที่มีความบกพร่องทางการพูดและภาษา">6. บุคคลที่มีความบกพร่องทางการพูดและภาษา</option>
            <option value="7. บุคคลที่มีความบกพร่องทางพฤติกรรม หรืออารมณ์">7. บุคคลที่มีความบกพร่องทางพฤติกรรม หรืออารมณ์</option>
            <option value="8. บุคคลออทิสติก">8. บุคคลออทิสติก</option>
            <option value="9. บุคคลพิการซ้อน">9. บุคคลพิการซ้อน</option>
          </select>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ความต้องการจำเป็นพิเศษ / สิ่งอำนวยความสะดวก</label>
          <input type="text" id="iepSpecialNeed" placeholder="เช่น ด้านการอ่านสะกดคำ, อุปกรณ์ทางลาด" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">ครูผู้รับผิดชอบ / ที่ปรึกษา</label>
          <input type="text" id="iepAdvisor" placeholder="ชื่อคุณครูผู้ดูแลแผน IEP" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" class="flex-1 btn-ega-primary py-2.5 font-bold">บันทึกข้อมูล นร. เรียนรวม</button>
          <button type="button" onclick="closeModal('modalAddIepStudent')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ADD STUDENT TRANSFER (IN / OUT) -->
  <div id="modalAddTransfer" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-3 sm:p-4">
    <div class="card-3d max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-200">
        <h3 id="modalTransferTitle" class="text-base font-black text-slate-900 flex items-center gap-2">
          <i data-lucide="arrow-left-right" class="w-5 h-5 text-emerald-600"></i> บันทึกการย้ายนักเรียน
        </h3>
        <button type="button" onclick="closeModal('modalAddTransfer')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="formStudentTransfer" onsubmit="handleSaveStudentTransfer(event)" class="space-y-3 text-xs">
        <input type="hidden" id="trfType" value="transfer_in">
        <div>
          <label class="block font-bold text-slate-700 mb-1">ชื่อ - นามสกุลนักเรียน *</label>
          <input type="text" id="trfName" required placeholder="เช่น ด.ช.กิตติพงษ์ ศรีสุข" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-slate-700 mb-1">ชั้นเรียน</label>
            <input type="text" id="trfClass" required placeholder="เช่น ม.2/1" class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">วันที่ย้าย *</label>
            <input type="date" id="trfDate" value="2026-10-10" required class="w-full px-3 py-2 border rounded-xl font-bold">
          </div>
        </div>
        <div id="trfSchoolGroup">
          <label class="block font-bold text-slate-700 mb-1" id="trfSchoolLabel">โรงเรียนเดิม *</label>
          <input type="text" id="trfSchool" required placeholder="ชื่อสถานศึกษา" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">สาเหตุการย้าย</label>
          <input type="text" id="trfReason" placeholder="เช่น ผู้ปกครองย้ายถิ่นฐานประกอบอาชีพ" class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">เลขที่หนังสือส่งตัว</label>
          <input type="text" id="trfDocNo" placeholder="เช่น ศธ 04052/..." class="w-full px-3 py-2 border rounded-xl font-bold">
        </div>
        <div class="flex items-center gap-2 pt-1">
          <input type="checkbox" id="trfSendLine" checked class="w-4 h-4 rounded text-emerald-600">
          <label for="trfSendLine" class="font-bold text-slate-700">ส่งแจ้งเตือนเด้งเข้ากลุ่ม LINE ทันที</label>
        </div>
        <div class="pt-2 flex gap-2">
          <button type="submit" id="btnSaveTransfer" class="flex-1 btn-ega-primary py-2.5 font-bold">บันทึกข้อมูลการย้าย</button>
          <button type="button" onclick="closeModal('modalAddTransfer')" class="px-4 py-2.5 border rounded-xl text-slate-600 font-bold">ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>
  `;
}

module.exports = { getModalsHtml };
