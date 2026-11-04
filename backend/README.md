# 세명 백엔드

Node.js 22 이상에서 실행합니다.

```powershell
npm install
# .env의 GEMINI_API_KEY에 실제 키를 입력하세요.
npm start
```

서버 주소: `http://localhost:3010` (`PORT` 환경 변수로 변경 가능). JSON 요청 및 모든 출처의 CORS 요청을 허용합니다.
`.env`는 Git에서 제외됩니다. 다른 환경에서는 `.env.example`을 `.env`로 복사한 뒤 키를 입력하세요.
`GEMINI_MODEL`로 모델을 변경할 수 있습니다. 이 값이 비어 있으면 반별 `model`을 사용합니다.
반 이름과 설명은 초안이므로 실제 운영 정보에 맞게 `data/classes.json`을 수정하세요.
프런트 지도 ID는 `ai`, `game`, `web`과 맞춰 주세요.

## API

### GET /api/classes/:id

`id`, `name`, `description`, `model`을 반환합니다. 없는 반은 404입니다.

### POST /api/guide/ask

`Content-Type: application/json`

```json
{"classId":"ai","question":"어떤 것을 배우나요?"}
```

반 설명을 Gemini에 전달하고 `{"answer":"..."}`를 반환합니다.
질문은 공백 제외 1~2000자이며, 빈 질문이나 누락된 반 ID는 400입니다.

### POST /api/oneshot

`multipart/form-data`로 `photo` 파일 1개와 `description` 텍스트를 전송합니다.
사진은 JPEG/PNG/WebP, 최대 30MiB(30 × 1024 × 1024바이트), 설명은 한 줄 1~500자입니다.
브라우저의 FormData를 사용할 때 Content-Type 헤더를 직접 지정하지 마세요.
사진은 메모리에서 처리하여 Gemini에 전송하며 디스크에 저장하지 않습니다.

```json
{
  "storyboard": [{"scene":1,"visual":"프로젝트를 소개하는 모습","caption":"함께 만든 첫 작품"}],
  "cardNews": [{"page":1,"title":"우리의 첫 프로젝트","body":"아이디어가 작품이 되기까지"}],
  "hashtags": ["#세명한컷", "#프로젝트"]
}
```

카드뉴스는 이미지 파일이 아닌 원고 JSON입니다.
모든 오류는 `{"error":"설명"}`으로 반환합니다. 입력 오류 400, 없는 반/API 404,
용량 초과 413, AI 요청 한도 429, AI 서비스 오류 502, 키 미설정 503, AI 시간 초과 504입니다.
요청 처리 중 오류는 공통 미들웨어가 처리하여 서버가 계속 요청을 받을 수 있습니다.

## 확인

```powershell
npm test
```

자동 테스트는 Gemini를 모의 응답으로 대체하여 실제 HTTP로 세 API의 성공/실패 경로를 확인합니다.
실제 Gemini 연결 확인은 키 설정 후 VS Code REST Client에서 `test.http` 요청을 실행하세요.
사진 요청의 `./photo.jpg`는 로컬 사진 경로로 바꿔 주세요. Postman에서는 Body → form-data에서
`photo`를 File, `description`을 Text로 지정하면 됩니다.

Gemini REST 요청은 [generateContent 공식 문서](https://ai.google.dev/api/generate-content)를 참고합니다.
