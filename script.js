// Verilerin Yerel Depodan Yüklenmesi
let classes = JSON.parse(localStorage.getItem('classes')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];
let teachers = JSON.parse(localStorage.getItem('teachers')) || [
    { username: "teacher1", password: "password1" },
    { username: "teacher2", password: "password2" }
];

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

// Sınıf ve Öğrenci Seçeneklerini Güncelleme
function updateClassSelect() {
    populateSelect('classSelect', classes);
    populateSelect('attendanceClassSelect', classes);
    loadStudentsList();
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
    loadStudentsList();
}

// Öğrenci Listesini Güncelleme
function loadStudentsList() {
    const studentList = document.getElementById('studentList');
    if (!studentList) return;

    studentList.innerHTML = '';
    students.forEach(student => {
        const studentClass = classes.find(c => c.id == student.classId);
        const listItemText = studentClass 
            ? `${student.name} (${studentClass.name})` 
            : `${student.name} (Sınıf bulunamadı)`;

        const listItem = document.createElement('li');
        listItem.textContent = listItemText;
        studentList.appendChild(listItem);
    });
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
