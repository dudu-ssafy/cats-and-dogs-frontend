// 파일 경로: src/stores/cart.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 1. [State] 장바구니 데이터
  const cartItems = ref([
    // 테스트용 샘플 데이터 (필요 없으면 지워도 됩니다)
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
  // 장바구니에 담긴 상품 종류의 수 (또는 총 개수로 수정 가능)
  const cartCount = computed(() => cartItems.value.length);
  
  // 선택된 상품들의 총 결제 금액
  const totalProductPrice = computed(() => {
    return cartItems.value
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  // 3. [Actions] 기능들

  // ✅ [추가됨] 장바구니에 상품 추가하는 함수
  const addToCart = (product, count) => {
    // 3-1. 이미 장바구니에 있는 상품인지 확인 (ID로 비교)
    const existingItem = cartItems.value.find(item => item.id === product.id);

    if (existingItem) {
      // 3-2. 이미 있다면: 수량만 증가
      existingItem.quantity += count;
      console.log(`[장바구니] ${product.name} 수량이 ${count}개 추가되었습니다.`);
    } else {
      // 3-3. 없다면: 새로운 객체로 만들어서 배열에 추가
      // (주의: MainPage의 변수명과 Store의 변수명을 맞춰줘야 합니다)
      cartItems.value.push({
        id: product.id,
        brand: product.brand,
        name: product.name,
        price: product.price,
        quantity: count,
        // MainPage에서는 img, 여기서는 image라고 쓰므로 연결
        image: product.img, 
        option: '기본 옵션', // 상세페이지에 옵션 선택이 없어서 기본값 설정
        selected: true
      });
      console.log(`[장바구니] 새 상품이 추가되었습니다.`);
    }
  };

  // 기존 삭제 함수
  const removeItem = (id) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id);
  };

  // 4. 반환 (여기서 addToCart를 꼭 내보내야 밖에서 쓸 수 있음)
  return { 
    cartItems, 
    cartCount, 
    totalProductPrice, 
    addToCart, 
    removeItem 
  }
})