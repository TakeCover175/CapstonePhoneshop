class CartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    // Tính tổng tiền của một item trong giỏ hàng
    getTotalPrice() {
        return this.product.price * this.quantity;
    }
}

