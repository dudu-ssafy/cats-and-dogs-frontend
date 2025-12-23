
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
    },

    // 장바구니 수량 변경
    updateQuantity(item_id, quantity) {
        return api.patch('carts/', {
            item_id,
            quantity
        });
    }
};

export default cartApi;
