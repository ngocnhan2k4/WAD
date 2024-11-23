const acc__role = document.querySelector(".acc__role");
const acc__state = document.querySelector(".acc__state");
const user__id = document.querySelector(".user__id");
const id = user__id.getAttribute("id");
const acc_accept = document.querySelector(".acc_accept");
const acc_notaccepct = document.querySelector(".acc_notaccepct");
const search__button = document.querySelector(".view__product__search__button");
const product__items = document.querySelectorAll(".product__item");
let accrole = acc__role.textContent;
let accstate = acc__state.textContent;

acc__role.addEventListener("click", () => {
    if (acc__role.textContent === "Admin") {
        acc__role.textContent = "Customer";
        acc__role.classList.remove("acc_admin");
        acc__role.classList.add("acc_customer");
    } else {
        acc__role.textContent = "Admin";
        acc__role.classList.remove("acc_customer");
        acc__role.classList.add("acc_admin");
    }
    acc__role.parentElement.children[3].classList.add("icon__inner--active");
    acc__role.parentElement.children[2].classList.add("icon__input--inputed");
});

acc__state.addEventListener("click", () => {
    if (acc__state.textContent === "Ban") {
        acc__state.textContent = "NoBan";
        acc__state.classList.remove("acc_ban");
        acc__state.classList.add("acc_noban");
    } else {
        acc__state.textContent = "Ban";
        acc__state.classList.remove("acc_noban");
        acc__state.classList.add("acc_ban");
    }
    acc__state.parentElement.children[3].classList.add("icon__inner--active");
    acc__state.parentElement.children[2].classList.add("icon__input--inputed");
});

acc_accept.addEventListener("click", async () => {
    let role = acc__role.innerHTML;
    let state = acc__state.innerHTML;
    if (role === "Admin") {
        role = "admin";
    } else {
        role = "customer";
    }
    if (state === "Ban") {
        state = "ban";
    } else {
        state = "noban";
    }

    const userUpdate = await fetch("/admin/updateuser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, role, state }),
    }).then((res) => res.json());
    if (userUpdate) {
        acc__state.parentElement.children[3].classList.remove(
            "icon__inner--active"
        );
        acc__state.parentElement.children[2].classList.remove(
            "icon__input--inputed"
        );
        accrole = role;
        accstate = state;
    }
});

acc_notaccepct.addEventListener("click", () => {
    console.log(accrole, accstate);
    acc__role.textContent = accrole;
    acc__state.textContent = accstate;
    acc__role.classList.remove("acc_admin", "acc_customer");
    acc__state.classList.remove("acc_ban", "acc_noban");
    acc__role.classList.add(`acc_${accrole.toLowerCase()}`);
    if (accstate === "Ban") {
        acc__state.classList.add("acc_ban");
    } else {
        acc__state.classList.add("acc_noban");
    }
    acc__role.parentElement.children[3].classList.remove("icon__inner--active");
    acc__role.parentElement.children[2].classList.remove(
        "icon__input--inputed"
    );
});

function displayProductItems(ids) {
    product__items.forEach((product__item) => {
        const id = Number(product__item.getAttribute("id"));
        console.log(id);
        if (!ids.includes(id)) {
            product__item.style.display = "none";
        } else {
            product__item.style.display = "block";
        }
    });
}

search__button.addEventListener("click", async () => {
    search__button.disable = true;
    const search = document.querySelector(
        ".view__product__search__input"
    ).value;
    const products_Id = await fetch("/admin/searchproducts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ search, id }),
    }).then((res) => res.json());

    displayProductItems(products_Id);
    search__button.disable = false;
});
