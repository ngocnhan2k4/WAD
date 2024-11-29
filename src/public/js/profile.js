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
