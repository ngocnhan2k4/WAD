const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const btn_submit = document.getElementById("submit");
const error_password = document.querySelector(".error_password");
const error_confirm = document.querySelector(".error_confirm-password");
const annouce_verify_wrap = document.querySelector(".annouce_verify-wrap");
const annouce_verify = document.querySelector(".annouce_verify");

function validateFormBlank() {
    return password.value !== "" && confirmPassword.value !== "";
}
function validatePassword(password) {
    return password.length > 6;
}
function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

password.addEventListener("input", () => {
    error_password.innerHTML = "";
    error_password.classList.remove("error_true");
});
confirmPassword.addEventListener("input", () => {
    error_confirm.innerHTML = "";
    error_confirm.classList.remove("error_true");
});

btn_submit.addEventListener("click", async (e) => {
    e.preventDefault();
    btn_submit.disabled = true;
    console.log("click");
    if (password.value === "") {
        error_password.innerHTML = "Password is required";
        error_password.classList.add("error_true");
        btn_submit.disabled = false;
        return;
    }
    if (!validatePassword(password.value)) {
        error_password.innerHTML = "Password must be at least 6 characters";
        error_password.classList.add("error_true");
        btn_submit.disabled = false;
        return;
    }
    if (confirmPassword.value === "") {
        error_confirm.innerHTML = "Confirm password is required";
        error_confirm.classList.add("error_true");
        btn_submit.disabled = false;
        return;
    }

    if (!validatePasswordMatch(password.value, confirmPassword.value)) {
        error_confirm.innerHTML = "Password does not match";
        error_confirm.classList.add("error_true");
        btn_submit.disabled = false;
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
        annouce_verify_wrap.classList.add("annouce_verify-wrap_true");
        annouce_verify.innerHTML = "Have an error occurred";
    } else {
        window.location.href = "/user/login";
    }
    btn_submit.disabled = false;
});
