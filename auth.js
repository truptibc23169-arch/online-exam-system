import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCWPbll8-LaU3p2fz-5ry2a9MQvSLZzqXk",
  authDomain: "online-exam-system-e32d6.firebaseapp.com",
  projectId: "online-exam-system-e32d6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ================= REGISTER ================= */
async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-password").value;

  if (!name || !email || !pass || !confirm) {
    alert("Please fill all fields");
    return;
  }

  if (pass !== confirm) {
    alert("Passwords do not match");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, pass);

    localStorage.setItem("currentUser", JSON.stringify({ name, email }));

    alert("Registered Successfully 🎉");

    window.location.href = "./login.html";
  } catch (e) {
    alert(e.message);
  }
}

/* ================= LOGIN ================= */
async function login() {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;

  if (!email || !pass) {
    alert("Please fill all fields");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, pass);

    localStorage.setItem("currentUser", JSON.stringify({ email }));

    alert("Login Successful 🎉");

    window.location.href = "./dashboard.html";
  } catch (e) {
    alert(e.message);
  }
}

/* expose functions to HTML */
window.register = register;
window.login = login;