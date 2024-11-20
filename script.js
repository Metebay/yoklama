// Öğretmen Girişi
let classes = JSON.parse(localStorage.getItem('classes')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];
let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

function teacherLogin() {
    const username = document.getElementById('teacherUsername').value;
    const password = document.getElementById('teacherPassword').value;
    if (username === 'admin' && password === 'admin') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('teacherPanel').style.display = 'block';
        loadClasses();
        loadStudentsList();
    } else {
        document.getElementById('loginError').textContent = 'Geçersiz kullanıcı adı veya şifre!';
    }
}

// Sınıf Oluşturma
function createClass() {
    const className = document.getElementById('className').value;
    if (className) {
        const newClass = { id: Date.now(), name: className };
        classes.push(newClass);
        localStorage.setItem('classes', JSON.stringify(classes));
        loadClasses();
    }
}

// Öğrenci Ekleme
function addStudent() {
    const studentName = document.getElementById('studentName').value;
    const classSelect = document.getElementById('classSelect').value;
    if (studentName && classSelect) {
        const newStudent = { id: Date.now(), name: studentName, classId: classSelect };
        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students));
        loadStudentsList();
    }
}

// Öğrenci Listeleme
function loadStudentsList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';
    students.forEach(student => {
        const listItem = document.createElement('li');
        const studentClass = classes.find(c => c.id == student.classId);
        listItem.textContent = `${student.name} (${studentClass ? studentClass.name : 'Bilinmeyen Sınıf'})`;
        studentList.appendChild(listItem);
    });
}

// Yoklama Al
function loadStudentsForAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';
    if (classId) {
        const studentsInClass = students.filter(student => student.classId == classId);
        studentsInClass.forEach(student => {
            const listItem = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `student-${student.id}`;
            listItem.textContent = student.name;
            listItem.prepend(checkbox);
            attendanceList.appendChild(listItem);
        });
    }
}

// Yoklama Kaydet
function takeAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendance = [];
    const checkboxes = document.querySelectorAll(`#attendanceList input[type="checkbox"]`);
    checkboxes.forEach(checkbox => {
        const studentId = checkbox.id.split('-')[1];
        const student = students.find(s => s.id == studentId);
        if (checkbox.checked) {
            attendance.push({ studentId: student.id, name: student.name, status: 'Var' });
        } else {
            attendance.push({ studentId: student.id, name: student.name, status: 'Yok' });
        }
    });
    if (attendance.length > 0) {
        const attendanceRecord = { classId, date: new Date(), attendance };
        attendanceRecords.push(attendanceRecord);
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        alert("Yoklama başarıyla alındı.");
        loadAttendanceReports();
    } else {
        alert("Lütfen yoklama almak için öğrenci seçin.");
    }
}

// Yoklama Raporları
function loadAttendanceReports() {
    const attendanceReportsList = document.getElementById('attendanceReportsList');
    attendanceReportsList.innerHTML = '';
    attendanceRecords.forEach(record => {
        const reportItem = document.createElement('div');
        const date = new Date(record.date).toLocaleString();
        reportItem.innerHTML = `<strong>${date}</strong><br>`;
        record.attendance.forEach(entry => {
            reportItem.innerHTML += `${entry.name}: ${entry.status}<br>`;
        });
        attendanceReportsList.appendChild(reportItem);
    });
}

// Sidebar Göster
function showSection(sectionId) {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}
