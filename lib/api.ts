// Utility functions for API calls with proper error handling

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retries = 3
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (retries > 0 && (error.name === 'AbortError' || error.code === 'ECONNRESET')) {
      console.warn(`Request failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      return fetchWithRetry(url, options, retries - 1);
    }
    
    throw error;
  }
}

export async function apiCall<T>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetchWithRetry(url, options);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new ApiError(errorText, response.status);
    }

    const data = await response.json().catch(() => null);
    
    return {
      data,
      status: response.status,
    };
  } catch (error: any) {
    console.error('API call failed:', error);
    
    return {
      error: error.message || 'Network error occurred',
      status: error.status || 500,
    };
  }
}

// Strapi-specific API calls
export async function strapiGet<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api${endpoint}`;
  
  return apiCall<T>(url, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function strapiPost<T>(
  endpoint: string, 
  data: any, 
  token?: string
): Promise<ApiResponse<T>> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api${endpoint}`;
  
  return apiCall<T>(url, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(data),
  });
}

export async function strapiPut<T>(
  endpoint: string, 
  data: any, 
  token?: string
): Promise<ApiResponse<T>> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api${endpoint}`;
  
  return apiCall<T>(url, {
    method: 'PUT',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(data),
  });
}

export async function strapiDelete<T>(
  endpoint: string, 
  token?: string
): Promise<ApiResponse<T>> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api${endpoint}`;
  
  return apiCall<T>(url, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}