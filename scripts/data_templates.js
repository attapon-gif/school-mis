// scripts/data_templates.js
// Mock data and state definitions for all 16 new modules

function getDataJs() {
  return `
    // DEFAULT STATE FOR 16 NEW MODULES
    const DEFAULT_EXT_STATE = {
      // 1. Academic Calendar
      academicCalendar: [
        { id: 'CAL001', title: 'ประชุมเตรียมความพร้อมเปิดภาคเรียนที่ 1', date: '2026-10-15', time: '09:00 - 12:00', location: 'ห้องประชุมเพชรพิทยา', owner: 'ครูสมใจ สดใส', priority: 'high', notifyLine: true, notified: true },
        { id: 'CAL002', title: 'การนิเทศการจัดการเรียนรู้ Active Learning ครั้งที่ 1', date: '2026-10-22', time: '08:30 - 15:30', location: 'อาคารเรียน 1-2', owner: 'ศน.สายใจ ชำนาญคิด', priority: 'medium', notifyLine: true, notified: false },
        { id: 'CAL003', title: 'สอบวัดผลกลางภาคเรียนที่ 1/2569', date: '2026-11-05', time: '08:30 - 15:00', location: 'ทุกห้องเรียน', owner: 'ฝ่ายวัดผลและประเมินผล', priority: 'urgent', notifyLine: true, notified: false },
        { id: 'CAL004', title: 'กิจกรรมวันภาษาไทยแห่งชาติและการแข่งขันทักษะ', date: '2026-11-18', time: '08:30 - 14:00', location: 'หอประชุมใหญ่', owner: 'กลุ่มสาระฯ ภาษาไทย', priority: 'normal', notifyLine: false, notified: false }
      ],
      lineConfig: {
        token: 'LINE_NOTIFY_DEMO_TOKEN_FM_STUDIO',
        webhookUrl: 'https://notify-api.line.me/api/notify',
        channelName: 'กลุ่มวิชาการโรงเรียนฝันใหม่ (สพฐ.)',
        status: 'connected',
        lastSent: '2026-10-10 08:30'
      },

      // 2. Daily Attendance & Routines (4-in-1)
      dailyAttendance: {
        currentDate: new Date().toISOString().split('T')[0],
        currentClass: 'ม.1/1',
        records: [
          { studentId: 'S67001', name: 'ด.ช.ณัฐพล บุญรอด', number: 1, flag: 'present', periodAll: true, lunch: true, milk: true, brushTeeth: true, remark: '' },
          { studentId: 'S67002', name: 'ด.ญ.กัญญาภัค สุขใจ', number: 2, flag: 'present', periodAll: true, lunch: true, milk: true, brushTeeth: true, remark: '' },
          { studentId: 'S67003', name: 'ด.ช.ธนกฤต ชัยชนะ', number: 3, flag: 'late', periodAll: true, lunch: true, milk: true, brushTeeth: true, remark: 'มาสาย 15 นาที' },
          { studentId: 'S67004', name: 'ด.ญ.พิมพ์ชนก แสนสุข', number: 4, flag: 'leave', periodAll: false, lunch: false, milk: false, brushTeeth: false, remark: 'ลาป่วยมีใบรับรองแพทย์' },
          { studentId: 'S67005', name: 'ด.ช.ภานุพงศ์ ทองคำ', number: 5, flag: 'present', periodAll: true, lunch: true, milk: true, brushTeeth: true, remark: '' },
          { studentId: 'S67006', name: 'ด.ช.อัครเดช กล้าหาญ', number: 6, flag: 'absent', periodAll: false, lunch: false, milk: false, brushTeeth: false, remark: 'ขาดเรียน ครูประจำชั้นโทรติดตาม' }
        ]
      },

      // 3. BMI & Nutrition Records
      bmiRecords: [
        { studentId: 'S67001', name: 'ด.ช.ณัฐพล บุญรอด', class: 'ม.1/1', number: 1, weight: 45.5, height: 156, term: '1/2569', bmi: 18.7, nutritionStatus: 'สมส่วน', heightStatus: 'สูงตามเกณฑ์' },
        { studentId: 'S67002', name: 'ด.ญ.กัญญาภัค สุขใจ', class: 'ม.1/1', number: 2, weight: 41.0, height: 152, term: '1/2569', bmi: 17.7, nutritionStatus: 'สมส่วน', heightStatus: 'สูงตามเกณฑ์' },
        { studentId: 'S67003', name: 'ด.ช.ธนกฤต ชัยชนะ', class: 'ม.1/1', number: 3, weight: 64.0, height: 158, term: '1/2569', bmi: 25.6, nutritionStatus: 'เริ่มอ้วน', heightStatus: 'สูงตามเกณฑ์' },
        { studentId: 'S67004', name: 'ด.ญ.พิมพ์ชนก แสนสุข', class: 'ม.1/1', number: 4, weight: 34.5, height: 148, term: '1/2569', bmi: 15.8, nutritionStatus: 'ค่อนข้างผอม', heightStatus: 'ค่อนข้างเตี้ย' },
        { studentId: 'S67005', name: 'ด.ช.ภานุพงศ์ ทองคำ', class: 'ม.1/1', number: 5, weight: 48.0, height: 160, term: '1/2569', bmi: 18.8, nutritionStatus: 'สมส่วน', heightStatus: 'สูงตามเกณฑ์' },
        { studentId: 'S67006', name: 'ด.ช.อัครเดช กล้าหาญ', class: 'ม.1/1', number: 6, weight: 70.0, height: 155, term: '1/2569', bmi: 29.1, nutritionStatus: 'อ้วน', heightStatus: 'สูงตามเกณฑ์' }
      ],

      // 4. Student Savings
      savingsRecords: [
        { id: 'SAV001', studentId: 'S67001', name: 'ด.ช.ณัฐพล บุญรอด', class: 'ม.1/1', number: 1, balance: 1450, lastDate: '2026-10-09', lastType: 'deposit', lastAmount: 50 },
        { id: 'SAV002', studentId: 'S67002', name: 'ด.ญ.กัญญาภัค สุขใจ', class: 'ม.1/1', number: 2, balance: 2200, lastDate: '2026-10-08', lastType: 'deposit', lastAmount: 100 },
        { id: 'SAV003', studentId: 'S67003', name: 'ด.ช.ธนกฤต ชัยชนะ', class: 'ม.1/1', number: 3, balance: 800, lastDate: '2026-10-07', lastType: 'deposit', lastAmount: 40 },
        { id: 'SAV004', studentId: 'S67004', name: 'ด.ญ.พิมพ์ชนก แสนสุข', class: 'ม.1/1', number: 4, balance: 3100, lastDate: '2026-10-09', lastType: 'deposit', lastAmount: 50 },
        { id: 'SAV005', studentId: 'S67005', name: 'ด.ช.ภานุพงศ์ ทองคำ', class: 'ม.1/1', number: 5, balance: 950, lastDate: '2026-10-05', lastType: 'withdraw', lastAmount: 100 },
        { id: 'SAV006', studentId: 'S67006', name: 'ด.ช.อัครเดช กล้าหาญ', class: 'ม.1/1', number: 6, balance: 1200, lastDate: '2026-10-09', lastType: 'deposit', lastAmount: 20 }
      ],
      savingsLogs: [
        { id: 'LOG001', date: '2026-10-09', studentId: 'S67001', name: 'ด.ช.ณัฐพล บุญรอด', type: 'deposit', amount: 50, recordedBy: 'ครูสมใจ สดใส' },
        { id: 'LOG002', date: '2026-10-09', studentId: 'S67004', name: 'ด.ญ.พิมพ์ชนก แสนสุข', type: 'deposit', amount: 50, recordedBy: 'ครูสมใจ สดใส' }
      ],

      // 5. DMC Student Database & Locker Tags
      dmcStudents: [
        { dmcId: '1040520001', studentId: 'S67001', citizenId: '1409900123451', title: 'ด.ช.', firstName: 'ณัฐพล', lastName: 'บุญรอด', gender: 'ชาย', classroom: 'ม.1/1', number: 1, birthDate: '2556-04-12', parentName: 'นายประเสริฐ บุญรอด', phone: '081-2345678', lockerNo: 'L-101', status: 'กำลังศึกษา' },
        { dmcId: '1040520002', studentId: 'S67002', citizenId: '1409900123452', title: 'ด.ญ.', firstName: 'กัญญาภัค', lastName: 'สุขใจ', gender: 'หญิง', classroom: 'ม.1/1', number: 2, birthDate: '2556-08-23', parentName: 'นางมาลี สุขใจ', phone: '089-8765432', lockerNo: 'L-102', status: 'กำลังศึกษา' },
        { dmcId: '1040520003', studentId: 'S67003', citizenId: '1409900123453', title: 'ด.ช.', firstName: 'ธนกฤต', lastName: 'ชัยชนะ', gender: 'ชาย', classroom: 'ม.1/1', number: 3, birthDate: '2556-01-19', parentName: 'นายสมบัติ ชัยชนะ', phone: '086-1122334', lockerNo: 'L-103', status: 'กำลังศึกษา' },
        { dmcId: '1040520004', studentId: 'S67004', citizenId: '1409900123454', title: 'ด.ญ.', firstName: 'พิมพ์ชนก', lastName: 'แสนสุข', gender: 'หญิง', classroom: 'ม.1/1', number: 4, birthDate: '2556-11-05', parentName: 'นางสุภาพร แสนสุข', phone: '087-9988776', lockerNo: 'L-104', status: 'กำลังศึกษา' },
        { dmcId: '1040520005', studentId: 'S67005', citizenId: '1409900123455', title: 'ด.ช.', firstName: 'ภานุพงศ์', lastName: 'ทองคำ', gender: 'ชาย', classroom: 'ม.1/1', number: 5, birthDate: '2556-03-30', parentName: 'นายทองดี ทองคำ', phone: '084-5566778', lockerNo: 'L-105', status: 'กำลังศึกษา' },
        { dmcId: '1040520006', studentId: 'S67006', citizenId: '1409900123456', title: 'ด.ช.', firstName: 'อัครเดช', lastName: 'กล้าหาญ', gender: 'ชาย', classroom: 'ม.1/1', number: 6, birthDate: '2556-06-15', parentName: 'นายชัยยุทธ กล้าหาญ', phone: '082-3344556', lockerNo: 'L-106', status: 'กำลังศึกษา' }
      ],

      // 6. Online Home Visits (OBEC Form)
      homeVisits: [
        {
          id: 'HV001',
          studentId: 'S67001',
          name: 'ด.ช.ณัฐพล บุญรอด',
          class: 'ม.1/1',
          visitDate: '2026-09-20',
          teacherName: 'ครูสมใจ สดใส',
          parentName: 'นายประเสริฐ บุญรอด',
          familyStatus: 'บิดามารดาอยู่ร่วมกัน',
          housingType: 'บ้านตนเอง มั่นคงแข็งแรง',
          incomeMonthly: 18000,
          commuteMethod: 'เดินเท้า / จักรยาน',
          hobby: 'ช่วยงานบ้าน และทำการบ้าน',
          problemObserved: 'ขาดแคลนอุปกรณ์คอมพิวเตอร์สำหรับการสืบค้น',
          assistanceNeeded: 'ขอรับทุนการศึกษาเพื่อการศึกษาต่อเนื่อง',
          teacherSigned: true,
          parentSigned: true,
          photoHouseUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80',
          photoFamilyUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 'HV002',
          studentId: 'S67003',
          name: 'ด.ช.ธนกฤต ชัยชนะ',
          class: 'ม.1/1',
          visitDate: '2026-09-22',
          teacherName: 'ครูสมใจ สดใส',
          parentName: 'นายสมบัติ ชัยชนะ',
          familyStatus: 'บิดามารดาอยู่ร่วมกัน',
          housingType: 'บ้านพักอาศัยตนเอง',
          incomeMonthly: 25000,
          commuteMethod: 'ผู้ปกครองมาส่งโดยรถจักรยานยนต์',
          hobby: 'เล่นกีฬาฟุตบอล',
          problemObserved: 'พฤติกรรมการเล่นเกมในช่วงดึก',
          assistanceNeeded: 'ให้คำปรึกษาด้านการจัดสรรเวลาเรียน',
          teacherSigned: true,
          parentSigned: true,
          photoHouseUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80',
          photoFamilyUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80'
        }
      ],

      // 7. One-Page Classroom Action Research (CAR)
      researchItems: [
        {
          id: 'RES001',
          title: 'การพัฒนาผลสัมฤทธิ์ทางการอ่านจับใจความด้วยชุดกิจกรรม Active Learning สำหรับนักเรียนชั้น ม.1',
          teacherName: 'ครูสมใจ สดใส',
          subject: 'ภาษาไทย 1',
          classroom: 'ม.1/1',
          targetGroup: 'นักเรียนชั้น ม.1/1 จำนวน 35 คน',
          problem: 'นักเรียนมีทักษะการจับใจความสำคัญของเรื่องที่อ่านต่ำกว่าเกณฑ์ร้อยละ 60',
          innovation: 'ชุดกิจกรรมแบบฝึกทักษะการอ่านจับใจความ 5 ขั้น ร่วมกับเกมคำศัพท์ดิจิทัล',
          results: 'ผลสัมฤทธิ์ทางการอ่านจับใจความหลังเรียนสูงกว่าก่อนเรียนอย่างมีนัยสำคัญทางสถิติที่ระดับ .05 โดยมีคะแนนเฉลี่ยคิดเป็นร้อยละ 82.4',
          submitDate: '2026-09-30',
          status: 'approved',
          approvedBy: 'นายอรรถพล ฉาไธสง (ผอ.)'
        },
        {
          id: 'RES002',
          title: 'การแก้ปัญหาการส่งงานไม่ตรงเวลาด้วยระบบติดตามดิจิทัลในรายวิชาวิทยาศาสตร์',
          teacherName: 'ครูสมหวัง ชำนาญคิด',
          subject: 'วิทยาศาสตร์ 1',
          classroom: 'ม.2/1',
          targetGroup: 'นักเรียนชั้น ม.2/1 จำนวน 32 คน',
          problem: 'นักเรียนส่งการบ้านและการทดลองล่าช้าเกินกำหนดมากกว่าร้อยละ 40',
          innovation: 'การใช้ Line Alert และตารางเตือนภาระงานแบบ Gamification',
          results: 'อัตราการส่งงานตรงเวลาเพิ่มขึ้นเป็นร้อยละ 93.75 ภายในระยะเวลา 4 สัปดาห์',
          submitDate: '2026-10-02',
          status: 'pending',
          approvedBy: '-'
        }
      ],

      // 8. Academic Media & Form Downloads
      academicDownloads: [
        { id: 'DL001', title: 'แบบฟอร์ม ปพ.5 (ฉบับมาตรฐาน สพฐ. 2569)', category: 'แบบฟอร์ม ปพ.', fileType: 'XLSX', size: '2.4 MB', updated: '2026-10-01', downloads: 142, downloadUrl: '#' },
        { id: 'DL002', title: 'คู่มือการจัดทำแผนการจัดการเรียนรู้เชิงรุก (Active Learning)', category: 'คู่มือหลักสูตร', fileType: 'PDF', size: '5.8 MB', updated: '2026-09-25', downloads: 89, downloadUrl: '#' },
        { id: 'DL003', title: 'แบบฟอร์มรายงานวิจัยในชั้นเรียนหน้าเดียว (CAR Template)', category: 'วิจัยและนวัตกรรม', fileType: 'DOCX', size: '420 KB', updated: '2026-09-18', downloads: 115, downloadUrl: '#' },
        { id: 'DL004', title: 'แบบบันทึกการประเมินสมรรถนะสำคัญและคุณลักษณะอันพึงประสงค์ 8 ประการ', category: 'แบบฟอร์ม ปพ.', fileType: 'PDF', size: '1.2 MB', updated: '2026-08-30', downloads: 68, downloadUrl: '#' },
        { id: 'DL005', title: 'เกณฑ์การวัดและประเมินผลการเรียนรู้ตามหลักสูตรแกนกลาง 2551 (ปรับปรุง 2560)', category: 'ระเบียบวิชาการ', fileType: 'PDF', size: '3.1 MB', updated: '2026-08-15', downloads: 74, downloadUrl: '#' }
      ],

      // 9. Online Clubs
      clubs: [
        { id: 'CLB001', name: 'ชุมนุมหุ่นยนต์และปัญญาประดิษฐ์ (AI & Robotics)', advisor: 'ครูสมหวัง ชำนาญคิด', room: 'ห้องปฏิบัติการคอมพิวเตอร์ 1', maxMembers: 30, currentMembers: 28, grades: 'ม.1 - ม.3', desc: 'เรียนรู้การเขียนโค้ดและสร้างหุ่นยนต์เบื้องต้น' },
        { id: 'CLB002', name: 'ชุมนุมภาษาอังกฤษเพื่อการสื่อสาร (English Club)', advisor: 'ครูมาริสา สดใส', room: 'ห้อง Sound Lab', maxMembers: 35, currentMembers: 35, grades: 'ป.4 - ม.3', desc: 'ฝึกสนทนาภาษาอังกฤษกับเจ้าของภาษาและเกมคำศัพท์' },
        { id: 'CLB003', name: 'ชุมนุมดนตรีสากลและวงโยธวาทิต', advisor: 'ครูวีระ ศิลป์ประสิทธิ์', room: 'ห้องดนตรีสากล อาคาร 3', maxMembers: 25, currentMembers: 21, grades: 'ม.1 - ม.3', desc: 'ฝึกซ้อมเครื่องเป่า กลอง และการเล่นรวมวงดนตรี' },
        { id: 'CLB004', name: 'ชุมนุมเกษตรอินทรีย์และเศรษฐกิจพอเพียง', advisor: 'ครูประสิทธิ์ สวนสวย', room: 'แปลงเกษตรโรงเรียน', maxMembers: 30, currentMembers: 19, grades: 'ป.1 - ม.3', desc: 'ปลูกผักไฮโดรโปนิกส์และการทำปุ๋ยหมักชีวภาพ' },
        { id: 'CLB005', name: 'ชุมนุมนักพากย์และผลิตสื่อดิจิทัล', advisor: 'ครูอรรถพล ฉาไธสง', room: 'ห้อง Studio อาคาร 1', maxMembers: 20, currentMembers: 20, grades: 'ม.1 - ม.3', desc: 'ตัดต่อวิดีโอ การถ่ายทำ และการพากย์เสียง' }
      ],
      clubMembers: [
        { studentId: 'S67001', name: 'ด.ช.ณัฐพล บุญรอด', class: 'ม.1/1', clubId: 'CLB001', attendCount: 18, totalHours: 20, status: 'ผ่าน' },
        { studentId: 'S67002', name: 'ด.ญ.กัญญาภัค สุขใจ', class: 'ม.1/1', clubId: 'CLB002', attendCount: 20, totalHours: 20, status: 'ผ่าน' },
        { studentId: 'S67003', name: 'ด.ช.ธนกฤต ชัยชนะ', class: 'ม.1/1', clubId: 'CLB001', attendCount: 16, totalHours: 20, status: 'ผ่าน' },
        { studentId: 'S67004', name: 'ด.ญ.พิมพ์ชนก แสนสุข', class: 'ม.1/1', clubId: 'CLB005', attendCount: 19, totalHours: 20, status: 'ผ่าน' }
      ],

      // 10. Scouts & Girl Guides
      scoutTroops: [
        { id: 'SCT001', name: 'กองลูกเสือสามัญรุ่นใหญ่ กองที่ 1 (ม.1)', level: 'ลูกเสือสามัญรุ่นใหญ่', totalMembers: 45, master: 'ครูสมหวัง ชำนาญคิด', day: 'วันพฤหัสบดี คาบ 6' },
        { id: 'SCT002', name: 'กองเนตรนารีสามัญรุ่นใหญ่ กองที่ 1 (ม.1)', level: 'เนตรนารีสามัญรุ่นใหญ่', totalMembers: 42, master: 'ครูสมใจ สดใส', day: 'วันพฤหัสบดี คาบ 6' }
      ],
      scoutAttendance: [
        { date: '2026-10-08', troopId: 'SCT001', topic: 'การผูกเงื่อนเชือกเบื้องต้น (เงื่อนพิรอด, เงื่อนขัดสมาธิ)', present: 43, absent: 2, passed: true },
        { date: '2026-10-01', troopId: 'SCT001', topic: 'ระเบียบแถวและสัญญาณมือลูกเสือ', present: 44, absent: 1, passed: true }
      ],

      // 11. Midterm & Final Exam Scheduler
      examSchedules: [
        { id: 'EX001', type: 'midterm', term: '1/2569', date: '2026-11-05', period: 'คาบ 1 (08:30 - 09:30)', classroom: 'ม.1/1', subjectCode: 'ท21101', subjectName: 'ภาษาไทย 1', room: 'ห้อง 111', proctor1: 'ครูสมหวัง ชำนาญคิด', proctor2: 'ครูสายใจ รักเรียน' },
        { id: 'EX002', type: 'midterm', term: '1/2569', date: '2026-11-05', period: 'คาบ 2 (09:40 - 10:40)', classroom: 'ม.1/1', subjectCode: 'ค21101', subjectName: 'คณิตศาสตร์ 1', room: 'ห้อง 111', proctor1: 'ครูสมใจ สดใส', proctor2: 'ครูปิติ ยินดี' },
        { id: 'EX003', type: 'midterm', term: '1/2569', date: '2026-11-05', period: 'คาบ 3 (10:50 - 11:50)', classroom: 'ม.1/1', subjectCode: 'ว21101', subjectName: 'วิทยาศาสตร์ 1', room: 'ห้อง 111', proctor1: 'ครูมาลี มีสุข', proctor2: 'ครูสายใจ รักเรียน' },
        { id: 'EX004', type: 'midterm', term: '1/2569', date: '2026-11-05', period: 'คาบ 1 (08:30 - 09:30)', classroom: 'ม.2/1', subjectCode: 'ค22101', subjectName: 'คณิตศาสตร์ 3', room: 'ห้อง 112', proctor1: 'ครูปิติ ยินดี', proctor2: 'ครูสมใจ สดใส' }
      ],

      // 12. Guidance & Behavior Merit/Demerit System
      behaviorRecords: [
        { id: 'BEH001', studentId: 'S67001', name: 'ด.ช.ณัฐพล บุญรอด', class: 'ม.1/1', date: '2026-10-05', type: 'merit', category: 'จิตอาสาบำเพ็ญประโยชน์', score: 5, recordedBy: 'ครูสมใจ สดใส', remark: 'ช่วยจัดเตรียมสถานที่หอประชุม' },
        { id: 'BEH002', studentId: 'S67003', name: 'ด.ช.ธนกฤต ชัยชนะ', class: 'ม.1/1', date: '2026-10-07', type: 'demerit', category: 'มาสายเกิน 3 ครั้งในสัปดาห์', score: -5, recordedBy: 'ครูเวรประจำวัน', remark: 'ตักเตือนและบันทึกประวัติ' },
        { id: 'BEH003', studentId: 'S67004', name: 'ด.ญ.พิมพ์ชนก แสนสุข', class: 'ม.1/1', date: '2026-10-08', type: 'merit', category: 'ความซื่อสัตย์สุจริต', score: 10, recordedBy: 'ครูสมหวัง ชำนาญคิด', remark: 'เก็บกระเป๋าสตางค์ส่งคืนเจ้าของ' },
        { id: 'BEH004', studentId: 'S67006', name: 'ด.ช.อัครเดช กล้าหาญ', class: 'ม.1/1', date: '2026-10-09', type: 'demerit', category: 'แต่งกายผิดระเบียบสถานศึกษา', score: -5, recordedBy: 'ครูฝ่ายปกครอง', remark: 'ไม่ใส่เข็มขัดและเสื้อหลุดนอกกางเกง' }
      ],

      // 13. Comprehensive Phor Phor 5 (ปพ.5)
      pp5Settings: {
        ratioCollected: 50,
        ratioMidterm: 20,
        ratioFinal: 30,
        minAttendancePercent: 80
      },
      pp5Scores: [
        {
          studentId: 'S67001',
          name: 'ด.ช.ณัฐพล บุญรอด',
          number: 1,
          classroom: 'ม.1/1',
          subjectCode: 'ท21101',
          subjectName: 'ภาษาไทย 1',
          totalPeriods: 40,
          attendedPeriods: 39,
          collectedScore: 44, // เต็ม 50
          midtermScore: 17,   // เต็ม 20
          finalScore: 26,     // เต็ม 30
          totalScore: 87,     // รวม 100
          grade: '4',
          desirableTraits: [3, 3, 3, 3, 3, 3, 3, 3], // 8 ข้อ (เต็ม 3)
          traitsAverage: 3,
          readingThinkingWriting: 3 // อ่านคิดวิเคราะห์ (3: ดีเยี่ยม)
        },
        {
          studentId: 'S67002',
          name: 'ด.ญ.กัญญาภัค สุขใจ',
          number: 2,
          classroom: 'ม.1/1',
          subjectCode: 'ท21101',
          subjectName: 'ภาษาไทย 1',
          totalPeriods: 40,
          attendedPeriods: 40,
          collectedScore: 47,
          midtermScore: 18,
          finalScore: 28,
          totalScore: 93,
          grade: '4',
          desirableTraits: [3, 3, 3, 3, 3, 3, 3, 3],
          traitsAverage: 3,
          readingThinkingWriting: 3
        },
        {
          studentId: 'S67003',
          name: 'ด.ช.ธนกฤต ชัยชนะ',
          number: 3,
          classroom: 'ม.1/1',
          subjectCode: 'ท21101',
          subjectName: 'ภาษาไทย 1',
          totalPeriods: 40,
          attendedPeriods: 36,
          collectedScore: 32,
          midtermScore: 12,
          finalScore: 18,
          totalScore: 62,
          grade: '2',
          desirableTraits: [2, 2, 2, 2, 2, 2, 2, 2],
          traitsAverage: 2,
          readingThinkingWriting: 2
        },
        {
          studentId: 'S67004',
          name: 'ด.ญ.พิมพ์ชนก แสนสุข',
          number: 4,
          classroom: 'ม.1/1',
          subjectCode: 'ท21101',
          subjectName: 'ภาษาไทย 1',
          totalPeriods: 40,
          attendedPeriods: 38,
          collectedScore: 39,
          midtermScore: 15,
          finalScore: 24,
          totalScore: 78,
          grade: '3.5',
          desirableTraits: [3, 3, 3, 3, 3, 3, 3, 3],
          traitsAverage: 3,
          readingThinkingWriting: 3
        },
        {
          studentId: 'S67006',
          name: 'ด.ช.อัครเดช กล้าหาญ',
          number: 6,
          classroom: 'ม.1/1',
          subjectCode: 'ท21101',
          subjectName: 'ภาษาไทย 1',
          totalPeriods: 40,
          attendedPeriods: 30, // 75% ติด มส
          collectedScore: 20,
          midtermScore: 8,
          finalScore: 12,
          totalScore: 40,
          grade: '0',
          desirableTraits: [1, 1, 1, 1, 1, 1, 1, 1],
          traitsAverage: 1,
          readingThinkingWriting: 1
        }
      ],

      // 14. Online Remedial Requests (0, ร, มส)
      remedialRequests: [
        {
          id: 'REM001',
          studentId: 'S67006',
          name: 'ด.ช.อัครเดช กล้าหาญ',
          classroom: 'ม.1/1',
          courseCode: 'ท21101',
          courseName: 'ภาษาไทย 1',
          originalGrade: '0',
          teacherName: 'ครูสมใจ สดใส',
          requestDate: '2026-10-02',
          assignedTask: 'ทำแบบฝึกหัดทบทวนวรรณคดี 3 บท และคัดลายมือ 5 หน้า',
          taskDueDate: '2026-10-18',
          teacherChecked: true,     // ครูประจำวิชาติ๊กว่าส่งงานแล้ว
          adminApproved: false,    // แอดมินเป็นผู้อนุมัติเปลี่ยนเกรด
          newGrade: '1',
          status: 'teacher_passed', // waiting_task -> working -> teacher_passed -> admin_approved
          resolvedDate: '-'
        },
        {
          id: 'REM002',
          studentId: 'S67003',
          name: 'ด.ช.ธนกฤต ชัยชนะ',
          classroom: 'ม.1/1',
          courseCode: 'ค21101',
          courseName: 'คณิตศาสตร์ 1',
          originalGrade: 'ร',
          teacherName: 'ครูสมหวัง ชำนาญคิด',
          requestDate: '2026-10-04',
          assignedTask: 'ส่งสมุดแบบฝึกหัดเรื่องจำนวนเต็มและเลขยกกำลัง',
          taskDueDate: '2026-10-15',
          teacherChecked: false,
          adminApproved: false,
          newGrade: '1',
          status: 'working',
          resolvedDate: '-'
        }
      ],

      // 15. IEP & Inclusive Education (9 Disability Types)
      iepDisabilityTypes: [
        '1. บุคคลที่มีความบกพร่องทางการเห็น',
        '2. บุคคลที่มีความบกพร่องทางการได้ยิน',
        '3. บุคคลที่มีความบกพร่องทางสติปัญญา',
        '4. บุคคลที่มีความบกพร่องทางร่างกาย หรือการเคลื่อนไหว หรือสุขภาพ',
        '5. บุคคลที่มีความบกพร่องทางการเรียนรู้ (LD)',
        '6. บุคคลที่มีความบกพร่องทางการพูดและภาษา',
        '7. บุคคลที่มีความบกพร่องทางพฤติกรรม หรืออารมณ์',
        '8. บุคคลออทิสติก',
        '9. บุคคลพิการซ้อน'
      ],
      iepStudents: [
        {
          id: 'IEP001',
          studentId: 'S67008',
          name: 'ด.ช.ธีรพัฒน์ สว่างใจ',
          classroom: 'ม.1/1',
          disabilityType: '5. บุคคลที่มีความบกพร่องทางการเรียนรู้ (LD)',
          specialNeed: 'ด้านการอ่านและการเขียนสะกดคำ',
          advisor: 'ครูสมใจ สดใส',
          iepStatus: 'มีแผน IEP พร้อมดำเนินการ',
          evalResult: 'กำลังพัฒนาตามแผน',
          iepFileUrl: '#'
        },
        {
          id: 'IEP002',
          studentId: 'S67015',
          name: 'ด.ญ.วริศรา นุ่มนวล',
          classroom: 'ป.5/1',
          disabilityType: '4. บุคคลที่มีความบกพร่องทางร่างกาย หรือการเคลื่อนไหว หรือสุขภาพ',
          specialNeed: 'ใช้วิลแชร์ ต้องการสิ่งอำนวยความสะดวกทางลาด',
          advisor: 'ครูสมหวัง ชำนาญคิด',
          iepStatus: 'มีแผน IEP พร้อมดำเนินการ',
          evalResult: 'ผ่านเกณฑ์เป้าหมายรายภาค',
          iepFileUrl: '#'
        }
      ],

      // 16. Student Transfers & LINE Alert
      studentTransfers: [
        {
          id: 'TRF001',
          type: 'transfer_in', // transfer_in | transfer_out
          date: '2026-10-08',
          studentId: 'S67035',
          name: 'ด.ช.กิตติพงษ์ ศรีสุข',
          classroom: 'ม.2/1',
          fromSchool: 'โรงเรียนบ้านหนองบัวใหญ่ สพป.นภ.1',
          toSchool: 'โรงเรียนฝันใหม่',
          reason: 'ผู้ปกครองย้ายถิ่นฐานประกอบอาชีพ',
          docNumber: 'ศธ 04052/1125',
          lineAlertSent: true
        },
        {
          id: 'TRF002',
          type: 'transfer_out',
          date: '2026-09-28',
          studentId: 'S67020',
          name: 'ด.ญ.สุพรรษา เจริญผล',
          classroom: 'ม.1/2',
          fromSchool: 'โรงเรียนฝันใหม่',
          toSchool: 'โรงเรียนอนุบาลขอนแก่น สพป.ขก.1',
          reason: 'ย้ายตามผู้ปกครองรับราชการ',
          docNumber: 'ศธ 04052/1089',
          lineAlertSent: true
        }
      ]
    };
  `;
}

module.exports = { getDataJs };
