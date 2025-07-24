/**
 * 企业级语言环境配置
 * 定义支持的语言、地区、货币、日期格式等
 */

// 语言分组配置
const LANGUAGE_GROUPS = {
  // 主要市场语言（优先级最高）
  PRIMARY: {
    'en': 'English (Global)',
    'zh': 'Chinese (Simplified)',
    'es': 'Spanish (Global)',
    'fr': 'French (Global)',
    'de': 'German (Global)',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic (Global)'
  },
  
  // 地区变体语言
  REGIONAL: {
    'en-GB': 'English (United Kingdom)',
    'en-AU': 'English (Australia)',
    'en-CA': 'English (Canada)',
    'zh-TW': 'Chinese (Traditional)',
    'zh-HK': 'Chinese (Hong Kong)',
    'es-MX': 'Spanish (Mexico)',
    'es-AR': 'Spanish (Argentina)',
    'fr-CA': 'French (Canada)',
    'pt-BR': 'Portuguese (Brazil)',
    'pt-PT': 'Portuguese (Portugal)'
  },
  
  // 新兴市场语言
  EMERGING: {
    'hi': 'Hindi',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'id': 'Indonesian',
    'ms': 'Malay',
    'tl': 'Filipino',
    'tr': 'Turkish',
    'ru': 'Russian',
    'pl': 'Polish',
    'it': 'Italian',
    'nl': 'Dutch',
    'sv': 'Swedish',
    'da': 'Danish',
    'no': 'Norwegian',
    'fi': 'Finnish'
  }
};

// 货币配置
const CURRENCIES = {
  'USD': { symbol: '$', name: 'US Dollar', decimals: 2 },
  'EUR': { symbol: '€', name: 'Euro', decimals: 2 },
  'GBP': { symbol: '£', name: 'British Pound', decimals: 2 },
  'JPY': { symbol: '¥', name: 'Japanese Yen', decimals: 0 },
  'CNY': { symbol: '¥', name: 'Chinese Yuan', decimals: 2 },
  'KRW': { symbol: '₩', name: 'Korean Won', decimals: 0 },
  'CAD': { symbol: 'C$', name: 'Canadian Dollar', decimals: 2 },
  'AUD': { symbol: 'A$', name: 'Australian Dollar', decimals: 2 },
  'CHF': { symbol: 'CHF', name: 'Swiss Franc', decimals: 2 },
  'SEK': { symbol: 'kr', name: 'Swedish Krona', decimals: 2 },
  'NOK': { symbol: 'kr', name: 'Norwegian Krone', decimals: 2 },
  'DKK': { symbol: 'kr', name: 'Danish Krone', decimals: 2 },
  'PLN': { symbol: 'zł', name: 'Polish Zloty', decimals: 2 },
  'CZK': { symbol: 'Kč', name: 'Czech Koruna', decimals: 2 },
  'HUF': { symbol: 'Ft', name: 'Hungarian Forint', decimals: 0 },
  'RUB': { symbol: '₽', name: 'Russian Ruble', decimals: 2 },
  'TRY': { symbol: '₺', name: 'Turkish Lira', decimals: 2 },
  'BRL': { symbol: 'R$', name: 'Brazilian Real', decimals: 2 },
  'MXN': { symbol: '$', name: 'Mexican Peso', decimals: 2 },
  'ARS': { symbol: '$', name: 'Argentine Peso', decimals: 2 },
  'CLP': { symbol: '$', name: 'Chilean Peso', decimals: 0 },
  'COP': { symbol: '$', name: 'Colombian Peso', decimals: 0 },
  'PEN': { symbol: 'S/', name: 'Peruvian Sol', decimals: 2 },
  'INR': { symbol: '₹', name: 'Indian Rupee', decimals: 2 },
  'THB': { symbol: '฿', name: 'Thai Baht', decimals: 2 },
  'VND': { symbol: '₫', name: 'Vietnamese Dong', decimals: 0 },
  'IDR': { symbol: 'Rp', name: 'Indonesian Rupiah', decimals: 0 },
  'MYR': { symbol: 'RM', name: 'Malaysian Ringgit', decimals: 2 },
  'SGD': { symbol: 'S$', name: 'Singapore Dollar', decimals: 2 },
  'PHP': { symbol: '₱', name: 'Philippine Peso', decimals: 2 },
  'TWD': { symbol: 'NT$', name: 'Taiwan Dollar', decimals: 0 },
  'HKD': { symbol: 'HK$', name: 'Hong Kong Dollar', decimals: 2 },
  'SAR': { symbol: '﷼', name: 'Saudi Riyal', decimals: 2 },
  'AED': { symbol: 'د.إ', name: 'UAE Dirham', decimals: 2 },
  'EGP': { symbol: '£', name: 'Egyptian Pound', decimals: 2 },
  'ZAR': { symbol: 'R', name: 'South African Rand', decimals: 2 },
  'NGN': { symbol: '₦', name: 'Nigerian Naira', decimals: 2 },
  'KES': { symbol: 'KSh', name: 'Kenyan Shilling', decimals: 2 }
};

// 时区配置
const TIMEZONES = {
  'US/Pacific': 'Pacific Time (US)',
  'US/Mountain': 'Mountain Time (US)',
  'US/Central': 'Central Time (US)',
  'US/Eastern': 'Eastern Time (US)',
  'Europe/London': 'Greenwich Mean Time',
  'Europe/Paris': 'Central European Time',
  'Europe/Berlin': 'Central European Time',
  'Europe/Rome': 'Central European Time',
  'Europe/Madrid': 'Central European Time',
  'Europe/Amsterdam': 'Central European Time',
  'Europe/Stockholm': 'Central European Time',
  'Europe/Copenhagen': 'Central European Time',
  'Europe/Oslo': 'Central European Time',
  'Europe/Helsinki': 'Eastern European Time',
  'Europe/Warsaw': 'Central European Time',
  'Europe/Prague': 'Central European Time',
  'Europe/Budapest': 'Central European Time',
  'Europe/Moscow': 'Moscow Time',
  'Europe/Istanbul': 'Turkey Time',
  'Asia/Tokyo': 'Japan Standard Time',
  'Asia/Seoul': 'Korea Standard Time',
  'Asia/Shanghai': 'China Standard Time',
  'Asia/Hong_Kong': 'Hong Kong Time',
  'Asia/Taipei': 'Taiwan Time',
  'Asia/Singapore': 'Singapore Time',
  'Asia/Bangkok': 'Indochina Time',
  'Asia/Ho_Chi_Minh': 'Indochina Time',
  'Asia/Jakarta': 'Western Indonesia Time',
  'Asia/Kuala_Lumpur': 'Malaysia Time',
  'Asia/Manila': 'Philippines Time',
  'Asia/Kolkata': 'India Standard Time',
  'Asia/Dubai': 'Gulf Standard Time',
  'Asia/Riyadh': 'Arabia Standard Time',
  'Australia/Sydney': 'Australian Eastern Time',
  'Australia/Melbourne': 'Australian Eastern Time',
  'Australia/Perth': 'Australian Western Time',
  'America/Sao_Paulo': 'Brasilia Time',
  'America/Mexico_City': 'Central Standard Time (Mexico)',
  'America/Buenos_Aires': 'Argentina Time',
  'America/Santiago': 'Chile Time',
  'America/Bogota': 'Colombia Time',
  'America/Lima': 'Peru Time',
  'Africa/Cairo': 'Eastern European Time',
  'Africa/Johannesburg': 'South Africa Standard Time',
  'Africa/Lagos': 'West Africa Time',
  'Africa/Nairobi': 'East Africa Time'
};

// 数字格式配置
const NUMBER_FORMATS = {
  'en-US': { decimal: '.', thousands: ',', grouping: [3] },
  'en-GB': { decimal: '.', thousands: ',', grouping: [3] },
  'de-DE': { decimal: ',', thousands: '.', grouping: [3] },
  'fr-FR': { decimal: ',', thousands: ' ', grouping: [3] },
  'es-ES': { decimal: ',', thousands: '.', grouping: [3] },
  'it-IT': { decimal: ',', thousands: '.', grouping: [3] },
  'pt-BR': { decimal: ',', thousands: '.', grouping: [3] },
  'ru-RU': { decimal: ',', thousands: ' ', grouping: [3] },
  'zh-CN': { decimal: '.', thousands: ',', grouping: [3] },
  'ja-JP': { decimal: '.', thousands: ',', grouping: [3] },
  'ko-KR': { decimal: '.', thousands: ',', grouping: [3] },
  'ar-SA': { decimal: '.', thousands: ',', grouping: [3] },
  'hi-IN': { decimal: '.', thousands: ',', grouping: [3, 2] },
  'th-TH': { decimal: '.', thousands: ',', grouping: [3] }
};

// 日期格式配置
const DATE_FORMATS = {
  'en-US': { short: 'MM/dd/yyyy', medium: 'MMM dd, yyyy', long: 'MMMM dd, yyyy', full: 'EEEE, MMMM dd, yyyy' },
  'en-GB': { short: 'dd/MM/yyyy', medium: 'dd MMM yyyy', long: 'dd MMMM yyyy', full: 'EEEE, dd MMMM yyyy' },
  'de-DE': { short: 'dd.MM.yyyy', medium: 'dd. MMM yyyy', long: 'dd. MMMM yyyy', full: 'EEEE, dd. MMMM yyyy' },
  'fr-FR': { short: 'dd/MM/yyyy', medium: 'dd MMM yyyy', long: 'dd MMMM yyyy', full: 'EEEE dd MMMM yyyy' },
  'es-ES': { short: 'dd/MM/yyyy', medium: 'dd MMM yyyy', long: 'dd \'de\' MMMM \'de\' yyyy', full: 'EEEE, dd \'de\' MMMM \'de\' yyyy' },
  'it-IT': { short: 'dd/MM/yyyy', medium: 'dd MMM yyyy', long: 'dd MMMM yyyy', full: 'EEEE dd MMMM yyyy' },
  'pt-BR': { short: 'dd/MM/yyyy', medium: 'dd \'de\' MMM \'de\' yyyy', long: 'dd \'de\' MMMM \'de\' yyyy', full: 'EEEE, dd \'de\' MMMM \'de\' yyyy' },
  'ru-RU': { short: 'dd.MM.yyyy', medium: 'dd MMM yyyy \'г\'.', long: 'dd MMMM yyyy \'г\'.', full: 'EEEE, dd MMMM yyyy \'г\'.' },
  'zh-CN': { short: 'yyyy/MM/dd', medium: 'yyyy年MM月dd日', long: 'yyyy年MM月dd日', full: 'yyyy年MM月dd日 EEEE' },
  'ja-JP': { short: 'yyyy/MM/dd', medium: 'yyyy年MM月dd日', long: 'yyyy年MM月dd日', full: 'yyyy年MM月dd日 EEEE' },
  'ko-KR': { short: 'yyyy. MM. dd.', medium: 'yyyy년 MM월 dd일', long: 'yyyy년 MM월 dd일', full: 'yyyy년 MM월 dd일 EEEE' },
  'ar-SA': { short: 'dd/MM/yyyy', medium: 'dd MMM yyyy', long: 'dd MMMM yyyy', full: 'EEEE، dd MMMM yyyy' },
  'hi-IN': { short: 'dd/MM/yyyy', medium: 'dd MMM yyyy', long: 'dd MMMM yyyy', full: 'EEEE, dd MMMM yyyy' },
  'th-TH': { short: 'dd/MM/yyyy', medium: 'dd MMM yyyy', long: 'dd MMMM yyyy', full: 'EEEEที่ dd MMMM yyyy' }
};

// RTL 语言列表
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ps', 'sd'];

// 复数规则配置
const PLURAL_RULES = {
  'en': 'one|other',
  'zh': 'other',
  'ja': 'other',
  'ko': 'other',
  'th': 'other',
  'vi': 'other',
  'id': 'other',
  'ms': 'other',
  'tl': 'one|other',
  'es': 'one|other',
  'fr': 'one|other',
  'de': 'one|other',
  'it': 'one|other',
  'pt': 'one|other',
  'ru': 'one|few|many|other',
  'pl': 'one|few|many|other',
  'ar': 'zero|one|two|few|many|other',
  'hi': 'one|other',
  'tr': 'one|other'
};

module.exports = {
  LANGUAGE_GROUPS,
  CURRENCIES,
  TIMEZONES,
  NUMBER_FORMATS,
  DATE_FORMATS,
  RTL_LANGUAGES,
  PLURAL_RULES,
  
  // 辅助函数
  isRTL: (locale) => RTL_LANGUAGES.includes(locale.split('-')[0]),
  getCurrency: (locale) => CURRENCIES[locale] || CURRENCIES['USD'],
  getNumberFormat: (locale) => NUMBER_FORMATS[locale] || NUMBER_FORMATS['en-US'],
  getDateFormat: (locale) => DATE_FORMATS[locale] || DATE_FORMATS['en-US'],
  getPluralRule: (locale) => PLURAL_RULES[locale.split('-')[0]] || PLURAL_RULES['en']
};
