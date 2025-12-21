import api from './index';

export const boardApi = {
    // 게시글 목록 조회 (필터 및 페이지네이션 포함)
    getPosts(params) {
        return api.get('boards/', { params });
    },

    // 인기 게시글 조회
    getPopularPosts() {
        return api.get('boards/popular/');
    },

    // 게시글 상세 조회
    getPostDetail(id) {
        return api.get(`boards/${id}/`);
    },

    // 게시글 작성
    createPost(data) {
        return api.post('boards/', data);
    },

    // 게시글 수정
    updatePost(id, data) {
        return api.patch(`boards/${id}/`, data);
    },

    // 게시글 삭제
    deletePost(id) {
        return api.delete(`boards/${id}/`);
    },

    // 게시글 좋아요 토글
    toggleLike(id) {
        return api.post(`boards/${id}/like/`);
    }
};
