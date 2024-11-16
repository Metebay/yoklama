let students = [];
let classes = [];
let currentClass = '';

function showSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section).classList.add('active');
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Basit bir giriş kontrolü
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username === 'teacher' && password === '1234') {
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
  } else {
    alert('Yanlış kullanıcı adı veya şifre');
  }
});

document.getElementById('studentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('studentName').value;
  const studentClass = document.getElementById('studentClass').value;
  
  const student = {
    id: students.length + 1,
    name: name,
    studentClass: studentClass
  };
  
  students.push(student);
  updateStudentList();
});

function updateStudentList() {
  const tbody = document.getElementById('studentTableBody');
  tbody.innerHTML = '';
  students.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.studentClass}</td>
      <td><button onclick="deleteStudent(${student.id})">Sil</button></td>
    `;
    tbody.appendChild(row);
  });
}

function deleteStudent(id) {
  students = students.filter(student => student.id !== id);
  updateStudentList();
}

document.getElementById('attendanceForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const selectedClass = document.getElementById('attendanceClass').value;
  showAttendance(selectedClass);
});

function showAttendance(className) {
  currentClass = className;
  const attendanceList = document.getElementById('attendanceList');
  attendanceList.innerHTML = `<h3>${className} Yoklaması</h3>`;
  students.filter(s => s.studentClass === className).forEach(student => {
    const label = document.createElement('label');
    label.innerHTML = `${student.name}: <input type="checkbox" data-student-id="${student.id}" />`;
    attendanceList.appendChild(label);
  });
}

function logout() {
  document.getElementById('loginPanel').style.display = 'block';
  document.getElementById('mainContent').style.display = 'none';
}
