<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router'; 

const router = useRouter();
const userStore = useUserStore();

// UI 상태 관리 (0: 선택, 1: 입력, 2: 상세 프로필, 3: 정보 수정)
const step = ref(0);

// 팔로우 데이터 (추후 API 연동을 위한 더미 데이터)
const followerCount = ref(128);
const followingCount = ref(95);

// ✅ [추가] 모달 상태 관리
const showFollowModal = ref(false);
const followModalType = ref('follower'); // 'follower' 또는 'following'

// ✅ [추가] 모달용 더미 유저 리스트
const followListData = ref([
    { id: 1, nickname: '멍멍이맘', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=100', bio: '포메라니안 초코와 함께해요 🐾' },
    { id: 2, nickname: '집사일기', img: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=100', bio: '댕댕이들과의 일상을 기록합니다.' },
    { id: 3, nickname: '자연인', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', bio: '산책 친구 구함! 쪽지 주세요.' },
    { id: 4, nickname: '초코주인', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=100', bio: '강아지는 사랑입니다 🐶' },
]);

onMounted(() => {
    if (!userStore.user) {
        alert("로그인이 필요한 서비스입니다.");
        router.push('/login');
        return;
    }
    if (userStore.petProfile && Object.keys(userStore.petProfile).length > 0) {
        step.value = 2;
    } else {
        step.value = 0;
    }
});

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

const userForm = ref({
    username: '',
    nickname: '',
    password: ''
});

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

// ✅ [추가] 모달 열기 함수
const openFollowModal = (type) => {
    followModalType.value = type;
    showFollowModal.value = true;
};

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
const goRegistration = () => router.push('/my-page/license'); 

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
                <div class="c-choice-card is-primary" @click="selectYesPet">
                    <div class="c-choice-card__icon">🐶</div>
                    <div class="c-choice-card__text">
                        <h3 class="title">반려동물이 있어요</h3>
                        <p class="sub-text">이미 함께하고 있어요</p>
                    </div>
                </div>

                <div class="c-choice-card is-secondary" @click="selectNoPet">
                    <div class="c-choice-card__icon">🔍</div>
                    <div class="c-choice-card__text">
                        <h3 class="title">아직 없어요</h3>
                        <p class="sub-text">예비 집사로 시작하고 싶어요</p>
                    </div>
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
                    
                    <div class="follow-stats">
                        <div class="stat-link" @click="openFollowModal('follower')">
                            <span class="label">팔로워</span>
                            <span class="value">{{ followerCount }}</span>
                        </div>
                        <div class="v-divider"></div>
                        <div class="stat-link" @click="openFollowModal('following')">
                            <span class="label">팔로잉</span>
                            <span class="value">{{ followingCount }}</span>
                        </div>
                    </div>

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

        <div v-if="showFollowModal" class="c-modal-overlay" @click.self="showFollowModal = false">
            <div class="c-modal-window fadeUp">
                <div class="c-modal-header">
                    <h3 class="title">{{ followModalType === 'follower' ? '팔로워' : '팔로잉' }}</h3>
                    <button class="close-btn" @click="showFollowModal = false">
                        <span class="material-icons-round">close</span>
                    </button>
                </div>
                <div class="c-modal-body">
                    <div v-for="user in followListData" :key="user.id" class="c-user-item">
                        <img :src="user.img" class="c-user-item__avatar">
                        <div class="c-user-item__info">
                            <div class="name">{{ user.nickname }}</div>
                            <div class="bio">{{ user.bio }}</div>
                        </div>
                        <button class="c-user-item__btn">보기</button>
                    </div>
                </div>
            </div>
        </div>

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
.main-name { font-family: 'Jua'; font-size: 32px; color: #3E2723; margin-top: 10px; margin-bottom: 5px; }

/* 카드 및 컨테이너 */
.card { background: white; padding: 24px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #EEE; margin-bottom: 20px; }
.bottom-grid { display: grid; gap: 20px; }

/* 팔로우 통계 */
.follow-stats { display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px; }
.stat-link { cursor: pointer; display: flex; gap: 5px; font-size: 14px; transition: opacity 0.2s; }
.stat-link:hover { opacity: 0.7; }
.stat-link .label { color: #8D6E63; font-weight: 500; }
.stat-link .value { color: #3E2723; font-weight: 800; }
.v-divider { width: 1px; height: 12px; background: #E0E0E0; }

/* 입력 폼 */
.input-wrap { margin-bottom: 16px; text-align: left; }
.input-wrap label { display: block; font-weight: 700; font-size: 14px; color: #5D4037; margin-bottom: 6px; }
.input-wrap input, .input-wrap select { width: 100%; padding: 12px; border: 2px solid #EEE; border-radius: 12px; font-size: 15px; background: #FAFAFA; box-sizing: border-box; }
.input-wrap textarea { width: 100%; padding: 12px; border: 2px solid #EEE; border-radius: 12px; font-size: 15px; background: #FAFAFA; box-sizing: border-box; font-family: inherit; resize: none;}
.row { display: flex; gap: 10px; }
.row .input-wrap { flex: 1; }

/* 버튼 및 아이콘 */
.action-btn { width: 100%; padding: 16px; background: #3E2723; color: white; border: none; border-radius: 16px; font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 10px; }
.back-btn { background: none; border: none; font-weight: 700; color: #888; cursor: pointer; margin-bottom: 10px; }
.back-text-btn { background: none; border: none; font-size: 16px; font-weight: 700; color: #8D6E63; cursor: pointer; }
.settings-btn { background: #FFF !important; border: 2px solid #FFF8E1 !important; color: #8D6E63 !important; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: all 0.3s ease !important; }
.settings-btn:hover { background: #FFF8E1 !important; color: #FFB300 !important; transform: scale(1.05); }
.settings-btn .material-icons-round { font-size: 26px; }

/* 프로필 상세 전용 */
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

/* 리스트 섹션 */
.activity-list { list-style: none; padding: 0; margin: 0; }
.activity-list li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #EEE; font-size: 14px; }
.shorts-row { display: flex; gap: 10px; }
.short-item { width: 70px; height: 70px; border-radius: 12px; background-size: cover; background-position: center; background-color: #EEE; }
.short-item.add { display: flex; align-items: center; justify-content: center; border: 2px dashed #DDD; background: white; color: #DDD; cursor: pointer; font-size: 24px; }
.sub-title { font-size: 16px; font-weight: 800; color: #FFB300; margin-bottom: 15px; border-bottom: 2px solid #FFF8E1; padding-bottom: 5px; text-align: left; }

/* OOCSS: c-choice-card */
.c-choice-card { display: flex; align-items: center; gap: 20px; padding: 24px; border-radius: 24px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; border: 2px solid transparent; text-align: left; }
.c-choice-card:hover { transform: translateY(-5px); }
.c-choice-card__icon { font-size: 32px; background: white; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 18px; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
.c-choice-card__text .title { margin: 0; font-size: 18px; font-weight: 800; color: #3E2723; }
.c-choice-card__text .sub-text { margin: 4px 0 0; font-size: 13px; color: #8D6E63; opacity: 0.8; }
.is-primary { background-color: #FFF9E6; border-color: #FFE082; }
.is-secondary { background-color: #F5F5F5; border-color: #E0E0E0; }

/* ✅ [추가] OOCSS: 모달 레이아웃 & 유저 아이템 */
.c-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.c-modal-window { background: white; width: 100%; max-width: 400px; border-radius: 28px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.2); animation: fadeUp 0.4s ease-out; }
.c-modal-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F5F5F5; }
.c-modal-header .title { font-family: 'Jua'; font-size: 20px; color: #3E2723; margin: 0; }
.c-modal-header .close-btn { background: none; border: none; cursor: pointer; color: #999; }
.c-modal-body { max-height: 400px; overflow-y: auto; padding: 10px 20px; }

.c-user-item { display: flex; align-items: center; gap: 12px; padding: 15px 0; border-bottom: 1px solid #FAFAFA; }
.c-user-item:last-child { border-bottom: none; }
.c-user-item__avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 1px solid #EEE; }
.c-user-item__info { flex: 1; text-align: left; }
.c-user-item__info .name { font-weight: 700; color: #3E2723; font-size: 15px; }
.c-user-item__info .bio { font-size: 12px; color: #8D6E63; margin-top: 2px; }
.c-user-item__btn { background: #FFF8E1; color: #FFB300; border: none; padding: 6px 14px; border-radius: 12px; font-size: 12px; font-weight: 700; cursor: pointer; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>