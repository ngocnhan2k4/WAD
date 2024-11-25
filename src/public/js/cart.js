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
            const newQuantity = parseInt(this.value, 10);
            if (newQuantity < 1 || isNaN(newQuantity)) {
                alert('Quantity must be a positive integer');
                this.value = 1;
                return;
            }
        
            // Cập nhật rowSubtotal
            const unitPrice = parseFloat(document.getElementById(`price-${productId}`).textContent.replace('$', ''));
            const rowSubtotal = unitPrice * newQuantity;
            updateRowSubtotal(productId, newQuantity);
            updateCartItem(productId, newQuantity, rowSubtotal); // Gửi thêm rowSubtotal
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
                document.querySelector('.float-right h1').textContent = `$0.00`;
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
});