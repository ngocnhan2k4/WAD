import { showNotification } from './notification.js';

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
    
            const productId = this.getAttribute('data-product-id'); // Lấy ID sản phẩm từ thuộc tính
            const quantity = 1;
    
            // Fetch trực tiếp tới endpoint
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
                    showNotification(data.message, data.type); // Hiển thị thông báo
                    updateCartCount(); // Cập nhật số lượng trong giỏ
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Unable to add item to cart.');
            });
        });
    });    
    // addToCartButtons.forEach(button => {
    //     button.addEventListener('click', function (event) {
    //         event.preventDefault(); // Ngăn chặn hành vi mặc định của nút

    //         // Kiểm tra người dùng đã đăng nhập chưa
    //         fetch('/auth/check-login')
    //             .then(response => response.json())
    //             .then(data => {
    //                 if (!data.loggedIn) {
    //                     fetch('/cart/addTemp', {
    //                         method: 'POST',
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                         },
    //                         body: JSON.stringify({ productId: parseInt(productId, 10), quantity }),
    //                     })
    //                     .then(response => response.json())
    //                     .then(data => {
    //                         if (data.message) {
    //                             showNotification(data.message, data.type);
    //                         }
    //                     })
    //                     .catch(error => {
    //                         console.error('Error:', error);
    //                         alert('Unable to save item to session.');
    //                     });
    
    //                     return; // Dừng thực thi mã còn lại
    //                 }

    //                 // Nếu đã đăng nhập, tiếp tục thêm sản phẩm vào giỏ
    //                 const productId = this.getAttribute('data-product-id');
    //                 const quantity = 1;

    //                 fetch('/cart/add', {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify({ productId: parseInt(productId, 10), quantity }),
    //                 })
    //                 .then(response => response.json())
    //                 .then(data => {
    //                     if (data.message) {
    //                         showNotification(data.message, data.type);
    //                         updateCartCount();
    //                     }
    //                 })
    //                 .catch(error => {
    //                     console.error('Error:', error);
    //                     alert(error.message || 'An error occurred while adding the item to the cart.');
    //                 });
    //             })
    //             .catch(error => {
    //                 console.error('Error checking login:', error);
    //                 showNotification('An error occurred while adding the item to the cart.', 'error');
    //             });
    //     });
    // });
});
