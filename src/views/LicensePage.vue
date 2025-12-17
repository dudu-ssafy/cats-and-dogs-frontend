<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router'; 

const router = useRouter();
const userStore = useUserStore();

// UI 상태 관리 (0: 선택화면, 1: 입력화면, 2: 프로필화면)
const step = ref(0);

// ✅ 페이지 로드 시 실행 (저장된 정보 확인)
onMounted(() => {
    // 저장된 댕댕이 정보가 이미 있으면 -> 바로 프로필(2) 보여줌
    if (userStore.petProfile) {
        step.value = 2;
    } else {
        // 없으면 -> 선택 화면(0) 보여줌
        step.value = 0;
    }
});

// 입력 폼 데이터 (동물등록증 항목 포함)
const form = ref({
    petName: '',
    ownerName: userStore.user?.nickname || '', // 보호자 이름 (기본: 닉네임)
    birthdate: '',
    gender: '수컷',
    breed: '',
    neutered: '완료', // 중성화 여부
    contact: '010-',  // 연락처
    address: '',      // 주소
    description: '',  // 한줄 소개
    weight: '',       // 몸무게
    // 기본 프로필 이미지
    petImgUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
});

// [STEP 0 -> 1] 반려견 있음 선택
const selectYesPet = () => {
    step.value = 1; 
};

// [STEP 0 -> 2] 반려견 없음 (예비 집사) 선택
const selectNoPet = () => {
    if(confirm("아직 반려견이 없으신가요?\n'예비 집사' 프로필로 시작할게요! 🐾")) {
        // 예비 집사용 더미 데이터 저장
        userStore.registerPet({
            petName: '미래의 댕댕이',
            ownerNickname: userStore.user?.nickname || '예비집사',
            petImgUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80',
            description: '아직 운명의 짝꿍을 찾고 있어요.\n랜선 집사로 활동 중입니다! 👀',
            tags: ['#예비집사', '#랜선이모삼촌', '#입양준비중'],
            isFutureOwner: true, // 🚩 예비 집사 표시 (등록증 버튼 숨김용)
            // 빈 데이터 채우기 (에러 방지)
            breed: '-', birthdate: '-', gender: '-', weight: '-'
        });
        step.value = 2; // 바로 프로필로 이동
    }
};

// [STEP 1 -> 2] 정보 저장 및 등록 완료
const savePetInfo = () => {
    // 필수값 체크
    if(!form.value.petName) return alert("이름을 입력해주세요");
    if(!form.value.address) return alert("주소를 입력해주세요 (동물등록증 필수)");

    // 스토어에 저장
    userStore.registerPet({
        ...form.value,
        ownerNickname: form.value.ownerName, // 입력한 보호자명 사용
        tags: ['#신규등록', '#반가워요'],
        isFutureOwner: false
    });

    alert("등록이 완료되었습니다! 🎉");
    step.value = 2; // 프로필 화면으로 전환
};

// 현재 댕댕이 데이터 (스토어에서 가져옴)
const myPet = computed(() => userStore.petProfile);

// ✅ 동물등록증 페이지로 이동
const goRegistration = () => {
    router.push('/my-page/license'); 
};

// 화면용 더미 데이터 (숏츠, 활동내역)
const shortsData = ref([
    { title: '힐링 영상', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80' }, 
    { title: '귀여움 주의', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80' }
]);
const activityData = ref([
    { text: `인기글 구경함`, time: '방금 전' }, 
    { text: `커뮤니티 가입`, time: '1일 전' }
]);
</script>

<template>
  <div class="page-bg">
    <main class="container">
        
        <section v-if="step === 0" class="intro-section">
             <h1 class="intro-title">반가워요!<br>어떤 집사님이신가요?</h1>
             <p class="intro-sub">본인에게 맞는 유형을 선택해주세요.</p>

             <div class="choice-grid">
                <div class="choice-card primary" @click="selectYesPet">
                    <div class="emoji">🐶</div>
                    <h3>반려견이 있어요</h3>
                    <p>정보를 등록하고<br>동물등록증을 발급받아요!</p>
                </div>
                <div class="choice-card secondary" @click="selectNoPet">
                    <div class="emoji">🔍</div>
                    <h3>아직 없어요</h3>
                    <p>귀여운 댕댕이들을 구경하고<br>정보를 얻으러 왔어요.</p>
                </div>
             </div>
        </section>


        <section v-if="step === 1" class="notebook-section">
            <button class="back-text-btn" @click="step = 0">← 다시 선택하기</button>
            <h2 class="notebook-title">📒 댕댕이 건강수첩</h2>
            <p class="notebook-desc">동물등록증 발급에 필요한 정보를 적어주세요.</p>

            <div class="notebook-card">
                <div class="row">
                    <div class="input-group">
                        <label>이름</label>
                        <input v-model="form.petName" type="text" placeholder="예: 바둑이">
                    </div>
                    <div class="input-group">
                        <label>보호자 성함</label>
                        <input v-model="form.ownerName" type="text">
                    </div>
                </div>

                <div class="row">
                    <div class="input-group">
                        <label>생년월일</label>
                        <input v-model="form.birthdate" type="text" placeholder="예: 2023.01.01">
                    </div>
                    <div class="input-group">
                        <label>성별</label>
                        <select v-model="form.gender">
                            <option>수컷</option>
                            <option>암컷</option>
                        </select>
                    </div>
                </div>

                <div class="row">
                    <div class="input-group">
                        <label>품종</label>
                        <input v-model="form.breed" type="text" placeholder="예: 믹스견">
                    </div>
                    <div class="input-group">
                        <label>중성화 여부</label>
                        <select v-model="form.neutered">
                            <option>완료</option>
                            <option>미완료</option>
                            <option>모름</option>
                        </select>
                    </div>
                </div>

                <div class="input-group">
                    <label>연락처</label>
                    <input v-model="form.contact" type="text" placeholder="010-0000-0000">
                </div>

                <div class="input-group">
                    <label>주소</label>
                    <input v-model="form.address" type="text" placeholder="예: 서울시 강남구 역삼동">
                </div>

                <div class="input-group">
                    <label>한줄 소개 (선택)</label>
                    <textarea v-model="form.description" rows="2" placeholder="성격이나 특징을 적어주세요."></textarea>
                </div>

                <button class="save-btn" @click="savePetInfo">
                    등록 완료 ✨
                </button>
            </div>
        </section>


        <div v-if="step === 2" class="profile-wrapper">
            <header class="header">
                <h2 class="page-ttl">마이 페이지</h2>
                <button class="icon-btn setting-btn">
                    <span class="material-icons-round">settings</span>
                </button>
            </header>

            <section class="hero-section">
                <div class="big-profile-frame">
                    <img :src="myPet.petImgUrl" alt="프로필 사진">
                    
                    <div v-if="!myPet.isFutureOwner" class="verified-badge" @click="goRegistration">
                        <span class="material-icons-round">verified</span>
                        <span class="badge-text">동물등록증</span>
                    </div>
                </div>

                <div class="pet-info-center">
                    <span class="owner-badge">{{ myPet.ownerNickname }}님의 가족</span>
                    <h1 class="pet-name">{{ myPet.petName }}</h1>
                    <p class="pet-desc">{{ myPet.description }}</p>

                    <div class="tag-row">
                        <span v-for="tag in myPet.tags" :key="tag" class="tag">{{ tag }}</span>
                    </div>

                    <div v-if="!myPet.isFutureOwner" class="stat-bar">
                        <div class="stat-item">
                            <span class="label">견종</span>
                            <span class="val">{{ myPet.breed }}</span>
                        </div>
                        <div class="divider"></div>
                        <div class="stat-item">
                            <span class="label">생일</span>
                            <span class="val">{{ myPet.birthdate }}</span>
                        </div>
                        <div class="divider"></div>
                        <div class="stat-item">
                            <span class="label">성별</span>
                            <span class="val">{{ myPet.gender }}</span>
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
                        <div class="short-thumb add-btn"><span class="material-icons-round">add</span></div>
                    </div>
                </div>
            </div>
        </div>

    </main>
  </div>
</template>

<style scoped>
/* 공통 */
:root { --text-main: #3E2723; --accent: #FFB300; }
.page-bg { background-color: #FDFCF8; min-height: 100vh; padding: 40px 20px; display: flex; justify-content: center; font-family: 'Pretendard', sans-serif; }
.container { width: 100%; max-width: 600px; }

/* -------------------------------------------
   ✨ [STEP 0] 인트로 선택 화면 스타일
   ------------------------------------------- */
.intro-section { padding-top: 40px; animation: fadeIn 0.6s ease; text-align: center; }
.intro-title { font-family: 'Jua'; font-size: 32px; line-height: 1.3; color: var(--text-main); margin-bottom: 10px; }
.intro-sub { color: #8D6E63; margin-bottom: 40px; }

.choice-grid { display: flex; flex-direction: column; gap: 20px; }

.choice-card {
    background: white; border-radius: 24px; padding: 30px 20px;
    cursor: pointer; transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 2px solid transparent;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.choice-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.choice-card:active { transform: scale(0.98); }

/* 반려견 있음 (Primary) */
.choice-card.primary { background: #FFF8E1; border-color: #FFECB3; }
.choice-card.primary:hover { border-color: var(--accent); }
/* 반려견 없음 (Secondary) */
.choice-card.secondary { background: #F5F5F5; border-color: #E0E0E0; }
.choice-card.secondary:hover { border-color: #BDBDBD; }

.emoji { font-size: 48px; margin-bottom: 16px; display: block; }
.choice-card h3 { margin: 0 0 8px; font-size: 20px; font-weight: 800; color: var(--text-main); }
.choice-card p { margin: 0; font-size: 14px; color: #6D4C41; line-height: 1.5; }


/* -------------------------------------------
   ✨ [STEP 1] 아기수첩 입력 폼
   ------------------------------------------- */
.notebook-section { text-align: center; animation: slideUp 0.4s ease; }
.back-text-btn { background:none; border:none; color:#AAA; font-size:14px; cursor:pointer; margin-bottom:10px; font-weight:700;}
.notebook-title { font-family: 'Jua'; font-size: 28px; margin-bottom: 10px; color: var(--text-main); }
.notebook-desc { color: #8D6E63; margin-bottom: 30px; font-size: 15px; }

.notebook-card {
    background: white; padding: 30px; border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 2px dashed #E0E0E0;
    text-align: left;
}

.input-group { margin-bottom: 20px; }
.input-group label { display: block; font-weight: 700; color: #6D4C41; margin-bottom: 8px; font-size: 14px; }
.input-group input, .input-group select, .input-group textarea {
    width: 100%; padding: 12px; border-radius: 12px;
    border: 1px solid #DDD; background: #FAFAFA; font-size: 15px; box-sizing: border-box;
    font-family: 'Pretendard'; transition: 0.2s;
}
.input-group input:focus, .input-group select:focus, .input-group textarea:focus { border-color: var(--accent); outline: none; background: #FFF; }
.row { display: flex; gap: 12px; }
.row .input-group { flex: 1; }
.save-btn {
    width: 100%; padding: 16px; margin-top: 10px;
    background: var(--text-main); color: white; border: none;
    border-radius: 16px; font-size: 18px; font-weight: 700;
    cursor: pointer; transition: 0.2s;
}
.save-btn:hover { background: var(--accent); transform: translateY(-2px); }


/* -------------------------------------------
   ✨ [STEP 2] 프로필 스타일 (기존 유지)
   ------------------------------------------- */
.profile-wrapper { animation: fadeIn 0.8s ease; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.page-ttl { font-family: 'Jua'; font-size: 24px; margin: 0; color: #CCC; }
.icon-btn { background: transparent; border: none; cursor: pointer; color: #CCC; padding: 8px; }

.hero-section { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 60px; }
.big-profile-frame { width: 250px; height: 250px; border-radius: 50%; padding: 8px; background: white; box-shadow: 0 20px 60px rgba(0,0,0,0.08); position: relative; margin-bottom: 30px; }
.big-profile-frame img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

.verified-badge {
    position: absolute; bottom: 0; right: 0; transform: translate(10%, 10%);
    background: white; color: #1976D2; display: flex; align-items: center; gap: 4px; 
    padding: 8px 14px; border-radius: 30px; box-shadow: 0 4px 15px rgba(25, 118, 210, 0.15); 
    cursor: pointer; border: 2px solid #E3F2FD; transition: all 0.2s;
}
.verified-badge:hover { transform: translate(10%, 10%) scale(1.05); background: #F1F8E9; }
.verified-badge span { font-size: 20px; }
.badge-text { font-size: 13px; font-weight: 700; color: #1565C0; padding-top: 2px; }

.pet-info-center { width: 100%; }
.owner-badge { display: inline-block; background: #FFF3E0; color: #E65100; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; margin-bottom: 12px; }
.pet-name { font-family: 'Jua'; font-size: 40px; margin: 0 0 10px; color: var(--text-main); }
.pet-desc { font-size: 16px; color: #8D6E63; line-height: 1.6; margin-bottom: 24px; white-space: pre-line; }
.tag-row { display: flex; justify-content: center; gap: 8px; margin-bottom: 40px; }
.tag { background: white; border: 1px solid #EEE; padding: 8px 16px; border-radius: 20px; font-size: 14px; color: #666; font-weight: 500; }
.stat-bar { display: flex; justify-content: space-around; background: white; padding: 20px 0; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
.stat-item { flex: 1; }
.stat-item .label { font-size: 12px; color: #AAA; }
.stat-item .val { font-size: 18px; font-weight: 700; color: var(--text-main); }
.divider { width: 1px; background: #EEE; }

.bottom-grid { display: grid; gap: 20px; }
.card { background: white; border-radius: 24px; padding: 24px; box-shadow: 0 5px 20px rgba(0,0,0,0.03); border: 1px solid #F5F5F5; }
.card-ttl { font-family: 'Jua'; font-size: 18px; margin-bottom: 16px; color: #5D4037; }
.act-list li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #EEE; font-size: 14px; }
.act-text { color: #555; } .act-time { color: #BBB; font-size: 12px; }
.shorts-row { display: flex; gap: 10px; }
.short-thumb { width: 60px; height: 60px; border-radius: 12px; background-size: cover; background-color: #F0F0F0; }
.add-btn { display: flex; align-items: center; justify-content: center; border: 2px dashed #DDD; background: white; cursor: pointer; color: #DDD; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>