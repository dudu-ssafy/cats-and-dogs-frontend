import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1/',
    headers: {},
    timeout: 5000,
});

// FastAPI 전용 AI API 인스턴스 (Port 8001)
const aiApi = axios.create({
    baseURL: import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:8001/',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // AI 분석은 시간이 걸릴 수 있어 타임아웃을 길게 설정
});

// Request Interceptor: 모든 요청에 Access Token 주입
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: 401 에러(만료 등) 발생 시 Refresh Token으로 재시도
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고 재시도한 적이 없는 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // Refresh Token으로 새로운 Access Token 요청
                    // 주의: 무한 루프 방지를 위해 api 인스턴스 대신 axios 기본 인스턴스 사용 권장
                    const res = await axios.post(`${api.defaults.baseURL}token/refresh/`, {
                        refresh: refreshToken
                    });

                    const newAccessToken = res.data.access;
                    localStorage.setItem('access_token', newAccessToken);

                    // 원래 요청의 헤더를 새 토큰으로 교체 후 재시도
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // Refresh 실패 시 로그아웃 처리 (localStorage 비우기 등)
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user-info');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export { aiApi };
export default api;
