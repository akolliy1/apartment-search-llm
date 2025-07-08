const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

interface IOption {
  headers?: HeadersInit;
  body?: BodyInit;
  method?: string;
  referrerPolicy?: ReferrerPolicy;
  credentials?: RequestCredentials;
  redirect?: RequestRedirect;
  cache?: RequestCache;
  mode?: RequestMode;
}

class ApiService {
  async request(endpoint: string, options: IOption = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ?? `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Search apartments using natural language query
  async searchApartments(query: string, userId = null) {
    return this.request("/api/search/apartments", {
      method: "POST",
      body: JSON.stringify({ query, user_id: userId }),
    });
  }

  // Get all apartments with optional filters
  async getApartments(filters = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else {
          queryParams.append(key, value as string);
        }
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/api/apartments?${queryString}`
      : "/api/apartments";

    return this.request(endpoint);
  }

  // Get apartment by ID
  async getApartmentById(id: string) {
    return this.request(`/api/apartments/${id}`);
  }

  // Get recommendations based on search ID
  async getRecommendations(searchId: string) {
    return this.request(`/api/search/recommendations/${searchId}`);
  }

  // Get search history
  async getSearchHistory(userId = null) {
    const endpoint = userId
      ? `/api/search/history?userId=${userId}`
      : "/api/search/history";

    return this.request(endpoint);
  }

  // Get popular searches
  async getPopularSearches() {
    return this.request("/api/search/popular");
  }

  // Test parameter extraction
  async testParameterExtraction(query: string) {
    return this.request("/api/search/test-extraction", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  }

  // Create new apartment (admin function)
  async createApartment<Type>(apartmentData: Type) {
    return this.request("/api/apartments", {
      method: "POST",
      body: JSON.stringify(apartmentData),
    });
  }

  // Update apartment (admin function)
  async updateApartment<Type>(id: string, updateData: Type) {
    return this.request(`/api/apartments/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  // Delete apartment (admin function)
  async deleteApartment(id: string) {
    return this.request(`/api/apartments/${id}`, {
      method: "DELETE",
    });
  }
}

export default new ApiService();
