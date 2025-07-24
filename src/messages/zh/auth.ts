export const auth = {
  title: "身份验证",
  description: "登录以访问您的 TikTok 收益计算器仪表板和保存的计算结果。",
  backToHome: "返回首页",
  brandTitle: "TikTok 收益计算器",
  brandSubtitle: "计算您的创作者收益",
  brandDescription: "使用我们的高级计算器估算您作为 TikTok 创作者的潜在收益。",
  whyChooseUs: "为什么选择我们",
  
  features: {
    calculator: {
      title: "高级计算器",
      description: "基于真实数据的精确收益计算"
    },
    secure: {
      title: "安全私密",
      description: "您的数据受到行业标准安全保护"
    },
    community: {
      title: "创作者社区",
      description: "加入数千名创作者，最大化您的收益"
    },
    fast: {
      title: "闪电般快速",
      description: "获得即时结果和洞察"
    }
  },
  signin: {
    title: "登录",
    subtitle: "欢迎回到 TikTok 收益计算器",
    socialSignin: {
      title: "快速登录"
    },
    form: {
      signInWith: "使用 {provider} 登录",
      signUpWith: "使用 {provider} 注册",
      connecting: "连接中...",
      email: {
        label: "邮箱",
        placeholder: "请输入您的邮箱"
      },
      password: {
        label: "密码",
        placeholder: "请输入您的密码"
      },
      rememberMe: "记住我",
      forgotPassword: "忘记密码？",
      signIn: "登录",
      signingIn: "登录中...",
      noAccount: "还没有账户？",
      signUpLink: "立即注册"
    },
    or: "或者",
    emailSignin: {
      title: "使用邮箱登录"
    },
    noAccount: {
      text: "还没有账户？",
      signUp: "立即注册"
    },
    forgotPassword: "忘记密码？",
    social: {
      benefits: {
        title: "登录享受专属权益",
        fast: "闪电般快速计算",
        secure: "银行级安全保护",
        noPassword: "无需密码"
      }
    },
    orContinueWith: "或使用其他方式登录",
    google: "使用 Google 登录",
    github: "使用 GitHub 登录",
    messages: {
      emailVerified: "邮箱验证成功！您现在可以登录了。"
    },
    benefits: {
      title: "登录后您可以",
      saveCalculations: "保存计算结果",
      viewHistory: "查看历史记录",
      personalDashboard: "访问个人仪表板",
      exportData: "导出数据报告"
    },
    security: {
      notice: "您的数据受到行业标准加密和 SSL 安全保护",
      protected: "您的数据受到 SSL 加密保护",
      emailVerification: "邮箱验证"
    }
  },
  
  signup: {
    title: "注册",
    subtitle: "创建您的账户以开始使用",
    name: {
      label: "全名",
      placeholder: "请输入您的全名"
    },
    email: {
      label: "邮箱",
      placeholder: "请输入您的邮箱"
    },
    password: {
      label: "密码",
      placeholder: "创建一个密码"
    },
    confirmPassword: {
      label: "确认密码",
      placeholder: "请确认您的密码"
    },
    agreeToTerms: "我同意服务条款和隐私政策",
    submit: "创建账户",
    hasAccount: "已经有账户了？",
    signInLink: "在此登录",
    orContinueWith: "或使用其他方式注册",
    google: "使用 Google 注册",
    github: "使用 GitHub 注册"
  },
  
  forgotPassword: {
    title: "重置密码",
    subtitle: "请输入您的邮箱以接收重置说明",
    email: {
      label: "邮箱",
      placeholder: "请输入您的邮箱"
    },
    submit: "发送重置链接",
    backToSignIn: "返回登录",
    checkEmail: "请检查您的邮箱以获取重置说明"
  },
  
  errors: {
    invalidCredentials: "无效的邮箱或密码",
    emailRequired: "邮箱是必填项",
    passwordRequired: "密码是必填项",
    nameRequired: "姓名是必填项",
    passwordMismatch: "密码不匹配",
    emailInvalid: "请输入有效的邮箱地址",
    passwordTooShort: "密码长度至少为8个字符",
    termsRequired: "您必须同意服务条款",
    signInError: "登录失败，请重试。",
    signUpError: "创建账户失败，请重试。",
    emailNotVerified: "邮箱未验证，请检查您的邮箱并点击验证链接",
    accountNotLinked: "该邮箱已与其他账户关联",
    oauthNotLinked: "OAuth 账户未关联",
    emailSignin: "邮箱登录失败",
    callback: "回调错误",
    oauthCallback: "OAuth 回调错误",
    oauthCreateAccount: "OAuth 创建账户失败",
    sessionRequired: "需要登录",
    default: "登录时发生未知错误，请重试"
  },
  
  success: {
    signedIn: "登录成功！",
    signedUp: "账户创建成功！",
    passwordReset: "密码重置邮件已发送！"
  },
  
  stats: {
    users: "10K+",
    calculations: "100K+",
    accuracy: "99%"
  },
  
  testimonial: {
    quote: "这个计算器帮助我了解了真正的收益潜力，并协商了更好的品牌合作。估算结果非常准确！",
    author: "陈莎拉",
    role: "内容创作者"
  },
  
  legal: {
    privacy: "隐私政策",
    terms: "服务条款",
    cookies: "Cookie 政策"
  },
  
  help: {
    needHelp: "需要帮助？",
    contactSupport: "联系客服"
  }
} as const;