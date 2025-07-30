/**
 * 文件类型定义 - 跨平台兼容
 */

// 服务器端文件接口（FormData中的文件）
export interface ServerFile {
  size: number;
  type: string;
  name?: string;
  arrayBuffer(): Promise<ArrayBuffer>;
}

// 客户端文件接口（浏览器File对象）
export interface ClientFile extends ServerFile {
  lastModified: number;
  webkitRelativePath: string;
  stream(): ReadableStream;
  text(): Promise<string>;
}

// 通用文件类型 - 在运行时确定具体类型
export type UniversalFile = ServerFile | ClientFile;

// 类型守卫函数
export function isClientFile(file: UniversalFile): file is ClientFile {
  return typeof window !== 'undefined' && 'lastModified' in file;
}

export function isServerFile(file: UniversalFile): file is ServerFile {
  return typeof window === 'undefined' || !('lastModified' in file);
}

// 文件验证函数
export function validateFileSize(file: UniversalFile, maxSize: number): boolean {
  return file.size <= maxSize;
}

export function validateFileType(file: UniversalFile, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

// 安全的文件处理工具
export class FileHandler {
  static async getBuffer(file: UniversalFile): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  
  static getFileName(file: UniversalFile): string {
    return file.name || 'unknown';
  }
  
  static getFileExtension(file: UniversalFile): string {
    const name = this.getFileName(file);
    const parts = name.split('.');
    return parts.length > 1 ? parts.pop()! : '';
  }
  
  static validateFile(
    file: UniversalFile, 
    options: {
      maxSize?: number;
      allowedTypes?: string[];
      minSize?: number;
    } = {}
  ): { isValid: boolean; error?: string } {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = [], minSize = 0 } = options;
    
    if (file.size < minSize) {
      return { isValid: false, error: `File too small. Minimum size: ${minSize} bytes` };
    }
    
    if (file.size > maxSize) {
      return { isValid: false, error: `File too large. Maximum size: ${maxSize} bytes` };
    }
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return { isValid: false, error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` };
    }
    
    return { isValid: true };
  }
}
