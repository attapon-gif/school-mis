const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Target the start of CAR JavaScript functions in index.html
const oldStart = `    // -------------------------------------------------------------------------
    // 7. CLASSROOM ACTION RESEARCH (CAR) WITH GOOGLE DRIVE INTEGRATION (ข้อ 7)
    // -------------------------------------------------------------------------
    let currentResUploadMode = 'file';`;

const newStart = `    // -------------------------------------------------------------------------
    // 7. CLASSROOM ACTION RESEARCH (CAR) WITH GOOGLE DRIVE & RBAC PERMISSIONS (ข้อ 7)
    // -------------------------------------------------------------------------
    let currentResUploadMode = 'file';

    function canApproveResearch() {
      const role = state.currentRole || 'admin';
      return role === 'admin' || role === 'director' || role === 'academic';
    }

    function canDeleteResearch(r) {
      const role = state.currentRole || 'admin';
      if (role === 'admin' || role === 'director') return true;
      if (role === 'teacher') return true; // ครูสามารถลบหรือจัดการงานของตนเองได้
      return false;
    }

    function toggleApproveResearch(resId, targetStatus = 'approved') {
      initExtendedState();
      if (!canApproveResearch()) {
        showToast('เฉพาะผู้อำนวยการ, หัวหน้าวิชาการ หรือผู้ดูแลระบบเท่านั้นที่มีสิทธิ์อนุมัติ');
        return;
      }
      const r = state.ext.researchItems.find(x => x.id === resId);
      if (!r) return;

      r.status = targetStatus;
      if (targetStatus === 'approved') {
        const approver = state.schoolInfo?.directorName || 'นายอรรถพล ฉาไธสง (ผอ.)';
        r.approvedBy = approver;
        r.approvedDate = new Date().toISOString().split('T')[0];
        showToast('อนุมัติงานวิจัยในชั้นเรียนเรียบร้อยแล้ว');
      } else if (targetStatus === 'rejected') {
        r.approvedBy = '-';
        showToast('ส่งกลับงานวิจัยเพื่อให้ครูผู้สอนปรับปรุงแก้ไข');
      } else {
        r.approvedBy = '-';
        showToast('ปรับสถานะเป็น "รอการตรวจ"');
      }

      saveExtendedState();
      renderResearchCards();
    }

    function deleteResearchItem(resId) {
      initExtendedState();
      const r = state.ext.researchItems.find(x => x.id === resId);
      if (!r) return;

      if (!canDeleteResearch(r)) {
        showToast('คุณไม่มีสิทธิ์ลบงานวิจัยนี้');
        return;
      }

      if (!confirm(\`คุณต้องการลบงานวิจัยเรื่อง "\${r.title}" ออกจากระบบหรือไม่?\\n(การลบนี้ไม่สามารถเรียกคืนได้)\`)) return;

      state.ext.researchItems = state.ext.researchItems.filter(x => x.id !== resId);
      saveExtendedState();
      renderResearchCards();
      showToast('ลบงานวิจัยเรียบร้อยแล้ว');
    }

    function removeResearchDriveFile(resId) {
      initExtendedState();
      const r = state.ext.researchItems.find(x => x.id === resId);
      if (!r) return;

      if (!canDeleteResearch(r)) {
        showToast('คุณไม่มีสิทธิ์ลบไฟล์นี้');
        return;
      }

      if (!confirm(\`ต้องการปลดไฟล์แนบ Google Drive ออกจากงานวิจัยเรื่อง "\${r.title}" หรือไม่?\`)) return;

      r.driveUrl = '';
      r.fileName = '';
      r.fileSize = '';
      saveExtendedState();
      renderResearchCards();
      showToast('ปลดไฟล์แนบ Google Drive เรียบร้อยแล้ว');
    }`;

if (html.includes(oldStart)) {
  html = html.replace(oldStart, newStart);
  console.log('1. RBAC permission helper functions added');
} else {
  console.error('1. oldStart NOT FOUND!');
}

// Update renderResearchCards in index.html to render approval buttons, delete buttons, and approver info
const oldRender = `      container.innerHTML = list.map(r => \`
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
      \`).join('');`;

const newRender = `      const isApprover = canApproveResearch();

      container.innerHTML = list.map(r => {
        const canDelete = canDeleteResearch(r);
        return \`
        <div class="card-3d p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-sm hover:shadow-md transition">
          <div class="flex justify-between items-start gap-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold \${
                r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                r.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }">
                \${r.status === 'approved' ? '✓ อนุมัติแล้ว' : (r.status === 'rejected' ? '⚠️ ส่งกลับแก้ไข' : '⏳ รอการตรวจ')}
              </span>
              \${r.status === 'approved' ? \`
                <span class="text-[10px] text-slate-500 font-medium">อนุมัติโดย: <strong>\${r.approvedBy || 'ผู้อำนวยการ'}</strong></span>
              \` : ''}
            </div>
            <div class="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>วันที่ส่ง: \${r.submitDate}</span>
              \${canDelete ? \`
                <button type="button" onclick="deleteResearchItem('\${r.id}')" title="ลบงานวิจัยนี้" class="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition ml-1">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              \` : ''}
            </div>
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
                <button type="button" onclick="openModalAttachDrive('\${r.id}')" title="เปลี่ยนไฟล์ Drive" class="p-1 hover:bg-blue-100 text-blue-700 rounded-lg transition">
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                </button>
                \${canDelete ? \`
                  <button type="button" onclick="removeResearchDriveFile('\${r.id}')" title="ปลดไฟล์นี้ออกจากงานวิจัย" class="p-1 hover:bg-rose-100 text-rose-600 rounded-lg transition">
                    <i data-lucide="file-x" class="w-3.5 h-3.5"></i>
                  </button>
                \` : ''}
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

          <!-- Action Buttons Bar with Approval Controls -->
          <div class="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
            <!-- Approval Controls (Visible to Director, Academic Head, Admin) -->
            <div class="flex items-center gap-1.5">
              \${isApprover ? (
                r.status === 'approved' ? \`
                  <button type="button" onclick="toggleApproveResearch('\${r.id}', 'pending')" title="เปลี่ยนสถานะกลับเป็นรอตรวจ" class="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex items-center gap-1 transition">
                    <i data-lucide="rotate-ccw" class="w-3 h-3"></i> ปรับเป็นรอตรวจ
                  </button>
                \` : \`
                  <button type="button" onclick="toggleApproveResearch('\${r.id}', 'approved')" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i> อนุมัติงานวิจัย
                  </button>
                  <button type="button" onclick="toggleApproveResearch('\${r.id}', 'rejected')" class="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1 transition">
                    <i data-lucide="undo-2" class="w-3 h-3"></i> ส่งกลับ
                  </button>
                \`
              ) : ''}
            </div>

            <!-- View & Print Controls -->
            <div class="flex items-center gap-2 ml-auto">
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
        </div>
      \`;
      }).join('');`;

if (html.includes(oldRender)) {
  html = html.replace(oldRender, newRender);
  console.log('2. renderResearchCards updated with approval and delete actions');
} else {
  console.error('2. oldRender NOT FOUND!');
}

// 3. Update handleSaveResearch to set default status by role
const oldSave = `        status: 'approved',
        approvedBy: 'นายอรรถพล ฉาไธสง (ผอ.)',`;

const newSave = `        status: (state.currentRole === 'director' || state.currentRole === 'admin') ? 'approved' : 'pending',
        approvedBy: (state.currentRole === 'director' || state.currentRole === 'admin') ? (state.schoolInfo?.directorName || 'นายอรรถพล ฉาไธสง (ผอ.)') : '-',`;

if (html.includes(oldSave)) {
  html = html.replace(oldSave, newSave);
  console.log('3. handleSaveResearch updated with role-based default status');
} else {
  console.error('3. oldSave NOT FOUND!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done updating index.html with RBAC!');
