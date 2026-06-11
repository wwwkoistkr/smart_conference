# 스마트 회의 요약

회의 대본과 메모를 AI로 분석해 한 줄 요약, 주요 논의 내용, 결정 사항, 해야 할 일을 정리하는 웹 서비스입니다.

## 공개 배포 주소

- GitHub Pages: https://wwwkoistkr.github.io/smart_conference/
- Sitemap: https://wwwkoistkr.github.io/smart_conference/sitemap.xml
- Robots: https://wwwkoistkr.github.io/smart_conference/robots.txt

검색엔진이 페이지를 이해할 수 있도록 한국어 제목, 설명, canonical URL, Open Graph 메타데이터, JSON-LD 구조화 데이터, robots.txt, sitemap.xml을 포함했습니다.

## 로컬 실행

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key.
3. Run the app:
   `npm run dev`

## 배포 참고

GitHub Pages 배포는 정적 프론트엔드를 공개합니다. AI 요약 API까지 운영하려면 `GEMINI_API_KEY`가 설정된 Node.js 서버 호스팅 환경에서 `npm run build`와 `npm start`로 실행해야 합니다.
