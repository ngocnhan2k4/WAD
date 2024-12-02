document.addEventListener('DOMContentLoaded', function () {
    updateEventListeners();

    const cartItems = document.querySelectorAll('[id^="row-"]');
    if (cartItems.length === 0) {
        document.querySelector('#shoppingCart tbody').innerHTML = `
        <tr>
            <td colspan="5" class="text-center">Your cart is empty.</td>
        </tr>`;
        document.querySelector('.float-right h1').textContent = `$0`;
    }

    function updateEventListeners() {
        const cartItems = document.querySelectorAll('[id^="row-"]');
    
        cartItems.forEach(item => {
            const productId = item.id.replace('row-', '');
            const quantityInput = document.getElementById(`quantity-${productId}`);
            const deleteButton = document.getElementById(`delete-${productId}`);
    
            // Sự kiện thay đổi số lượng
            quantityInput.addEventListener('input', function () {
                const newQuantity = this.value.trim(); // Lấy giá trị nhập vào, bỏ khoảng trắng
    
                // Nếu người dùng xóa hết thì không làm gì, để người dùng nhập lại
                if (newQuantity === '') {
                    return;
                }
    
                // Nếu giá trị không hợp lệ (không phải số hoặc nhỏ hơn 1), tự động đặt về 1
                if (isNaN(parseInt(newQuantity, 10)) || parseInt(newQuantity, 10) < 1) {
                    alert('Quantity must be a positive integer. Defaulting to 1.');
                    this.value = 1;
                } else {
                    // Nếu giá trị hợp lệ, tính lại rowSubtotal và cập nhật
                    const parsedQuantity = parseInt(newQuantity, 10);
                    const unitPrice = parseFloat(document.getElementById(`price-${productId}`).textContent.replace('$', ''));
                    const rowSubtotal = unitPrice * parsedQuantity;
                    updateRowSubtotal(productId, parsedQuantity);
                    updateCartItem(productId, parsedQuantity, rowSubtotal); // Gửi thêm rowSubtotal
                }
            });
    
            // Xử lý khi người dùng rời khỏi ô nhập liệu (blur)
            quantityInput.addEventListener('blur', function () {
                const newQuantity = this.value.trim(); // Lấy giá trị nhập vào, bỏ khoảng trắng
    
                // Nếu giá trị trống hoặc không hợp lệ, đặt lại thành 1
                if (newQuantity === '' || isNaN(parseInt(newQuantity, 10)) || parseInt(newQuantity, 10) < 1) {
                    alert('Quantity must be a positive integer. Defaulting to 1.');
                    this.value = 1;
    
                    // Cập nhật rowSubtotal và gửi thông tin cập nhật với số lượng 1
                    const unitPrice = parseFloat(document.getElementById(`price-${productId}`).textContent.replace('$', ''));
                    const rowSubtotal = unitPrice;
                    updateRowSubtotal(productId, 1);
                    updateCartItem(productId, 1, rowSubtotal); // Cập nhật với số lượng 1
                }
            });
    
            // Sự kiện nút xóa
            deleteButton.addEventListener('click', function () {
                item.remove();
                updateTotalSubtotal();
                deleteProductOnServer(productId);
                if (document.querySelectorAll('[id^="row-"]').length === 0) {
                    document.querySelector('#shoppingCart tbody').innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">Your cart is empty.</td>
                    </tr>`;
                    document.querySelector('.float-right h1').textContent = `$0`;
                }
            });
        });
    }      

    function updateRowSubtotal(productId, quantity) {
        const unitPrice = parseFloat(document.getElementById(`price-${productId}`).textContent.replace('$', ''));
        const rowSubtotal = unitPrice * quantity;
        document.getElementById(`total-price-${productId}`).textContent = `$${rowSubtotal}`;
    }

    function updateCartItem(productId, quantity, rowSubtotal) {
        fetch('/cart/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: parseInt(productId, 10), quantity, rowSubtotal }), // Gửi thêm rowSubtotal
        })
            .then(res => res.json())
            .then(data => {
                if (data.updatedSubtotal !== undefined) {
                    // Cập nhật subtotal hiển thị
                    document.querySelector('.float-right h1').textContent = `$${data.updatedSubtotal}`;
                }
            })
            .catch(console.error);
    }

    function deleteProductOnServer(productId) {
        fetch('/cart/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: parseInt(productId, 10) }),
        })
            .then(res => res.json())
            .catch(console.error);
    }

    function updateTotalSubtotal() {
        let subtotal = 0;
        const totalPrices = document.querySelectorAll('[id^="total-price-"]');
        totalPrices.forEach(price => {
            subtotal += parseFloat(price.textContent.replace('$', ''));
        });
        document.querySelector('.float-right h1').textContent = `$${subtotal}`;
    }


    const checkoutButton = document.getElementById('checkout-button');

    checkoutButton.addEventListener('click', async () => {
        try {
            // Gọi API để tạo URL thanh toán VNPay
            const response = await fetch('/api/vnpay/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to process checkout.');
            }

            const { paymentUrl } = await response.json();

            if (paymentUrl) {
                // Chuyển hướng người dùng tới URL thanh toán của VNPay
                window.location.href = paymentUrl;
            } else {
                alert('Failed to get payment URL. Please try again later.');
            }
        } catch (error) {
            console.error('Checkout error:', error.message);
            alert('An error occurred during checkout. Please try again.');
        }
    });
});