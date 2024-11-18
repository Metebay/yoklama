import { db, auth } from './firebase.js';  // Firebase bağlantısını sağla
import { getDocs, collection, addDoc, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Öğretmen Girişi
function teacherLogin() {
    const username = document.getElementById('teacherUsername').value;
    const password = document.getElementById('teacherPassword').value;
    const loginError = document.getElementById('loginError');

    signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            loginError.textContent = '';
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('teacherPanel').style.display = 'block';
            document.getElementById('sidebar').style.display = 'block'; // Sidebar'ı göster
            updateClassSelect();
        })
        .catch((error) => {
            loginError.textContent = 'Kullanıcı adı veya şifre yanlış.';
        });
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

    getDocs(collection(db, "classes"))
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const classData = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = classData.name;
                classSelect.appendChild(option);

                const attendanceOption = document.createElement('option');
                attendanceOption.value = doc.id;
                attendanceOption.textContent = classData.name;
                attendanceClassSelect.appendChild(attendanceOption);
            });
        });
}

// Sınıf oluşturma
async function createClass() {
    const className = document.getElementById('className').value;
    if (className) {
        try {
            const docRef = await addDoc(collection(db, "classes"), {
                name: className,
                students: []  // Başlangıçta boş öğrenci listesi
            });
            alert('Sınıf başarıyla oluşturuldu.');
            updateClassSelect();  // Sınıf dropdown'ını güncelle
        } catch (e) {
            console.error("Hata oluştu: ", e);
        }
    } else {
        alert("Lütfen geçerli bir sınıf adı girin.");
    }
}

// Öğrenci ekleme
async function addStudent() {
    const studentName = document.getElementById('studentName').value;
    const classId = document.getElementById('classSelect').value;

    if (studentName && classId) {
        const student = { name: studentName, id: Date.now() };
        try {
            const classDocRef = doc(db, "classes", classId);
            await updateDoc(classDocRef, {
                students: arrayUnion(student)  // Öğrenciyi sınıfın öğrenci listesine ekle
            });
            alert(`${studentName} sınıfına eklendi.`);
            loadStudentsList();  // Öğrenci listesini güncelle
        } catch (e) {
            console.error("Hata oluştu: ", e);
        }
    } else {
        alert("Öğrenci adı ve sınıf seçimi yapmalısınız.");
    }
}

// Öğrenci listeleme
function loadStudentsList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';

    getDocs(collection(db, "students"))
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const studentData = doc.data();
                const listItem = document.createElement('li');
                listItem.textContent = `${studentData.name}`;
                studentList.appendChild(listItem);
            });
        });
}

// Öğrenci yoklaması
function loadStudentsForAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';

    if (classId) {
        const classRef = doc(db, "classes", classId);
        getDocs(collection(classRef, "students"))
            .then(querySnapshot => {
                querySnapshot.forEach(studentDoc => {
                    const studentData = studentDoc.data();
                    const listItem = document.createElement('li');
                    listItem.textContent = `${studentData.name}`;
                    attendanceList.appendChild(listItem);
                });
            });
    }
}

// Yoklama alma
function takeAttendance() {
    const attendanceList = document.getElementById('attendanceList');
    const attendanceData = [];

    attendanceList.querySelectorAll('li').forEach(item => {
        const studentName = item.textContent;
        attendanceData.push({
            name: studentName,
            timestamp: new Date(),
        });
    });

    // Yoklama bilgilerini Firestore'a kaydet
    try {
        const docRef = await addDoc(collection(db, "attendanceRecords"), {
            timestamp: new Date(),
            attendanceData
        });
        alert("Yoklama başarıyla alındı.");
    } catch (e) {
        console.error("Yoklama kaydedilemedi: ", e);
    }
}
