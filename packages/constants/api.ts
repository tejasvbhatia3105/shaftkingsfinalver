import axios from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'cloudflare-secret': process.env.CLOUDFLARE_SECRET!,
  },
});

export default api;
