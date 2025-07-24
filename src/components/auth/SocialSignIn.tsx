"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  AlertCircle,
  Github,
} from 'lucide-react';

interface SocialSignInProps {
  callbackUrl?: string;
  mode?: 'signin' | 'signup';
}

interface SocialProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverColor: string;
  textColor: string;
}

export function SocialSignIn({ callbackUrl, mode = 'signin' }: SocialSignInProps) {
  const t = useTranslations(`auth.${mode}`);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const providers: SocialProvider[] = [
    {
      id: 'google',
      name: 'Google',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
      bgColor: 'bg-white',
      hoverColor: 'hover:bg-gray-50',
      textColor: 'text-gray-900',
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: <Github className="h-5 w-5" />,
      bgColor: 'bg-gray-900',
      hoverColor: 'hover:bg-gray-800',
      textColor: 'text-white',
    },
  ];

  const handleSocialSignIn = async (providerId: string) => {
    setLoadingProvider(providerId);
    setError(null);

    try {
      const result = await signIn(providerId, {
        callbackUrl: callbackUrl || '/dashboard',
        redirect: true,
      });

      if (result?.error) {
        setError(t('errors.socialSignIn'));
      }
    } catch (error) {
      console.error(`${providerId} sign in error:`, error);
      setError(t('errors.general'));
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {providers.map((provider) => {
          const isLoading = loadingProvider === provider.id;
          
          return (
            <Button
              key={provider.id}
              type="button"
              variant="outline"
              className={`w-full ${provider.bgColor} ${provider.hoverColor} ${provider.textColor} border-gray-300 transition-colors duration-200`}
              onClick={() => handleSocialSignIn(provider.id)}
              disabled={!!loadingProvider}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <span className="mr-2">{provider.icon}</span>
              )}
              {isLoading
                ? t('form.connecting')
                : mode === 'signin'
                ? t('form.signInWith', { provider: provider.name })
                : t('form.signUpWith', { provider: provider.name })
              }
            </Button>
          );
        })}
      </div>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500 leading-relaxed">
          {t('security.notice')}
        </p>
      </div>

      {/* Benefits for Social Sign In */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          {t('social.benefits.title')}
        </h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
            <span>{t('social.benefits.fast')}</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
            <span>{t('social.benefits.secure')}</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
            <span>{t('social.benefits.noPassword')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}