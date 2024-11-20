const classes = JSON.parse(localStorage.getItem('classes')) || [];
const students = JSON.parse(localStorage.getItem('students')) || [];
const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
const teachers = [
    { username: "teacher1", password: "password1" },
    { username: "teacher2", password: "password2" }
];

// Giriş İşlemi
function teacherLogin() {
    const username = document.getElementById('teacherUsername').value;
    const password = document.getElementById('teacherPassword').value;
    const teacher = teachers.find(t => t.username === username && t.password === password);

    if (teacher) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('teacherPanel').style.display = 'block';
        document.getElementById('sidebar').style.display = 'block';
        updateClassSelect();
    } else {
        showToast("Kullanıcı adı veya şifre yanlış.", true);
    }
}

// Sınıf İşlemleri
function createClass() {
    const className = document.getElementById('className').value;
    if (!className) {
        showToast("Sınıf adı girin.", true);
        return;
    }
    const newClass = { id: Date.now(), name: className, students: [] };
    classes.push(newClass);
    localStorage.setItem('classes', JSON.stringify(classes));
    showToast(`${className} sınıfı oluşturuldu.`);
    document.getElementById('className').value = '';
    updateClassSelect();
}

// Öğrenci İşlemleri
function addStudent() {
    const studentName = document.getElementById('studentName').value;
    const classId = document.getElementById('classSelect').value;

    if (!studentName || !classId) {
        showToast("Öğrenci adı ve sınıf seçimi gerekli.", true);
        return;
    }

    const student = { id: Date.now(), name: studentName, classId };
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    showToast(`${studentName} başarıyla eklendi.`);
    document.getElementById('studentName').value = '';
}

// Yoklama Al
function takeAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const checkboxes = document.querySelectorAll('#attendanceList input[type="checkbox"]');
    const records = Array.from(checkboxes).map(cb => ({
        studentId: parseInt(cb.value),
        present: cb.checked
    }));

    attendanceRecords.push({ classId, date: new Date().toISOString(), records });
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    showToast("Yoklama başarıyla kaydedildi.");
}

// Yoklama Raporu
function loadAttendanceReports() {
    const classId = document.getElementById('reportClassSelect').value;
    const reports = attendanceRecords.filter(r => r.classId === classId);
    const reportList = document.getElementById('attendanceReportsList');
    reportList.innerHTML = reports.length
        ? reports.map(r => `<div>${r.date} - ${r.records.length} kayıt</div>`).join("")
        : "Rapor yok.";
}

// Geri Bildirim
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.backgroundColor = isError ? '#e74c3c' : '#2ecc71';
    toast.textContent = message;
    document.getElementById('toastContainer').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
