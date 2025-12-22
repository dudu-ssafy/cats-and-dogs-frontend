import api from './index';

export const shortsApi = {
    // 쇼츠 목록 조회
    getShorts(params) {
        return api.get('shorts/', { params });
    },

    // 쇼츠 상세 조회
    getShortsDetail(id) {
        return api.get(`shorts/${id}/`);
    },

    // 쇼츠 좋아요 토글
    toggleLike(id) {
        return api.post(`shorts/${id}/like/`);
    },

    // 쇼츠 댓글 작성
    createComment(id, content) {
        return api.post(`shorts/${id}/comment/`, { content });
    },

    // 좋아요한 쇼츠 목록 조회
    find_like_shorts() {
        return api.get('shorts/find_like_shorts/');
    }
};
