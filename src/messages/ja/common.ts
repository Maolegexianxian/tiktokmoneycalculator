export const common = {
  actions: {
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    edit: "編集",
    view: "表示",
    share: "共有",
    copy: "コピー",
    download: "ダウンロード",
    upload: "アップロード",
    submit: "送信",
    reset: "リセット",
    clear: "クリア",
    close: "閉じる",
    open: "開く",
    next: "次へ",
    previous: "前へ",
    back: "戻る",
    continue: "続行",
    confirm: "確認",
    loading: "読み込み中...",
    retry: "再試行"
  },
  
  status: {
    success: "成功",
    error: "エラー",
    warning: "警告",
    info: "情報",
    pending: "保留中",
    completed: "完了",
    failed: "失敗",
    active: "アクティブ",
    inactive: "非アクティブ",
    draft: "下書き",
    published: "公開済み"
  },
  
  time: {
    now: "今",
    today: "今日",
    yesterday: "昨日",
    tomorrow: "明日",
    thisWeek: "今週",
    lastWeek: "先週",
    thisMonth: "今月",
    lastMonth: "先月",
    thisYear: "今年",
    lastYear: "昨年",
    minute: "分",
    minutes: "分",
    hour: "時間",
    hours: "時間",
    day: "日",
    days: "日",
    week: "週",
    weeks: "週",
    month: "月",
    months: "月",
    year: "年",
    years: "年",
    ago: "前"
  },
  
  validation: {
    required: "この項目は必須です",
    invalid: "無効な値",
    tooShort: "短すぎます",
    tooLong: "長すぎます",
    invalidEmail: "無効なメールアドレス",
    invalidUrl: "無効なURL",
    invalidNumber: "無効な数値",
    mustBePositive: "正の数である必要があります",
    mustBeGreaterThan: "{min}より大きい必要があります",
    mustBeLessThan: "{max}より小さい必要があります"
  },
  
  messages: {
    noData: "利用可能なデータがありません",
    noResults: "結果が見つかりません",
    searchPlaceholder: "検索...",
    selectOption: "オプションを選択",
    copiedToClipboard: "クリップボードにコピーしました",
    shareError: "共有に失敗しました",
    saveError: "保存に失敗しました",
    loadError: "読み込みに失敗しました",
    networkError: "ネットワークエラー。接続を確認してください。",
    unexpectedError: "予期しないエラーが発生しました"
  },
  
  currency: {
    usd: "米ドル",
    eur: "ユーロ",
    gbp: "英ポンド",
    cny: "人民元",
    jpy: "日本円",
    krw: "韓国ウォン"
  },
  
  units: {
    k: "千",
    m: "百万",
    b: "十億",
    percent: "%",
    perMonth: "月あたり",
    perYear: "年あたり",
    perVideo: "動画あたり"
  },
  
  metrics: {
    followers: "フォロワー",
    engagement: "エンゲージメント",
    views: "視聴回数",
    likes: "いいね",
    comments: "コメント",
    shares: "シェア",
    subscribers: "登録者",
    watchTime: "視聴時間"
  }
} as const;