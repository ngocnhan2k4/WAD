const { subtotalVND, orderID } = orderData;

// Hàm hiển thị popup thanh toán
export function showPaymentPopup(orderId) {
    // Tạo overlay
    const overlay = document.createElement('div');
    overlay.id = 'payment-overlay';

    // Tạo popup
    const paymentPopup = document.createElement('div');
    paymentPopup.id = 'popup-payment';
    paymentPopup.className = 'popup-container';

    // Nội dung của popup
    paymentPopup.innerHTML = `
        <div class="popup-content">
            <h2>Payment Information</h2>
            <form id="popup-paymentForm" action="/payment/checkout" method="POST">
                <div class="popup-form-group">
                    <label for="popup-paymentType">Payment Type</label>
                    <input 
                        type="text" 
                        id="popup-paymentType" 
                        name="paymentType" 
                        value="Invoice Payment" 
                        readonly 
                        required>
                </div>
                <div class="popup-form-group">
                    <label for="popup-amount">Amount</label>
                    <textarea 
                        type="number" 
                        id="popup-amount" 
                        name="amount" 
                        placeholder="Enter the amount (VNĐ)" 
                        readonly 
                        required>${subtotalVND} VNĐ</textarea>
                </div>
                <div class="popup-form-group">
                    <label for="popup-paymentDescription">Payment Description</label>
                    <textarea 
                        id="popup-paymentDescription" 
                        name="paymentDescription" 
                        placeholder="Enter payment details"
                        rows="2" 
                        required>Payment for order: ${orderID}</textarea>
                </div>
                <div class="popup-form-group">
                    <label for="popup-shippingAddress">Shipping Address</label>
                    <textarea 
                        id="popup-shippingAddress" 
                        name="shippingAddress" 
                        placeholder="Enter your shipping address" 
                        rows="2" 
                        required></textarea>
                </div>
                <div class="popup-form-group">
                    <label for="popup-bank">Select Bank</label>
                    <select id="popup-bank" name="bank">
                        <option value="">-- Select your bank --</option>
                        <option value="vnpay">VNPAY</option>
                        <option value="vietcombank">Vietcombank</option>
                        <option value="techcombank">Techcombank</option>
                        <option value="sacombank">Sacombank</option>
                    </select>
                </div>
                <div class="popup-form-group">
                    <label for="popup-language">Language</label>
                    <select id="popup-language" name="language" required>
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                    </select>
                </div>
                <div class="popup-button-group">
                    <button type="button" class="popup-btn popup-btn-secondary" onclick="closePaymentPopup()">Cancel</button>
                    <button id="popup-submit-button" class="popup-btn popup-btn-primary" type="submit">Redirect Payment</button>
                </div>
            </form>
        </div>
    `;

    // Chèn overlay và popup vào body
    document.body.appendChild(overlay);
    overlay.appendChild(paymentPopup);

    const cancelButton = paymentPopup.querySelector('.popup-btn-secondary');
    cancelButton.addEventListener('click', closePaymentPopup);

    // Thêm sự kiện cho nút "Cancel" và bấm ra ngoài
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closePaymentPopup();  // Đóng khi người dùng bấm ra ngoài popup
        }
    });

    const bankSelect = paymentPopup.querySelector('#popup-bank');
    bankSelect.addEventListener('change', updatePaymentButton);

    updatePaymentButton();
    
    // Gắn sự kiện submit cho form thanh toán
    const paymentForm = document.getElementById('popup-paymentForm');
    paymentForm.addEventListener('submit', handlePaymentFormSubmission);
}

// Hàm đóng popup
export function closePaymentPopup() {
    // Lấy overlay và popup
    const overlay = document.getElementById('payment-overlay');
    if (overlay) {
        // Xóa overlay và popup khỏi DOM
        overlay.remove();
    }
}

// Hàm cập nhật nút thanh toán
export function updatePaymentButton() {
    const bankSelect = document.getElementById('popup-bank');
    const submitButton = document.getElementById('popup-submit-button');

    // Kiểm tra nếu có chọn ngân hàng
    if (bankSelect.value) {
        submitButton.textContent = 'Proceed to Payment';  // Nếu đã chọn ngân hàng
    } else {
        submitButton.textContent = 'Redirect Payment';   // Nếu chưa chọn ngân hàng
    }
}

// Hàm xử lý khi gửi form thanh toán
export async function handlePaymentFormSubmission(event) {
    event.preventDefault(); // Ngăn không cho form tự động gửi

    // Lấy các giá trị từ form
    const paymentMethod = document.getElementById('popup-bank').value; // Lấy giá trị ngân hàng
    const shippingAddress = document.getElementById('popup-shippingAddress').value; // Lấy địa chỉ giao hàng
    const amount = document.getElementById('popup-amount').value; // Lấy số tiền
    const paymentDescription = document.getElementById('popup-paymentDescription').value; // Lấy mô tả thanh toán
    const language = document.getElementById('popup-language').value; // Lấy ngôn ngữ

    // Tạo đối tượng chứa tất cả thông tin thanh toán
    const paymentDetails = {
        paymentMethod,
        shippingAddress,
        amount,
        paymentDescription,
        language
    };

    try {
        // Gửi yêu cầu POST đến server để lấy URL thanh toán
        const response = await fetch('/payment/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentDetails),
        });

        // Kiểm tra phản hồi từ server
        if (!response.ok) throw new Error('Payment failed.');
        const { paymentUrl } = await response.json(); // Giải nén URL thanh toán từ phản hồi

        // Kiểm tra và điều hướng người dùng tới URL thanh toán
        if (paymentUrl) {
            window.location.href = paymentUrl; // Chuyển hướng tới trang thanh toán
        } else {
            alert('Cannot retrieve payment URL. Try again later.');
        }
    } catch (error) {
        console.error('Payment Error:', error.message);
        alert('An error occurred during payment. Please try again.');
    }
}


