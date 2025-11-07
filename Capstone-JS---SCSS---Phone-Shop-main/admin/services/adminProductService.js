const API_URL = "https://68fa1775ef8b2e621e7eb9ac.mockapi.io/v1/products";

class AdminProductService {
    // Lấy danh sách sản phẩm
    async getProducts() {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    // Thêm sản phẩm mới
    async addProduct(product) {
        try {
            const response = await axios.post(API_URL, product);
            return response.data;
        } catch (error) {
            console.error("Error adding product:", error);
            throw error;
        }
    }

    // Xóa sản phẩm
    async deleteProduct(productId) {
        try {
            const response = await axios.delete(`${API_URL}/${productId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    }

    // Cập nhật sản phẩm
    async updateProduct(productId, product) {
        try {
            const response = await axios.put(
                `${API_URL}/${productId}`,
                product
            );
            return response.data;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    }
}
