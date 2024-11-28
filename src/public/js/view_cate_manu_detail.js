const heading = document.getElementById("editableHeading");

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
