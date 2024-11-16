// Firebase Configuration and Initialization
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtw3dBVcjhftDX7KqGdpdfAH7rCZuSGM4",
  authDomain: "yoklama-sistss.firebaseapp.com",
  projectId: "yoklama-sistss",
  storageBucket: "yoklama-sistss.firebasestorage.app",
  messagingSenderId: "648200322291",
  appId: "1:648200322291:web:5cbc32a11ca69caeb98b86",
  measurementId: "G-13FDPVPXQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Öğretmen Girişi
function teacherLogin() {
    const email = document.getElementById('teacherUsername').value;
    const password = document.getElementById('teacherPassword').value;
    const loginError = document.getElementById('loginError');

    // Firebase Authentication ile giriş yap
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            loginError.textContent = '';
            localStorage.setItem('loggedInUser', email);
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('teacherPanel').style.display = 'block';
            document.getElementById('sidebar').style.display = 'block';
            loadStudentsList(); // Öğrencileri yükle
        })
        .catch((error) => {
            loginError.textContent = 'Kullanıcı adı veya şifre yanlış.';
            console.error('Giriş hatası: ', error.message);
        });
}

// Öğrencileri Yükle
function loadStudentsList() {
    const studentsRef = ref(db, 'students');
    get(studentsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const students = snapshot.val();
            const studentList = document.getElementById('studentList');
            studentList.innerHTML = '';
            for (const studentId in students) {
                const student = students[studentId];
                const li = document.createElement('li');
                li.textContent = `${student.name}`;
                studentList.appendChild(li);
            }
        } else {
            console.log("Öğrenci verisi bulunamadı");
        }
    }).catch((error) => {
        console.error('Veri çekme hatası: ', error);
    });
}

// Öğrenci Ekle
function addStudent() {
    const studentName = document.getElementById('studentName').value;
    const studentId = Date.now(); // Örnek öğrenci ID
    set(ref(db, 'students/' + studentId), {
        name: studentName
    });
    alert('Öğrenci başarıyla eklendi');
    loadStudentsList();
}

// Sınıf Oluştur
function createClass() {
    const className = document.getElementById('className').value;
    const classId = Date.now(); // Örnek sınıf ID
    set(ref(db, 'classes/' + classId), {
        name: className
    });
    alert('Sınıf başarıyla oluşturuldu');
}

// Sidebar Menüsü
function showSection(sectionId) {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block';
    }
}

// Çıkış Yap
function logout() {
    auth.signOut().then(() => {
        localStorage.removeItem('loggedInUser');
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('teacherPanel').style.display = 'none';
        document.getElementById('sidebar').style.display = 'none';
    }).catch((error) => {
        console.error('Çıkış hatası: ', error);
    });
}

// Firebase Authentication Durumu
auth.onAuthStateChanged((user) => {
    if (user) {
        // Kullanıcı giriş yapmışsa, öğretmen paneline yönlendir
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('teacherPanel').style.display = 'block';
        document.getElementById('sidebar').style.display = 'block';
        loadStudentsList(); // Öğrencileri yükle
    } else {
        // Kullanıcı giriş yapmamışsa, giriş sayfasını göster
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('teacherPanel').style.display = 'none';
        document.getElementById('sidebar').style.display = 'none';
    }
});
