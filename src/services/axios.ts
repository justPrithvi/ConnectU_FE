import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',  // replace with your API's base URL
  timeout: 10000,
});

export default axiosInstance;
