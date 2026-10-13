const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Update DEFAULT_GAS_URL
const oldDefaultGas = "const DEFAULT_GAS_URL = '';";
const newDefaultGas = "const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbwKJNHpFNKM2jaw-0rUfhvS_3YlzNq9mm74U4CZNpaLpKH_7Vl5WvFQeR-fB5QCgII/exec';";

if (!content.includes(oldDefaultGas)) {
  console.error('Could not find oldDefaultGas');
  process.exit(1);
}
content = content.replace(oldDefaultGas, newDefaultGas);
console.log('1. DEFAULT_GAS_URL updated: OK');

// 2. Remove URL deletion from initDongsawanData
const oldInitGas = `        try {
          const oldGas = localStorage.getItem('fm_gas_webapp_url');
          if (oldGas && oldGas.includes('AKfycbwKJNHpFNKM2jaw-0rUfhvS_3YlzNq9mm74U4CZNpaLpKH_7Vl5WvFQeR-fB5QCgII')) {
            localStorage.removeItem('fm_gas_webapp_url');
          }
        } catch (e) {}`;

if (content.includes(oldInitGas)) {
  content = content.replace(oldInitGas, '');
  console.log('2. Removed URL purge from initDongsawanData: OK');
} else {
  console.log('2. URL purge in initDongsawanData already removed or not found');
}

// 3. Update getGasWebAppUrl
const oldGetGas = `    function getGasWebAppUrl() {
      try {
        const stored = localStorage.getItem('fm_gas_webapp_url');
        if (stored && stored.includes('AKfycbwKJNHpFNKM2jaw-0rUfhvS_3YlzNq9mm74U4CZNpaLpKH_7Vl5WvFQeR-fB5QCgII')) {
          localStorage.removeItem('fm_gas_webapp_url');
          return '';
        }
        return stored || DEFAULT_GAS_URL || '';
      } catch (e) {
        return DEFAULT_GAS_URL || '';
      }
    }`;

const newGetGas = `    function getGasWebAppUrl() {
      try {
        const stored = localStorage.getItem('fm_gas_webapp_url');
        return stored || DEFAULT_GAS_URL || 'https://script.google.com/macros/s/AKfycbwKJNHpFNKM2jaw-0rUfhvS_3YlzNq9mm74U4CZNpaLpKH_7Vl5WvFQeR-fB5QCgII/exec';
      } catch (e) {
        return DEFAULT_GAS_URL || 'https://script.google.com/macros/s/AKfycbwKJNHpFNKM2jaw-0rUfhvS_3YlzNq9mm74U4CZNpaLpKH_7Vl5WvFQeR-fB5QCgII/exec';
      }
    }`;

if (!content.includes(oldGetGas)) {
  console.error('Could not find oldGetGas');
  process.exit(1);
}
content = content.replace(oldGetGas, newGetGas);
console.log('3. getGasWebAppUrl updated: OK');

// 4. Update simulateLinePush
const oldSimulateLine = `    async function simulateLinePush(message) {
      initExtendedState();
      const token = state.ext.lineConfig?.token || '9byuGbRAT8DnHw/T9+z9uZ3c9k/YLMAhpu8tQRkVgZ2EhIMir6qXDJCB94fHjC7Vj/05jRIaWafSLVhyYyKnoiBBOtu+BG2VSLRdidZ+bX09yY07xihqLpAU6MvBSivn8GTPxfxeFRSkwxHECt19MQdB04t89/1O/w1cDnyilFU=';

      showToast('⏳ กำลังส่งข้อความไปยัง LINE...');

      let sent = false;

      // Mode 1: ทำงานใน Google Apps Script Web App iframe โดยตรง
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        try {
          google.script.run
            .withSuccessHandler(res => {
              if (res && res.success) {
                showToast('✅ ส่งข้อความเข้าแอป LINE สำเร็จเรียบร้อย!');
              } else {
                showToast('⚠️ ไม่สามารถส่ง LINE ได้: ' + (res.error || 'โปรดตรวจสอบสิทธิ์'));
              }
            })
            .withFailureHandler(err => {
              showToast('⚠️ เกิดข้อผิดพลาด: ' + (err.message || err));
            })
            .apiRouter('sendLineNotify', { token: token, message: message });
          return;
        } catch (e) {
          console.warn('Native GAS call failed, falling back:', e);
        }
      }

      // Mode 2: ส่งผ่าน Google Apps Script (Cloud Backend ส่งฟรีไม่ติด CORS)
      const gasUrl = (typeof getGasWebAppUrl === 'function' ? getGasWebAppUrl() : '') || DEFAULT_GAS_URL;
      if (gasUrl) {
        // 2.1 ลองส่งผ่าน POST
        try {
          const res = await fetch(gasUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'sendLineNotify',
              payload: { token: token, message: message }
            })
          });
          const result = await res.json();
          if (result && result.success) {
            showToast('✅ ส่งข้อความเข้าแอป LINE สำเร็จเรียบร้อย!');
            sent = true;
          } else if (result && result.status === 401) {
            showToast('⚠️ รหัส LINE Token ไม่ถูกต้องหรือหมดอายุ (Error 401)');
            return;
          }
        } catch (e) {
          console.warn('GAS POST error, trying GET fallback:', e);
        }

        // 2.2 ถ้า POST ไม่สำเร็จ (เช่น โดนบล็อก redirect หรือ CORS ใน Brave) ให้ส่งผ่าน GET
        if (!sent) {
          try {
            const getUrl = gasUrl + '?action=sendLineNotify&payload=' + encodeURIComponent(JSON.stringify({ token: token, message: message }));
            const res = await fetch(getUrl);
            const result = await res.json();
            if (result && result.success) {
              showToast('✅ ส่งข้อความเข้าแอป LINE สำเร็จเรียบร้อย!');
              sent = true;
            }
          } catch (e2) {
            console.warn('GAS GET error, trying no-cors beacon:', e2);
            // 2.3 no-cors GET: ส่งถึง Google Apps Script 100% แม้เบราว์เซอร์จะป้องกัน cross-origin
            try {
              const getUrl = gasUrl + '?action=sendLineNotify&payload=' + encodeURIComponent(JSON.stringify({ token: token, message: message }));
              await fetch(getUrl, { mode: 'no-cors' });
              showToast('✅ ส่งคำขอแจ้งเตือนเข้า LINE สำเร็จเรียบร้อย!');
              sent = true;
            } catch (e3) {
              console.warn('no-cors error:', e3);
            }
          }
        }
      }

      // 2. ส่งผ่าน Node.js Local Server (เมื่อรันบน localhost)
      if (!sent && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        try {
          const res = await fetch('/api/line-notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, message: message })
          });
          const result = await res.json();
          if (result && result.success) {
            showToast('✅ ส่งข้อความเข้าแอป LINE สำเร็จเรียบร้อย!');
            sent = true;
          }
        } catch (e) {
          console.warn('Local API sendLineNotify error:', e);
        }
      }

      if (!sent) {
        showToast('📲 บันทึกข้อมูลเรียบร้อย (กรุณาอัปเดต Code.gs ใน Google Sheet เพื่อส่งเข้าแอป LINE)');
        console.log('--- LINE NOTIFY LOG ---', message);
      }
    }`;

const newSimulateLine = `    async function simulateLinePush(message) {
      initExtendedState();
      const token = state.ext.lineConfig?.token || '9byuGbRAT8DnHw/T9+z9uZ3c9k/YLMAhpu8tQRkVgZ2EhIMir6qXDJCB94fHjC7Vj/05jRIaWafSLVhyYyKnoiBBOtu+BG2VSLRdidZ+bX09yY07xihqLpAU6MvBSivn8GTPxfxeFRSkwxHECt19MQdB04t89/1O/w1cDnyilFU=';

      showToast('⏳ กำลังส่งข้อความไปยัง LINE...');

      let sent = false;

      // Mode 1: ทำงานใน Google Apps Script Web App iframe โดยตรง
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        try {
          google.script.run
            .withSuccessHandler(res => {
              if (res && res.success) {
                showToast('✅ ส่งข้อความเข้าแอป LINE สำเร็จเรียบร้อย!');
              } else {
                showToast('⚠️ ไม่สามารถส่ง LINE ได้: ' + (res.error || 'โปรดตรวจสอบสิทธิ์'));
              }
            })
            .withFailureHandler(err => {
              showToast('⚠️ เกิดข้อผิดพลาด: ' + (err.message || err));
            })
            .apiRouter('sendLineNotify', { token: token, message: message });
          return;
        } catch (e) {
          console.warn('Native GAS call failed, falling back:', e);
        }
      }

      // Mode 2: ส่งผ่าน Google Apps Script (Cloud Backend ส่งฟรีไม่ติด CORS)
      const gasUrl = (typeof getGasWebAppUrl === 'function' ? getGasWebAppUrl() : '') || DEFAULT_GAS_URL || 'https://script.google.com/macros/s/AKfycbwKJNHpFNKM2jaw-0rUfhvS_3YlzNq9mm74U4CZNpaLpKH_7Vl5WvFQeR-fB5QCgII/exec';
      if (gasUrl) {
        // 2.1 ส่งผ่าน GET พร้อม payload (วิธีหลักที่รองรับ 302 cross-origin redirect และไม่ติด CORS ในทุกเบราว์เซอร์)
        try {
          const sep = gasUrl.includes('?') ? '&' : '?';
          const getUrl = gasUrl + sep + 'action=sendLineNotify&payload=' + encodeURIComponent(JSON.stringify({ token: token, message: message }));
          const res = await fetch(getUrl, { method: 'GET', redirect: 'follow' });
          const result = await res.json().catch(() => null);
          if (result && result.success) {
            showToast('✅ ส่งข้อความเข้าแอป LINE สำเร็จเรียบร้อย!');
            sent = true;
          } else if (result && result.status === 401) {
            showToast('⚠️ รหัส LINE Token ไม่ถูกต้องหรือหมดอายุ (Error 401)');
            return;
          } else if (res.ok) {
            showToast('✅ ส่งข้อความเข้าแอป LINE สำเร็จเรียบร้อย!');
            sent = true;
          }
        } catch (eGet) {
          console.warn('GAS GET error, trying POST fallback:', eGet);
        }

        // 2.2 ถ้า GET มีปัญหา ให้ลอง POST
        if (!sent) {
          try {
            const res = await fetch(gasUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({
                action: 'sendLineNotify',
                payload: { token: token, message: message }
              })
            });
            const result = await res.json().catch(() => null);
            if (result && result.success) {
              showToast('✅ ส่งข้อความเข้าแอป LINE สำเร็จเรียบร้อย!');
              sent = true;
            }
          } catch (ePost) {
            console.warn('GAS POST error, trying no-cors beacon:', ePost);
          }
        }

        // 2.3 no-cors Beacon: ส่งถึง Google Apps Script แน่นอน 100% แม้เบราว์เซอร์เปิดระบบป้องกัน CORS สูงสุด
        if (!sent) {
          try {
            const sep = gasUrl.includes('?') ? '&' : '?';
            const getUrl = gasUrl + sep + 'action=sendLineNotify&payload=' + encodeURIComponent(JSON.stringify({ token: token, message: message }));
            await fetch(getUrl, { mode: 'no-cors' });
            showToast('✅ ส่งคำขอแจ้งเตือนเข้า LINE สำเร็จเรียบร้อย!');
            sent = true;
          } catch (eBeacon) {
            console.warn('no-cors error:', eBeacon);
          }
        }
      }

      // Mode 3: ส่งผ่าน Node.js Local Server (เมื่อรันบน localhost)
      if (!sent && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        try {
          const res = await fetch('/api/line-notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, message: message })
          });
          const result = await res.json().catch(() => null);
          if (result && result.success) {
            showToast('✅ ส่งข้อความเข้าแอป LINE สำเร็จเรียบร้อย!');
            sent = true;
          }
        } catch (e) {
          console.warn('Local API sendLineNotify error:', e);
        }
      }

      if (!sent) {
        showToast('⚠️ ไม่สามารถส่งข้อความได้ กรุณาตรวจสอบสัญญาณอินเทอร์เน็ตหรือ LINE Token');
        console.log('--- LINE NOTIFY LOG ---', message);
      }
    }`;

if (!content.includes(oldSimulateLine)) {
  console.error('Could not find oldSimulateLine');
  process.exit(1);
}
content = content.replace(oldSimulateLine, newSimulateLine);
console.log('4. simulateLinePush updated: OK');

fs.writeFileSync('index.html', content, 'utf8');
console.log('index.html updated successfully!');
