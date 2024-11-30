const filter = [
    "Completed",
    "Processing",
    "Pending",
    "Cancelled",
    "Shipped",
    "No Filter",
];
let whichFilter = -1;
const btn__filter = document.querySelector(".btn__filter");
const status__orders = document.querySelectorAll(".status__order");
const acc_accepts = document.querySelectorAll(".acc_accept");
const acc_notaccepct = document.querySelectorAll(".acc_notaccepct");

btn__filter.addEventListener("click", () => {
    whichFilter = (whichFilter + 1) % filter.length;
    const filterValue = filter[whichFilter];
    if (filterValue === "No Filter") {
        const orderList = document.querySelectorAll(".row__order");
        orderList.forEach((order) => {
            order.style.display = "table-row";
        });
        btn__filter.innerHTML = `<span>⚡</span> No Filter`;
        return;
    }
    const orderList = document.querySelectorAll(".row__order");
    orderList.forEach((order) => {
        const status = order.querySelector(".status__order").textContent;
        if (status === filterValue) {
            order.style.display = "table-row";
        } else {
            order.style.display = "none";
        }
    });
    btn__filter.innerHTML = `<span>⚡</span> ${filterValue}`;
});

status__orders.forEach((status) => {
    status.addEventListener("click", (e) => {
        e.stopPropagation();
        const statusValue = status.textContent;
        console.log(statusValue);
        let pos = filter.indexOf(statusValue);
        console.log(pos);
        let nextPos = pos + 1;
        if (nextPos >= filter.length - 1) {
            nextPos = 0;
        }
        status.textContent = filter[nextPos];
        status.classList.remove(`status__${filter[pos]}`);
        status.classList.add(`status__${filter[nextPos]}`);
        const td = status.parentElement;
        td.nextElementSibling.nextElementSibling.children[0].classList.add(
            "icon__inner--active"
        );
        td.nextElementSibling.nextElementSibling.children[1].classList.add(
            "icon__input--inputed"
        );
    });
});

acc_notaccepct.forEach((acc) => {
    acc.addEventListener("click", (e) => {
        console.log("clicked");
        e.stopPropagation();
        const td = acc.parentElement.parentElement;
        const tdStatus = td.previousElementSibling.previousElementSibling;
        const oldStatus = "status__" + tdStatus.classList[0];
        tdStatus.querySelector(".status__order").textContent =
            tdStatus.classList[0];
        const newStatus = tdStatus.querySelector(".status__order").classList[1];
        tdStatus.querySelector(".status__order").classList.remove(newStatus);
        tdStatus.querySelector(".status__order").classList.add(oldStatus);
        acc.parentElement.classList.remove("icon__inner--active");
        acc.parentElement.nextElementSibling.classList.remove(
            "icon__input--inputed"
        );
    });
});

acc_accepts.forEach((acc) => {
    acc.addEventListener("click", async (e) => {
        console.log("clicked");
        e.stopPropagation();
        const td = acc.parentElement.parentElement;
        const tdStatus = td.previousElementSibling.previousElementSibling;
        const newStatus = tdStatus.childNodes[0].textContent;
        tdStatus.className = "";
        tdStatus.classList.add(newStatus);
        console.log(newStatus);
        const result = await fetch("/admin/updateorderstatus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderID: td.parentElement.id,
                status: newStatus,
            }),
        }).then((res) => res.json());
        if (result.status === "success") {
            acc.parentElement.classList.remove("icon__inner--active");
            acc.parentElement.nextElementSibling.classList.remove(
                "icon__input--inputed"
            );
        }
    });
});
