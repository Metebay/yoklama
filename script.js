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
        document.getElementById('sidebar').style.display = 'block'; // Sidebar'ı göster
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

// Öğrencileri listeleme
function loadStudentsList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    students.forEach(student => {
        const listItem = document.createElement('li');
        const studentClass = classes.find(c => c.id == student.classId);
        listItem.textContent = `${student.name} (${studentClass.name})`;
        studentList.appendChild(listItem);
    });
}

// Yoklama almak için öğrencileri listeleme
function loadStudentsForAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    if (!classId) return;

    const selectedClass = classes.find(c => c.id == classId);
    selectedClass.students.forEach(student => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <input type="checkbox" class="attendanceCheck" data-student-id="${student.id}"> ${student.name}
        `;
        attendanceList.appendChild(listItem);
    });
}

// Yoklama al
function takeAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendanceList = document.querySelectorAll('.attendanceCheck');
    const attendance = [];

    attendanceList.forEach(check => {
        const studentId = check.getAttribute('data-student-id');
        attendance.push({
            studentId: studentId,
            present: check.checked
        });
    });

    if (classId && attendance.length) {
        const attendanceRecord = {
            id: Date.now(),
            classId: classId,
            date: new Date().toLocaleDateString(),
            attendance: attendance
        };
        attendanceRecords.push(attendanceRecord);
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));

        alert("Yoklama başarıyla alındı.");
        displayAttendanceRecords();
    }
}

// Yoklama kayıtlarını görüntüle
function displayAttendanceRecords() {
    const attendanceRecordsList = document.getElementById('attendanceRecordsList');
    attendanceRecordsList.innerHTML = '';

    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
        attendanceRecordsList.innerHTML = '<p>Henüz yoklama alınmamış.</p>';
        return;
    }

    attendanceRecords.forEach(record => {
        const className = classes.find(c => c.id == record.classId)?.name || 'Bilinmiyor';
        const recordDate = record.date;

        const recordDiv = document.createElement('div');
        recordDiv.className = 'attendance-record';

        const title = document.createElement('h3');
        title.textContent = `${className} - ${recordDate}`;
        recordDiv.appendChild(title);

        const studentList = document.createElement('ul');
        record.attendance.forEach(attendance => {
            const student = students.find(s => s.id == attendance.studentId);
            if (student) {
                const listItem = document.createElement('li');
                listItem.textContent = `${student.name}: ${attendance.present ? 'Var' : 'Yok'}`;
                studentList.appendChild(listItem);
            }
        });

        recordDiv.appendChild(studentList);
        attendanceRecordsList.appendChild(recordDiv);
    });
}
