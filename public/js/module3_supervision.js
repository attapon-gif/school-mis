// MODULE 3: งานนิเทศภายใน (ปฏิทิน + คะแนน + รูปภาพบรรยากาศ)

let supervisionList = [];
let selectedSupvId = null;
let currentUploadedPhotos = [];

function initSupervisionModule() {
  loadSupervisions();
}

async function loadSupervisions() {
  try {
    const res = await fetch('/api/supervisions');
    const data = await res.json();
    supervisionList = data.supervisions || [];

    // Stats
    const total = supervisionList.length;
    const done = supervisionList.filter(s => s.status === 'เสร็จสิ้น').length;
    const pending = total - done;

    document.getElementById('statSupervisionTotal').textContent = `${total} ครั้ง`;
    document.getElementById('statSupervisionDone').textContent = `${done} ครั้ง`;
    document.getElementById('statSupervisionPending').textContent = `${pending} ครั้ง`;

    renderSupervisionList(supervisionList);
  } catch (err) {
    console.error('Error loading supervisions:', err);
  }
}

function renderSupervisionList(list) {
  const container = document.getElementById('supervisionListContainer');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-400">ยังไม่มีรายการนัดหมายการนิเทศ</div>`;
    return;
  }

  container.innerHTML = list.map(s => {
    const isDone = s.status === 'เสร็จสิ้น';

    return `
      <div class="border border-slate-200 rounded-2xl p-4 hover:border-blue-300 transition-all space-y-3 bg-white">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-700'}">
              <i data-lucide="${isDone ? 'check-circle' : 'calendar'}" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-bold text-slate-900">${s.teacherName}</h4>
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                  ${s.status}
                </span>
              </div>
              <p class="text-xs text-slate-500">${s.subject} (${s.classroom}) | สถานที่: ${s.room}</p>
            </div>
          </div>

          <div class="text-left sm:text-right">
            <div class="text-xs font-bold text-slate-800">${s.date}</div>
            <div class="text-xs text-slate-400">${s.period}</div>
          </div>
        </div>

        <!-- Feedback & Score Preview (If Evaluated) -->
        ${isDone && s.scores ? `
          <div class="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
            <div class="flex justify-between items-center">
              <span class="text-slate-500">คะแนนประเมินรวม:</span>
              <span class="text-base font-black text-indigo-600">${s.scores.total} / 100 คะแนน</span>
            </div>
            ${s.feedback ? `<div class="text-slate-700 italic">"${s.feedback}"</div>` : ''}
            
            <!-- Photo thumbnails -->
            ${s.photos && s.photos.length > 0 ? `
              <div class="flex gap-2 pt-1 overflow-x-auto">
                ${s.photos.map(p => `
                  <img src="${p}" alt="Activity" class="w-16 h-12 rounded-lg object-cover border border-slate-200">
                `).join('')}
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- Actions -->
        <div class="flex justify-between items-center border-t border-slate-100 pt-3">
          <span class="text-xs text-slate-400">ผู้นิเทศ: ${s.supervisorName}</span>
          <div class="flex gap-2">
            ${isDone ? `
              <button onclick="printSupervisionReport('${s.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all">
                <i data-lucide="printer" class="w-3.5 h-3.5"></i> พิมพ์รายงานนิเทศ (PDF)
              </button>
            ` : ''}
            <button onclick="openModalEvaluate('${s.id}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all">
              <i data-lucide="${isDone ? 'edit-2' : 'award'}" class="w-3.5 h-3.5"></i>
              ${isDone ? 'แก้ไขคะแนน/รูปภาพ' : 'บันทึกคะแนน & รูปภาพ'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function openModalNewSupervision() {
  const d = new Date();
  document.getElementById('supvDate').value = d.toISOString().split('T')[0];
  openModal('modalNewSupervision');
}

async function handleSaveSupervision(e) {
  e.preventDefault();
  const teacherSelect = document.getElementById('supvTeacherSelect');
  const teacherId = teacherSelect.value;
  const teacherObj = state.teachers.find(t => t.id === teacherId) || {};
  const teacherName = teacherObj.name || teacherSelect.options[teacherSelect.selectedIndex].text;
  const subject = teacherObj.subject || 'รายวิชา';

  const payload = {
    date: document.getElementById('supvDate').value,
    period: document.getElementById('supvPeriod').value,
    teacherId,
    teacherName,
    subject,
    classroom: document.getElementById('supvClassSelect').value,
    room: document.getElementById('supvRoom').value,
    supervisorName: document.getElementById('supvSupervisorName').value
  };

  try {
    const res = await fetch('/api/supervisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      alert('เพิ่มนัดหมายปฏิทินการนิเทศเรียบร้อยแล้ว!');
      closeModal('modalNewSupervision');
      loadSupervisions();
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการบันทึกนัดหมาย');
  }
}

// Open Evaluation Modal
function openModalEvaluate(supvId) {
  selectedSupvId = supvId;
  const item = supervisionList.find(s => s.id === supvId);
  if (!item) return;

  currentUploadedPhotos = item.photos ? [...item.photos] : [];

  document.getElementById('evaluateSupvInfo').innerHTML = `
    <div><strong>ครูผู้รับการนิเทศ:</strong> ${item.teacherName} (${item.subject})</div>
    <div><strong>วันที่:</strong> ${item.date} | ${item.period} | <strong>สถานที่:</strong> ${item.room}</div>
  `;

  if (item.scores) {
    document.getElementById('scorePre').value = item.scores.preparation || 19;
    document.getElementById('scoreActive').value = item.scores.activeLearning || 20;
    document.getElementById('scoreTech').value = item.scores.mediaTech || 19;
    document.getElementById('scoreClass').value = item.scores.classroomMgmt || 18;
    document.getElementById('scoreMeasure').value = item.scores.measurement || 19;
  } else {
    document.getElementById('scorePre').value = 19;
    document.getElementById('scoreActive').value = 20;
    document.getElementById('scoreTech').value = 19;
    document.getElementById('scoreClass').value = 18;
    document.getElementById('scoreMeasure').value = 19;
  }

  document.getElementById('evaluateFeedback').value = item.feedback || '';
  renderPhotoPreviews();

  // Photo input listener
  const photoInput = document.getElementById('evaluatePhotoInput');
  photoInput.onchange = async () => {
    if (photoInput.files.length > 0) {
      const formData = new FormData();
      formData.append('photo', photoInput.files[0]);
      try {
        const uploadRes = await fetch('/api/upload/photo', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          currentUploadedPhotos.push(uploadData.url);
          renderPhotoPreviews();
        }
      } catch (err) {
        console.error('Photo upload error:', err);
      }
    }
  };

  openModal('modalEvaluateSupv');
}

function renderPhotoPreviews() {
  const container = document.getElementById('evaluatePhotosPreview');
  container.innerHTML = currentUploadedPhotos.map((url, idx) => `
    <div class="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video">
      <img src="${url}" class="w-full h-full object-cover">
      <button type="button" onclick="removeUploadedPhoto(${idx})" class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100">
        <i data-lucide="x" class="w-3 h-3"></i>
      </button>
    </div>
  `).join('');
  if (window.lucide) lucide.createIcons();
}

function removeUploadedPhoto(idx) {
  currentUploadedPhotos.splice(idx, 1);
  renderPhotoPreviews();
}

async function saveSupervisionEvaluation() {
  if (!selectedSupvId) return;

  const pre = parseFloat(document.getElementById('scorePre').value) || 0;
  const active = parseFloat(document.getElementById('scoreActive').value) || 0;
  const tech = parseFloat(document.getElementById('scoreTech').value) || 0;
  const cls = parseFloat(document.getElementById('scoreClass').value) || 0;
  const msr = parseFloat(document.getElementById('scoreMeasure').value) || 0;

  const total = pre + active + tech + cls + msr;

  const scores = {
    preparation: pre,
    activeLearning: active,
    mediaTech: tech,
    classroomMgmt: cls,
    measurement: msr,
    total
  };

  const feedback = document.getElementById('evaluateFeedback').value;

  try {
    const res = await fetch(`/api/supervisions/${selectedSupvId}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scores,
        feedback,
        photos: currentUploadedPhotos
      })
    });
    const result = await res.json();
    if (result.success) {
      alert('บันทึกผลการนิเทศและรูปภาพเรียบร้อยแล้ว!');
      closeModal('modalEvaluateSupv');
      loadSupervisions();
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการบันทึกผลการนิเทศ');
  }
}

// Print Supervision Summary Report (PDF)
function printSupervisionReport(supvId) {
  const s = supervisionList.find(item => item.id === supvId);
  if (!s) return;
  const school = state.schoolInfo;
  const printable = document.getElementById('printableArea');

  const scores = s.scores || { preparation: 0, activeLearning: 0, mediaTech: 0, classroomMgmt: 0, measurement: 0, total: 0 };

  printable.innerHTML = `
    <div style="font-family: 'Sarabun', sans-serif; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6;">
      <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;">
        <img src="${school.logoUrl || '/assets/logo.jpg'}" style="max-height: 70px; margin: 0 auto 6px auto; display: block;" alt="ตราโรงเรียนฝันใหม่">
        <h2 style="font-size: 20px; font-weight: bold; margin: 0;">${school.name}</h2>
        <h3 style="font-size: 16px; font-weight: bold; margin-top: 4px;">รายงานผลการนิเทศการจัดการเรียนรู้ภายในสถานศึกษา</h3>
        <p style="font-size: 13px; color: #64748b; margin: 4px 0;">ประจำภาคเรียนที่ ${school.term} ปีการศึกษา ${school.academicYear}</p>
      </div>

      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 16px; font-size: 13px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div><strong>ครูผู้รับการนิเทศ:</strong> ${s.teacherName}</div>
          <div><strong>กลุ่มสาระฯ/รายวิชา:</strong> ${s.subject}</div>
          <div><strong>ระดับชั้น / ห้องเรียน:</strong> ${s.classroom} (${s.room})</div>
          <div><strong>วันที่นิเทศ:</strong> ${s.date} (${s.period})</div>
          <div><strong>ผู้นิเทศ:</strong> ${s.supervisorName}</div>
        </div>
      </div>

      <!-- Rubric Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
        <thead>
          <tr style="background: #f1f5f9; border-top: 1px solid #cbd5e1; border-bottom: 2px solid #cbd5e1;">
            <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">ประเด็นการประเมินการจัดการเรียนรู้</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; width: 100px; text-align: center;">คะแนนเต็ม</th>
            <th style="padding: 8px; border: 1px solid #cbd5e1; width: 100px; text-align: center;">คะแนนที่ได้</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">1. การเตรียมการสอนและแผนการจัดการเรียนรู้</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">20</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${scores.preparation}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">2. กระบวนการจัดการเรียนรู้เชิงรุก (Active Learning)</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">20</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${scores.activeLearning}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">3. การใช้สื่อ นวัตกรรม และเทคโนโลยีดิจิทัล</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">20</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${scores.mediaTech}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">4. การบริหารจัดการชั้นเรียนและบรรยากาศการเรียนรู้</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">20</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${scores.classroomMgmt}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #cbd5e1;">5. การวัดและประเมินผลตามสภาพจริง</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">20</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${scores.measurement}</td>
          </tr>
          <tr style="background: #e2e8f0; font-weight: bold;">
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">รวมคะแนนประเมินทั้งสิ้น</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">100</td>
            <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: #1d4ed8; font-size: 15px;">${scores.total}</td>
          </tr>
        </tbody>
      </table>

      <!-- Feedback -->
      <div style="border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 13px;">
        <strong>ข้อคิดเห็นและข้อเสนอแนะของผู้นิเทศ:</strong>
        <div style="margin-top: 4px; color: #334155;">${s.feedback || 'การจัดกิจกรรมการเรียนรู้มีประสิทธิภาพ สอดคล้องกับตัวชี้วัด'}</div>
      </div>

      <!-- Photo Gallery in Report -->
      ${s.photos && s.photos.length > 0 ? `
        <div style="margin-bottom: 24px;">
          <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px;">ภาพถ่ายบรรยากาศการนิเทศการจัดการเรียนรู้:</div>
          <div style="display: flex; gap: 12px; justify-content: center;">
            ${s.photos.slice(0, 3).map(p => `
              <img src="${p}" style="max-height: 120px; border-radius: 6px; border: 1px solid #cbd5e1; object-fit: cover;">
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Signatures -->
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 30px;">
        <div style="text-align: center; width: 250px;">
          <div>ลงชื่อ......................................................ผู้รับการนิเทศ</div>
          <div style="margin-top: 4px;">(${s.teacherName})</div>
          <div style="color: #64748b; font-size: 12px;">ครูผู้สอน</div>
        </div>
        <div style="text-align: center; width: 250px;">
          <div>ลงชื่อ......................................................ผู้นิเทศ</div>
          <div style="margin-top: 4px;">(${s.supervisorName})</div>
          <div style="color: #64748b; font-size: 12px;">ผู้นิเทศการจัดการเรียนรู้</div>
        </div>
      </div>
    </div>
  `;

  window.print();
}
