import { showNotification } from './notification.js';
import { showPaymentPopup} from './paymentInfomation.js';

document.addEventListener('DOMContentLoaded', function () {
    updateEventListeners();
    updateTotalSubtotal();

    const cartItems = document.querySelectorAll('[id^="row-"]');
    if (cartItems.length === 0) {
        document.querySelector('#shoppingCart tbody').innerHTML = `
        <tr>
            <td colspan="5" class="text-center">Your cart is empty.</td>
        </tr>`;
        document.querySelector('.float-right h1').textContent = `$0`;
        updateItemCounts();
    }

    function updateEventListeners() {
        const cartItems = document.querySelectorAll('[id^="row-"]');
    
        cartItems.forEach(item => {
            const productId = item.id.replace('row-', '');
            const quantityInput = document.getElementById(`quantity-${productId}`);
            const deleteButton = document.getElementById(`delete-${productId}`);
            const plusButton = item.querySelector('.quantity-btn.plus');
            const minusButton = item.querySelector('.quantity-btn.minus');

            // Sự kiện tăng số lượng
            plusButton.addEventListener('click', function () {
                const currentQuantity = parseInt(quantityInput.value, 10) || 1;
                const newQuantity = currentQuantity + 1;
                quantityInput.value = newQuantity;
                
                const parsedQuantity = parseInt(newQuantity, 10);
                const unitPrice = parseFloat(document.getElementById(`price-${productId}`).textContent.replace('$', ''));
                const rowSubtotal = unitPrice * parsedQuantity;
                updateRowSubtotal(productId, parsedQuantity);
                updateCartItem(productId, parsedQuantity, rowSubtotal);
            });

            // Sự kiện giảm số lượng
            minusButton.addEventListener('click', function () {
                const currentQuantity = parseInt(quantityInput.value, 10) || 1;
                if (currentQuantity > 1) {
                    const newQuantity = currentQuantity - 1;
                    quantityInput.value = newQuantity;
                    
                    const parsedQuantity = parseInt(newQuantity, 10);
                    const unitPrice = parseFloat(document.getElementById(`price-${productId}`).textContent.replace('$', ''));
                    const rowSubtotal = unitPrice * parsedQuantity;
                    updateRowSubtotal(productId, parsedQuantity);
                    updateCartItem(productId, parsedQuantity, rowSubtotal);
                }
            });

            updateRowSubtotal(productId, quantityInput.value.trim())
    
            // Sự kiện thay đổi số lượng
            quantityInput.addEventListener('input', function () {
                const newQuantity = this.value.trim(); // Lấy giá trị nhập vào, bỏ khoảng trắng
    
                // Nếu người dùng xóa hết thì không làm gì, để người dùng nhập lại
                if (newQuantity === '') {
                    return;
                }
    
                // Nếu giá trị không hợp lệ (không phải số hoặc nhỏ hơn 1), tự động đặt về 1
                if (isNaN(parseInt(newQuantity, 10)) || parseInt(newQuantity, 10) < 1) {
                    // alert('Quantity must be a positive integer. Defaulting to 1.');
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
                updateItemCounts()
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
        console.log(productId, quantity, unitPrice, rowSubtotal)
        document.getElementById(`total-price-${productId}`).textContent = `$${rowSubtotal}`;
    }

    function updateCartItem(productId, quantity, rowSubtotal) {
        updateTotalSubtotal();

        fetch('/cart/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: parseInt(productId, 10), quantity, rowSubtotal }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.updatedSubtotal !== undefined) {
                    // // Cập nhật subtotal hiển thị
                    // document.querySelector('.float-right h1').textContent = `$${data.updatedSubtotal}`;
                    // window.orderData.subtotalVND = data.updatedSubtotal * 25400; // Ví dụ giá trị mới
                    // updateItemCounts();
                    //console.log(orderData)
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
        window.orderData.subtotalVND = subtotal * 25400; // Ví dụ giá trị mới
        // console.log(orderData)
    }

    function updateItemCounts() {
        let itemCounts = 0;
        const itemQuantity = document.querySelectorAll('[id^="quantity-"]');
        itemQuantity.forEach(quantity => {
            itemCounts += parseFloat(quantity.value);
        });
        document.querySelector('.text-info').textContent = `${itemCounts}`;
    }


    const checkoutButton = document.getElementById('checkout-button');

    checkoutButton.addEventListener('click', async () => {
        try {
            console.log("check");

            const checkLogin = await fetch('/auth/check-login', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!checkLogin.ok) {
                throw new Error('Failed to check login.');
            }

            const loginData = await checkLogin.json();

            if (loginData.loggedIn == false){
                showNotification('Bạn cần đăng nhập trước khi thanh toán.', 'error');
                return;
            }

            const cartResponse = await fetch('/cart/check', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!cartResponse.ok) {
                throw new Error('Failed to check cart.');
            }

            const { cartItems } = await cartResponse.json();

            // Kiểm tra xem giỏ hàng có sản phẩm không
            if (cartItems.length === 0) {
                showNotification('Giỏ hàng trống, vui lòng thêm sản phẩm trước khi thanh toán.', 'error');
                return; // Dừng lại nếu giỏ hàng trống
            }

            showPaymentPopup(window.orderData.subtotalVND);
        } catch (error) {
            console.error('Checkout error:', error.message);
            alert('An error occurred during checkout. Please try again.');
        }
    });
});

function updatePaymentButton() {
    const bankSelect = document.getElementById('popup-bank');
    const submitButton = document.getElementById('popup-submit-button');

    console.log('Selected bank:', bankSelect.value);
    // Kiểm tra nếu có chọn ngân hàng
    if (bankSelect.value) {
        submitButton.textContent = 'Proceed to Payment';  // Nếu đã chọn ngân hàng
    } else {
        submitButton.textContent = 'Redirect Payment';   // Nếu chưa chọn ngân hàng
    }
}