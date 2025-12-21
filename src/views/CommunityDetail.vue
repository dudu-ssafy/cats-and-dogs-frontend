<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { boardApi } from '@/api/board';
import BoardSideBar from '@/components/BoardSideBar.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const post = ref(null); 
const isLiked = ref(false); 
const likeCount = ref(0); 

onMounted(async () => {
    const postId = route.params.id;
    try {
        const response = await boardApi.getPostDetail(postId);
        post.value = response.data;
        
        // 데이터 동기화
        isLiked.value = post.value.isLiked || false;
        likeCount.value = post.value.likesCount || 0;
    } catch (error) {
        console.error('게시글 로드 실패:', error);
        alert('삭제되었거나 존재하지 않는 게시글입니다.');
        router.push('/community');
    }
});

const goList = () => {
    router.push('/community');
};

const goCategory = (cat) => {
    router.push({ path: '/community', query: { category: cat } });
};

const toggleLike = async () => {
    if (!userStore.isLogin) {
        alert('로그인이 필요한 서비스입니다.');
        return;
    }
    if (!post.value) return;

    try {
        await boardApi.toggleLike(post.value.id);
        isLiked.value = !isLiked.value;
        likeCount.value += isLiked.value ? 1 : -1;
    } catch (error) {
        console.error('좋아요 토글 실패:', error);
    }
};
</script>

<template>
  <div class="detail-page" v-if="post">
    <div class="container layout-grid">
        
        <BoardSideBar @category-change="goCategory" />

        <main class="main-content">
            <article class="post-view-card">
                <div class="post-header">
                    <span class="category-label">{{ post.categoryName }}</span>
                    <h1 class="post-subject">{{ post.title }}</h1>
                    
                    <div class="post-meta-row">
                        <div class="author-info">
                            <img :src="post.authorProfileImg || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" class="author-img">
                            <div>
                                <span class="author-name">{{ post.author }}</span>
                                <span class="post-date">{{ post.date }}</span>
                            </div>
                        </div>
                        <div class="meta-stats">
                            <span class="stat-item"><span class="material-icons-round" style="font-size:16px">visibility</span> {{ post.views }}</span>
                            <span class="stat-item"><span class="material-icons-round" style="font-size:16px">chat_bubble_outline</span> 4</span>
                        </div>
                    </div>
                </div>

                <div class="post-body" v-html="post.content || '<p>내용이 없습니다.</p>'"></div>

                <div class="post-actions">
                    <button class="btn-paw-like" :class="{ active: isLiked }" @click="toggleLike">
                        <span class="material-icons-round">pets</span>
                        <span class="like-count">{{ likeCount }}</span>
                    </button>
                    
                    <div class="btn-group">
                        <button class="btn-outline">신고</button>
                        <button class="btn-outline" @click="goList">목록으로</button>
                    </div>
                </div>
            </article>

            <section class="comment-section">
                <h3 class="cmt-header">댓글 <span class="cmt-count">4</span></h3>
                <div class="cmt-input-box">
                    <textarea class="cmt-textarea" placeholder="따뜻한 댓글을 남겨주세요."></textarea>
                    <button class="btn-submit-cmt">등록</button>
                </div>
                <div class="cmt-list">
                    <div class="cmt-item">
                        <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" class="cmt-avatar">
                        <div class="cmt-content">
                            <div class="cmt-meta">
                                <span class="cmt-writer">멍멍박사</span>
                                <span class="cmt-date">14:35</span>
                            </div>
                            <p class="cmt-text">혹시 최근에 산책하다가 놀란 적 없나요? 큰 소리나 다른 강아지 때문에 트라우마가 생겼을 수도 있어요.</p>
                            <span class="cmt-reply-btn">답글 달기</span>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
    --bg-base: #FDFCF8; --bg-white: #FFFFFF;
    --primary-honey: #FFD54F; --primary-deep: #FFC107; --accent-butter: #FFFDE7;
    --baby-pink-bg: #FFF0F3; --baby-pink-border: #FFB7C5; --baby-pink-text: #FF8C94;
    --text-title: #4A3F35; --text-body: #5D5D5D; --text-light: #999999;
    --line-border: #EAEAEA; --radius-lg: 20px; --shadow-card: 0 4px 12px rgba(0,0,0,0.03);
    background-color: var(--bg-base); min-height: 100vh;
    color: var(--text-title); font-family: 'NanumSquareRound', sans-serif; padding-top: 40px;
}
a { text-decoration: none; color: inherit; }
ul { list-style: none; padding: 0; margin: 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.layout-grid { display: flex; gap: 40px; padding-bottom: 100px; }
.main-content { flex: 1; min-width: 0; }

.post-view-card { background: white; border-radius: var(--radius-lg); border: 1px solid var(--line-border); box-shadow: var(--shadow-card); padding: 40px; margin-bottom: 40px; }
.post-header { border-bottom: 1px solid var(--line-border); padding-bottom: 24px; margin-bottom: 32px; }
.category-label { font-size: 13px; font-weight: 800; color: #2E7D32; background: #E8F5E9; padding: 4px 10px; border-radius: 6px; display: inline-block; margin-bottom: 12px; }
.post-subject { font-size: 28px; font-weight: 800; color: var(--text-title); margin-bottom: 20px; line-height: 1.3; }
.post-meta-row { display: flex; justify-content: space-between; align-items: center; }
.author-info { display: flex; align-items: center; gap: 10px; }
.author-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #eee; }
.author-name { font-weight: 700; font-size: 15px; color: var(--text-title); }
.post-date { font-size: 13px; color: var(--text-light); margin-left: 8px; }
.meta-stats { display: flex; gap: 16px; font-size: 13px; color: var(--text-light); }
.stat-item { display: flex; align-items: center; gap: 4px; }
.post-body { font-size: 16px; color: var(--text-body); line-height: 1.8; min-height: 300px; margin-bottom: 40px; }
:deep(.post-body img) { max-width: 100%; border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.05); display: block; }

.post-actions { display: flex; flex-direction: column; align-items: center; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--line-border); }

.btn-paw-like { 
    width: 90px; height: 90px; 
    border-radius: 50%; background: #FFFFFF; 
    border: 2px solid #EEEEEE; display: flex; flex-direction: column; 
    align-items: center; justify-content: center; cursor: pointer; 
    color: #CCCCCC; 
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
}
.btn-paw-like .material-icons-round { font-size: 40px; margin-bottom: 2px; }
.btn-paw-like .like-count { font-weight: 800; font-size: 15px; color: inherit; }
.btn-paw-like.active { border-color: var(--baby-pink-border); background: var(--baby-pink-bg); color: var(--baby-pink-text); transform: scale(1.1) rotate(-10deg); box-shadow: 0 8px 20px rgba(255, 140, 148, 0.15); }
.btn-paw-like:hover:not(.active) { background: #F9F9F9; border-color: #E0E0E0; }

.btn-group { display: flex; gap: 12px; width: 100%; justify-content: flex-end; margin-top: 10px; }
.btn-outline { padding: 8px 16px; border: 1px solid var(--line-border); background: white; border-radius: 8px; font-size: 13px; font-weight: 600; color: var(--text-body); cursor: pointer; }
.btn-outline:hover { background: #F9FAFB; color: var(--text-title); }
.comment-section { background: #FAFAFA; border-radius: var(--radius-lg); padding: 32px; border: 1px solid var(--line-border); }
.cmt-header { font-size: 18px; font-weight: 800; margin-bottom: 20px; color: var(--text-title); }
.cmt-count { color: var(--primary-deep); margin-left: 4px; }
.cmt-input-box { background: white; border: 1px solid var(--line-border); border-radius: 12px; padding: 16px; margin-bottom: 32px; display: flex; flex-direction: column; gap: 12px; }
.cmt-textarea { width: 100%; border: none; resize: none; outline: none; font-size: 14px; font-family: inherit; min-height: 60px; }
.btn-submit-cmt { align-self: flex-end; background: var(--primary-honey); color: white; padding: 8px 20px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; }
.cmt-list { display: flex; flex-direction: column; gap: 24px; }
.cmt-item { display: flex; gap: 16px; }
.cmt-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; background: #ddd; flex-shrink: 0; }
.cmt-content { flex: 1; }
.cmt-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.cmt-writer { font-weight: 700; font-size: 14px; color: var(--text-title); }
.cmt-date { font-size: 12px; color: var(--text-light); }
.cmt-text { font-size: 14px; color: var(--text-body); line-height: 1.5; margin-bottom: 8px; }
.cmt-reply-btn { font-size: 12px; color: var(--text-light); font-weight: 600; cursor: pointer; }
</style>