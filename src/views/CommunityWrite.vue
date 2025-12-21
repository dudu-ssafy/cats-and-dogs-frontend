<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
// ✅ [추가] Tiptap 관련 임포트
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';
import FileHandler from '@tiptap/extension-file-handler'

// 실행 시
const router = useRouter();
const userStore = useUserStore();

// 입력 데이터
const category = ref('qna');
const title = ref('');

// ✅ [추가] Tiptap 에디터 설정
const editor = new Editor({
    content: '',
    extensions: [
        StarterKit,
        Underline,
        // ✅ Image 기능을 포함한 ImageResize 단독 설정 (또는 Image 뒤에 배치)
        Image.configure({
            allowBase64: true,
        }),
        ImageResize, 
        FileHandler.configure({
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
            onDrop: (currentEditor, files, pos) => {
                if (!files.length) return false;
                files.forEach(file => {
                    const fileReader = new FileReader()
                    fileReader.readAsDataURL(file)
                    fileReader.onload = () => {
                        // ✅ pos 위치로 포커스를 옮긴 후 setImage 커맨드 실행
                        // 이렇게 해야 ImageResize 익스텐션이 객체를 인지합니다.
                        currentEditor.chain()
                            .focus()
                            .setTextSelection(pos) 
                            .setImage({ src: fileReader.result })
                            .run()
                    }
                })
                return true;
            },
            onPaste: (currentEditor, files) => {
                if (!files.length) return false;
                files.forEach(file => {
                    const fileReader = new FileReader()
                    fileReader.readAsDataURL(file)
                    fileReader.onload = () => {
                        currentEditor.chain()
                            .focus()
                            .setImage({ src: fileReader.result })
                            .run()
                    }
                })
            },
        }),
    ],
    editorProps: {
        attributes: {
            class: 'tiptap-editor-inner',
        },
        // ✅ 내부 이동 시 복사되는 현상을 방지하기 위한 드롭 핸들링 보완
        handleDrop: (view, event, slice, moved) => {
            if (moved) return false; // Tiptap 내부 이동은 기본 동작에 맡김
        }
    }
});

onBeforeUnmount(() => {
    editor.destroy();
});

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

// 게시글 등록
const submitPost = () => {
    if(!title.value.trim()) {
        alert('제목을 입력해주세요!');
        return;
    }
    
    // 에디터 내용(HTML) 가져오기
    const contentHtml = editor.getHTML();
    const plainText = editor.getText();
    
    // 내용 길이 체크
    if(plainText.trim().length < 5) {
        alert('내용을 조금 더 작성해주세요!');
        return;
    }

    // 기존 게시글 목록 불러오기 (서버 연동 전 임시)
    const existingPosts = JSON.parse(localStorage.getItem('community-posts') || '[]');
    
    // 새 게시글 객체 생성
    const newPost = {
        id: Date.now(),
        category: category.value,
        categoryName: getCategoryName(category.value),
        title: title.value,
        author: userStore.user?.nickname || '익명',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        views: 0,
        isNew: true,
        content: contentHtml,
        isLiked: false
    };

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

// 이미지 처리 (툴바 버튼용)
const addImage = () => {
    const url = window.prompt('이미지 URL을 입력하시거나, 파일을 드래그해서 넣어주세요.');
    if (url) {
        editor.chain().focus().setImage({ src: url }).run();
    }
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
                        
                        <div class="input-skin tiptap-wrapper">
                            <div class="editor-toolbar" v-if="editor">
                                <button type="button" class="tool-btn" 
                                    @click="editor.chain().focus().toggleBold().run()"
                                    :class="{ active: editor.isActive('bold') }"
                                >
                                    <span class="material-icons-round">format_bold</span>
                                </button>
                                <button type="button" class="tool-btn"
                                    @click="editor.chain().focus().toggleItalic().run()"
                                    :class="{ active: editor.isActive('italic') }"
                                >
                                    <span class="material-icons-round">format_italic</span>
                                </button>
                                <button type="button" class="tool-btn"
                                    @click="editor.chain().focus().toggleUnderline().run()"
                                    :class="{ active: editor.isActive('underline') }"
                                >
                                    <span class="material-icons-round">format_underlined</span>
                                </button>
                                <div class="divider"></div>
                                <button type="button" class="tool-btn img-btn" @click="addImage">
                                    <span class="material-icons-round">image</span>
                                </button>
                            </div>

                            <editor-content class="tiptap-content" :editor="editor" />
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

.tiptap-wrapper { display: flex; flex-direction: column; overflow: hidden; min-height: 500px; background: white; }
.tiptap-wrapper:focus-within { border-color: var(--primary-honey); box-shadow: 0 0 0 3px var(--accent-butter); }
.editor-toolbar { background: #FAFAFA; border-bottom: 1px solid var(--line-border); padding: 10px 16px; display: flex; gap: 8px; align-items: center; }
.divider { width: 1px; height: 20px; background: #DDD; margin: 0 8px; }

.tool-btn { border: none; background: transparent; cursor: pointer; color: var(--text-body); padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.tool-btn:hover, .tool-btn.active { background: var(--accent-butter); color: var(--accent-text); }
.tool-btn.img-btn { color: #F57F17; }

:deep(.tiptap-content) { flex: 1; outline: none; background: white; font-size: 16px; color: var(--text-body); overflow-y: auto; line-height: 1.6; }
:deep(.tiptap-editor-inner) { padding: 24px; min-height: 400px; outline: none; }
:deep(.tiptap-editor-inner p) { margin-bottom: 12px; }
:deep(.tiptap-editor-inner img) { max-width: 100%; height: auto; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: none; display: inline-block; }
:deep(.tiptap-editor-inner .ProseMirror-selectednode img) { outline: 3px solid var(--primary-honey); border-radius: 8px; }

/* 리사이즈 핸들 스타일 정의 */
:deep(.resize-trigger) {
    width: 12px !important;
    height: 12px !important;
    background: var(--primary-deep) !important;
    border: 2px solid white !important;
    border-radius: 50% !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
:deep(.tiptap-editor-inner img:hover) { border-color: var(--primary-honey); }

.action-buttons { display: flex; justify-content: flex-end; gap: 12px; margin-top: 40px; border-top: 1px solid var(--line-border); padding-top: 24px; }
.btn-base { padding: 12px 32px; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.2s; border: none; }
.btn-cancel { background: white; border: 1px solid var(--line-border); color: var(--text-body); }
.btn-submit { background: var(--primary-honey); color: white; box-shadow: 0 4px 10px rgba(255, 213, 79, 0.3); }
.btn-submit:hover { background: var(--primary-deep); transform: translateY(-2px); }
</style>