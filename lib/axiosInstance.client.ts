'use client'

import axios from 'axios';
import { useSession } from 'next-auth/react';

const apiHost: any = process.env.NEXT_PUBLIC_STRAPI_API_URL;

const axiosInstance = axios.create({
  baseURL: apiHost + '/',
});

export default axiosInstance;