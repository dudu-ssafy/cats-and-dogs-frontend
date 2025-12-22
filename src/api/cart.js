
import api from '@/api/index';

const cartApi = {
    // 장바구니 목록 조회
    getCart() {
        return api.get('carts/');
    },

    // 장바구니 담기 (상품 옵션 ID, 수량)
    // payload: { product_option_id: number, quantity: number }
    addToCart(product_option_id, quantity, product_id = null) {
        return api.post('carts/', {
            product_option_id,
            quantity,
            product_id
        });
    },

    // 장바구니 항목 삭제
    removeFromCart(item_id) {
        return api.delete('carts/', {
            data: { item_id }
        });
    }

    // 수량 변경을 위한 업데이트 API는 현재 백엔드에 없으므로
    // 필요 시 추가하거나 add_or_update 로직 활용
    // 현재는 addToCart가 add_or_update 역할을 하므로 이를 재사용할 수도 있음
};

export default cartApi;
