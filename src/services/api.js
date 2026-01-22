import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

class ApiService {
  getHeaders(isMultipart = false) {
    const headers = {
      'Accept': 'application/json',
    };
    
    // Only set Content-Type if NOT multipart (FormData handles its own Content-Type)
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }

    // Add Authorization header if token exists
    const token = localStorage.getItem('adminToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async get(endpoint) {
    try {
      console.log(`🔥 Making GET request to: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
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

  async getAllBookings() {
    console.log('Fetching all bookings...');
    return this.get('/bookings');
  }

  async updateBookingStatus(id, status) {
    console.log(`🔄 Updating booking #${id} to ${status}`);
    // Note: The backend expects a query param ?status=...
    return this.put(`/bookings/${id}/status?status=${status}`, {});
  }

  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT', // ✅ Use PUT here
        headers: this.getHeaders(),
        mode: 'cors',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('🚨 API PUT Error:', error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
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
        headers: this.getHeaders(true),
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


  async generateBlogContent(topic, tone = 'friendly') {
    return this.post('/admin/ai/generate', { topic, tone });
  }

  async getPublishedBlogs() {
    // Fetch only published blogs for the public view
    return this.get('/blogs/published');
  }

  async subscribeToNewsletter(email) {
    return this.post('/newsletter/subscribe', { email });
  }
}

export default new ApiService();
