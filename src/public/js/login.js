const email = document.getElementById("email");
const password = document.getElementById("password");
const btn_submit = document.getElementById("submit");
const google_btn = document.getElementById("google");
alert("Please fill in all fields");

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validateFormBlank() {
    return email.value !== "" && password.value !== "";
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
    const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    });
    const data = await response.json();
    if (data.error) {
        alert(data.error);
    } else {
        alert("Login successful");
        window.location.href = "/product";
    }
    btn_submit.disabled = false;
});
