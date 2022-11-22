import { ACCESS_TOKEN } from '@/utils/constants';
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config: any) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN) : null;
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    console.log(error.config);
    const originalRequest = error.config;

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.status);
      console.log(error.response.headers);

      if (error.response.status === 401) {
        // if (originalRequest.url === '/auth/refresh-token') {
        //   Cookies.remove(process.env.NEXT_PUBLIC_ACCESS_TOKEN || '');
        //   Cookies.remove(process.env.NEXT_PUBLIC_REFRESH_TOKEN || '');
        //   return;
        // }
        // const refreshToken = Cookies.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN || '') || '';
        // jwt.verify(refreshToken, process.env.NEXT_PUBLIC_JWT_KEY || '');
        // axiosClient
        //   .post('/auth/refresh-token', {
        //     refreshToken: Cookies.get(process.env.REACT_APP_REFRESH_TOKEN || 'REFRESH_TOKEN'),
        //   })
        //   .then((res: any) => {
        //     if (res && res.access) {
        //       Cookies.set(
        //         process.env.NEXT_PUBLIC_ACCESS_TOKEN || 'ACCESS_TOKEN',
        //         res.access.token,
        //         {
        //           expires: 1, // 1 day
        //         }
        //       );
        //       axios.defaults.headers.common['Authorization'] = `Bearer ${res.access.token}`;
        //       axiosClient(originalRequest);
        //     }
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
      } else throw new Error(JSON.stringify(error.response.data));
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw new Error(JSON.stringify(error.request));
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(JSON.stringify(error.message));
    }
  }
);

export default axiosClient;
