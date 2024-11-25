document.addEventListener('DOMContentLoaded', () => {
    // Hàm lấy số lượng sản phẩm trong giỏ hàng
    async function fetchCartCount() {
        try {
            const response = await fetch('/cart/count', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            const cartCountElement = document.getElementById('cart-count');

            // Cập nhật số lượng sản phẩm, nếu số lượng > 0 thì hiển thị
            if (data.itemCount > 0) {
                cartCountElement.innerText = data.itemCount;
                cartCountElement.style.display = 'block';
            } else {
                cartCountElement.style.display = 'none'; // Ẩn nếu không có sản phẩm
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    }

    // Gọi hàm khi tải trang
    fetchCartCount();
});
