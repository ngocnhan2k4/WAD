const heading = document.getElementById("editableHeading");
const search__button = document.querySelector(".view__product__search__button");
const id = document.querySelector(".view__id").id;
const type = document.querySelector(".view__id").getAttribute("type");
const product__items = document.querySelectorAll(".product__item");
const view__status = document.querySelector(".view__status");
const product_detele = [];
const delete__products = document.querySelectorAll(".delete__product");
const delete__btn = document.querySelector(".delete__btn");
const update__btn = document.querySelector(".update__btn");
const dialog = document.querySelector(".dialog");
const overlay = document.querySelector(".overlay");
const cancel_btn_dialog = document.querySelector(".cancel-btn");
const delete_btn_dialog = document.querySelector(".delete-btn");
const dialog_close_dialog = document.querySelector(".dialog-close");

function showOverlay() {
    overlay.classList.add("overlay-active");
    document.body.style.overflow = "hidden";
    dialog.style.display = "block";
}
overlay.addEventListener("click", function () {
    overlay.classList.remove("overlay-active");
    document.body.style.overflow = "auto";
    dialog.style.display = "none";
});
cancel_btn_dialog.addEventListener("click", () => {
    overlay.classList.remove("overlay-active");
    document.body.style.overflow = "auto";
    dialog.style.display = "none";
});
dialog_close_dialog.addEventListener("click", () => {
    overlay.classList.remove("overlay-active");
    document.body.style.overflow = "auto";
    dialog.style.display = "none";
});
// Gắn sự kiện click để kích hoạt chế độ chỉnh sửa
heading.addEventListener("click", () => {
    heading.setAttribute("contenteditable", "true"); // Cho phép chỉnh sửa
    heading.focus(); // Đưa con trỏ vào thẻ h2 để chỉnh sửa
});

// Gắn sự kiện để lưu nội dung khi nhấn phím Enter
heading.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Ngăn xuống dòng
        heading.setAttribute("contenteditable", "false"); // Tắt chế độ chỉnh sửa
    }
});
function displayProductItems(ids) {
    product__items.forEach((product__item) => {
        const id = Number(product__item.getAttribute("id"));
        console.log(id);
        if (!ids.includes(id)) {
            product__item.style.display = "none";
        } else {
            product__item.style.display = "flex";
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

delete__products.forEach((delete__product) => {
    if (id === "20") return;
    delete__product.addEventListener("click", () => {
        view__status.textContent = "";
        view__status.style.display = "none";
        const id = Number(delete__product.getAttribute("id"));
        if (product_detele.includes(id) || isNaN(id) || id <= 0) {
            return;
        }
        product_detele.push(id);
        delete__product.parentElement.style.display = "none";
    });
});

update__btn.addEventListener("click", async () => {
    update__btn.disable = true;
    if (id === "20") return;
    let url = "/admin/deleteproductsfromcategory";
    if (type !== "category") {
        url = "/admin/deleteproductsfrommanufacturer";
    }

    const res = await fetch(`${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_detele, id }),
    }).then((res) => res.json());
    if (res.status === "success") {
        view__status.textContent = "Update success";
        view__status.style.color = "green";
        view__status.style.display = "block";
    } else {
        view__status.textContent = "Update fail";
        view__status.style.color = "red";
        view__status.style.display = "block";
    }
    setTimeout(() => {
        view__status.textContent = "";
        view__status.style.display = "none";
    }, 2000);
    update__btn.disable = false;
});

delete__btn.addEventListener("click", () => {
    if (id === "20") return;
    for (let i = 0; i < product__items.length; i++) {
        if (product__items[i].style.display !== "none") {
            view__status.textContent = "Please delete all products";
            view__status.style.color = "red";
            view__status.style.display = "block";
            setTimeout(() => {
                view__status.textContent = "";
                view__status.style.display = "none";
            }, 2000);
            return;
        }
    }
    showOverlay();
});
delete_btn_dialog.addEventListener("click", async () => {
    if (id === "20") return;
    delete_btn_dialog.disable = true;
    let url = "/admin/deletecategory";
    if (type !== "category") {
        url = "/admin/deletemanufacturer";
    }

    const res = await fetch(`${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    }).then((res) => res.json());
    if (res.status === "success") {
        window.location.href = "/admin/viewcatemanu";
    } else {
        view__status.textContent = "Delete fail";
        view__status.style.color = "red";
        view__status.style.display = "block";
    }
    setTimeout(() => {
        view__status.textContent = "";
        view__status.style.display = "none";
    }, 2000);
    delete_btn_dialog.disable = false;
    overlay.classList.remove("overlay-active");
    document.body.style.overflow = "auto";
    dialog.style.display = "none";
});
