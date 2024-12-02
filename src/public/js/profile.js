const updateAvatarBtn = document.getElementById('update-avatar-btn');
const avatarInput = document.getElementById('avatar-input');
const avatarPreview = document.getElementById('avatar-preview');

updateAvatarBtn.addEventListener('click', () => {
    // Mở hộp thoại chọn ảnh
    avatarInput.click();
});

// Khi người dùng chọn ảnh mới
avatarInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        // Xem trước ảnh mới
        const reader = new FileReader();
        reader.onload = function (e) {
            avatarPreview.src = e.target.result; // Cập nhật ảnh đại diện trên giao diện
        };
        reader.readAsDataURL(file);

        
        const formData = new FormData();
        formData.append("avatar", file);
    
        fetch("/userprofile/update-avatar", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log("Avatar updated successfully", data);
        })
        .catch(error => {
            console.error("Error updating avatar:", error);
        });
    }
});



document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".nav-item");
    const contents = document.querySelectorAll(".content");
  
    navItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
  
        // Xóa lớp active khỏi tất cả các nút
        navItems.forEach((nav) => nav.classList.remove("active"));
  
        // Thêm lớp active vào nút được click
        item.classList.add("active");
  
        // Ẩn tất cả nội dung
        contents.forEach((content) => content.classList.remove("active"));
  
        // Hiển thị nội dung tương ứng
        const targetId = item.getAttribute("data-target");
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.classList.add("active");
        }
      });
    });
  });


window.addEventListener('load', function () {
    // Kiểm tra xem URL có chứa phần id cần cuộn tới không
    const hash = window.location.hash;
    if (hash) {
        // Lấy phần tử theo id (sau dấu #)
        const targetElement = document.querySelector(hash);

        // Nếu phần tử tồn tại, cuộn đến đó
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});
