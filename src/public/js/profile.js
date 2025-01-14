const updateAvatarBtn = document.getElementById("update-avatar-btn");
const avatarInput = document.getElementById("avatar-input");
const avatarPreview = document.getElementById("avatar-preview");

updateAvatarBtn.addEventListener("click", () => {
    avatarInput.click();
});

// Khi người dùng chọn ảnh mới
avatarInput.addEventListener("change", (event) => {
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
            .then((response) => response.json())
            .then((data) => {
                console.log("Avatar updated successfully", data);
                const avatar_preview =
                    document.getElementById("avatar-preview");
                const tempUrl = URL.createObjectURL(file);
                avatar_preview.src = tempUrl;
            })
            .catch((error) => {
                console.error("Error updating avatar:", error);
            });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".nav-item");
    const contents = document.querySelectorAll(".content");

    navItems.forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();

            // Xóa lớp active khỏi tất cả các nút
            navItems.forEach((nav) => nav.classList.remove("active"));

            // Thêm lớp active vào nút được click
            item.classList.add("active");

            // Ẩn tất cả nội dung
            contents.forEach((content) => content.classList.remove("active"));

            // Hiển thị nội dung tương ứng
            const targetId = item.getAttribute("data-target");
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.classList.add("active");
            }
        });
    });
});

window.addEventListener("load", function () {
    // Kiểm tra xem URL có chứa phần id cần cuộn tới không
    const hash = window.location.hash;
    if (hash) {
        // Lấy phần tử theo id (sau dấu #)
        const targetElement = document.querySelector(hash);

        // Nếu phần tử tồn tại, cuộn đến đó
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("change-password-modal");
    const changePasswordButton = document.querySelector(
        ".column-user .changePassword"
    );
    const closeButton = document.querySelector(".close-button");
    const formMessage = document.getElementById("form-message");
    // Hiển thị modal
    changePasswordButton.addEventListener("click", () => {
        modal.style.display = "block";
        document.body.classList.add("no-scroll");
    });

    // Đóng modal
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
        formMessage.textContent = "";
        formMessage.classList.add("hidden");
        formMessage.classList.remove(
            "bg-green-100",
            "text-green-500",
            "bg-red-100",
            "text-red-500"
        );
        document.body.classList.remove("no-scroll");
    });

    // Ẩn modal khi click bên ngoài
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            formMessage.textContent = "";
            formMessage.classList.add("hidden");
            formMessage.classList.remove(
                "bg-green-100",
                "text-green-500",
                "bg-red-100",
                "text-red-500"
            );
            document.body.classList.remove("no-scroll");
        }
    });
});

// show/hide password
document.querySelectorAll(".show-password-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const inputId = button.getAttribute("data-target");
        const input = document.getElementById(inputId);

        if (input.type === "password") {
            input.type = "text";
            button.textContent = "🙈";
        } else {
            input.type = "password";
            button.textContent = "👁";
        }
    });
});

// Lấy các input và các thông báo lỗi
const oldPasswordInput = document.getElementById("old-password");
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");

const oldPasswordError = document.getElementById("old-password-error");
const newPasswordError = document.getElementById("new-password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");

// Hàm hiển thị lỗi
function showError(input, errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
    input.classList.add("border-red-500");
}

// Hàm xóa lỗi
function clearError(input, errorElement) {
    errorElement.textContent = "";
    errorElement.classList.add("hidden");
    input.classList.remove("border-red-500");
}

// Kiểm tra điều kiện từng trường
async function validateOldPassword() {
    if (oldPasswordInput.value.trim() === "") {
        showError(
            oldPasswordInput,
            oldPasswordError,
            "Old password is required."
        );
        return false;
    }
    if (/\s/.test(oldPasswordInput.value)) {
        showError(
            oldPasswordInput,
            oldPasswordError,
            "Old password cannot contain spaces."
        );
        return false;
    }

    const isMatch = await checkPasswordMatch(oldPasswordInput.value);
    if (!isMatch) {
        showError(
            oldPasswordInput,
            oldPasswordError,
            "Old password does not match."
        );
        return false;
    }

    clearError(oldPasswordInput, oldPasswordError);
    return true;
}

async function checkPasswordMatch(oldPassword) {
    try {
        const response = await fetch("/userprofile/verifyoldpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ oldPassword: oldPassword }),
        });

        const data = await response.json();
        return data.isMatch; // Trả về true nếu mật khẩu khớp, false nếu không
    } catch (error) {
        console.error("Error while checking old password:", error);
        return false;
    }
}

function validateNewPassword() {
    const password = newPasswordInput.value.trim();

    if (password === "") {
        showError(
            newPasswordInput,
            newPasswordError,
            "New password is required."
        );
        return false;
    }
    if (password === oldPasswordInput.value.trim()) {
        showError(
            newPasswordInput,
            newPasswordError,
            "New password must be different from the old password."
        );
        return false;
    }
    if (password.length < 8) {
        showError(
            newPasswordInput,
            newPasswordError,
            "Password must be at least 8 characters."
        );
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        showError(
            newPasswordInput,
            newPasswordError,
            "Password must include at least one uppercase letter."
        );
        return false;
    }
    if (!/[0-9]/.test(password)) {
        showError(
            newPasswordInput,
            newPasswordError,
            "Password must include at least one number."
        );
        return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
        showError(
            newPasswordInput,
            newPasswordError,
            "Password must include at least one special character (!@#$%^&*)."
        );
        return false;
    }

    clearError(newPasswordInput, newPasswordError);
    return true;
}

function validateConfirmPassword() {
    if (confirmPasswordInput.value.trim() === "") {
        showError(
            confirmPasswordInput,
            confirmPasswordError,
            "Confirmation password is required."
        );
        return false;
    }
    if (confirmPasswordInput.value !== newPasswordInput.value) {
        showError(
            confirmPasswordInput,
            confirmPasswordError,
            "Passwords do not match."
        );
        return false;
    }
    clearError(confirmPasswordInput, confirmPasswordError);
    return true;
}

// Gắn sự kiện blur (rời khỏi ô nhập liệu)
oldPasswordInput.addEventListener("blur", validateOldPassword);
newPasswordInput.addEventListener("blur", validateNewPassword);
confirmPasswordInput.addEventListener("blur", validateConfirmPassword);

// Kiểm tra toàn bộ khi submit
const form = document.getElementById("change-password-form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isOldPasswordValid = validateOldPassword();
    const isNewPasswordValid = validateNewPassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const formMessage = document.getElementById("form-message");

    if (isOldPasswordValid && isNewPasswordValid && isConfirmPasswordValid) {
        try {
            // Gửi yêu cầu cập nhật mật khẩu
            const newPassword = document
                .getElementById("new-password")
                .value.trim();
            const response = await fetch("/userprofile/updatepassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPassword }),
            });

            // Kiểm tra phản hồi từ server
            const data = await response.json();

            if (response.ok) {
                // Thông báo thành công
                formMessage.textContent = "Password changed successfully!";
                formMessage.classList.remove(
                    "hidden",
                    "bg-red-100",
                    "text-red-500"
                );
                formMessage.classList.add("bg-green-100", "text-green-500");
                form.reset(); // Xóa các trường dữ liệu trong form
            } else {
                // Thông báo lỗi từ server
                formMessage.textContent =
                    data.error ||
                    "Failed to change password. Please try again.";
                formMessage.classList.remove(
                    "hidden",
                    "bg-green-100",
                    "text-green-500"
                );
                formMessage.classList.add("bg-red-100", "text-red-500");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            // Thông báo lỗi không mong muốn
            formMessage.textContent =
                "An unexpected error occurred. Please try again later.";
            formMessage.classList.remove(
                "hidden",
                "bg-green-100",
                "text-green-500"
            );
            formMessage.classList.add("bg-red-100", "text-red-500");
        }
    }
});

const name__user = document.getElementById("name__user");
const phone__user = document.getElementById("phone__user");
const address__user = document.getElementById("address__user");
const birdthday__user = document.getElementById("birdthday__user");
const gender__user = document.getElementById("gender__user");

//edit profile
document.addEventListener("DOMContentLoaded", () => {
    const profileModal = document.getElementById("edit-profile-modal");
    const changePasswordButton = document.querySelector(
        ".column-user .editProfile"
    );
    const closeButton = document.querySelector(".close-profile-button");
    const formMessage = document.getElementById("form-profile-message");
    // Hiển thị modal
    changePasswordButton.addEventListener("click", () => {
        profileModal.style.display = "block";
        document.querySelector("#name").value = name__user.textContent;
        document.querySelector("#phone").value = phone__user.textContent;
        //tôi có một thẻ select id là gender có các optinal thì các nào để tôi chọn đúng với gender__user.textContent
        const options = document.querySelectorAll("#gender option");
        for (let i = 0; i < options.length; i++) {
            if (
                options[i].textContent.toLowerCase() ===
                gender__user.textContent.trim().toLowerCase()
            ) {
                options[i].selected = true;
                break;
            }
        }
        //birthday là một input có id là birthday và là thẻ input có type là date
        document.querySelector("#birthday").value =
            birdthday__user.textContent.trim();
        const addressArray = address__user.textContent.split(", ");
        addressArray.splice(-3, 3);
        let address__string = "";
        if (addressArray.length === 1) {
            address__string = addressArray[0];
        } else {
            address__string = addressArray.join(", ");
        }
        document.querySelector("#address").value = address__string;
        document.body.classList.add("no-scroll");
    });

    // Đóng modal
    closeButton.addEventListener("click", () => {
        profileModal.style.display = "none";
        formMessage.textContent = "";
        formMessage.classList.add("hidden");
        formMessage.classList.remove(
            "bg-green-100",
            "text-green-500",
            "bg-red-100",
            "text-red-500"
        );
        document.body.classList.remove("no-scroll");
    });

    // Ẩn modal khi click bên ngoài
    window.addEventListener("click", (event) => {
        if (event.target === profileModal) {
            profileModal.style.display = "none";
            formMessage.textContent = "";
            formMessage.classList.add("hidden");
            formMessage.classList.remove(
                "bg-green-100",
                "text-green-500",
                "bg-red-100",
                "text-red-500"
            );
            document.body.classList.remove("no-scroll");
        }
    });
});

//const PROVINCE_API = "https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1";
const PROVINCE_API = "https://esgoo.net/api-tinhthanh/1/0.htm";

// DOM Elements
const provinceSelect = document.getElementById("province");
const districtSelect = document.getElementById("district");
const wardSelect = document.getElementById("ward");

// Hàm tải danh sách tỉnh/thành phố
async function loadProvinces() {
    const response = await fetch(PROVINCE_API);
    const provinces = await response.json();
    const addressArray = address__user.textContent.split(", ");
    const province__user = addressArray[addressArray.length - 1];
    provinces.data.forEach((province) => {
        const option = document.createElement("option");
        //option.value = province.code;
        option.value = province.id;
        option.textContent = province.name;
        provinceSelect.appendChild(option);
        if (province.name === province__user) {
            option.selected = true;
            loadDistricts(province.id);
        }
    });
}

//tỉnh/thành phố
async function loadDistricts(provinceCode) {
    districtSelect.innerHTML =
        '<option value="" disabled selected>Chọn Quận/Huyện</option>';
    wardSelect.innerHTML =
        '<option value="" disabled selected>Chọn Phường/Xã</option>'; // Làm sạch danh sách phường/xã

    //const response = await fetch(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`);
    const response = await fetch(
        `https://esgoo.net/api-tinhthanh/2/${provinceCode}.htm`
    );
    const districts = await response.json();
    const addressArray = address__user.textContent.split(", ");
    const district__user = addressArray[addressArray.length - 2];
    districts.data.forEach((district) => {
        const option = document.createElement("option");
        option.value = district.id;
        option.textContent = district.name;
        districtSelect.appendChild(option);
        if (district.name === district__user) {
            option.selected = true;
            loadWards(district.id);
        }
    });
}

// quận/huyện
async function loadWards(districtCode) {
    wardSelect.innerHTML =
        '<option value="" disabled selected>Chọn Phường/Xã</option>';

    //const response = await fetch(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`);
    const response = await fetch(
        `https://esgoo.net/api-tinhthanh/3/${districtCode}.htm`
    );
    const wards = await response.json();
    const addressArray = address__user.textContent.split(", ");
    const ward__user = addressArray[addressArray.length - 3];
    wards.data.forEach((ward) => {
        const option = document.createElement("option");
        option.value = ward.id;
        option.textContent = ward.name;
        wardSelect.appendChild(option);
        if (ward.name === ward__user) {
            option.selected = true;
        }
    });
}

provinceSelect.addEventListener("change", (e) => {
    const provinceCode = e.target.value;
    loadDistricts(provinceCode);
});

districtSelect.addEventListener("change", (e) => {
    const districtCode = e.target.value;
    loadWards(districtCode);
});

loadProvinces();

const nameInput = document.getElementById("name");
const genderInput = document.getElementById("gender");
const phoneInput = document.getElementById("phone");
const provinceInput = document.getElementById("province");
const districtInput = document.getElementById("district");
const wardInput = document.getElementById("ward");
const addressInput = document.getElementById("address");
const birdthdayInput = document.getElementById("birthday");

const nameError = document.getElementById("name-error");
const genderError = document.getElementById("gender-error");
const phoneError = document.getElementById("phone-error");
const provinceError = document.getElementById("province-error");
const districtError = document.getElementById("district-error");
const wardError = document.getElementById("ward-error");
const addressError = document.getElementById("address-error");
const birdthdayError = document.getElementById("birthday-error");

async function validateName() {
    // Kiểm tra nếu tên trống
    if (nameInput.value.trim() === "") {
        showError(nameInput, nameError, "Name is required.");
        return false;
    }

    // Kiểm tra nếu tên chứa khoảng trắng đầu và cuối
    if (/^\s|\s$/.test(nameInput.value)) {
        showError(
            nameInput,
            nameError,
            "Name cannot have leading or trailing spaces."
        );
        return false;
    }

    // Kiểm tra nếu tên có ký tự không hợp lệ
    if (/[^a-zA-Zà-ỹÀ-Ỹ\s]/u.test(nameInput.value)) {
        showError(
            nameInput,
            nameError,
            "Name can only contain letters and spaces."
        );
        return false;
    }

    clearError(nameInput, nameError);
    return true;
}

async function validateGender() {
    const genderValue = genderInput.value.trim(); // Lấy giá trị từ dropdown

    // Kiểm tra nếu người dùng chưa chọn giới tính
    if (genderValue === "") {
        showError(genderInput, genderError, "Gender is required.");
        return false;
    }

    // Nếu chọn đúng giới tính, xóa lỗi
    clearError(genderInput, genderError);
    return true;
}

async function validatePhone() {
    const phoneValue = phoneInput.value.trim(); // Lấy giá trị từ input

    // Kiểm tra nếu để trống
    if (phoneValue === "") {
        showError(phoneInput, phoneError, "Phone number is required.");
        return false;
    }

    // Kiểm tra độ dài số điện thoại
    if (phoneValue.length < 10 || phoneValue.length > 11) {
        showError(phoneInput, phoneError, "Phone number must be 10-11 digits.");
        return false;
    }

    // Kiểm tra chỉ chứa số
    const phonePattern = /^[0-9]+$/;
    if (!phonePattern.test(phoneValue)) {
        showError(
            phoneInput,
            phoneError,
            "Phone number must only contain digits."
        );
        return false;
    }

    // Kiểm tra định dạng mã vùng (nếu cần)
    if (!phoneValue.startsWith("0")) {
        showError(phoneInput, phoneError, "Phone number must start with 0.");
        return false;
    }

    // Nếu không có lỗi, xóa thông báo lỗi
    clearError(phoneInput, phoneError);
    return true;
}

async function validateProvince() {
    const provinceValue = provinceInput.value.trim(); // Lấy giá trị từ dropdown

    // Kiểm tra nếu người dùng chưa chọn tinnh
    if (provinceValue === "") {
        showError(provinceInput, provinceError, "Province is required.");
        return false;
    }

    // Nếu chọn đúng tinh, xóa lỗi
    clearError(provinceInput, provinceError);
    return true;
}

async function validateDistrict() {
    const districtValue = districtInput.value.trim(); // Lấy giá trị từ dropdown

    // Kiểm tra nếu người dùng chưa chọn quan/ huyen
    if (districtValue === "") {
        showError(districtInput, districtError, "District is required.");
        return false;
    }

    // Nếu chọn đúng tinh, xóa lỗi
    clearError(districtInput, districtError);
    return true;
}

async function validateWard() {
    const wardValue = wardInput.value.trim(); // Lấy giá trị từ dropdown

    // Kiểm tra nếu người dùng chưa chọn quan/ huyen
    if (wardValue === "") {
        showError(wardInput, wardError, "Ward is required.");
        return false;
    }

    // Nếu chọn đúng tinh, xóa lỗi
    clearError(wardInput, wardError);
    return true;
}

async function validateAddress() {
    const addressValue = addressInput.value.trim(); // Lấy giá trị từ input

    // Kiểm tra nếu để trống
    if (addressValue === "") {
        showError(addressInput, addressError, "Address is required.");
        return false;
    }

    // Kiểm tra độ dài tối thiểu
    if (addressValue.length < 5) {
        showError(
            addressInput,
            addressError,
            "Address must be at least 5 characters long."
        );
        return false;
    }

    if (addressValue.length >= 50) {
        showError(
            addressInput,
            addressError,
            "Address must be less than 50 characters long."
        );
        return false;
    }

    // Kiểm tra ký tự không hợp lệ
    const addressPattern = /^[a-zA-ZÀ-Ỹà-ỹ0-9\s,.#-/]+$/u;
    if (!addressPattern.test(addressValue)) {
        showError(
            addressInput,
            addressError,
            "Address contains invalid characters."
        );
        return false;
    }

    // Nếu không có lỗi, xóa thông báo lỗi
    clearError(addressInput, addressError);
    return true;
}

async function validateBirthday() {
    const birthdayValue = birdthdayInput.value.trim(); // Lấy giá trị từ input

    // Kiểm tra nếu để trống
    if (birthdayValue === "") {
        showError(birdthdayInput, birdthdayError, "Birthday is required.");
        return false;
    }

    // Chuyển đổi ngày sinh sang đối tượng `Date`
    const birthdayDate = new Date(birthdayValue);

    // Kiểm tra định dạng ngày
    if (isNaN(birthdayDate.getTime())) {
        showError(birdthdayInput, birdthdayError, "Invalid date format.");
        return false;
    }

    // Kiểm tra ngày sinh không được trong tương lai
    const today = new Date();
    if (birthdayDate > today) {
        showError(
            birdthdayInput,
            birdthdayError,
            "Birthday cannot be in the future."
        );
        return false;
    }

    // Nếu hợp lệ, xóa thông báo lỗi
    clearError(birdthdayInput, birdthdayError);
    return true;
}

nameInput.addEventListener("blur", validateName);
genderInput.addEventListener("blur", validateGender);
phoneInput.addEventListener("blur", validatePhone);
provinceInput.addEventListener("blur", validateProvince);
districtInput.addEventListener("blur", validateDistrict);
wardInput.addEventListener("blur", validateWard);
addressInput.addEventListener("blur", validateAddress);
birdthdayInput.addEventListener("blur", validateBirthday);

const profileForm = document.getElementById("edit-profile-form");
profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isNameValid = validateName();
    const isGenderValid = validateGender();
    const isPhoneValid = validatePhone();
    const isProvinceValid = validateProvince();
    const isDistrictValid = validateDistrict();
    const isWardValid = validateWard();
    const isAddressValid = validateAddress();
    const isBirthdayValid = validateBirthday();

    const formMessage = document.getElementById("form-profile-message");

    if (
        isNameValid &&
        isGenderValid &&
        isPhoneValid &&
        isProvinceValid &&
        isDistrictValid &&
        isWardValid &&
        isAddressValid &&
        isBirthdayValid
    ) {
        try {
            const name = nameInput.value.trim();
            const gender = genderInput.value.trim();
            const phone = phoneInput.value.trim();
            const province =
                provinceSelect.options[provinceSelect.selectedIndex].text;
            const district =
                districtSelect.options[districtSelect.selectedIndex].text;
            const ward = wardSelect.options[wardSelect.selectedIndex].text;
            const address = addressInput.value.trim();
            const birthday = birdthdayInput.value.trim();

            const response = await fetch("/userprofile/updateprofile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    gender,
                    phone,
                    province,
                    district,
                    ward,
                    address,
                    birthday,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                formMessage.textContent = "Profile updated successfully!";
                formMessage.classList.remove(
                    "hidden",
                    "bg-red-100",
                    "text-red-500"
                );
                formMessage.classList.add("bg-green-100", "text-green-500");
                name__user.textContent = name;
                phone__user.textContent = phone;
                address__user.textContent = `${address}, ${ward}, ${district}, ${province}`;
                birdthday__user.textContent = birthday;
                gender__user.textContent = gender;
            } else {
                formMessage.textContent =
                    data.error || "Failed to update profile. Please try again.";
                formMessage.classList.remove(
                    "hidden",
                    "bg-green-100",
                    "text-green-500"
                );
                formMessage.classList.add("bg-red-100", "text-red-500");
            }
        } catch {
            formMessage.textContent =
                "An unexpected error occurred. Please try again later.";
            formMessage.classList.remove(
                "hidden",
                "bg-green-100",
                "text-green-500"
            );
            formMessage.classList.add("bg-red-100", "text-red-500");
        }
    }
});

function toggleModal(orderId) {
    const modal = document.getElementById(`change-status-modal-${orderId}`);
    if (modal.style.display === "none" || modal.style.display === "") {
        modal.style.display = "flex";
        document.body.classList.add("no-scroll");
    } else {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll");
        hideMessage();
    }
}

async function submitStatusChange(event, orderId) {
    event.preventDefault();
    const form = event.target;

    try {
        const response = await fetch(`/userprofile/updatestatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId, newStatus: "Cancelled" }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (response.ok) {
            showMessage("Status updated successfully!", "success");
            setTimeout(() => location.reload(), 1000);
        } else {
            showMessage(
                data.error || "Failed to update status1. Please try again.",
                "error"
            );
        }
    } catch (error) {
        console.error("Error:", error);
        showMessage("Failed to update status. Please try again.", "error");
    }
}

function showMessage(message, type) {
    const formMessage = document.getElementById("status-message");
    formMessage.textContent = message;
    formMessage.classList.remove("hidden", "text-red-500", "text-green-500");

    if (type === "error") {
        formMessage.classList.add("text-red-500");
    } else if (type === "success") {
        formMessage.classList.add("text-green-500");
    }
    formMessage.classList.remove("hidden");
}

function hideMessage() {
    const formMessage = document.getElementById("status-message");
    formMessage.classList.add("hidden");
}
