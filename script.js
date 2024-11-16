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
        showSection('classSection');
        updateClassSelect();
    } else {
        loginError.textContent = 'Kullanıcı adı veya şifre yanlış.';
    }
}

// Sınıf Seçimlerini Güncelleme
function updateClassSelect() {
    const classSelect = document.getElementById('classSelect');
    const attendanceClassSelect = document.getElementById('attendanceClassSelect');
    classSelect.innerHTML = '<option value="">Sınıf Seçin</option>';
    attendanceClassSelect.innerHTML = '<option value="">Sınıf Seçin</option>';

    classes.forEach(cls => {
        classSelect.innerHTML += `<option value="${cls.id}">${cls.name}</option>`;
        attendanceClassSelect.innerHTML += `<option value="${cls.id}">${cls.name}</option>`;
    });
}

// Formları Göster
function showSection(sectionId) {
    // Tüm form bölümlerini gizle
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Seçilen bölümü göster
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

// Sınıf Oluştur
function createClass() {
    const className = document.getElementById('className').value;
    if (!className) {
        alert("Sınıf adı giriniz!");
        return;
    }

    const classId = classes.length ? classes[classes.length - 1].id + 1 : 1;
    const newClass = { id: classId, name: className, students: [] };

    classes.push(newClass);
    localStorage.setItem('classes', JSON.stringify(classes));
    updateClassSelect();
    alert("Sınıf oluşturuldu!");
    document.getElementById('className').value = '';
}

// Öğrenci Ekleme
function addStudent() {
    const studentName = document.getElementById('studentName').value;
    const classId = document.getElementById('classSelect').value;

    if (!studentName || !classId) {
        alert("Lütfen öğrenci adı ve sınıf seçiniz!");
        return;
    }

    const studentId = students.length ? students[students.length - 1].id + 1 : 1;
    const newStudent = { id: studentId, name: studentName, classId: classId };

    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));

    const selectedClass = classes.find(cls => cls.id == classId);
    selectedClass.students.push(newStudent);
    localStorage.setItem('classes', JSON.stringify(classes));

    alert("Öğrenci eklendi!");
    document.getElementById('studentName').value = '';
    updateClassSelect();
}

// Öğrencileri Listeleme
function listStudents() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    students.forEach(student => {
        const studentItem = document.createElement('li');
        studentItem.textContent = `${student.name} (Sınıf: ${classes.find(cls => cls.id === student.classId)?.name})`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Sil';
        deleteButton.onclick = () => deleteStudent(student.id);
        studentItem.appendChild(deleteButton);
        studentList.appendChild(studentItem);
    });
}

// Öğrenci Silme
function deleteStudent(studentId) {
    students = students.filter(s => s.id !== studentId);
    localStorage.setItem('students', JSON.stringify(students));

    classes.forEach(cls => {
        cls.students = cls.students.filter(s => s.id !== studentId);
    });
    localStorage.setItem('classes', JSON.stringify(classes));

    alert("Öğrenci silindi!");
    listStudents(); // Listeyi güncelle
}

// Yoklama Al
function loadStudentsForAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    if (!classId) return;

    const selectedClass = classes.find(cls => cls.id === Number(classId));
    if (selectedClass) {
        selectedClass.students.forEach(student => {
            const li = document.createElement('li');
            li.innerHTML = `<label><input type="checkbox" id="attendance-${student.id}"> ${student.name}</label>`;
            attendanceList.appendChild(li);
        });
    }
}

// Yoklama Kaydet
function takeAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const selectedClass = classes.find(cls => cls.id === Number(classId));
    const attendance = [];

    if (selectedClass) {
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

// Yoklama Raporları
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
