// Firebase SDK'yı import et
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyDtw3dBVcjhftDX7KqGdpdfAH7rCZuSGM4",
  authDomain: "yoklama-sistss.firebaseapp.com",
  projectId: "yoklama-sistss",
  storageBucket: "yoklama-sistss.firebasestorage.app",
  messagingSenderId: "648200322291",
  appId: "1:648200322291:web:5cbc32a11ca69caeb98b86",
  measurementId: "G-13FDPVPXQW"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elemanlarını Başta Çekme
const loginPage = document.getElementById('loginPage');
const teacherPanel = document.getElementById('teacherPanel');
const sidebar = document.getElementById('sidebar');
const classSelect = document.getElementById('classSelect');
const studentNameInput = document.getElementById('studentName');
const studentsList = document.getElementById('studentsList');
const studentsTable = document.getElementById('studentsTable');
const loginError = document.getElementById('loginError');

// Sabit Öğretmen Bilgileri
const teachers = [
    { username: "teacher1", password: "password1" },
    { username: "teacher2", password: "password2" }
];

// Öğrenci Ekleme
async function addStudent() {
    const studentName = studentNameInput.value;
    const classId = classSelect.value;

    if (!studentName || !classId) return alert("Öğrenci adı ve sınıf seçimi yapmalısınız.");

    try {
        const student = { name: studentName, classId };
        const docRef = await addDoc(collection(db, "students"), student);
        console.log("Öğrenci eklendi: ", docRef.id);
        loadStudentsList(); // Öğrenciyi ekledikten sonra listeyi güncelle
    } catch (e) {
        console.error("Hata oluştu: ", e);
    }
}

// Öğrencileri Listeleme
async function loadStudentsList() {
    studentsList.innerHTML = ''; // Önceki listeyi temizle

    const querySnapshot = await getDocs(collection(db, "students"));
    querySnapshot.forEach((doc) => {
        const studentData = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${studentData.name}</td>
            <td>${studentData.classId}</td>
            <td><button onclick="deleteStudent('${doc.id}')">Sil</button></td>
        `;
        studentsList.appendChild(row);
    });
}

// Öğrenci Silme
async function deleteStudent(studentId) {
    try {
        await deleteDoc(doc(db, "students", studentId));
        console.log("Öğrenci silindi: ", studentId);
        loadStudentsList(); // Silme işleminden sonra listeyi güncelle
    } catch (e) {
        console.error("Silme hatası: ", e);
    }
}

// Öğretmen Girişi
function teacherLogin() {
    const username = document.getElementById('teacherUsername').value;
    const password = document.getElementById('teacherPassword').value;

    const teacher = teachers.find(t => t.username === username && t.password === password);

    if (teacher) {
        loginError.textContent = '';
        localStorage.setItem('loggedInUser', username);
        loginPage.style.display = 'none';
        teacherPanel.style.display = 'block';
        sidebar.style.display = 'block';
        loadStudentsList(); // Öğrencileri yükle
    } else {
        loginError.textContent = 'Kullanıcı adı veya şifre yanlış.';
    }
}

// Sidebar'da Seçilen Bölüme Git
function showSection(sectionId) {
    document.querySelectorAll('.form-section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}
