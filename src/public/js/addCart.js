document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');

    // Hàm cập nhật số lượng hiển thị trên biểu tượng giỏ hàng
    function updateCartCount() {
        fetch('/cart/count')
            .then((response) => response.json())
            .then((data) => {
                if (!data.loggedIn) {
                    // Nếu chưa đăng nhập, ẩn số lượng
                    cartCountElement.classList.add('hidden');
                    return;
                }

                // Nếu đã đăng nhập, hiển thị số lượng
                if (data.cartCount > 0) {
                    cartCountElement.textContent = data.cartCount;
                    cartCountElement.classList.remove('hidden');
                } else {
                    cartCountElement.classList.add('hidden');
                }
            })
            .catch((error) => {
                console.error('Error fetching cart count:', error);
            });
    }

    // Cập nhật số lượng giỏ hàng khi tải trang
    updateCartCount();

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
                            fetch('/cart/count')
                                    .then((response) => response.json())
                                    .then((data) => {
                                        if (data.cartCount > 0) {
                                            cartCountElement.textContent = data.cartCount;
                                            cartCountElement.classList.remove('hidden');
                                        }
                                    });
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
