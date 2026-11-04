# 세명 스쿨버스 — 프론트엔드 ID / 연동 가이드

## 실행
ZIP을 **압축 해제**하고 폴더에서 `index.html`을 Chrome으로 열거나 VS Code Live Server로 실행합니다. 추가 패키지 설치 불필요.

## 주의
건물 이름(본관/정보관/신관/체육관)을 기준으로 탐험 흐름을 구성했지만, **층수, 시설별 위치, 지도는 실제 학교 배치가 아닌 시연용 예시**입니다. 학교 측 자료로 검증 후 `script.js`의 `BUILDINGS`와 `school-map.svg`를 교체하세요.

## 화면 ID
- `home` 메인
- `explore` 학교 탐험
- `photo` 세명 한 컷
- `classroom-view` 3D 교실 화면
- `building-tabs` 건물 선택
- `building-name`, `building-desc` 건물 정보
- `floor-tabs` 층 선택
- `school-map` 예시 지도 이미지
- `class-pins` 교실 핀 컨테이너
- `class-modal` 교실 모달
- `modal-close-btn` 닫기
- `class-name`, `class-desc` 교실 정보
- `ask-input`, `ask-btn`, `answer` AI 질문/답변
- `ask-loading`, `ask-error` AI 로딩/오류
- `view-3d-btn`, `back-btn` 3D 이동/복귀
- `classroom-title`, `classroom-3d` 3D 제목/삽입 위치
- `classroom-loading`, `classroom-error` 3D 로딩/오류
- `photo-input`, `photo-preview`, `photo-desc` 사진 입력
- `create-btn`, `create-loading`, `create-error` 생성 버튼/상태
- `storyboard`, `cards`, `hashtags` 결과 컨테이너

## 데이터 속성
- `[data-page="explore"]` 페이지 전환
- `[data-building="main|info|new|gym"]` 건물 전환
- `[data-floor="1"]` 층 버튼 (JS 동적 생성)
- `[data-class="ai"]` 교실 ID (JS 동적 생성)

## 백엔드 연결
`script.js`에서 `BUILDINGS` 안의 각 교실 배열은 `[classId, 교실 이름, 설명]`입니다. `ask-btn` 이벤트에 `POST /api/ask` 등 API를 연결하고 `{classId, question}`을 전송하세요. `create-btn` 이벤트에서는 `FormData`로 사진과 설명을 전송하고 `storyboard`, `cards`, `hashtags`에 결과를 채우세요. `classroom-3d`에 3D 렌더러를 삽입하세요. `.hidden` / `.open`으로 상태를 전환합니다.

## 실제 학교 VR 참고
https://pict.space/smc/ (외부 사이트, 웹사이트 내부에 삽입하지 않음)

## 현재 질문 답변 동작
공간 용도 설명은 `SPACE_PROFILES`에서 관리하며 `spaceType`으로 유형을 구분합니다. 일반교실·교무실·체육관·도서관 등 각 공간의 역할을 모달과 답변에 공통 적용합니다. 신관 4층은 `보안과 교무실`(`new-security-office`) 명칭을 유지합니다. 신관 1층에는 사용자 제공 위치로 도제교육부(`new-apprenticeship-office`)를 추가했습니다. 도제교육부에는 학교 교육과 기업 현장훈련 연계, 교육 참여 절차 안내라는 일반적 역할을 설명하며 실제 참여 기업·일정은 단정하지 않습니다.

신관 조사 결과와 추가 ID는 [NEW-WING-RESEARCH.md](NEW-WING-RESEARCH.md)를 참고하세요. 신관 4~5층은 과거 학과 공지 기반이며 전체 층수·현재 배치는 미확인입니다. 1~3층은 기존 예시입니다. 교실 배열은 기존 `[classId, 이름, 설명]`에 선택적으로 네 번째 `{url, date}` 자료 정보를 붙일 수 있습니다. 해당 자료는 답변 카드에 링크와 날짜로 표시됩니다.

답변은 `classroomGuide`가 구조화하고 `renderGuide`가 제목·요약·안내 항목·후속 질문 버튼으로 표시합니다. 질문에서 공간명을 명시하면 해당 공간을 검색하고 동명 공간은 층을 다시 확인합니다. 위치와 이용 방법을 함께 물으면 두 항목을 모두 안내합니다. `answer` ID와 교실 ID는 유지되며, 출력은 `textContent`로 삽입합니다. 외부 AI API는 사용하지 않습니다.

본관은 1~6층입니다. 3층에는 도서관(`main-library`), 학습실(`main-study`), 위클래스(`main-wee`)가 있습니다. 4층은 일반 교실 3개(`main-classroom-4-1`~`main-classroom-4-3`), 5층은 교무실(`main-teachers-office`)과 교실 3개(`main-classroom-5-1`~`main-classroom-5-3`), 6층은 생활안전부(`main-student-safety`)와 교실 3개(`main-classroom-6-1`~`main-classroom-6-3`)입니다. 추가 일반 교실의 개수·명칭·배치는 시연용이며 실제 반과 호수는 확인 후 수정하세요. 각 ID는 `data-class`에 사용되며 안내 답변의 위치도 같은 데이터에서 가져옵니다.

정보관 2층과 3층은 각각 교실 3개입니다. 기존 교실 ID는 유지하고 `info-classroom-2-3`, `info-classroom-3-2`, `info-classroom-3-3`을 추가했습니다. 새 교실 이름은 임시 명칭이며 번호는 실제 호수가 아닙니다. 안내 답변에는 공간 설명, 화면에서 찾는 순서, 같은 층 공간을 포함하며, 일부 학습 활동은 실제 학교 수업이 아닌 일반적인 예시로 구분합니다.

정보관 4층에 강당(`data-class="info-auditorium"`)과 강당 옆 4층 교실(`data-class="info-classroom-4"`)이 등록되어 있습니다. 두 공간은 지도에서 나란히 표시됩니다. 교실의 정식 명칭이 확인되면 `BUILDINGS.info.floors[4]`에서 이름을 변경하세요. 층과 두 공간은 사용자 제공 정보이며 지도상의 정확한 위치와 크기는 예시입니다.

서버 없이 index.html을 열어 사용하는 교실 안내입니다. 생성형 AI는 사용하지 않습니다. script.js의 classroomGuide가 BUILDINGS의 설명과 위치로 답변합니다. 미등록 운영 시간과 장비는 확인이 필요하다고 안내합니다. Enter 키로 전송할 수 있습니다.

실제 AI 연결 시 별도 서버에서 API 키를 관리하고 ask-btn 처리부를 서버 호출로 교체하세요. 위의 백엔드 연결 항목은 향후 연동 가이드입니다.

## 일반교실 이름 규칙
본관 3층 교무실의 ID는 `main-teachers-office-3`입니다. 기존 5층 교무실(`main-teachers-office`)과 별개로 등록되어 있으며 지도와 위치 안내에 반영됩니다.

일반교실 표시 이름은 층을 포함한 'N층 일반교실'로 통일합니다. 같은 층에 여러 개면 'N층 일반교실 1'처럼 구분 번호를 붙입니다. 교실 ID는 유지하며 지도 핀, 모달, 3D 제목과 안내 답변에 같은 이름이 사용됩니다. 실습실 등 별도 용도가 있는 공간은 기존 이름을 유지합니다.
