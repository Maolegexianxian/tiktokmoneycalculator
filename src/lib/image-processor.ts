/**
 * Enterprise-grade image processing module
 * Handles Sharp module loading and image operations with proper error handling
 */

import { NextResponse } from 'next/server';

// Sharp instance cache
let sharpInstance: any = null;
let sharpLoadError: Error | null = null;

/**
 * Image processing configuration
 */
export const IMAGE_CONFIG = {
  // Supported formats
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  
  // Size limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MIN_DIMENSION: 100,
  MAX_DIMENSION: 4000,
  
  // Quality settings
  JPEG_QUALITY: 90,
  WEBP_QUALITY: 85,
  PNG_COMPRESSION: 6,
  
  // Avatar settings
  AVATAR_SIZE: 400,
  THUMBNAIL_SIZE: 150,
  
  // Processing timeouts
  PROCESSING_TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * Load Sharp module with proper error handling
 */
async function loadSharp(): Promise<any> {
  if (sharpInstance) {
    return sharpInstance;
  }
  
  if (sharpLoadError) {
    throw sharpLoadError;
  }
  
  try {
    // Dynamic import to avoid build-time issues
    const sharp = await import('sharp');
    sharpInstance = sharp.default;
    
    // Configure Sharp for optimal performance
    sharpInstance.cache({ memory: 50, files: 20, items: 100 });
    sharpInstance.concurrency(1); // Limit concurrency in container environments
    
    console.log('Sharp module loaded successfully');
    return sharpInstance;
  } catch (error) {
    sharpLoadError = error as Error;
    console.error('Failed to load Sharp module:', error);
    throw new Error('Image processing service is not available');
  }
}

/**
 * Check if image processing is available
 */
export async function isImageProcessingAvailable(): Promise<boolean> {
  try {
    await loadSharp();
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate image buffer
 */
export async function validateImage(buffer: Buffer): Promise<{
  isValid: boolean;
  metadata?: any;
  error?: string;
}> {
  try {
    const sharp = await loadSharp();
    const metadata = await sharp(buffer).metadata();
    
    // Check if it's a valid image
    if (!metadata.width || !metadata.height) {
      return { isValid: false, error: 'Invalid image format' };
    }
    
    // Check dimensions
    if (metadata.width < IMAGE_CONFIG.MIN_DIMENSION || metadata.height < IMAGE_CONFIG.MIN_DIMENSION) {
      return { 
        isValid: false, 
        error: `Image too small. Minimum size: ${IMAGE_CONFIG.MIN_DIMENSION}x${IMAGE_CONFIG.MIN_DIMENSION}px` 
      };
    }
    
    if (metadata.width > IMAGE_CONFIG.MAX_DIMENSION || metadata.height > IMAGE_CONFIG.MAX_DIMENSION) {
      return { 
        isValid: false, 
        error: `Image too large. Maximum size: ${IMAGE_CONFIG.MAX_DIMENSION}x${IMAGE_CONFIG.MAX_DIMENSION}px` 
      };
    }
    
    return { isValid: true, metadata };
  } catch (error) {
    return { isValid: false, error: 'Failed to validate image' };
  }
}

/**
 * Process avatar image
 */
export async function processAvatar(
  buffer: Buffer,
  options: {
    size?: number;
    quality?: number;
    format?: 'jpeg' | 'webp' | 'png';
  } = {}
): Promise<Buffer> {
  const sharp = await loadSharp();
  const { 
    size = IMAGE_CONFIG.AVATAR_SIZE, 
    quality = IMAGE_CONFIG.JPEG_QUALITY,
    format = 'jpeg'
  } = options;
  
  let processor = sharp(buffer)
    .resize(size, size, {
      fit: 'cover',
      position: 'center'
    });
  
  // Apply format-specific settings
  switch (format) {
    case 'jpeg':
      processor = processor.jpeg({ quality, mozjpeg: true });
      break;
    case 'webp':
      processor = processor.webp({ quality: IMAGE_CONFIG.WEBP_QUALITY });
      break;
    case 'png':
      processor = processor.png({ compressionLevel: IMAGE_CONFIG.PNG_COMPRESSION });
      break;
  }
  
  return await processor.toBuffer();
}

/**
 * Generate thumbnail
 */
export async function generateThumbnail(
  buffer: Buffer,
  size: number = IMAGE_CONFIG.THUMBNAIL_SIZE
): Promise<Buffer> {
  const sharp = await loadSharp();
  
  return await sharp(buffer)
    .resize(size, size, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 80 })
    .toBuffer();
}

/**
 * Get image metadata
 */
export async function getImageMetadata(buffer: Buffer): Promise<any> {
  const sharp = await loadSharp();
  return await sharp(buffer).metadata();
}

/**
 * Create error response for image processing failures
 */
export function createImageProcessingErrorResponse(error: any): NextResponse {
  console.error('Image processing error:', error);
  
  if (error.message?.includes('not available')) {
    return NextResponse.json(
      { 
        error: 'Service Unavailable', 
        message: 'Image processing service is temporarily unavailable' 
      },
      { status: 503 }
    );
  }
  
  return NextResponse.json(
    { 
      error: 'Processing Error', 
      message: 'Failed to process image. Please try a different image.' 
    },
    { status: 400 }
  );
}

/**
 * Optimize image for web delivery
 */
export async function optimizeForWeb(
  buffer: Buffer,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'auto' | 'jpeg' | 'webp' | 'avif';
  } = {}
): Promise<{ buffer: Buffer; format: string; size: number }> {
  const sharp = await loadSharp();
  const { 
    maxWidth = 1920, 
    maxHeight = 1080, 
    quality = 85,
    format = 'auto'
  } = options;
  
  let processor = sharp(buffer);
  
  // Resize if needed
  const metadata = await processor.metadata();
  if (metadata.width && metadata.width > maxWidth || metadata.height && metadata.height > maxHeight) {
    processor = processor.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }
  
  // Choose optimal format
  let outputFormat = format;
  if (format === 'auto') {
    // Prefer WebP for better compression, fallback to JPEG
    outputFormat = 'webp';
  }
  
  // Apply format-specific optimization
  switch (outputFormat) {
    case 'webp':
      processor = processor.webp({ quality });
      break;
    case 'avif':
      processor = processor.avif({ quality });
      break;
    case 'jpeg':
    default:
      processor = processor.jpeg({ quality, mozjpeg: true });
      outputFormat = 'jpeg';
      break;
  }
  
  const optimizedBuffer = await processor.toBuffer();
  
  return {
    buffer: optimizedBuffer,
    format: outputFormat,
    size: optimizedBuffer.length
  };
}
