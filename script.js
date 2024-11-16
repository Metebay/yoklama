// Verileri localStorage'da saklama
let classes = JSON.parse(localStorage.getItem('classes')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];
let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

// Bölümleri göstermek için
document.addEventListener("DOMContentLoaded", () => {
    showSection('classSection');
    updateClassSelects();
    updateStudentList();
});

// Sekmeleri kontrol eder
function showSection(sectionId) {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Sınıf oluşturma
function createClass() {
    const className = document.getElementById('className').value.trim();
    if (className) {
        const newClass = { id: Date.now(), name: className, students: [] };
        classes.push(newClass);
        localStorage.setItem('classes', JSON.stringify(classes));
        alert(`${className} sınıfı başarıyla oluşturuldu.`);
        document.getElementById('className').value = '';
        updateClassSelects();
    } else {
        alert("Lütfen bir sınıf adı girin.");
    }
}

// Sınıf seçimlerini günceller
function updateClassSelects() {
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

// Öğrenci ekleme
function addStudent() {
    const studentName = document.getElementById('studentName').value.trim();
    const classId = document.getElementById('classSelect').value;

    if (studentName && classId) {
        const student = { id: Date.now(), name: studentName, classId: Number(classId) };
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));

        const selectedClass = classes.find(c => c.id === Number(classId));
        if (selectedClass) {
            selectedClass.students.push(student.id);
            localStorage.setItem('classes', JSON.stringify(classes));
        }

        alert(`${studentName} başarıyla eklendi.`);
        document.getElementById('studentName').value = '';
        updateStudentList();
    } else {
        alert("Lütfen bir öğrenci adı ve sınıf seçin.");
    }
}

// Öğrenci listesini güncelleme
function updateStudentList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    students.forEach(student => {
        const studentClass = classes.find(c => c.id === student.classId);
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${student.name} - ${studentClass ? studentClass.name : 'Belirsiz'}
            <button onclick="removeStudent(${student.id})">Sil</button>
        `;
        studentList.appendChild(listItem);
    });
}

// Öğrenciyi silme
function removeStudent(studentId) {
    students = students.filter(s => s.id !== studentId);
    classes.forEach(cls => {
        cls.students = cls.students.filter(id => id !== studentId);
    });

    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('classes', JSON.stringify(classes));
    alert("Öğrenci başarıyla silindi.");
    updateStudentList();
}

// Yoklama için öğrencileri yükleme
function loadStudentsForAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    if (classId) {
        const selectedClass = classes.find(c => c.id === Number(classId));
        if (selectedClass) {
            selectedClass.students.forEach(studentId => {
                const student = students.find(s => s.id === studentId);
                if (student) {
                    const listItem = `
                        <li>
                            <input type="checkbox" id="student-${student.id}" data-id="${student.id}">
                            <label for="student-${student.id}">${student.name}</label>
                        </li>
                    `;
                    attendanceList.innerHTML += listItem;
                }
            });
        }
    }
}

// Yoklama alma
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
        alert("Yoklama başarıyla kaydedildi.");
    } else {
        alert("Lütfen bir sınıf seçin.");
    }
}

// Yoklama raporlarını gösterme
function showAttendanceReports() {
    const attendanceReportsList = document.getElementById('attendanceReportsList');
    attendanceReportsList.innerHTML = '';

    attendanceRecords.forEach(record => {
        const selectedClass = classes.find(c => c.id === record.classId);
        const report = document.createElement('div');
        report.innerHTML = `
            <h3>${selectedClass ? selectedClass.name : 'Belirsiz'} (${record.date})</h3>
            <ul>
                ${record.records.map(r => {
                    const student = students.find(s => s.id === r.studentId);
                    return `<li>${student ? student.name : 'Belirsiz'}: ${r.status ? 'Var' : 'Yok'}</li>`;
                }).join('')}
            </ul>
        `;
        attendanceReportsList.appendChild(report);
    });
}
