<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user'; 
import { boardApi } from '@/api/board';
import BoardSideBar from '@/components/BoardSideBar.vue';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const posts = ref([]);
const popularPosts = ref([]);
const currentCategory = ref('all'); 
const totalPosts = ref(0);
const isLoading = ref(false);

const currentPage = ref(1);
const itemsPerPage = 10; 

const fetchPopularPosts = async () => {
    try {
        const response = await boardApi.getPopularPosts();
        popularPosts.value = response.data;
    } catch (error) {
        console.error('Failed to fetch popular posts:', error);
    }
};

const fetchPosts = async () => {
    isLoading.value = true;
    try {
        const params = {
            page: currentPage.value,
        };

        if (currentCategory.value === 'hot') {
            params.type = 'hot';
        } else if (currentCategory.value === 'my-posts') {
            params.type = 'my-posts';
        } else if (currentCategory.value === 'liked-posts') {
            params.type = 'liked-posts';
        } else if (currentCategory.value !== 'all') {
            params.category = currentCategory.value;
        }

        const response = await boardApi.getPosts(params);
        posts.value = response.data.results;
        totalPosts.value = response.data.count;
    } catch (error) {
        console.error('Failed to fetch posts:', error);
    } finally {
        isLoading.value = false;
    }
};

const goWrite = () => {
    if (!userStore.isLogin) {
        alert('글쓰기는 로그인 후 이용 가능합니다.');
        router.push('/login');
        return;
    }
    router.push('/community/write');
};

onMounted(() => {
    if (route.query.category) {
        currentCategory.value = route.query.category;
    }

    if (route.query.sort) {
        if (route.query.sort === 'popular') currentCategory.value = 'hot';
        else if (route.query.sort === 'latest') currentCategory.value = 'all';
    }

    fetchPosts();
    fetchPopularPosts();
});

watch([currentCategory, currentPage], () => {
    fetchPosts();
});

const totalPages = computed(() => {
    return Math.ceil(totalPosts.value / itemsPerPage);
});

const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const setCategory = (category_name) => {
    currentCategory.value = category_name;
    currentPage.value = 1; 
};
const paginatedPosts = computed(() => posts.value);
const filteredPosts = computed(() => posts.value);
</script>

<template>
  <div class="community-page">
    <div class="container layout-grid">
        
        <BoardSideBar :currentCategory="currentCategory" @category-change="setCategory" />

        <main class="main-content">
            <div class="top-section" v-if="currentCategory === 'all' && currentPage === 1">
                <div class="best-container">
                    <div class="section-head">
                        <span class="section-title">
                            <span class="material-icons-round" style="color:var(--primary-honey)">emoji_events</span>
                            실시간 인기글
                        </span>
                    </div>
                    <div class="best-list-wrap">
                         <div>
                            <div 
                                v-for="(post, index) in popularPosts.slice(0, 5)" 
                                :key="post.id" 
                                class="best-row"
                                @click="router.push(`/community/post/${post.id}`)"
                            >
                                <span class="rank-no" :class="{ top: index < 3 }">{{ index + 1 }}</span>
                                <span class="best-txt">{{ post.title }}</span>
                                <span class="cmt-cnt" v-if="post.comment_count">[{{ post.comment_count }}]</span>
                            </div>
                        </div>
                        <div>
                            <div 
                                v-for="(post, index) in popularPosts.slice(5, 10)" 
                                :key="post.id" 
                                class="best-row"
                                @click="router.push(`/community/post/${post.id}`)"
                            >
                                <span class="rank-no">{{ index + 6 }}</span>
                                <span class="best-txt">{{ post.title }}</span>
                                <span class="cmt-cnt" v-if="post.comment_count">[{{ post.comment_count }}]</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="board-head">
                <h2 class="board-ttl">
                    {{ 
                        currentCategory === 'all' ? '전체글' : 
                        currentCategory === 'hot' ? '인기글' : 
                        currentCategory === 'my-posts' ? '내가 쓴 글' :
                        currentCategory === 'liked-posts' ? '내가 좋아요한 글' :
                        currentCategory === 'free' ? '자유 수다' :
                        currentCategory === 'qna' ? '질문/답변' : '정보 공유'
                    }}
                </h2>
                <button class="btn-write" @click="goWrite">
                    <span class="material-icons-round" style="font-size:18px">edit</span> 글쓰기
                </button>
            </div>

            <div class="table-wrapper">
                <table class="custom-table">
                    <colgroup>
                        <col style="width: 60px;"><col style="width: 100px;"><col style="width: auto;"><col style="width: 120px;"><col style="width: 100px;"><col style="width: 70px;">
                    </colgroup>
                    <thead>
                        <tr><th>번호</th><th>분류</th><th style="text-align:left; padding-left:24px;">제목</th><th>글쓴이</th><th>등록일</th><th>조회수</th></tr>
                    </thead>
                    <tbody>
                        <tr v-for="(post, index) in paginatedPosts" :key="post.id">
                            <td>{{ totalPosts - ((currentPage - 1) * itemsPerPage) - index }}</td>
                            <td><span class="cat-badge">{{ post.category_name }}</span></td>
                            <td class="td-title">
                                <div class="post-link" @click="router.push(`/community/post/${post.id}`)">
                                    <span class="post-subj">{{ post.title }}</span>
                                     <span class="new-badge" v-if="post.is_new">N</span>
                                </div>
                            </td>
                            <td>{{ post.author }}</td>
                            <td>{{ post.date }}</td>
                            <td>{{ post.views }}</td>
                        </tr>

                        <tr v-if="paginatedPosts.length === 0">
                            <td colspan="6" style="padding: 40px; color: #999;">등록된 게시글이 없습니다.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="pagination-wrap" v-if="totalPages > 0">
                <button class="page-btn" :class="{ disabled: currentPage === 1 }" @click="changePage(currentPage - 1)">
                    <span class="material-icons-round" style="font-size:16px">chevron_left</span>
                </button>
                
                <button 
                    v-for="page in totalPages" 
                    :key="page" 
                    class="page-btn" 
                    :class="{ active: currentPage === page }"
                    @click="changePage(page)"
                >
                    {{ page }}
                </button>

                <button class="page-btn" :class="{ disabled: currentPage === totalPages }" @click="changePage(currentPage + 1)">
                    <span class="material-icons-round" style="font-size:16px">chevron_right</span>
                </button>
            </div>
        </main>
    </div>
  </div>
</template>

<style scoped>
/* 기존 스타일 그대로 유지 */
.community-page { --bg-base: #FDFCF8; --bg-white: #FFFFFF; --primary-honey: #FFD54F; --primary-deep: #FFC107; --accent-butter: #FFFDE7; --text-title: #4A3F35; --text-body: #5D5D5D; --text-caption: #999999; --line-border: #EAEAEA; --radius-lg: 20px; background-color: var(--bg-base); min-height: 100vh; color: var(--text-title); font-family: 'NanumSquareRound', sans-serif; padding-top: 40px; }
a { text-decoration: none; color: inherit; }
ul { list-style: none; padding: 0; margin: 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.layout-grid { display: flex; gap: 40px; padding-bottom: 100px; }
.main-content { flex: 1; min-width: 0; }
.top-section { display: flex; gap: 24px; margin-bottom: 20px; }
.best-container { flex: 2; background: white; border: 1px solid var(--line-border); border-radius: var(--radius-lg); padding: 24px; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-title { font-size: 18px; font-weight: 800; color: var(--text-title); display: flex; align-items: center; gap: 6px; }
.best-list-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px; }
.best-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; cursor: pointer; font-size: 14px; border-bottom: 1px solid #FAFAFA; }
.best-row:hover .best-txt { text-decoration: underline; color: #F57F17; }
.rank-no { font-weight: 900; font-size: 14px; color: #CCC; width: 18px; }
.rank-no.top { color: var(--primary-deep); } 
.best-txt { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-body); }
.cmt-cnt { color: #FF5252; font-size: 12px; font-weight: 700; }
.board-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.board-ttl { font-size: 22px; font-weight: 900; color: var(--text-title); }
.btn-write { background: var(--primary-honey); color: white; padding: 10px 20px; border-radius: 100px; font-weight: 800; font-size: 14px; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: 0.2s; box-shadow: 0 4px 10px rgba(255, 213, 79, 0.3); }
.btn-write:hover { transform: translateY(-2px); background: var(--primary-deep); }
.custom-table { width: 100%; border-collapse: separate; border-spacing: 0; background: white; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--line-border); margin-bottom: 40px; }
.custom-table th { padding: 16px; font-size: 13px; color: var(--text-caption); font-weight: 700; background: #FAFAFA; border-bottom: 1px solid var(--line-border); text-align: center; }
.custom-table td { padding: 16px; font-size: 14px; color: var(--text-body); border-bottom: 1px solid #f5f5f5; text-align: center; }
.custom-table tr:hover td { background: #FFFDE7; }
.td-title { text-align: left !important; padding-left: 24px !important; }
.post-link { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.post-subj { font-weight: 600; color: var(--text-title); max-width: 360px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.new-badge { font-size: 10px; font-weight: 800; color: var(--primary-deep); background: var(--accent-butter); padding: 2px 6px; border-radius: 4px; }
.cat-badge { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px; background: #F3F4F6; color: #666; display: inline-block; }
.pagination-wrap { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 40px; }
.page-btn { min-width: 40px; height: 40px; border-radius: 12px; border: 1px solid transparent; background: white; color: var(--text-body); font-family: 'NanumSquareRound', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.page-btn:hover { background: var(--accent-butter); color: var(--primary-deep); border-color: var(--primary-honey); }
.page-btn.active { background: var(--primary-honey); color: white; font-weight: 800; box-shadow: 0 4px 10px rgba(255, 213, 79, 0.4); }
.page-btn.disabled { color: #DDD; cursor: default; }
.page-btn.disabled:hover { background: white; border-color: transparent; }

/* ⬇️ 여기서부터 추가된 반응형 스타일 ⬇️ */

/* 표가 화면을 뚫고 나가지 않게 해주는 보호막 */
.table-wrapper { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }

@media (max-width: 1024px) {
    .container { padding: 0 20px; }
    .layout-grid { flex-direction: column; gap: 20px; } /* 사이드바를 위로 올림 */
}

@media (max-width: 768px) {
    .best-list-wrap { grid-template-columns: 1fr; } /* 인기글을 1줄로 */
    .board-ttl { font-size: 18px; }
    .custom-table th, .custom-table td { padding: 12px 8px; font-size: 13px; }
    .post-subj { max-width: 180px; } /* 제목이 너무 길면 잘리게 */
}
</style>