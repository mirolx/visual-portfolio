# MY-DOYAK 2026 · Visual Portfolio

> 생성형 AI로 실행한 나의 2026년
> 2026학년도 미래 DOYAK 공모전 · 생성형 AI를 활용한 역량관리 포트폴리오 — 소프트웨어학부 이승윤

**Live:** https://visual-portfolio-hazel.vercel.app

랙돌 고양이가 앞발을 들어 화면에 발도장을 찍으면, 그 발도장 사이로 포트폴리오가 열리는 인터랙티브 웹사이트입니다.
활동마다 설명과 함께 직접 녹화한 5~10초 시연 영상이 재생됩니다.

## 인터랙션

1. **인트로** — 숨 쉬듯 움직이는 고양이와 그 뒤로 지나가는 `VISUAL PORTFOLIO` 타이포그래피
2. **스크롤 전환** — 고양이가 앞발을 들고 → 화면이 어두워지고 → 든 앞발 자리에 발도장이 찍히며 → 발도장이 부풀어 Work 화면이 드러남 (스크롤을 되돌리면 역재생)
3. **Work 목록** — 항목에 마우스를 올리면 오른쪽에 미리보기 카드가 펼쳐짐
4. **상세 패널** — 클릭하면 설명·태그와 함께 시연 영상이 자동 재생

## Work

| Case | 활동 | 시연 영상 |
|---|---|---|
| 01 · 개발 | **SoftEdiTools 웹서비스** — 온라인 도구 11종, Next.js · Vercel 배포, SEO | 스크롤 인터랙션 → Case Converter 사용 |
| 02 · 개발 | **크리에이터 콘텐츠 대시보드** — Supabase 로그인/DB, YouTube Data API 트렌드 크롤링 | 로그인 → bento grid · magnetic cursor → 트렌드 다시 가져오기 |
| 03 · 비즈니스 | **Etsy 쇼핑몰 TheSoftEditStudios** — AI와 함께 상품 150여 종 기획·판매 | 샵 → 리스팅 → 상세 이미지 → 리뷰 |
| 04 · Global | **McGill University 교환학생** — 2026 Winter Semester | 교환학생 사진 슬라이드 |

## 사용한 도구

- **개발**: Claude Code로 기획부터 구현·배포까지
- **애니메이션**: [GSAP](https://gsap.com/) + ScrollTrigger (스크롤 연동 타임라인), 발도장 이미지를 CSS mask로 사용한 화면 전환
- **이미지**: Kittl(ChatGPT Image)로 고양이 캐릭터, 앞발 든 포즈, 수채화 발도장 생성
- **시연 영상**: Playwright + Chrome DevTools 화면 캡처로 녹화, ffmpeg로 편집
- **글꼴**: 세종글꽃체, Playfair Display

## 구조

```
index.html        페이지 구조 (인트로 · Work 목록 · 상세 패널)
style.css         스타일과 반응형 레이아웃
main.js           스크롤 전환, 발도장 reveal, 미리보기, 상세 패널
data.js           Work 항목 데이터 (문구 · 태그 · 영상 경로)
assets/cat/       고양이 · 발도장 이미지
assets/videos/    Case별 시연 영상
assets/fonts/     세종글꽃체 (woff2)
```

빌드 과정 없는 정적 사이트라, 폴더를 그대로 서버에 올리면 됩니다.

```bash
python -m http.server 5173
```

## 출처

- 글꼴: 세종글꽃체 © 세종특별자치시 (제작: 윤디자인그룹), [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (SIL Open Font License)
