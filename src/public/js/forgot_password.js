const email = document.getElementById("email");
const btn_submit = document.getElementById("submit");
const email_error = document.getElementById("email-error");

function validateFormBlank() {
    return email.value !== "";
}

email.addEventListener("input", () => {
    email_error.innerHTML = "";
    email_error.classList.add("hidden");
});

btn_submit.addEventListener("click", async (e) => {
    e.preventDefault();
    btn_submit.disabled = true;
    if (!validateFormBlank()) {
        email_error.innerHTML = "Email is required";
        email_error.classList.remove("hidden");
        btn_submit.disabled = false;
        return;
    }
    const response = await fetch("/auth/sendreset", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
        }),
    });
    const data = await response.json();
    if (data.error) {
        email_error.innerHTML = "Not Found Email";
        email_error.classList.remove("hidden");
    } else {
        email_error.innerHTML =
            "Email sent successfully, you can check your email to reset your password";
        email_error.classList.remove("hidden");
        email_error.style.color = "green";
    }
    btn_submit.disabled = false;
});
