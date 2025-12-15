<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
// 🔥 [추가] Pinia userStore 임포트
import { useUserStore } from '@/stores/user'; 

const router = useRouter();
const userStore = useUserStore(); // userStore 인스턴스 생성

const posts = ref([]);
const currentCategory = ref('all');

const goWrite = () => {
    // 로그인이 안 되어있으면 로그인 페이지로 이동
    if (!userStore.isLogin) {
        alert('글쓰기는 로그인 후 이용 가능합니다.');
        router.push('/login');
        return;
    }
    router.push('/community/write');
};

// ... (초기 데이터 및 computed, setCategory, handleLogout 함수는 기존과 동일) ...
const initialData = [
    { id: 4215, category: 'qna', categoryName: '질문', title: '저희 강아지가 갑자기 산책을 거부하는데 왜 그럴까요? ㅠㅠ', author: '초보집사', date: '14:20', views: 89, isNew: true },
    { id: 4214, category: 'info', categoryName: '정보', title: '겨울철 강아지 발바닥 관리 꿀팁 정리해봤어요', author: '멍멍박사', date: '13:50', views: 245, isNew: false },
    { id: 4213, category: 'free', categoryName: '자유', title: '오늘 날씨 너무 좋아서 한강 다녀왔어요! (사진)', author: '산책왕', date: '12:10', views: 112, isNew: false },
    { id: 4212, category: 'info', categoryName: '정보', title: '서울 XX동물병원 스케일링 비용 정보 공유해요', author: '건강이최고', date: '11:45', views: 330, isNew: false },
    { id: 4210, category: 'free', categoryName: '자유', title: '냥줍했어요... 이름 추천 받습니다 (치즈냥)', author: '냥냥펀치', date: '10:55', views: 890, isNew: false },
];

onMounted(() => {
    const saved = localStorage.getItem('community-posts');
    if (saved) {
        posts.value = JSON.parse(saved);
    } else {
        localStorage.setItem('community-posts', JSON.stringify(initialData));
        posts.value = initialData;
    }
});

const filteredPosts = computed(() => {
    if (currentCategory.value === 'all') {
        return posts.value;
    } else if (currentCategory.value === 'hot') {
        return posts.value.filter(p => p.views >= 100).sort((a,b) => b.views - a.views);
    } else {
        return posts.value.filter(p => p.category === currentCategory.value);
    }
});

const setCategory = (cat) => {
    currentCategory.value = cat;
};

const handleLogout = () => {
    userStore.logout();
    router.push('/');
}
</script>

<template>
  <div class="community-page">
    <div class="container layout-grid">
        
        <aside class="sidebar">
            <div class="login-card">
                <template v-if="userStore.isLogin && userStore.user">
                    <div 
                        class="profile-thumb" 
                        :style="{ backgroundImage: `url(${userStore.user.profileImg})` }"
                        @click="router.push('/my-profile')"
                    ></div>
                    <p class="login-msg welcome-text">
                        <span style="font-size: 20px;">👋</span> 반가워요!<br>
                        <span style="color:#F57F17; font-weight:800">{{ userStore.user.nickname }}</span>님 🐾
                    </p>
                    
                    <div class="user-activities">
                        <router-link to="/my-profile?tab=posts" class="activity-link">
                            <span class="material-icons-round">article</span> 내가 쓴 글
                        </router-link>
                        <router-link to="/my-profile?tab=comments" class="activity-link">
                            <span class="material-icons-round">chat_bubble_outline</span> 내가 쓴 댓글
                        </router-link>
                    </div>

                </template>
                <template v-else>
                    <div style="font-size:32px; margin-bottom:8px;">👋</div>
                    <p class="login-msg">로그인하고<br>집사들과 소통해보세요!</p>
                    <button class="btn-login" @click="router.push('/login')">로그인 / 회원가입</button>
                </template>
            </div>

            <div class="menu-group">
                <div class="menu-head">
                    <span v-if="userStore.isLogin && userStore.user">
                        {{ userStore.user.nickname }}님의 게시판
                    </span>
                    <span v-else>
                        게시판
                    </span>
                </div>
                <ul class="menu-list">
                    <li :class="{ active: currentCategory === 'all' }" @click="setCategory('all')">
                        <span class="material-icons-round menu-icon">format_list_bulleted</span> 전체글
                    </li>
                    <li :class="{ active: currentCategory === 'hot' }" @click="setCategory('hot')">
                        <span class="material-icons-round menu-icon">local_fire_department</span> 인기글 <span class="hot-badge">HOT</span>
                    </li>
                    <li :class="{ active: currentCategory === 'free' }" @click="setCategory('free')">
                        <span class="material-icons-round menu-icon">chat_bubble_outline</span> 자유 수다
                    </li>
                    <li :class="{ active: currentCategory === 'qna' }" @click="setCategory('qna')">
                        <span class="material-icons-round menu-icon">help_outline</span> 질문/답변
                    </li>
                    <li :class="{ active: currentCategory === 'info' }" @click="setCategory('info')">
                        <span class="material-icons-round menu-icon">tips_and_updates</span> 정보 공유
                    </li>
                    </ul>
            </div>
        </aside>

        <main class="main-content">
            <div class="top-section">
                <div class="best-container">
                    <div class="section-head">
                        <span class="section-title">
                            <span class="material-icons-round" style="color:var(--primary-honey)">emoji_events</span>
                            실시간 인기글
                        </span>
                    </div>
                    <div class="best-list-wrap">
                        <div>
                            <div class="best-row"><span class="rank-no top">1</span><span class="best-txt">강아지가 밥을 안 먹을 때 꿀팁 (경험담)</span><span class="cmt-cnt">[12]</span></div>
                            <div class="best-row"><span class="rank-no top">2</span><span class="best-txt">고양이 젤리 색깔 바뀌는 거 정상인가요?</span><span class="cmt-cnt">[8]</span></div>
                            <div class="best-row"><span class="rank-no top">3</span><span class="best-txt">산책하다가 진드기 물렸어요 ㅠㅠ 대처법</span><span class="cmt-cnt">[24]</span></div>
                            <div class="best-row"><span class="rank-no">4</span><span class="best-txt">우리 댕댕이 미용 망했어요... (사진주의)</span><span class="cmt-cnt">[31]</span></div>
                            <div class="best-row"><span class="rank-no">5</span><span class="best-txt">대전 24시 동물병원 괜찮은 곳 추천좀요</span><span class="cmt-cnt">[5]</span></div>
                        </div>
                        <div>
                            <div class="best-row"><span class="rank-no">6</span><span class="best-txt">자동 급식기 vs 그냥 밥그릇 뭐 쓰세요?</span><span class="cmt-cnt">[15]</span></div>
                            <div class="best-row"><span class="rank-no">7</span><span class="best-txt">초보 집사가 꼭 알아야 할 예방접종 리스트</span><span class="cmt-cnt">[42]</span></div>
                            <div class="best-row"><span class="rank-no">8</span><span class="best-txt">펫보험 가입하신 분들 만족하시나요?</span><span class="cmt-cnt">[9]</span></div>
                            <div class="best-row"><span class="rank-no">9</span><span class="best-txt">강아지 슬개골 탈구 수술 비용 공유해요</span><span class="cmt-cnt">[11]</span></div>
                            <div class="best-row"><span class="rank-no">10</span><span class="best-txt">고양이 모래 전체갈이 주기 언제가 좋나요</span><span class="cmt-cnt">[6]</span></div>
                        </div>
                    </div>
                </div>
                <div class="notice-container">
                    <div class="section-head"><span class="section-title" style="font-size:16px">공지사항</span></div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <div class="notice-row"><span class="material-icons-round notice-icon">campaign</span><span>커뮤니티 이용 수칙 안내 (필독)</span></div>
                        <div class="notice-row"><span class="material-icons-round notice-icon">campaign</span><span>12월 펫페어 무료 티켓 이벤트!</span></div>
                    </div>
                </div>
            </div>

            <div class="board-head">
                <h2 class="board-ttl">
                    {{ 
                        currentCategory === 'all' ? '전체글' : 
                        currentCategory === 'hot' ? '인기글' : 
                        currentCategory === 'free' ? '자유 수다' :
                        currentCategory === 'qna' ? '질문/답변' : '정보 공유'
                    }}
                </h2>
                <button class="btn-write" @click="goWrite">
                    <span class="material-icons-round" style="font-size:18px">edit</span> 글쓰기
                </button>
            </div>

            <table class="custom-table">
                <colgroup>
                    <col style="width: 60px;"><col style="width: 100px;"><col style="width: auto;"><col style="width: 120px;"><col style="width: 100px;"><col style="width: 70px;">
                </colgroup>
                <thead>
                    <tr><th>번호</th><th>분류</th><th style="text-align:left; padding-left:24px;">제목</th><th>글쓴이</th><th>등록일</th><th>조회</th></tr>
                </thead>
                <tbody>
                    <tr style="background-color:#FAFAFA;">
                        <td><span class="material-icons-round" style="font-size:16px; color:#FF5252">push_pin</span></td>
                        <td><span class="cat-badge">공지</span></td>
                        <td class="td-title"><div class="post-link"><span class="post-subj" style="font-weight:800">🐶 커뮤니티 클린 캠페인 안내</span></div></td>
                        <td>운영자</td><td>10:00</td><td>521</td>
                    </tr>
                    
                    <tr v-for="post in filteredPosts" :key="post.id">
                        <td>{{ post.id }}</td>
                        <td><span class="cat-badge">{{ post.categoryName }}</span></td>
                        <td class="td-title">
                            <div class="post-link" @click="router.push(`/community/post/${post.id}`)">
                                <span class="post-subj">{{ post.title }}</span>
                                <span class="new-badge" v-if="post.isNew">N</span>
                            </div>
                        </td>
                        <td>{{ post.author }}</td>
                        <td>{{ post.date }}</td>
                        <td>{{ post.views }}</td>
                    </tr>

                    <tr v-if="filteredPosts.length === 0">
                        <td colspan="6" style="padding: 40px; color: #999;">등록된 게시글이 없습니다.</td>
                    </tr>
                </tbody>
            </table>

            <div class="pagination-wrap">
                <button class="page-btn disabled"><span class="material-icons-round" style="font-size:16px">chevron_left</span></button>
                <button class="page-btn active">1</button>
                <button class="page-btn">2</button>
                <button class="page-btn">3</button>
                <button class="page-btn"><span class="material-icons-round" style="font-size:16px">chevron_right</span></button>
            </div>
        </main>
    </div>
  </div>
</template>

<style scoped>
/* 🔥 [수정/제거] 로그인 상태일 때 프로필 카드 스타일 */
.profile-thumb { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; background-color: #EEE; border: 3px solid #FFD54F; margin: 0 auto 12px; background-size: cover; background-position: center; cursor: pointer; }
.welcome-text { margin-bottom: 20px !important; } /* 인사말 아래 간격 확보 */
.btn-login { display: block; width: 100%; padding: 12px; background: var(--primary-honey); color: white; font-weight: 800; border-radius: 12px; cursor: pointer; border: none; transition: 0.2s; }
.btn-login:hover { background: var(--primary-deep); }
/* '글쓰기 바로가기', '로그아웃' 버튼 관련 CSS 제거 */
.btn-write-card, .btn-logout { display: none; } 

/* 🔥 [추가] 활동 내역 섹션 스타일링 */
.user-activities {
    border-top: 1px dashed var(--line-border); /* 연한 선 */
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
}
.activity-link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--text-body);
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 6px;
    transition: 0.2s;
}
.activity-link:hover {
    background: #FFFDE7;
    color: var(--primary-deep);
}
.activity-link .material-icons-round {
    font-size: 18px;
    color: #FFB300; /* 츄르 색상으로 강조 */
}


/* 기존 스타일 유지 */
.community-page { --bg-base: #FDFCF8; --bg-white: #FFFFFF; --primary-honey: #FFD54F; --primary-deep: #FFC107; --accent-butter: #FFFDE7; --text-title: #4A3F35; --text-body: #5D5D5D; --text-caption: #999999; --line-border: #EAEAEA; --radius-lg: 20px; background-color: var(--bg-base); min-height: 100vh; color: var(--text-title); font-family: 'NanumSquareRound', sans-serif; padding-top: 40px; }
a { text-decoration: none; color: inherit; }
ul { list-style: none; padding: 0; margin: 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.layout-grid { display: flex; gap: 40px; padding-bottom: 100px; }
.sidebar { width: 220px; flex-shrink: 0; }
.login-card { background: white; padding: 24px 20px; border: 1px solid var(--line-border); border-radius: var(--radius-lg); text-align: center; margin-bottom: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.login-msg { font-size: 14px; color: var(--text-body); margin-bottom: 16px; font-weight: 700; }
.menu-group { margin-bottom: 32px; }
.menu-head { font-size: 13px; font-weight: 800; color: #CCC; margin-bottom: 12px; padding-left: 12px; }
.menu-list li { padding: 12px 16px; font-size: 15px; font-weight: 700; color: var(--text-body); border-radius: 12px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
.menu-list li:hover { background: var(--accent-butter); color: #F57F17; }
.menu-list li.active { background: var(--accent-butter); color: #F57F17; font-weight: 800; }
.hot-badge { background: #FF5252; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; }
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
.notice-container { flex: 1; background: white; border: 1px solid var(--line-border); border-radius: var(--radius-lg); padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.notice-row { display: flex; gap: 8px; padding: 10px 0; border-bottom: 1px solid #FAFAFA; font-size: 13px; cursor: pointer; line-height: 1.4; color: var(--text-body); }
.notice-icon { color: var(--primary-honey); font-size: 16px; flex-shrink: 0; }
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
.img-icon { font-size: 14px; color: #CCC; }
.new-badge { font-size: 10px; font-weight: 800; color: var(--primary-deep); background: var(--accent-butter); padding: 2px 6px; border-radius: 4px; }
.cat-badge { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px; background: #F3F4F6; color: #666; display: inline-block; }
.pagination-wrap { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 40px; }
.page-btn { min-width: 40px; height: 40px; border-radius: 12px; border: 1px solid transparent; background: white; color: var(--text-body); font-family: 'NanumSquareRound', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.page-btn:hover { background: var(--accent-butter); color: var(--primary-deep); border-color: var(--primary-honey); }
.page-btn.active { background: var(--primary-honey); color: white; font-weight: 800; box-shadow: 0 4px 10px rgba(255, 213, 79, 0.4); }
.page-btn.disabled { color: #DDD; cursor: default; }
.page-btn.disabled:hover { background: white; border-color: transparent; }
</style>