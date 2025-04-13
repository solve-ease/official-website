// // uploadService.js
// import axios from 'axios';
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // Create an axios instance with default config
// const api = axios.create({
//   baseURL: `${API_URL}`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Helper function to get auth token
// const getAuthToken = () => localStorage.getItem('token');

// // Attach JWT token to request headers if available
// const authHeaders = () => {
//   const token = getAuthToken();
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// // Upload image to the server
// const uploadImage = async (file) => {
//   try {
//     const formData = new FormData();
//     formData.append('image', file);
    
//     const response = await api.post(`${API_URL}/uploads/image`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         ...authHeaders()
//       }
//     });
//     // debug
//     console.log('Image upload response:', response.data);
//     // Assuming the response contains the image URL
//     return response.data.imageUrl;
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     throw error;
//   }
// };

// export default {
//   api,
//   getAuthToken,
//   authHeaders,
//   uploadImage
// };

// uploadService.js
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('access_token');

// Attach JWT token to request headers if available
const authHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Upload image to the server
const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    // console.log('Token:', localStorage.getItem('access_token'));
    // Use the api instance but don't repeat the base URL
    // Just use the relative path
    const response = await axios.post(`${API_URL}/uploads/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...authHeaders()
      }
    });
    
    console.log('Image upload response:', response.data);
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default {
  api,
  getAuthToken,
  authHeaders,
  uploadImage
};