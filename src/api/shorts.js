import api from '@/api';

export const shortsApi = {
    // 1. 쇼츠 목록 조회
    getShorts: () => api.get('/shorts/'),

    // 2. 쇼츠 상세 조회 (댓글 포함)
    getShortsDetail: (id) => api.get(`/shorts/${id}/`),

    // 3. 댓글 작성
    createComment: (id, content) => api.post(`/shorts/${id}/comment/`, { content }),

    // 4. 좋아요 토글
    toggleLike: (id) => api.post(`/shorts/${id}/like/`),

    // 5. 내가 찜한 쇼츠 조회
    getLikedShorts: () => api.get('/shorts/find_like_shorts/'),
};
