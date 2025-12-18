<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router'; 

const router = useRouter();
const userStore = useUserStore();

// UI 상태 관리 (0: 선택, 1: 입력, 2: 상세 프로필, 3: 정보 수정)
const step = ref(0);

onMounted(() => {
    // 이미 정보가 있으면 바로 상세 프로필(Step 2) 노출
    if (userStore.petProfile) {
        step.value = 2;
    } else {
        step.value = 0;
    }
});

// 입력 및 수정용 폼 데이터
const form = ref({
    petName: '',
    ownerName: userStore.user?.nickname || '',
    birthdate: '',
    gender: '수컷',
    breed: '',
    neutered: '완료',
    contact: '010-',
    address: '',
    description: '',
    weight: '',
    petImgUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80',
});

// 유저 정보 수정을 위한 데이터
const userForm = ref({
    username: '',
    nickname: '',
    password: ''
});

// 기능 함수들
const selectYesPet = () => step.value = 1; 

const selectNoPet = () => {
    if(confirm("아직 반려견이 없으신가요?\n'예비 집사' 프로필로 시작할게요! 🐾")) {
        userStore.registerPet({
            petName: '미래의 댕댕이',
            ownerNickname: userStore.user?.nickname || '예비집사',
            petImgUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&q=80',
            description: '아직 운명의 짝꿍을 찾고 있어요.',
            tags: ['#예비집사'],
            isFutureOwner: true,
            breed: '-', birthdate: '-', gender: '-', weight: '-'
        });
        step.value = 2; 
    }
};

const savePetInfo = () => {
    if(!form.value.petName) return alert("이름을 입력해주세요");
    userStore.registerPet({
        ...form.value,
        ownerNickname: form.value.ownerName || userStore.user?.nickname,
        tags: ['#신규등록', '#반가워요'],
        isFutureOwner: false
    });
    alert("등록이 완료되었습니다! 🎉");
    step.value = 2; 
};

// 정보 수정 모드 열기
const openEditMode = () => {
    if (userStore.petProfile) {
        form.value = { ...userStore.petProfile };
        if (!form.value.ownerName) form.value.ownerName = userStore.petProfile.ownerNickname;
    }
    if (userStore.user) {
        userForm.value = {
            username: userStore.user.username,
            nickname: userStore.user.nickname,
            password: userStore.user.password || ''
        };
    }
    step.value = 3; 
};

// 정보 수정 완료
const updateAllInfo = () => {
    userStore.registerPet({
        ...form.value,
        ownerNickname: userForm.value.nickname,
        isFutureOwner: false
    });
    userStore.updateUser(userForm.value);
    alert("정보가 수정되었습니다! ✨");
    step.value = 2; 
};

const myPet = computed(() => userStore.petProfile);

// 동물등록증 페이지 이동
const goRegistration = () => router.push('/my-page/license'); 

// 더미 데이터
const shortsData = ref([
    { title: '힐링 영상', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' }, 
    { title: '귀여움 주의', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400' }
]);
const activityData = ref([
    { text: `인기글 구경함`, time: '방금 전' }, 
    { text: `커뮤니티 가입`, time: '1일 전' }
]);
</script>

<template>
  <div class="safe-area">
    <div class="page-container">
        
        <section v-if="step === 0" class="content-section center-align">
             <h1 class="page-title">반가워요!<br>어떤 집사님이신가요?</h1>
             <div class="choice-container">
                <div class="choice-card primary" @click="selectYesPet">
                    <span class="emoji">🐶</span>
                    <h3>반려견이 있어요</h3>
                </div>
                <div class="choice-card secondary" @click="selectNoPet">
                    <span class="emoji">🔍</span>
                    <h3>아직 없어요</h3>
                </div>
             </div>
        </section>

        <section v-if="step === 1" class="content-section">
            <button class="back-btn" @click="step = 0">← 뒤로가기</button>
            <h2 class="section-title text-center">📒 댕댕이 건강수첩</h2>
            <div class="card form-card">
                <div class="row">
                    <div class="input-wrap"><label>이름</label><input v-model="form.petName" type="text" placeholder="예: 바둑이"></div>
                    <div class="input-wrap"><label>보호자</label><input v-model="form.ownerName" type="text"></div>
                </div>
                <div class="row">
                    <div class="input-wrap"><label>생년월일</label><input v-model="form.birthdate" type="text" placeholder="예: 2023.01.01"></div>
                    <div class="input-wrap"><label>성별</label><select v-model="form.gender"><option>수컷</option><option>암컷</option></select></div>
                </div>
                <div class="row">
                    <div class="input-wrap"><label>품종</label><input v-model="form.breed" type="text"></div>
                    <div class="input-wrap"><label>중성화</label><select v-model="form.neutered"><option>완료</option><option>미완료</option></select></div>
                </div>
                <div class="row">
                    <div class="input-wrap"><label>연락처</label><input v-model="form.contact" type="text"></div>
                    <div class="input-wrap"><label>몸무게(kg)</label><input v-model="form.weight" type="text"></div>
                </div>
                <div class="input-wrap"><label>주소</label><input v-model="form.address" type="text"></div>
                <div class="input-wrap"><label>한줄 소개</label><textarea v-model="form.description" rows="2"></textarea></div>
                <button class="action-btn" @click="savePetInfo">등록 완료 ✨</button>
            </div>
        </section>

        <div v-if="step === 2" class="content-section">
            <div class="top-bar">
                <h2 class="page-title small">마이 페이지</h2>
                <button class="icon-btn settings-btn" @click="openEditMode">
                    <span class="material-icons-round">settings</span>
                </button>
            </div>

            <div class="card profile-card">
                <div class="img-wrapper">
                    <img :src="myPet.petImgUrl" alt="프로필">
                    <div v-if="myPet && !myPet.isFutureOwner" class="badge-btn" @click="goRegistration">
                        📄 동물등록증
                    </div>
                </div>
                <div class="info-text">
                    <span class="sub-badge">{{ myPet.ownerNickname }}님의 가족</span>
                    <h1 class="main-name">{{ myPet.petName }}</h1>
                    <p class="desc">{{ myPet.description }}</p>
                    <div class="tags">
                        <span v-for="tag in myPet.tags" :key="tag" class="tag-pill">{{ tag }}</span>
                    </div>
                    <div v-if="!myPet.isFutureOwner" class="stats-grid">
                        <div class="stat-item"><small>견종</small><div class="stat-val">{{ myPet.breed }}</div></div>
                        <div class="divider"></div>
                        <div class="stat-item"><small>생일</small><div class="stat-val">{{ myPet.birthdate }}</div></div>
                        <div class="divider"></div>
                        <div class="stat-item"><small>성별</small><div class="stat-val">{{ myPet.gender }}</div></div>
                    </div>
                </div>
            </div>

            <div class="bottom-grid">
                <div class="card">
                    <h3 class="card-title">🐾 최근 활동</h3>
                    <ul class="activity-list">
                        <li v-for="(act, i) in activityData" :key="i">
                            <span class="act-text">{{ act.text }}</span>
                            <span class="act-time">{{ act.time }}</span>
                        </li>
                    </ul>
                </div>
                <div class="card">
                    <h3 class="card-title">🎬 숏츠 모아보기</h3>
                    <div class="shorts-row">
                        <div class="short-item" v-for="(s, i) in shortsData" :key="i" :style="{ backgroundImage: `url(${s.img})` }"></div>
                        <div class="short-item add"><span>+</span></div>
                    </div>
                </div>
            </div>
        </div>

        <section v-if="step === 3" class="content-section">
            <div class="top-bar">
                <button class="back-text-btn" @click="step = 2">← 취소</button>
                <h2 class="section-title" style="margin:0">정보 수정</h2>
                <div style="width:30px"></div>
            </div>

            <div class="card form-card">
                <h3 class="sub-title">👤 내 정보</h3>
                <div class="input-wrap"><label>닉네임</label><input v-model="userForm.nickname" type="text"></div>
                <div class="row">
                    <div class="input-wrap"><label>아이디</label><input v-model="userForm.username" type="text"></div>
                    <div class="input-wrap"><label>비밀번호</label><input v-model="userForm.password" type="password"></div>
                </div>
                
                <h3 class="sub-title" style="margin-top:20px;">🐶 댕댕이 정보</h3>
                <div class="row">
                    <div class="input-wrap"><label>이름</label><input v-model="form.petName" type="text"></div>
                    <div class="input-wrap"><label>보호자</label><input v-model="form.ownerName" type="text"></div>
                </div>
                <div class="row">
                    <div class="input-wrap"><label>생년월일</label><input v-model="form.birthdate" type="text"></div>
                    <div class="input-wrap"><label>성별</label><select v-model="form.gender"><option>수컷</option><option>암컷</option></select></div>
                </div>
                <div class="row">
                    <div class="input-wrap"><label>품종</label><input v-model="form.breed" type="text"></div>
                    <div class="input-wrap"><label>중성화</label><select v-model="form.neutered"><option>완료</option><option>미완료</option></select></div>
                </div>
                <div class="row">
                    <div class="input-wrap"><label>연락처</label><input v-model="form.contact" type="text"></div>
                    <div class="input-wrap"><label>몸무게(kg)</label><input v-model="form.weight" type="text"></div>
                </div>
                <div class="input-wrap"><label>주소</label><input v-model="form.address" type="text"></div>
                <div class="input-wrap"><label>한줄 소개</label><textarea v-model="form.description" rows="2" style="width:100%; padding:12px; border:2px solid #EEE; border-radius:12px; font-size:15px; background:#FAFAFA; box-sizing:border-box; font-family: inherit; resize: none;"></textarea></div>

                <button class="action-btn" @click="updateAllInfo" style="background: #3E2723; color: white;">수정 완료 ✅</button>
            </div>
        </section>

    </div>
  </div>
</template>

<style scoped>
/* 공통 레이아웃 */
.safe-area { width: 100%; min-height: 100vh; background-color: #FDFCF8; padding-top: 80px; padding-bottom: 120px; box-sizing: border-box; font-family: 'Pretendard', sans-serif; }
.page-container { width: 100%; max-width: 600px; margin: 0 auto; padding: 0 20px; }
.content-section { animation: fadeUp 0.5s ease; }
.center-align { text-align: center; }

/* 폰트 및 텍스트 */
.page-title { font-family: 'Jua'; font-size: 28px; color: #3E2723; margin-bottom: 20px; line-height: 1.4; }
.page-title.small { font-size: 24px; text-align: left; margin: 0; }
.section-title { font-family: 'Jua'; font-size: 24px; color: #3E2723; margin-bottom: 20px; }
.card-title { font-family: 'Jua'; font-size: 18px; color: #5D4037; margin-bottom: 15px; }
.main-name { font-family: 'Jua'; font-size: 32px; color: #3E2723; margin: 10px 0; }

/* 카드 및 컨테이너 */
.card { background: white; padding: 24px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #EEE; margin-bottom: 20px; }
.bottom-grid { display: grid; gap: 20px; }

/* 입력 폼 */
.input-wrap { margin-bottom: 16px; text-align: left; }
.input-wrap label { display: block; font-weight: 700; font-size: 14px; color: #5D4037; margin-bottom: 6px; }
.input-wrap input, .input-wrap select { width: 100%; padding: 12px; border: 2px solid #EEE; border-radius: 12px; font-size: 15px; background: #FAFAFA; box-sizing: border-box; }
.row { display: flex; gap: 10px; }
.row .input-wrap { flex: 1; }

/* 버튼 공통 */
.action-btn { width: 100%; padding: 16px; background: #3E2723; color: white; border: none; border-radius: 16px; font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 10px; }
.back-btn { background: none; border: none; font-weight: 700; color: #888; cursor: pointer; margin-bottom: 10px; }
.back-text-btn { background: none; border: none; font-size: 16px; font-weight: 700; color: #8D6E63; cursor: pointer; }

/* ✅ [수정] 톱니바퀴 버튼 디자인 (Skin & Animation 추가) */
.settings-btn {
    background: #FFF !important;
    border: 2px solid #FFF8E1 !important;
    color: #8D6E63 !important;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    transition: all 0.3s ease !important;
}
.settings-btn .material-icons-round {
    font-size: 26px;
    transition: transform 0.4s ease;
}
.settings-btn:hover {
    background: #FFF8E1 !important;
    color: #FFB300 !important;
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(255, 213, 79, 0.2);
}
.settings-btn:hover .material-icons-round {
    transform: rotate(45deg); /* 살짝 회전하는 효과 */
}

/* 프로필 상세 */
.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.icon-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; justify-content: center; }

.img-wrapper { position: relative; width: 120px; height: 120px; margin: 0 auto 20px; }
.img-wrapper img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.badge-btn { position: absolute; bottom: 0; right: -10px; background: white; border: 2px solid #E3F2FD; color: #1976D2; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; z-index: 99; white-space: nowrap; box-shadow: 0 3px 10px rgba(0,0,0,0.1); }
.info-text { text-align: center; }
.sub-badge { background: #FFF3E0; color: #E65100; padding: 4px 10px; border-radius: 10px; font-size: 12px; font-weight: 700; }
.desc { font-size: 15px; color: #6D4C41; margin-bottom: 15px; }
.tags { display: flex; justify-content: center; gap: 6px; margin-bottom: 20px; }
.tag-pill { background: #F5F5F5; color: #666; padding: 4px 10px; border-radius: 10px; font-size: 12px; }
.stats-grid { display: flex; justify-content: space-around; background: #FAFAFA; padding: 15px; border-radius: 12px; margin-top: 15px; }
.stat-val { font-weight: 700; color: #3E2723; font-size: 16px; }
.divider { width: 1px; background: #EEE; }

/* 리스트 및 기타 */
.activity-list { list-style: none; padding: 0; margin: 0; }
.activity-list li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #EEE; font-size: 14px; }
.act-text { color: #555; }
.act-time { color: #BBB; font-size: 12px; }
.shorts-row { display: flex; gap: 10px; }
.short-item { width: 70px; height: 70px; border-radius: 12px; background-size: cover; background-position: center; background-color: #EEE; }
.short-item.add { display: flex; align-items: center; justify-content: center; border: 2px dashed #DDD; background: white; color: #DDD; cursor: pointer; font-size: 24px; }

/* 수정 화면 전용 스타일 */
.sub-title { font-size: 16px; font-weight: 800; color: #FFB300; margin-bottom: 15px; border-bottom: 2px solid #FFF8E1; padding-bottom: 5px; text-align: left; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>