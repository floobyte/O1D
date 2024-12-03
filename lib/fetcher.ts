// lib/fetcher.ts
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = sessionStorage.getItem('token');
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
  }
  