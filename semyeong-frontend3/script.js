"use strict";
// 중요: 아래 교실/층 배치는 시연용 가상 예시이며 실제 학교 평면도 아님.
// 백엔드 연동 시 class ID를 백엔드 식별자와 일치시키세요.
// 백엔드 API 주소. 서버 포트를 바꾸면 여기도 함께 바꾸세요.
const API_BASE = "http://localhost:3010";
// 백엔드 data/classes.json 의 반 ID와 지도 교실 ID를 연결합니다.
// 여기에 없는 교실은 기존의 등록 정보 기반 안내를 사용합니다.
const BACKEND_CLASS = { ai: "ai", software: "web" };
// 교실 ID별 둘러보기 영상. 백엔드 media 폴더에서 제공합니다.
const CLASSROOM_VIDEO = { ai: "/media/" + encodeURIComponent("영상1.mp4") };

const BUILDINGS = {
  main: {
    name: "본관",
    desc: "1~6층 · 도서관, 위클래스, 일반 교실과 교무실",
    floors: {
      1: [
        ["main-office", "행정실", "학교 행정 업무를 담당하는 공간입니다."],
        ["main-lounge", "휴게 공간", "학생들이 쉬어가는 공간입니다."],
      ],
      2: [
        [
          "main-class1",
          "2층 일반교실 1",
          "수업이 진행되는 일반 교실 예시입니다.",
        ],
        [
          "main-class2",
          "2층 일반교실 2",
          "수업이 진행되는 일반 교실 예시입니다.",
        ],
      ],
      3: [
        [
          "main-library",
          "도서관",
          "본관 3층에 있는 도서관입니다. 책을 읽고 자료를 찾는 공간입니다.",
        ],
        ["main-study", "학습실", "함께 공부하는 학습 공간 예시입니다."],
        [
          "main-wee",
          "위클래스",
          "본관 3층에 있는 위클래스입니다. 상담 신청 방법과 이용 시간은 담당 선생님께 확인해 주세요.",
        ],
        [
          "main-teachers-office-3",
          "교무실",
          "본관 3층에 있는 교무실입니다. 담당 선생님의 자리와 방문 가능 시간은 별도 확인이 필요합니다.",
        ],
      ],
      4: [
        [
          "main-classroom-4-1",
          "4층 일반교실 1",
          "본관 4층 일반 교실 예시입니다. 실제 반 이름과 호수는 아직 등록되지 않았습니다.",
        ],
        [
          "main-classroom-4-2",
          "4층 일반교실 2",
          "본관 4층 일반 교실 예시입니다. 실제 반 이름과 호수는 아직 등록되지 않았습니다.",
        ],
        [
          "main-classroom-4-3",
          "4층 일반교실 3",
          "본관 4층 일반 교실 예시입니다. 실제 반 이름과 호수는 아직 등록되지 않았습니다.",
        ],
      ],
      5: [
        [
          "main-teachers-office",
          "교무실",
          "본관 5층에 있는 교무실입니다. 담당 선생님의 자리와 방문 가능 시간은 별도 확인이 필요합니다.",
        ],
        [
          "main-classroom-5-1",
          "5층 일반교실 1",
          "본관 5층 교실 예시입니다. 실제 반 이름과 호수는 아직 등록되지 않았습니다.",
        ],
        [
          "main-classroom-5-2",
          "5층 일반교실 2",
          "본관 5층 교실 예시입니다. 실제 반 이름과 호수는 아직 등록되지 않았습니다.",
        ],
        [
          "main-classroom-5-3",
          "5층 일반교실 3",
          "본관 5층 교실 예시입니다. 실제 반 이름과 호수는 아직 등록되지 않았습니다.",
        ],
      ],
      6: [
        [
          "main-student-safety",
          "생활안전부",
          "본관 6층에 있는 생활안전부입니다. 구체적인 담당 업무와 방문 절차는 학교 안내나 담당 선생님께 확인해 주세요.",
        ],
        [
          "main-classroom-6-1",
          "6층 일반교실 1",
          "본관 6층 교실 예시입니다. 실제 반 이름과 호수는 아직 등록되지 않았습니다.",
        ],
        [
          "main-classroom-6-2",
          "6층 일반교실 2",
          "본관 6층 교실 예시입니다. 실제 반 이름과 호수는 아직 등록되지 않았습니다.",
        ],
        [
          "main-classroom-6-3",
          "6층 일반교실 3",
          "본관 6층 교실 예시입니다. 실제 반 이름과 호수는 아직 등록되지 않았습니다.",
        ],
      ],
    },
  },
  info: {
    name: "정보관",
    desc: "컴퓨터·소프트웨어 실습 공간과 4층 강당",
    floors: {
      1: [
        [
          "info-computer",
          "컴퓨터 실습실",
          "컴퓨터 활용을 실습하는 공간 예시입니다.",
        ],
        [
          "info-media",
          "미디어실",
          "디지털 콘텐츠 제작을 연습하는 공간 예시입니다.",
        ],
      ],
      2: [
        [
          "ai",
          "AI 실습실",
          "인공지능과 데이터 분석을 학습하는 공간 예시입니다.",
        ],
        [
          "software",
          "프로그래밍 실습실",
          "프로그래밍 프로젝트를 진행하는 공간 예시입니다.",
        ],
        [
          "info-classroom-2-3",
          "2층 일반교실 3",
          "정보관 2층의 세 번째 교실입니다. 정식 명칭과 수업 내용은 아직 등록되지 않았습니다.",
        ],
      ],
      3: [
        [
          "info-project",
          "프로젝트실",
          "팀 프로젝트를 진행하는 공간 예시입니다.",
        ],
        [
          "info-classroom-3-2",
          "3층 일반교실 2",
          "정보관 3층의 두 번째 교실입니다. 정식 명칭과 수업 내용은 아직 등록되지 않았습니다.",
        ],
        [
          "info-classroom-3-3",
          "3층 일반교실 3",
          "정보관 3층의 세 번째 교실입니다. 정식 명칭과 수업 내용은 아직 등록되지 않았습니다.",
        ],
      ],
      4: [
        [
          "info-auditorium",
          "강당",
          "정보관 4층에 있는 강당입니다. 옆에 교실이 있습니다.",
        ],
        [
          "info-classroom-4",
          "4층 일반교실",
          "정보관 4층 강당 옆에 있는 교실입니다.",
        ],
      ],
    },
  },
  new: {
    name: "신관",
    desc: "1층 도제교육부 · 4층 보안과 교무실 · 일부 공간은 예시 · 총층수 미확인",
    floors: {
      1: [
        [
          "new-apprenticeship-office",
          "도제교육부",
          "학교 교육과 기업 현장훈련을 연계하는 도제교육 운영을 지원하는 부서입니다. 학생들이 전공 지식을 현장 경험으로 이어갈 수 있도록 교육 과정과 참여 절차를 안내하는 역할을 합니다.",
        ],
        [
          "new-lab",
          "실습실 A (예시)",
          "실습 수업을 위한 가상 공간입니다. 실제 신관 1층 시설로 확인된 정보가 아닙니다.",
        ],
        [
          "new-meeting",
          "모임 공간 (예시)",
          "학생 활동을 위한 가상 공간입니다. 실제 신관 1층 시설로 확인된 정보가 아닙니다.",
        ],
      ],
      2: [
        [
          "new-training",
          "교육 실습실 (예시)",
          "실무형 교육 활동을 위한 가상 공간입니다. 실제 신관 2층 시설로 확인된 정보가 아닙니다.",
        ],
      ],
      3: [
        [
          "new-project",
          "프로젝트실 (예시)",
          "협업 활동을 위한 가상 공간입니다. 실제 신관 3층 시설로 확인된 정보가 아닙니다.",
        ],
      ],
      4: [
        [
          "new-security-office",
          "보안과 교무실",
          "보안과 포털의 2021년 특강 공지에서 신관 4층으로 안내한 교무실입니다. 현재 위치와 방문 절차는 학교에 확인해 주세요.",
          { url: "https://smc-secu.net/?p=9102", date: "2021-10-22" },
        ],
        [
          "new-database-lab",
          "데이터베이스 프로그래밍 실습실",
          "보안과 포털의 2021년 SCA 특강 공지에서 신관 4층으로 안내한 실습실입니다. 과거 특강 장소이며 현재 수업과 장비 구성은 별도 확인이 필요합니다.",
          { url: "https://smc-secu.net/?p=8866", date: "2021-10-14" },
        ],
      ],
      5: [
        [
          "new-computer-security-lab",
          "컴퓨터보안실습실",
          "보안과 포털의 2021년 ROC 특강 공지에서 신관 5층으로 안내한 실습실입니다. 당시 소켓프로그래밍 특강 장소로 사용됐으며 현재 운영 내용은 확인이 필요합니다.",
          { url: "https://smc-secu.net/?p=9102", date: "2021-10-22" },
        ],
      ],
    },
  },
  gym: {
    name: "체육관",
    desc: "체육 활동을 위한 공간 (예시)",
    floors: {
      1: [
        [
          "gym-court",
          "체육 활동 공간",
          "체육 수업과 활동을 위한 공간 예시입니다.",
        ],
        [
          "gym-storage",
          "체육 기자재실",
          "체육 기자재를 보관하는 공간 예시입니다.",
        ],
      ],
    },
  },
};
// 공간의 일반적인 역할을 설명합니다. 학교별 운영 규정과는 구분합니다.
const SPACE_PROFILES = {
  apprenticeship: {
    summary:
      "학교 교육과 기업 현장훈련을 연계하는 도제교육 운영을 지원하는 부서입니다. 학생들이 전공 지식을 현장 경험으로 이어갈 수 있도록 교육 과정과 참여 절차를 안내하는 역할을 합니다.",
    detail: [
      "도제교육이 궁금하다면",
      "도제교육 참여를 고민하고 있다면 교육 과정, 지원 자격, 선발 일정, 현장훈련 방식 등을 문의해 보세요. 구체적인 참여 기업과 운영 일정은 담당 선생님께 확인해 주세요.",
    ],
  },
  classroom: {
    summary:
      "정규 수업과 학급 활동이 이루어지는 기본 학습 공간입니다. 학생들이 교과 내용을 배우고 의견을 나누며, 함께 학교생활을 이어가는 중심이 됩니다.",
    detail: [
      "학습과 학급 생활",
      "교과 수업, 발표와 토론, 학급별 활동을 위한 공간으로 이해하시면 됩니다. 표시된 번호는 지도에서 교실을 구분하는 임시 번호이며 실제 학급이나 호수는 아닙니다.",
    ],
  },
  office: {
    summary:
      "선생님들이 수업을 준비하고 학생 지도와 학사 업무를 수행하는 공간입니다. 학생들은 필요한 안내를 받거나 선생님을 찾아뵙기 위해 방문할 수 있습니다.",
    detail: [
      "선생님을 찾아뵐 때",
      "찾는 선생님의 성함과 방문 목적을 먼저 말씀해 주세요. 수업 중이거나 자리를 비우신 경우가 있으니, 상담이나 긴 면담이 필요하면 가능한 시간을 먼저 여쭤보면 좋습니다.",
    ],
  },
  gym: {
    summary:
      "체육 수업과 다양한 신체 활동이 이루어지는 실내 체육 공간입니다. 학생들이 기초 체력을 기르고, 협동과 공정한 경쟁의 가치를 배우는 장소입니다.",
    detail: [
      "활동과 안전",
      "운동 전에는 충분히 몸을 풀고, 활동에 적합한 복장과 실내 운동화를 준비하는 것이 좋습니다. 사용 가능한 구역과 기구는 담당 선생님의 안내에 따라 확인해 주세요.",
    ],
  },
  storage: {
    summary:
      "체육 수업과 활동에 필요한 운동 기구와 용품을 보관·관리하는 공간입니다. 필요한 물품을 정리하고 다음 활동을 준비하는 역할을 합니다.",
    detail: [
      "기구 사용 안내",
      "기구를 꺼내거나 사용한 뒤에는 담당 선생님의 안내에 따라 반납하고 정리해 주세요. 보유 기구의 종류와 대여 절차는 학교에 확인이 필요합니다.",
    ],
  },
  library: {
    summary:
      "독서와 자료 탐색을 통해 배움의 폭을 넓히는 공간입니다. 관심 분야의 책을 읽거나 수업과 과제에 필요한 정보를 찾아보며 자기주도적으로 학습할 수 있습니다.",
    detail: [
      "독서와 자료 활용",
      "관심 있는 주제를 정해 관련 도서를 찾아보거나, 과제에 필요한 자료를 비교하며 읽는 데 활용할 수 있습니다. 대출과 반납 방법은 도서관의 실제 이용 안내를 확인해 주세요.",
    ],
  },
  study: {
    summary:
      "개인 학습과 학습 내용 정리에 집중할 수 있는 공간입니다. 학생들이 자신의 학습 속도에 맞춰 복습하고, 학습 목표를 차근차근 실천하는 데 도움을 줍니다.",
    detail: [
      "집중해서 공부하기",
      "공부할 내용과 목표를 정하고, 주변의 학습을 방해하지 않도록 배려하며 이용하면 좋습니다. 실제 개방 시간과 좌석 이용 방식은 학교 안내를 확인해 주세요.",
    ],
  },
  wee: {
    summary:
      "학교생활 속 고민을 나누고 정서적인 도움을 구할 수 있는 상담 공간입니다. 학생이 자신의 마음을 돌아보고 필요한 지원을 알아가는 데 함께하는 장소입니다.",
    detail: [
      "상담을 시작하려면",
      "고민이 명확하게 정리되지 않았더라도 상담을 문의할 수 있습니다. 신청 방법과 상담 가능한 시간, 상담 내용의 비밀보장 범위는 담당 선생님께 안내받으세요.",
    ],
  },
  safety: {
    summary:
      "학생들이 안전하고 안정적인 학교생활을 할 수 있도록 생활 지도와 안전 관련 업무를 지원하는 부서입니다. 학교생활 중 도움이 필요한 상황에 대해 안내를 구할 수 있습니다.",
    detail: [
      "도움이 필요할 때",
      "문의하려는 상황과 필요한 도움을 간단히 정리해 방문 목적을 말씀해 주세요. 학교별 세부 담당 업무와 처리 절차는 담당 선생님께 확인해 주세요.",
    ],
  },
  admin: {
    summary:
      "학교 운영에 필요한 행정 업무를 담당하는 공간입니다. 각종 행정 절차와 관련된 문의를 안내하고 학교의 원활한 운영을 뒷받침합니다.",
    detail: [
      "행정 문의 안내",
      "처리하려는 업무를 먼저 말씀하시고 필요한 서류와 절차를 안내받으세요. 구체적인 담당 업무와 민원 처리 시간은 학교 안내를 확인해 주세요.",
    ],
  },
  lounge: {
    summary:
      "학생들이 학습과 활동 사이에 잠시 쉬어가는 휴식 공간입니다. 서로를 배려하며 대화를 나누고 다음 일정을 준비할 수 있는 장소입니다.",
    detail: [
      "함께 쓰는 휴식 공간",
      "소음을 줄이고 사용한 자리를 정리하는 등 다른 이용자를 배려해 주세요. 실제 이용 시간과 음식물 관련 기준은 학교 안내를 따라 주세요.",
    ],
  },
  auditorium: {
    summary:
      "학교 행사와 발표, 공연 등 여러 사람이 함께하는 활동을 위한 공간입니다. 배움의 성과를 나누고 학교 구성원들이 한자리에 모이는 역할을 합니다.",
    detail: [
      "행사 참여 안내",
      "행사별 안내에 따라 입장하고 좌석과 이동 통로를 이용해 주세요. 좌석 수, 행사 일정과 사용 신청 방법은 별도 확인이 필요합니다.",
    ],
  },
  media: {
    summary:
      "영상과 이미지 등 디지털 콘텐츠의 기획과 제작을 배우는 실습 공간입니다. 아이디어를 시각적으로 표현하고 결과물을 다듬는 과정을 경험할 수 있습니다.",
    detail: [
      "제작 활동 예시",
      "주제 정하기, 구성안 작성, 촬영·편집, 결과물 공유 등이 일반적인 활동 예시입니다. 실제 사용하는 장비와 프로그램은 수업 안내를 확인해 주세요.",
    ],
  },
  project: {
    summary:
      "함께 아이디어를 발전시키고 결과물을 만들어 가는 협업 공간입니다. 역할을 나누어 문제를 해결하고 서로의 생각을 공유하는 프로젝트 활동에 어울리는 장소입니다.",
    detail: [
      "협업 활동 예시",
      "주제와 목표를 정하고 역할을 분담한 뒤, 진행 상황을 공유하며 결과물을 완성하는 방식으로 활용할 수 있습니다. 실제 운영 중인 프로젝트는 별도 확인이 필요합니다.",
    ],
  },
  ai: {
    summary:
      "인공지능과 데이터 활용의 기초를 배우는 실습 공간입니다. 데이터를 살펴보고 결과를 해석하는 과정을 통해 기술을 이해하고 문제 해결 역량을 키우는 데 초점을 둡니다.",
    detail: [
      "학습 활동 예시",
      "데이터 정리, 특징 비교, 간단한 예측 결과 해석 등이 일반적인 학습 예시입니다. 실제 학교 교육과정과 사용하는 도구는 담당 선생님께 확인해 주세요.",
    ],
  },
  programming: {
    summary:
      "코드를 작성하고 실행하며 소프트웨어의 동작 원리를 익히는 실습 공간입니다. 문제를 작은 단계로 나누고 오류를 수정하면서 아이디어를 프로그램으로 구현하는 과정을 배웁니다.",
    detail: [
      "개발 활동 예시",
      "문제 정의 → 설계 → 코드 작성 → 실행과 수정의 흐름으로 학습할 수 있습니다. 실제 사용하는 언어와 과제는 수업에 따라 다를 수 있습니다.",
    ],
  },
  database: {
    summary:
      "데이터를 체계적으로 저장하고 조회·활용하는 방법을 배우는 실습 공간입니다. 정보의 구조를 이해하고 필요한 데이터를 다루는 프로그래밍 역량을 기르는 데 목적이 있습니다.",
    detail: [
      "학습 주제 예시",
      "데이터 구조 설계, 조건에 맞는 정보 조회, 데이터와 프로그램의 연동 등이 일반적인 학습 주제입니다. 현재 수업 내용과 장비 구성은 학교에 확인해 주세요.",
    ],
  },
  security: {
    summary:
      "컴퓨터와 정보 시스템을 안전하게 활용하기 위한 원리를 배우는 실습 공간입니다. 보안 문제를 이해하고 예방·대응 방법을 익히며 책임 있는 기술 활용 태도를 기르는 데 목적이 있습니다.",
    detail: [
      "보안 학습 안내",
      "실습은 허가된 학습 환경과 범위 안에서 진행하는 것이 기본입니다. 구체적인 실습 주제와 사용 가능한 환경은 담당 선생님의 안내를 확인해 주세요.",
    ],
  },
  lab: {
    summary:
      "이론으로 배운 내용을 직접 적용하며 실무 감각을 익히는 실습 공간입니다. 과제를 수행하고 결과를 확인하는 경험을 통해 문제 해결 능력과 전공 역량을 키우는 장소입니다.",
    detail: [
      "실습 준비 안내",
      "실습 목적과 진행 순서를 미리 확인하고, 필요한 준비물과 장비 사용 방법을 안내받으면 도움이 됩니다. 실제 과목과 장비 목록은 수업에 따라 확인이 필요합니다.",
    ],
  },
};
function spaceType(room) {
  const [id, name] = room;
  if (id === "new-apprenticeship-office") return "apprenticeship";
  if (/teachers-office|security-office/.test(id)) return "office";
  if (/classroom|^main-class/.test(id)) return "classroom";
  if (id === "gym-storage") return "storage";
  if (id === "gym-court") return "gym";
  if (id === "main-office") return "admin";
  if (/library/.test(id)) return "library";
  if (/study/.test(id)) return "study";
  if (/wee/.test(id)) return "wee";
  if (/student-safety/.test(id)) return "safety";
  if (/lounge/.test(id)) return "lounge";
  if (/auditorium/.test(id)) return "auditorium";
  if (/media/.test(id)) return "media";
  if (/project|meeting/.test(id)) return "project";
  if (id === "ai") return "ai";
  if (id === "software") return "programming";
  if (/database/.test(id)) return "database";
  if (/security-lab/.test(id)) return "security";
  return "lab";
}
// 지도 모달과 질문 답변이 같은 용도 설명을 사용합니다. 기존 식별자는 유지합니다.
for (const b of Object.values(BUILDINGS)) {
  for (const [f, rooms] of Object.entries(b.floors)) {
    for (const room of rooms) {
      const profile = SPACE_PROFILES[spaceType(room)];
      room[2] = profile.summary;
      if (room[0] === "new-security-office") {
        room[2] += " 신관 4층 보안과 교무실로 안내된 공간입니다.";
      }
      if (room[3])
        room[2] +=
          " 위치는 " +
          room[3].date +
          " 공지 기준이며 현재 배치는 확인이 필요합니다.";
      if (
        b === BUILDINGS.new &&
        Number(f) <= 3 &&
        room[0] !== "new-apprenticeship-office"
      )
        room[2] += " 이 공간의 명칭과 위치는 시연용 예시입니다.";
    }
  }
}
const $ = (id) => document.getElementById(id);
const show = (id) => {
  $(id).classList.remove("hidden");
  $(id).classList.add("open");
};
const hide = (id) => {
  $(id).classList.add("hidden");
  $(id).classList.remove("open");
};
let building = "main",
  floor = "1",
  selectedClass = null;
function page(name) {
  document.querySelectorAll(".page").forEach((el) => {
    el.classList.add("hidden");
    el.classList.remove("open");
  });
  show(name);
  window.scrollTo(0, 0);
}
document
  .querySelectorAll("[data-page]")
  .forEach((b) => b.addEventListener("click", () => page(b.dataset.page)));
function renderMap() {
  const b = BUILDINGS[building];
  $("building-name").textContent = b.name;
  $("building-desc").textContent = b.desc;
  document
    .querySelectorAll("[data-building]")
    .forEach((x) =>
      x.classList.toggle("active", x.dataset.building === building),
    );
  $("floor-tabs").replaceChildren();
  Object.keys(b.floors).forEach((f) => {
    const x = document.createElement("button");
    x.textContent = f + "층";
    x.dataset.floor = f;
    x.className = f === floor ? "active" : "";
    x.addEventListener("click", () => {
      floor = f;
      renderMap();
    });
    $("floor-tabs").append(x);
  });
  $("class-pins").replaceChildren();
  b.floors[floor].forEach((c, i, arr) => {
    const x = document.createElement("button");
    x.className = "pin";
    x.dataset.class = c[0];
    x.textContent = c[1];
    x.title = c[1];
    x.style.left = (arr.length === 1 ? 50 : 18 + (i % 3) * 31) + "%";
    x.style.top =
      (arr.length === 1 ? 45 : arr.length > 3 && i >= 3 ? 66 : 38) + "%";
    x.addEventListener("click", () => openClass(c));
    $("class-pins").append(x);
  });
  $("school-map").alt = b.name + " " + floor + "층 교실 배치 예시";
}
document.querySelectorAll("[data-building]").forEach((b) =>
  b.addEventListener("click", () => {
    building = b.dataset.building;
    floor = Object.keys(BUILDINGS[building].floors)[0];
    renderMap();
  }),
);
function openClass(c) {
  selectedClass = c;
  $("class-name").textContent = c[1];
  $("class-desc").textContent = c[2];
  $("ask-input").value = "";
  $("answer").textContent =
    "교실 안내입니다. 용도나 위치를 물어보세요. (AI 생성 아님)";
  hide("ask-error");
  show("class-modal");
  $("ask-input").focus();
}
function closeModal() {
  hide("class-modal");
}
$("modal-close-btn").addEventListener("click", closeModal);
$("class-modal").addEventListener("click", (e) => {
  if (e.target === $("class-modal")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
$("view-3d-btn").addEventListener("click", () => {
  if (!selectedClass) return;
  closeModal();
  $("classroom-title").textContent = selectedClass[1];
  showClassroomMedia(selectedClass[0]);
  page("classroom-view");
});
$("back-btn").addEventListener("click", () => {
  stopClassroomMedia();
  page("explore");
});
// 영상이 등록된 교실은 영상을, 없으면 기존 안내 영역을 보여줍니다.
function showClassroomMedia(id) {
  const stage = $("classroom-3d");
  const path = CLASSROOM_VIDEO[id];
  stage.replaceChildren();
  hide("classroom-error");
  if (!path) {
    const box = document.createElement("div");
    box.className = "placeholder";
    const mark = document.createElement("span");
    mark.textContent = "◈";
    const title = document.createElement("h2");
    title.textContent = "준비 중인 공간";
    const text = document.createElement("p");
    text.textContent = "이 교실의 둘러보기 영상은 아직 등록되지 않았습니다.";
    box.append(mark, title, text);
    stage.append(box);
    return;
  }
  const video = document.createElement("video");
  video.id = "classroom-video";
  video.src = API_BASE + path;
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.loop = true;
  video.controls = true;
  video.playsInline = true;
  video.preload = "auto";
  video.setAttribute("aria-label", "교실 둘러보기 영상 (소리 없음)");
  video.addEventListener("error", () => {
    $("classroom-error").textContent =
      "영상을 불러오지 못했습니다. 백엔드가 " +
      API_BASE +
      " 에서 실행 중인지 확인하세요.";
    show("classroom-error");
  });
  stage.append(video);
  video.play().catch(() => {});
}
function stopClassroomMedia() {
  const video = document.getElementById("classroom-video");
  if (video) video.pause();
}
// 등록 정보로 질문 의도를 구분합니다. 실제 생성형 AI 호출은 하지 않습니다.
function classroomGuide(classroom, question) {
  const q = question.replace(/\s/g, "").toLowerCase();
  const all = [];
  for (const b of Object.values(BUILDINGS)) {
    for (const [floor, rooms] of Object.entries(b.floors)) {
      for (const room of rooms)
        all.push({ room, building: b.name, floor, rooms });
    }
  }
  let target = all.find((item) => item.room[0] === classroom[0]);
  // 선택한 교실 외에 이름을 명시한 공간도 검색합니다.
  const matches = all.filter((item) =>
    q.includes(item.room[1].replace(/\s/g, "").toLowerCase()),
  );
  if (matches.length) {
    const inBuilding = matches.filter((item) => q.includes(item.building));
    const inFloor = (inBuilding.length ? inBuilding : matches).filter((item) =>
      q.includes(item.floor + "층"),
    );
    const candidates = inFloor.length
      ? inFloor
      : inBuilding.length
        ? inBuilding
        : matches;
    if (candidates.length > 1) {
      return {
        title: "어느 공간을 찾으시나요?",
        summary:
          "같은 이름의 공간이 여러 곳에 있어요. 건물과 층을 함께 알려주시면 정확히 안내할게요.",
        sections: [
          {
            title: "등록된 위치",
            text: candidates
              .map(
                (item) =>
                  item.building + " " + item.floor + "층 · " + item.room[1],
              )
              .join("\n"),
          },
        ],
        suggestions: candidates
          .slice(0, 3)
          .map(
            (item) =>
              item.building + " " + item.floor + "층 " + item.room[1] + " 위치",
          ),
      };
    }
    target = candidates[0];
  }
  const [id, name, description] = target.room;
  const location = target.building + " " + target.floor + "층";
  const route =
    "학교 탐험 → " + target.building + " → " + target.floor + "층 → " + name;
  const others = target.rooms
    .filter((room) => room[0] !== id)
    .map((room) => room[1]);
  const sections = [];
  const add = (title, text) => sections.push({ title, text });
  const reference = target.room[3];
  if (reference)
    sections.push({
      title: "자료 시점",
      text:
        reference.date +
        " 보안과 포털 공지 기준입니다. 현재 위치·명칭과 전체 층수는 확인되지 않았습니다.",
      url: reference.url,
    });
  const subject = location + " " + name;
  const suggestions = [
    subject + " 소개",
    subject + " 위치",
    subject + " 이용 방법",
  ];
  let title = name + " 안내",
    summary = description;
  let recognized = false;
  if (target.building === "신관" && /몇층까지|층수|총.*층|전체층/.test(q)) {
    recognized = true;
    summary =
      "공개된 과거 공지에서 신관 4층과 5층의 시설을 확인했습니다. 건물의 정확한 전체 층수는 확인하지 못했습니다.";
    add(
      "현재 지도 구성",
      "1층 도제교육부는 사용자 제공 위치를 반영했고, 4~5층은 과거 공지에 명시된 공간을 반영했습니다. 1~3층의 나머지 공간은 기존 가상 예시입니다. 표시된 탭 수가 실제 건물의 전체 층수를 뜻하지는 않습니다.",
    );
  }
  if (/안녕|반가/.test(q)) {
    recognized = true;
    summary =
      "안녕하세요! " +
      name +
      "에 대해 궁금한 내용을 물어보세요. 공간 소개부터 위치와 이용 전 확인 사항까지 안내해 드릴게요.";
  }
  if (
    /위치|어디|몇층|가는|찾아/.test(q) &&
    !(target.building === "신관" && /몇층까지|층수|총.*층|전체층/.test(q))
  ) {
    recognized = true;
    summary = name + "의 등록 위치는 " + location + "입니다.";
    add("화면에서 찾아가기", route);
    add(
      "방문 전 참고",
      "이 경로는 화면에서 공간을 찾는 순서입니다. 실제 출입구와 계단·엘리베이터 위치는 학교 안내도를 확인해 주세요.",
    );
  }
  if (
    /같은층|다른교실|옆|주변|몇개|몇실/.test(q) &&
    !/장비|컴퓨터|기자재/.test(q)
  ) {
    recognized = true;
    summary =
      location + "에는 " + target.rooms.length + "개 공간이 등록되어 있습니다.";
    add("같은 층 공간", target.rooms.map((room) => room[1]).join(" · "));
    if (id === "info-auditorium" || id === "info-classroom-4") {
      add(
        "공간 관계",
        "정보관 4층에는 강당과 그 옆 일반교실이 등록되어 있습니다.",
      );
    } else {
      add(
        "배치 안내",
        "같은 층에 있다는 정보이며, 실제로 바로 옆에 있는지나 좌우 순서는 확인되지 않았습니다.",
      );
    }
  }
  if (/시간|언제|예약|신청|이용|개방|운영|들어가|사용/.test(q)) {
    recognized = true;
    add(
      "이용 전 확인할 사항",
      "운영 시간과 예약·방문 절차는 아직 등록되어 있지 않습니다. 원하는 날짜와 시간, 방문 목적을 담당 선생님께 말씀드리고 이용 가능한지 확인해 주세요.",
    );
    add(
      "이렇게 문의해 보세요",
      "“" +
        name +
        "을 이용하고 싶은데, 가능한 시간과 사전 신청 방법을 알려주실 수 있나요?”",
    );
  }
  if (/장비|기자재|시설|준비물|몇대|컴퓨터.*대/.test(q)) {
    recognized = true;
    add(
      "장비와 준비물",
      "정확한 장비 목록과 수량은 등록되어 있지 않습니다. 방문 전에 필요한 준비물이나 계정·프로그램이 있는지 확인하면 좋습니다.",
    );
  }
  if (/3d|둘러|교실보기/.test(q)) {
    recognized = true;
    add(
      "공간 둘러보기",
      "“3D 교실 보기”는 현재 선택한 교실의 전용 화면을 엽니다. 현재는 모델 연결 공간만 준비되어 있으며 실제 내부 모습은 제공되지 않습니다.",
    );
    if (id !== classroom[0])
      add(
        "먼저 공간 선택",
        "지금 질문하신 공간과 선택된 교실이 다릅니다. 지도에서 " +
          name +
          "을 먼저 선택해 주세요.",
      );
  }
  if (
    /무엇|뭐|어떤|하는|배우|수업|설명|소개|자세|상세/.test(q) ||
    !recognized
  ) {
    const detail = SPACE_PROFILES[spaceType(target.room)].detail;
    add(...detail);
    if (
      !recognized &&
      !/무엇|뭐|어떤|하는|배우|수업|설명|소개|자세|상세/.test(q)
    ) {
      summary =
        "질문하신 내용에 대한 별도 정보는 없지만, " +
        name +
        "의 등록된 내용을 정리해 드릴게요.";
    }
  }
  if (!sections.some((section) => section.title === "화면에서 찾아가기"))
    add("위치", location + "\n" + route);
  if (
    others.length &&
    !sections.some((section) => section.title === "같은 층 공간")
  )
    add("같은 층에서 함께 살펴보기", others.join(" · "));
  return { title, summary, sections, suggestions };
}
function renderGuide(result) {
  const container = $("answer");
  container.replaceChildren();
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  };
  container.append(
    element("span", "guide-badge", "CAMPUS GUIDE · 등록 정보 안내"),
  );
  container.append(element("h3", "guide-title", result.title));
  container.append(element("p", "guide-summary", result.summary));
  for (const section of result.sections) {
    const block = element("section", "guide-section", "");
    block.append(
      element("h4", "", section.title),
      element("p", "", section.text),
    );
    if (section.url) {
      const link = element("a", "guide-source", "근거 공지 보기 ↗");
      link.href = section.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      block.append(link);
    }
    container.append(block);
  }
  const followups = element("div", "guide-suggestions", "");
  for (const question of result.suggestions) {
    const button = element("button", "guide-suggestion", question + " ↗");
    button.type = "button";
    button.addEventListener("click", () => {
      $("ask-input").value = question;
      $("ask-btn").click();
    });
    followups.append(button);
  }
  container.append(
    followups,
    element(
      "small",
      "guide-note",
      "등록된 정보로 구성한 안내이며 AI 생성 답변은 아닙니다. 지도 배치와 일부 공간 정보는 예시입니다.",
    ),
  );
}
$("ask-btn").addEventListener("click", async () => {
  const q = $("ask-input").value.trim();
  hide("ask-error");
  if (!q) {
    $("ask-error").textContent = "질문을 입력하세요.";
    show("ask-error");
    $("ask-input").focus();
    return;
  }
  if (!selectedClass) {
    $("ask-error").textContent = "지도에서 교실을 먼저 선택해 주세요.";
    show("ask-error");
    return;
  }
  const classId = BACKEND_CLASS[selectedClass[0]];
  if (!classId) {
    renderGuide(classroomGuide(selectedClass, q));
    return;
  }
  show("ask-loading");
  $("ask-btn").disabled = true;
  try {
    const res = await fetch(API_BASE + "/api/guide/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId, question: q }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "답변을 받지 못했습니다.");
    $("answer").replaceChildren();
    const p = document.createElement("p");
    p.textContent = data.answer;
    const note = document.createElement("small");
    note.className = "guide-note";
    note.textContent = "AI가 생성한 답변입니다.";
    $("answer").append(p, note);
  } catch (e) {
    $("ask-error").textContent =
      e.message === "Failed to fetch"
        ? "백엔드에 연결할 수 없습니다. 등록된 정보로 안내합니다."
        : e.message + " 등록된 정보로 안내합니다.";
    show("ask-error");
    renderGuide(classroomGuide(selectedClass, q));
  } finally {
    hide("ask-loading");
    $("ask-btn").disabled = false;
  }
});
$("ask-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.isComposing) {
    e.preventDefault();
    $("ask-btn").click();
  }
});
$("photo-input").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    $("create-error").textContent = "이미지를 선택하세요.";
    show("create-error");
    return;
  }
  hide("create-error");
  const reader = new FileReader();
  reader.onload = () => {
    $("photo-preview").src = reader.result;
    show("photo-preview");
  };
  reader.readAsDataURL(file);
});
$("create-btn").addEventListener("click", async () => {
  const file = $("photo-input").files[0];
  const description = $("photo-desc").value.trim();
  hide("create-error");
  if (!file) {
    $("create-error").textContent = "사진을 먼저 선택하세요.";
    show("create-error");
    return;
  }
  if (!description) {
    $("create-error").textContent = "사진 한 줄 설명을 입력하세요.";
    show("create-error");
    $("photo-desc").focus();
    return;
  }
  const form = new FormData();
  form.append("description", description);
  form.append("photo", file);
  show("create-loading");
  $("create-btn").disabled = true;
  try {
    const res = await fetch(API_BASE + "/api/oneshot", {
      method: "POST",
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "생성에 실패했습니다.");
    renderOneshot(data);
  } catch (e) {
    $("create-error").textContent =
      e.message === "Failed to fetch"
        ? "백엔드에 연결할 수 없습니다. 서버가 " +
          API_BASE +
          " 에서 실행 중인지 확인하세요."
        : e.message;
    show("create-error");
  } finally {
    hide("create-loading");
    $("create-btn").disabled = false;
  }
});
function renderOneshot(data) {
  const pad = (n) => String(n).padStart(2, "0");
  const list = (container, rows, label, key, title) => {
    container.replaceChildren();
    for (const row of rows) {
      const item = document.createElement("article");
      item.className = "result-item";
      const tag = document.createElement("span");
      tag.textContent = label + " " + pad(row[key]);
      item.append(tag);
      if (title && row[title]) {
        const h = document.createElement("strong");
        h.textContent = row[title];
        item.append(h);
      }
      const p = document.createElement("p");
      p.textContent = title ? row.body : row.visual + " — " + row.caption;
      item.append(p);
      container.append(item);
    }
  };
  list($("storyboard"), data.storyboard, "SCENE", "scene", null);
  list($("cards"), data.cardNews, "CARD", "page", "title");
  $("hashtags").replaceChildren();
  for (const tag of data.hashtags) {
    const span = document.createElement("span");
    span.textContent = tag;
    $("hashtags").append(span);
  }
}
renderMap();
