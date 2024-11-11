const btn_submit = document.getElementById("submit");
const email = document.getElementById("email");
const password = document.getElementById("password");
const fullName = document.getElementById("name");
const confirmPassword = document.getElementById("confirm");
const google_btn = document.getElementById("google");

alert("Please fill in all fields");

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function validatePassword(password) {
    return password.length > 6;
}

function validateFormBlank() {
    return (
        email.value !== "" &&
        password.value !== "" &&
        fullName.value !== "" &&
        confirmPassword.value !== ""
    );
}

btn_submit.addEventListener("click", async (e) => {
    e.preventDefault();

    btn_submit.disabled = true;
    if (!validateFormBlank()) {
        alert("Please fill in all fields");
        return;
    }
    if (!validateEmail(email.value)) {
        alert("Invalid email");
        return;
    }
    if (!validatePassword(password.value)) {
        alert("Password must be at least 6 characters");
        return;
    }
    if (password.value !== confirmPassword.value) {
        alert("Password and confirm password must be the same");
        return;
    }
    const response = await fetch("/auth/signuplocal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
            fullName: fullName.value,
        }),
    });
    const data = await response.json();
    if (data.error) {
        alert(data.error);
    } else {
        alert("Please Verify Your Email");
    }
    btn_submit.disabled = false;
});

google_btn.addEventListener("click", async (e) => {
    e.preventDefault();
    window.location.href = "/auth/google";
});
