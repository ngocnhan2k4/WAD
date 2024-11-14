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
        // const searchParams = params instanceof URLSearchParams ? params.toString() : new URLSearchParams(params).toString();
        const searchParams = new URLSearchParams(params).toString();
        fetch(`/product?${searchParams}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.text())
        .then(html => {
            document.getElementById('product-list').innerHTML = html;
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