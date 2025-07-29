export const common = {
  actions: {
    save: "저장",
    cancel: "취소",
    delete: "삭제",
    edit: "편집",
    view: "보기",
    share: "공유",
    copy: "복사",
    download: "다운로드",
    upload: "업로드",
    submit: "제출",
    reset: "재설정",
    clear: "지우기",
    close: "닫기",
    open: "열기",
    next: "다음",
    previous: "이전",
    back: "뒤로",
    continue: "계속",
    confirm: "확인",
    loading: "로딩 중...",
    retry: "다시 시도"
  },
  
  status: {
    success: "성공",
    error: "오류",
    warning: "경고",
    info: "정보",
    pending: "대기 중",
    completed: "완료됨",
    failed: "실패",
    active: "활성",
    inactive: "비활성",
    draft: "초안",
    published: "게시됨"
  },
  
  time: {
    now: "지금",
    today: "오늘",
    yesterday: "어제",
    tomorrow: "내일",
    thisWeek: "이번 주",
    lastWeek: "지난 주",
    thisMonth: "이번 달",
    lastMonth: "지난 달",
    thisYear: "올해",
    lastYear: "작년",
    minute: "분",
    minutes: "분",
    hour: "시간",
    hours: "시간",
    day: "일",
    days: "일",
    week: "주",
    weeks: "주",
    month: "월",
    months: "월",
    year: "년",
    years: "년",
    ago: "전"
  },
  
  validation: {
    required: "이 필드는 필수입니다",
    invalid: "잘못된 값",
    tooShort: "너무 짧습니다",
    tooLong: "너무 깁니다",
    invalidEmail: "잘못된 이메일 주소",
    invalidUrl: "잘못된 URL",
    invalidNumber: "잘못된 숫자",
    mustBePositive: "양수여야 합니다",
    mustBeGreaterThan: "{min}보다 커야 합니다",
    mustBeLessThan: "{max}보다 작아야 합니다"
  },
  
  messages: {
    noData: "사용 가능한 데이터가 없습니다",
    noResults: "결과를 찾을 수 없습니다",
    searchPlaceholder: "검색...",
    selectOption: "옵션을 선택하세요",
    copiedToClipboard: "클립보드에 복사됨",
    shareError: "공유 실패",
    saveError: "저장 실패",
    loadError: "로드 실패",
    networkError: "네트워크 오류. 연결을 확인해 주세요.",
    unexpectedError: "예상치 못한 오류가 발생했습니다"
  },
  
  error: {
    systemError: "시스템 오류가 발생했습니다",
    description: "죄송합니다. 애플리케이션에서 예상치 못한 오류가 발생했습니다. 이 문제를 기록했으며 수정을 위해 노력하고 있습니다.",
    details: "오류 세부사항:",
    errorId: "오류 ID:",
    suggestions: "다음을 시도해 보세요:",
    refreshPage: "페이지 새로고침",
    goHome: "홈으로 돌아가기",
    contactSupport: "문제가 지속되면 기술 지원팀에 문의하세요",
    retry: "다시 시도",
    backToHome: "홈으로 돌아가기"
  },
  
  currency: {
    usd: "USD",
    eur: "EUR",
    gbp: "GBP",
    cny: "CNY",
    jpy: "JPY",
    krw: "KRW"
  },
  
  units: {
    k: "K",
    m: "M",
    b: "B",
    percent: "%",
    perMonth: "월간",
    perYear: "연간",
    perVideo: "동영상당"
  },
  
  metrics: {
    followers: "팔로워",
    engagement: "참여도",
    views: "조회수",
    likes: "좋아요",
    comments: "댓글",
    shares: "공유",
    subscribers: "구독자",
    watchTime: "시청 시간"
  },

  languageSwitcher: {
    english: "영어",
    chinese: "중국어",
    spanish: "스페인어",
    french: "프랑스어",
    german: "독일어",
    japanese: "일본어",
    korean: "한국어"
  },

  test: {
    quickTest: "빠른 테스트",
    inputParameters: "입력 매개변수",
    followers: "팔로워 수",
    avgViews: "평균 조회수",
    calculating: "계산 중...",
    startCalculation: "계산 시작",
    error: "오류",
    results: "계산 결과",
    monthlyEarnings: "월 수입",
    yearlyEarnings: "연 수입",
    perPostEarnings: "게시물당 수입",
    perThousandViewsEarnings: "천 조회수당 수입",
    breakdown: "수입 세부사항",
    creatorFund: "크리에이터 펀드",
    brandPartnerships: "브랜드 파트너십",
    liveGifts: "라이브 선물",
    affiliateMarketing: "제휴 마케팅",
    merchandise: "상품 판매",
   other: "기타"
  },
  simpleTest: {
    title: "간단한 테스트 페이지",
    description: "이 페이지는 계산기의 기본 기능을 테스트하는 데 사용됩니다. 기본 정보를 입력하고 계산 버튼을 클릭하세요.",
    calculationError: "계산 오류:",
    unknownError: "알 수 없는 오류"
  }
} as const;