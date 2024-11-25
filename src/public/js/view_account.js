const user_name = document.getElementById("user_name");
const user_email = document.getElementById("user_email");
const user_reg = document.getElementById("user_reg");
const user_role = document.getElementById("user_role");
const user_state = document.getElementById("user_state");
const search_button = document.querySelector(".search-button");
const search_input = document.querySelector(".search-input");
const acc__roles = document.querySelectorAll(".acc__role");
const acc__states = document.querySelectorAll(".acc__state");
const trs = document.querySelectorAll("tr:not(thead tr)");
const sort__info = document.querySelector("#sort__info");

let sort = sort__info.getAttribute("sort") || "";
let order = sort__info.getAttribute("order") || "";
order = order === "true";
console.log("order", order);
let user_search = search_input.value || "";
let user_name_isIncrement = false;
let user_email_isIncrement = false;
let user_reg_isIncrement = false;
let user_role_isIncrement = false;
let user_state_isIncrement = false;
let user_which_sort = {
    key: "",
    order: "",
};
// <span class="total-pages">{{pages}}</span>
let pages = document.querySelector(".total-pages").textContent;
const currentPageInput = document.querySelector(".current-page");
const prev_btn = document.querySelector(".prev-btn");
const next_btn = document.querySelector(".next-btn");
let currentPage = currentPageInput.value;

function whereSort() {
    if (sort === "user_name") {
        console.log("sort", sort);
        console.log("order", order);
        if (order == true) {
            user_name.classList.add("sorted-asc");
            user_name.classList.remove("sorted-desc");
        } else {
            user_name.classList.add("sorted-desc");
            user_name.classList.remove("sorted-asc");
        }
    } else if (sort === "user_email") {
        if (order == true) {
            user_email.classList.add("sorted-asc");
            user_email.classList.remove("sorted-desc");
        } else {
            user_email.classList.add("sorted-desc");
            user_email.classList.remove("sorted-asc");
        }
    } else if (sort === "user_reg") {
        if (order == true) {
            user_reg.classList.add("sorted-asc");
            user_reg.classList.remove("sorted-desc");
        } else {
            user_reg.classList.add("sorted-desc");
            user_reg.classList.remove("sorted-asc");
        }
    } else if (sort === "user_role") {
        if (order == true) {
            user_role.classList.add("sorted-asc");
            user_role.classList.remove("sorted-desc");
        } else {
            user_role.classList.add("sorted-desc");
            user_role.classList.remove("sorted-asc");
        }
    } else if (sort === "user_state") {
        if (order == true) {
            user_state.classList.add("sorted-asc");
            user_state.classList.remove("sorted-desc");
        } else {
            user_state.classList.add("sorted-desc");
            user_state.classList.remove("sorted-asc");
        }
    }
}
function removeSort() {
    if (sort != "user_name") {
        user_name.classList.remove("sorted-asc", "sorted-desc");
    }
    if (sort != "user_email") {
        user_email.classList.remove("sorted-asc", "sorted-desc");
    }
    if (sort != "user_reg") {
        user_reg.classList.remove("sorted-asc", "sorted-desc");
    }
    if (sort != "user_role") {
        user_role.classList.remove("sorted-asc", "sorted-desc");
    }
    if (sort != "user_state") {
        user_state.classList.remove("sorted-asc", "sorted-desc");
    }
}

function changeSort(newsort, neworder) {
    sort = newsort;
    order = neworder;
    removeSort();
    whereSort();
}

function resetSort() {
    sort = "";
    order = "";
    removeSort();
}
whereSort();
function makePagination(currentPage) {
    if (currentPage == 1) {
        prev_btn.setAttribute("disabled", "true");
    } else {
        prev_btn.removeAttribute("disabled");
    }

    if (currentPage == pages) {
        console.log("pages", pages);
        next_btn.setAttribute("disabled", "true");
    } else {
        next_btn.removeAttribute("disabled");
    }
    currentPageInput.value = currentPage;
}
makePagination(currentPage);

prev_btn.addEventListener("click", async () => {
    currentPage--;
    makePagination(currentPage);

    const criteria = {};
    if (user_which_sort.key !== "") {
        criteria[user_which_sort.key] = user_which_sort.order;
    }
    const user = await fetch("/admin/sortview", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ criteria, user_search, currentPage }),
    }).then((res) => res.json());
    render(user);
    history.pushState(
        null,
        null,
        `/admin/viewaccount?search=${user_search}&page=${currentPage}&sort=${user_which_sort.key}&order=${user_which_sort.order}`
    );
});
next_btn.addEventListener("click", async () => {
    currentPage++;
    makePagination(currentPage);
    console.log("next", currentPage);
    const criteria = {};
    if (user_which_sort.key !== "") {
        criteria[user_which_sort.key] = user_which_sort.order;
    }
    const user = await fetch("/admin/sortview", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ criteria, user_search, currentPage }),
    }).then((res) => res.json());
    render(user);
    history.pushState(
        null,
        null,
        `/admin/viewaccount?search=${user_search}&page=${currentPage}&sort=${user_which_sort.key}&order=${user_which_sort.order}`
    );
});

currentPageInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
        currentPage = currentPageInput.value;
        makePagination(currentPage);
        const criteria = {};
        if (user_which_sort.key !== "") {
            criteria[user_which_sort.key] = user_which_sort.order;
        }
        const user = await fetch("/admin/sortview", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ criteria, user_search, currentPage }),
        }).then((res) => res.json());
        render(user);
        history.pushState(
            null,
            null,
            `/admin/viewaccount?search=${user_search}&page=${currentPage}&sort=${user_which_sort.key}&order=${user_which_sort.order}`
        );
    }
});
function render(users) {
    const tbody = document.querySelector("tbody");
    const trs = tbody.querySelectorAll("tr");
    users.forEach((user, index) => {
        const tr = trs[index];
        tr.style.display = "table-row";
        tr.querySelector(
            ".customer-name"
        ).innerHTML = `<img class="acc_avatar" src="${user.user_image}" alt="" />${user.fullName}`;
        tr.querySelector(".acc__name").textContent = user.username;
        tr.querySelector(".acc_reg").textContent = user.registration_time;
        tr.querySelector(".acc__role").textContent =
            user.role === "admin" ? "Admin" : "Customer";
        tr.querySelector(".acc__role").classList.remove(
            "acc_admin",
            "acc_customer"
        );
        if (user.role === "admin") {
            tr.querySelector(".acc__role").classList.add("acc_admin");
        } else {
            tr.querySelector(".acc__role").classList.add("acc_customer");
        }
        tr.querySelector(".acc__state").textContent =
            user.state === "ban" ? "Ban" : "No Ban";
        tr.querySelector(".acc__state").classList.remove(
            "acc_ban",
            "acc_noban"
        );
        tr.querySelector(".acc__state").classList.add(`acc_${user.state}`);
        tr.id = user.id;
    });
    if (users.length < trs.length) {
        for (let i = users.length; i < trs.length; i++) {
            trs[i].style.display = "none";
        }
    }
}

user_name.addEventListener("click", async () => {
    user_email.disable = true;
    user_which_sort.key = "user_name";
    user_name_isIncrement = !user_name_isIncrement;
    user_which_sort.order = user_name_isIncrement;
    // Gửi yêu cầu đến server
    const criteria = {
        user_name: user_name_isIncrement,
    };
    const users = await fetch("/admin/sortview", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ criteria, user_search, currentPage: 1 }),
    }).then((res) => res.json());
    changeSort("user_name", user_name_isIncrement);
    currentPage = 1;
    makePagination(currentPage);
    render(users);
    user_email.disable = false;
    history.pushState(
        null,
        null,
        `/admin/viewaccount?search=${user_search}&page=${currentPage}&sort=${user_which_sort.key}&order=${user_which_sort.order}`
    );
});

user_email.addEventListener("click", async () => {
    user_email.disable = true;
    user_email_isIncrement = !user_email_isIncrement;
    user_which_sort.key = "user_email";
    user_which_sort.order = user_email_isIncrement;
    // Gửi yêu cầu đến server
    const criteria = {
        user_email: user_email_isIncrement,
    };
    const users = await fetch("/admin/sortview", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ criteria, user_search, currentPage: 1 }),
    }).then((res) => res.json());
    changeSort("user_email", user_email_isIncrement);
    currentPage = 1;
    makePagination(currentPage);
    render(users);
    user_email.disable = false;
    history.pushState(
        null,
        null,
        `/admin/viewaccount?search=${user_search}&page=${currentPage}&sort=${user_which_sort.key}&order=${user_which_sort.order}`
    );
});

user_reg.addEventListener("click", async (event) => {
    user_reg.disable = true;
    user_reg_isIncrement = !user_reg_isIncrement;
    user_which_sort.key = "user_reg";
    user_which_sort.order = user_reg_isIncrement;
    // Gửi yêu cầu đến server
    const criteria = {
        user_reg: user_reg_isIncrement,
    };
    const users = await fetch("/admin/sortview", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ criteria, user_search, currentPage: 1 }),
    }).then((res) => res.json());
    changeSort("user_reg", user_reg_isIncrement);
    currentPage = 1;
    makePagination(currentPage);
    render(users);
    user_reg.disable = false;
    history.pushState(
        null,
        null,
        `/admin/viewaccount?search=${user_search}&page=${currentPage}&sort=${user_which_sort.key}&order=${user_which_sort.order}`
    );
});

user_role.addEventListener("click", async () => {
    user_role.disable = true;
    user_role_isIncrement = !user_role_isIncrement;
    user_which_sort.key = "user_role";
    user_which_sort.order = user_role_isIncrement;
    // Gửi yêu cầu đến server
    const criteria = {
        user_role: user_role_isIncrement,
    };
    const users = await fetch("/admin/sortview", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ criteria, user_search, currentPage: 1 }),
    }).then((res) => res.json());
    changeSort("user_role", user_role_isIncrement);
    currentPage = 1;
    makePagination(currentPage);
    render(users);
    user_role.disable = false;
    history.pushState(
        null,
        null,
        `/admin/viewaccount?search=${user_search}&page=${currentPage}&sort=${user_which_sort.key}&order=${user_which_sort.order}`
    );
});

user_state.addEventListener("click", async () => {
    user_state.disable = true;
    user_state_isIncrement = !user_state_isIncrement;
    user_which_sort.key = "user_state";
    user_which_sort.order = user_state_isIncrement;
    // Gửi yêu cầu đến server
    const criteria = {
        user_state: user_state_isIncrement,
    };
    const users = await fetch("/admin/sortview", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ criteria, user_search, currentPage: 1 }),
    }).then((res) => res.json());
    changeSort("user_state", user_state_isIncrement);
    currentPage = 1;
    makePagination(currentPage);
    render(users);
    user_state.disable = false;
    history.pushState(
        null,
        null,
        `/admin/viewaccount?search=${user_search}&page=${currentPage}&sort=${user_which_sort.key}&order=${user_which_sort.order}`
    );
});

search_button.addEventListener("click", async () => {
    search_input.disable = true;
    user_search = search_input.value;
    const users = await fetch("/admin/sortview", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_search, currentPage: 1 }),
    }).then((res) => res.json());
    pages = await fetch("/admin/countsearch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_search }),
    }).then((res) => res.json());
    document.querySelector(".total-pages").textContent = pages;
    currentPageInput.max = pages;
    render(users);
    user_name_isIncrement = false;
    user_email_isIncrement = false;
    user_reg_isIncrement = false;
    user_role_isIncrement = false;
    user_state_isIncrement = false;
    user_which_sort.key = "";
    user_which_sort.order = "";
    currentPage = 1;
    makePagination(currentPage);
    resetSort();
    search_input.disable = false;
    console.log(
        "search",
        `/admin/viewaccount?search=${user_search}&page=${currentPage}&sort=${user_which_sort.key}&order=${user_which_sort.order}`
    );
    history.pushState(
        null,
        null,
        `/admin/viewaccount?search=${user_search}&page=${currentPage}&sort=${user_which_sort.key}&order=${user_which_sort.order}`
    );
});
const accRoles = {};
const accStates = {};
acc__roles.forEach((acc__role) => {
    acc__role.addEventListener("click", async (event) => {
        event.stopPropagation();
        //ra cha của nó là tr lấy id
        const td = acc__role.parentElement;
        const tr = td.parentElement;
        if (accRoles[tr.id] === undefined) {
            accRoles[tr.id] = acc__role.innerHTML;
            if (accStates[tr.id] === undefined) {
                accStates[tr.id] = td.nextElementSibling.children[0].innerHTML;
            }
        }
        acc__role.innerHTML =
            acc__role.innerHTML === "Admin" ? "Customer" : "Admin";
        if (acc__role.innerHTML === "Admin") {
            acc__role.classList.remove("acc_customer");
            acc__role.classList.add("acc_admin");
        } else {
            acc__role.classList.remove("acc_admin");
            acc__role.classList.add("acc_customer");
        }
        td.nextElementSibling.nextElementSibling.children[0].classList.add(
            "icon__inner--active"
        );
        td.nextElementSibling.nextElementSibling.children[1].classList.add(
            "icon__input--inputed"
        );
    });
});

acc__states.forEach((acc__state) => {
    acc__state.addEventListener("click", async (event) => {
        event.stopPropagation();
        const td = acc__state.parentElement;
        const tr = td.parentElement;
        if (accStates[tr.id] === undefined) {
            accStates[tr.id] = acc__state.innerHTML;
            if (accRoles[tr.id] === undefined) {
                accRoles[tr.id] =
                    td.previousElementSibling.children[0].innerHTML;
            }
        }
        acc__state.innerHTML =
            acc__state.innerHTML === "Ban" ? "No Ban" : "Ban";
        if (acc__state.innerHTML === "Ban") {
            acc__state.classList.remove("acc_noban");
            acc__state.classList.add("acc_ban");
        } else {
            acc__state.classList.remove("acc_ban");
            acc__state.classList.add("acc_noban");
        }
        td.nextElementSibling.children[0].classList.add("icon__inner--active");
        td.nextElementSibling.children[1].classList.add("icon__input--inputed");
    });
});
const acc_accepts = document.querySelectorAll(".acc_accept");
const acc_cancels = document.querySelectorAll(".acc_notaccepct");

acc_accepts.forEach((acc_accept) => {
    acc_accept.addEventListener("click", async (event) => {
        event.stopPropagation();
        const tr = acc_accept.parentElement.parentElement.parentElement;
        const id = tr.id;
        let role = tr.querySelector(".acc__role").innerHTML;
        let state = tr.querySelector(".acc__state").innerHTML;
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
        const message = await fetch("/admin/updateuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, role, state }),
        }).then((res) => res.json());
        if (message === "success") {
            acc_accept.parentElement.classList.remove("icon__inner--active");
            acc_accept.parentElement.nextElementSibling.classList.remove(
                "icon__input--inputed"
            );
            accRoles[tr.id] = undefined;
            accStates[tr.id] = undefined;
        } else {
            alert("Can't update your account");
            acc_accept.nextElementSibling?.click();
        }
    });
});

acc_cancels.forEach((acc_cancel) => {
    acc_cancel.addEventListener("click", async (event) => {
        event.stopPropagation();
        const tr = acc_cancel.parentElement.parentElement.parentElement;
        let role = accRoles[tr.id];
        tr.querySelector(".acc__role").innerHTML = role;
        if (role === "Admin") {
            role = "admin";
        } else {
            role = "customer";
        }

        let state = accStates[tr.id];
        tr.querySelector(".acc__state").innerHTML = state;
        if (state === "Ban") {
            state = "ban";
        } else {
            state = "noban";
        }

        tr.querySelector(".acc__role").classList.remove(
            "acc_admin",
            "acc_customer"
        );
        tr.querySelector(".acc__state").classList.remove(
            "acc_ban",
            "acc_noban"
        );

        tr.querySelector(".acc__role").classList.add(`acc_${role}`);

        tr.querySelector(".acc__state").classList.add(`acc_${state}`);

        acc_cancel.parentElement.classList.remove("icon__inner--active");
        acc_cancel.parentElement.nextElementSibling.classList.remove(
            "icon__input--inputed"
        );
        accRoles[tr.id] = undefined;
        accStates[tr.id] = undefined;
    });
});

trs.forEach((tr) => {
    tr.addEventListener("click", () => {
        window.location.href = `/admin/viewaccount/${tr.id}`;
    });
});
