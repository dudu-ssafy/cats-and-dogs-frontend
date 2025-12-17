<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router'; 

const router = useRouter();
const userStore = useUserStore();

// 데이터 로직
const userProfile = ref({
    petName: '초롱이',
    ownerNickname: userStore.user ? userStore.user.nickname : '초롱맘',
    // ✅ 고화질 얼빡샷 (엑박 방지 링크)
    petImgUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    description: '간식 앞에서는 "앉아"를 기가 막히게 해요.\n산책 친구를 찾고 있어요! 🌿',
    tags: ['#말티즈', '#7살', '#산책러버', '#알러지있음'],
    stats: {
        breed: '말티즈',
        gender: '남아',
        age: '7살',
        weight: '3.2kg'
    }
});

// 숏츠 데이터
const shortsData = ref([
    { title: 'ASMR 뼈다귀 🍖', views: '1.2k', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80' },
    { title: '기다려 훈련 성공!', views: '856', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80' },
    { title: '한강 산책 브이로그', views: '2.1k', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80' },
]);

// 활동 기록 데이터
const activityData = ref([
    { text: `'뭉치네' 글을 좋아해요`, time: '10분 전', icon: 'favorite' },
    { text: `'사료 추천' 댓글 작성`, time: '1일 전', icon: 'chat_bubble' },
    { text: `'산책 코스' 글 작성`, time: '3일 전', icon: 'edit' },
]);

const alertCert = () => alert('인증 완료된 댕댕이입니다!');
</script>

<template>
  <link href="https://fonts.googleapis.com/css2?family=Jua&family=Pretendard:wght@400;600;700&display=swap" rel="stylesheet">
  
  <div class="page-bg">
    <main class="container">
        
        <header class="header">
            <h2 class="page-ttl">마이 페이지</h2>
            <button class="icon-btn setting-btn">
                <span class="material-icons-round">settings</span>
            </button>
        </header>

        <section class="hero-section">
            
            <div class="big-profile-frame">
                <img :src="userProfile.petImgUrl" alt="프로필 사진">
                <div class="verified-badge" @click="alertCert">
                    <span class="material-icons-round">verified</span>
                </div>
            </div>

            <div class="pet-info-center">
                <span class="owner-badge">{{ userProfile.ownerNickname }}님의 가족</span>
                <h1 class="pet-name">{{ userProfile.petName }}</h1>
                <p class="pet-desc">{{ userProfile.description }}</p>

                <div class="tag-row">
                    <span v-for="tag in userProfile.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>

                <div class="stat-bar">
                    <div class="stat-item">
                        <span class="label">견종</span>
                        <span class="val">{{ userProfile.stats.breed }}</span>
                    </div>
                    <div class="divider"></div>
                    <div class="stat-item">
                        <span class="label">나이</span>
                        <span class="val">{{ userProfile.stats.age }}</span>
                    </div>
                    <div class="divider"></div>
                    <div class="stat-item">
                        <span class="label">성별</span>
                        <span class="val">{{ userProfile.stats.gender }}</span>
                    </div>
                    <div class="divider"></div>
                    <div class="stat-item">
                        <span class="label">몸무게</span>
                        <span class="val">{{ userProfile.stats.weight }}</span>
                    </div>
                </div>
            </div>
        </section>

        <div class="bottom-grid">
            
            <div class="card activity-card">
                <h3 class="card-ttl">🐾 최근 활동</h3>
                <ul class="act-list">
                    <li v-for="(act, i) in activityData" :key="i">
                        <span class="act-text">{{ act.text }}</span>
                        <span class="act-time">{{ act.time }}</span>
                    </li>
                </ul>
            </div>

            <div class="card shorts-card">
                <h3 class="card-ttl">🎬 숏츠 모아보기</h3>
                <div class="shorts-row">
                    <div class="short-thumb" v-for="(s, i) in shortsData" :key="i" :style="{ backgroundImage: `url(${s.img})` }"></div>
                    <div class="short-thumb add-btn">
                        <span class="material-icons-round">add</span>
                    </div>
                </div>
            </div>

        </div>

    </main>
  </div>
</template>

<style scoped>
/* =========================================
   Theme: Minimal Warmth (Big Hero)
   ========================================= */
:root {
    --bg-base: #FDFCF8; /* 아주 연한 미색 */
    --surface: #FFFFFF;
    --text-main: #3E2723;
    --text-sub: #8D6E63;
    --accent: #FFB300;
    --shadow-soft: 0 20px 60px rgba(62, 39, 35, 0.08); /* 부드럽고 깊은 그림자 */
    --radius-lg: 40px;
}

/* Base */
.page-bg {
    background-color: var(--bg-base);
    min-height: 100vh;
    font-family: 'Pretendard', sans-serif;
    color: var(--text-main);
    padding: 40px 20px;
    display: flex; justify-content: center;
}

.container { width: 100%; max-width: 600px; /* 모바일~태블릿 핏으로 집중 */ }

/* Header */
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.page-ttl { font-family: 'Jua'; font-size: 24px; margin: 0; color: #CCC; }
.icon-btn { 
    background: transparent; border: none; cursor: pointer; color: #CCC; 
    transition: 0.2s; padding: 8px; border-radius: 50%;
}
.icon-btn:hover { background: #EEE; color: var(--text-main); }


/* =========================================
   HERO SECTION (중심 영역)
   ========================================= */
.hero-section {
    display: flex; flex-direction: column; align-items: center; text-align: center;
    margin-bottom: 60px;
}

/* 1. Big Profile Image */
.big-profile-frame {
    width: 280px; height: 280px; /* 아주 큼 */
    border-radius: 50%; /* 원형 (원하면 40px로 바꿔서 둥근사각형 가능) */
    padding: 8px;
    background: white;
    box-shadow: var(--shadow-soft);
    position: relative;
    margin-bottom: 30px;
}
.big-profile-frame img {
    width: 100%; height: 100%; object-fit: cover;
    border-radius: 50%;
}

.verified-badge {
    position: absolute; bottom: 10px; right: 10px;
    background: white; color: #1976D2;
    width: 48px; height: 48px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    cursor: pointer;
}
.verified-badge span { font-size: 28px; }

/* 2. Info Center */
.pet-info-center { width: 100%; }

.owner-badge {
    display: inline-block; background: #FFF3E0; color: #E65100;
    padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700;
    margin-bottom: 12px;
}

.pet-name {
    font-family: 'Jua', sans-serif; font-size: 48px; margin: 0 0 10px;
    color: var(--text-main); letter-spacing: -1px;
}

.pet-desc {
    font-size: 16px; color: var(--text-sub); line-height: 1.6;
    margin-bottom: 24px; white-space: pre-line;
}

.tag-row { display: flex; justify-content: center; gap: 8px; margin-bottom: 40px; }
.tag {
    background: white; border: 1px solid #EEE; padding: 8px 16px;
    border-radius: 20px; font-size: 14px; color: #666; font-weight: 500;
}

/* Stat Bar (심플한 가로바) */
.stat-bar {
    display: flex; justify-content: space-around; align-items: center;
    background: white; padding: 20px 0; border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}
.stat-item { flex: 1; }
.stat-item .label { display: block; font-size: 12px; color: #AAA; margin-bottom: 4px; }
.stat-item .val { font-size: 18px; font-weight: 700; color: var(--text-main); }
.divider { width: 1px; height: 20px; background: #EEE; }


/* =========================================
   Bottom Grid (보조 영역)
   ========================================= */
.bottom-grid { display: grid; gap: 20px; }

.card {
    background: white; border-radius: 24px; padding: 24px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.03); border: 1px solid #F5F5F5;
}
.card-ttl { font-family: 'Jua'; font-size: 18px; margin: 0 0 16px; color: #5D4037; }

/* Activity List */
.act-list { list-style: none; padding: 0; margin: 0; }
.act-list li {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px dashed #EEE; font-size: 14px;
}
.act-list li:last-child { border-bottom: none; }
.act-text { color: #555; }
.act-time { color: #BBB; font-size: 12px; }

/* Shorts Row */
.shorts-row { display: flex; gap: 10px; }
.short-thumb {
    width: 60px; height: 60px; border-radius: 12px;
    background-size: cover; background-position: center;
    background-color: #F0F0F0; flex-shrink: 0;
}
.short-thumb.add-btn {
    display: flex; align-items: center; justify-content: center;
    border: 2px dashed #DDD; background: white; color: #DDD; cursor: pointer;
}
.short-thumb.add-btn:hover { border-color: var(--accent); color: var(--accent); }
</style>