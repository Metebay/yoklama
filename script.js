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

// Sınıf Oluşturma
function createClass() {
    const className = document.getElementById('className').value;
    if (className) {
        const newClass = { id: Date.now(), name: className, students: [] };
        classes.push(newClass);
        localStorage.setItem('classes', JSON.stringify(classes));
        alert(`${className} sınıfı başarıyla oluşturuldu.`);
        document.getElementById('className').value = '';
        updateClassSelect();
    } else {
        alert("Sınıf adı girmelisiniz.");
    }
}

// Öğrenci Ekleme
function addStudent() {
    const studentName = document.getElementById('studentName').value;
    const classId = document.getElementById('classSelect').value;

    if (studentName && classId) {
        const student = { id: Date.now(), name: studentName };
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));

        const selectedClass = classes.find(c => c.id === Number(classId));
        selectedClass.students.push(student.id);
        localStorage.setItem('classes', JSON.stringify(classes));

        alert(`${studentName} başarıyla eklendi.`);
        document.getElementById('studentName').value = '';
    } else {
        alert("Öğrenci adı ve sınıf seçimi yapmalısınız.");
    }
}

// Öğrencileri Listeleme
function listStudents() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    if (students.length > 0) {
        students.forEach(student => {
            const studentItem = document.createElement('li');
            studentItem.innerHTML = `
                ${student.name} 
                <button onclick="deleteStudent(${student.id})">Sil</button>
            `;
            studentList.appendChild(studentItem);
        });
    } else {
        studentList.innerHTML = '<p>Henüz öğrenci eklenmedi.</p>';
    }
}

// Öğrenci Silme
function deleteStudent(studentId) {
    students = students.filter(s => s.id !== studentId);
    localStorage.setItem('students', JSON.stringify(students));

    classes.forEach(cls => {
        cls.students = cls.students.filter(id => id !== studentId);
    });
    localStorage.setItem('classes', JSON.stringify(classes));

    alert('Öğrenci silindi.');
    listStudents();
}

// Yoklama Listesini Yükle
function loadStudentsForAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    if (!classId) return;

    const selectedClass = classes.find(cls => cls.id == classId);
    if (selectedClass && selectedClass.students.length > 0) {
        selectedClass.students.forEach(studentId => {
            const student = students.find(s => s.id === studentId);
            if (student) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <label>
                        <input type="checkbox" id="attendance-${student.id}">
                        ${student.name}
                    </label>`;
                attendanceList.appendChild(li);
            }
        });
    } else {
        attendanceList.innerHTML = '<p>Bu sınıfta öğrenci bulunmamaktadır.</p>';
    }
}

// Yoklama Kaydet
function takeAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const selectedClass = classes.find(cls => cls.id == classId);
    const attendance = [];

    if (selectedClass && selectedClass.students.length > 0) {
        selectedClass.students.forEach(studentId => {
            const checkbox = document.getElementById(`attendance-${studentId}`);
            const isPresent = checkbox ? checkbox.checked : false;
            attendance.push({
                studentId: studentId,
                isPresent: isPresent
            });
        });

        const date = new Date().toLocaleDateString();
        const record = {
            classId: classId,
            date: date,
            attendance: attendance
        };

        attendanceRecords.push(record);
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        alert('Yoklama başarıyla kaydedildi.');
    } else {
        alert('Bu sınıfta öğrenci bulunmamaktadır veya seçim yapılmamıştır.');
    }
}

// Yoklama Raporları
function showAttendanceReports() {
    const attendanceReportsList = document.getElementById('attendanceReportsList');
    attendanceReportsList.innerHTML = '';

    if (attendanceRecords.length > 0) {
        attendanceRecords.forEach(record => {
            const className = classes.find(cls => cls.id == record.classId)?.name || 'Bilinmiyor';
            const reportHeader = document.createElement('h3');
            reportHeader.textContent = `${record.date} - Sınıf: ${className}`;
            attendanceReportsList.appendChild(reportHeader);

            record.attendance.forEach(att => {
                const student = students.find(s => s.id === att.studentId);
                if (student) {
                    const reportItem = document.createElement('p');
                    reportItem.textContent = `${student.name}: ${att.isPresent ? 'Gelmiş' : 'Gelmemiş'}`;
                    attendanceReportsList.appendChild(reportItem);
                }
            });
        });
    } else {
        attendanceReportsList.innerHTML = '<p>Henüz yoklama kaydı bulunmamaktadır.</p>';
    }
}

// Sınıfları Güncelle
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
