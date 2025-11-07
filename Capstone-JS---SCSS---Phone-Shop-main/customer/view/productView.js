class ProductView {
    // Tạo UI cho danh sách sản phẩm
    renderProductList(products) {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        // Clear existing products
        productGrid.innerHTML = '';

        if (products.length === 0) {
            productGrid.innerHTML = '<p style="text-align: center; width: 100%;">Không có sản phẩm nào</p>';
            return;
        }

        // Tạo div cho mỗi sản phẩm
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.img}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p class="category">${product.type}</p>
                <p class="price">${this.formatPrice(product.price)}</p>
                <p class="desc">${product.desc || ''}</p>
                <button class="btnNav add-to-cart-btn" data-product-id="${product.id}">
                    <i class="fa-solid fa-cart-shopping"></i> Thêm vào giỏ
                </button>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // Format giá tiền
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }
}

