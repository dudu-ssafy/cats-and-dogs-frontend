<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 더미 데이터 (실제로는 Pinia나 API에서 가져옴)
const userProfile = ref({
    petName: '초롱초롱한 초롱이',
    ownerNickname: userStore.user ? userStore.user.nickname : '초롱이맘',
    petImgUrl: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?q=80&w=400&auto=format&fit=crop',
    description: '"간식 앞에서는 앉아를 아주 잘해요! 산책 친구 구해요 🐶"',
    tags: '#말티즈 #7살 #산책러버 #알러지있음',
    stats: {
        breed: '말티즈',
        gender: '남아',
        age: '7살',
        weight: '3.2kg'
    },
    healthScore: 92,
    churuPoints: 1250,
    nextLevelPoints: 50
});

const shortsData = ref([
    { title: '개껌 먹방 ASMR 🍖', views: '1.2천회', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop' },
    { title: '기다려 훈련 중!', views: '856회', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400&auto=format&fit=crop' },
    { title: '산책 나가서 신남', views: '2.1천회', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=400&auto=format&fit=crop' },
]);

const activityData = ref([
    { text: `'뭉치네 강아지' 게시글을 좋아합니다.`, time: '10분 전', icon: 'favorite' },
    { text: `'사료 추천해주세요' 글에 댓글을 남겼어요.`, time: '1일 전', icon: 'chat_bubble' },
    { text: `커뮤니티에 '오늘 산책 코스' 글을 썼어요.`, time: '3일 전', icon: 'article' },
]);

const alertCert = () => {
    alert('인증 완료된 댕댕이입니다!');
};

const goToShop = () => {
    alert('상점 페이지로 이동합니다.');
    // router.push('/shop'); // 실제 라우터 이동
};
</script>

<template>
  <main class="container main-content">
        
        <h1 class="font-title page-title">마이 페이지</h1>

        <section class="profile-section">
            <div class="profile-left">
                <img :src="userProfile.petImgUrl" class="profile-img" alt="메인 펫 이미지">
                <br>
                <button class="btn btn-edit-pf">
                    <span class="material-icons-round" style="font-size:16px">settings</span> 프로필 설정
                </button>
            </div>
            
            <div class="profile-right">
                <div class="user-meta">
                    <h2 class="user-name">{{ userProfile.petName }}</h2>
                    <div class="badge-cert" @click="alertCert">
                        <span class="material-icons-round" style="font-size:16px">verified</span> 동물등록증
                    </div>
                </div>
                <p class="desc-text">
                    {{ userProfile.description }}<br>
                    {{ userProfile.tags }}
                </p>

                <div class="stat-grid">
                    <div class="stat-card">
                        <span class="material-icons-round stat-icon">pets</span>
                        <span class="stat-label">품종</span>
                        <span class="stat-value">{{ userProfile.stats.breed }}</span>
                    </div>
                    <div class="stat-card">
                        <span class="material-icons-round stat-icon">female</span>
                        <span class="stat-label">성별</span>
                        <span class="stat-value">{{ userProfile.stats.gender }}</span>
                    </div>
                    <div class="stat-card">
                        <span class="material-icons-round stat-icon">cake</span>
                        <span class="stat-label">나이</span>
                        <span class="stat-value">{{ userProfile.stats.age }}</span>
                    </div>
                    <div class="stat-card">
                        <span class="material-icons-round stat-icon">monitor_weight</span>
                        <span class="stat-label">몸무게</span>
                        <span class="stat-value">{{ userProfile.stats.weight }}</span>
                    </div>
                </div>
            </div>
        </section>

        <div class="dashboard-grid">
            
            <div class="card">
                <div class="card-title font-title">
                    <span>🏥 AI 건강 진단 리포트</span>
                    <span class="card-more">전체 기록 ></span>
                </div>
                
                <div class="health-summary">
                    <div class="health-score">
                        <span>{{ userProfile.healthScore }}</span>
                        <small>점</small>
                    </div>
                    <div class="health-text">
                        <h4>피부 상태가 아주 좋아요!</h4>
                        <p>지난주보다 눈물 자국이 옅어졌어요.<br>지금처럼 관리해주세요.</p>
                    </div>
                    <button class="btn btn-checkup">상세보기</button>
                </div>

                <div style="margin-top: 30px;">
                    <div class="card-title font-title" style="font-size: 20px;">
                        <span>🐾 내 활동 내역 ({{ userProfile.ownerNickname }}님)</span>
                    </div>
                    <ul class="activity-list">
                        <li v-for="(activity, index) in activityData" :key="index">
                            <div>
                                <span class="material-icons-round act-icon">{{ activity.icon }}</span>
                                <span class="act-text">{{ activity.text }}</span>
                            </div>
                            <span class="act-date">{{ activity.time }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="card" style="background: var(--color-primary-light);">
                <div class="card-title font-title">
                    <span>🪙 내 츄르 (포인트)</span>
                </div>
                <div style="text-align: center; padding: 20px 0;">
                    <span style="font-size: 40px; font-weight: 800; color: var(--color-primary);">{{ userProfile.churuPoints.toLocaleString() }}</span>
                    <span style="font-size: 18px; font-weight: 700; color: var(--text-gray);">개</span>
                    <p style="color: var(--text-gray); margin-top: 10px; font-size: 14px;">다음 레벨까지 츄르 {{ userProfile.nextLevelPoints }}개 남았어요!</p>
                </div>
                <button class="btn" @click="goToShop" style="width: 100%; padding: 12px; border-radius: 12px; background: var(--color-primary); color: #fff; font-weight: 700;">
                    상점 가기
                </button>
            </div>

        </div>

        <section class="card">
            <div class="card-title font-title">
                <span>🎬 우리 아이 숏츠 (Shorts)</span>
                <span class="card-more">모두 보기 ></span>
            </div>
            
            <div class="shorts-container">
                <div class="shorts-card" v-for="(shorts, index) in shortsData" :key="index">
                    <img :src="shorts.img" :alt="shorts.title">
                    <div class="shorts-info">
                        <span class="shorts-title">{{ shorts.title }}</span>
                        <div class="shorts-views">
                            <span class="material-icons-round" style="font-size:12px">play_arrow</span> {{ shorts.views }}
                        </div>
                    </div>
                </div>

                <div class="shorts-card shorts-add">
                    <span class="material-icons-round" style="font-size: 40px; margin-bottom: 8px;">add_circle_outline</span>
                    <span class="font-title">영상 업로드</span>
                </div>
            </div>
        </section>

    </main>
</template>

<style scoped>
/* ========================================
 1. Theme Variables & Base (Vue Template Variables)
 ========================================
*/
/* Vue 컴포넌트 내부에서만 사용할 CSS 변수 정의 */
:root {
    --color-primary: #FFB300;       /* 꿀 색상 */
    --color-primary-light: #FFF8E1; /* 연한 배경 */
    --color-secondary: #FF8A65;     /* 포인트 코랄 */
    --color-bg: #FFFDF5;            /* 크림 배경 */
    --text-dark: #3E2723;
    --text-gray: #8D6E63;
    --radius-lg: 32px;
    --radius-md: 20px;
    --shadow-card: 0 10px 30px rgba(255, 179, 0, 0.12);
    --shadow-hover: 0 15px 35px rgba(255, 179, 0, 0.2);
}

/* 폰트 정의 (전역 CSS에서 상속받는 것을 가정) */
.font-title { font-family: 'Jua', cursive; }
.btn { cursor: pointer; border: none; font-family: 'Jua', cursive; transition: 0.3s; }

.container { max-width: 1024px; margin: 0 auto; padding: 0 24px; }
.main-content { padding: 40px 0 100px; }
.page-title { margin-bottom: 24px; color: var(--text-dark); }

/* ========================================
 2. Modules (OOCSS style)
 ========================================
*/

/* Profile Section */
.profile-section {
    background: var(--color-white); border-radius: var(--radius-lg);
    padding: 40px; box-shadow: var(--shadow-card);
    position: relative; overflow: hidden;
    display: flex; gap: 40px; align-items: flex-start;
    margin-bottom: 40px;
    z-index: 10; /* 배경 패턴 위에 뜨도록 */
}

/* 배경 장식 */
.profile-section::before {
    content: ''; position: absolute; top: -50px; right: -50px;
    width: 200px; height: 200px; background: var(--color-primary-light);
    border-radius: 50%; z-index: 0; opacity: 0.6;
}

.profile-left { flex-shrink: 0; position: relative; z-index: 1; text-align: center; }
.profile-img {
    width: 160px; height: 160px; border-radius: 50%; object-fit: cover;
    border: 6px solid var(--color-primary-light);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    margin-bottom: 16px;
}
.btn-edit-pf {
    background: var(--text-dark); color: #fff; padding: 8px 16px;
    border-radius: 20px; font-size: 13px; display: inline-flex; align-items: center; gap: 4px;
}
.btn-edit-pf:hover { background: var(--color-primary); }

.profile-right { flex: 1; z-index: 1; }
.user-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.user-name { font-size: 32px; margin: 0; color: var(--text-dark); }
.badge-cert {
    background: #E3F2FD; color: #1976D2; padding: 6px 12px; border-radius: 20px;
    font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 4px; cursor: pointer;
}
.badge-cert:hover { background: #BBDEFB; }

.desc-text { color: var(--text-gray); font-size: 15px; margin-bottom: 24px; line-height: 1.6; }

/* Stat Grid (Bento Box Style) */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card {
    background: var(--color-bg); border-radius: var(--radius-md); padding: 16px;
    text-align: center; border: 2px solid transparent; transition: 0.3s;
}
.stat-card:hover { border-color: var(--color-primary); background: #fff; transform: translateY(-4px); }
.stat-icon { font-size: 24px; color: var(--color-primary); margin-bottom: 4px; display: block; }
.stat-label { font-size: 12px; color: var(--text-gray); font-weight: 700; margin-bottom: 4px; display: block; }
.stat-value { font-size: 18px; color: var(--text-dark); font-weight: 700; }

/* Dashboard Grid (New Feature) */
.dashboard-grid {
    display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 40px;
}

/* 공통 카드 스타일 */
.card {
    background: #fff; border-radius: var(--radius-lg); padding: 30px;
    box-shadow: var(--shadow-card);
}
.card-title { font-size: 22px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
.card-more { font-size: 14px; color: var(--text-gray); cursor: pointer; }

/* AI Report Section */
.health-summary {
    display: flex; gap: 20px; align-items: center;
    background: #E8F5E9; border-radius: 20px; padding: 20px;
    margin-top: 10px;
}
.health-score {
    width: 80px; height: 80px; background: #4CAF50; color: #fff;
    border-radius: 50%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; font-weight: 700;
    box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
}
.health-score span { font-size: 24px; font-family: 'Jua', cursive; }
.health-score small { font-size: 12px; font-weight: 400; }
.health-text h4 { margin: 0 0 6px 0; font-size: 18px; }
.health-text p { margin: 0; font-size: 14px; color: #555; }
.btn-checkup {
    margin-left: auto; background: #fff; color: #2E7D32;
    padding: 10px 20px; border-radius: 20px; font-weight: 700; font-size: 14px;
}

/* My Activity List */
.activity-list li {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0; border-bottom: 1px dashed #eee;
}
.activity-list li:last-child { border-bottom: none; }
.act-icon { margin-right: 10px; vertical-align: middle; color: var(--color-primary); }
.act-text { font-size: 15px; color: var(--text-dark); }
.act-date { font-size: 12px; color: #bbb; }


/* Shorts Grid */
.shorts-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 20px; }
.shorts-card {
    aspect-ratio: 9/16; border-radius: 20px; overflow: hidden; position: relative;
    cursor: pointer; box-shadow: var(--shadow-card); transition: 0.3s;
}
.shorts-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-hover); }
.shorts-card img { width: 100%; height: 100%; object-fit: cover; }

.shorts-info {
    position: absolute; bottom: 0; left: 0; width: 100%;
    padding: 20px 10px 10px;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    color: #fff;
}
.shorts-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; display: block; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
.shorts-views { font-size: 11px; opacity: 0.8; display: flex; align-items: center; gap: 4px; }

.shorts-add {
    background: #fff; border: 3px dashed #E0E0E0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: var(--text-gray); transition: 0.3s;
}
.shorts-add:hover { border-color: var(--color-primary); color: var(--color-primary); background: #FFFDE7; }


/* Mobile Responsive */
@media (max-width: 768px) {
    .profile-section { flex-direction: column; align-items: center; text-align: center; padding: 30px 20px; }
    .profile-left { margin-bottom: 20px; }
    .user-meta { justify-content: center; }
    .dashboard-grid { grid-template-columns: 1fr; }
    .health-summary { flex-direction: column; text-align: center; }
    .btn-checkup { margin: 10px auto 0; }
}
</style>