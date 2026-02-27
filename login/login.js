const form = document.getElementById("login-form");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (email === "" || password === "") {
        alert("Please enter email and password");
        return;
    }

    if (!storedEmail || !storedPassword) {
        alert("No account found. Please register first.");
        return;
    }

    if (email === storedEmail && password === storedPassword) {
        alert("Login successful");

        // ✅ RESET FORM
        form.reset();

        // ✅ Small delay so reset is visible
        setTimeout(() => {
            window.location.href = "../homepage/homepage.html";
        }, 300);
    } else {
        alert("Invalid email or password ❌");

        // Optional: clear only password
        passwordInput.value = "";
    }
});
