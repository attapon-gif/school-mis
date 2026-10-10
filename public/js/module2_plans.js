// MODULE 2: งานส่งแผนการสอนออนไลน์ + บันทึกหลังแผน + ลายเซ็นผู้บริหาร

let lessonPlansData = [];
let selectedPlanId = null;

function initPlansModule() {
  loadLessonPlans();
}

async function loadLessonPlans() {
  try {
    const res = await fetch('/api/plans');
    const data = await res.json();
    lessonPlansData = data.plans || [];
    renderPlansGrid(lessonPlansData);
  } catch (err) {
    console.error('Error loading lesson plans:', err);
  }
}

function renderPlansGrid(list) {
  const container = document.getElementById('plansContainer');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<div class="col-span-3 text-center p-12 text-slate-400">ยังไม่มีรายการแผนการจัดการเรียนรู้</div>`;
    return;
  }

  container.innerHTML = list.map(p => {
    const isApproved = p.status === 'อนุมัติแล้ว';
    const isRecorded = p.postLesson && p.postLesson.isRecorded;

    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
        <div class="space-y-3">
          <!-- Header & Status Badge -->
          <div class="flex justify-between items-start gap-2">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${p.status}
            </span>
            <span class="text-xs text-slate-400 font-mono">${p.id}</span>
          </div>

          <div>
            <h4 class="font-bold text-slate-900 leading-snug line-clamp-2">${p.unitTitle}</h4>
            <p class="text-xs text-blue-600 font-medium mt-1">${p.subject}</p>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
            <div><span class="text-slate-400">ครูผู้สอน:</span> <strong>${p.teacherName}</strong></div>
            <div><span class="text-slate-400">ระดับชั้น:</span> ${p.classroom} | ${p.learningHours} ชั่วโมง</div>
            <div><span class="text-slate-400">วันที่ส่ง:</span> ${p.submittedDate}</div>
          </div>

          <!-- Post-lesson status -->
          <div class="p-2.5 rounded-xl border ${isRecorded ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'} text-xs flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <i data-lucide="${isRecorded ? 'check-circle-2' : 'clock'}" class="w-3.5 h-3.5"></i>
              ${isRecorded ? 'บันทึกหลังแผนเรียบร้อย' : 'ยังไม่บันทึกหลังแผน'}
            </span>
            <button onclick="openModalPostLesson('${p.id}')" class="text-xs font-bold text-blue-600 hover:underline">
              ${isRecorded ? 'ดู/แก้ไข' : '+ คีย์ข้อมูล'}
            </button>
          </div>

          <!-- Executive Approval Stamp (If Approved) -->
          ${isApproved ? `
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 relative overflow-hidden">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i> ผู้บริหารตรวจอนุมัติแล้ว
                  </div>
                  <div class="text-[10px] text-slate-500 mt-0.5">${p.approvedDate}</div>
                  ${p.directorComment ? `<div class="text-[11px] text-emerald-900 mt-1 italic">"${p.directorComment}"</div>` : ''}
                </div>
                <div class="w-20 h-10 flex items-center justify-center">
                  <img src="${p.signatureStampUrl || '/uploads/signatures/default_signature.png'}" alt="Digital Stamp" class="max-h-full max-w-full object-contain filter drop-shadow">
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Action Buttons -->
        <div class="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
          <button onclick="printApprovedPlan('${p.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i> ใบปะหน้าตรวจแผน
          </button>
          
          <button onclick="openModalReviewPlan('${p.id}')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all">
            <i data-lucide="stamp" class="w-3.5 h-3.5"></i> ตรวจแผน/สแกนลายเซ็น
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function openModalSubmitPlan() {
  openModal('modalSubmitPlan');
}

async function handleSubmitPlan(e) {
  e.preventDefault();
  const teacherSelect = document.getElementById('planTeacherSelect');
  const teacherId = teacherSelect.value;
  const teacherName = teacherSelect.options[teacherSelect.selectedIndex].text.split(' (')[0];
  const classroom = document.getElementById('planClassSelect').value;
  const subject = document.getElementById('planSubject').value;
  const unitTitle = document.getElementById('planUnitTitle').value;
  const learningHours = document.getElementById('planHours').value;

  const formData = new FormData();
  formData.append('teacherId', teacherId);
  formData.append('teacherName', teacherName);
  formData.append('classroom', classroom);
  formData.append('subject', subject);
  formData.append('unitTitle', unitTitle);
  formData.append('learningHours', learningHours);

  const fileInput = document.getElementById('planFileInput');
  if (fileInput.files.length > 0) {
    formData.append('planFile', fileInput.files[0]);
  }

  try {
    const res = await fetch('/api/plans', { method: 'POST', body: formData });
    const result = await res.json();
    if (result.success) {
      alert('ส่งแผนการจัดการเรียนรู้เรียบร้อยแล้ว!');
      closeModal('modalSubmitPlan');
      document.getElementById('formSubmitPlan').reset();
      loadLessonPlans();
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการส่งแผนการสอน');
  }
}

// Open Post-Lesson Modal
function openModalPostLesson(planId) {
  selectedPlanId = planId;
  const plan = lessonPlansData.find(p => p.id === planId);
  if (!plan) return;

  document.getElementById('postLessonPlanInfo').innerHTML = `
    <div><strong>เรื่อง:</strong> ${plan.unitTitle}</div>
    <div><strong>วิชา:</strong> ${plan.subject} | ครูผู้สอน: ${plan.teacherName}</div>
  `;

  document.getElementById('postLessonResult').value = plan.postLesson ? plan.postLesson.result : '';
  document.getElementById('postLessonProblem').value = plan.postLesson ? plan.postLesson.problem : '';
  document.getElementById('postLessonSolution').value = plan.postLesson ? plan.postLesson.solution : '';

  openModal('modalPostLesson');
}

// Save Post-Lesson Reflection
async function savePostLesson() {
  if (!selectedPlanId) return;
  const result = document.getElementById('postLessonResult').value;
  const problem = document.getElementById('postLessonProblem').value;
  const solution = document.getElementById('postLessonSolution').value;

  try {
    const res = await fetch(`/api/plans/${selectedPlanId}/post-lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result, problem, solution })
    });
    const data = await res.json();
    if (data.success) {
      alert('บันทึกผลหลังการจัดการเรียนรู้เรียบร้อยแล้ว!');
      closeModal('modalPostLesson');
      loadLessonPlans();
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
  }
}

// Open Executive Review Modal
function openModalReviewPlan(planId) {
  selectedPlanId = planId;
  const plan = lessonPlansData.find(p => p.id === planId);
  if (!plan) return;

  document.getElementById('reviewPlanInfo').innerHTML = `
    <div><strong>รหัสแผน:</strong> ${plan.id} | <strong>ครูผู้สอน:</strong> ${plan.teacherName}</div>
    <div><strong>หน่วยการเรียนรู้:</strong> ${plan.unitTitle}</div>
    <div><strong>วิชา:</strong> ${plan.subject} (${plan.classroom})</div>
  `;

  document.getElementById('reviewDirectorComment').value = plan.directorComment || '';
  if (state.schoolInfo.signatureUrl) {
    document.getElementById('reviewStampPreview').src = state.schoolInfo.signatureUrl;
  }

  openModal('modalReviewPlan');
}

// Save Executive Review with Digital Signature Stamp
async function saveExecutiveReview() {
  if (!selectedPlanId) return;
  const status = document.querySelector('input[name="reviewStatusRadio"]:checked').value;
  const directorComment = document.getElementById('reviewDirectorComment').value;
  const signatureStampUrl = state.schoolInfo.signatureUrl || '/uploads/signatures/default_signature.png';

  try {
    const res = await fetch(`/api/plans/${selectedPlanId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, directorComment, signatureStampUrl })
    });
    const data = await res.json();
    if (data.success) {
      alert('บันทึกผลการตรวจแผนและประทับลายเซ็นดิจิทัลเรียบร้อยแล้ว!');
      closeModal('modalReviewPlan');
      loadLessonPlans();
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการบันทึกผลการตรวจ');
  }
}

// Print Approved Lesson Plan Slip with Signature Overlay
function printApprovedPlan(planId) {
  const plan = lessonPlansData.find(p => p.id === planId);
  if (!plan) return;
  const school = state.schoolInfo;
  const printable = document.getElementById('printableArea');

  const post = plan.postLesson || {};

  printable.innerHTML = `
    <div style="font-family: 'Sarabun', sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6;">
      <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;">
        <img src="${school.logoUrl || '/assets/logo.jpg'}" style="max-height: 70px; margin: 0 auto 6px auto; display: block;" alt="ตราโรงเรียนฝันใหม่">
        <h2 style="font-size: 20px; font-weight: bold; margin: 0;">${school.name}</h2>
        <h3 style="font-size: 16px; font-weight: bold; margin-top: 4px;">แบบขออนุมัติและรายงานผลการจัดการเรียนรู้ (ใบปะหน้าแผนการสอน)</h3>
        <p style="font-size: 13px; color: #64748b; margin: 4px 0;">ภาคเรียนที่ ${school.term} ปีการศึกษา ${school.academicYear}</p>
      </div>

      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 13px;">
        <div style="font-size: 15px; font-weight: bold; margin-bottom: 6px; color: #1d4ed8;">ส่วนที่ 1: ข้อมูลแผนการจัดการเรียนรู้</div>
        <div><strong>ชื่อหน่วยการเรียนรู้:</strong> ${plan.unitTitle}</div>
        <div><strong>รายวิชา:</strong> ${plan.subject} | <strong>ระดับชั้น:</strong> ${plan.classroom} | <strong>จำนวน:</strong> ${plan.learningHours} ชั่วโมง</div>
        <div><strong>ครูผู้สอน:</strong> ${plan.teacherName} | <strong>วันที่ส่ง:</strong> ${plan.submittedDate}</div>
      </div>

      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 13px;">
        <div style="font-size: 15px; font-weight: bold; margin-bottom: 6px; color: #047857;">ส่วนที่ 2: บันทึกผลหลังการจัดการเรียนรู้ (บันทึกหลังแผน)</div>
        <div style="margin-bottom: 6px;"><strong>1. ผลการจัดกิจกรรม:</strong> ${post.result || '- (ยังไม่ได้บันทึก)'}</div>
        <div style="margin-bottom: 6px;"><strong>2. ปัญหาและอุปสรรค:</strong> ${post.problem || '- (ยังไม่ได้บันทึก)'}</div>
        <div><strong>3. แนวทางแก้ไข/ข้อเสนอแนะ:</strong> ${post.solution || '- (ยังไม่ได้บันทึก)'}</div>
      </div>

      <!-- Director Approval & Stamp Box -->
      <div style="border: 2px dashed #059669; background: #ecfdf5; border-radius: 8px; padding: 18px; margin-top: 24px; position: relative;">
        <div style="font-size: 15px; font-weight: bold; color: #065f46; margin-bottom: 8px;">
          ส่วนที่ 3: ผลการพิจารณาและอนุมัติของผู้บริหารสถานศึกษา
        </div>
        <div style="font-size: 14px;"><strong>ผลการตรวจ:</strong> <span style="color: #059669; font-weight: bold;">[ / ] อนุมัติให้ใช้จัดการเรียนรู้ได้</span></div>
        <div style="font-size: 13px; margin-top: 6px;"><strong>ความคิดเห็น/ข้อเสนอแนะ:</strong> ${plan.directorComment || 'จัดการเรียนรู้ได้ตามแผน'}</div>
        
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 15px;">
          <div style="text-align: center; width: 240px;">
            <div style="height: 60px; display: flex; align-items: center; justify-content: center;">
              <img src="${plan.signatureStampUrl || school.signatureUrl || '/uploads/signatures/default_signature.png'}" style="max-height: 55px;" alt="Signature Stamp">
            </div>
            <div style="font-size: 14px; font-weight: bold;">(${school.directorName})</div>
            <div style="font-size: 12px; color: #64748b;">${school.directorPosition}</div>
            <div style="font-size: 11px; color: #059669; margin-top: 4px;">ประทับลายเซ็นดิจิทัล: ${plan.approvedDate || 'อนุมัติแล้ว'}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  window.print();
}
