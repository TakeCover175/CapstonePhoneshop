class AdminProductView {
    // Render danh sách sản phẩm vào bảng
    renderProductTable(products) {
        const tableBody = document.getElementById('products-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        if (products.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">Không có sản phẩm nào</td>
                </tr>
            `;
            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>
                    <img src="${product.img}" alt="${product.name}" 
                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
                </td>
                <td>${product.name}</td>
                <td>${this.formatPrice(product.price)}</td>
                <td>${product.type}</td>
                <td>
                    <button type="button" class="btn-edit" data-product-id="${product.id}">
                        <i class="fa-solid fa-edit"></i> Sửa
                    </button>
                    <button type="button" class="btn-delete" data-product-id="${product.id}">
                        <i class="fa-solid fa-trash"></i> Xóa
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Điền form với dữ liệu sản phẩm để chỉnh sửa
    fillFormForEdit(product) {
        document.getElementById('product-id').value = product.id || '';
        document.getElementById('product-name').value = product.name || '';
        document.getElementById('product-price').value = product.price || '';
        document.getElementById('product-screen').value = product.screen || '';
        document.getElementById('product-black-camera').value = product.blackCamera || '';
        document.getElementById('product-front-camera').value = product.frontCamera || '';
        document.getElementById('product-img').value = product.img || '';
        document.getElementById('product-desc').value = product.desc || '';
        document.getElementById('product-type').value = product.type || '';

        // Đổi title và hiển thị nút hủy
        document.getElementById('form-title').textContent = 'Chỉnh sửa sản phẩm';
        document.getElementById('cancel-btn').style.display = 'inline-block';

        // Scroll lên đầu form
        document.querySelector('.admin-form-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Reset form về trạng thái thêm mới
    resetForm() {
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        document.getElementById('form-title').textContent = 'Thêm sản phẩm mới';
        document.getElementById('cancel-btn').style.display = 'none';
        this.clearErrors();
    }

    // Hiển thị lỗi validation
    showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Xóa lỗi validation
    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
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

