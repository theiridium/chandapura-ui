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
    if (response?.data?.error?.status === 401) {
      await serverLogoutAction();
    }
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      await serverLogoutAction();
    }
    return Promise.reject(error);
  }
);

async function serverLogoutAction() {
  cookies().set({
    name: 'next-auth.session-token',
    value: '',
    path: '/',
    maxAge: 0,
  });
}

export default axiosInstance;