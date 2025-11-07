// Khởi tạo service và view
const adminProductService = new AdminProductService();
const adminProductView = new AdminProductView();

// Biến lưu danh sách sản phẩm gốc
let allProducts = [];
let currentProducts = [];

// Validation
function validateProduct(product) {
    let isValid = true;
    adminProductView.clearErrors();

    // Validate tên sản phẩm
    if (!product.name || product.name.trim() === '') {
        adminProductView.showError('name', 'Tên sản phẩm không được để trống');
        isValid = false;
    }

    // Validate giá
    if (!product.price || product.price <= 0) {
        adminProductView.showError('price', 'Giá sản phẩm phải lớn hơn 0');
        isValid = false;
    }

    // Validate URL hình ảnh
    if (!product.img || product.img.trim() === '') {
        adminProductView.showError('img', 'URL hình ảnh không được để trống');
        isValid = false;
    } else {
        try {
            new URL(product.img);
        } catch (e) {
            adminProductView.showError('img', 'URL hình ảnh không hợp lệ');
            isValid = false;
        }
    }

    // Validate loại sản phẩm
    if (!product.type || (product.type !== 'iphone' && product.type !== 'samsung')) {
        adminProductView.showError('type', 'Vui lòng chọn loại sản phẩm (iPhone hoặc Samsung)');
        isValid = false;
    }

    return isValid;
}

// Load và hiển thị danh sách sản phẩm
async function loadProducts() {
    try {
        allProducts = await adminProductService.getProducts();
        currentProducts = [...allProducts];
        adminProductView.renderProductTable(currentProducts);
    } catch (error) {
        alert('Lỗi khi tải danh sách sản phẩm!');
        console.error(error);
    }
}

// Gắn event listener cho các nút trong bảng
function attachTableEventListeners() {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;

    tableBody.addEventListener('click', async function(event) {
        const editBtn = event.target.closest('.btn-edit');
        const deleteBtn = event.target.closest('.btn-delete');

        if (editBtn) {
            const productId = editBtn.getAttribute('data-product-id');
            const product = allProducts.find(p => p.id === productId || p.id?.toString() === productId);
            if (product) {
                adminProductView.fillFormForEdit(product);
            }
            return;
        }

        if (deleteBtn) {
            const productId = deleteBtn.getAttribute('data-product-id');
            if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                try {
                    await adminProductService.deleteProduct(productId);
                    alert('Xóa sản phẩm thành công!');
                    loadProducts();
                } catch (error) {
                    alert('Lỗi khi xóa sản phẩm!');
                    console.error(error);
                }
            }
            return;
        }
    });
}

// Xử lý submit form (thêm/sửa sản phẩm)
async function handleFormSubmit(event) {
    event.preventDefault();
    adminProductView.clearErrors();

    const productId = document.getElementById('product-id').value;
    const product = {
        name: document.getElementById('product-name').value.trim(),
        price: parseFloat(document.getElementById('product-price').value),
        screen: document.getElementById('product-screen').value.trim(),
        blackCamera: document.getElementById('product-black-camera').value.trim(),
        frontCamera: document.getElementById('product-front-camera').value.trim(),
        img: document.getElementById('product-img').value.trim(),
        desc: document.getElementById('product-desc').value.trim(),
        type: document.getElementById('product-type').value
    };

    // Validation
    if (!validateProduct(product)) {
        return;
    }

    try {
        if (productId) {
            // Cập nhật sản phẩm
            await adminProductService.updateProduct(productId, product);
            alert('Cập nhật sản phẩm thành công!');
        } else {
            // Thêm sản phẩm mới
            await adminProductService.addProduct(product);
            alert('Thêm sản phẩm thành công!');
        }

        adminProductView.resetForm();
        loadProducts(); // Reload danh sách
    } catch (error) {
        alert('Lỗi khi lưu sản phẩm!');
        console.error(error);
    }
}

// Tìm kiếm sản phẩm theo tên
function searchProducts(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        currentProducts = [...allProducts];
    } else {
        const term = searchTerm.toLowerCase().trim();
        currentProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(term)
        );
    }
    adminProductView.renderProductTable(currentProducts);
}

// Sắp xếp sản phẩm theo giá
function sortProducts(sortOrder) {
    if (!sortOrder || sortOrder === '') {
        currentProducts = [...allProducts];
    } else if (sortOrder === 'asc') {
        // Giá tăng dần
        currentProducts = [...currentProducts].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
        // Giá giảm dần
        currentProducts = [...currentProducts].sort((a, b) => b.price - a.price);
    }
    adminProductView.renderProductTable(currentProducts);
}

// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Load danh sách sản phẩm
    loadProducts();

    // Gắn listener cho bảng một lần (event delegation)
    attachTableEventListeners();

    // Gắn event listener cho form
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', handleFormSubmit);

    // Gắn event listener cho nút hủy
    const cancelBtn = document.getElementById('cancel-btn');
    cancelBtn.addEventListener('click', function() {
        adminProductView.resetForm();
    });

    // Gắn event listener cho tìm kiếm
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        searchProducts(this.value);
        // Nếu đang có sắp xếp, giữ nguyên thứ tự sắp xếp
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect.value) {
            sortProducts(sortSelect.value);
        }
    });

    // Gắn event listener cho sắp xếp
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', function() {
        // Tìm kiếm trước, sau đó sắp xếp
        const searchTerm = searchInput.value;
        if (searchTerm) {
            searchProducts(searchTerm);
        } else {
            currentProducts = [...allProducts];
        }
        sortProducts(this.value);
    });
});

