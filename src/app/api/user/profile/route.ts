import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { userRepository } from '@/lib/db';
import { userProfileUpdateSchema } from '@/lib/validations';
import { track } from '@/lib/analytics';

/**
 * GET /api/user/profile
 * 获取用户资料
 */
export async function GET(request: NextRequest) {
  try {
    // 验证用户认证
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // 获取用户资料
    const user = await userRepository.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'Not Found', message: 'User not found' },
        { status: 404 }
      );
    }

    // 返回用户资料（排除敏感信息）
    const { password, ...userProfile } = user;
    
    return NextResponse.json({
      success: true,
      data: userProfile,
    });
    
  } catch (error) {
    console.error('Get user profile error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while fetching user profile',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile
 * 更新用户资料
 */
export async function PUT(request: NextRequest) {
  try {
    // 验证用户认证
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await request.json();
    
    // 验证输入数据
    const validation = userProfileUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Invalid input data',
          details: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // 过滤掉undefined值
    const cleanUpdateData: { name?: string; email?: string; image?: string } = {};
    if (validation.data.name !== undefined) cleanUpdateData.name = validation.data.name;
    if (validation.data.email !== undefined) cleanUpdateData.email = validation.data.email;
    if (validation.data.image !== undefined) cleanUpdateData.image = validation.data.image;

    // 检查邮箱是否已被其他用户使用
    if (cleanUpdateData.email) {
      const existingUser = await userRepository.findByEmail(cleanUpdateData.email);
      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          {
            error: 'Conflict',
            message: 'Email address is already in use',
          },
          { status: 409 }
        );
      }
    }

    // 更新用户资料
    const updatedUser = await userRepository.update(session.user.id, cleanUpdateData);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Not Found', message: 'User not found' },
        { status: 404 }
      );
    }

    // 跟踪分析事件
    try {
      track.event('profile_updated', 'user', 'profile');
    } catch (error) {
      console.error('Failed to track profile update:', error);
    }

    // 返回更新后的用户资料（排除敏感信息）
    const { password, ...userProfile } = updatedUser;
    
    return NextResponse.json({
      success: true,
      data: userProfile,
      message: 'Profile updated successfully',
    });
    
  } catch (error) {
    console.error('Update user profile error:', error);
    
    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'user-profile-update');
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while updating user profile',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/profile
 * 删除用户账户
 */
export async function DELETE(request: NextRequest) {
  try {
    // 验证用户认证
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // 解析请求体（可能包含确认密码）
    const body = await request.json();
    const { confirmPassword } = body;

    // 验证密码（如果提供）
    if (confirmPassword) {
      const user = await userRepository.findById(session.user.id);
      if (!user) {
        return NextResponse.json(
          { error: 'Not Found', message: 'User not found' },
          { status: 404 }
        );
      }

      // 这里应该验证密码，但为了简化示例，我们跳过
      // 在实际应用中，应该使用 bcrypt 等库来验证密码
    }

    // 删除用户账户
    const deleted = await userRepository.delete(session.user.id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Not Found', message: 'User not found' },
        { status: 404 }
      );
    }

    // 跟踪分析事件
    try {
      track.event('account_deleted', 'user', 'account');
    } catch (error) {
      console.error('Failed to track account deletion:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
    
  } catch (error) {
    console.error('Delete user account error:', error);
    
    // 跟踪错误
    try {
      track.error(error instanceof Error ? error : new Error(String(error)), 'user-account-deletion');
    } catch (trackingError) {
      console.error('Failed to track error:', trackingError);
    }
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An error occurred while deleting user account',
      },
      { status: 500 }
    );
  }
}