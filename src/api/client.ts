const normalizeApiUrl = (rawUrl: string | undefined, fallback: string) => {
  if (!rawUrl) return fallback;
  const trimmed = rawUrl.trim();
  if (!trimmed) return fallback;
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/$/, '');
  if (/^\/\//.test(trimmed)) return `http:${trimmed}`.replace(/\/$/, '');
  if (/^:\d+(\/.*)?$/.test(trimmed)) return `http://localhost${trimmed}`.replace(/\/$/, '');
  if (/^[^:/]+(:\d+)?(\/.*)?$/.test(trimmed)) return `http://${trimmed}`.replace(/\/$/, '');
  return fallback;
};

// const API_BASE_URL = normalizeApiUrl(process.env.NEXT_PUBLIC_API_BASE_URL, 'https://crmbackend-flame.vercel.app');
const API_BASE_URL = normalizeApiUrl(process.env.NEXT_PUBLIC_API_BASE_URL, 'http://localhost:5000/');

export async function apiRequest(endpoint: any, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Removed authentication token requirement for easy access
  // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  // if (token) {
  //   headers.Authorization = `Bearer ${token}`;
  //   console.log('📤 Auth token present, sending request to:', endpoint);
  // } else {
  //   console.warn('⚠️ No auth token found in localStorage');
  // }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'API request failed';
    let errorData: any = null;
    
    try {
      errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      
      if (response.status === 403) {
        console.error('❌ Access Denied (403):', errorMessage);
        console.error('📋 Full error response:', errorData);
      } else if (response.status === 401) {
        console.error('❌ Unauthorized (401):', errorMessage);
        // Removed token clearing for easy access
        // if (typeof window !== 'undefined') {
        //   localStorage.removeItem('token');
        // }
      }
    } catch (parseError) {
      console.error('Could not parse error response:', parseError);
      errorMessage = `API Error (${response.status}): ${response.statusText}`;
    }
    
    const error = new Error(errorMessage) as any;
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}