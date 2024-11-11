const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const btn_submit = document.getElementById("submit");

function validateFormBlank() {
    return password.value !== "" && confirmPassword.value !== "";
}
function validatePassword(password) {
    return password.length > 6;
}
function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

btn_submit.addEventListener("click", async (e) => {
    e.preventDefault();
    btn_submit.disabled = true;
    console.log("click");
    if (!validateFormBlank()) {
        alert("Please fill in all fields");
        return;
    }
    if (!validatePassword(password.value)) {
        alert("Password must be at least 6 characters");
        return;
    }
    if (!validatePasswordMatch(password.value, confirmPassword.value)) {
        alert("Password and confirm password must be the same");
        return;
    }
    console.log(window.location.pathname.split("/")[3]);
    const response = await fetch("/auth/updatepassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            password: password.value,
            token: window.location.pathname.split("/")[3],
        }),
    });
    const data = await response.json();
    if (data.error) {
        alert(data.error);
    } else {
        alert("Password reset successfully");
        window.location.href = "/login";
    }
    btn_submit.disabled = false;
});
