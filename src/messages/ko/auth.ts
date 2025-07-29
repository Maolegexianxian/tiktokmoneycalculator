export const auth = {
  title: "인증",
  description: "TikTok 수익 계산기 대시보드와 저장된 계산에 액세스하려면 로그인하세요.",
  backToHome: "홈으로 돌아가기",
  brandTitle: "TikTok 머니 계산기",
  brandSubtitle: "크리에이터 수익 계산",
  brandDescription: "고급 계산기로 TikTok 크리에이터로서의 잠재 수익을 추정하세요.",
  whyChooseUs: "우리를 선택하는 이유",
  
  features: {
    calculator: {
      title: "고급 계산기",
      description: "실제 데이터를 기반으로 한 정확한 수익 계산"
    },
    secure: {
      title: "안전하고 비공개",
      description: "업계 표준 보안으로 데이터가 보호됩니다"
    },
    community: {
      title: "크리에이터 커뮤니티",
      description: "수익을 극대화하는 수천 명의 크리에이터와 함께하세요"
    },
    fast: {
      title: "번개처럼 빠름",
      description: "즉시 결과와 인사이트를 얻으세요"
    }
  },
  
  signin: {
    title: "로그인",
    subtitle: "TikTok 머니 계산기에 다시 오신 것을 환영합니다",
    socialSignin: {
      title: "빠른 로그인"
    },
    form: {
      signInWith: "{provider}로 로그인",
      signUpWith: "{provider}로 가입",
      connecting: "연결 중...",
      email: {
        label: "이메일",
        placeholder: "이메일을 입력하세요"
      },
      password: {
        label: "비밀번호",
        placeholder: "비밀번호를 입력하세요"
      },
      rememberMe: "로그인 상태 유지",
      forgotPassword: "비밀번호를 잊으셨나요?",
      signIn: "로그인",
      signingIn: "로그인 중...",
      noAccount: "계정이 없으신가요?",
      signUpLink: "여기서 가입하세요"
    },
    or: "또는",
    emailSignin: {
      title: "이메일로 로그인"
    },
    noAccount: {
      text: "계정이 없으신가요?",
      signUp: "여기서 가입하세요"
    },
    forgotPassword: "비밀번호를 잊으셨나요?",
    social: {
      benefits: {
        title: "독점 혜택을 위해 로그인하세요",
        fast: "번개처럼 빠른 계산",
        secure: "은행 수준의 보안",
        noPassword: "비밀번호 불필요"
      }
    },
    orContinueWith: "또는 다음으로 계속",
    google: "Google로 계속",
    github: "GitHub로 계속",
    messages: {
      emailVerified: "이메일이 성공적으로 인증되었습니다! 이제 로그인할 수 있습니다."
    },
    benefits: {
      title: "계정으로 할 수 있는 것들",
      saveCalculations: "계산 결과 저장",
      viewHistory: "계산 기록 보기",
      personalDashboard: "개인 대시보드 액세스",
      exportData: "데이터 보고서 내보내기"
    },
    security: {
      notice: "귀하의 데이터는 업계 표준 암호화 및 SSL 보안으로 보호됩니다",
      protected: "귀하의 데이터는 업계 표준 암호화로 보호됩니다",
      emailVerification: "이메일 인증됨"
    }
  },
  
  signUp: {
    title: "가입",
    subtitle: "시작하려면 계정을 만드세요",
    name: {
      label: "전체 이름",
      placeholder: "전체 이름을 입력하세요"
    },
    email: {
      label: "이메일",
      placeholder: "이메일을 입력하세요"
    },
    password: {
      label: "비밀번호",
      placeholder: "비밀번호를 만드세요"
    },
    confirmPassword: {
      label: "비밀번호 확인",
      placeholder: "비밀번호를 확인하세요"
    },
    agreeToTerms: "이용약관 및 개인정보처리방침에 동의합니다",
    submit: "계정 만들기",
    hasAccount: "이미 계정이 있으신가요?",
    signInLink: "여기서 로그인하세요",
    orContinueWith: "또는 다음으로 계속",
    google: "Google로 계속",
    github: "GitHub로 계속"
  },
  
  forgotPassword: {
    title: "비밀번호 재설정",
    subtitle: "재설정 지침을 받으려면 이메일을 입력하세요",
    email: {
      label: "이메일",
      placeholder: "이메일을 입력하세요"
    },
    submit: "재설정 링크 보내기",
    backToSignIn: "로그인으로 돌아가기",
    checkEmail: "재설정 지침을 위해 이메일을 확인하세요"
  },
  
  errors: {
    invalidCredentials: "잘못된 이메일 또는 비밀번호",
    emailRequired: "이메일이 필요합니다",
    passwordRequired: "비밀번호가 필요합니다",
    nameRequired: "이름이 필요합니다",
    passwordMismatch: "비밀번호가 일치하지 않습니다",
    emailInvalid: "유효한 이메일을 입력하세요",
    passwordTooShort: "비밀번호는 최소 8자 이상이어야 합니다",
    termsRequired: "약관에 동의해야 합니다",
    signInError: "로그인에 실패했습니다. 다시 시도하세요.",
    signUpError: "계정 생성에 실패했습니다. 다시 시도하세요.",
    emailNotVerified: "이메일이 인증되지 않았습니다. 이메일을 확인하고 인증 링크를 클릭하세요",
    accountNotLinked: "이 이메일은 이미 다른 계정에 연결되어 있습니다",
    oauthNotLinked: "OAuth 계정이 연결되지 않았습니다",
    emailSignin: "이메일 로그인에 실패했습니다",
    callback: "콜백 오류",
    oauthCallback: "OAuth 콜백 오류",
    oauthCreateAccount: "OAuth 계정 생성에 실패했습니다",
    sessionRequired: "로그인이 필요합니다",
    socialSignIn: "소셜 로그인에 실패했습니다. 다시 시도하세요.",
    general: "오류가 발생했습니다. 다시 시도하세요.",
    default: "로그인 중 알 수 없는 오류가 발생했습니다. 다시 시도하세요"
  },
  
  success: {
    signedIn: "성공적으로 로그인되었습니다!",
    signedUp: "계정이 성공적으로 생성되었습니다!",
    passwordReset: "비밀번호 재설정 이메일이 전송되었습니다!"
  },
  
  stats: {
    users: "1만+",
    calculations: "10만+",
    accuracy: "99%"
  },
  
  testimonial: {
    quote: "이 계산기는 제 진정한 수익 잠재력을 이해하고 더 나은 브랜드 거래를 협상하는 데 도움이 되었습니다. 추정치가 놀랍도록 정확합니다!",
    author: "Sarah Chen",
    role: "콘텐츠 크리에이터"
  },
  
  legal: {
    privacy: "개인정보처리방침",
    terms: "이용약관",
    cookies: "쿠키 정책"
  },
  
  help: {
    needHelp: "도움이 필요하신가요?",
    contactSupport: "지원팀 문의"
  }
} as const;