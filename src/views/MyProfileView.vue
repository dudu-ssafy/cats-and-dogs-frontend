<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router'
import api from '@/api';

const router = useRouter();
const userStore = useUserStore();

// UI 상태 관리 (0: 선택, 1: 입력, 2: 상세 프로필, 3: 정보 수정)
const step = ref(0);

// 사진 업로드를 위한 ref
const fileInputRef = ref(null);

// 반려동물 커뮤니티 컨셉에 맞춘 숏츠 데이터
const likedShorts = ref([]);

// 숏츠 스크롤 제어 로직
const shortsScrollRef = ref(null);
const itemStep = 155; 

const scrollNext = () => {
    if (shortsScrollRef.value) {
        shortsScrollRef.value.scrollBy({ left: itemStep, behavior: 'smooth' });
    }
};

const scrollPrev = () => {
    if (shortsScrollRef.value) {
        shortsScrollRef.value.scrollBy({ left: -itemStep, behavior: 'smooth' });
    }
};

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
    fetchLikedShorts();
});

const fetchLikedShorts = async () => {
    try {
        const response = await api.get('shorts/find_like_shorts/');
        likedShorts.value = response.data;
        console.log(likedShorts.value);
    } catch (error) {
        console.error('Failed to fetch liked shorts:', error);
    }
};

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
    petImgUrl: userStore.user.profileImg,
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

const triggerFileUpload = () => {
    fileInputRef.value.click();
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        // 프리뷰를 위해 로컬에서 먼저 읽기
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewUrl = e.target.result;
            form.value.petImgUrl = previewUrl;
            // 전역 유저 프로필 이미지도 업데이트하여 즉시 반영
            userStore.updateUser({ profileImg: previewUrl });
            const newImgUrl = e.target.result;
            form.value.petImgUrl = newImgUrl;
            userStore.registerPet({
                ...userStore.petProfile,
                petImgUrl: newImgUrl
            });
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('image', file);
        api.post('/users/profile_image_upload/', formData)
        .then(response => {
            console.log('Upload started:', response.data);
            // 업로드가 완료되면 백엔드 Task에서 유저 프로필을 업데이트하므로, 
            // 나중에 다시 조회하거나 알림을 줄 수 있습니다.
        })
        .catch(error => {
            console.error('Upload failed:', error.response.data);
            alert('이미지 업로드 중 오류가 발생했습니다.');
        });
    }
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
                <div class="input-wrap"><label>한줄 소개</label><textarea v-model="form.description" rows="2" class="u-textarea"></textarea></div>
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
                    <img :src="userStore.user.profileImg" alt="프로필">
                    <input type="file" ref="fileInputRef" style="display: none" accept="image/*" @change="handleFileChange">
                    <button class="c-camera-btn" @click="triggerFileUpload">
                        <span class="material-icons-round">photo_camera</span>
                    </button>

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

            <div class="card shorts-card">
                <div class="c-shorts-header">
                    <h3 class="title">🐾 좋아요한 숏츠</h3>
                </div>
                
                <div class="c-shorts-wrapper">
                    <button class="c-nav-arrow is-left" @click="scrollPrev">
                        <span class="material-icons-round">chevron_left</span>
                    </button>

                    <div class="c-shorts-container is-snapped" ref="shortsScrollRef">
                        <div class="c-shorts-list">
                            <div v-for="shorts in likedShorts" :key="shorts.id" class="c-shorts-item">
                                <div class="c-shorts-item__screen" :style="{ backgroundImage: `url(${shorts.thumbnail_url})` }">
                                    <div class="play-overlay">
                                        <span class="material-icons-round">play_arrow</span>
                                    </div>
                                </div>
                                <div class="c-shorts-item__info">
                                    <div class="title">{{ shorts.title }}</div>
                                    <div class="meta">조회수 {{ shorts.views }}</div>
                                </div>
                                <button class="more-btn">
                                    <span class="material-icons-round">more_vert</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <button class="c-nav-arrow is-right" @click="scrollNext">
                        <span class="material-icons-round">chevron_right</span>
                    </button>
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
                <div class="input-wrap"><label>한줄 소개</label><textarea v-model="form.description" rows="2" class="u-textarea"></textarea></div>
                
                <button class="action-btn" @click="updateAllInfo" style="background: #3E2723; color: white;">수정 완료 ✅</button>
            </div>
        </section>
    </div>
  </div>
</template>

<style scoped>
/* --- 공통 레이아웃 --- */
.safe-area { width: 100%; min-height: 100vh; background-color: #FDFCF8; padding-top: 80px; padding-bottom: 120px; box-sizing: border-box; font-family: 'Pretendard', sans-serif; }
.page-container { width: 100%; max-width: 600px; margin: 0 auto; padding: 0 20px; }
.content-section { animation: fadeUp 0.5s ease; }
.center-align { text-align: center; }

/* --- 폰트 및 텍스트 --- */
.page-title { font-family: 'Jua'; font-size: 28px; color: #3E2723; margin-bottom: 20px; line-height: 1.4; }
.page-title.small { font-size: 24px; text-align: left; margin: 0; }
.section-title { font-family: 'Jua'; font-size: 24px; color: #3E2723; margin-bottom: 20px; }
.main-name { font-family: 'Jua'; font-size: 32px; color: #3E2723; margin-top: 10px; margin-bottom: 5px; }

/* --- 카드 공통 오브젝트 --- */
.card { background: white; padding: 24px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #EEE; margin-bottom: 20px; }

/* --- 폼 스타일 --- */
.input-wrap { margin-bottom: 16px; text-align: left; }
.input-wrap label { display: block; font-weight: 700; font-size: 14px; color: #5D4037; margin-bottom: 6px; }
.input-wrap input, .input-wrap select { width: 100%; padding: 12px; border: 2px solid #EEE; border-radius: 12px; font-size: 15px; background: #FAFAFA; box-sizing: border-box; }
.u-textarea { width: 100%; padding: 12px; border: 2px solid #EEE; border-radius: 12px; font-size: 15px; background: #FAFAFA; box-sizing: border-box; font-family: inherit; resize: none; }
.row { display: flex; gap: 10px; }
.row .input-wrap { flex: 1; }

/* --- 버튼 인터랙션 --- */
.action-btn { width: 100%; padding: 16px; background: #3E2723; color: white; border: none; border-radius: 16px; font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 10px; }
.back-btn { background: none; border: none; font-weight: 700; color: #888; cursor: pointer; margin-bottom: 10px; }
.back-text-btn { background: none; border: none; font-size: 16px; font-weight: 700; color: #8D6E63; cursor: pointer; }
.settings-btn { background: #FFF !important; border: 2px solid #FFF8E1 !important; color: #8D6E63 !important; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: all 0.3s ease !important; }

/* --- 상세 프로필 컴포넌트 --- */
.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }

.img-wrapper { position: relative; width: 120px; height: 120px; margin: 0 auto 20px; }
.img-wrapper img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.c-camera-btn { 
    position: absolute; bottom: 5px; right: 5px; 
    width: 34px; height: 34px; border-radius: 50%; 
    background: #3E2723; color: white; 
    border: 3px solid white; display: flex; 
    align-items: center; justify-content: center; 
    cursor: pointer; z-index: 10;
    transition: transform 0.2s;
}
.c-camera-btn:hover { transform: scale(1.1); }
.c-camera-btn .material-icons-round { font-size: 18px; }

.badge-btn { position: absolute; top: 0; right: -20px; background: white; border: 2px solid #E3F2FD; color: #1976D2; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; z-index: 9; box-shadow: 0 3px 10px rgba(0,0,0,0.1); }
.info-text { text-align: center; }
.sub-badge { background: #FFF3E0; color: #E65100; padding: 4px 10px; border-radius: 10px; font-size: 12px; font-weight: 700; }
.desc { font-size: 15px; color: #6D4C41; margin-bottom: 15px; }
.tags { display: flex; justify-content: center; gap: 6px; margin-bottom: 20px; }
.tag-pill { background: #F5F5F5; color: #666; padding: 4px 10px; border-radius: 10px; font-size: 12px; }
.stats-grid { display: flex; justify-content: space-around; background: #FAFAFA; padding: 15px; border-radius: 12px; margin-top: 15px; }
.stat-val { font-weight: 700; color: #3E2723; font-size: 16px; }
.divider { width: 1px; background: #EEE; }
.sub-title { font-family: 'Jua'; font-size: 18px; color: #FFB300; margin-bottom: 15px; border-bottom: 2px solid #FFF8E1; padding-bottom: 5px; text-align: left; }

/* --- 숏츠 섹션 스타일 --- */
.c-shorts-header { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #FFF8E1; }
.c-shorts-header .title { font-family: 'Jua'; font-size: 20px; color: #5D4037; display: flex; align-items: center; gap: 8px; }

.c-shorts-wrapper { position: relative; width: 100%; }
.c-shorts-container { width: 100%; overflow-x: auto; display: flex; padding-bottom: 8px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
.c-shorts-container::-webkit-scrollbar { display: none; }
.c-shorts-list { display: flex; gap: 10px; padding: 0 5px; }
.is-snapped { scroll-snap-type: x mandatory; }

.c-nav-arrow { position: absolute; top: 40%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 50%; background: white; border: 2px solid #FFF8E1; box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; transition: all 0.3s ease; }
.c-nav-arrow:hover { background: #FFF8E1; transform: translateY(-50%) scale(1.1); color: #FFB300; }
.c-nav-arrow .material-icons-round { font-size: 28px; }
.is-left { left: -15px; }
.is-right { right: -15px; }

.c-shorts-item { flex: 0 0 145px; position: relative; text-align: left; scroll-snap-align: start; }
.c-shorts-item__screen { width: 100%; aspect-ratio: 9 / 16; border-radius: 12px; background-size: cover; background-position: center; background-color: #F0F0F0; position: relative; overflow: hidden; margin-bottom: 8px; }
.play-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
.c-shorts-item:hover .play-overlay { opacity: 1; }
.play-overlay .material-icons-round { color: white; font-size: 36px; }
.c-shorts-item__info { padding-right: 18px; }
.c-shorts-item__info .title { font-size: 13px; font-weight: 700; color: #0F0F0F; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 2px; }
.c-shorts-item__info .meta { font-size: 12px; color: #606060; }
.more-btn { position: absolute; bottom: 32px; right: -4px; background: none; border: none; color: #0F0F0F; padding: 4px; cursor: pointer; }

/* --- 기타 공통 스타일 --- */
.c-choice-card { display: flex; align-items: center; gap: 20px; padding: 24px; border-radius: 24px; cursor: pointer; transition: all 0.3s ease; border: 2px solid transparent; text-align: left; }
.is-primary { background-color: #FFF9E6; border-color: #FFE082; }
.is-secondary { background-color: #F5F5F5; border-color: #E0E0E0; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>