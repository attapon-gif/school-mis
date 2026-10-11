const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update handleSavePp5Score
const oldPp5SavePattern = /function handleSavePp5Score\(e\) \{\s*e\.preventDefault\(\);\s*initExtendedState\(\);/;

const newPp5Save = `function handleSavePp5Score(e) {
      e.preventDefault();
      if (isGlobalProcessing) return;
      initExtendedState();
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const unlock = lockButton(submitBtn, 'กำลังตัดเกรด...');
      showLoading(true, 'กำลังบันทึกคะแนนและตัดเกรด ปพ.5...', 'กำลังคำนวณสัดส่วนคะแนน 70:30 เวลาเรียน และระดับผลการเรียน');`;

if (oldPp5SavePattern.test(html)) {
  html = html.replace(oldPp5SavePattern, newPp5Save);
  console.log('1. handleSavePp5Score anti-double click added');
} else {
  console.error('1. oldPp5SavePattern NOT MATCHED!');
}

const oldPp5SaveEnd = `      closeModal('modalAddPp5Score');
      renderPp5Table();
      showToast('บันทึกคะแนนและตัดเกรด ปพ.5 สำเร็จ');
    }`;

const newPp5SaveEnd = `      setTimeout(() => {
        unlock();
        showLoading(false);
        closeModal('modalAddPp5Score');
        renderPp5Table();
        showToast('บันทึกคะแนนและตัดเกรด ปพ.5 สำเร็จ');
      }, 200);
    }`;

if (html.includes(oldPp5SaveEnd)) {
  html = html.replace(oldPp5SaveEnd, newPp5SaveEnd);
  console.log('2. handleSavePp5Score end unlock added');
} else {
  console.error('2. oldPp5SaveEnd NOT FOUND!');
}

// 2. Update toggleApproveResearch to showLoading
const oldToggleApprove = `    function toggleApproveResearch(resId, targetStatus = 'approved') {
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
    }`;

const newToggleApprove = `    function toggleApproveResearch(resId, targetStatus = 'approved') {
      if (isGlobalProcessing) return;
      initExtendedState();
      if (!canApproveResearch()) {
        showToast('เฉพาะผู้อำนวยการ, หัวหน้าวิชาการ หรือผู้ดูแลระบบเท่านั้นที่มีสิทธิ์อนุมัติ');
        return;
      }
      showLoading(true, targetStatus === 'approved' ? 'กำลังบันทึกการอนุมัติงานวิจัย...' : 'กำลังปรับสถานะงานวิจัย...', 'กำลังบันทึกข้อมูลและปรับปรุงสถานะ');
      setTimeout(() => {
        const r = state.ext.researchItems.find(x => x.id === resId);
        if (r) {
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
        showLoading(false);
      }, 200);
    }`;

if (html.includes(oldToggleApprove)) {
  html = html.replace(oldToggleApprove, newToggleApprove);
  console.log('3. toggleApproveResearch loading animation added');
} else {
  console.error('3. oldToggleApprove NOT FOUND!');
}

// 3. Update deleteResearchItem to showLoading
const oldDeleteResearch = `    function deleteResearchItem(resId) {
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
    }`;

const newDeleteResearch = `    function deleteResearchItem(resId) {
      if (isGlobalProcessing) return;
      initExtendedState();
      const r = state.ext.researchItems.find(x => x.id === resId);
      if (!r) return;

      if (!canDeleteResearch(r)) {
        showToast('คุณไม่มีสิทธิ์ลบงานวิจัยนี้');
        return;
      }

      if (!confirm(\`คุณต้องการลบงานวิจัยเรื่อง "\${r.title}" ออกจากระบบหรือไม่?\\n(การลบนี้ไม่สามารถเรียกคืนได้)\`)) return;

      showLoading(true, 'กำลังลบงานวิจัยในชั้นเรียน...', 'กำลังนำรายการออกจากระบบ');
      setTimeout(() => {
        state.ext.researchItems = state.ext.researchItems.filter(x => x.id !== resId);
        saveExtendedState();
        renderResearchCards();
        showLoading(false);
        showToast('ลบงานวิจัยเรียบร้อยแล้ว');
      }, 200);
    }`;

if (html.includes(oldDeleteResearch)) {
  html = html.replace(oldDeleteResearch, newDeleteResearch);
  console.log('4. deleteResearchItem loading animation added');
} else {
  console.error('4. oldDeleteResearch NOT FOUND!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done applying extra anti-double click patches!');
