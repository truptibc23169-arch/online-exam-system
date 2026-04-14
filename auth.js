import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";


// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCWPbll8-LaU3p2fz-5ry2a9MQvSLZzqXk",
  authDomain: "online-exam-system-e32d6.firebaseapp.com",
  projectId: "online-exam-system-e32d6",
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



// ================= VALIDATIONS =================

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters long" };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one capital letter" };
  }
  return { valid: true };
}

function validateName(name) {
  return name.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(name);
}



// ================= REGISTER =================

window.register = async function () {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;
  const confirmPass = document.getElementById("confirm-password").value;

  // Validation
  if (!name || !email || !pass || !confirmPass) {
    showAlert("Please fill all fields", "danger");
    return;
  }

  if (!validateName(name)) {
    showAlert("Name must be at least 3 characters and only letters", "danger");
    return;
  }

  if (!validateEmail(email)) {
    showAlert("Invalid email format", "danger");
    return;
  }

  const passwordCheck = validatePassword(pass);
  if (!passwordCheck.valid) {
    showAlert(passwordCheck.message, "danger");
    return;
  }

  if (pass !== confirmPass) {
    showAlert("Passwords do not match", "danger");
    return;
  }

  try {
    // 🔥 Firebase Signup
    await createUserWithEmailAndPassword(auth, email, pass);

    // 🔥 Save to MongoDB
    await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password: pass })
    });

    localStorage.setItem("currentUser", JSON.stringify({ name, email }));

    showAlert("Registered Successfully!", "success");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

  } catch (err) {
    showAlert(err.message, "danger");
  }
};



// ================= LOGIN =================

window.login = function () {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;

  if (!email || !pass) {
    showAlert("Please fill all fields", "danger");
    return;
  }

  if (!validateEmail(email)) {
    showAlert("Invalid email format", "danger");
    return;
  }

  // 🔥 Firebase Login
  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      localStorage.setItem("currentUser", JSON.stringify({ email }));
      localStorage.setItem("loginTime", new Date().getTime());

      showAlert("Login Successful!", "success");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    })
    .catch(err => showAlert(err.message, "danger"));
};



// ================= LOGOUT =================

window.logout = function () {
  signOut(auth).then(() => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loginTime");

    showAlert("Logged out successfully!", "info");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  });
};



// ================= ALERT FUNCTION =================

function showAlert(message, type) {
  const existingAlert = document.querySelector('.alert');
  if (existingAlert) existingAlert.remove();

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';

  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    if (alertDiv.parentNode) alertDiv.remove();
  }, 3000);
}