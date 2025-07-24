import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'avatars');

/**
 * POST /api/user/avatar
 * Upload and update user avatar
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please sign in to upload avatar' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Validation Error', message: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          error: 'Validation Error', 
          message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: 'Validation Error', 
          message: 'File too large. Maximum size is 5MB.' 
        },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${randomUUID()}.${fileExtension}`;
    const filePath = join(UPLOAD_DIR, fileName);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process image with Sharp
    try {
      const processedImage = await sharp(buffer)
        .resize(400, 400, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      // Save processed image
      await writeFile(filePath.replace(`.${fileExtension}`, '.jpg'), processedImage);
      
      const imageUrl = `/uploads/avatars/${fileName.replace(`.${fileExtension}`, '.jpg')}`;

      // Update user profile in database
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: { image: imageUrl },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });

      // Delete old avatar if it exists and is not a default/external image
      const oldImage = session.user.image;
      if (oldImage && oldImage.startsWith('/uploads/avatars/')) {
        try {
          const oldFilePath = join(process.cwd(), 'public', oldImage);
          await import('fs/promises').then(fs => fs.unlink(oldFilePath));
        } catch (error) {
          // Old file might not exist, ignore error
          console.warn('Could not delete old avatar:', error);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Avatar updated successfully',
        imageUrl,
        user: updatedUser,
      });

    } catch (imageError) {
      console.error('Image processing error:', imageError);
      return NextResponse.json(
        { 
          error: 'Processing Error', 
          message: 'Failed to process image. Please try a different image.' 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Avatar upload error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to upload avatar',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/avatar
 * Remove user avatar
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please sign in to remove avatar' },
        { status: 401 }
      );
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Not Found', message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove avatar from database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null },
    });

    // Delete avatar file if it's a local upload
    if (user.image && user.image.startsWith('/uploads/avatars/')) {
      try {
        const filePath = join(process.cwd(), 'public', user.image);
        await import('fs/promises').then(fs => fs.unlink(filePath));
      } catch (error) {
        // File might not exist, ignore error
        console.warn('Could not delete avatar file:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Avatar removed successfully',
    });

  } catch (error) {
    console.error('Avatar removal error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to remove avatar',
      },
      { status: 500 }
    );
  }
}

// Helper function to validate image
async function validateImage(buffer: Buffer): Promise<boolean> {
  try {
    const metadata = await sharp(buffer).metadata();
    
    // Check if it's a valid image
    if (!metadata.width || !metadata.height) {
      return false;
    }
    
    // Check dimensions (minimum 100x100, maximum 4000x4000)
    if (metadata.width < 100 || metadata.height < 100) {
      return false;
    }
    
    if (metadata.width > 4000 || metadata.height > 4000) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

// Helper function to generate thumbnail
async function generateThumbnail(buffer: Buffer, size: number = 150): Promise<Buffer> {
  return await sharp(buffer)
    .resize(size, size, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 80 })
    .toBuffer();
}

// Cleanup old avatars (run periodically)
export async function cleanupOldAvatars() {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Get all avatar files
    const files = await fs.readdir(UPLOAD_DIR);
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    for (const file of files) {
      const filePath = path.join(UPLOAD_DIR, file);
      const stats = await fs.stat(filePath);
      
      // Check if file is older than one week and not referenced in database
      if (stats.mtime.getTime() < oneWeekAgo) {
        const imageUrl = `/uploads/avatars/${file}`;
        const userCount = await prisma.user.count({
          where: { image: imageUrl }
        });
        
        // Delete if not referenced by any user
        if (userCount === 0) {
          await fs.unlink(filePath);
          console.log(`Cleaned up old avatar: ${file}`);
        }
      }
    }
  } catch (error) {
    console.error('Avatar cleanup error:', error);
  }
}
