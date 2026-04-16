import { apiRequest } from '../api/client';

export const UploadService = {
  async uploadAvatar(file: File) {
    if (!file) {
      return null; // Image is optional
    }

    const formData = new FormData();
    formData.append('avatar', file);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
    const url = `${API_BASE_URL}/upload/upload-avatar`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type, let the browser set it with boundary
        },
      });

      if (!response.ok) {
        console.warn('Avatar upload failed, continuing without avatar');
        return null; // Return null if upload fails - image is optional
      }

      const data = await response.json();
      const avatarPath = data.data.avatar;
      
      // Return relative path - getAvatarUrl will construct the full URL
      return avatarPath;
    } catch (error: any) {
      console.warn('Avatar upload error, continuing without avatar:', error);
      return null; // Return null on error - image is optional
    }
  },
};
