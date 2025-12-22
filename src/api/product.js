import api from './index';

export const productApi = {
    // 상품 목록 조회 (필터링 포함)
    getProducts(params) {
        return api.get('products/', { params });
    },

    // 상품 상세 조회
    getProductDetail(id) {
        return api.get(`products/${id}/`);
    },
    
    // 카테고리별 상품 조회 (편의 메서드)
    getProductsByCategory(category) {
        return api.get('products/', { 
            params: { category } 
        });
    }
};
