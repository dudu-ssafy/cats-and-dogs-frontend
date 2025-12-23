import api from '@/api/index';

export const paymentApi = {
    // 카카오페이 결제 준비
    kakaoReady: () => api.post(
        '/payments/kakao_ready/',
    ),

    // 결제 검증 (필요시)
    verify: (data) => api.post('/payments/verify/', data)
};

export default paymentApi;
