let productId;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', function () {
    const productIdElement = document.querySelector('#product-id');
    if (productIdElement) {
        productId = productIdElement.value;
        console.log('Product ID:', productId);
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
                    <span class="text-sm font-semibold text-gray-700">${review.User.fullname}</span>
                    <span class="ml-2 text-sm text-gray-500">${review.created_at}</span>
                </div>
                <div class="text-gray-800 review-detail">${review.review_detail}</div>
            </div>
        `
        )
        .join('');
}

function updatePagination(pagination) {
    const paginationContainer = document.querySelector('#pagination-container');
    paginationContainer.innerHTML = `
        <!-- Hiển thị "Page X of Y" -->
        <span class="text-gray-700">Page ${pagination.currentPage} of ${pagination.totalPages}</span>

        <!-- Hiển thị nút "Previous" -->
        ${
            pagination.hasPreviousPage
                ? `<button onclick="loadReviews(${pagination.previousPage})" class="px-4 py-2 text-white transition bg-blue-500 rounded hover:bg-blue-600">Previous</button>`
                : ''
        }

        <!-- Hiển thị các số trang -->
        <div class="flex space-x-2">
            ${pagination.pages
                .map(
                    (pageNumber) => `
                <button onclick="loadReviews(${pageNumber})" class="px-3 py-2 text-gray-700 transition bg-gray-200 rounded hover:bg-gray-300 ${
                        pageNumber === pagination.currentPage ? 'bg-blue-500 text-white' : ''
                    }">
                    ${pageNumber}
                </button>
            `
                )
                .join('')}
        </div>

        <!-- Hiển thị nút "Next" -->
        ${
            pagination.hasNextPage
                ? `<button onclick="loadReviews(${pagination.nextPage})" class="px-4 py-2 text-white transition bg-blue-500 rounded hover:bg-blue-600">Next</button>`
                : ''
        }
    `;
}
