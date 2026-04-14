// Validation Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // At least 6 characters
    if (password.length < 6) {
        return { valid: false, message: "Password must be at least 6 characters long" };
    }
    // At least one number
    if (!/\d/.test(password)) {
        return { valid: false, message: "Password must contain at least one number" };
    }
    // At least one capital letter
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one capital letter" };
    }
    return { valid: true, message: "Password is strong" };
}

function validateName(name) {
    if (name.trim().length < 3) {
        return false;
    }
    return /^[a-zA-Z\s]+$/.test(name);
}

// REGISTER
function register() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    const confirmPass = document.getElementById("confirm-password") ? document.getElementById("confirm-password").value : pass;

    // Validation
    if (!name || !email || !pass) {
        showAlert("Please fill all fields", "danger");
        return;
    }

    if (!validateName(name)) {
        showAlert("Name must be at least 3 characters and contain only letters", "danger");
        return;
    }

    if (!validateEmail(email)) {
        showAlert("Please enter a valid email address", "danger");
        return;
    }

    const passwordValidation = validatePassword(pass);
    if (!passwordValidation.valid) {
        showAlert(passwordValidation.message, "danger");
        return;
    }

    if (pass !== confirmPass) {
        showAlert("Passwords do not match", "danger");
        return;
    }

    // Check if email already exists
    const existingUser = localStorage.getItem(email);
    if (existingUser) {
        showAlert("Email already registered. Please login or use a different email.", "warning");
        return;
    }

    const user = { name, email, pass, registeredDate: new Date().toLocaleDateString() };
    localStorage.setItem(email, JSON.stringify(user));

    showAlert("Registered Successfully! Redirecting to login...", "success");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}

// LOGIN
function login() {
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;

    if (!email || !pass) {
        showAlert("Please fill all fields", "danger");
        return;
    }

    if (!validateEmail(email)) {
        showAlert("Please enter a valid email address", "danger");
        return;
    }

    const user = JSON.parse(localStorage.getItem(email));

    if (!user) {
        showAlert("Email not found. Please register first.", "info");
        return;
    }

    if (user.pass !== pass) {
        showAlert("Incorrect password. Please try again.", "danger");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("loginTime", new Date().getTime());
    showAlert("Login successful! Redirecting to dashboard...", "success");
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1500);
}

// LOGOUT
function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loginTime");
    showAlert("Logged out successfully!", "info");
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}