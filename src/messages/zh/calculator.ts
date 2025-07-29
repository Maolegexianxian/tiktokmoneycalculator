export const calculator = {
  title: "TikTok收益计算器 - 免费估算创作者收入",
  subtitle: "选择您的平台并输入数据以获得准确的TikTok收益估算和变现潜力分析",
  description: "免费TikTok收益计算器，快速估算您的TikTok创作者收入潜力，支持多平台收益分析和品牌合作收入预测",
  platforms: {
    instagram: {
      title: "Instagram",
      description: "通过 Instagram 平台的品牌合作和广告获得收益"
    },
    youtube: {
      title: "YouTube",
      description: "通过 YouTube 视频广告和频道会员获得收益"
    },
    tiktok: {
      title: "TikTok",
      description: "通过 TikTok 创作者基金、直播礼物和品牌合作获得收益"
    }
  },
  features: [
    "多平台收益估算",
    "详细的收益来源分析",
    "用户友好的界面",
    "实时数据更新"
  ],
  form: {
    title: "TikTok收益计算器 - 创作者收入估算工具",
    description: "输入您的TikTok粉丝数、互动率等关键指标，精准估算通过创作者基金、品牌合作、直播礼物等变现方式的潜在收益。"
  },
  stats: {
    users: "用户数",
    accuracy: "准确率",
    calculations: "计算次数"
  },
  platforms: {
    tiktok: {
      description: "通过TikTok创作者基金、品牌合作、直播礼物和联盟营销获得收益，使用TikTok收益计算器估算您的创作者收入",
      badge: "热门"
    },
    instagram: {
      description: "通过 Instagram 品牌合作和广告获得收益",
      badge: "趋势"
    },
    youtube: {
      description: "通过 YouTube 视频广告和频道会员获得收益",
      badge: "稳定"
    }
  },
  actions: {
    compare: "平台对比",
    simulate: "收益模拟器"
  },
  tiktok: {
    sections: {
      basic: {
        title: "基本信息",
        description: "请输入您的 TikTok 账号基础信息。"
      },
      profile: {
        title: "个人资料信息",
        description: "帮助我们提供更准确的估算"
      },
      advanced: {
        title: "高级设置",
        description: "配置高级选项以获得更精确的结果。"
      }
    },
    fields: {
      followers: {
        label: "粉丝数",
        placeholder: "输入您的粉丝数量"
      },
      avgViews: {
        label: "视频平均观看次数",
        placeholder: "输入平均观看次数"
      },
      avgLikes: {
        label: "视频平均点赞数",
        placeholder: "输入平均点赞数"
      },
      avgComments: {
        label: "视频平均评论数",
        placeholder: "输入平均评论数"
      },
      avgShares: {
        label: "视频平均分享数",
        placeholder: "输入平均分享数"
      },
      postFrequency: {
        label: "发布频率（每周）",
        placeholder: "输入每周发布视频数量"
      },
      accountAge: {
        label: "账号年龄（月）",
        placeholder: "输入账号创建月数"
      },
      contentNiche: {
        label: "内容领域",
        placeholder: "请选择您的内容领域"
      },
      audienceLocation: {
        label: "观众位置",
        placeholder: "请选择您的观众位置"
      }
    },
    engagement: {
      title: "互动率",
      excellent: "互动极佳",
      good: "互动良好",
      average: "互动一般",
      low: "互动较低"
    },
    actions: {
      showAdvanced: "显示高级选项",
      hideAdvanced: "隐藏高级选项",
      calculate: "计算",
      calculating: "计算中..."
    },
    tips: {
      accuracy: "填写越多信息，计算越精准。"
    }
  },
  instagram: {
    sections: {
      basic: {
        title: "基本信息",
        description: "请输入您的 Instagram 账号基础信息。"
      },
      profile: {
        title: "个人资料信息",
        description: "帮助我们提供更准确的估算"
      },
      advanced: {
        title: "高级设置",
        description: "配置高级选项以获得更精确的结果。"
      }
    },
    fields: {
      followers: {
        label: "粉丝数"
      },
      avgLikes: {
        label: "每条帖子平均点赞数"
      },
      avgComments: {
        label: "每条帖子平均评论数"
      },
      avgReelsViews: {
        label: "平均 Reels 浏览量"
      },
      contentNiche: {
        label: "内容领域",
        placeholder: "请选择您的内容领域"
      },
      audienceLocation: {
        label: "观众位置",
        placeholder: "请选择您的观众位置"
      }
    },
    engagement: {
      title: "互动率",
      excellent: "互动极佳"
    },
    actions: {
      showAdvanced: "显示高级选项",
      calculate: "计算"
    },
    tips: {
      accuracy: "填写越多信息，计算越精准。"
    }
  },
  youtube: {
    sections: {
      basic: {
        title: "基本信息",
        description: "请输入您的 YouTube 频道基础信息。"
      },
      profile: {
        title: "个人资料信息",
        description: "帮助我们提供更准确的估算"
      },
      advanced: {
        title: "高级设置",
        description: "配置高级选项以获得更精确的结果。"
      }
    },
    fields: {
      subscribers: {
        label: "订阅数"
      },
      avgViews: {
        label: "平均每条视频观看数"
      },
      avgLikes: {
        label: "平均每条视频点赞数"
      },
      avgComments: {
        label: "平均每条视频评论数"
      },
      avgWatchTime: {
        label: "平均观看时长（分钟）"
      },
      videoLength: {
        label: "平均视频时长（分钟）"
      },
      contentNiche: {
        label: "内容领域",
        placeholder: "请选择您的内容领域"
      },
      audienceLocation: {
        label: "观众位置",
        placeholder: "请选择您的观众位置"
      }
    },
    engagement: {
      title: "互动率",
      good: "互动良好"
    },
    watchTime: {
      title: "观看时长",
      average: "平均观看时长"
    },
    actions: {
      showAdvanced: "显示高级设置",
      calculate: "计算"
    },
    tips: {
      accuracy: "填写越详细，结果越准确。"
    }
  },
  history: {
    title: "计算历史",
    description: "查看您之前的计算记录和结果。",
    empty: "暂无计算历史。"
  },
  instagram: {
    sections: {
      basic: {
        title: "基本信息",
        description: "请输入您的 Instagram 账号基础信息。"
      },
      profile: {
        title: "个人资料信息",
        description: "帮助我们提供更准确的估算"
      },
      advanced: {
        title: "高级设置",
        description: "配置高级选项以获得更精确的结果。"
      }
    },
    fields: {
      followers: {
        label: "粉丝数",
        placeholder: "输入您的粉丝数量"
      },
      avgLikes: {
        label: "帖子平均点赞数",
        placeholder: "输入平均点赞数"
      },
      avgComments: {
        label: "帖子平均评论数",
        placeholder: "输入平均评论数"
      },
      avgReelsViews: {
        label: "Reels 平均观看次数",
        placeholder: "输入 Reels 平均观看次数"
      },
      avgStoryViews: {
        label: "Stories 平均观看次数",
        placeholder: "输入 Stories 平均观看次数"
      },
      postFrequency: {
        label: "发布频率（每周）",
        placeholder: "输入每周发布帖子数量"
      },
      accountAge: {
        label: "账号年龄（月）",
        placeholder: "输入账号创建月数"
      },
      hasVerification: {
        label: "认证状态",
        placeholder: "是否已认证"
      },
      contentNiche: {
        label: "内容领域",
        placeholder: "请选择您的内容领域"
      },
      audienceLocation: {
        label: "观众位置",
        placeholder: "请选择您的观众位置"
      }
    },
    engagement: {
      title: "互动率",
      excellent: "互动极佳",
      good: "互动良好",
      average: "互动一般",
      low: "互动较低"
    },
    actions: {
      showAdvanced: "显示高级选项",
      hideAdvanced: "隐藏高级选项",
      calculate: "计算",
      calculating: "计算中..."
    },
    tips: {
      accuracy: "填写越多信息，计算越精准。"
    }
  },
  youtube: {
    sections: {
      basic: {
        title: "基本信息",
        description: "请输入您的 YouTube 账号基础信息。"
      },
      profile: {
        title: "个人资料信息",
        description: "帮助我们提供更准确的估算"
      },
      advanced: {
        title: "高级设置",
        description: "配置高级选项以获得更精确的结果。"
      }
    },
    fields: {
      subscribers: {
        label: "订阅者数",
        placeholder: "输入您的订阅者数量"
      },
      avgViews: {
        label: "视频平均观看次数",
        placeholder: "输入平均观看次数"
      },
      avgLikes: {
        label: "视频平均点赞数",
        placeholder: "输入平均点赞数"
      },
      avgComments: {
        label: "视频平均评论数",
        placeholder: "输入平均评论数"
      },
      videoLength: {
        label: "视频平均时长（分钟）",
        placeholder: "输入视频平均时长"
      },
      uploadFrequency: {
        label: "上传频率（每周）",
        placeholder: "输入每周上传视频数量"
      },
      channelAge: {
        label: "频道年龄（月）",
        placeholder: "输入频道创建月数"
      },
      contentNiche: {
        label: "内容领域",
        placeholder: "请选择您的内容领域"
      },
      audienceLocation: {
        label: "观众位置",
        placeholder: "请选择您的观众位置"
      }
    },
    engagement: {
      title: "互动率",
      excellent: "互动极佳",
      good: "互动良好",
      average: "互动一般",
      low: "互动较低"
    },
    watchTime: {
      title: "观看时长",
      excellent: "观看时长极佳",
      good: "观看时长良好",
      average: "观看时长一般",
      low: "观看时长较低"
    },
    actions: {
      showAdvanced: "显示高级选项",
      hideAdvanced: "隐藏高级选项",
      calculate: "计算",
      calculating: "计算中..."
    },
    tips: {
      accuracy: "填写越多信息，计算越精准。"
    }
  },
  share: {
    title: "分享结果",
    description: "与朋友分享您的收益计算结果",
    social: "社交媒体",
    link: "链接分享",
    image: "图片分享",
    customMessage: "自定义消息",
    copied: "已复制到剪贴板",
    copyError: "复制失败",
    imageDownloaded: "图片已下载",
    qrGenerated: "二维码已生成",
    qrError: "二维码生成失败"
  },
  save: {
    title: "保存TikTok收益计算结果",
    description: "保存您的TikTok创作者收益计算结果，追踪收入增长趋势",
    name: "TikTok收益计算名称",
    namePlaceholder: "输入您的TikTok收益计算名称",
    descriptionPlaceholder: "保存TikTok创作者收益估算结果，便于对比不同时期的收入潜力",
    favorite: "收藏此收益计算",
    save: "保存收益结果",
    saving: "正在保存TikTok收益数据...",
    share: "分享收益计算",
    export: "导出收益报告",
    loginHint: "登录后可将TikTok收益计算结果保存到云端，方便在不同设备间同步查看您的创作者收入分析。",
    success: "TikTok收益计算保存成功",
    error: "收益计算保存失败",
    exported: "TikTok收益报告已下载",
    shared: "收益计算分享成功",
    copiedToClipboard: "TikTok收益链接已复制到剪贴板",
    shareError: "收益计算分享失败",
    noCalculation: "暂无TikTok收益计算结果可保存"
  },
  results: {
    title: "计算结果",
    overview: "概览",
    earnings: "收益",
    factors: "影响因素",
    tips: "提升建议",
    monthlyEarnings: "月收益",
    yearlyEarnings: "年收益",
    perPostEarnings: "单条收益",
    breakdown: "收益细分",
    creatorFund: "创作者基金",
    liveGifts: "直播礼物",
    brandPartnerships: "品牌合作",
    affiliateMarketing: "联盟营销",
    merchandise: "商品销售",
    other: "其他收入",
    revenueDistribution: "收益分布",
    optimizationTips: "优化建议",
    personalizedSuggestions: "个性化建议以提升您的收益潜力",
    growthStrategies: "增长策略",
    contentStrategy: "内容策略",
    monetization: "变现策略",
    impactLevel: "影响程度",
    scoreMultiplier: "评分/倍数",
    high: "高",
    medium: "中",
    low: "低",
    engagement: "互动率",
    niche: "内容领域",
    location: "地理位置",
    consistency: "发布频率",
    quality: "内容质量"
  },
  growth: {
    recommendations: {
      title: "成长建议"
    },
    strategies: {
      content: {
        title: "内容策略",
        consistency: "在高峰时段保持发布频率",
        trending: "使用热门标签和音乐",
        engagement: "定期与观众互动",
        collaboration: "与其他创作者合作"
      },
      monetization: {
        title: "变现策略",
        diversify: "多元化收入来源",
        brandPartnerships: "建立品牌合作关系",
        products: "创建优质内容产品",
        courses: "开发个人品牌课程"
      }
    }
  },
  common: {
    month: "月",
    followers: "粉丝数",
    engagement: "互动率"
  },
  disclaimer: "此计算结果仅供参考，实际收益可能因多种因素而有所不同。"
} as const;