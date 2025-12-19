import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

// 향후 JWT 토큰 등을 인터셉터에서 처리할 수 있습니다.
// api.interceptors.request.use(...)

export default api;
