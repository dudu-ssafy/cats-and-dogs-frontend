<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// ✅ [수정] 유저 스토어 임포트 추가
import { useUserStore } from '@/stores/user';

const router = useRouter();
// ✅ [수정] 유저 스토어 사용 설정
const userStore = useUserStore();

// 입력 데이터
const category = ref('qna');
const title = ref('');
const editorRef = ref(null); // 에디터 DOM 접근용

// ✅ [추가] 사이드바 메뉴 클릭 시 목록 페이지로 이동하며 쿼리 전달
const goCategory = (cat) => {
    router.push({ path: '/community', query: { category: cat } });
};

// 뒤로 가기
const goBack = () => {
    if(confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
        router.go(-1);
    }
};

// 텍스트 스타일 적용
const applyStyle = (command) => {
    document.execCommand(command, false, null);
    if (editorRef.value) editorRef.value.focus();
};

// 게시글 등록
const submitPost = () => {
    if(!title.value.trim()) {
        alert('제목을 입력해주세요!');
        return;
    }
    
    // 에디터 내용(HTML) 가져오기
    const contentHtml = editorRef.value.innerHTML;
    
    // 내용 길이 체크
    if(editorRef.value.innerText.trim().length < 5) {
        alert('내용을 조금 더 작성해주세요!');
        return;
    }

    // 기존 게시글 목록 불러오기
    const existingPosts = JSON.parse(localStorage.getItem('community-posts') || '[]');
    
    // 새 게시글 객체 생성
    const newPost = {
        id: Date.now(),
        category: category.value,
        categoryName: getCategoryName(category.value),
        title: title.value,
        // ✅ [수정] 작성자 이름도 실제 유저 닉네임으로 저장되도록 변경
        author: userStore.user?.nickname || '익명',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        views: 0,
        isNew: true,
        content: contentHtml,
        isLiked: false // 기본 좋아요 상태
    };

    // 저장 및 이동
    existingPosts.unshift(newPost);
    localStorage.setItem('community-posts', JSON.stringify(existingPosts));

    alert('게시글이 등록되었습니다!');
    router.push('/community'); 
};

// 카테고리 이름 변환 헬퍼
const getCategoryName = (code) => {
    const map = { free: '자유', qna: '질문', info: '정보' };
    return map[code] || '기타';
};

// 이미지 버튼 (기능 없음)
const handleImageClick = () => {
    alert('이미지 첨부 기능은 추후 구현 예정입니다.');
};
</script>

<template>
  <div class="write-page">
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
                        <div class="activity-link" @click="goCategory('my-posts')">
                            <span class="material-icons-round">article</span> 내가 쓴 글
                        </div>
                        <div class="activity-link" @click="goCategory('liked-posts')">
                            <span class="material-icons-round">favorite_border</span> 내가 좋아요한 글
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div style="font-size:32px; margin-bottom:8px;">👋</div>
                    <p class="login-msg">로그인하고<br>집사들과 소통해보세요!</p>
                    <button class="btn-login-sidebar" @click="router.push('/login')">로그인 / 회원가입</button>
                </template>
            </div>

            <div class="menu-group">
                <div class="menu-head">게시판</div>
                <ul class="menu-list">
                    <li @click="goCategory('all')"><span class="material-icons-round menu-icon">format_list_bulleted</span> 전체글</li>
                    <li @click="goCategory('hot')"><span class="material-icons-round menu-icon">local_fire_department</span> 인기글</li>
                    <li @click="goCategory('free')"><span class="material-icons-round menu-icon">chat_bubble_outline</span> 자유 수다</li>
                    <li @click="goCategory('qna')"><span class="material-icons-round menu-icon">help_outline</span> 질문/답변</li>
                    <li @click="goCategory('info')"><span class="material-icons-round menu-icon">tips_and_updates</span> 정보 공유</li>
                </ul>
            </div>
        </aside>

        <main class="main-content">
            <div class="write-card">
                <div class="write-header">
                    <h2 class="page-title">
                        <span class="material-icons-round" style="color:var(--primary-honey)">edit</span> 게시글 작성
                    </h2>
                </div>

                <form @submit.prevent="submitPost">
                    <div class="form-group">
                        <label class="form-label">게시판 선택</label>
                        <select class="input-skin" v-model="category">
                            <option value="free">자유 수다</option>
                            <option value="qna">질문/답변</option>
                            <option value="info">정보 공유</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">제목</label>
                        <input type="text" class="input-skin" placeholder="제목을 입력해주세요" v-model="title">
                    </div>

                    <div class="form-group">
                        <label class="form-label">내용</label>
                        
                        <div class="input-skin editor-wrapper">
                            <div class="editor-toolbar">
                                <button type="button" class="tool-btn" @click="applyStyle('bold')" title="굵게">
                                    <span class="material-icons-round">format_bold</span>
                                </button>
                                <button type="button" class="tool-btn" @click="applyStyle('italic')" title="기울임">
                                    <span class="material-icons-round">format_italic</span>
                                </button>
                                <button type="button" class="tool-btn" @click="applyStyle('underline')" title="밑줄">
                                    <span class="material-icons-round">format_underlined</span>
                                </button>
                                <div class="divider"></div>
                                <button type="button" class="tool-btn img-btn" @click="handleImageClick" title="이미지 추가">
                                    <span class="material-icons-round">image</span>
                                </button>
                            </div>

                            <div 
                                class="editor-content" 
                                contenteditable="true" 
                                ref="editorRef"
                            >
                                <p>궁금한 점이나 공유하고 싶은 이야기를 자유롭게 적어주세요!</p>
                                <br>
                                <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" style="max-width:100%; border-radius:8px;">
                            </div>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button type="button" class="btn-base btn-cancel" @click="goBack">취소</button>
                        <button type="submit" class="btn-base btn-submit">등록하기</button>
                    </div>
                </form>

            </div>
        </main>
    </div>
  </div>
</template>

<style scoped>
/* 디자인 토큰 */
.write-page {
    --bg-base: #FDFCF8; --bg-white: #FFFFFF;
    --primary-honey: #FFD54F; --primary-deep: #FFC107;
    --accent-butter: #FFFDE7; --accent-text: #F57F17;
    --text-title: #4A3F35; --text-body: #5D5D5D; --text-light: #999999;
    --line-border: #EAEAEA; --radius-lg: 20px; --radius-md: 12px;
    --shadow-card: 0 4px 12px rgba(0,0,0,0.03);

    background-color: var(--bg-base); min-height: 100vh;
    color: var(--text-title); font-family: 'NanumSquareRound', sans-serif; padding-top: 40px;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.layout-grid { display: flex; gap: 40px; padding-bottom: 100px; }
.sidebar { width: 220px; flex-shrink: 0; }
.main-content { flex: 1; min-width: 0; }

/* 사이드바 스타일 (View와 통일) */
.login-card { background: white; padding: 24px 20px; border: 1px solid var(--line-border); border-radius: var(--radius-lg); text-align: center; margin-bottom: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.profile-thumb { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; background-color: #EEE; border: 3px solid #FFD54F; margin: 0 auto 12px; background-size: cover; background-position: center; cursor: pointer; }
.welcome-text { font-size: 14px; color: var(--text-body); margin-bottom: 20px; line-height: 1.5; font-weight: 700; }
.user-activities { border-top: 1px dashed var(--line-border); padding-top: 16px; display: flex; flex-direction: column; gap: 8px; text-align: left; }
.activity-link { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text-body); font-weight: 600; padding: 4px 8px; border-radius: 6px; transition: 0.2s; cursor: pointer; }
.activity-link:hover { background: #FFFDE7; color: var(--primary-deep); }
.activity-link .material-icons-round { font-size: 18px; color: #FFB300; }
.btn-login-sidebar { display: block; width: 100%; padding: 12px; background: var(--primary-honey); color: white; font-weight: 800; border-radius: 12px; cursor: pointer; border: none; transition: 0.2s; }

.menu-head { font-size: 12px; font-weight: 700; color: #C4C4C4; margin-bottom: 12px; padding-left: 12px; }
.menu-list { list-style: none; padding: 0; margin: 0; }
.menu-list li { padding: 12px 16px; font-size: 15px; font-weight: 700; color: var(--text-body); border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.2s; margin-bottom: 4px; }
.menu-list li:hover { background: var(--accent-butter); color: #F57F17; }

/* 글쓰기 폼 스타일 */
.write-card { background: white; border-radius: var(--radius-lg); border: 1px solid var(--line-border); box-shadow: var(--shadow-card); padding: 40px; }
.write-header { margin-bottom: 32px; border-bottom: 1px solid var(--line-border); padding-bottom: 20px; }
.page-title { font-size: 24px; font-weight: 800; color: var(--text-title); display: flex; align-items: center; gap: 8px; }

.form-group { margin-bottom: 24px; }
.form-label { display: block; font-size: 14px; font-weight: 700; color: var(--text-title); margin-bottom: 8px; }

.input-skin { width: 100%; border: 1px solid var(--line-border); border-radius: var(--radius-md); background: #FAFAFA; transition: all 0.2s ease; font-family: inherit; }
.input-skin:focus, .input-skin:focus-within { background: white; border-color: var(--primary-honey); box-shadow: 0 0 0 3px var(--accent-butter); outline: none; }
input.input-skin, select.input-skin { padding: 14px 16px; font-size: 15px; outline: none; }

.editor-wrapper { display: flex; flex-direction: column; overflow: hidden; min-height: 500px; }
.editor-toolbar { background: #F5F5F5; border-bottom: 1px solid var(--line-border); padding: 10px 16px; display: flex; gap: 8px; align-items: center; }
.divider { width: 1px; height: 20px; background: #DDD; margin: 0 8px; }

.tool-btn { border: none; background: transparent; cursor: pointer; color: var(--text-body); padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.tool-btn:hover { background: rgba(0,0,0,0.05); color: var(--text-title); }
.tool-btn.img-btn { color: #F57F17; }

.editor-content { flex: 1; padding: 24px; outline: none; background: white; font-size: 16px; color: var(--text-body); overflow-y: auto; line-height: 1.6; }
.action-buttons { display: flex; justify-content: flex-end; gap: 12px; margin-top: 40px; border-top: 1px solid var(--line-border); padding-top: 24px; }
.btn-base { padding: 12px 32px; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.2s; border: none; }
.btn-cancel { background: white; border: 1px solid var(--line-border); color: var(--text-body); }
.btn-submit { background: var(--primary-honey); color: white; box-shadow: 0 4px 10px rgba(255, 213, 79, 0.3); }
.btn-submit:hover { background: var(--primary-deep); transform: translateY(-2px); }
</style>