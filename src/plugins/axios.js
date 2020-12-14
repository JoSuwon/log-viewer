import axios from 'axios';

export const API = axios.create({
  baseURL: process.env.VUE_APP_API_HOST,
  timeout: 20000,
});