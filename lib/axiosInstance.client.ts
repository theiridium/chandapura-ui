'use client'

import axios from 'axios';
import { useSession } from 'next-auth/react';

const apiHost: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;

const axiosInstance = axios.create({
  baseURL: apiHost + '/',
});

// axiosInstance.interceptors.request.use((config) => {
//   const { data }: any = useSession();
//   if(!!data?.strapiToken)
//     config.headers.Authorization = `Bearer ${data.strapiToken}`;
//   else config.headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
//   return config;
// });

export default axiosInstance;