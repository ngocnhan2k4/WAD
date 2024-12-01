const ctx = document.getElementById("revenueChart").getContext("2d");
const menu__navs = document.querySelectorAll(".menu__nav");
const decor__nav = document.querySelector(".decor__nav");
const revenue__report = document.querySelector(".revenue__report");
const revenue__top = document.querySelector(".revenue__top");

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
                document.getElementById("menu1__nav").offsetWidth + "px";
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
