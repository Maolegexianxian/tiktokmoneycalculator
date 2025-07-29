"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function LanguageSwitcher({ className, variant = 'default' }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    // 获取当前路径，移除语言前缀
    // 支持的语言代码列表
    const supportedLocales = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de'];
    
    let pathWithoutLocale = pathname;
    
    // 检查路径是否以支持的语言代码开头
    for (const locale of supportedLocales) {
      const localePrefix = `/${locale}`;
      if (pathname.startsWith(localePrefix + '/') || pathname === localePrefix) {
        pathWithoutLocale = pathname.substring(localePrefix.length) || '/';
        break;
      }
    }
    
    // 如果路径不是以语言代码开头，说明是默认语言(en)
    if (pathWithoutLocale === pathname && !pathname.startsWith('/en')) {
      pathWithoutLocale = pathname;
    }
    
    // 构建新的路径
    const newPath = languageCode === 'en' 
      ? pathWithoutLocale === '/' ? '/' : pathWithoutLocale
      : `/${languageCode}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    
    // 导航到新路径
    router.push(newPath);
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground",
              className
            )}
            aria-label={t('languageSwitcher.label')}
          >
            <span className="text-lg">{currentLanguage?.flag || '🌐'}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <span className="text-base">{language.flag}</span>
                <span className="text-sm">{language.nativeName}</span>
              </div>
              {currentLocale === language.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center space-x-2 h-9 px-3 hover:bg-accent hover:text-accent-foreground",
            className
          )}
          aria-label={t('languageSwitcher.label')}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">{currentLanguage?.nativeName || 'Language'}</span>
          <span className="sm:hidden">{currentLanguage?.flag || '🌐'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
          {t('languageSwitcher.selectLanguage')}
        </div>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{language.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{language.nativeName}</span>
                <span className="text-xs text-muted-foreground">{language.name}</span>
              </div>
            </div>
            {currentLocale === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}