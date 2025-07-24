import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { env } from './utils';

/**
 * NextAuth.js配置
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth提供商
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    
    // GitHub OAuth提供商
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    
    // 邮箱密码登录（可选）
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'your-email@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            image: user.image || '',
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30天
    updateAge: 24 * 60 * 60, // 24小时
  },
  
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      // 首次登录时保存用户信息到token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      
      // 保存OAuth提供商信息
      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // 将token信息传递给session
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      
      return session;
    },
    
    async signIn({ user, account, profile }) {
      // 允许所有OAuth登录
      if (account?.provider === 'google' || account?.provider === 'github') {
        return true;
      }
      
      // 对于凭据登录，在authorize回调中已经验证
      if (account?.provider === 'credentials') {
        return true;
      }
      
      return false;
    },
    
    async redirect({ url, baseUrl }) {
      // 允许相对URL重定向
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // 允许同域名重定向
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      return baseUrl;
    },
  },
  
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
        isNewUser,
      });
      
      // 记录登录事件（可以发送到分析服务）
      if (env.isProduction) {
        // 这里可以添加分析事件追踪
      }
    },
    
    async signOut({ session, token }) {
      console.log('User signed out:', {
        userId: session?.user?.id || token?.id,
        email: session?.user?.email || token?.email,
      });
    },
    
    async createUser({ user }) {
      console.log('New user created:', {
        userId: user.id,
        email: user.email,
      });
      
      // 新用户欢迎流程（可以发送欢迎邮件等）
      if (env.isProduction) {
        // 这里可以添加新用户欢迎逻辑
      }
    },
  },
  
  debug: env.isDevelopment,
  
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key',
};

/**
 * 用户注册函数
 */
export async function registerUser({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}) {
  try {
    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0] || null,
        emailVerified: null, // 需要邮箱验证
      },
    });
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    };
  } catch (error) {
    console.error('User registration error:', error);
    throw error;
  }
}

/**
 * 验证密码强度
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 生成密码重置令牌
 */
export async function generatePasswordResetToken(email: string): Promise<string> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // 生成重置令牌
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000); // 1小时后过期
    
    // 保存令牌到数据库
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });
    
    return token;
  } catch (error) {
    console.error('Password reset token generation error:', error);
    throw error;
  }
}

/**
 * 验证密码重置令牌
 */
export async function verifyPasswordResetToken(token: string): Promise<{
  isValid: boolean;
  email?: string;
}> {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });
    
    if (!verificationToken) {
      return { isValid: false };
    }
    
    // 检查令牌是否过期
    if (verificationToken.expires < new Date()) {
      // 删除过期令牌
      await prisma.verificationToken.delete({
        where: { token },
      });
      return { isValid: false };
    }
    
    return {
      isValid: true,
      email: verificationToken.identifier,
    };
  } catch (error) {
    console.error('Password reset token verification error:', error);
    return { isValid: false };
  }
}

/**
 * 重置密码
 */
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  try {
    // 验证令牌
    const tokenVerification = await verifyPasswordResetToken(token);
    
    if (!tokenVerification.isValid || !tokenVerification.email) {
      return false;
    }
    
    // 验证新密码
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(`Invalid password: ${passwordValidation.errors.join(', ')}`);
    }
    
    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // 更新用户密码
    await prisma.user.update({
      where: { email: tokenVerification.email },
      data: { password: hashedPassword },
    });
    
    // 删除使用过的令牌
    await prisma.verificationToken.delete({
      where: { token },
    });
    
    return true;
  } catch (error) {
    console.error('Password reset error:', error);
    return false;
  }
}

/**
 * 更改密码
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  try {
    // 获取用户
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user || !user.password) {
      return false;
    }
    
    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return false;
    }
    
    // 验证新密码
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(`Invalid password: ${passwordValidation.errors.join(', ')}`);
    }
    
    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // 更新密码
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    
    return true;
  } catch (error) {
    console.error('Password change error:', error);
    return false;
  }
}

/**
 * 删除用户账户
 */
export async function deleteUserAccount(userId: string): Promise<boolean> {
  try {
    await prisma.$transaction(async (tx) => {
      // 删除相关数据
      await tx.historyRecord.deleteMany({ where: { userId } });
      await tx.savedCalculation.deleteMany({ where: { userId } });
      await tx.session.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });
      
      // 删除用户
      await tx.user.delete({ where: { id: userId } });
    });
    
    return true;
  } catch (error) {
    console.error('Account deletion error:', error);
    return false;
  }
}

/**
 * 获取用户统计信息
 */
export async function getUserStats(userId: string) {
  try {
    const [user, calculationCount, historyCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          emailVerified: true,
        },
      }),
      prisma.savedCalculation.count({ where: { userId } }),
      prisma.historyRecord.count({ where: { userId } }),
    ]);
    
    return {
      user,
      stats: {
        savedCalculations: calculationCount,
        historyRecords: historyCount,
      },
    };
  } catch (error) {
    console.error('Get user stats error:', error);
    return null;
  }
}

/**
 * 类型扩展
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
    };
  }
  
  interface User {
    id: string;
    email: string;
    name: string;
    image: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    image: string;
    provider?: string;
    providerAccountId?: string;
  }
}