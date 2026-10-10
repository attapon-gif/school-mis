const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Helper to read DB
function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return null;
  }
}

// Helper to write DB
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

// Ensure upload folders exist
const uploadDirs = ['uploads/signatures', 'uploads/photos', 'uploads/plans'];
uploadDirs.forEach(dir => {
  const p = path.join(__dirname, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'signature') cb(null, path.join(__dirname, 'uploads/signatures'));
    else if (file.fieldname === 'photo') cb(null, path.join(__dirname, 'uploads/photos'));
    else cb(null, path.join(__dirname, 'uploads/plans'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});
const upload = multer({ storage });

// -------------------------------------------------------------
// SYSTEM & META APIS
// -------------------------------------------------------------
app.get('/api/info', (req, res) => {
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'DB read error' });
  res.json({
    schoolInfo: db.schoolInfo,
    teachers: db.teachers,
    classrooms: db.classrooms,
    rooms: db.rooms,
    periods: db.periods,
    days: db.days
  });
});

app.post('/api/info', (req, res) => {
  const db = readDb();
  db.schoolInfo = { ...db.schoolInfo, ...req.body };
  writeDb(db);
  res.json({ success: true, schoolInfo: db.schoolInfo });
});

// -------------------------------------------------------------
// MODULE 1: ผลการเรียน & สรุป 0, ร, มส
// -------------------------------------------------------------
// Student login to view personal grades
app.post('/api/student/login', (req, res) => {
  const { studentId, citizenId } = req.body;
  const db = readDb();
  const student = db.students.find(s => s.id === studentId.trim() && s.citizenId === citizenId.trim());
  if (!student) {
    return res.status(401).json({ error: 'ไม่พบข้อมูลนักเรียน หรือเลขประจำตัวประชาชนไม่ถูกต้อง' });
  }

  const studentGrades = db.grades.filter(g => g.studentId === student.id);
  
  // Calculate GPA
  let totalCredits = 0;
  let totalPoints = 0;
  studentGrades.forEach(g => {
    const gradeNum = parseFloat(g.grade);
    if (!isNaN(gradeNum)) {
      totalCredits += g.credits;
      totalPoints += gradeNum * g.credits;
    }
  });
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  res.json({
    success: true,
    student,
    grades: studentGrades,
    gpa,
    schoolInfo: db.schoolInfo
  });
});

// Import students batch from Excel
app.post('/api/students/import', (req, res) => {
  const db = readDb();
  const list = req.body.students || [];
  let count = 0;
  if (!db.students) db.students = [];
  list.forEach(stu => {
    if (stu && (stu.id || stu.name)) {
      const existingIdx = db.students.findIndex(s => String(s.id).trim() === String(stu.id).trim());
      if (existingIdx >= 0) {
        db.students[existingIdx] = { ...db.students[existingIdx], ...stu };
      } else {
        db.students.push(stu);
      }
      count++;
    }
  });
  writeDb(db);
  res.json({ success: true, count, students: db.students });
});

// Get all grades with filtering & 0, ร, มส summary
app.get('/api/grades', (req, res) => {
  const db = readDb();
  const { classroom, statusType } = req.query;

  let list = db.grades.map(g => {
    const stu = db.students.find(s => s.id === g.studentId) || {};
    return {
      ...g,
      studentName: stu.name,
      classroom: stu.classroom,
      studentNumber: stu.number
    };
  });

  if (classroom) {
    list = list.filter(g => g.classroom === classroom);
  }

  // Summary counts
  const zeroCount = db.grades.filter(g => g.grade === '0').length;
  const rCount = db.grades.filter(g => g.grade === 'ร').length;
  const msCount = db.grades.filter(g => g.grade === 'มส').length;
  const passCount = db.grades.filter(g => !['0', 'ร', 'มส'].includes(g.grade)).length;

  if (statusType === '0') list = list.filter(g => g.grade === '0');
  else if (statusType === 'ร') list = list.filter(g => g.grade === 'ร');
  else if (statusType === 'มส') list = list.filter(g => g.grade === 'มส');
  else if (statusType === 'problem') list = list.filter(g => ['0', 'ร', 'มส'].includes(g.grade));

  res.json({
    grades: list,
    summary: {
      zeroCount,
      rCount,
      msCount,
      totalProblem: zeroCount + rCount + msCount,
      passCount,
      totalCount: db.grades.length
    }
  });
});

// Update grade resolution status (แก้ 0 / แก้ ร / แก้ มส)
app.post('/api/grades/:id/resolve', (req, res) => {
  const { id } = req.params;
  const { status, remark, newGrade } = req.body;
  const db = readDb();
  const idx = db.grades.findIndex(g => g.id === id);
  if (idx === -1) return res.status(404).json({ error: 'ไม่พบรายการผลการเรียน' });

  db.grades[idx].status = status || db.grades[idx].status;
  if (remark !== undefined) db.grades[idx].remark = remark;
  if (newGrade) db.grades[idx].grade = newGrade;

  writeDb(db);
  res.json({ success: true, grade: db.grades[idx] });
});

// -------------------------------------------------------------
// MODULE 2: แผนการสอน + บันทึกหลังแผน + ลายเซ็นผู้บริหาร
// -------------------------------------------------------------
app.get('/api/plans', (req, res) => {
  const db = readDb();
  res.json({ plans: db.lessonPlans });
});

// Create new plan
app.post('/api/plans', upload.single('planFile'), (req, res) => {
  const db = readDb();
  const { teacherId, teacherName, subject, classroom, unitTitle, learningHours } = req.body;
  
  const newId = `LP${String(db.lessonPlans.length + 1).padStart(3, '0')}`;
  const fileUrl = req.file ? `/uploads/plans/${req.file.filename}` : '/uploads/plans/sample.pdf';
  const fileName = req.file ? req.file.originalname : 'เอกสารแผนการจัดการเรียนรู้.pdf';

  const newPlan = {
    id: newId,
    teacherId: teacherId || 'T01',
    teacherName: teacherName || 'ครูผู้สอน',
    subject,
    classroom,
    unitTitle,
    learningHours: parseInt(learningHours) || 4,
    planFileUrl: fileUrl,
    fileName,
    submittedDate: new Date().toLocaleString('th-TH'),
    status: 'รอตรวจ',
    directorComment: '',
    approvedDate: '',
    signatureStampUrl: '',
    postLesson: {
      isRecorded: false,
      recordedDate: '',
      result: '',
      problem: '',
      solution: ''
    }
  };

  db.lessonPlans.unshift(newPlan);
  writeDb(db);
  res.json({ success: true, plan: newPlan });
});

// Executive review with digital signature stamp
app.post('/api/plans/:id/review', (req, res) => {
  const { id } = req.params;
  const { status, directorComment, signatureStampUrl } = req.body;
  const db = readDb();
  const idx = db.lessonPlans.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'ไม่พบแผนการสอน' });

  db.lessonPlans[idx].status = status;
  db.lessonPlans[idx].directorComment = directorComment || '';
  db.lessonPlans[idx].approvedDate = new Date().toLocaleString('th-TH');
  if (status === 'อนุมัติแล้ว') {
    db.lessonPlans[idx].signatureStampUrl = signatureStampUrl || db.schoolInfo.signatureUrl;
  }

  writeDb(db);
  res.json({ success: true, plan: db.lessonPlans[idx] });
});

// Teacher post-lesson reflection
app.post('/api/plans/:id/post-lesson', (req, res) => {
  const { id } = req.params;
  const { result, problem, solution } = req.body;
  const db = readDb();
  const idx = db.lessonPlans.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'ไม่พบแผนการสอน' });

  db.lessonPlans[idx].postLesson = {
    isRecorded: true,
    recordedDate: new Date().toLocaleString('th-TH'),
    result,
    problem,
    solution
  };

  writeDb(db);
  res.json({ success: true, plan: db.lessonPlans[idx] });
});

// -------------------------------------------------------------
// MODULE 3: งานนิเทศภายใน (ปฏิทิน + คะแนน + รูปภาพ)
// -------------------------------------------------------------
app.get('/api/supervisions', (req, res) => {
  const db = readDb();
  res.json({ supervisions: db.supervisions });
});

// Schedule new supervision
app.post('/api/supervisions', (req, res) => {
  const db = readDb();
  const { date, period, teacherId, teacherName, subject, classroom, room, supervisorName } = req.body;
  
  const newId = `SUP${String(db.supervisions.length + 1).padStart(3, '0')}`;
  const item = {
    id: newId,
    date,
    period,
    teacherId,
    teacherName,
    subject,
    classroom,
    room,
    supervisorName: supervisorName || db.schoolInfo.headAcademicName,
    status: 'รอนิเทศ',
    scores: null,
    feedback: '',
    photos: []
  };

  db.supervisions.push(item);
  writeDb(db);
  res.json({ success: true, supervision: item });
});

// Evaluate supervision & upload photos/scores
app.post('/api/supervisions/:id/evaluate', (req, res) => {
  const { id } = req.params;
  const { scores, feedback, photos } = req.body;
  const db = readDb();
  const idx = db.supervisions.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'ไม่พบรายการนิเทศ' });

  db.supervisions[idx].status = 'เสร็จสิ้น';
  db.supervisions[idx].scores = scores;
  db.supervisions[idx].feedback = feedback;
  if (photos && Array.isArray(photos)) {
    db.supervisions[idx].photos = photos;
  }

  writeDb(db);
  res.json({ success: true, supervision: db.supervisions[idx] });
});

// Photo upload API for supervision
app.post('/api/upload/photo', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'กรุณาเลือกไฟล์รูปภาพ' });
  res.json({ url: `/uploads/photos/${req.file.filename}` });
});

// Signature upload API
app.post('/api/upload/signature', upload.single('signature'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'กรุณาเลือกไฟล์ลายเซ็น' });
  const url = `/uploads/signatures/${req.file.filename}`;
  const db = readDb();
  db.schoolInfo.signatureUrl = url;
  writeDb(db);
  res.json({ url });
});

// -------------------------------------------------------------
// MODULE 4: ตารางสอน (ไม่ซ้ำ) & จัดสอนแทน
// -------------------------------------------------------------
app.get('/api/timetables', (req, res) => {
  const db = readDb();
  res.json({
    timetables: db.timetables,
    days: db.days,
    periods: db.periods,
    teachers: db.teachers,
    classrooms: db.classrooms,
    rooms: db.rooms
  });
});

// Validation endpoint: Check conflict before saving
app.post('/api/timetables/validate', (req, res) => {
  const { day, period, teacherId, room, classroom, excludeId } = req.body;
  const db = readDb();

  const conflicts = [];
  const list = db.timetables.filter(t => t.id !== excludeId && t.day === day && t.period === parseInt(period));

  for (const t of list) {
    if (t.teacherId === teacherId) {
      conflicts.push(`ครูผู้สอน (${t.teacherName}) มีคาบสอนในวัน ${day} ${t.period} อยู่แล้วที่ห้อง ${t.classroom}`);
    }
    if (t.room === room) {
      conflicts.push(`ห้องเรียน (${room}) มีการเรียนการสอนวิชา ${t.subject} ในวัน ${day} ${t.period} อยู่แล้ว`);
    }
    if (t.classroom === classroom) {
      conflicts.push(`ชั้นเรียน (${classroom}) มีตารางเรียนวิชา ${t.subject} ในคาบนี้อยู่แล้ว`);
    }
  }

  res.json({
    hasConflict: conflicts.length > 0,
    conflicts
  });
});

// Add timetable slot (Server-side Conflict Prevention)
app.post('/api/timetables', (req, res) => {
  const { day, period, teacherId, teacherName, subject, classroom, room } = req.body;
  const db = readDb();

  const pNum = parseInt(period);
  // Check conflict
  const existing = db.timetables.find(t => 
    t.day === day && t.period === pNum &&
    (t.teacherId === teacherId || t.room === room || t.classroom === classroom)
  );

  if (existing) {
    let reason = 'ตารางสอนชนกัน: ';
    if (existing.teacherId === teacherId) reason += `ครูมีสอนที่ห้อง ${existing.classroom}`;
    else if (existing.room === room) reason += `ห้อง ${room} ถูกใช้แล้ว`;
    else if (existing.classroom === classroom) reason += `ชั้น ${classroom} มีเรียนวิชาอื่นแล้ว`;
    return res.status(400).json({ error: reason });
  }

  const newId = `TT${String(db.timetables.length + 1).padStart(3, '0')}`;
  const slot = {
    id: newId,
    day,
    period: pNum,
    teacherId,
    teacherName,
    subject,
    classroom,
    room
  };

  db.timetables.push(slot);
  writeDb(db);
  res.json({ success: true, slot });
});

// Delete slot
app.delete('/api/timetables/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.timetables = db.timetables.filter(t => t.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Substitute teaching: Find teachers who are FREE on a given day & period!
app.post('/api/substitutes/find-free-teachers', (req, res) => {
  const { day, period, absentTeacherId } = req.body;
  const db = readDb();
  const pNum = parseInt(period);

  // Busy teachers in this day & period
  const busyTeacherIds = db.timetables
    .filter(t => t.day === day && t.period === pNum)
    .map(t => t.teacherId);

  // Teachers who are NOT busy and NOT the absent teacher
  const freeTeachers = db.teachers.filter(t => 
    t.id !== absentTeacherId && !busyTeacherIds.includes(t.id)
  );

  res.json({
    day,
    period: pNum,
    freeTeachers,
    totalFree: freeTeachers.length
  });
});

// Substitute assignments
app.get('/api/substitutes', (req, res) => {
  const db = readDb();
  res.json({ substitutes: db.substitutes });
});

app.post('/api/substitutes', (req, res) => {
  const db = readDb();
  const { date, day, period, periodTime, classroom, subject, absentTeacherId, absentTeacherName, absentReason, subTeacherId, subTeacherName, remark } = req.body;

  const newId = `SUB${String(db.substitutes.length + 1).padStart(3, '0')}`;
  const subRecord = {
    id: newId,
    date,
    day,
    period: parseInt(period),
    periodTime: periodTime || 'ตามตารางสอน',
    classroom,
    subject,
    absentTeacherId,
    absentTeacherName,
    absentReason,
    subTeacherId,
    subTeacherName,
    status: 'อนุมัติสอนแทนแล้ว',
    assignedDate: new Date().toLocaleString('th-TH'),
    remark: remark || ''
  };

  db.substitutes.unshift(subRecord);
  writeDb(db);
  res.json({ success: true, substitute: subRecord });
});

// -------------------------------------------------------------
// Start Server
// -------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  School Academic MIS (ระบบบริหารงานวิชาการโรงเรียน)`);
  console.log(`  Server running on http://localhost:${PORT}`);
  console.log(`====================================================`);
});
