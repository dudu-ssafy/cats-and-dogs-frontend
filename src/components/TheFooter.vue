<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-left">
        <div class="footer-menu">
          <a href="#">서비스 소개</a>
          <a href="#">이용약관</a>
          <a href="#" class="bold-link">개인정보처리방침</a>
          <a href="#">고객센터</a>
        </div>
        
        <div class="company-info">
          (주)함께하개냥 | 대표: 이재용 | 사업자등록번호: 123-45-67890<br>
          주소: 대전 유성구 동서대로 98-39 삼성화재유성연수원 교육동<br>
          이메일: help@dogcat.com | 전화: 02-1234-5678
        </div>
        
        <div class="copyright">
          © 2025 Together DogCat. All Rights Reserved.
        </div>
      </div>

      <div class="footer-right">
        <div class="footer-logo">
          <span class="material-icons-round">pets</span> 함께하개냥
        </div>
        <div class="footer-sns">
          <div class="sns-icon" title="Instagram"><span class="material-icons-round">camera_alt</span></div>
          <div class="sns-icon" title="Youtube"><span class="material-icons-round">play_arrow</span></div>
          <div class="sns-icon" title="Contact"><span class="material-icons-round">email</span></div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* 주신 푸터 CSS 그대로 */
.site-footer {
  background-color: #FAFAFA; border-top: 1px solid #EAEAEA;
  padding: 60px 0; color: #888; font-size: 13px; width: 100%;
}
.footer-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 40px;
  display: flex; justify-content: space-between; align-items: flex-start;
}
.footer-left { display: flex; flex-direction: column; gap: 16px; }
.footer-menu { display: flex; gap: 20px; font-size: 14px; }
.footer-menu a { text-decoration: none; color: #555; transition: 0.2s; font-weight: 500; }
.footer-menu a:hover { color: #222; text-decoration: underline; }
.bold-link { font-weight: 800 !important; color: #333 !important; }
.company-info { line-height: 1.6; color: #999; }
.copyright { margin-top: 8px; color: #BBB; }
.footer-right { text-align: right; }
.footer-logo {
  font-size: 20px; font-weight: 800; color: #DDD;
  display: flex; align-items: center; justify-content: flex-end; gap: 4px;
  margin-bottom: 12px; cursor: default;
}
.footer-sns { display: flex; gap: 12px; justify-content: flex-end; }
.sns-icon {
  width: 32px; height: 32px; background: #EEE; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #999; font-size: 18px; cursor: pointer; transition: 0.2s;
}
.sns-icon:hover { background: #FFD54F; color: white; transform: translateY(-2px); }
</style>