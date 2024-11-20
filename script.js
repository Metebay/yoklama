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

// Öğrenci Ekle
function addStudent() {
    const studentName = document.getElementById('studentName').value;
    const classId = document.getElementById('classSelect').value;

    if (studentName && classId) {
        const student = { name: studentName, id: Date.now(), classId };
        const selectedClass = classes.find(c => c.id == classId);

        if (!selectedClass) {
            alert("Seçilen sınıf bulunamadı.");
            return;
        }

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

// Öğrencileri Listele
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

// Öğrenci Silme
function removeStudent(studentId) {
    // Öğrenciyi sil
    students = students.filter(student => student.id !== studentId);

    // Sınıf listesinden de sil
    classes.forEach(c => {
        c.students = c.students.filter(student => student.id !== studentId);
    });

    // Verileri güncelle
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('classes', JSON.stringify(classes));

    // Öğrenci listesini yeniden yükle
    loadStudentsList();
    alert("Öğrenci başarıyla silindi.");
}

// Yoklama Al
function loadStudentsForAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = ''; // Mevcut listeyi temizle

    if (classId) {
        const selectedClass = classes.find(c => c.id == classId);

        if (!selectedClass || selectedClass.students.length === 0) {
            alert("Bu sınıfın öğrencisi bulunmamaktadır.");
            return;
        }

        selectedClass.students.forEach(student => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${student.name} <input type="checkbox" data-student-id="${student.id}">`;
            attendanceList.appendChild(listItem);
        });
    } else {
        alert("Lütfen sınıf seçin.");
    }
}

// Yoklama Almayı Kaydet
function takeAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const selectedClass = classes.find(c => c.id == classId);

    if (!selectedClass) {
        alert("Geçerli bir sınıf seçin.");
        return;
    }

    const attendanceData = [];

    // Tüm öğrencileri kontrol et ve yoklama verilerini topla
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

    if (attendanceData.length === 0) {
        alert("Yoklama alınacak öğrenci yok.");
        return;
    }

    const attendanceRecord = {
        classId,
        date: new Date().toLocaleDateString(),
        attendanceData
    };

    attendanceRecords.push(attendanceRecord);
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));

    alert('Yoklama başarıyla alındı.');
    showSection('attendanceReports'); // Raporları göster
    loadAttendanceReports();
}

// Yoklama Raporlarını Yükle
function loadAttendanceReports() {
    const attendanceReportsList = document.getElementById('attendanceReportsList');
    attendanceReportsList.innerHTML = ''; // Mevcut raporları temizle

    attendanceRecords.forEach(record => {
        const recordElement = document.createElement('div');
        const className = classes.find(c => c.id == record.classId).name;
        const date = record.date;
        let attendanceDetails = `<h3>${className} - ${date}</h3><ul>`;
        
        record.attendanceData.forEach(item => {
            attendanceDetails += `<li>${item.studentName}: ${item.present ? 'Devam' : 'Devamsız'}</li>`;
        });
        
        attendanceDetails += '</ul>';
        recordElement.innerHTML = attendanceDetails;
        attendanceReportsList.appendChild(recordElement);
    });
}
