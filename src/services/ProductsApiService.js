// services/productsApi.js
const API_BASE_URL = 'http://localhost:8081/api';

class ProductsApiService {

    // Get all products with filtering and sorting
    async getAllProducts(category = null, search = null, sortBy = null) {
        try {
            const params = new URLSearchParams();
            if (category && category !== 'all') params.append('category', category);
            if (search) params.append('search', search);
            if (sortBy) params.append('sortBy', sortBy);

            const queryString = params.toString();
            const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;

            console.log('🔄 ProductsApi: Fetching products from:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const products = await response.json();
            console.log('✅ ProductsApi: Received', products.length, 'products');
            return products;

        } catch (error) {
            console.error('❌ ProductsApi: Error fetching products:', error);
            throw error;
        }
    }

    // Get single product by slug
    async getProductBySlug(slug) {
        try {
            console.log('🔄 ProductsApi: Fetching product:', slug);

            const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Product not found');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const product = await response.json();
            console.log('✅ ProductsApi: Product retrieved:', product.name);
            return product;

        } catch (error) {
            console.error('❌ ProductsApi: Error fetching product:', error);
            throw error;
        }
    }

    // Get featured products
    async getFeaturedProducts() {
        try {
            console.log('🔄 ProductsApi: Fetching featured products');

            const response = await fetch(`${API_BASE_URL}/products/featured`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const products = await response.json();
            console.log('✅ ProductsApi: Retrieved', products.length, 'featured products');
            return products;

        } catch (error) {
            console.error('❌ ProductsApi: Error fetching featured products:', error);
            throw error;
        }
    }

    // Get popular products
    async getPopularProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products/popular`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('❌ ProductsApi: Error fetching popular products:', error);
            throw error;
        }
    }

    // Get new arrivals
    async getNewArrivals() {
        try {
            const response = await fetch(`${API_BASE_URL}/products/new-arrivals`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('❌ ProductsApi: Error fetching new arrivals:', error);
            throw error;
        }
    }

    // Get products on sale
    async getProductsOnSale() {
        try {
            const response = await fetch(`${API_BASE_URL}/products/on-sale`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('❌ ProductsApi: Error fetching products on sale:', error);
            throw error;
        }
    }

    // Get products by category
    async getProductsByCategory(category) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/category/${category}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('❌ ProductsApi: Error fetching products by category:', error);
            throw error;
        }
    }

    // Get all categories
    async getAllCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/products/categories`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('❌ ProductsApi: Error fetching categories:', error);
            throw error;
        }
    }

    // Get all brands
    async getAllBrands() {
        try {
            const response = await fetch(`${API_BASE_URL}/products/brands`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('❌ ProductsApi: Error fetching brands:', error);
            throw error;
        }
    }
}

// Create singleton instance
const ProductsApi = new ProductsApiService();
export default ProductsApi;