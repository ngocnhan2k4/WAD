const search__button = document.querySelector(".view__product__search__button");
const product__items = document.querySelectorAll(".product__item");
const delete__products = document.querySelectorAll(".delete__product");
const create__btn = document.querySelector(".create__btn");
const product_detele = [];
const dialog = document.querySelector(".dialog");
const overlay = document.querySelector(".overlay");
const cancel_btn_dialog = document.querySelector(".cancel-btn");
const cancel__btn = document.querySelector(".cancel__btn");
const save__btn = document.querySelector(".save__btn");
const delete_btn_dialog = document.querySelector(".delete-btn");
const dialog_close_dialog = document.querySelector(".dialog-close");
const create__product_inner = document.querySelector(".create__product-inner");
const image_upload__add = document.querySelector(".image-upload__add");
const image_upload__input = document.querySelector(".image-upload__input");
const upload_images = [];
let position = [false, false, false, false];
const image_upload_previews = document.querySelectorAll(
    ".image-upload-placeholder"
);
const dialogStatus = document.getElementById("dialog__status");
const closeDialogStatus = document.getElementById("close-dialog__status");
const dialogStatusMessage = document.getElementById("dialog__status-message");

// Hàm để bật dialog
function showDialogStatus(message, isSuccess) {
    dialogStatusMessage.textContent = message; // Đặt thông điệp
    dialogStatus.classList.remove("hidden__status", "success", "failure"); // Xóa các class hiện tại
    dialogStatus.classList.add(isSuccess ? "success" : "failure"); // Thêm class success hoặc failure
    dialogStatus.style.display = "block"; // Hiển thị dialog
}

// Hàm để ẩn dialog
function hideDialogStatus() {
    dialogStatus.style.display = "none"; // Ẩn dialog
}

// Gán sự kiện click cho nút đóng
closeDialogStatus.addEventListener("click", hideDialogStatus);

const parent = document.querySelector(".parent");
const floating__btn = document.querySelector(".floating__btn");

const categoryInput = document.getElementById("Category");
const categoryList = document.getElementById("category-list");
let categori_option = 0;

const manufacturerInput = document.getElementById("Manufactory");
const manufacturerList = document.getElementById("manufactory-list");
let manufacturer_option = 0;

categoryInput.addEventListener("input", () => {
    const value = categoryInput.value;
    borderNone(document.querySelector("#Category"));
    const option = Array.from(categoryList.options).find(
        (opt) => opt.value === value
    );
    if (option) {
        categori_option = Number(option.id);
    }
});

manufacturerInput.addEventListener("input", () => {
    const value = manufacturerInput.value;
    borderNone(document.querySelector("#Manufactory"));
    const option = Array.from(manufacturerList.options).find(
        (opt) => opt.value === value
    );
    if (option) {
        manufacturer_option = Number(option.id);
    }
});

parent.addEventListener("scroll", (e) => {
    const scrollTop = parent.scrollTop;
    floating__btn.style.bottom = -scrollTop + "px";
});

function showOverlay(this_dialog) {
    overlay.classList.add("overlay-active");
    document.body.style.overflow = "hidden";
    if (this_dialog === create__product_inner) {
        create__product_inner.style.display = "flex";
    } else {
        dialog.style.display = "block";
    }
}
// overlay.classList.add("overlay-active"); //xí nữa xóa
// document.body.style.overflow = "hidden"; //xí nữa xóa

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
delete_btn_dialog.addEventListener("click", async () => {});

function displayProductItems(ids) {
    product__items.forEach((product__item) => {
        const id = Number(product__item.getAttribute("id"));
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
        body: JSON.stringify({ search, id: 10 }),
    }).then((res) => res.json());

    displayProductItems(products_Id);
    search__button.disable = false;
});
delete__products.forEach((delete__product) => {
    delete__product.addEventListener("click", () => {
        showOverlay(dialog);
    });
});

create__btn.addEventListener("click", () => {
    showOverlay(create__product_inner);
});

cancel__btn.addEventListener("click", () => {
    overlay.classList.remove("overlay-active");
    document.body.style.overflow = "auto";
    create__product_inner.style.display = "none";
});

image_upload__add.addEventListener("click", () => {
    image_upload__input.click();
});

image_upload__input.addEventListener("change", () => {
    const files = image_upload__input.files;
    if (files) {
        for (const file of files) {
            let pos = 0;
            let isExist = false;
            for (let i = 0; i < 4; i++) {
                if (!position[i]) {
                    position[i] = true;
                    pos = i;
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                return;
            }
            const img = document.createElement("img");
            img.classList.add("image-upload");
            img.src = URL.createObjectURL(file);
            image_upload_previews[pos].innerHTML = "";
            const close = document.createElement("img");
            close.src = "/images/icons/close-button.png";
            close.classList.add("close__img");
            image_upload_previews[pos].appendChild(img);
            image_upload_previews[pos].appendChild(close);

            close.addEventListener("click", () => {
                image_upload_previews[pos].innerHTML =
                    "<p>No image selected</p>";
                position[pos] = false;
                upload_images.splice(pos, 1);
            });
            img.onload = () => URL.revokeObjectURL(img.src);
            upload_images.splice(pos, 0, file);
        }
    }
});

// border-color: #6a11cb;
//     box-shadow: 0 0 5px rgba(106, 17, 203, 0.5);

function borderRed(element) {
    element.style.border = "1px solid red";
    element.style.boxShadow = "0 0 5px rgba(106, 17, 203, 0.5)";
}
function borderNone(element) {
    element.style.border = "#6a11cb";
    element.style.boxShadow = "0 0 5px rgba(106, 17, 203, 0.5)";
}
document.querySelector("#productName").addEventListener("input", () => {
    borderNone(document.querySelector("#productName"));
});
document.querySelector("#productPrice").addEventListener("input", () => {
    borderNone(document.querySelector("#productPrice"));
});

document.querySelector("#productQuantity").addEventListener("input", () => {
    borderNone(document.querySelector("#productQuantity"));
});

document.querySelector("#productDescription").addEventListener("input", () => {
    borderNone(document.querySelector("#productDescription"));
});

function clearAll() {
    document.querySelector("#productName").value = "";
    document.querySelector("#productPrice").value = "";
    document.querySelector("#productQuantity").value = "";
    document.querySelector("#productDescription").value = "";
    categoryInput.value = "";
    manufacturerInput.value = "";
    image_upload_previews.forEach((image) => {
        image.innerHTML = "<p>No image selected</p>";
    });
    position = [false, false, false, false];
    upload_images.splice(0, upload_images.length);
}

function createProduct(product) {
    // <div
    //             id={{product_id}}
    //             class="product__item bg-white rounded shadow group"
    //         >
    //             <div class="relative">
    //                 <a href="/product/productDetail?id={{this.product_id}}"><img
    //                         src={{Images.0.directory_path}}
    //                         alt="product{{@index}}"
    //                         class="product__image w-full"
    //                     /></a>
    //             </div>
    //             <img
    //                 src="/images/icons/close-button.png"
    //                 class="delete__product"
    //                 id="{{product_id}}"
    //             />
    //             <div class="product__content px-4 pt-4 pb-3">
    //                 <a href="/product/productDetail?id={{this.product_id}}">
    //                     <h4
    //                         class="mb-2 text-xl font-medium text-gray-800 uppercase transition hover:text-primary"
    //                     >
    //                         {{product_name}}</h4>
    //                 </a>
    //                 <div class="flex mt-auto items-baseline mb-1 space-x-2">
    //                     <p
    //                         class="text-xl font-semibold text-primary"
    //                     >{{current_price}}</p>
    //                     <p
    //                         class="text-sm text-gray-400 line-through"
    //                     >{{original_price}}</p>
    //                 </div>
    //             </div>
    //             <a
    //                 href="#"
    //                 class="block w-full py-1 text-center text-white transition border rounded-b bg-primary border-primary hover:bg-transparent hover:text-primary"
    //             >Add to cart</a>
    //         </div>
    const product__item = document.createElement("div");
    product__item.id = product.product_id;
    product__item.classList.add(
        "product__item",
        "bg-white",
        "rounded",
        "shadow",
        "group"
    );
    const relative = document.createElement("div");
    relative.classList.add("relative");
    const a = document.createElement("a");
    a.href = `/product/productDetail?id=${product.product_id}`;
    const img = document.createElement("img");
    img.src = product.Images[0].directory_path;
    img.alt = `product${product.product_id}`;
    img.classList.add("product__image", "w-full");
    a.appendChild(img);
    relative.appendChild(a);
    product__item.appendChild(relative);
    const delete__product = document.createElement("img");
    delete__product.src = "/images/icons/close-button.png";
    delete__product.classList.add("delete__product");
    delete__product.id = product.product_id;
    product__item.appendChild(delete__product);
    const product__content = document.createElement("div");
    product__content.classList.add("product__content", "px-4", "pt-4", "pb-3");
    const a2 = document.createElement("a");
    a2.href = `/product/productDetail?id=${product.product_id}`;
    const h4 = document.createElement("h4");
    h4.classList.add(
        "mb-2",
        "text-xl",
        "font-medium",
        "text-gray-800",
        "uppercase",
        "transition",
        "hover:text-primary"
    );
    h4.textContent = product.product_name;
    a2.appendChild(h4);
    product__content.appendChild(a2);
    const div = document.createElement("div");
    div.classList.add("flex", "mt-auto", "items-baseline", "mb-1", "space-x-2");
    const p = document.createElement("p");
    p.classList.add("text-xl", "font-semibold", "text-primary");
    p.textContent = product.current_price;
    const p2 = document.createElement("p");
    p2.classList.add("text-sm", "text-gray-400", "line-through");
    p2.textContent = product.original_price;
    div.appendChild(p);
    div.appendChild(p2);
    product__content.appendChild(div);
    product__item.appendChild(product__content);
    const a3 = document.createElement("a");
    a3.href = "#";
    a3.classList.add(
        "block",
        "w-full",
        "py-1",
        "text-center",
        "text-white",
        "transition",
        "border",
        "rounded-b",
        "bg-primary",
        "border-primary",
        "hover:bg-transparent",
        "hover:text-primary"
    );
    a3.textContent = "Add to cart";
    product__item.appendChild(a3);
    document.querySelector(".view__product").appendChild(product__item);
    delete__product.addEventListener("click", () => {
        showOverlay(dialog);
    });
}

save__btn.addEventListener("click", async () => {
    const product_name = document.querySelector("#productName").value;
    if (product_name === "") {
        borderRed(document.querySelector("#productName"));
        return;
    }
    const product_price = Number(document.querySelector("#productPrice").value);
    if (product_price === "" || isNaN(product_price) || product_price < 0) {
        borderRed(document.querySelector("#productPrice"));
        return;
    }
    const product_quantity = Number(
        document.querySelector("#productQuantity").value
    );
    if (
        product_quantity === "" ||
        isNaN(product_quantity) ||
        product_quantity < 0
    ) {
        borderRed(document.querySelector("#productQuantity"));
        return;
    }
    if (categori_option === 0) {
        borderRed(document.querySelector("#Category"));
        return;
    }
    if (manufacturer_option === 0) {
        borderRed(document.querySelector("#Manufactory"));
        return;
    }

    if (upload_images.length === 0) {
        alert("Please upload image");
        return;
    }
    const product_description = document.querySelector(
        "#productDescription"
    ).value;

    if (product_description === "") {
        borderRed(document.querySelector("#productDescription"));
        return;
    }
    const formData = new FormData();
    formData.append("product_name", product_name);
    formData.append("product_price", product_price);
    formData.append("product_quantity", product_quantity);
    formData.append("product_description", product_description);
    formData.append("category_id", categori_option);
    formData.append("manufacturer_id", manufacturer_option);
    upload_images.forEach((image) => {
        formData.append("product_images", image);
    });
    const result = await fetch("/admin/createproduct", {
        method: "POST",
        body: formData,
    }).then((res) => res.json());
    if (result.status === "success") {
        showDialogStatus("Create product successfully", true);
        createProduct(result.product);
        clearAll();
    } else {
        const message = result.message || "Create product failure";
        showDialogStatus(message, false);
    }
});
