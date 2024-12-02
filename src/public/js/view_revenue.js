const ctx = document.getElementById("revenueChart").getContext("2d");
const menu__navs = document.querySelectorAll(".menu__nav");
const decor__nav = document.querySelector(".decor__nav");
const revenue__report = document.querySelector(".revenue__report");
const revenue__top = document.querySelector(".revenue__top");
const search__button = document.querySelector(".view__product__search__button");
const product__items = document.querySelectorAll(".product__item");

const options = {
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: "top",
            labels: {
                color: "#333",
            },
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: "#777",
            },
        },
        y: {
            grid: {
                color: "#eee",
            },
            ticks: {
                color: "#777",
                callback: (value) => `$${value / 1000}k`,
            },
        },
    },
};

new Chart(ctx, {
    type: "line",
    data,
    options,
});

const timeRange = document.getElementById("timeRange");
const timeRange_product = document.getElementById("timeRange-product");

const createNewTable = (data, value) => {
    const table__type = document.getElementById("table__type");
    table__type.innerHTML = value;

    const revenue__title = document.getElementById("revenue__title");
    revenue__title.innerHTML = `Overview of ${value}ly revenue`;

    // Lấy tbody của bảng
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // Xóa sạch nội dung cũ

    // Duyệt qua dữ liệu và thêm từng hàng
    data.labels.forEach((month, index) => {
        const revenue = data.datasets[0].data[index]; // Lấy revenue theo index
        const row = `
            <tr>
                <td>${month}</td>
                <td>$${revenue.toLocaleString()}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
};
timeRange.addEventListener("change", async (e) => {
    const { value } = e.target;
    const response = await fetch(`/admin/getrevenue/${value}`);
    const data = await response.json();
    createNewTable(data, value);
    const chart = document.querySelector(".chart");
    const newCanvas = document.createElement("canvas");
    newCanvas.id = "revenueChart";
    chart.innerHTML = "";
    chart.appendChild(newCanvas);
    new Chart(newCanvas, {
        type: "line",
        data,
        options,
    });
});

function renderProduct(data) {
    const view__product = document.querySelector(".view__product");
    view__product.innerHTML = "";
    data.forEach((product) => {
        {
            const product_id = product.product_id;
            const product_name = product.product_name;
            const total = product.total;
            const current_price = product.current_price;
            const original_price = product.original_price;
            const Images = product.Images;
            const product__item = document.createElement("div");
            product__item.id = product_id;
            product__item.classList.add(
                "product__item",
                "overflow-hidden",
                "bg-white",
                "rounded",
                "shadow",
                "group"
            );
            product__item.innerHTML = `
                <div class="relative">
                    <a href="/product/productDetail?id=${product_id}">
                        <img src=${Images[0].directory_path} alt="product${product_id}" class="w-full" />
                    </a>
                </div>
                <div class="product__content px-4 pt-4 pb-3">
                    <a href="/product/productDetail?id=${product_id}">
                        <h4 class="mb-2 text-xl font-medium text-gray-800 uppercase transition hover:text-primary">${product_name}</h4>
                        <h4 class="quatity__product mb-2 text-xl font-medium text-gray-800 uppercase transition hover:text-primary">Total sold: <strong>${total}</strong></h4>
                    </a>
                    <div class="flex mt-auto items-baseline mb-1 space-x-2">
                        <p class="text-xl font-semibold text-primary">${current_price}</p>
                        <p class="text-sm text-gray-400 line-through">${original_price}</p>
                    </div>
                </div>
                <a href="#" class="block w-full py-1 text-center text-white transition border rounded-b bg-primary border-primary hover:bg-transparent hover:text-primary">Add to cart</a>
            `;
            view__product.appendChild(product__item);
        }
    });
}
timeRange_product.addEventListener("change", async (e) => {
    const { value } = e.target;
    const response = await fetch(`/admin/getproductrevenue/${value}`);
    const revenue__title_product = document.getElementById(
        "revenue__title-product"
    );
    revenue__title_product.innerHTML = `Overview of ${value}ly revenue`;
    const data = await response.json();
    renderProduct(data);
});

menu__navs.forEach((menu__nav) => {
    menu__nav.addEventListener("click", (e) => {
        if (e.target.id === "menu1__nav") {
            decor__nav.style.left = "0";
            const clientWidth = e.target.clientWidth;
            const style = window.getComputedStyle(e.target);
            const paddingLeft = parseFloat(style.paddingLeft);
            const paddingRight = parseFloat(style.paddingRight);
            decor__nav.style.width =
                clientWidth - paddingLeft - paddingRight + "px";
            e.target.classList.add("menu__active");
            document
                .getElementById("menu2__nav")
                .classList.remove("menu__active");
            revenue__report.style.display = "block";
            revenue__top.style.display = "none";
        } else if (e.target.id === "menu2__nav") {
            decor__nav.style.left =
                document.getElementById("menu1__nav").offsetWidth + 20 + "px";
            const clientWidth = e.target.clientWidth;
            const style = window.getComputedStyle(e.target);
            const paddingLeft = parseFloat(style.paddingLeft);
            const paddingRight = parseFloat(style.paddingRight);
            decor__nav.style.width =
                clientWidth - paddingLeft - paddingRight + "px";
            e.target.classList.add("menu__active");
            document
                .getElementById("menu1__nav")
                .classList.remove("menu__active");
            revenue__report.style.display = "none";
            revenue__top.style.display = "block";
        }
    });
});
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
        body: JSON.stringify({ search, id: 1 }),
    }).then((res) => res.json());

    displayProductItems(products_Id);
    search__button.disable = false;
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

window.addEventListener("resize", () => {
    const menu1__nav = document.getElementById("menu1__nav");
    const menu2__nav = document.getElementById("menu2__nav");
    if (menu1__nav.classList.contains("menu__active")) {
        decor__nav.style.left = "0";
        const style = window.getComputedStyle(menu1__nav);
        const paddingLeft = parseFloat(style.paddingLeft);
        const paddingRight = parseFloat(style.paddingRight);
        decor__nav.style.width =
            menu1__nav.clientWidth - paddingLeft - paddingRight + "px";
    } else if (menu2__nav.classList.contains("menu__active")) {
        decor__nav.style.left = menu1__nav.clientWidth + 20 + "px";
        const style = window.getComputedStyle(menu2__nav);
        const paddingLeft = parseFloat(style.paddingLeft);
        const paddingRight = parseFloat(style.paddingRight);
        decor__nav.style.width =
            menu2__nav.clientWidth - paddingLeft - paddingRight + "px";
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const menu1__nav = document.getElementById("menu1__nav");
    const decor__nav = document.querySelector(".decor__nav");
    decor__nav.style.left = "0";
    const style = window.getComputedStyle(menu1__nav);
    const paddingLeft = parseFloat(style.paddingLeft);
    const paddingRight = parseFloat(style.paddingRight);
    decor__nav.style.width =
        menu1__nav.clientWidth - paddingLeft - paddingRight + "px";
    menu1__nav.classList.add("menu__active");
    revenue__report.style.display = "block";
    revenue__top.style.display = "none";
    decor__nav.style.display = "block";
});
