// Verilerin Yerel Depodan Yüklenmesi
let classes = JSON.parse(localStorage.getItem('classes')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];
let teachers = JSON.parse(localStorage.getItem('teachers')) || [
    { username: "teacher1", password: "password1" },
    { username: "teacher2", password: "password2" }
];
let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

// Öğretmen Girişi
function teacherLogin() {
    const username = getInputValue('teacherUsername');
    const password = getInputValue('teacherPassword');
    const loginError = document.getElementById('loginError');

    const teacher = teachers.find(t => t.username === username && t.password === password);
    if (teacher) {
        loginError.textContent = '';
        toggleVisibility('loginPage', false);
        toggleVisibility('teacherPanel', true);
        toggleVisibility('sidebar', true);
        updateClassSelect();
    } else {
        loginError.textContent = 'Kullanıcı adı veya şifre yanlış.';
    }
}

// Bölüm Görünürlüğünü Yönetme
function showSection(sectionId) {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => toggleVisibility(section.id, false));
    toggleVisibility(sectionId, true);
}

// Sınıf Oluşturma
function createClass() {
    const className = getInputValue('className');
    if (!className) {
        alert('Sınıf adı boş olamaz.');
        return;
    }

    const newClass = {
        id: Date.now(),
        name: className,
        students: []
    };

    classes.push(newClass);
    localStorage.setItem('classes', JSON.stringify(classes));
    alert(`"${className}" sınıfı başarıyla oluşturuldu.`);
    clearInput('className');
    updateClassSelect();
}

// Öğrenci Ekleme
function addStudent() {
    const studentName = getInputValue('studentName');
    const classId = getSelectValue('classSelect');

    if (!studentName || !classId) {
        alert("Öğrenci adı ve sınıf seçimi yapmalısınız.");
        return;
    }

    const newStudent = { id: Date.now(), name: studentName, classId };
    students.push(newStudent);

    const selectedClass = classes.find(c => c.id == classId);
    selectedClass.students.push(newStudent);

    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('classes', JSON.stringify(classes));

    alert(`${studentName}, sınıfa başarıyla eklendi.`);
    clearInput('studentName');
}

// Yoklama için öğrenci listesini yükle
function loadStudentsForAttendance() {
    const classId = getSelectValue('attendanceClassSelect');
    const attendanceList = document.getElementById('attendanceList');

    attendanceList.innerHTML = '';

    if (!classId) {
        alert('Lütfen bir sınıf seçin.');
        return;
    }

    const selectedClass = classes.find(c => c.id == classId);
    if (!selectedClass || !selectedClass.students.length) {
        attendanceList.innerHTML = '<li>Bu sınıfta öğrenci yok.</li>';
        return;
    }

    selectedClass.students.forEach(student => {
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `attendance-${student.id}`;
        checkbox.value = student.id;

        const label = document.createElement('label');
        label.htmlFor = `attendance-${student.id}`;
        label.textContent = student.name;

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        attendanceList.appendChild(listItem);
    });
}

// Yoklama al
function takeAttendance() {
    const classId = getSelectValue('attendanceClassSelect');
    const attendanceList = document.getElementById('attendanceList');

    if (!classId) {
        alert('Lütfen bir sınıf seçin.');
        return;
    }

    const selectedClass = classes.find(c => c.id == classId);
    if (!selectedClass) {
        alert('Sınıf bulunamadı.');
        return;
    }

    const attendance = [];
    const checkboxes = attendanceList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        attendance.push({
            studentId: parseInt(checkbox.value),
            present: checkbox.checked
        });
    });

    const attendanceRecord = {
        classId,
        date: new Date().toLocaleDateString(),
        attendance
    };

    attendanceRecords.push(attendanceRecord);
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));

    alert('Yoklama başarıyla alındı.');
    attendanceList.innerHTML = '';
    document.getElementById('attendanceClassSelect').value = '';
}

// Yardımcı Fonksiyonlar
function getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
}

function getSelectValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
}

function toggleVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = isVisible ? 'block' : 'none';
    }
}

function clearInput(id) {
    const element = document.getElementById(id);
    if (element) {
        element.value = '';
    }
}

function updateClassSelect() {
    populateSelect('classSelect', classes);
    populateSelect('attendanceClassSelect', classes);
}

function populateSelect(selectId, data) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;

    selectElement.innerHTML = '<option value="">Sınıf Seçin</option>';
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        selectElement.appendChild(option);
    });
}
