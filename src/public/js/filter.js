document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('filter-form');
    const sortForm = document.getElementById('sort-form');
    const searchForm = document.getElementById('search-form');

    if (filterForm) {
        filterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            fetchProducts(new FormData(filterForm));
        });
    }

    if (sortForm) {
        sortForm.addEventListener('change', function(event) {
            event.preventDefault();
            const formData = new FormData(filterForm);
            for (const [key, value] of new FormData(sortForm).entries()) {
                formData.set(key, value);
            }
            fetchProducts(formData);
            
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(filterForm);
            for (const [key, value] of new FormData(searchForm).entries()) {
                formData.set(key, value);
            }
            fetchProducts(formData);
        });
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('pagination-link')) {
            event.preventDefault();
            const url = new URL(event.target.href);
            const params = new URLSearchParams(url.search);
            fetchProducts(params);
        }
    });

    function fetchProducts(params) {
        const searchParams = new URLSearchParams(params).toString();
        window.history.pushState({}, '', `${window.location.pathname}?${searchParams}`);// change url
        console.log(searchParams);
        fetch(`/product?${searchParams}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        // .then(response => response.text())
        .then(response => response.json())
        // .then(html => {
        //     console.log(html);
        //     document.getElementById('product-list').innerHTML = html;
        //     updateForms(searchParams); // Cập nhật các form với giá trị mới
        // })
        .then(data => {
            const productList = document.getElementById('product-list');
            
            productList.innerHTML = `<div class="grid grid-cols-2 gap-6 md:grid-cols-3"></div>`;
            const gridContainer = productList.querySelector('.grid');
            data.products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('bg-white', 'shadow', 'rounded', 'overflow-hidden', 'group');
            productElement.innerHTML = `
            <div class="relative">
            <a href="/product/productDetail?id=${product.product_id}">
                <img src="${product.Images[0].directory_path}" alt="product${product.product_id}" class="w-full">
            </a>
        </div>
        <div class="px-4 pt-4 pb-3">
            <a href="/product/productDetail?id=${product.product_id}">
                <h4 class="mb-2 text-xl font-medium text-gray-800 uppercase transition hover:text-primary">
                    ${product.product_name}
                </h4>
            </a>
            <div class="flex items-baseline mb-1 space-x-2">
                <p class="text-xl font-semibold text-primary">${product.current_price}</p>
                <p class="text-sm text-gray-400 line-through">${product.original_price}</p>
            </div>
            ${data.admin ? `
            <div class="flex items-center">
                <h4 class="text-xl font-medium">Total Purchase: </h4>
                <span class="text-xl font-semibold text-blue-600 ml-2">${product.total_purchase}</span>
            </div>` : ''}
        </div>
        <a href="#" class="block w-full py-1 text-center text-white transition border rounded-b bg-primary border-primary hover:bg-transparent hover:text-primary">
            Add to cart
        </a>
    `;
    gridContainer.appendChild(productElement);
});
    
     const paginationNav = document.createElement('nav');
     paginationNav.classList.add('flex', 'justify-center', 'mt-10');
     paginationNav.innerHTML = `
         <ul class="inline-flex items-center -space-x-px">
             ${data.hasPreviousPage ? `
             <li>
                 <a href="?page=${data.previousPage}&sort=${data.sort}&category=${data.category}&brand=${data.brand}&minPrice=${data.minPrice}&maxPrice=${data.maxPrice}&search=${data.search}" 
                    class="px-3 py-2 ml-0 leading-tight text-black bg-white border border-gray-300 rounded-l-lg pagination-link hover:bg-primary hover:text-gray-700">Previous</a>
             </li>` : ''}
             ${data.pages.map(page => `
                 <li>
                     <a href="?page=${page}&sort=${data.sort}&category=${data.category}&brand=${data.brand}&minPrice=${data.minPrice}&maxPrice=${data.maxPrice}&search=${data.search}" 
                        class="pagination-link py-2 px-3 leading-tight text-black border border-gray-300 hover:text-gray-700 ${page === data.currentPage ? 'bg-primary text-white' : ''}">
                        ${page}
                     </a>
                 </li>
             `).join('')}
             ${data.hasNextPage ? `
             <li>
                 <a href="?page=${data.nextPage}&sort=${data.sort}&category=${data.category}&brand=${data.brand}&minPrice=${data.minPrice}&maxPrice=${data.maxPrice}&search=${data.search}" 
                    class="px-3 py-2 leading-tight text-black bg-white border border-gray-300 rounded-r-lg pagination-link hover:bg-primary hover:text-gray-700">Next</a>
             </li>` : ''}
         </ul>
     `;
            productList.appendChild(paginationNav);
            updateForms(searchParams); // Cập nhật các form với giá trị mới
        })
        .catch(err => console.error(err));
    }

    function updateForms(searchParams) {
        const params = new URLSearchParams(searchParams);
        for (const [key, value] of params.entries()) {
            if (filterForm.elements[key]) {
                if (filterForm.elements[key].type === 'checkbox') {
                    filterForm.elements[key].checked = value.split(',').includes(filterForm.elements[key].value);
                } else {
                    filterForm.elements[key].value = value;
                }
            }
            if (sortForm.elements[key]) {
                sortForm.elements[key].value = value;
            }
            if (searchForm && searchForm.elements[key]) {
                searchForm.elements[key].value = value;
            }
        }
    }
});