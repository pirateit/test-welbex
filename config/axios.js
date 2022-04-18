import axios from 'axios';

var axiosClient = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 5000,
});

export default axiosClient;
