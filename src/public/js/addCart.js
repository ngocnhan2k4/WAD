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

    const addToCartButtonDetail = document.querySelectorAll('.add-to-cart-detail');
    addToCartButtonDetail.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của nút
    
            const productId = this.getAttribute('data-product-id'); // Lấy ID sản phẩm từ thuộc tính
            const quantityContainer = document.querySelector('.quantity-ajust');
    
            if (quantityContainer) {
                // Giả sử phần tử giữa là nơi hiển thị số lượng
                const quantityDisplay = quantityContainer.children[1]; 
                const quantity = parseInt(quantityDisplay.textContent.trim(), 10);
    
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
            } else {
                console.error('Quantity container not found.');
            }
        });
    });  
    
    // Tìm container chứa các nút cộng/trừ và hiển thị số lượng
    const quantityContainer = document.querySelector('.quantity-ajust');
    if (quantityContainer) {
        const decrementButton = quantityContainer.children[0]; // Nút "-"
        const quantityDisplay = quantityContainer.children[1]; // Phần hiển thị số lượng
        const incrementButton = quantityContainer.children[2]; // Nút "+"

        // Sự kiện khi bấm nút "-"
        decrementButton.addEventListener('click', () => {
            let currentQuantity = parseInt(quantityDisplay.textContent, 10);
            if (currentQuantity > 1) {
                currentQuantity -= 1;
                quantityDisplay.textContent = currentQuantity;
                quantityDisplay.setAttribute('value', currentQuantity); // Cập nhật giá trị
            }
        });

        // Sự kiện khi bấm nút "+"
        incrementButton.addEventListener('click', () => {
            let currentQuantity = parseInt(quantityDisplay.textContent, 10);
            currentQuantity += 1;
            quantityDisplay.textContent = currentQuantity;
            quantityDisplay.setAttribute('value', currentQuantity); // Cập nhật giá trị
        });
    }
});
