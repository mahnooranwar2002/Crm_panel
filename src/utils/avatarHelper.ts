// /**
//  * Generates local SVG avatar with user initials (no external requests, no CORS)
//  * Returns data:svg URL with random gradient background and bold initials
//  */
// const getInitialsSvg = (name: string, size: number = 40): string => {
//   const initials = name
//     .split(' ')
//     .map(word => word[0]?.toUpperCase())
//     .join('')
//     .slice(0, 2) || 'U';
  
//   const colors = [
//     'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//     'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
//     'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
//     'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
//     'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
//   ];
  
//   const bgGradient = colors[Math.floor(Math.random() * colors.length)];
  
//   return `data:image/svg+xml;base64,${
//     btoa(`
//       <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
//         <rect width="${size}" height="${size}" rx="${size * 0.25}" fill="${bgGradient}"/>
//         <text x="${size/2}" y="${size/1.6}" font-family="system-ui, -apple-system, sans-serif" 
//               font-size="${size/2.5}" font-weight="700" fill="white" 
//               text-anchor="middle" dominant-baseline="middle">${initials}</text>
//       </svg>
//     `).replace(/=/g, '%3D')
//   }`;
// };

// /**
//  * Helper function to get avatar URL or SVG fallback
//  * Prioritizes uploaded images, falls back to local SVG initials
//  */
// export const getAvatarUrl = (avatarPath: string | null | undefined, userName: string = 'User'): string => {
//   // Return uploaded avatar (fix paths if needed)
//   if (avatarPath) {
//     // Fix common path issues
//     let cleanPath = avatarPath;
//     if (cleanPath.includes('http://localhost:5000/api/uploads')) {
//       cleanPath = cleanPath.replace('http://localhost:5000/api/uploads', 'http://localhost:5000/uploads');
//     }
    
//     // If already full URL, use it
//     if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
//       return cleanPath;
//     }
    
//     // Construct full URL from relative path
//     const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
//     const BASE_URL = API_BASE_URL.replace('/api', '') || 'http://localhost:5000';
//     return `${BASE_URL}${cleanPath}`;
//   }
  
//   // No avatar path → return SVG initials
//   return getInitialsSvg(userName);
// };

// // Helper to extract initials for div fallbacks (used in ProfileTable)
// export const getInitials = (name: string | null | undefined): string => {
//   // Agar name undefined ya null ho toh foran 'U' return karo bina split kiye
//   if (!name || typeof name !== 'string') return 'U';

//   return name
//     .split(' ')
//     .filter(word => word.length > 0) // Extra spaces handle karne ke liye
//     .map(word => word[0]?.toUpperCase())
//     .join('')
//     .slice(0, 2) || 'U';
// };

/**
 * Generates local SVG avatar with user initials
 */
const getInitialsSvg = (name: string, size: number = 100): string => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || 'U';
  
  // SVG linear gradients rect fill mein direct nahi chaltay (baghair defs ke), 
  // isliye simple solid colors use karna zyada reliable hai.
  const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" 
            font-size="${size/2.2}" font-weight="bold" fill="white" 
            text-anchor="middle" dominant-baseline="central">${initials}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Helper function to get avatar URL or SVG fallback
 */
export const getAvatarUrl = (avatarPath: string | null | undefined, userName: string = 'User'): string => {
  if (avatarPath) {
    // 1. Base64 preview during upload should be returned directly
    if (avatarPath.startsWith('data:image')) return avatarPath;

    // 2. Path Cleanup
    let cleanPath = avatarPath;
    if (cleanPath.includes('/api/uploads')) {
      cleanPath = cleanPath.replace('/api/uploads', '/uploads');
    }

    // 3. If the avatar is already a full URL, use it directly
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      return cleanPath;
    }

    // 4. Normalize the API base URL to avoid malformed values like ':5000/api'
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

    const API_BASE_URL = normalizeApiUrl(process.env.NEXT_PUBLIC_API_BASE_URL, 'http://localhost:5000/api');
    const BASE_URL = API_BASE_URL.replace(/\/api$/, '').replace(/\/$/, '');
    const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

    return `${BASE_URL}${finalPath}`;
  }
  
  return getInitialsSvg(userName);
};

export const getInitials = (name: string | null | undefined): string => {
  if (!name || typeof name !== 'string') return 'U';
  return name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || 'U';
};