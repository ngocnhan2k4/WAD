let productId;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', function () {
    const productIdElement = document.querySelector('#product-id');
    
    if (productIdElement) {
        productId = productIdElement.value;
    } else {
        console.error('Product ID element not found!');
    }
    loadReviews(currentPage); // Tải reviews lần đầu
});

function loadReviews(page) {
    if (!productId) {
        console.error('Product ID is missing.');
        return;
    }

    console.log('Load review for page:', page);

    fetch(`/product/productDetail?id=${productId}&page=${page}`, {
        headers: {
            'x-requested-with': 'XMLHttpRequest',
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to load reviews');
            }
            return response.json();
        })
        .then((data) => {
            renderReviews(data.reviews);
            updatePagination(data.pagination);
        })
        .catch((error) => {
            console.error('Error loading reviews:', error);
        });
}

function renderReviews(reviews) {
    const reviewsContainer = document.querySelector('#reviews-container');
    reviewsContainer.innerHTML = reviews
        .map(
            (review) => `
            <div class="p-4 bg-white rounded-lg shadow review">
                <div class="flex items-center mb-3">
                    <span class="text-sm font-semibold text-gray-700">${review.User.fullName}</span>
                    <span class="ml-2 text-sm text-gray-500">${review.creation_time}</span>
                </div>
                <div class="text-gray-800 review-detail">${review.review_detail}</div>
            </div>
        `
        )
        .join('');
}

function updatePagination(pagination) {
    const paginationContainer = document.querySelector('#pagination-container');
    
    let pagesToDisplay = [];

    // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả các trang
    if (pagination.totalPages <= 5) {
        pagesToDisplay = pagination.pages;
    } else {
        // Nếu số trang lớn hơn 5, chỉ hiển thị một số trang gần trang hiện tại
        pagesToDisplay = [
            1, // Trang đầu
            pagination.currentPage - 1 > 1 ? pagination.currentPage - 1 : null, // Trang trước trang hiện tại
            pagination.currentPage,
            pagination.currentPage + 1 < pagination.totalPages ? pagination.currentPage + 1 : null, // Trang sau trang hiện tại
            pagination.totalPages // Trang cuối
        ];

        // Loại bỏ các giá trị null
        pagesToDisplay = pagesToDisplay.filter(page => page !== null);

        // Thêm dấu "..." nếu có nhiều trang ở giữa
        if (pagination.currentPage > 3) {
            pagesToDisplay.splice(1, 0, '...'); // Thêm "..." sau trang đầu tiên
        }
        if (pagination.currentPage < pagination.totalPages - 2) {
            pagesToDisplay.splice(pagesToDisplay.length - 1, 0, '...'); // Thêm "..." trước trang cuối cùng
        }
    }

    // Cập nhật phần tử phân trang
    paginationContainer.innerHTML = `
        <span class="text-gray-700">Page ${pagination.currentPage} of ${pagination.totalPages}</span>
        ${
            pagination.hasPreviousPage
                ? `<button onclick="loadReviews(${pagination.previousPage})" class="px-4 py-2 text-white transition bg-blue-500 rounded hover:bg-blue-600">Previous</button>`
                : ''
        }
        <div class="flex space-x-2">
            ${pagesToDisplay
                .map(
                    (pageNumber, index) => {
                        // Nếu là dấu "..."
                        if (pageNumber === '...') {
                            return `<span class="text-gray-700">...</span>`;
                        } else {
                            // Kiểm tra nếu trang là trang hiện tại, thì không hiển thị lại trang đầu hoặc trang cuối
                            if (index > 0 && pagesToDisplay[index - 1] === pageNumber) {
                                return ''; // Không hiển thị trang lặp lại
                            }
                            return `
                                <button onclick="loadReviews(${pageNumber})" class="px-3 py-2 text-gray-700 transition bg-gray-200 rounded hover:bg-gray-300 ${pageNumber === pagination.currentPage ? 'bg-blue-500 text-white' : ''}">
                                    ${pageNumber}
                                </button>
                            `;
                        }
                    }
                )
                .join('')}
        </div>
        ${
            pagination.hasNextPage
                ? `<button onclick="loadReviews(${pagination.nextPage})" class="px-4 py-2 text-white transition bg-blue-500 rounded hover:bg-blue-600">Next</button>`
                : ''
        }
    `;
}


document.addEventListener("DOMContentLoaded", () => {
    const userId = document.getElementById("user-id").value;
    const submitBtn = document.getElementById("submit-btn");

    if (!userId) {
        console.log("clicked");
        submitBtn.textContent = "Log in to comment";
        submitBtn.classList.replace("bg-blue-500", "bg-gray-400");
        submitBtn.classList.replace("hover:bg-blue-600", "hover:bg-gray-500");
        submitBtn.disabled = false; // Cho phép bấm nút để chuyển hướng

        submitBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Ngăn hành vi mặc định
            window.location.href = "/user/login"; // Chuyển hướng đến trang đăng nhập
        });
    } else {
        // Nếu đã đăng nhập, kích hoạt form submit

        document.getElementById("review-form").addEventListener("submit", async (e) => {
            e.preventDefault();

            const productId = document.getElementById("product-id").value;
            const reviewDetail = document.getElementById("review-detail").value;

            console.log("product-id", productId);
            console.log("user-id", userId);
            console.log("review-detail", reviewDetail);

            try {
                const response = await fetch("/product/api/review/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productId, reviewDetail, userId }),
                });

                if (!response.ok) throw new Error("Failed to add review");

                const data = await response.json();
                alert(data.message);
                // location.reload(); // Reload trang để cập nhật danh sách bình luận
                loadReviews(currentPage);
            } catch (err) {
                console.error(err);
                alert("Error adding review");
            }
        });
    }
});

