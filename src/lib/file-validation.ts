/**
 * 文件验证工具 - 运行时安全版本
 * 避免构建时File对象引用问题
 */

export interface FileValidationOptions {
  maxSize?: number;
  minSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * 默认文件验证配置
 */
export const DEFAULT_FILE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  minSize: 1024, // 1KB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'],
} as const;

/**
 * 验证文件对象（运行时安全）
 */
export function validateFileObject(
  file: any,
  options: FileValidationOptions = {}
): FileValidationResult {
  const config = { ...DEFAULT_FILE_CONFIG, ...options };
  
  // 基本存在性检查
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  // 检查是否为对象
  if (typeof file !== 'object') {
    return { isValid: false, error: 'Invalid file object' };
  }
  
  // 检查必需属性
  if (!('size' in file) || !('type' in file)) {
    return { isValid: false, error: 'File object missing required properties (size, type)' };
  }
  
  // 验证文件大小
  const size = Number(file.size);
  if (isNaN(size) || size < 0) {
    return { isValid: false, error: 'Invalid file size' };
  }
  
  if (size < config.minSize) {
    return { 
      isValid: false, 
      error: `File too small. Minimum size: ${formatFileSize(config.minSize)}` 
    };
  }
  
  if (size > config.maxSize) {
    return { 
      isValid: false, 
      error: `File too large. Maximum size: ${formatFileSize(config.maxSize)}` 
    };
  }
  
  // 验证文件类型
  const type = String(file.type || '').toLowerCase();
  if (!type) {
    return { isValid: false, error: 'File type not specified' };
  }
  
  if (config.allowedTypes.length > 0 && !config.allowedTypes.includes(type)) {
    return { 
      isValid: false, 
      error: `Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}` 
    };
  }
  
  // 验证文件扩展名（如果有文件名）
  if (file.name && typeof file.name === 'string' && config.allowedExtensions.length > 0) {
    const extension = getFileExtension(file.name);
    if (extension && !config.allowedExtensions.includes(extension)) {
      return { 
        isValid: false, 
        error: `Invalid file extension. Allowed extensions: ${config.allowedExtensions.join(', ')}` 
      };
    }
  }
  
  // 检查是否有arrayBuffer方法（用于后续处理）
  const warnings: string[] = [];
  if (!('arrayBuffer' in file) || typeof file.arrayBuffer !== 'function') {
    warnings.push('File object may not support arrayBuffer() method');
  }
  
  return { 
    isValid: true, 
    warnings: warnings.length > 0 ? warnings : undefined 
  };
}

/**
 * 验证图像文件
 */
export function validateImageFile(file: any): FileValidationResult {
  return validateFileObject(file, {
    maxSize: 10 * 1024 * 1024, // 10MB for images
    minSize: 1024, // 1KB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'],
  });
}

/**
 * 验证头像文件
 */
export function validateAvatarFile(file: any): FileValidationResult {
  return validateFileObject(file, {
    maxSize: 5 * 1024 * 1024, // 5MB for avatars
    minSize: 1024, // 1KB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  });
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? `.${parts.pop()}` : '';
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 检查文件是否为图像
 */
export function isImageFile(file: any): boolean {
  if (!file || !file.type) return false;
  return file.type.startsWith('image/');
}

/**
 * 获取文件信息
 */
export function getFileInfo(file: any): {
  name: string;
  size: number;
  type: string;
  extension: string;
  isImage: boolean;
} {
  return {
    name: file?.name || 'unknown',
    size: Number(file?.size || 0),
    type: String(file?.type || ''),
    extension: file?.name ? getFileExtension(file.name) : '',
    isImage: isImageFile(file),
  };
}

/**
 * 创建文件验证错误响应
 */
export function createFileValidationError(result: FileValidationResult) {
  return {
    error: 'File Validation Error',
    message: result.error || 'File validation failed',
    warnings: result.warnings,
  };
}

/**
 * 批量验证文件
 */
export function validateFiles(
  files: any[],
  options: FileValidationOptions = {}
): { valid: any[]; invalid: Array<{ file: any; error: string }> } {
  const valid: any[] = [];
  const invalid: Array<{ file: any; error: string }> = [];
  
  for (const file of files) {
    const result = validateFileObject(file, options);
    if (result.isValid) {
      valid.push(file);
    } else {
      invalid.push({ file, error: result.error || 'Validation failed' });
    }
  }
  
  return { valid, invalid };
}

/**
 * 安全的文件读取（返回Buffer）
 */
export async function safeReadFile(file: any): Promise<Buffer> {
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('File does not support arrayBuffer() method');
  }
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    throw new Error(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
