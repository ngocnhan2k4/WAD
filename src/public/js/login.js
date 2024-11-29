const email = document.getElementById("email");
const password = document.getElementById("password");
const btn_submit = document.getElementById("submit");
const google_btn = document.getElementById("google");
const github_btn = document.getElementById("github");
const annouce_wrap = document.querySelector(".annouce-wrap");
const annouce_img = document.querySelector(".annouce-img");
const annouce = document.querySelector(".annouce");

btn_submit.addEventListener("click", async (e) => {
    e.preventDefault();
    btn_submit.disabled = true;
    if (email.value === "" || password.value === "") {
        annouce_wrap.classList.add("annouce-wrap_true");
        annouce_wrap.style.backgroundColor = "#965cc2";
        annouce_img.src = "/images/icons/error.png";
        annouce.innerHTML = "Please fill in all fields";
        annouce.style.color = "white";
        btn_submit.disabled = false;
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
        if (data.error === "Email not verified") {
            annouce_wrap.classList.add("annouce-wrap_true");
            annouce_wrap.style.backgroundColor = "#ecdecb";
            annouce_img.src = "/images/icons/annouce_warning.png";
            annouce.innerHTML = "Email not verified";
            annouce.style.color = "#5a3e07";
        } else {
            annouce_wrap.classList.add("annouce-wrap_true");
            annouce_wrap.style.backgroundColor = "#491b1bdb";
            annouce_img.src = "/images/icons/error.png";
            annouce.innerHTML = data.error;
            annouce.style.color = "white";
        }
    } else {
        window.location.href = "/";
    }
    btn_submit.disabled = false;
});

google_btn.addEventListener("click", async (e) => {
    e.preventDefault();
    window.location.href = "/auth/google";
});

github_btn.addEventListener("click", async (e) => {
    e.preventDefault();
    window.location.href = "/auth/github";
});
