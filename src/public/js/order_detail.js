const filter = [
    "Completed",
    "Processing",
    "Pending",
    "Cancelled",
    "Shipped",
    "No Filter",
];
const status__order = document.querySelector(".status__order");
const acc_accept = document.querySelector(".acc_accept");
const acc_notaccepct = document.querySelector(".acc_notaccepct");
const order__id = document.querySelector(".order__id");
const id = order__id.id;
const search__button = document.querySelector(".view__product__search__button");
const product__items = document.querySelectorAll(".product__item");

status__order.addEventListener("click", (e) => {
    e.stopPropagation();
    const statusValue = status__order.textContent;
    let pos = filter.indexOf(statusValue);
    let nextPos = pos + 1;
    if (nextPos >= filter.length - 1) {
        nextPos = 0;
    }
    status__order.textContent = filter[nextPos];
    status__order.classList.remove(`status__${filter[pos]}`);
    status__order.classList.add(`status__${filter[nextPos]}`);
    acc_accept.parentElement.classList.add("icon__inner--active");
    acc_accept.parentElement.nextElementSibling.classList.add(
        "icon__input--inputed"
    );
});
acc_notaccepct.addEventListener("click", (e) => {
    console.log("clicked");
    e.stopPropagation();

    const tdStatus = status__order.parentElement;
    const oldStatus = "status__" + tdStatus.classList[0];
    tdStatus.querySelector(".status__order").textContent =
        tdStatus.classList[0];
    const newStatus = tdStatus.querySelector(".status__order").classList[1];
    tdStatus.querySelector(".status__order").classList.remove(newStatus);
    tdStatus.querySelector(".status__order").classList.add(oldStatus);
    acc_accept.parentElement.classList.remove("icon__inner--active");
    acc_accept.parentElement.nextElementSibling.classList.remove(
        "icon__input--inputed"
    );
});

acc_accept.addEventListener("click", async (e) => {
    console.log("clicked");
    e.stopPropagation();
    const tdStatus = status__order.parentElement;
    const newStatus = tdStatus.childNodes[0].textContent;
    tdStatus.className = "";
    tdStatus.classList.add(newStatus);
    const result = await fetch("/admin/updateorderstatus", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderID: id,
            status: newStatus,
        }),
    }).then((res) => res.json());
    if (result.status === "success") {
        acc_accept.parentElement.classList.remove("icon__inner--active");
        acc_accept.parentElement.nextElementSibling.classList.remove(
            "icon__input--inputed"
        );
    }
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
        body: JSON.stringify({ search, id }),
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

const select__product = document.querySelector(".select__product");
const search__input = document.querySelector(".view__product__search__input");
select__product.style.display = "none";

select__product.style.width = search__input.offsetWidth + "px";
select__product.style.top = search__input.offsetHeight + "px";

search__input.addEventListener("input", () => {
    const filter = search__input.value.toLowerCase();
    const options = select__product.children;
    select__product.style.display = "block";
    select__product.click();
    for (let i = 0; i < options.length; i++) {
        if (options[i].textContent.toLowerCase().indexOf(filter) > -1) {
            options[i].style.display = "";
        } else {
            options[i].style.display = "none";
        }
    }
});

const options = select__product.children;
for (let i = 0; i < options.length; i++) {
    options[i].addEventListener("click", () => {
        search__input.value = options[i].textContent;
        select__product.style.display = "none";
    });
}
search__input.addEventListener("blur", () => {
    setTimeout(() => {
        select__product.style.display = "none"; // Ẩn thẻ select khi mất focus
    }, 200);
});
