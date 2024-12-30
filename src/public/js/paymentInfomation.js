const { orderID } = window.orderData;

// Hàm hiển thị popup thanh toán
export async function showPaymentPopup(subtotalVND) {
    const userProfile = await fetchUserProfile();
    
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
            <h2 class="popup-title">Payment Information</h2>
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
                    <label for="popup-province">Province</label>
                    <select id="popup-province" name="province" required>
                        <option value="">-- Select Province --</option>
                    </select>
                </div>
                <div class="popup-form-group">
                    <label for="popup-district">District</label>
                    <select id="popup-district" name="district" required>
                        <option value="">-- Select District --</option>
                    </select>
                </div>
                <div class="popup-form-group">
                    <label for="popup-ward">Ward</label>
                    <select id="popup-ward" name="ward" required>
                        <option value="">-- Select Ward --</option>
                    </select>
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
                    <label for="popup-bank">Select Payment Method</label>
                    <select id="popup-bank" name="bank">
                        <option value="">-- Select your payment method --</option>
                        <option value="VNBANK">VNBANK</option>
                        <option value="INTCARD">INTCARD</option>
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

    if (userProfile && userProfile.province && userProfile.district && userProfile.ward && userProfile.shippingAddress) {
        clearDropdown('popup-province');
        clearDropdown('popup-district');
        clearDropdown('popup-ward');

        // await loadProvinces();
        // await loadDistricts();
        // await loadWards();
    
        let { province, district, ward, shippingAddress } = userProfile;
        console.log(province, district, ward, shippingAddress)
    
        await loadProvinces();
        // Tìm code của province
        const provinceCode = provincesData.find(p => p.name.includes(province))?.code;
        document.getElementById('popup-province').value = provinceCode; // Gán code tỉnh
        document.getElementById('popup-shippingAddress').value = shippingAddress;
    
        await loadDistricts(); // Dữ liệu quận/huyện sẽ được tự động dựa trên code tỉnh
        // Tìm code của district
        const districtCode = districtsData.find(d => d.name.includes(district))?.code;
        document.getElementById('popup-district').value = districtCode; // Gán code quận/huyện
    
        await loadWards(); // Dữ liệu xã/phường sẽ được tự động dựa trên code quận/huyện
        // Tìm code của ward
        const wardCode = wardsData.find(w => w.name.includes(ward))?.code;
        document.getElementById('popup-ward').value = wardCode; // Gán code xã/phường

        console.log("user profile:", userProfile)
        console.log("province data:",provincesData)
        console.log("district data:",districtsData)
        console.log("ward data:",wardsData)

        console.log("provinceCode:",provinceCode)
        console.log("districtCode:",districtCode)
        console.log("wardCode:",wardCode)
    } else {
        await loadProvinces();
    }

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

    const province = document.getElementById('popup-province').options[document.getElementById('popup-province').selectedIndex].text;
    const district = document.getElementById('popup-district').options[document.getElementById('popup-district').selectedIndex].text;
    const ward = document.getElementById('popup-ward').options[document.getElementById('popup-ward').selectedIndex].text;

    if (!province || !district || !ward) {
        event.preventDefault(); // Ngăn gửi form
        alert('Please select your Province, District, and Ward.');
    }

    const fullShippingAddress = `${shippingAddress}, ${ward}, ${district}, ${province}`;

    // Tạo đối tượng chứa tất cả thông tin thanh toán
    const paymentDetails = {
        paymentMethod,
        shippingAddress: fullShippingAddress,
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

export let provincesData = [];
export let districtsData = [];
export let wardsData = [];

export async function loadProvinces() {
    const provinceSelect = document.getElementById('popup-province');
    const response = await fetch('https://provinces.open-api.vn/api/p/');
    provincesData = await response.json(); // Lưu toàn bộ dữ liệu các tỉnh

    provincesData.forEach(province => {
        const option = document.createElement('option');
        option.value = province.code; // Sử dụng code cho value
        option.textContent = province.name;
        provinceSelect.appendChild(option);
    });

    provinceSelect.addEventListener('change', loadDistricts);
}

// Hàm tải dữ liệu cho District
export async function loadDistricts() {
    const districtSelect = document.getElementById('popup-district');
    const provinceCode = document.getElementById('popup-province').value;

    // Xóa các tùy chọn cũ
    districtSelect.innerHTML = '<option value="">-- Select District --</option>';
    if (!provinceCode) return;

    const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    const provinceData = await response.json();

    districtsData = provinceData.districts; // Lưu danh sách quận
    console.log(districtsData)

    districtsData.forEach(district => {
        const option = document.createElement('option');
        option.value = district.code; // Sử dụng code cho value
        option.textContent = district.name;
        districtSelect.appendChild(option);
    });

    districtSelect.addEventListener('change', loadWards);
}

// Hàm tải dữ liệu cho Ward
export async function loadWards() {
    const wardSelect = document.getElementById('popup-ward');
    const districtCode = document.getElementById('popup-district').value;

    // Xóa các tùy chọn cũ
    wardSelect.innerHTML = '<option value="">-- Select Ward --</option>';
    if (!districtCode) return;

    const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    const districtData = await response.json();

    wardsData = districtData.wards; // Lưu danh sách xã/phường

    wardsData.forEach(ward => {
        const option = document.createElement('option');
        option.value = ward.code; // Sử dụng code cho value
        option.textContent = ward.name;
        wardSelect.appendChild(option);
    });
}

export function updateShippingAddress() {
    const province = document.getElementById('popup-province').selectedOptions[0]?.text || '';
    const district = document.getElementById('popup-district').selectedOptions[0]?.text || '';
    const ward = document.getElementById('popup-ward').selectedOptions[0]?.text || '';

    const addressTextarea = document.getElementById('popup-shippingAddress');
    addressTextarea.value = `${ward}, ${district}, ${province}`;
}

export function parseAddress(address) {
    const parts = address.split(',');
    const length = parts.length;

    if (length < 4) {
        throw new Error('Address is incomplete!');
    }

    const province = parts[length - 1].trim();
    const district = parts[length - 2].trim();
    const ward = parts[length - 3].trim();
    const shippingAddress = parts.slice(0, length - 3).join(',').trim();

    return { shippingAddress, ward, district, province };
}

export async function fetchUserProfile() {
    try {
        const response = await fetch('/userprofile/getprofile');
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        console.log(data)
        const { address } = data;

        return parseAddress(address); // Tách địa chỉ
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null; // Trả về null nếu có lỗi
    }
}

export function clearDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '<option value="">-- Select --</option>';
}
