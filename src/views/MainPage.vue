<script setup>
import { useRouter } from 'vue-router';

const trendingPosts = [
    { title: "강아지가 갑자기 산책을 거부할 때...", category: "질문", comments: 15 },
    { title: "겨울철 강아지 발바닥 관리 꿀팁", category: "정보", comments: 32 },
    { title: "냥줍했어요 ㅠㅠ 이름 추천받아요", category: "자유", comments: 88 },
];

const shopItems = [
    { name: "푹신푹신 강아지 인형", price: "24,000원", img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&auto=format&fit=crop' },
    { name: "프리미엄 캣그라스 키트", price: "9,900원", img: 'https://images.unsplash.com/photo-1577023307521-177395011985?q=80&w=200&auto=format&fit=crop' },
    { name: "AI 추천 사료 (소형견)", price: "45,000원", img: 'https://images.unsplash.com/photo-1583344686968-3f82247c4e57?q=80&w=200&auto=format&fit=crop' },
];

const router = useRouter();
</script>

<template>
  <div class="home-view">
    
    <section class="hero-section">
      <div class="container hero-inner">
        <div class="hero-text-area">
          <h1 class="hero-title font-title">
            반려동물 건강,<br>
            **AI 주치의**가 함께 할개냥 🐾
          </h1>
          <p class="hero-subtitle">
            궁금한 증상을 사진으로 찍어주세요.<br>
            3초 안에 분석 결과를 알려드립니다.
          </p>
          <button class="btn-primary-large" @click="router.push('/ai')">
            <span class="material-icons-round">stethoscope</span> AI 진단 시작하기
          </button>
        </div>
        <div class="hero-image-area">
          <img src="https://images.unsplash.com/photo-1552053831-71594a27632a?q=80&w=600&auto=format&fit=crop" class="hero-image" alt="강아지 사진">
        </div>
      </div>
    </section>

    <div class="container">
      
      <section class="service-menu-section">
        <div class="menu-card" @click="router.push('/community')">
          <span class="material-icons-round menu-icon">forum</span>
          <p class="menu-title">커뮤니티</p>
          <small class="menu-desc">집사들과 소통해요</small>
        </div>
        <div class="menu-card" @click="router.push('/shorts')">
          <span class="material-icons-round menu-icon">videocam</span>
          <p class="menu-title">숏츠</p>
          <small class="menu-desc">귀여운 일상 공유</small>
        </div>
        <div class="menu-card" @click="router.push('/shop')">
          <span class="material-icons-round menu-icon">store</span>
          <p class="menu-title">쇼핑몰</p>
          <small class="menu-desc">건강 맞춤 상품</small>
        </div>
        <div class="menu-card accent" @click="router.push('/my-profile')">
          <span class="material-icons-round menu-icon">favorite</span>
          <p class="menu-title">마이페이지</p>
          <small class="menu-desc">내 기록 확인</small>
        </div>
      </section>

      <section class="magazine-section">
        <h2 class="section-heading font-title">
          🔥 오늘의 핫토픽 & 최신 쇼츠
        </h2>
        <div class="magazine-grid">
            
            <div class="community-preview">
                <h3 class="preview-title">인기 게시글 TOP 3</h3>
                <div v-for="post in trendingPosts" :key="post.title" class="post-row">
                    <span class="row-category">[{{ post.category }}]</span>
                    <p class="row-title">{{ post.title }}</p>
                    <span class="row-comments">({{ post.comments }})</span>
                </div>
                <button class="btn-more-text" @click="router.push('/community')">
                    커뮤니티 전체보기 <span class="material-icons-round">chevron_right</span>
                </button>
            </div>

            <div class="shorts-preview">
                <h3 class="preview-title">#귀여움주의 최신 쇼츠</h3>
                <div class="shorts-list">
                    <div class="shorts-thumb">
                        <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=150&auto=format&fit=crop" alt="쇼츠">
                        <span class="material-icons-round play-icon">play_arrow</span>
                    </div>
                    <div class="shorts-thumb">
                        <img src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=150&auto=format&fit=crop" alt="쇼츠">
                        <span class="material-icons-round play-icon">play_arrow</span>
                    </div>
                    <div class="shorts-thumb more-thumb" @click="router.push('/shorts')">
                        <span class="material-icons-round">add_circle_outline</span>
                        <p>더보기</p>
                    </div>
                </div>
            </div>

        </div>
      </section>

      <section class="shop-recommend-section">
        <h2 class="section-heading font-title">
          🎁 AI 추천 베스트 아이템
        </h2>
        <div class="shop-bento-grid">
            <div class="shop-item shop-big-card" @click="router.push('/shop/event')">
                <div class="big-card-text">
                    <span class="tag">SPECIAL SALE</span>
                    <p class="big-title font-title">알러지 사료<br>7일 체험팩 50% 할인</p>
                    <button class="btn-shop-event">지금 받기</button>
                </div>
                <img src="https://images.unsplash.com/photo-1583344686968-3f82247c4e57?q=80&w=300&auto=format&fit=crop" class="big-card-img" alt="이벤트 상품">
            </div>

            <div class="shop-item shop-small-card">
                <img :src="shopItems[0].img" :alt="shopItems[0].name" class="item-img-small">
                <p class="item-name-small">{{ shopItems[0].name }}</p>
                <span class="item-price-small">{{ shopItems[0].price }}</span>
            </div>

             <div class="shop-item shop-small-card">
                <img :src="shopItems[1].img" :alt="shopItems[1].name" class="item-img-small">
                <p class="item-name-small">{{ shopItems[1].name }}</p>
                <span class="item-price-small">{{ shopItems[1].price }}</span>
            </div>
        </div>
      </section>
      
    </div>
  </div>
</template>

<style scoped>
/* =================================== */
/* 글로벌 스타일 변수 및 베이스 */
/* =================================== */
.home-view {
    --color-primary: #FFC107;       /* Deep Honey */
    --color-accent: #795548;        /* Mocha Brown */
    --color-secondary: #8BC34A;     /* Soft Green */
    --color-background: #FFFDF5;    /* Soft Cream */
    --color-text-body: #5D4037;     /* Dark Brown */
    --color-text-dark: #3E2723;     /* Blackish Brown */
    --radius-card: 16px;
    --shadow-base: 0 8px 15px rgba(0, 0, 0, 0.05);

    background-color: var(--color-background);
    padding-bottom: 100px;
}
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.font-title { font-family: 'Jua', cursive; }
.section-heading {
    font-size: 28px;
    color: var(--color-text-dark);
    text-align: center;
    margin-bottom: 40px;
    margin-top: 80px; /* 섹션 간격 확보 */
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
.btn {
    border: none;
    cursor: pointer;
    transition: 0.3s;
    font-family: 'Jua', cursive;
}
.btn-primary-large {
    padding: 14px 30px;
    background: var(--color-primary);
    color: var(--color-text-dark);
    font-size: 20px;
    font-weight: 700;
    border-radius: 50px;
    box-shadow: 0 8px 15px rgba(255, 193, 7, 0.4);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
}
.btn-primary-large:hover {
    background: #FFB300;
    transform: translateY(-2px);
}

/* =================================== */
/* 1. HERO SECTION */
/* =================================== */
.hero-section {
    padding: 80px 0;
    background-color: white; /* 히어로 섹션만 배경 흰색 */
    margin-bottom: 40px;
    /* 🔥 [포인트] 발바닥 패턴 배경 추가 */
    background-image: radial-gradient(#FFC107 10%, transparent 11%), radial-gradient(#FFC107 10%, transparent 11%);
    background-size: 80px 80px;
    background-position: 0 0, 40px 40px;
    opacity: 0.05;
}
.hero-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
}
.hero-text-area {
    flex: 1;
    max-width: 50%;
    z-index: 10;
}
.hero-title {
    font-size: 52px;
    line-height: 1.2;
    color: var(--color-accent);
    margin-bottom: 20px;
}
.hero-title strong {
    color: var(--color-primary);
}
.hero-subtitle {
    font-size: 18px;
    color: var(--color-text-body);
    line-height: 1.6;
}
.hero-image-area {
    flex: 1;
    display: flex;
    justify-content: flex-end;
}
.hero-image {
    width: 100%;
    max-width: 500px;
    height: 400px;
    object-fit: cover;
    border-radius: var(--radius-card);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

/* =================================== */
/* 2. SERVICE MENU SECTION */
/* =================================== */
.service-menu-section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 60px;
}
.menu-card {
    background: white;
    padding: 25px;
    border-radius: var(--radius-card);
    text-align: center;
    cursor: pointer;
    box-shadow: var(--shadow-base);
    transition: 0.3s;
    border: 2px solid transparent;
}
.menu-card:hover {
    transform: translateY(-5px);
    border-color: var(--color-primary);
    box-shadow: 0 12px 20px rgba(255, 193, 7, 0.2);
}
.menu-icon {
    font-size: 36px;
    color: var(--color-primary);
    margin-bottom: 10px;
}
.menu-card.accent .menu-icon {
    color: var(--color-secondary);
}
.menu-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 5px 0;
    color: var(--color-text-dark);
}
.menu-desc {
    font-size: 13px;
    color: var(--color-text-body);
}

/* =================================== */
/* 3. MAGAZINE/COMMUNITY SECTION */
/* =================================== */
.magazine-section {
    background-color: var(--color-background);
}
.magazine-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr; /* 좌우 비율 조정 */
    gap: 40px;
    background: white;
    padding: 30px;
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-base);
}
.preview-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--color-accent);
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #EEE;
}
.community-preview {
    padding-right: 20px;
}
.post-row {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px dashed #F5F5F5;
    cursor: pointer;
}
.post-row:hover .row-title {
    color: var(--color-primary);
}
.row-category {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-secondary);
    width: 80px;
    flex-shrink: 0;
}
.row-title {
    flex: 1;
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.row-comments {
    font-size: 13px;
    color: #FF5252;
    font-weight: 700;
    flex-shrink: 0;
}
.btn-more-text {
    background: none;
    border: none;
    color: var(--color-text-body);
    font-size: 14px;
    font-weight: 700;
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    float: right;
}
.btn-more-text:hover {
    color: var(--color-accent);
}

/* 쇼츠 리스트 */
.shorts-preview {
    background-color: #F8F8F8;
    padding: 20px;
    border-radius: var(--radius-card);
}
.shorts-list {
    display: flex;
    gap: 15px;
    justify-content: space-between;
}
.shorts-thumb {
    width: 100%;
    max-width: 150px;
    aspect-ratio: 9/16;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.shorts-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 40px;
    color: white;
    opacity: 0.8;
}
.more-thumb {
    background: #E0E0E0;
    color: #888;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
}
.more-thumb:hover {
    background: #CCC;
    color: var(--color-text-dark);
}

/* =================================== */
/* 4. SHOP BENO BOX SECTION */
/* =================================== */
.shop-bento-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr; /* 2:1:1 비율 */
    gap: 20px;
}
.shop-item {
    background: white;
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-base);
    overflow: hidden;
    transition: 0.3s;
    cursor: pointer;
}
.shop-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 25px rgba(0,0,0,0.15);
}

/* Big Card (2x1) */
.shop-big-card {
    grid-column: span 2;
    display: flex;
    align-items: center;
    background: #F4EADF; /* 연한 갈색 배경 */
    padding: 30px;
}
.big-card-text {
    flex: 1;
    padding-right: 20px;
}
.tag {
    background: #FF5252;
    color: white;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 50px;
    margin-bottom: 10px;
    display: inline-block;
}
.big-title {
    font-size: 30px;
    line-height: 1.3;
    color: var(--color-accent);
    margin-bottom: 15px;
}
.btn-shop-event {
    background: var(--color-primary);
    color: white;
    padding: 10px 25px;
    border-radius: 50px;
    font-weight: 700;
    font-size: 16px;
}
.big-card-img {
    width: 200px;
    height: 200px;
    object-fit: contain;
}

/* Small Cards (1x1) */
.shop-small-card {
    text-align: center;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.item-img-small {
    width: 100%;
    height: 120px;
    object-fit: contain;
    margin-bottom: 10px;
}
.item-name-small {
    font-size: 15px;
    font-weight: 700;
    color: var(--color-text-dark);
    margin-bottom: 5px;
}
.item-price-small {
    font-size: 14px;
    color: var(--color-primary);
    font-weight: 700;
}
</style>