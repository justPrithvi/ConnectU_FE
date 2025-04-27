// src/services/api.js

import axios from './axios';

// Login function
export const login = async (email:string, password: string) => {
    return await axios.post('/auth/login', {
      email,
      password,
    });
};

export const signup = async (fullName:string, email:string, password: string) => {
    return await axios.post('/auth/signup', {
      fullName,
      email,
      password,
    });
};


export const refresh = async (refreshToken: string) => {
  return await axios.post('/auth/refresh', {
    refreshToken
  })
}

export const getInterests = async() => {
  return await axios.get('/intrests')
}

export const getGenders = async() => {
  return await axios.get('/genders')
}

export const registerNewConnection = async(accessToken: string, body: any) => {
  return await axios.post('/registerNewConnection', body , {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })
}

export const connectToSocket = async(accessToken: string) => {
  return await axios.get('/connection', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })
}

// Delete the user connection from socket , 
// When SQS polls the request , it sens the request to socket handler which checks if a socket connection with client exit 
// if yest we good for the connection logic 
// else we delete the message . 
// 
export const deleteConnectionRequest = async(requestId? : string, accessToken?: string) => {
  return await axios.post('deleteConnectionRequest', {requestId}, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  })
}

export const postUserDetails = async (userData: any, accessToken: string) => {
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
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading user data:', error);
    throw error;
  }
};