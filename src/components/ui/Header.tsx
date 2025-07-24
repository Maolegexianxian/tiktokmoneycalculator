"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/Container';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
// NavigationMenu imports removed - using simple nav structure
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Calculator, User, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { data: session } = useSession();
  const t = useTranslations('header');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      title: t('nav.calculator'),
      href: '/#calculator',
      description: t('nav.calculatorDesc'),
    },
    {
      title: t('nav.features'),
      href: '/#features',
      description: t('nav.featuresDesc'),
    },
    {
      title: t('nav.howItWorks'),
      href: '/#how-it-works',
      description: t('nav.howItWorksDesc'),
    },
    {
      title: t('nav.faq'),
      href: '/#faq',
      description: t('nav.faqDesc'),
    },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('/#')) {
      const elementId = href.substring(2);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* 左侧：Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block">
                TikTok Calculator
              </span>
            </Link>
          </div>

          {/* 中间：桌面导航 */}
          <div className="hidden md:flex flex-1 justify-center">
            <nav className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* 右侧：用户操作和语言切换器 */}
          <div className="flex items-center space-x-2">
            {session ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                  <User className="h-4 w-4 mr-2" />
                  {t('nav.dashboard')}
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/signin">
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('nav.signIn')}
                </Link>
              </Button>
            )}

            {/* 语言切换器 */}
            <LanguageSwitcher variant="compact" />

            {/* 移动端菜单 */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden"
                  size="sm"
                  aria-label={t('nav.menu')}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <Calculator className="h-6 w-6 text-primary" />
                    <span className="font-bold">TikTok Calculator</span>
                  </div>
                  
                  {navigationItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => scrollToSection(item.href)}
                    >
                      {item.title}
                    </Button>
                  ))}
                  
                  <div className="pt-4 border-t">
                    {session ? (
                      <Button asChild className="w-full">
                        <Link href="/dashboard">
                          <User className="h-4 w-4 mr-2" />
                          {t('nav.dashboard')}
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link href="/auth/signin">
                          <LogIn className="h-4 w-4 mr-2" />
                          {t('nav.signIn')}
                        </Link>
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}