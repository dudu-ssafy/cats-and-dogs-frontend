<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
// ✅ [추가] API 관련 임포트
import { boardApi } from '@/api/board';
import BoardSideBar from '@/components/BoardSideBar.vue';

// ✅ [추가] Tiptap 관련 임포트
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';
import FileHandler from '@tiptap/extension-file-handler'

const router = useRouter();
const userStore = useUserStore();

// 입력 데이터
const category = ref('qna');
const title = ref('');
const isLoading = ref(false);

// ✅ [추가] Tiptap 에디터 설정
const editor = new Editor({
    content: '',
    extensions: [
        StarterKit,
        Underline,
        // ✅ Image 기능을 포함한 ImageResize 단독 설정
        Image.configure({
            allowBase64: true,
        }),
        ImageResize, 
        FileHandler.configure({
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
            onDrop: (currentEditor, files, pos) => {
                if (!files || files.length === 0) return false;
                files.forEach(file => {
                    const fileReader = new FileReader()
                    fileReader.readAsDataURL(file)
                    fileReader.onload = () => {
                        currentEditor.chain()
                            .focus()
                            .setTextSelection(pos) 
                            .setImage({ src: fileReader.result })
                            .run()
                    }
                });
                return true;
            },
            onPaste: (currentEditor, files) => {
                if (!files || files.length === 0) return false;
                files.forEach(file => {
                    const fileReader = new FileReader()
                    fileReader.readAsDataURL(file)
                    fileReader.onload = () => {
                        currentEditor.chain()
                            .focus()
                            .setImage({ src: fileReader.result })
                            .run()
                    }
                });
                return true;
            },
        }),
    ],
    editorProps: {
        attributes: {
            class: 'tiptap-editor-inner',
        },
        // ✅ 내부 이동 시 복사 방지
        handleDrop: (view, event, slice, moved) => {
            if (moved) return false;
            return false;
        }
    }
});

onBeforeUnmount(() => {
    editor.destroy();
});

// ✅ 사이드바 메뉴 클릭 시 이동
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
const submitPost = async () => {
    if (!userStore.isLogin) {
        alert('로그인이 필요한 서비스입니다.');
        router.push('/login');
        return;
    }

    if(!title.value.trim()) {
        alert('제목을 입력해주세요!');
        return;
    }
    
    const contentHtml = editor.getHTML();
    const plainText = editor.getText();
    
    if(plainText.trim().length < 5) {
        alert('내용을 조금 더 작성해주세요!');
        return;
    }

    isLoading.value = true;
    try {
        const postData = {
            category: category.value,
            title: title.value,
            content: contentHtml,
        };

        await boardApi.createPost(postData);
        alert('게시글이 성공적으로 등록되었습니다! 🐾');
        router.push('/community'); 
    } catch (error) {
        console.error('게시글 등록 실패:', error);
        alert('게시글 등록 중 오류가 발생했습니다.');
    } finally {
        isLoading.value = false;
    }
};

// 이미지 추가 (툴바용)
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
        
        <BoardSideBar @category-change="goCategory" />

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
                        
                        <div class="input-skin tiptap-wrapper" :class="{ 'loading-overlay': isLoading }">
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
                        <button type="button" class="btn-base btn-cancel" @click="goBack" :disabled="isLoading">취소</button>
                        <button type="submit" class="btn-base btn-submit" :disabled="isLoading">
                            {{ isLoading ? '등록 중...' : '등록하기' }}
                        </button>
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
a { text-decoration: none; color: inherit; }
ul { list-style: none; padding: 0; margin: 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.layout-grid { display: flex; gap: 40px; padding-bottom: 100px; }
.main-content { flex: 1; min-width: 0; }

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