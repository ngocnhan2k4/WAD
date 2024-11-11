const email = document.getElementById("email");
const btn_submit = document.getElementById("submit");

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function validateFormBlank() {
    return email.value !== "";
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
        alert(data.error);
    } else {
        alert("Please check your email to reset password");
    }
    btn_submit.disabled = false;
});
