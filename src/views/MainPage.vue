<template>
  <div class="home-container">
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
        <div class="mouse-icon">
          <div class="mouse-wheel"></div>
        </div>
        <span>SCROLL</span>
      </div>
    </section>

    <div class="content-layer" ref="contentLayer">
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
              <input 
                type="text" 
                placeholder="예: 강아지 눈꼽이 많이 껴요"
                v-model="searchQuery"
                @keyup.enter="goToAiDiagnosis"
              >
              <button class="search-icon-btn" @click="goToAiDiagnosis">
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
              <span @click="goToCommunity('popular')">더보기 +</span>
            </div>
            <ul>
              <li 
                v-for="(post, index) in hotPosts" 
                :key="post.id" 
                class="post-item"
                @click="goToPostDetail(post.id)"
              >
                <span class="rank">{{ index + 1 }}</span>
                <span class="post-title">{{ post.title }}</span>
                <span class="post-meta">{{ post.likes }}</span>
              </li>
            </ul>
          </div>

          <div class="board-box">
            <div class="board-header">
              <h3>✨ 실시간 질문</h3>
              <span @click="goToCommunity('latest')">더보기 +</span>
            </div>
            <ul>
              <li 
                v-for="post in livePosts" 
                :key="post.id" 
                class="post-item"
                @click="goToPostDetail(post.id)"
              >
                <span class="post-title">{{ post.title }}</span>
                <span class="post-meta">{{ post.time }}</span>
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
            class="quiz-card active" 
            :class="{ flipped: isFlipped }" 
            @click="flipCard"
          >
            <div class="quiz-inner">
              <div class="quiz-front">
                <img :src="currentQuiz.img" class="q-img" :alt="currentQuiz.alt">
                <div class="q-text-wrap">
                  <span class="q-badge">Q.0{{ currentQuizIdx + 1 }}</span>
                  <h3 class="q-question" v-html="currentQuiz.question"></h3>
                  <div class="q-options">
                    <div class="q-btn">O</div>
                    <div class="q-btn">X</div>
                  </div>
                </div>
              </div>
              <div class="quiz-back">
                <div class="a-result">{{ currentQuiz.answer }}</div>
                <p class="a-desc" v-html="currentQuiz.desc"></p>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 

const router = useRouter();
const searchQuery = ref('');

// 0. AI 진단 이동
const goToAiDiagnosis = () => {
  if (!searchQuery.value.trim()) {
    alert('증상을 입력해주세요!'); 
    return;
  }
  router.push({ name: 'AiDiagnosis', query: { symptom: searchQuery.value } });
};

// ✅ [핵심] 커뮤니티 메인으로 이동 (정렬 기준 전달)
const goToCommunity = (sortType) => {
  // sortType에는 'popular' 또는 'latest'가 들어옵니다.
  // 나중에 커뮤니티 페이지에서 route.query.sort로 받아서 처리하면 됩니다.
  
  router.push({ 
    name: 'community', // ⚠️ 라우터 이름이 CommunityMain인지 꼭 확인하세요!
    query: { sort: sortType } 
  });
};

// 게시글 상세 이동
const goToPostDetail = (id) => {
  // router.push({ name: 'CommunityDetail', params: { id: id } });
  alert(`${id}번 게시글 상세 페이지로 이동합니다!`);
};

// 1. 게시판 데이터
const hotPosts = ref([
  { id: 101, title: '강아지 편식 고치는 꿀팁 공유해요', likes: '1.2k' },
  { id: 102, title: '캣타워 내돈내산 솔직 비교!', likes: '980' },
  { id: 103, title: '산책할 때 진드기 예방법 ㅠㅠ', likes: '850' }
]);

const livePosts = ref([
  { id: 201, title: '3개월 비숑 사료량 얼마나 주나요?', time: '방금' },
  { id: 202, title: '마포구 친절한 동물병원 추천좀요', time: '5분 전' },
  { id: 203, title: '고양이가 이불에 오줌을 쌌어요...', time: '12분 전' }
]);

// 2. 퀴즈 로직
const currentQuizIdx = ref(0);
const isFlipped = ref(false);

const quizData = [
  {
    img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=600&auto=format&fit=crop',
    alt: '강아지 눈',
    question: '강아지는 세상을<br>흑백으로만 본다?',
    answer: 'X',
    desc: '적록색맹과 비슷해요!<br>파란색과 노란색은 구분할 수 있어요.'
  },
  {
    img: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=600&auto=format&fit=crop',
    alt: '우는 고양이',
    question: '다 큰 고양이는<br>사람에게만 "야옹" 한다?',
    answer: 'O',
    desc: '고양이끼리는 눈빛과 냄새로 대화해요.<br>집사에게만 목소리를 내는 거랍니다!'
  },
  {
    img: 'https://images.unsplash.com/photo-1554692992-e422ae42550e?q=80&w=600&auto=format&fit=crop',
    alt: '강아지 코',
    question: '강아지 코 지문으로<br>신원 확인이 가능하다?',
    answer: 'O',
    desc: '사람의 지문처럼 강아지 "비문"도<br>모두 달라서 등록이 가능해요!'
  }
];

const currentQuiz = computed(() => quizData[currentQuizIdx.value]);
const flipCard = () => { isFlipped.value = !isFlipped.value; };
const changeQuiz = (direction) => {
  isFlipped.value = false;
  let nextIdx = currentQuizIdx.value + direction;
  if (nextIdx >= quizData.length) nextIdx = 0;
  if (nextIdx < 0) nextIdx = quizData.length - 1;
  currentQuizIdx.value = nextIdx;
};

// 3. 스크롤 애니메이션
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');
</style>

<style scoped>
/* ========================================
    (스타일은 기존과 100% 동일합니다)
   ========================================
*/
.home-container {
    --font-title: 'Jua', cursive;
    --font-body: 'NanumSquareRound', sans-serif;
    --primary-honey: #FFB300; 
    --soft-butter: #FFF176; 
    --bg-cream: #FFFDE7; 
    --text-brown-dark: #4E342E; 
    --text-brown-light: #795548; 
    --shadow-soft: 0 12px 30px rgba(255, 179, 0, 0.25);
    
    font-family: var(--font-body);
    color: var(--text-brown-light);
    background-color: var(--bg-cream);
    overflow-x: hidden;
}

h1, h2, h3, h4, .s-title, .tag-text, .badge { font-family: var(--font-title); }
a { text-decoration: none; color: inherit; transition: 0.3s; }
ul { list-style: none; padding: 0; margin: 0; }
button { font-family: var(--font-body); border: none; cursor: pointer; }

/* 1. Hero Section */
.hero-wrap {
    position: relative; width: 100%; height: 100vh; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    background-image: url('https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=2524&auto=format&fit=crop');
    background-size: cover; background-position: center 30%; background-attachment: fixed;
}
.overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)); }
.hero-content {
    position: relative; z-index: 10; text-align: center; color: #fff;
    transform: translateY(20px); opacity: 0; animation: fadeUp 1s ease-out forwards; animation-delay: 0.5s;
    text-shadow: 0 2px 20px rgba(0,0,0,0.4); width: 90%;
}
@keyframes fadeUp { to { transform: translateY(0); opacity: 1; } }
.main-copy { font-size: 70px; line-height: 1.15; margin-bottom: 24px; }
.sub-copy { font-size: 22px; margin-bottom: 40px; font-family: var(--font-body); font-weight: 700; }
.scroll-down {
    position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
    color: #fff; font-family: var(--font-title); font-size: 15px;
    animation: bounce 2s infinite; display: flex; flex-direction: column; align-items: center; gap: 8px;
    text-shadow: 0 2px 5px rgba(0,0,0,0.5);
}
.mouse-icon { width: 28px; height: 44px; border: 2px solid #fff; border-radius: 50px; position: relative; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
.mouse-wheel { width: 4px; height: 6px; background: #fff; border-radius: 50%; position: absolute; top: 10px; left: 50%; transform: translateX(-50%); animation: wheel 2s infinite; }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform:translateX(-50%) translateY(0);} 40% {transform:translateX(-50%) translateY(-10px);} 60% {transform:translateX(-50%) translateY(-5px);} }
@keyframes wheel { 0% {top:10px; opacity:1;} 100% {top:24px; opacity:0;} }

/* 2. Content Layer */
.content-layer {
    position: relative; background: var(--bg-cream); z-index: 20;
    border-radius: 50px 50px 0 0; margin-top: -60px; padding-top: 100px; padding-bottom: 100px;
    box-shadow: 0 -20px 50px rgba(0,0,0,0.1);
}
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

/* AI Section */
.ai-section { display: flex; align-items: center; justify-content: space-between; gap: 60px; margin-bottom: 160px; }
.ai-text { flex: 1; }
.ai-text h2 { font-size: 52px; color: var(--text-brown-dark); margin-bottom: 20px; line-height: 1.25; }
.ai-text p { font-size: 19px; margin-bottom: 36px; line-height: 1.6; word-break: keep-all; }
.modern-search {
    display: flex; align-items: center; background: #fff; padding: 6px 6px 6px 24px;
    border-radius: 100px; width: 100%; max-width: 500px;
    transition: 0.3s; border: 4px solid var(--soft-butter); box-shadow: var(--shadow-soft);
}
.modern-search:focus-within { border-color: var(--primary-honey); transform: scale(1.02); }
.modern-search input { flex: 1; background: transparent; border: none; outline: none; font-size: 17px; font-family: var(--font-body); color: var(--text-brown-dark); height: 44px;}
.search-icon-btn {
    width: 50px; height: 50px; background: var(--primary-honey); color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
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

/* Boards Section */
.section-title { font-size: 36px; color: var(--text-brown-dark); margin-bottom: 50px; text-align: center; font-family: var(--font-title); }
.board-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 160px; }
.board-box { background: #fff; border-radius: 32px; padding: 40px; box-shadow: var(--shadow-soft); border: 2px solid #fff; transition: 0.3s; }
.board-box:hover { transform: translateY(-8px); border-color: var(--soft-butter); }
.board-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 3px dashed #FFF176; padding-bottom: 16px; }
.board-header h3 { font-size: 24px; color: var(--text-brown-dark); }
.board-header span { font-size: 16px; color: var(--primary-honey); cursor: pointer; }
.post-item { display: flex; align-items: center; padding: 14px 0; border-bottom: 1px solid #FFF3E0; cursor: pointer; transition: 0.2s; }
.post-item:hover { color: var(--text-brown-dark); padding-left: 8px; }
.post-title { font-size: 17px; font-weight: 700; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-right: 10px; }
.post-meta { font-size: 14px; color: #BCAAA4; white-space: nowrap; }
.rank { display: inline-block; width: 28px; height: 28px; background: var(--primary-honey); color: #fff; text-align: center; line-height: 28px; font-size: 15px; font-family: var(--font-title); border-radius: 50%; margin-right: 12px; }

/* Banner */
.adopt-banner-wrap {
    margin-bottom: 160px; width: 100%; height: 500px; position: relative;
    border-radius: 40px; overflow: hidden; box-shadow: var(--shadow-soft);
    background-image: url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=2000');
    background-size: cover; background-position: center 60%;
    display: flex; align-items: center; justify-content: center; text-align: center;
}
.banner-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0, 0, 0, 0.4); transition: 0.5s; }
.adopt-banner-wrap:hover .banner-overlay { background: rgba(0, 0, 0, 0.5); }
.banner-content { position: relative; z-index: 10; color: #fff; max-width: 600px; padding: 0 20px; animation: fadeIn 1s ease; }
.banner-subtitle { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: var(--soft-butter); letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
.banner-title { font-size: 48px; line-height: 1.3; margin-bottom: 40px; text-shadow: 0 4px 10px rgba(0,0,0,0.3); word-break: keep-all; font-family: var(--font-title); }
.banner-btn {
    display: inline-block; padding: 16px 40px; background: transparent; border: 2px solid #fff; color: #fff;
    font-size: 18px; font-weight: 800; font-family: var(--font-title); border-radius: 100px;
    backdrop-filter: blur(4px); transition: all 0.3s ease; cursor: pointer;
}
.banner-btn:hover { background: #fff; color: var(--text-brown-dark); transform: scale(1.05); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

/* Quiz */
.quiz-container-single { display: flex; align-items: center; justify-content: center; gap: 40px; margin-bottom: 120px; }
.quiz-card { background-color: transparent; width: 700px; height: 400px; perspective: 1000px; cursor: pointer; display: block; }
.quiz-card.active { animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.quiz-inner { position: relative; width: 100%; height: 100%; text-align: left; transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1); transform-style: preserve-3d; border-radius: 40px; box-shadow: var(--shadow-soft); }
.quiz-card.flipped .quiz-inner { transform: rotateY(180deg); }
.quiz-front { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; border-radius: 40px; display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 30px; border: 4px solid #fff; background: #fff; color: var(--text-brown-dark); }
.quiz-back { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; border-radius: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; border: 4px solid #fff; background: var(--primary-honey); color: #fff; transform: rotateY(180deg); text-align: center; }
.q-img { width: 45%; height: 100%; border-radius: 24px; object-fit: cover; margin-right: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.q-text-wrap { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
.q-badge { background: var(--soft-butter); color: var(--text-brown-dark); padding: 8px 16px; border-radius: 20px; font-size: 16px; font-weight: 700; margin-bottom: 16px; display: inline-block; font-family: var(--font-title); }
.q-question { font-size: 26px; line-height: 1.35; word-break: keep-all; font-family: var(--font-title); margin-bottom: 24px; }
.q-options { display: flex; gap: 20px; }
.q-btn { width: 60px; height: 60px; border-radius: 50%; background: var(--bg-cream); border: 2px solid var(--primary-honey); color: var(--primary-honey); font-size: 28px; font-weight: 900; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
.quiz-card:hover .q-btn { transform: scale(1.1); background: var(--primary-honey); color: #fff; }
.a-result { font-size: 60px; font-weight: 900; margin-bottom: 16px; }
.a-desc { font-size: 20px; line-height: 1.6; word-break: keep-all; font-weight: 700; }
.a-sub { font-size: 14px; margin-top: 20px; opacity: 0.8; }
.nav-arrow { width: 50px; height: 50px; border-radius: 50%; background: var(--soft-butter); border: none; color: var(--text-brown-dark); font-size: 24px; cursor: pointer; box-shadow: var(--shadow-soft); transition: 0.3s; display: flex; align-items: center; justify-content: center; }
.nav-arrow:hover { background: var(--primary-honey); color: #fff; transform: scale(1.1); }
.reveal { opacity: 0; transform: translateY(60px); transition: 1s ease; }
.reveal.active { opacity: 1; transform: translateY(0); }

@media (max-width: 900px) {
    .main-copy { font-size: 48px; }
    .ai-section { flex-direction: column; text-align: center; }
    .ai-visual { width: 100%; min-width: auto; height: 350px; flex-basis: auto; }
    .modern-search { margin: 0 auto; }
    .board-grid { grid-template-columns: 1fr; }
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