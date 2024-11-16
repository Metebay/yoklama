let classes = JSON.parse(localStorage.getItem('classes')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];
let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
let teachers = JSON.parse(localStorage.getItem('teachers')) || [
    { username: "teacher1", password: "password1" },
    { username: "teacher2", password: "password2" }
];

// Öğretmen Girişi
function teacherLogin() {
    const username = document.getElementById('teacherUsername').value;
    const password = document.getElementById('teacherPassword').value;
    const loginError = document.getElementById('loginError');

    const teacher = teachers.find(t => t.username === username && t.password === password);

    if (teacher) {
        loginError.textContent = '';
        localStorage.setItem('loggedInUser', username);
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('teacherPanel').style.display = 'block';
        document.getElementById('sidebar').style.display = 'block';
        updateClassSelect();
    } else {
        loginError.textContent = 'Kullanıcı adı veya şifre yanlış.';
    }
}

// Bölümler Arasında Geçiş
function showSection(sectionId) {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

// Öğrenci Listeleme
function listStudents() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    if (students.length > 0) {
        students.forEach(student => {
            const selectedClass = classes.find(c => c.id === Number(student.classId));
            const listItem = `
                <li>
                    ${student.name} - ${selectedClass ? selectedClass.name : 'Bilinmiyor'}
                    <button onclick="deleteStudent(${student.id})">Sil</button>
                </li>
            `;
            studentList.innerHTML += listItem;
        });
    } else {
        studentList.innerHTML = '<p>Öğrenci bulunmamaktadır.</p>';
    }
}

// Öğrenci Silme
function deleteStudent(studentId) {
    students = students.filter(student => student.id !== studentId);
    localStorage.setItem('students', JSON.stringify(students));

    // Silinen öğrencinin ait olduğu sınıftan da kaldırma
    classes.forEach(cls => {
        cls.students = cls.students.filter(student => student.id !== studentId);
    });
    localStorage.setItem('classes', JSON.stringify(classes));

    alert('Öğrenci başarıyla silindi.');
    listStudents();  // Güncel listeyi tekrar göster
}

// Yoklama Al
function loadStudentsForAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    const selectedClass = classes.find(cls => cls.id === Number(classId));
    if (selectedClass) {
        selectedClass.students.forEach(student => {
            const listItem = `
                <li>
                    <input type="checkbox" id="attendance-${student.id}" data-student-id="${student.id}">
                    ${student.name}
                </li>
            `;
            attendanceList.innerHTML += listItem;
        });
    }
}

// Yoklama Kaydet
function takeAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const selectedClass = classes.find(cls => cls.id === Number(classId));
    if (selectedClass) {
        const attendance = [];

        selectedClass.students.forEach(student => {
            const checkbox = document.getElementById(`attendance-${student.id}`);
            const isPresent = checkbox && checkbox.checked;
            attendance.push({ studentId: student.id, isPresent });
        });

        const date = new Date().toLocaleDateString();
        attendanceRecords.push({ classId, date, attendance });
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));

        alert('Yoklama başarıyla alındı.');
    }
}

// Yoklama Raporlarını Göster
function showAttendanceReports() {
    const attendanceReportsList = document.getElementById('attendanceReportsList');
    attendanceReportsList.innerHTML = '';

    if (attendanceRecords.length > 0) {
        attendanceRecords.forEach(record => {
            const reportItem = `<h3>${record.date} - Sınıf: ${classes.find(cls => cls.id === Number(record.classId))?.name}</h3>`;
            record.attendance.forEach(attendance => {
                const student = students.find(s => s.id === attendance.studentId);
                const status = attendance.isPresent ? 'Gelmiş' : 'Gelmemiş';
                attendanceReportsList.innerHTML += `
                    <p>${student?.name || 'Bilinmiyor'}: ${status}</p>
                `;
            });
        });
    } else {
        attendanceReportsList.innerHTML = '<p>Henüz yoklama kaydı bulunmamaktadır.</p>';
    }
}
