// Global cart array
let cart = [];

// Khởi tạo các service và view
const productService = new ProductService();
const productView = new ProductView();
const cartView = new CartView();

// Load giỏ hàng từ localStorage khi trang được tải
function loadCartFromStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        try {
            const parsedData = JSON.parse(cartData);
            cart = parsedData.map(item => {
                const product = new Products(
                    item.product.name,
                    item.product.price,
                    item.product.screen,
                    item.product.blackCamera,
                    item.product.frontCamera,
                    item.product.img,
                    item.product.desc,
                    item.product.type,
                    item.product.id
                );
                return new CartItem(product, item.quantity);
            });
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            cart = [];
        }
    }
}

// Lưu giỏ hàng vào localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Lấy danh sách sản phẩm và hiển thị
async function loadProducts() {
    const products = await productService.getProducts();
    productView.renderProductList(products);
    
    // Gắn event listener cho các nút "Thêm vào giỏ"
    attachAddToCartListeners();
}

// Gắn event listener cho các nút "Thêm vào giỏ"
function attachAddToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const productId = this.getAttribute('data-product-id');
            await addToCart(productId);
        });
    });
}

// Thêm sản phẩm vào giỏ hàng
async function addToCart(productId) {
    const products = await productService.getProducts();
    const product = products.find(p => 
        String(p.id) === String(productId) || 
        p.id === productId
    );
    
    if (!product) {
        alert('Không tìm thấy sản phẩm!');
        return;
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingCartItem = cart.find(item => 
        String(item.product.id) === String(product.id) || 
        item.product.id === product.id
    );

    if (existingCartItem) {
        // Nếu đã có, tăng quantity lên 1
        existingCartItem.quantity += 1;
    } else {
        // Nếu chưa có, tạo CartItem mới với quantity = 1
        const cartItem = new CartItem(product, 1);
        cart.push(cartItem);
    }

    saveCartToStorage();
    renderCart();
}

// Render giỏ hàng
function renderCart() {
    cartView.renderCart(cart);
    
    // Gắn event listener cho các nút tăng/giảm số lượng
    attachQuantityListeners();
    
    // Gắn event listener cho nút xóa
    attachRemoveListeners();
}

// Gắn event listener cho các nút tăng/giảm số lượng
function attachQuantityListeners() {
    const decreaseButtons = document.querySelectorAll('.btn-decrease');
    const increaseButtons = document.querySelectorAll('.btn-increase');

    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            updateQuantity(productId, -1);
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            updateQuantity(productId, 1);
        });
    });
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateQuantity(productId, change) {
    const cartItem = cart.find(item => 
        String(item.product.id) === String(productId) || 
        item.product.id === productId
    );
    
    if (!cartItem) return;

    cartItem.quantity += change;

    // Nếu quantity <= 0, xóa sản phẩm khỏi giỏ hàng
    if (cartItem.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCartToStorage();
    renderCart();
}

// Gắn event listener cho nút xóa
function attachRemoveListeners() {
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            removeFromCart(productId);
        });
    });
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
    cart = cart.filter(item => 
        String(item.product.id) !== String(productId) && 
        item.product.id !== productId
    );
    saveCartToStorage();
    renderCart();
}

// Thanh toán - clear giỏ hàng
function checkout() {
    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }

    if (confirm('Bạn có chắc chắn muốn thanh toán?')) {
        cart = [];
        saveCartToStorage();
        renderCart();
        alert('Thanh toán thành công!');
    }
}

// Filter sản phẩm theo type
function filterProducts(type) {
    productService.getProducts().then(products => {
        if (type === 'all') {
            productView.renderProductList(products);
        } else {
            const filteredProducts = products.filter(product => product.type === type);
            productView.renderProductList(filteredProducts);
        }
        
        // Gắn lại event listener sau khi render
        attachAddToCartListeners();
    });
}

// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Load giỏ hàng từ localStorage
    loadCartFromStorage();
    
    // Load và hiển thị danh sách sản phẩm
    loadProducts();
    
    // Gắn event listener cho filter dropdown
    const filterSelect = document.getElementById('product-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            filterProducts(this.value);
        });
    }

    // Gắn event listener cho nút thanh toán
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    // Gắn event listener cho nút mở giỏ hàng
    const cartButton = document.querySelector('.cart-btn');
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            const cartModal = document.getElementById('cart-modal');
            if (cartModal) {
                cartModal.style.display = 'block';
                renderCart();
            }
        });
    }

    // Gắn event listener cho nút đóng modal giỏ hàng
    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            closeCartModal();
        });
    }

    // Đóng modal khi click bên ngoài
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }
});

// Đóng modal giỏ hàng
function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

