import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

class ApiService {
  async get(endpoint) {
    try {
      console.log(`🔥 Making GET request to: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      
      console.log(`✅ Response status: ${response.status}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Service not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`📦 Response data:`, data);
      return data;
    } catch (error) {
      console.error('🚨 API GET Error:', error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('🚨 API POST Error:', error);
      throw error;
    }
  }

  // Service-specific methods
  async getAllServices(category = 'all', search = '', sortBy = 'popular') {
    const params = new URLSearchParams();
    if (category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    
    const queryString = params.toString();
    const url = queryString ? `/services?${queryString}` : '/services';
    
    return this.get(url);
  }

  async getServiceBySlug(slug) {
    console.log(`🔍 ApiService: Getting service by slug: ${slug}`);
    return this.get(`/services/${slug}`);
  }

  async getFeaturedServices() {
    return this.get('/services/featured');
  }

  async getPublicCategories() {
    return this.get('/public/categories');
  }

  async testConnection() {
    return this.get('/services/test');
  }


  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        // Note: Do NOT set Content-Type header for FormData, 
        // the browser sets it automatically with the boundary
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.url; // Returns the AWS S3 URL
    } catch (error) {
      console.error('🚨 File Upload Error:', error);
      throw error;
    }
  }
}

export default new ApiService();
