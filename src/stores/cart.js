import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import cartApi from '@/api/cart';

export const useCartStore = defineStore('cart', () => {
  // State
  const cartItems = ref([]);
  const isLoading = ref(false);

  // Getter: 장바구니 총 수량
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + Number(item.quantity || 0), 0);
  });

  // Getter: 장바구니 총 금액
  const totalProductPrice = computed(() => {
    return cartItems.value
      .filter(item => item.selected)
      .reduce((sum, item) => {
        // 백엔드 구조에 맞게 계산: (기본가 + 옵션가) * 수량
        // 백엔드 응답에서 제품 정보(기본가)를 알 수 없으나, 
        // 아까 본 BasketSerializer를 보면 `item.product.base_price` 등이 포함되어 있지 않고 
        // total_price는 전체 합계만 줌.
        // 따라서 프론트에서 계산하려면 BasketItemSerializer에 단가 정보가 있어야 함.
        // 현재 BasketItemSerializer fields: ['id', 'option_id', 'quantity', 'product_name', 'option_value', 'price_at_addition']
        // price_at_addition(추가 시점 가격) 사용.
        const price = Number(item.price_at_addition || 0);
        return sum + (price * Number(item.quantity));
      }, 0);
  });

  // Action: 장바구니 목록 조회
  const fetchCart = async () => {
    isLoading.value = true;
    try {
      const response = await cartApi.getCart();
      // response.data 구조: { items: [], total_items_count, total_price, ... }
      if (response.data && response.data.items) {
        cartItems.value = response.data.items.map(item => ({
          ...item,
          selected: true // 기본 선택 상태
        }));
      } else {
        cartItems.value = [];
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Action: 장바구니 담기
  const addToCart = async (optionId, quantity, productId = null) => {
    try {
      await cartApi.addToCart(optionId, quantity, productId);
      await fetchCart(); // 목록 갱신
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('장바구니 담기에 실패했습니다.');
      throw error; // UI에서 처리할 수 있도록 throw
    }
  };

  // Action: 장바구니 삭제
  const removeItem = async (itemId) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await cartApi.removeFromCart(itemId);
      await fetchCart(); // 목록 갱신
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  return { cartItems, isLoading, cartCount, totalProductPrice, fetchCart, addToCart, removeItem }
})