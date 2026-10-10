const fs = require('fs');
const path = require('path');

const projectDir = __dirname;
const indexPath = path.join(projectDir, 'public', 'index.html');
const standalonePath = path.join(projectDir, 'เปิดระบบทันที_Double_Click.html');
const gasIndexPath = path.join(projectDir, 'google-apps-script', 'Index.html');
const gasCodePath = path.join(projectDir, 'google-apps-script', 'Code.gs');
const base64LogoPath = path.join(projectDir, 'public', 'assets', 'logo_base64.txt');

const logoBase64 = fs.readFileSync(base64LogoPath, 'utf8').trim();
const logoDataUri = `data:image/jpeg;base64,${logoBase64}`;

let content = fs.readFileSync(indexPath, 'utf8');

// 1. Update Title
content = content.replace(
  /<title>.*?<\/title>/,
  '<title>ระบบบริหารงานวิชาการโรงเรียนฝันใหม่ (เวอร์ชัน fm)</title>'
);

// 2. Update DEFAULT_MOCK_DATA schoolInfo
content = content.replace(
  /name:\s*'โรงเรียนสาธิตวิชาการหนองบัวลำภู'/,
  "name: 'โรงเรียนฝันใหม่'"
);
content = content.replace(
  /subTitle:\s*'สำนักงานเขตพื้นที่การศึกษามัธยมศึกษา เขต 19 \(มาตรฐานสากล\)'/,
  "subTitle: 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)'"
);
content = content.replace(
  /signatureUrl:\s*'https:\/\/api\.iconify\.design\/lucide:signature\.svg'/,
  `signatureUrl: 'https://api.iconify.design/lucide:signature.svg',
        logoUrl: '${logoDataUri}',
        version: 'fm',
        developer: 'funmai studio',
        developerEmail: 'attapon@nbcc.ac.th',
        developerPhone: '062-3636031'`
);

// 3. Update Top Bar Version Badge & School Name
content = content.replace(
  /<span class="bg-blue-600 text-white font-extrabold px-2 py-0\.5 rounded text-\[11px\] shadow-sm tracking-wider uppercase">EGA\+ V2\.2<\/span>/g,
  '<span class="bg-blue-600 text-white font-extrabold px-2.5 py-0.5 rounded text-[11px] shadow-sm tracking-wider uppercase">เวอร์ชัน fm</span>'
);
content = content.replace(
  /• โรงเรียนบ้านโนนอยู่ดี \(สพฐ\.\)/g,
  '• โรงเรียนฝันใหม่ (สพฐ.)'
);

// 4. Update Header Logo & School Name
content = content.replace(
  /<img src="https:\/\/api\.iconify\.design\/lucide:graduation-cap\.svg\?color=%231e3a8a" class="w-10 h-10 object-contain" alt="School Logo">/,
  `<img id="headerSchoolLogo" src="${logoDataUri}" class="w-12 h-14 object-contain filter drop-shadow" alt="ตราโรงเรียนฝันใหม่">`
);
content = content.replace(
  /id="headerSchoolName">โรงเรียนบ้านโนนอยู่ดี<\/h1>/,
  'id="headerSchoolName">โรงเรียนฝันใหม่</h1>'
);
content = content.replace(
  /สำนักงานเขตพื้นที่การศึกษาประถมศึกษานครราชสีมา เขต 7 • สพฐ\. กระทรวงศึกษาธิการ/,
  'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน • กระทรวงศึกษาธิการ'
);

// 5. Update Tab 0 Header
content = content.replace(
  /EGA\+ V2\.2 โปรแกรมระบบจัดการผลการเรียนออนไลน์/g,
  'ระบบบริหารงานวิชาการโรงเรียนฝันใหม่ (เวอร์ชัน fm)'
);

// 6. Update general references
content = content.replace(/สำหรับ โรงเรียนบ้านโนนอยู่ดี/g, 'สำหรับ โรงเรียนฝันใหม่');
content = content.replace(/โรงเรียนบ้านโนนอยู่ดี/g, 'โรงเรียนฝันใหม่');
content = content.replace(/โรงเรียนสาธิตวิชาการ/g, 'โรงเรียนฝันใหม่');

// 7. Update Login Modal Footer
content = content.replace(
  /<div class="text-\[11px\] text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">[\s\S]*?Copyright © 2019 EDUGETA\. All rights reserved\.[\s\S]*?<\/div>/,
  `<div class="text-[11px] text-slate-500 pt-3 border-t border-slate-100 leading-relaxed text-center">
        <strong>ระบบบริหารงานวิชาการโรงเรียนฝันใหม่</strong> (เวอร์ชัน fm)<br>
        พัฒนาโดย: <strong class="text-slate-800 font-bold">funmai studio</strong><br>
        Email: <a href="mailto:attapon@nbcc.ac.th" class="text-blue-600 underline font-medium">attapon@nbcc.ac.th</a> | โทร. <a href="tel:0623636031" class="text-blue-600 font-bold">062-3636031</a><br>
        <span class="text-[10px] text-slate-400">Copyright © 2026 funmai studio. All rights reserved.</span>
      </div>`
);

// 8. Add Main Footer before </body>
const mainFooterHtml = `
  <!-- ================================================================= -->
  <!-- MAIN SITE FOOTER -->
  <!-- ================================================================= -->
  <footer class="bg-white border-t border-slate-200 mt-16 py-6 text-center text-xs text-slate-500 no-print">
    <div class="max-w-7xl mx-auto px-4 space-y-2">
      <div class="font-bold text-slate-800 text-sm flex items-center justify-center gap-2.5">
        <img src="${logoDataUri}" class="w-6 h-8 object-contain inline-block filter drop-shadow-sm" alt="ตราโรงเรียน">
        <span>โรงเรียนฝันใหม่ • ระบบบริหารงานวิชาการ (เวอร์ชัน fm)</span>
      </div>
      <p class="text-slate-600 text-xs sm:text-sm">
        พัฒนาโดย: <strong class="text-slate-900 font-bold">funmai studio</strong> &nbsp;|&nbsp; 
        Email: <a href="mailto:attapon@nbcc.ac.th" class="text-blue-600 font-medium hover:underline">attapon@nbcc.ac.th</a> &nbsp;|&nbsp; 
        โทร: <a href="tel:0623636031" class="text-blue-600 font-bold hover:underline">062-3636031</a>
      </p>
      <p class="text-[11px] text-slate-400">Copyright © 2026 funmai studio. All rights reserved.</p>
    </div>
  </footer>
`;

if (!content.includes('MAIN SITE FOOTER')) {
  content = content.replace('</body>', `${mainFooterHtml}\n</body>`);
}

// 9. Update PDF print header to include the logo
content = content.replace(
  /<div style="text-align: center; margin-bottom: 20px;">\s*<h2 style="font-size: 20px; font-weight: bold; margin: 0;">แบบรายงานผลการเรียนรู้รายบุคคล \(ปพ\.6\)<\/h2>/,
  `<div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoDataUri}" style="max-height: 75px; margin: 0 auto 8px auto; display: block;" alt="ตราโรงเรียนฝันใหม่">
            <h2 style="font-size: 20px; font-weight: bold; margin: 0;">แบบรายงานผลการเรียนรู้รายบุคคล (ปพ.6)</h2>`
);

content = content.replace(
  /<div style="font-family: 'Sarabun', sans-serif; line-height: 1\.5;">\s*<h2 style="text-align: center; font-size: 18px; font-weight: bold;">บัญชีรายชื่อนักเรียนที่มีผลการเรียนติด 0, ร, มส เพื่อดำเนินการสอบแก้ตัว<\/h2>/,
  `<div style="font-family: 'Sarabun', sans-serif; line-height: 1.5;">
          <div style="text-align: center; margin-bottom: 10px;">
            <img src="${logoDataUri}" style="max-height: 65px; margin: 0 auto 6px auto; display: block;" alt="ตราโรงเรียน">
          </div>
          <h2 style="text-align: center; font-size: 18px; font-weight: bold;">บัญชีรายชื่อนักเรียนที่มีผลการเรียนติด 0, ร, มส เพื่อดำเนินการสอบแก้ตัว</h2>`
);

// Save updated content to all three HTML files
fs.writeFileSync(indexPath, content, 'utf8');
fs.writeFileSync(standalonePath, content, 'utf8');
fs.writeFileSync(gasIndexPath, content, 'utf8');
console.log('✅ Updated public/index.html, เปิดระบบทันที_Double_Click.html, and google-apps-script/Index.html');

// 10. Update Code.gs in google-apps-script
if (fs.existsSync(gasCodePath)) {
  let gasCode = fs.readFileSync(gasCodePath, 'utf8');
  gasCode = gasCode.replace(/โรงเรียนบ้านโนนอยู่ดี/g, 'โรงเรียนฝันใหม่');
  gasCode = gasCode.replace(/โรงเรียนสาธิตวิชาการหนองบัวลำภู/g, 'โรงเรียนฝันใหม่');
  gasCode = gasCode.replace(/โรงเรียนสาธิตวิชาการ/g, 'โรงเรียนฝันใหม่');
  gasCode = gasCode.replace(/EGA\+ V2\.2/g, 'เวอร์ชัน fm');
  fs.writeFileSync(gasCodePath, gasCode, 'utf8');
  console.log('✅ Updated google-apps-script/Code.gs');
}
