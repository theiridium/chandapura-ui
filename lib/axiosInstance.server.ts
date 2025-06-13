import axios from 'axios';
import { auth } from './auth';
import { signOut } from 'next-auth/react'

const apiHost: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;

const axiosInstance = axios.create({
  baseURL: apiHost + '/',
});

// Request interceptor to dynamically add the token
axiosInstance.interceptors.request.use(async (config: any) => {
  const session: any = await auth();
  if (session && session.strapiToken) {
    // console.log(session.strapiToken)
    config.headers.Authorization = `Bearer ${session.strapiToken}`;
  } else {
    config.headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }
  // console.log(config)
  return config;
}, (error) => {
  return Promise.reject(error.message);
});

// Response interceptor to check for 401 Unauthorized
axiosInstance.interceptors.response.use(
  async (response: any) => {
    console.log("yoi",response)
    if (response?.data?.error?.status === 401) {
      await signOut({ callbackUrl: '/' });
    }
    return response;
  },
  // async (error) => {
  //   // ✅ Case 2: HTTP 401 at network level
  //   const status =
  //     error?.response?.data?.error?.status ||
  //     error?.response?.status;

  //   if (status === 401) {
  //     console.warn('Session expired or unauthorized — network 401');
  //     await signOut({ callbackUrl: '/' });
  //   }
  //   return Promise.reject(error);
  // }
);

export default axiosInstance;