// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
const auth = firebase.auth();

// DOM elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const flashcardSection = document.getElementById("flashcard-section");
const authSection = document.getElementById("auth");
const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");
const flashcardsDiv = document.getElementById("flashcards");

// Sign Up
signupBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert("User created successfully!");
    } catch (error) {
        alert(error.message);
    }
});

// Login
loginBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        await auth.signInWithEmailAndPassword(email, password);
        alert("Logged in successfully!");
        loadFlashcards();
    } catch (error) {
        alert(error.message);
    }
});

// Logout
logoutBtn.addEventListener("click", async () => {
    await auth.signOut();
    authSection.style.display = "block";
    flashcardSection.classList.add("hidden");
});

// Load Flashcards
function loadFlashcards() {
    authSection.style.display = "none";
    flashcardSection.classList.remove("hidden");

    const userId = auth.currentUser.uid;
    
    db.collection('users').doc(userId).collection('flashcards').onSnapshot(snapshot => {
        flashcardsDiv.innerHTML = "";
        snapshot.forEach(doc => {
            const flashcard = doc.data();
            flashcardsDiv.innerHTML += `<div><strong>Q:</strong> ${flashcard.question}<br><strong>A:</strong> ${flashcard.answer}</div>`;
        });
    });
}

// Add Flashcard
document.getElementById("add-flashcard-btn").addEventListener("click", async () => {
    const question = questionInput.value;
    const answer = answerInput.value;

    const userId = auth.currentUser.uid;

    await db.collection('users').doc(userId).collection('flashcards').add({
        question,
        answer
    });

    questionInput.value = "";
    answerInput.value = "";
});
