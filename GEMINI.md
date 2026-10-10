# Workspace Guidelines: ระบบบริหารงานวิชาการสถานศึกษา (School Academic MIS)

โฟลเดอร์นี้เป็นโครงการพัฒนา **ระบบบริหารงานวิชาการสถานศึกษา (School Academic MIS) - เวอร์ชัน FM**
ผู้พัฒนา/เจ้าของโครงการ: **นายอรรถพล ฉาไธสง (funmai studio / วชช.หนองบัวลำภู)**

เมื่อเปิดทำงานใน Antigravity หรือทำงานร่วมกับ AI Assistant ให้ยึดถือแนวปฏิบัติดังนี้:

---

## 1. ทักษะเฉพาะทางในระบบ (Skills)
- ระบบนี้มีทักษะเฉพาะทางอยู่ที่ `.agents/skills/school-academic-mis/SKILL.md`
- ครอบคลุม 4 เสาหลัก:
  1. **ผลการเรียน & แก้ 0 ร มส**: พอร์ทัลนักเรียน, พิมพ์ ปพ.6, ระบบแก้ตัว, นำเข้ารายชื่อนักเรียนจาก Excel (.xlsx)
  2. **แผนการสอน & ลายเซ็นดิจิทัล**: แนบไฟล์แผน, ลายเซ็นดิจิทัลผู้บริหารประทับอัตโนมัติ, บันทึกหลังสอน
  3. **นิเทศภายใน**: ปฏิทินนัดหมาย, รูบริก 5 ด้าน 100 คะแนน, คลังรูปภาพ, พิมพ์รายงานนิเทศ
  4. **ตารางสอน Interactive**: ตรวจจับเวลา/ครู/ห้องชนกัน, Smart Free Teachers จัดสอนแทน, แยกสีวันไทย (จันทร์-ศุกร์), สั่งพิมพ์แนวนอน (A4 Landscape)
- ฟีเจอร์โครงสร้าง UI เพิ่มเติม:
  - **Vertical Left Sidebar**: เมนูแถบซ้ายแนวตั้ง รองรับ Mobile Toggle
  - **Authentication & Role Switching**: ระบบเข้าสู่ระบบสลับ 4 บทบาท (แอดมิน, ครู, นักเรียน, ผู้นิเทศ)

---

## 2. สถาปัตยกรรมและไฟล์สำคัญ (Project Architecture)
- **Backend**: Node.js + Express (`server.js`) พอร์ต `3000`
- **Database**: Local JSON Database (`data/db.json`) พกพาสะดวก ไม่ต้องติดตั้ง SQL Server
- **Frontend SPA**: `public/index.html`, `public/css/style.css`, `public/js/` (`app.js`, `module1_grades.js`, `module2_plans.js`, `module3_supervision.js`, `module4_timetable.js`)
- **Single-File Standalone**: `เปิดระบบทันที_Double_Click.html` (ไฟล์รวมสมบูรณ์แบบ ทำงานได้โดยไม่ต้องเปิด server.js หรือลง Node.js)
- **Cloud/GAS**: `google-apps-script/Code.gs` และ `google-apps-script/Index.html` (สำหรับรันบน Google Cloud ฟรี)

---

## 3. กฎเหล็กในการแก้ไขโค้ด (Development Guidelines)
1. **การอัปเดตไฟล์ Standalone ควบคู่เสมอ**:
   - เมื่อมีการแก้ไขฟังก์ชันหรือ UI ใน `public/index.html` หรือ `public/js/` ให้ซิงค์การเปลี่ยนแปลงไปยัง `เปิดระบบทันที_Double_Click.html` ด้วยเสมอ เพื่อให้ผู้ใช้งานสามารถดับเบิลคลิกไฟล์เดียวได้ตลอดเวลา
2. **การรักษาข้อมูลในฐานข้อมูล (`data/db.json`)**:
   - อย่าลบโครงสร้างหลักของ `data/db.json` ให้คงข้อมูลตั้งต้นที่มีคุณภาพไว้สำหรับการทดสอบ
3. **การออกแบบ UI/UX**:
   - ภาษาไทยที่สละสลวย ถูกระเบียบวิชาการสถานศึกษา
   - โทนสีและสไตล์: Modern TailwindCSS (ธีมคราม-น้ำเงิน Indigo/Slate)
   - ฟอนต์: Prompt / TH Sarabun PSK สบายตาและเป็นทางการ
   - รองรับ Responsive บนมือถือ แท็บเล็ต และจอคอมพิวเตอร์
