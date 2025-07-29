export const faq = {
  badge: "FAQ",
  title: "자주 묻는 질문",
  subtitle: "TikTok 수익 계산기에 대한 일반적인 질문에 대한 답변을 찾아보세요",
  
  categories: {
    all: "전체",
    general: "일반",
    earnings: "수익",
    technical: "기술",
    pricing: "가격",
    privacy: "개인정보",
    support: "지원"
  },
  
  questions: {
    accuracy: {
      question: "수익 추정치는 얼마나 정확한가요?",
      answer: "저희 추정치는 업계 데이터와 실제 크리에이터 수익을 기반으로 합니다. 정확성을 위해 노력하지만, 실제 수익은 관객 참여도, 콘텐츠 품질, 시장 조건 등 많은 요인에 따라 달라질 수 있습니다."
    },
    requirements: {
      question: "이 계산기를 사용하기 위한 요구사항은 무엇인가요?",
      answer: "팔로워 수와 참여율만 입력하면 됩니다. 기본 계산에는 계정 생성이 필요하지 않지만, 계정을 만들면 결과를 저장할 수 있습니다."
    },
    revenue: {
      question: "이 계산기에는 어떤 수익원이 포함되나요?",
      answer: "저희 계산기는 관객 규모와 참여도를 기반으로 브랜드 파트너십, 크리에이터 펀드, 라이브 선물, 제휴 마케팅, 상품 판매로부터의 수익을 추정합니다."
    },
    frequency: {
      question: "계산을 얼마나 자주 업데이트해야 하나요?",
      answer: "가장 정확한 추정치를 얻기 위해 월별로 또는 팔로워 수나 참여율에 상당한 변화가 있을 때마다 계산을 업데이트하는 것을 권장합니다."
    },
    improve: {
      question: "수익 잠재력을 어떻게 향상시킬 수 있나요?",
      answer: "참여율 증가, 일관된 게시, 수익성 있는 틈새 선택, 진정한 관객 관계 구축, 수익화 전략 다양화에 집중하세요."
    },
    howMuchEarn: {
      question: "TikTok 크리에이터는 게시물당 얼마나 벌까요?",
      answer: "게시물당 수익은 매우 다양합니다. 5만~50만 팔로워를 가진 크리에이터는 일반적으로 스폰서 TikTok 게시물당 약 $80~$1,650을 벌어들입니다. 톱 인플루언서는 훨씬 더 많이 벌 수 있습니다. 프로필 지표를 기반으로 잠재 수익을 추정하려면 TikTok 머니 계산기를 사용하세요."
    },
    creatorFund: {
      question: "TikTok 크리에이터 펀드는 어떻게 작동하나요?",
      answer: "TikTok 크리에이터 펀드는 조회수 1,000회당 약 $0.02~$0.04를 지급합니다. 수익은 동영상 성과, 지역, 참여도에 따라 달라집니다. 계산기는 수익 예측에 크리에이터 펀드 추정치를 반영합니다."
    }
  },
  
  contact: {
    title: "여전히 질문이 있으신가요?",
    description: "개인화된 지원을 위해 지원팀에 문의하세요",
    email: "이메일 지원",
    chat: "라이브 채팅"
  },
  
  stats: {
    responseTime: {
      number: "< 2시간",
      label: "응답 시간"
    },
    satisfaction: {
      number: "98%",
      label: "만족도"
    },
    resolved: {
      number: "99%",
      label: "해결된 문제"
    }
  }
} as const;