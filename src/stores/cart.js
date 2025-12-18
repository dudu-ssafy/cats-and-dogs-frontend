import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([
    { 
      id: 1, 
      brand: '네이처키친', 
      name: '프리미엄 사료', 
      price: 28900, 
      quantity: 5, // 👈 합치면 15가 나와야 함
      image: 'https://placehold.co/100x100',
      selected: true 
    },
    { 
      id: 2, 
      brand: '멍멍패션', 
      name: '겨울 패딩', 
      price: 19900, 
      quantity: 10, 
      image: 'https://placehold.co/100x100',
      selected: true 
    }
  ]);

  // ✅ 1. 종류(length)가 아니라 '수량(quantity)'의 합계를 구함
  // Number()를 붙여서 문자열로 변하는 것을 방지합니다.
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + Number(item.quantity || 0), 0);
  });
  
  const totalProductPrice = computed(() => {
    return cartItems.value
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.price * Number(item.quantity)), 0);
  });

  const addToCart = (product, count) => {
    const existingItem = cartItems.value.find(item => item.id === product.id);
    if (existingItem) {
      // ✅ 수량 추가 시 숫자 타입 강제
      existingItem.quantity = Number(existingItem.quantity) + Number(count);
    } else {
      cartItems.value.push({
        ...product,
        quantity: Number(count),
        selected: true
      });
    }
  };

  const removeItem = (id) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id);
  };

  return { cartItems, cartCount, totalProductPrice, addToCart, removeItem }
})