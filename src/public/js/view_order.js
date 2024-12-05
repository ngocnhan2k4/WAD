const filter = [
    "Completed",
    "Processing",
    "Pending",
    "Cancelled",
    "Shipped",
    "No Filter",
];

const btn__filter = document.querySelector(".btn__filter");
const status__filter = Array.from(btn__filter.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join("");
let whichFilter = -1;
whichFilter = filter.indexOf(status__filter);
console.log(status__filter);
const status__orders = document.querySelectorAll(".status__order");
const acc_accepts = document.querySelectorAll(".acc_accept");
const acc_notaccepct = document.querySelectorAll(".acc_notaccepct");
const row__orders = document.querySelectorAll(".row__order");

let pages = document.querySelector(".total-pages").textContent;
const currentPageInput = document.querySelector(".current-page");
const prev_btn = document.querySelector(".prev-btn");
const next_btn = document.querySelector(".next-btn");
let currentPage = currentPageInput.value;

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
    window.location.href = `/admin/vieworder?page=${
        Number(currentPage) - 1
    }&filter=${status__filter}`;
});

next_btn.addEventListener("click", async () => {
    window.location.href = `/admin/vieworder?page=${
        Number(currentPage) + 1
    }&filter=${status__filter}`;
});

window.addEventListener("beforeunload", () => {
    localStorage.setItem("scrollPositionOrder", window.scrollY);
});

// Khôi phục vị trí cuộn sau khi tải trang
window.addEventListener("load", () => {
    const scrollPosition = localStorage.getItem("scrollPositionOrder");
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10));
        localStorage.removeItem("scrollPositionOrder"); // Xóa sau khi dùng
    }
});
currentPageInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
        if (currentPageInput.value === "" || isNaN(currentPageInput.value)) {
            currentPageInput.value = currentPage;
        }
        const page = currentPageInput.value;
        if (page > 0 && page <= pages) {
            window.location.href = `/admin/vieworder?page=${page}&filter=${stutus__filter}`;
        } else {
            window.location.href = `/admin/vieworder?page=${currentPage}&filter=${stutus__filter}`;
        }
    }
});

btn__filter.addEventListener("click", () => {
    whichFilter = (whichFilter + 1) % filter.length;
    const filterValue = filter[whichFilter];
    if (filterValue === "No Filter") {
        window.location.href = "/admin/vieworder";
        return;
    }
    window.location.href = `/admin/vieworder?page=1&filter=${filterValue}`;
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

row__orders.forEach((row) => {
    row.addEventListener("click", () => {
        const id = row.id;
        window.location.href = `/admin/vieworder/${id}`;
    });
});
