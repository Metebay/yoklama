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

// Sidebar'da seçilen bölüme git
function showSection(sectionId) {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Sınıf ve öğrenci listeleme
function updateClassSelect() {
    const classSelect = document.getElementById('classSelect');
    const attendanceClassSelect = document.getElementById('attendanceClassSelect');
    classSelect.innerHTML = '<option value="">Sınıf Seçin</option>';
    attendanceClassSelect.innerHTML = '<option value="">Sınıf Seçin</option>';

    classes.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        classSelect.appendChild(option);

        const attendanceOption = document.createElement('option');
        attendanceOption.value = c.id;
        attendanceOption.textContent = c.name;
        attendanceClassSelect.appendChild(attendanceOption);
    });
    loadStudentsList();
}

// Sınıf oluştur
function createClass() {
    const className = document.getElementById('className').value;
    if (className) {
        const newClass = {
            id: Date.now(),
            name: className,
            students: []
        };
        classes.push(newClass);
        localStorage.setItem('classes', JSON.stringify(classes));
        alert(`${className} sınıfı oluşturuldu.`);
        updateClassSelect();
    } else {
        alert("Sınıf adı boş olamaz.");
    }
}

// Öğrenci ekleme
function addStudent() {
    const studentName = document.getElementById('studentName').value;
    const classId = document.getElementById('classSelect').value;

    if (studentName && classId) {
        const student = { name: studentName, id: Date.now(), classId };
        const selectedClass = classes.find(c => c.id == classId);
        selectedClass.students.push(student);
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
        localStorage.setItem('classes', JSON.stringify(classes));

        alert(`${studentName} sınıfına eklendi.`);
        document.getElementById('studentName').value = '';
        loadStudentsList();
    } else {
        alert("Öğrenci adı ve sınıf seçimi yapmalısınız.");
    }
}

// Öğrencileri listele
function loadStudentsList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = ''; // Mevcut listeyi temizle

    students.forEach(student => {
        const listItem = document.createElement('li');
        const studentClass = classes.find(c => c.id == student.classId);
        listItem.innerHTML = `${student.name} (${studentClass.name}) <button onclick="removeStudent(${student.id})">Sil</button>`;
        studentList.appendChild(listItem);
    });
}

// Öğrenci silme
function removeStudent(studentId) {
    students = students.filter(student => student.id !== studentId);

    classes.forEach(c => {
        c.students = c.students.filter(student => student.id !== studentId);
    });

    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('classes', JSON.stringify(classes));

    loadStudentsList();
    alert("Öğrenci başarıyla silindi.");
}

// Yoklama al
function loadStudentsForAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    if (classId) {
        const selectedClass = classes.find(c => c.id == classId);
        selectedClass.students.forEach(student => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${student.name} <input type="checkbox" data-student-id="${student.id}">`;
            attendanceList.appendChild(listItem);
        });
    }
}

// Yoklama almayı kaydet
function takeAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const selectedClass = classes.find(c => c.id == classId);
    const attendanceData = [];

    const checkboxes = document.querySelectorAll('#attendanceList input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const studentId = checkbox.getAttribute('data-student-id');
        const student = students.find(s => s.id == studentId);
        attendanceData.push({
            studentId,
            studentName: student.name,
            present: checkbox.checked
        });
    });

    const attendanceRecord = {
        classId,
        date: new Date().toLocaleDateString(),
        attendanceData
    };

    attendanceRecords.push(attendanceRecord);
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));

    alert('Yoklama başarıyla alındı.');
    showSection('attendanceReports');
    loadAttendanceReports();
}

// Yoklama raporlarını yükle
function loadAttendanceReports() {
    const attendanceReportsList = document.getElementById('attendanceReportsList');
    attendanceReportsList.innerHTML = '';

    attendanceRecords.forEach(record => {
        const reportDiv = document.createElement('div');
        const className = classes.find(c => c.id == record.classId).name;
        const reportHTML = `<h4>${className} - ${record.date}</h4><ul>`;
        record.attendanceData.forEach(entry => {
            reportHTML += `<li>${entry.studentName}: ${entry.present ? 'Var' : 'Yok'}</li>`;
        });
        reportHTML += '</ul>';
        reportDiv.innerHTML = reportHTML;
        attendanceReportsList.appendChild(reportDiv);
    });
}
