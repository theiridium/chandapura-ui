import axios from 'axios';
import { auth } from './auth';
import { cookies } from 'next/headers';

const apiHost: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;

const axiosInstance = axios.create({
  baseURL: apiHost + '/',
});

// Request interceptor to dynamically add the token
axiosInstance.interceptors.request.use(async (config: any) => {
  const session: any = await auth();
  if (session && session.strapiToken) {
    config.headers.Authorization = `Bearer ${session.strapiToken}`;
  } else {
    config.headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error.message);
});

export default axiosInstance;