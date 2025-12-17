// 파일 경로: src/stores/cart.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 1. [State] 장바구니 데이터
  const cartItems = ref([
    { 
      id: 1, 
      brand: '네이처키친', 
      name: '프리미엄 유기농 강아지 사료 2kg', 
      option: '연어맛 / 1개',
      price: 28900, 
      quantity: 1, 
      image: 'https://placehold.co/100x100/F0F0F0/999999?text=Feed',
      selected: true 
    },
    { 
      id: 2, 
      brand: '멍멍패션', 
      name: '따뜻한 털안감 체크무늬 겨울 패딩', 
      option: '레드 / M사이즈',
      price: 19900, 
      quantity: 1, 
      image: 'https://placehold.co/100x100/F0F0F0/999999?text=Padding',
      selected: true 
    }
  ]);

  // 2. [Getters] 계산된 값들
  // 장바구니에 담긴 총 개수
  const cartCount = computed(() => cartItems.value.length);
  
  // 선택된 상품 총 금액
  const totalProductPrice = computed(() => {
    return cartItems.value
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  // 3. [Actions] 기능들 (삭제하기)
  const removeItem = (id) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id);
  };

  return { cartItems, cartCount, totalProductPrice, removeItem }
})