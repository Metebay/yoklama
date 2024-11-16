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

// Öğrencileri Listele
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

// Sınıf ve Öğrenci Seçimlerini Güncelleme
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

// Öğrenci Listesini Göster
function showStudents() {
    listStudents();
    showSection('listStudents');
}
