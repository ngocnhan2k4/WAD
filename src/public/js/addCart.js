document.addEventListener('DOMContentLoaded', () => {
    // Lấy tất cả các nút "Add to cart"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của nút

            // Kiểm tra người dùng đã đăng nhập chưa
            fetch('/auth/check-login')
                .then(response => response.json())
                .then(data => {
                    if (!data.loggedIn) {
                        // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
                        window.location.href = '/user/login';
                        return; // Dừng thực thi mã còn lại
                    }

                    // Nếu đã đăng nhập, tiếp tục thêm sản phẩm vào giỏ
                    const productId = this.getAttribute('data-product-id');
                    const quantity = 1;

                    fetch('/cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ productId: parseInt(productId, 10), quantity }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message) {
                            alert(data.message); // Hiển thị thông báo thành công
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert(error.message || 'An error occurred while adding the item to the cart.');
                    });
                })
                .catch(error => {
                    console.error('Error checking login:', error);
                    window.location.href = '/user/login'; // Chuyển hướng nếu có lỗi
                });
        });
    });
});
