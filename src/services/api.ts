// src/services/api.js

import axios from './axios';

// Login function
export const login = async (email:string, password: string) => {
    return await axios.post('/auth/login', {
      email,
      password,
    });
};

export const signup = async (username:string, email:string, password: string) => {
    return await axios.post('/auth/signup', {
      username,
      email,
      password,
    });
};


export const refresh = async (refreshToken: string) => {
  return await axios.post('/auth/refresh', {
    refreshToken
  })
}

export const getIntrests = async() => {
  return await axios.get('/intrests')
}

export const getGenders = async() => {
  return await axios.get('/genders')
}

export const postUserDetails = async (userData: any) => {
  // Create a new FormData object to hold the data
  const formData = new FormData();

  // Append the regular user details (name, age, etc.)
  console.log(userData,"=====");
  
  formData.append('name', userData.name);
  formData.append('age', userData.age);
  formData.append('gender', userData.gender);
  formData.append('inetrests', userData.interests);
  formData.append('bio', userData.bio);
  formData.append('email', userData.email)

  // Check if there is an image and append it to FormData
  if (userData.image) {
    // If the image exists, create a proper file object to append
    const imageUri = userData.image;
    const file = {
      uri: imageUri,
      type: 'image/jpeg',  // or 'image/png' depending on your image type
      name: 'profile-image.jpg',  // Choose a proper name for the file
    };
    formData.append('image', file);
  }

  // Send the FormData object to the backend API
  try {
    const response = await axios.post('user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',  // This header is required for file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading user data:', error);
    throw error;
  }
};