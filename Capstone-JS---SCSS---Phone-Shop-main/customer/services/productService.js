const API_URL = 'https://68fa1775ef8b2e621e7eb9ac.mockapi.io/v1/products';

class ProductService {
    // Lấy danh sách sản phẩm từ API
    async getProducts() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            // Chuyển đổi data từ API thành Products objects
            return data.map(item => new Products(
                item.name,
                item.price,
                item.screen || '',
                item.blackCamera || '',
                item.frontCamera || '',
                item.img,
                item.desc,
                item.type,
                item.id
            ));
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }
}

