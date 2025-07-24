"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  X,
  Check,
} from 'lucide-react';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  newsletter: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  callbackUrl?: string;
  error?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
}

export function SignUpForm({ callbackUrl, error }: SignUpFormProps) {
  const t = useTranslations('auth.signup');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(error || null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      newsletter: true,
    },
  });

  const password = watch('password');
  const acceptTerms = watch('acceptTerms');
  const newsletter = watch('newsletter');

  // 密码强度检查
  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, label: '', color: 'bg-gray-200', suggestions: [] };
    }

    let score = 0;
    const suggestions: string[] = [];

    // 长度检查
    if (password.length >= 8) score += 1;
    else suggestions.push('At least 8 characters');

    // 大写字母
    if (/[A-Z]/.test(password)) score += 1;
    else suggestions.push('One uppercase letter');

    // 小写字母
    if (/[a-z]/.test(password)) score += 1;
    else suggestions.push('One lowercase letter');

    // 数字
    if (/\d/.test(password)) score += 1;
    else suggestions.push('One number');

    // 特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else suggestions.push('One special character (optional)');

    const strengthMap = {
      0: { label: 'Very Weak', color: 'bg-red-500' },
      1: { label: 'Weak', color: 'bg-red-400' },
      2: { label: 'Fair', color: 'bg-yellow-400' },
      3: { label: 'Good', color: 'bg-blue-400' },
      4: { label: 'Strong', color: 'bg-green-400' },
      5: { label: 'Very Strong', color: 'bg-green-500' },
    };

    return {
      score,
      label: strengthMap[score as keyof typeof strengthMap].label,
      color: strengthMap[score as keyof typeof strengthMap].color,
      suggestions,
    };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      // 调用注册API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          newsletter: data.newsletter,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      // 注册成功，显示成功消息
      setFormSuccess(t('success.registered'));

      // 自动登录
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        // 登录成功，重定向
        const redirectUrl = callbackUrl || '/dashboard';
        router.push(redirectUrl);
        router.refresh();
      } else {
        // 注册成功但登录失败，重定向到登录页面
        const params = new URLSearchParams();
        if (callbackUrl) params.set('callbackUrl', callbackUrl);
        params.set('message', 'registered');
        router.push(`/auth/signin?${params.toString()}`);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setFormError(error.message || t('errors.general'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {formError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {formError}
          </AlertDescription>
        </Alert>
      )}

      {formSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {formSuccess}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            {t('form.name.label')}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              type="text"
              placeholder={t('form.name.placeholder')}
              className={`pl-10 ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
              {...register('name')}
              disabled={isLoading}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            {t('form.email.label')}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder={t('form.email.placeholder')}
              className={`pl-10 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
              {...register('email')}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            {t('form.password.label')}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('form.password.placeholder')}
              className={`pl-10 pr-10 ${errors.password ? 'border-red-300 focus:border-red-500' : ''}`}
              {...register('password')}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Progress 
                    value={(passwordStrength.score / 5) * 100} 
                    className="h-2"
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {passwordStrength.label}
                </span>
              </div>
              {passwordStrength.suggestions.length > 0 && (
                <div className="text-xs text-gray-500">
                  <p className="mb-1">Password should include:</p>
                  <ul className="space-y-1">
                    {passwordStrength.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <X className="h-3 w-3 text-red-400" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            {t('form.confirmPassword.label')}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t('form.confirmPassword.placeholder')}
              className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}`}
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms and Newsletter */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
              disabled={isLoading}
              className="mt-1"
            />
            <label
              htmlFor="acceptTerms"
              className="text-sm text-gray-600 cursor-pointer leading-relaxed"
            >
              {t('form.acceptTerms.text')}{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium"
                onClick={() => {
                  // TODO: 打开服务条款
                  console.log('Terms clicked');
                }}
              >
                {t('form.acceptTerms.terms')}
              </button>
              {' '}{t('form.acceptTerms.and')}{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium"
                onClick={() => {
                  // TODO: 打开隐私政策
                  console.log('Privacy clicked');
                }}
              >
                {t('form.acceptTerms.privacy')}
              </button>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600 ml-6">{errors.acceptTerms.message}</p>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="newsletter"
              checked={newsletter || false}
              onCheckedChange={(checked) => setValue('newsletter', checked as boolean)}
              disabled={isLoading}
              className="mt-1"
            />
            <label
              htmlFor="newsletter"
              className="text-sm text-gray-600 cursor-pointer leading-relaxed"
            >
              {t('form.newsletter')}
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !acceptTerms}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('form.creatingAccount')}
          </>
        ) : (
          t('form.signUp')
        )}
      </Button>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {t('form.hasAccount')}{' '}
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              if (callbackUrl) {
                params.set('callbackUrl', callbackUrl);
              }
              const queryString = params.toString();
              router.push(`/auth/signin${queryString ? `?${queryString}` : ''}`);
            }}
            className="text-blue-600 hover:text-blue-500 font-medium"
            disabled={isLoading}
          >
            {t('form.signInLink')}
          </button>
        </p>
      </div>
    </form>
  );
}