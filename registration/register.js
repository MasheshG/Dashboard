let form = document.querySelector('form');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    let user = document.getElementById('user');
    let pass = document.getElementById('pass');
    let cpass = document.getElementById('cpass');
    let mail = document.getElementById('mail');
    let num = document.getElementById('num');

    let usererror = document.getElementById('uerror');
    let perror = document.getElementById('perror');
    let merror = document.getElementById('merror');
    let cperror = document.getElementById('cperror');
    let nerror = document.getElementById('nerror');

    // Clear errors
    usererror.textContent = "";
    perror.textContent = "";
    merror.textContent = "";
    cperror.textContent = "";
    nerror.textContent = "";

    let valid = true;

    if (!user.value.trim()) {
        usererror.textContent = "Username cannot be empty";
        valid = false;
    } else if (user.value.length < 3 || user.value.length > 15) {
        usererror.textContent = "Username must be 3–15 characters";
        valid = false;
    }

    if (!pass.value.trim()) {
        perror.textContent = "Password cannot be empty";
        valid = false;
    } else if (pass.value.length < 5 || pass.value.length > 15) {
        perror.textContent = "Password must be 5–15 characters";
        valid = false;
    }

    if (!cpass.value.trim()) {
        cperror.textContent = "Confirm password cannot be empty";
        valid = false;
    } else if (cpass.value !== pass.value) {
        cperror.textContent = "Passwords do not match";
        valid = false;
    }

    if (!num.value.trim()) {
        nerror.textContent = "Number cannot be empty";
        valid = false;
    } else if (!/^\d{10}$/.test(num.value)) {
        nerror.textContent = "Enter a valid 10-digit number";
        valid = false;
    }

    if (!mail.value.trim()) {
        merror.textContent = "Email cannot be empty";
        valid = false;
    } else if (!mail.value.includes("@")) {
        merror.textContent = "Invalid email address";
        valid = false;
    }

    if (valid) {
        const register = {
            username: user.value.trim(),
            email: mail.value.trim(),
            password: pass.value.trim(),
            number: num.value.trim()
        };

        localStorage.setItem("email", register.email);
        localStorage.setItem("password", register.password);

        alert("Registration successful");

        form.reset();

    }
});
