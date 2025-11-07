class CartView {
    // Render giỏ hàng ra màn hình
    renderCart(cart) {
        const cartTable = document.getElementById('cart-table-body');
        const cartTotal = document.getElementById('cart-total');
        if (!cartTable) return;

        // Clear existing cart items
        cartTable.innerHTML = '';

        if (cart.length === 0) {
            cartTable.innerHTML = '<tr><td colspan="6" style="text-align: center;">Giỏ hàng trống</td></tr>';
            if (cartTotal) cartTotal.textContent = '0 VND';
            return;
        }

        let total = 0;

        // Duyệt mảng giỏ hàng và tạo các <tr>
        cart.forEach(cartItem => {
            const row = document.createElement('tr');
            const itemTotal = cartItem.getTotalPrice();
            total += itemTotal;

            row.innerHTML = `
                <td>
                    <img src="${cartItem.product.img}" alt="${cartItem.product.name}" style="width: 50px; height: 50px; object-fit: cover;" />
                </td>
                <td>${cartItem.product.name}</td>
                <td>${this.formatPrice(cartItem.product.price)}</td>
                <td>
                    <button class="btn-decrease" data-product-id="${cartItem.product.id}">-</button>
                    <span class="quantity">${cartItem.quantity}</span>
                    <button class="btn-increase" data-product-id="${cartItem.product.id}">+</button>
                </td>
                <td>${this.formatPrice(itemTotal)}</td>
                <td>
                    <button class="btn-remove" data-product-id="${cartItem.product.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            cartTable.appendChild(row);
        });

        // Hiển thị tổng tiền
        if (cartTotal) {
            cartTotal.textContent = this.formatPrice(total);
        }
    }

    // Format giá tiền
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }
}

