export const common = {
  actions: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    share: "Share",
    copy: "Copy",
    download: "Download",
    upload: "Upload",
    submit: "Submit",
    reset: "Reset",
    clear: "Clear",
    close: "Close",
    open: "Open",
    next: "Next",
    previous: "Previous",
    back: "Back",
    continue: "Continue",
    confirm: "Confirm",
    loading: "Loading...",
    retry: "Retry"
  },
  
  status: {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
    active: "Active",
    inactive: "Inactive",
    draft: "Draft",
    published: "Published"
  },
  
  time: {
    now: "Now",
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This week",
    lastWeek: "Last week",
    thisMonth: "This month",
    lastMonth: "Last month",
    thisYear: "This year",
    lastYear: "Last year",
    minute: "minute",
    minutes: "minutes",
    hour: "hour",
    hours: "hours",
    day: "day",
    days: "days",
    week: "week",
    weeks: "weeks",
    month: "month",
    months: "months",
    year: "year",
    years: "years",
    ago: "ago"
  },
  
  validation: {
    required: "This field is required",
    invalid: "Invalid value",
    tooShort: "Too short",
    tooLong: "Too long",
    invalidEmail: "Invalid email address",
    invalidUrl: "Invalid URL",
    invalidNumber: "Invalid number",
    mustBePositive: "Must be a positive number",
    mustBeGreaterThan: "Must be greater than {min}",
    mustBeLessThan: "Must be less than {max}"
  },
  
  messages: {
    noData: "No data available",
    noResults: "No results found",
    searchPlaceholder: "Search...",
    selectOption: "Select an option",
    copiedToClipboard: "Copied to clipboard",
    shareError: "Failed to share",
    saveError: "Failed to save",
    loadError: "Failed to load",
    networkError: "Network error. Please check your connection.",
    unexpectedError: "An unexpected error occurred"
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
    perMonth: "per month",
    perYear: "per year",
    perVideo: "per video"
  }
} as const;