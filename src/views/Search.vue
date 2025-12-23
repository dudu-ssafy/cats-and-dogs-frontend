<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api'; 

const route = useRoute();
const router = useRouter();

const searchQuery = computed(() => route.query.q || '');
const localInput = ref(searchQuery.value);
const isLoading = ref(false);
const searchResults = ref({ shorts: [], community: [], store: [] });

const fetchResults = async (q) => {
    if (!q) {
        searchResults.value = { shorts: [], community: [], store: [] };
        return;
    }
    
    isLoading.value = true;
    try {
        const response = await api.get('/search/', {
            params: { query: q }
        });
        
        const data = response.data.results;
        
        searchResults.value = {
            shorts: (data.shorts || []).map(item => ({
                ...item,
                thumb: item.thumbnail_url || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400',
                views: item.views || 0 // Backend currently returns 0 or field might be missing, formatted in UI?
            })),
            community: (data.boards || []).map(item => ({
                ...item,
                comments: item.comments || 0,
                // date formatting handled in backend as 'YYYY-MM-DD'
            })),
            store: (data.products || []).map(item => ({
                ...item,
                // Backend sends 'img' and 'price' formatted
            }))
        };

    } catch (error) {
        console.error("Search failed:", error);
        // Error handling or empty results
        searchResults.value = { shorts: [], community: [], store: [] };
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => fetchResults(searchQuery.value));

watch(() => route.query.q, (newQ) => {
    localInput.value = newQ;
    fetchResults(newQ);
});

const goBack = () => router.back();
const handleInternalSearch = () => {
    if (localInput.value.trim()) {
        router.push({ path: '/search', query: { q: localInput.value } });
    }
};

const goToDetail = (type, id) => {
    if (type === 'community') router.push(`/community/post/${id}`);
    else if (type === 'shorts') router.push(`/shorts/${id}`);
    else if (type === 'store') router.push(`/shop/product/${id}`);
};
</script>

<template>
  <div class="search-page">
    <header class="search-header">
      <div class="container header-inner">
        <button class="btn-back" @click="goBack">
          <span class="material-icons-round">arrow_back_ios</span>
        </button>
        <div class="header-search-bar">
            <input 
                type="text" 
                v-model="localInput" 
                @keyup.enter="handleInternalSearch"
                placeholder="검색어를 입력하세요"
            >
            <span class="material-icons-round" @click="handleInternalSearch">search</span>
        </div>
      </div>
    </header>

    <div class="container content-body">
      <div v-if="isLoading" class="u-text-center u-p-60">
        <div class="loader"></div>
        <p>검색 결과를 불러오는 중입니다...</p>
      </div>

      <template v-else>
        <div v-if="!searchResults.shorts.length && !searchResults.community.length" class="u-text-center u-p-60">
            <span class="material-icons-round" style="font-size:48px; color:#DDD;">search_off</span>
            <p>"{{ searchQuery }}"에 대한 검색 결과가 없습니다.</p>
        </div>

        <section class="result-section" v-if="searchResults.shorts.length > 0">
            <div class="section-head">
            <h2 class="section-ttl">쇼츠 영상 <span>{{ searchResults.shorts.length }}</span></h2>
            <button class="btn-more" @click="router.push('/shorts')">더보기 +</button>
            </div>
            <div class="shorts-grid">
            <div v-for="item in searchResults.shorts" :key="item.id" class="shorts-card" @click="goToDetail('shorts', item.id)">
                <div class="thumb-wrap" :style="{ backgroundImage: `url(${item.thumb})` }">
                <div class="play-overlay"><span class="material-icons-round">play_arrow</span></div>
                <span class="view-tag">{{ item.views }}</span>
                </div>
                <p class="card-title">{{ item.title }}</p>
            </div>
            </div>
        </section>

        <section class="result-section" v-if="searchResults.community.length > 0">
            <div class="section-head">
            <h2 class="section-ttl">커뮤니티 글 <span>{{ searchResults.community.length }}</span></h2>
            <button class="btn-more" @click="router.push('/community')">더보기 +</button>
            </div>
            <ul class="community-list">
            <li v-for="post in searchResults.community" :key="post.id" class="list-item" @click="goToDetail('community', post.id)">
                <span class="cat-badge">{{ post.category }}</span>
                <div class="post-info">
                <p class="post-ttl">{{ post.title }} <span class="cmt">[{{ post.comments }}]</span></p>
                <p class="post-meta">{{ post.author }} · {{ post.date }}</p>
                </div>
            </li>
            </ul>
        </section>

        <section class="result-section" v-if="searchResults.store.length > 0">
            <div class="section-head">
            <h2 class="section-ttl">추천 상품 <span>{{ searchResults.store.length }}</span></h2>
            <button class="btn-more" @click="router.push('/shop')">더보기 +</button>
            </div>
            <div class="store-grid">
            <div v-for="prod in searchResults.store" :key="prod.id" class="product-card" @click="goToDetail('store', prod.id)">
                <img :src="prod.img" :alt="prod.name" class="prod-img">
                <div class="prod-info">
                <p class="prod-name">{{ prod.name }}</p>
                <p class="prod-price">{{ prod.price }}</p>
                </div>
            </div>
            </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  --primary-honey: #FFB300;
  --text-brown: #4E342E;
  --line-light: #EEE; /* 선 색상을 더 연하게 변경 */ 
  background-color: #FDFCF8;
  min-height: 100vh;
  padding-bottom: 80px;
}
.container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }

/* Header & Search Bar */
.search-header { background: #fff; padding: 16px 0; border-bottom: 1px solid var(--line-light); position: sticky; top: 0; z-index: 100; }
.header-inner { display: flex; align-items: center; gap: 16px; }
.header-search-bar { flex: 1; display: flex; align-items: center; background: #F5F5F5; padding: 8px 16px; border-radius: 100px; }
.header-search-bar input { flex: 1; background: none; border: none; outline: none; font-size: 16px; font-family: inherit; }
.header-search-bar span { color: var(--primary-honey); cursor: pointer; }

.btn-back { background: none; border: none; cursor: pointer; color: var(--text-brown); display: flex; align-items: center; }

/* Section & Lists */
.result-section { margin-top: 40px; }
.section-head { 
    display: flex; 
    justify-content: space-between; 
    align-items: flex-end; 
    margin-bottom: 16px; 
    border-bottom: 1px solid var(--line-light); /* 선 두께와 색상 완화 */
    padding-bottom: 10px; 
}
.section-ttl { font-family: 'Jua', cursive; font-size: 20px; color: var(--text-brown); }
.section-ttl span { font-size: 14px; color: var(--primary-honey); margin-left: 6px; }
.btn-more { background: none; border: none; color: #BBB; font-size: 13px; cursor: pointer; }

/* 1. Shorts Grid - 크기 축소 */
.shorts-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* 최소 너비를 200->150으로 축소 */
    gap: 12px; 
}
.shorts-card { cursor: pointer; }
.thumb-wrap { 
    width: 100%; 
    aspect-ratio: 9/16; 
    border-radius: 12px; 
    background-size: cover; 
    background-position: center; 
    position: relative; 
    overflow: hidden; 
    border: 1px solid var(--line-light); /* 무거운 흰색 테두리 대신 얇은 선 */
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); 
}
.play-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
.shorts-card:hover .play-overlay { opacity: 1; }
.view-tag { position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.5); color: #fff; font-size: 11px; padding: 2px 6px; border-radius: 4px; }
.card-title { 
    margin-top: 8px; 
    font-weight: 600; 
    font-size: 14px; 
    color: var(--text-brown);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 2. Community List */
.community-list { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid var(--line-light); }
.list-item { padding: 16px; border-bottom: 1px solid var(--line-light); display: flex; gap: 12px; align-items: center; cursor: pointer; }
.list-item:last-child { border-bottom: none; }
.list-item:hover { background: #FAF9F6; }
.cat-badge { background: #F5F5F5; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; color: #888; }
.post-ttl { font-weight: 600; font-size: 15px; color: var(--text-brown); }
.cmt { color: #FF5252; font-size: 13px; font-weight: 700; }
.post-meta { font-size: 12px; color: #AAA; margin-top: 2px; }

/* 3. Store Grid */
.store-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.product-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid var(--line-light); cursor: pointer; transition: 0.2s; }
.product-card:hover { transform: translateY(-3px); box-shadow: 0 6px 15px rgba(0,0,0,0.06); }
.prod-img { width: 100%; aspect-ratio: 1/1; object-fit: cover; }
.prod-info { padding: 12px; }
.prod-name { font-weight: 600; color: var(--text-brown); font-size: 14px; margin-bottom: 4px; }
.prod-price { color: var(--primary-honey); font-weight: 800; font-size: 16px; }

/* Utility */
.u-text-center { text-align: center; }
.u-p-60 { padding: 60px 0; }
.loader { border: 3px solid #f3f3f3; border-top: 3px solid var(--primary-honey); border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 0 auto 10px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .shorts-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
  .store-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>