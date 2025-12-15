<script setup>
import { ref, onMounted } from 'vue';

// --- 1. OX 퀴즈 로직 ---
const currentQuizIdx = ref(0);

const quizzes = ref([
  { id: 1, q: '강아지는 세상을 흑백으로만 본다?', a: 'X', desc: '적록색맹과 비슷해요! 파란색과 노란색은 구분할 수 있어요.', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop', flipped: false },
  { id: 2, q: '다 큰 고양이는 사람에게만 "야옹" 한다?', a: 'O', desc: '고양이끼리는 눈빛과 냄새로 대화해요. 집사에게만 목소리를 내는 거랍니다!', img: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=600&auto=format&fit=crop', flipped: false },
  { id: 3, q: '강아지 코 지문으로 신원 확인이 가능하다?', a: 'O', desc: '사람의 지문처럼 강아지 "비문"도 모두 달라서 등록이 가능해요!', img: 'https://images.unsplash.com/photo-1554692992-e422ae42550e?q=80&w=600&auto=format&fit=crop', flipped: false },
]);

// 카드 뒤집기
const flipCard = (index) => {
  quizzes.value[index].flipped = !quizzes.value[index].flipped;
};

// 퀴즈 넘기기 (화살표)
const changeQuiz = (direction) => {
  quizzes.value[currentQuizIdx.value].flipped = false; // 넘길 때 앞면으로 리셋

  let nextIdx = currentQuizIdx.value + direction;
  if (nextIdx >= quizzes.value.length) nextIdx = 0;
  if (nextIdx < 0) nextIdx = quizzes.value.length - 1;
  
  currentQuizIdx.value = nextIdx;
};

// --- 2. 스크롤 등장 효과 (Reveal) ---
onMounted(() => {
  // 에러 원인이었던 window.addEventListener('scroll', handleScroll) 삭제함

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
</script>

<template>
  <section class="hero-wrap">
    <div class="overlay"></div>
    <div class="hero-content">
      <h1 class="main-copy">
        우리집 막내 건강,<br>
        이제 걱정 마세요!
      </h1>
      <p class="sub-copy">
        사진 한 장으로 시작하는 AI 주치의 프로젝트
      </p>
    </div>
    <div class="scroll-down">
      <div class="mouse-icon"><div class="mouse-wheel"></div></div>
      <span>SCROLL</span>
    </div>
  </section>

  <div class="content-layer">
    <div class="container">
      
      <section class="ai-section reveal">
        <div class="ai-text">
          <h2>어디가 아픈가요?</h2>
          <p>
            반려동물이 평소랑 다른 행동을 하나요?<br>
            궁금한 증상을 말해주시면 AI가 3초 만에 분석해드려요.<br>
            이제 병원 가기 전에 먼저 확인해보세요!
          </p>
          <div class="modern-search">
            <input type="text" placeholder="예: 강아지 눈꼽이 많이 껴요">
            <button class="search-icon-btn">
              <span class="material-icons-round">pets</span>
            </button>
          </div>
        </div>
        <div class="ai-visual">
          <div class="scan-effect"></div>
          <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop" class="ai-img" alt="AI 진단 강아지">
        </div>
      </section>

      <h2 class="section-title reveal">집사들의 와글와글 수다방</h2>
      <section class="board-grid reveal">
        <div class="board-box">
          <div class="board-header">
            <h3>🔥 핫한 이야기</h3>
            <span>더보기 +</span>
          </div>
          <ul>
            <li class="post-item">
              <span class="rank">1</span><span class="post-title">강아지 편식 고치는 꿀팁 공유해요</span>
              <span class="post-meta">1.2k</span>
            </li>
            <li class="post-item">
              <span class="rank">2</span><span class="post-title">캣타워 내돈내산 솔직 비교!</span>
              <span class="post-meta">980</span>
            </li>
            <li class="post-item">
              <span class="rank">3</span><span class="post-title">산책할 때 진드기 예방법 ㅠㅠ</span>
              <span class="post-meta">850</span>
            </li>
          </ul>
        </div>

        <div class="board-box">
          <div class="board-header">
            <h3>✨ 실시간 질문</h3>
            <span>더보기 +</span>
          </div>
          <ul>
            <li class="post-item">
              <span class="post-title">3개월 비숑 사료량 얼마나 주나요?</span>
              <span class="post-meta">방금</span>
            </li>
            <li class="post-item">
              <span class="post-title">마포구 친절한 동물병원 추천좀요</span>
              <span class="post-meta">5분 전</span>
            </li>
            <li class="post-item">
              <span class="post-title">고양이가 이불에 오줌을 쌌어요...</span>
              <span class="post-meta">12분 전</span>
            </li>
          </ul>
        </div>
      </section>

      <section class="adopt-banner-wrap reveal">
        <div class="banner-overlay"></div> 
        <div class="banner-content">
          <p class="banner-subtitle">ADOPT, DON'T SHOP</p>
          <h2 class="banner-title">
            작은 생명에게<br>
            기적을 선물해주세요
          </h2>
          <a href="#" class="banner-btn">
            아이들 보러가기
          </a>
        </div>
      </section>

      <h2 class="section-title reveal">도전! 멍냥 OX 퀴즈</h2>
      
      <div class="quiz-container-single reveal">
        <button class="nav-arrow prev" @click="changeQuiz(-1)">
          <span class="material-icons-round">chevron_left</span>
        </button>

        <div 
          v-for="(quiz, index) in quizzes" 
          :key="quiz.id"
          class="quiz-card" 
          :class="{ active: currentQuizIdx === index, flipped: quiz.flipped }"
          v-show="currentQuizIdx === index"
          @click="flipCard(index)"
        >
          <div class="quiz-inner">
            <div class="quiz-front">
              <img :src="quiz.img" class="q-img" alt="퀴즈 이미지">
              <div class="q-text-wrap">
                <span class="q-badge">Q.0{{ quiz.id }}</span>
                <h3 class="q-question">{{ quiz.q }}</h3>
                <div class="q-options">
                  <div class="q-btn">O</div>
                  <div class="q-btn">X</div>
                </div>
              </div>
            </div>
            <div class="quiz-back">
              <div class="a-result">{{ quiz.a }}</div>
              <p class="a-desc">{{ quiz.desc }}</p>
              <span class="a-sub">(다시 터치하면 돌아가요)</span>
            </div>
          </div>
        </div>

        <button class="nav-arrow next" @click="changeQuiz(1)">
          <span class="material-icons-round">chevron_right</span>
        </button>
      </div>

    </div>
  </div>

  </template>

<style scoped>
/* ========================================
    Theme Variables & Reset
   ======================================== */
/* CSS 변수 직접 선언 */
section, div {
    --font-title: 'Jua', cursive;
    --font-body: 'NanumSquareRound', sans-serif;
    
    --primary-honey: #FFB300; 
    --soft-butter: #FFF176; 
    --bg-cream: #FFFDE7; 
    
    --text-brown-dark: #4E342E; 
    --text-brown-light: #795548; 
    
    --shadow-soft: 0 12px 30px rgba(255, 179, 0, 0.25);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

/* main 태그 스타일 삭제 (App.vue에서 잡아주거나 div로 처리됨) */

/* 폰트 적용 */
h1, h2, h3, h4, .s-title, .tag-text, .badge {
    font-family: 'Jua', cursive;
}

a { text-decoration: none; color: inherit; transition: 0.3s; }
ul { list-style: none; }
button { font-family: 'NanumSquareRound', sans-serif; }


/* ========================================
    1. Hero Section
   ======================================== */
.hero-wrap {
    position: relative;
    width: 100%; height: 100vh;
    overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    background-image: url('https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=2524&auto=format&fit=crop');
    background-size: cover;
    background-position: center 30%;
    background-attachment: fixed;
}

.overlay {
    position: absolute; top:0; left:0; width:100%; height:100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5));
}

.hero-content {
    position: relative; z-index: 10; text-align: center; color: #fff;
    transform: translateY(20px); opacity: 0;
    animation: fadeUp 1s ease-out forwards; animation-delay: 0.5s;
    text-shadow: 0 2px 20px rgba(0,0,0,0.4);
    width: 90%;
}

@keyframes fadeUp { to { transform: translateY(0); opacity: 1; } }

.main-copy { font-size: 70px; line-height: 1.15; margin-bottom: 24px; }
.sub-copy { font-size: 22px; margin-bottom: 40px; font-weight: 700; }

.scroll-down {
    position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
    color: #fff; font-family: 'Jua', cursive; font-size: 15px;
    animation: bounce 2s infinite; display: flex; flex-direction: column; align-items: center; gap: 8px;
    text-shadow: 0 2px 5px rgba(0,0,0,0.5);
}
.mouse-icon { width: 28px; height: 44px; border: 2px solid #fff; border-radius: 50px; position: relative; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
.mouse-wheel { width: 4px; height: 6px; background: #fff; border-radius: 50%; position: absolute; top: 10px; left: 50%; transform: translateX(-50%); animation: wheel 2s infinite; }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform:translateX(-50%) translateY(0);} 40% {transform:translateX(-50%) translateY(-10px);} 60% {transform:translateX(-50%) translateY(-5px);} }
@keyframes wheel { 0% {top:10px; opacity:1;} 100% {top:24px; opacity:0;} }


/* ========================================
    2. Content Layer (Base)
   ======================================== */
.content-layer {
    position: relative;
    background: #FFFDE7;
    z-index: 20;
    border-radius: 50px 50px 0 0;
    margin-top: -60px;
    padding-top: 100px;
    padding-bottom: 100px;
    box-shadow: 0 -20px 50px rgba(0,0,0,0.1);
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }


/* ========================================
    3. Sections
   ======================================== */

/* AI 진단 */
.ai-section { display: flex; align-items: center; justify-content: space-between; gap: 60px; margin-bottom: 160px; }

.ai-text { flex: 1; }
.ai-text h2 { font-size: 52px; color: var(--text-brown-dark); margin-bottom: 20px; line-height: 1.25; }
.ai-text p { font-size: 19px; margin-bottom: 36px; line-height: 1.6; word-break: keep-all; color: var(--text-brown-light); }

.modern-search {
    display: flex; align-items: center;
    background: #fff; padding: 6px 6px 6px 24px;
    border-radius: 100px; width: 100%; max-width: 500px;
    transition: 0.3s; border: 4px solid var(--soft-butter);
    box-shadow: var(--shadow-soft);
}
.modern-search:focus-within { border-color: var(--primary-honey); transform: scale(1.02); }
.modern-search input { flex: 1; background: transparent; border: none; outline: none; font-size: 17px; font-family: 'NanumSquareRound', sans-serif; color: var(--text-brown-dark); height: 44px;}
.search-icon-btn {
    width: 50px; height: 50px; background: var(--primary-honey); color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; transition: 0.2s;
    box-shadow: 0 4px 10px rgba(255, 179, 0, 0.4);
}
.search-icon-btn:hover { background: #FFCA28; transform: rotate(15deg); }

.ai-visual {
    flex-basis: 500px; min-width: 400px; height: 450px; 
    background: #FFF8E1; border-radius: 40px; overflow: hidden; position: relative;
    box-shadow: var(--shadow-soft); border: 6px solid #fff;
}
.ai-img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
.scan-effect {
    position: absolute; top:0; left:0; width:100%; height:100%;
    background: linear-gradient(to bottom, transparent, rgba(255, 179, 0, 0.3), transparent);
    animation: scanDown 3s infinite linear;
}
@keyframes scanDown { 0% {transform: translateY(-100%);} 100% {transform: translateY(100%);} }


/* 게시판 (Boards) */
.section-title { font-size: 36px; color: var(--text-brown-dark); margin-bottom: 50px; text-align: center; }

.board-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 160px; }
.board-box { background: #fff; border-radius: 32px; padding: 40px; box-shadow: var(--shadow-soft); border: 2px solid #fff; transition: 0.3s; }
.board-box:hover { transform: translateY(-8px); border-color: var(--soft-butter); }

.board-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 3px dashed #FFF176; padding-bottom: 16px; }
.board-header h3 { font-size: 24px; color: var(--text-brown-dark); }
.board-header span { font-size: 16px; color: var(--primary-honey); cursor: pointer; }

.post-item { display: flex; align-items: center; padding: 14px 0; border-bottom: 1px solid #FFF3E0; cursor: pointer; transition: 0.2s; color: var(--text-brown-light); }
.post-item:hover { color: var(--text-brown-dark); padding-left: 8px; }
.post-title { font-size: 17px; font-weight: 700; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-right: 10px; }
.post-meta { font-size: 14px; color: #BCAAA4; white-space: nowrap; }

.rank { display: inline-block; width: 28px; height: 28px; background: var(--primary-honey); color: #fff; text-align: center; line-height: 28px; font-size: 15px; font-family: 'Jua', cursive; border-radius: 50%; margin-right: 12px; }


/* 입양 배너 (Adopt Banner) */
.adopt-banner-wrap {
    margin-bottom: 160px;
    width: 100%;
    height: 500px;
    position: relative;
    border-radius: 40px;
    overflow: hidden;
    box-shadow: var(--shadow-soft);
    background-image: url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=2000');
    background-size: cover;
    background-position: center 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.banner-overlay {
    position: absolute; top:0; left:0; width:100%; height:100%;
    background: rgba(0, 0, 0, 0.4); 
    transition: 0.5s;
}
.adopt-banner-wrap:hover .banner-overlay {
    background: rgba(0, 0, 0, 0.5);
}

.banner-content {
    position: relative; z-index: 10;
    color: #fff;
    max-width: 600px;
    padding: 0 20px;
    animation: fadeIn 1s ease;
}

.banner-subtitle {
    font-size: 20px; font-weight: 700; margin-bottom: 16px;
    color: var(--soft-butter); letter-spacing: 1px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.banner-title {
    font-size: 48px; line-height: 1.3; margin-bottom: 40px;
    text-shadow: 0 4px 10px rgba(0,0,0,0.3);
    word-break: keep-all;
}

.banner-btn {
    display: inline-block;
    padding: 16px 40px;
    background: transparent;
    border: 2px solid #fff;
    color: #fff;
    font-size: 18px; font-weight: 800; font-family: 'Jua', cursive;
    border-radius: 100px;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
    cursor: pointer;
}

.banner-btn:hover {
    background: #fff;
    color: var(--text-brown-dark);
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}


/* OX Quiz Section */
.quiz-container-single {
    display: flex; align-items: center; justify-content: center;
    gap: 40px; margin-bottom: 120px;
}

.quiz-card {
    background-color: transparent;
    width: 700px; height: 400px; 
    perspective: 1000px; cursor: pointer; 
}

.quiz-card.active { animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.quiz-inner {
    position: relative; width: 100%; height: 100%; text-align: left; 
    transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
    transform-style: preserve-3d; border-radius: 40px; box-shadow: var(--shadow-soft);
}

.quiz-card.flipped .quiz-inner { transform: rotateY(180deg); }

.quiz-front {
    position: absolute; width: 100%; height: 100%;
    -webkit-backface-visibility: hidden; backface-visibility: hidden;
    border-radius: 40px;
    display: flex; flex-direction: row; align-items: center; justify-content: space-between; 
    padding: 30px; border: 4px solid #fff; background: #fff; color: var(--text-brown-dark); 
}

.quiz-back {
    position: absolute; width: 100%; height: 100%;
    -webkit-backface-visibility: hidden; backface-visibility: hidden;
    border-radius: 40px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 30px; border: 4px solid #fff; background: var(--primary-honey); color: #fff; 
    transform: rotateY(180deg); text-align: center;
}

.q-img { width: 45%; height: 100%; border-radius: 24px; object-fit: cover; margin-right: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.q-text-wrap { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }

.q-badge { background: var(--soft-butter); color: var(--text-brown-dark); padding: 8px 16px; border-radius: 20px; font-size: 16px; font-weight: 700; margin-bottom: 16px; display: inline-block; }
.q-question { font-size: 26px; line-height: 1.35; word-break: keep-all; font-family: 'Jua', cursive; margin-bottom: 24px; }

.q-options { display: flex; gap: 20px; }
.q-btn { 
    width: 60px; height: 60px; border-radius: 50%; background: #FFFDE7; 
    border: 2px solid var(--primary-honey); color: var(--primary-honey); 
    font-size: 28px; font-weight: 900; display: flex; align-items: center; justify-content: center; transition: 0.3s; 
}
.quiz-card:hover .q-btn { transform: scale(1.1); background: var(--primary-honey); color: #fff; }

.a-result { font-size: 60px; font-weight: 900; margin-bottom: 16px; }
.a-desc { font-size: 20px; line-height: 1.6; word-break: keep-all; font-weight: 700; }
.a-sub { font-size: 14px; margin-top: 20px; opacity: 0.8; }

.nav-arrow {
    width: 50px; height: 50px; border-radius: 50%; background: var(--soft-butter);
    border: none; color: var(--text-brown-dark); font-size: 24px;
    cursor: pointer; box-shadow: var(--shadow-soft); transition: 0.3s;
    display: flex; align-items: center; justify-content: center;
}
.nav-arrow:hover { background: var(--primary-honey); color: #fff; transform: scale(1.1); }


/* Reveal Animation */
.reveal { opacity: 0; transform: translateY(60px); transition: 1s ease; }
.reveal.active { opacity: 1; transform: translateY(0); }


/* ========================================
    4. Media Queries
   ======================================== */
@media (max-width: 900px) {
    .main-copy { font-size: 48px; }
    .ai-section { flex-direction: column; text-align: center; }
    .ai-visual { width: 100%; min-width: auto; height: 350px; flex-basis: auto; }
    .modern-search { margin: 0 auto; }
    .board-grid { grid-template-columns: 1fr; }
    
    /* nav-menu 삭제했으므로 관련 CSS 제거 */
    
    .quiz-container-single { gap: 10px; }
    
    .quiz-card { width: 320px; height: 500px; }
    .quiz-front { flex-direction: column; text-align: center; }
    .q-img { width: 100%; height: 200px; margin-right: 0; margin-bottom: 20px; }
    .q-text-wrap { align-items: center; }
    .q-question { font-size: 22px; margin-bottom: 24px; }
    
    .banner-title { font-size: 32px; }
    .adopt-banner-wrap { height: 400px; }
}
</style>