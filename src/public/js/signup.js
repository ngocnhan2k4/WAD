const btn_submit = document.getElementById("submit");
const email = document.getElementById("email");
const password = document.getElementById("password");
const fullName = document.getElementById("name");
const confirmPassword = document.getElementById("confirm");
const aggrement = document.getElementById("aggrement");
const google_btn = document.getElementById("google");
const github_btn = document.getElementById("github");
const error_email = document.querySelector(".error_email");
const error_password = document.querySelector(".error_password");
const error_fullName = document.querySelector(".error_fullName");
const error_confirm = document.querySelector(".error_confirm-password");
const annouce_verify = document.querySelector(".annouce_verify-wrap");
let btn_click = false;
let error_blank_email = true;
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{7,}$/;
    return re.test(password);
}

function validateFormBlank() {
    return (
        email.value !== "" &&
        password.value !== "" &&
        fullName.value !== "" &&
        confirmPassword.value !== ""
    );
}

email.addEventListener("input", () => {
    if (!btn_click) {
        return;
    }
    // Kiểm tra nếu trường email trống
    if (email.value === "") {
        error_email.innerHTML = "Email is required";
        error_email.classList.add("error_true");
        error_blank_email = true;
        return;
    } else {
        error_blank_email = false;
    }

    if (!validateEmail(email.value)) {
        error_email.innerHTML = "Invalid email";
        error_email.classList.add("error_true");
    } else {
        error_email.innerHTML = "";
        error_email.classList.remove("error_true");
    }
});

fullName.addEventListener("input", () => {
    error_fullName.innerHTML = "";
    error_fullName.classList.remove("error_true");
});

confirmPassword.addEventListener("input", () => {
    error_confirm.innerHTML = "";
    error_confirm.classList.remove("error_true");
});

password.addEventListener("input", () => {
    error_password.innerHTML = "";
    error_password.classList.remove("error_true");
});
aggrement.addEventListener("click", () => {
    aggrement.style.outline = "none";
});

btn_submit.addEventListener("click", async (e) => {
    try {
        e.preventDefault();
        btn_click = true;
        btn_submit.disabled = true;
        annouce_verify.classList.remove("annouce_verify-wrap_true");
        // Kiểm tra các trường đầu vào
        if (fullName.value === "") {
            error_fullName.innerHTML = "Full Name is required";
            error_fullName.classList.add("error_true");
            btn_submit.disabled = false; // Kích hoạt lại nút nếu có lỗi
            return;
        }

        if (email.value === "") {
            error_email.innerHTML = "Email is required";
            error_email.classList.add("error_true");
            error_blank_email = true;
            btn_submit.disabled = false; // Kích hoạt lại nút nếu có lỗi
            return;
        }
        error_blank_email = false;

        if (!validateEmail(email.value)) {
            error_email.innerHTML = "Invalid email";
            error_email.classList.add("error_true");
            btn_submit.disabled = false; // Kích hoạt lại nút nếu có lỗi
            return;
        }

        if (!validatePassword(password.value)) {
            error_password.innerHTML =
                "Password must >6, at least 1 number, 1 A-Z, 1 a-z and 1 special character";
            error_password.classList.add("error_true");
            btn_submit.disabled = false; // Kích hoạt lại nút nếu có lỗi
            return;
        }

        if (password.value !== confirmPassword.value) {
            error_confirm.innerHTML =
                "Password and confirm password must be the same";
            error_confirm.classList.add("error_true");
            btn_submit.disabled = false; // Kích hoạt lại nút nếu có lỗi
            return;
        }

        if (!aggrement.checked) {
            aggrement.style.outline = "1px solid red";
            btn_submit.disabled = false; // Kích hoạt lại nút nếu có lỗi
            return;
        }

        // Gửi yêu cầu đến máy chủ
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
            if (data.error === "Email already taken") {
                error_email.innerHTML = "Email already taken";
                error_email.classList.add("error_true");
            }
        } else {
            error_email.classList.remove("error_true");
            annouce_verify.classList.add("annouce_verify-wrap_true");
        }

        btn_submit.disabled = false; // Kích hoạt lại nút sau khi hoàn tất
    } catch (err) {
        console.log(err);
        btn_submit.disabled = false; // Kích hoạt lại nút khi có lỗi xảy ra
    }
});
google_btn.addEventListener("click", async (e) => {
    e.preventDefault();
    window.location.href = "/auth/google";
});
github_btn.addEventListener("click", async (e) => {
    e.preventDefault();
    window.location.href = "/auth/github";
});
