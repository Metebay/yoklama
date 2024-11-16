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
        const student = { id: Date.now(), name: studentName, classId };
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));

        const selectedClass = classes.find(c => c.id === Number(classId));
        selectedClass.students.push(student);
        localStorage.setItem('classes', JSON.stringify(classes));

        alert(`${studentName} başarıyla eklendi.`);
        document.getElementById('studentName').value = '';
    } else {
        alert("Öğrenci adı ve sınıf seçimi yapmalısınız.");
    }
}

// Sınıf ve Öğrenci Seçimlerini Güncelleme
function updateClassSelect() {
    const classSelect = document.getElementById('classSelect');
    const attendanceClassSelect = document.getElementById('attendanceClassSelect');
    classSelect.innerHTML = '<option value="">Sınıf Seçin</option>';
    attendanceClassSelect.innerHTML = '<option value="">Sınıf Seçin</option>';

    classes.forEach(cls => {
        const option = `<option value="${cls.id}">${cls.name}</option>`;
        classSelect.innerHTML += option;
        attendanceClassSelect.innerHTML += option;
    });
}

// Yoklama Al
function loadStudentsForAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    if (classId) {
        const selectedClass = classes.find(c => c.id === Number(classId));
        selectedClass.students.forEach(student => {
            const listItem = `
                <li>
                    <input type="checkbox" data-id="${student.id}" id="student-${student.id}">
                    <label for="student-${student.id}">${student.name}</label>
                </li>
            `;
            attendanceList.innerHTML += listItem;
        });
    }
}

function takeAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    if (classId) {
        const attendanceList = document.querySelectorAll('#attendanceList li input');
        const attendanceRecord = {
            classId: Number(classId),
            date: new Date().toLocaleDateString(),
            records: []
        };

        attendanceList.forEach(input => {
            attendanceRecord.records.push({
                studentId: Number(input.dataset.id),
                status: input.checked
            });
        });

        attendanceRecords.push(attendanceRecord);
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        alert("Yoklama başarıyla alındı.");
    } else {
        alert("Lütfen bir sınıf seçin.");
    }
}

// Yoklama Raporlarını Göster
function showAttendanceReports() {
    const attendanceReportsList = document.getElementById('attendanceReportsList');
    attendanceReportsList.innerHTML = '';

    attendanceRecords.forEach(record => {
        const selectedClass = classes.find(c => c.id === record.classId);
        const report = `
            <div>
                <h3>${selectedClass.name} (${record.date})</h3>
                <ul>
                    ${record.records.map(r => {
                        const student = students.find(s => s.id === r.studentId);
                        return `<li>${student.name}: ${r.status ? 'Var' : 'Yok'}</li>`;
                    }).join('')}
                </ul>
            </div>
        `;
        attendanceReportsList.innerHTML += report;
    });
}

// Başarı Puanı Ekle
function addStudentScore() {
    const studentId = prompt("Puan eklenecek öğrencinin ID'sini girin:");
    const student = students.find(s => s.id === Number(studentId));

    if (student) {
        const score = Number(prompt("Öğrencinin başarı puanını girin:"));
        if (!isNaN(score)) {
            student.score = score;
            localStorage.setItem('students', JSON.stringify(students));
            alert(`${student.name} için başarı puanı: ${score}`);
        } else {
            alert("Geçerli bir sayı girin.");
        }
    } else {
        alert("Geçersiz öğrenci ID'si.");
    }
}
