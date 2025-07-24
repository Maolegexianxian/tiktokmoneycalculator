"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/Container';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQ() {
  const t = useTranslations('faq');
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const faqItems: FAQItem[] = [
    {
      question: t('questions.accuracy.question'),
      answer: t('questions.accuracy.answer'),
      category: t('categories.general'),
    },
    {
      question: t('questions.requirements.question'),
      answer: t('questions.requirements.answer'),
      category: t('categories.general'),
    },
    {
      question: t('questions.revenue.question'),
      answer: t('questions.revenue.answer'),
      category: t('categories.earnings'),
    },
    {
      question: t('questions.frequency.question'),
      answer: t('questions.frequency.answer'),
      category: t('categories.technical'),
    },
    {
      question: t('questions.improve.question'),
      answer: t('questions.improve.answer'),
      category: t('categories.earnings'),
    },
  ];

  const categories = Array.from(new Set(faqItems.map(item => item.category)));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = selectedCategory 
    ? faqItems.filter(item => item.category === selectedCategory)
    : faqItems;

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      [t('categories.general')]: 'bg-blue-100 text-blue-800',
      [t('categories.pricing')]: 'bg-green-100 text-green-800',
      [t('categories.privacy')]: 'bg-purple-100 text-purple-800',
      [t('categories.technical')]: 'bg-orange-100 text-orange-800',
      [t('categories.earnings')]: 'bg-yellow-100 text-yellow-800',
      [t('categories.support')]: 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <div className="text-center space-y-4 mb-16">
          <Badge className="px-4 py-2 bg-blue-100 text-blue-800 border-0">
            <HelpCircle className="h-4 w-4 mr-2" />
            {t('badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Badge 
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors"
            onClick={() => setSelectedCategory(null)}
          >
            {t('categories.all')}
          </Badge>
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredItems.map((item, index) => {
            const isOpen = openItems.includes(index);
            return (
              <Card 
                key={index} 
                className="border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-0">
                  <button
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
                    onClick={() => toggleItem(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getCategoryColor(item.category)} border-0`}
                          >
                            {item.category}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {item.question}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="pt-4 text-gray-600 leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('contact.title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('contact.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@tiktokmoneycalculator.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  {t('contact.email')}
                </a>
                <a 
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  {t('contact.chat')}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {t('stats.responseTime.number')}
            </div>
            <div className="text-gray-600">
              {t('stats.responseTime.label')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {t('stats.satisfaction.number')}
            </div>
            <div className="text-gray-600">
              {t('stats.satisfaction.label')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {t('stats.resolved.number')}
            </div>
            <div className="text-gray-600">
              {t('stats.resolved.label')}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}