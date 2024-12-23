const menu__navs = document.querySelectorAll(".menu__navv");
const decor__nav = document.querySelector(".decor__nav");
const cate__content = document.querySelector(".cate__content");
const manu__content = document.querySelector(".manu__content");
const shadow = document.querySelector(".shadow");
const add__news = document.querySelectorAll(".add__new");
const add__new_cate = document.querySelector(".add__new-cate");
const add__new_manu = document.querySelector(".add__new-manu");
const dialog = document.querySelector(".dialog");
const cancel_btn = document.querySelector(".cancel-btn");
const save_btn = document.querySelector(".save-btn");
const dialog_status = document.querySelector(".dialog_status");
const dialog_close = document.querySelector(".dialog-close");
const search__cate_btn = document.querySelector(".search__cate-btn");
const search__cate_input = document.querySelector(".search__cate");
const search__manu_btn = document.querySelector(".search__manu-btn");
const search__manu_input = document.querySelector(".search__manu");
const cate__items = document.querySelectorAll(".cate__item");
const manu__items = document.querySelectorAll(".manu__item");

function showShadow() {
    shadow.classList.add("shadow-active");
    document.body.style.overflow = "hidden";
    dialog.style.display = "block";
}
shadow.addEventListener("click", function () {
    shadow.classList.remove("shadow-active");
    document.body.style.overflow = "auto";
    dialog.style.display = "none";
});
menu__navs.forEach((menu__nav) => {
    menu__nav.addEventListener("click", (e) => {
        if (e.target.id === "cate__nav") {
            decor__nav.style.left = "0";
            const clientWidth = e.target.clientWidth;
            const style = window.getComputedStyle(e.target);
            const paddingLeft = parseFloat(style.paddingLeft);
            const paddingRight = parseFloat(style.paddingRight);
            decor__nav.style.width =
                clientWidth - paddingLeft - paddingRight + "px";
            e.target.classList.add("menu__active");
            document
                .getElementById("manu__nav")
                .classList.remove("menu__active");
            cate__content.style.display = "block";
            manu__content.style.display = "none";
        } else if (e.target.id === "manu__nav") {
            decor__nav.style.left =
                document.getElementById("cate__nav").offsetWidth + "px";
            const clientWidth = e.target.clientWidth;
            const style = window.getComputedStyle(e.target);
            const paddingLeft = parseFloat(style.paddingLeft);
            const paddingRight = parseFloat(style.paddingRight);
            decor__nav.style.width =
                clientWidth - paddingLeft - paddingRight + "px";
            e.target.classList.add("menu__active");
            document
                .getElementById("cate__nav")
                .classList.remove("menu__active");
            cate__content.style.display = "none";
            manu__content.style.display = "block";
        }
    });
});

add__news.forEach((add__new) => {
    add__new.addEventListener("click", () => {
        showShadow();
    });
});

add__new_cate.addEventListener("click", () => {
    add__new_cate.classList.add("active");
    add__new_manu.classList.remove("active");
    dialog.id = "category";
    dialog_status.textContent = "";
    document.querySelector(".dialog-header").textContent = "Add new category";
    document.querySelector("#input").placeholder = "Category name";
});

add__new_manu.addEventListener("click", () => {
    add__new_manu.classList.add("active");
    add__new_cate.classList.remove("active");
    dialog.id = "manufacturer";
    dialog_status.textContent = "";
    document.querySelector(".dialog-header").textContent =
        "Add new manufacturer";
    document.querySelector("#input").placeholder = "Manufacturer name";
});

cancel_btn.addEventListener("click", () => {
    shadow.classList.remove("shadow-active");
    document.body.style.overflow = "auto";
    dialog.style.display = "none";
});

save_btn.addEventListener("click", (e) => {
    e.preventDefault();
    const type = dialog.id;
    const input = document.querySelector("#input");
    if (input.value === "") {
        input.style.border = "1px solid red";
        return;
    }
    input.style.border = "1px solid #ccc";
    let name = input.value;
    fetch("/admin/updatemanuorcate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, name }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.status === "success") {
                dialog_status.textContent = "Success";
                dialog_status.style.color = "green";
                dialog_status.style.display = "block";
                input.value = "";
                if (type === "category") {
                    const row = cate__content.children[1];
                    const i = (row.childElementCount + 1) % 3;
                    const img = `/images/img/cate0${i}.png`;
                    row.innerHTML += `
                        <div class="col">
                        <div id="${data.id}" class="cate__item">
                            <img
                                src="${img}"
                                alt="Category img"
                                class="cate__item-image"
                            />
                            <h2 class="cate__item-title">${name}</h2>
                            <div class="cate__item-info">
                                <p>The nums products: </p>
                                <p class="cate__item-description">0</p>
                            </div>
                        </div>
                    </div>
                    `;
                } else {
                    const row = manu__content.children[1];
                    const i = (row.childElementCount + 1) % 3;
                    const img = `/images/img/manu0${i}.png`;
                    row.innerHTML += `
                        <div class="col">
                        <div id="${data.id}" class="manu__item">
                            <img
                                src="${img}"
                                alt="Manufacturer img"
                                class="manu__item-image"
                            />
                            <h2 class="manu__item-title">${name}</h2>
                            <div class="manu__item-info">
                                <p>The nums products: </p>
                                <p class="manu__item-description">0</p>
                            </div>
                        </div>
                    </div>
                    `;
                }
            } else {
                dialog_status.textContent = "Fail";
                dialog_status.style.color = "red";
                dialog_status.style.display = "block";
            }
        });
});

dialog_close.addEventListener("click", () => {
    shadow.classList.remove("shadow-active");
    document.body.style.overflow = "auto";
    dialog.style.display = "none";
});

function checkSearch(search, title) {
    search = search.toLowerCase();
    title = title.toLowerCase();
    return title.includes(search);
}

search__cate_btn.addEventListener("click", () => {
    const search = search__cate_input.value;
    const row = cate__content.children[1];
    const cols = Array.from(row.children);
    cols.forEach((col) => {
        const cate__item = col.children[0];
        const title = cate__item.children[1].textContent;
        if (checkSearch(search, title)) {
            col.style.display = "block";
        } else {
            col.style.display = "none";
        }
    });
});

search__manu_btn.addEventListener("click", () => {
    const search = search__manu_input.value;
    const row = manu__content.children[1];
    const cols = Array.from(row.children);
    cols.forEach((col) => {
        const manu__item = col.children[0];
        const title = manu__item.children[1].textContent;
        if (checkSearch(search, title)) {
            col.style.display = "block";
        } else {
            col.style.display = "none";
        }
    });
});

cate__items.forEach((cate__item) => {
    cate__item.addEventListener("click", () => {
        const cate_id = cate__item.id;
        window.location.href = `/admin/cate/${cate_id}`;
    });
});

manu__items.forEach((manu__item) => {
    manu__item.addEventListener("click", () => {
        const manu_id = manu__item.id;
        window.location.href = `/admin/manu/${manu_id}`;
    });
});
