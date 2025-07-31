#!/usr/bin/env node

/**
 * 测试语言切换和头像修复是否正常工作
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Testing language switcher and avatar fixes...');

function testLanguageSwitcher() {
  console.log('📋 Testing LanguageSwitcher component...');
  
  const switcherPath = 'src/components/ui/LanguageSwitcher.tsx';
  
  if (!fs.existsSync(switcherPath)) {
    console.log('  ❌ LanguageSwitcher.tsx not found');
    return false;
  }
  
  const content = fs.readFileSync(switcherPath, 'utf8');
  
  // 检查是否使用了正确的导入
  if (content.includes("import { useRouter, usePathname } from '@/routing';")) {
    console.log('  ✅ Using correct routing imports');
  } else {
    console.log('  ❌ Not using correct routing imports');
    return false;
  }
  
  // 检查是否使用了简化的语言切换逻辑
  if (content.includes("router.replace(pathname, { locale: languageCode });")) {
    console.log('  ✅ Using simplified language switching logic');
  } else {
    console.log('  ❌ Not using simplified language switching logic');
    return false;
  }
  
  // 检查是否移除了复杂的路径构建逻辑
  if (!content.includes('supportedLocales') || !content.includes('pathWithoutLocale')) {
    console.log('  ✅ Complex path building logic removed');
  } else {
    console.log('  ❌ Complex path building logic still present');
    return false;
  }
  
  return true;
}

function testAvatarReferences() {
  console.log('📋 Testing avatar references...');
  
  const componentsToCheck = [
    'src/components/sections/Testimonials.tsx',
    'src/components/sections/SocialProof.tsx',
    'src/components/sections/SuccessStories.tsx'
  ];
  
  let allPassed = true;
  
  for (const componentPath of componentsToCheck) {
    if (!fs.existsSync(componentPath)) {
      console.log(`  ❌ ${componentPath} not found`);
      allPassed = false;
      continue;
    }
    
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // 检查是否还有硬编码的头像路径
    const avatarPaths = [
      '/avatars/david.jpg',
      '/avatars/alex.jpg',
      '/avatars/lisa.jpg',
      '/avatars/sarah.jpg',
      '/avatars/emma.jpg',
      '/avatars/marcus.jpg',
      '/avatars/sofia.jpg',
      '/avatars/maria.jpg'
    ];
    
    let foundHardcodedPaths = false;
    for (const avatarPath of avatarPaths) {
      if (content.includes(avatarPath)) {
        console.log(`  ❌ ${componentPath} still contains hardcoded path: ${avatarPath}`);
        foundHardcodedPaths = true;
        allPassed = false;
      }
    }
    
    if (!foundHardcodedPaths) {
      console.log(`  ✅ ${componentPath} has no hardcoded avatar paths`);
    }
    
    // 检查是否使用了CustomAvatar
    if (content.includes('CustomAvatar')) {
      console.log(`  ✅ ${componentPath} uses CustomAvatar`);
    } else {
      console.log(`  ⚠️  ${componentPath} may not be using CustomAvatar`);
    }
    
    // 检查接口是否正确定义avatar为可选
    if (content.includes('avatar?: string') || content.includes('avatar?:')) {
      console.log(`  ✅ ${componentPath} has optional avatar interface`);
    } else if (content.includes('avatar: string')) {
      console.log(`  ❌ ${componentPath} still has required avatar interface`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

function testNextConfigImages() {
  console.log('📋 Testing Next.js images configuration...');
  
  const configPath = 'next.config.js';
  
  if (!fs.existsSync(configPath)) {
    console.log('  ❌ next.config.js not found');
    return false;
  }
  
  const content = fs.readFileSync(configPath, 'utf8');
  
  // 检查是否移除了domains配置
  if (!content.includes('domains:')) {
    console.log('  ✅ Deprecated domains configuration removed');
  } else {
    console.log('  ❌ Deprecated domains configuration still present');
    return false;
  }
  
  // 检查是否使用了remotePatterns
  if (content.includes('remotePatterns:')) {
    console.log('  ✅ Using modern remotePatterns configuration');
  } else {
    console.log('  ❌ Not using remotePatterns configuration');
    return false;
  }
  
  // 检查是否包含必要的域名
  const requiredDomains = [
    'images.unsplash.com',
    'avatars.githubusercontent.com',
    'lh3.googleusercontent.com'
  ];
  
  let allDomainsPresent = true;
  for (const domain of requiredDomains) {
    if (content.includes(domain)) {
      console.log(`  ✅ ${domain} configured in remotePatterns`);
    } else {
      console.log(`  ❌ ${domain} missing from remotePatterns`);
      allDomainsPresent = false;
    }
  }
  
  return allDomainsPresent;
}

function testTranslationKeys() {
  console.log('📋 Testing translation keys...');
  
  const zhCalculatorPath = 'src/messages/zh/calculator.ts';
  
  if (!fs.existsSync(zhCalculatorPath)) {
    console.log('  ❌ Chinese calculator translations not found');
    return false;
  }
  
  const content = fs.readFileSync(zhCalculatorPath, 'utf8');
  
  // 检查是否包含quickStart翻译
  if (content.includes('quickStart:')) {
    console.log('  ✅ quickStart translation key present in Chinese');
  } else {
    console.log('  ❌ quickStart translation key missing in Chinese');
    return false;
  }
  
  return true;
}

async function main() {
  console.log('🚀 Starting comprehensive fix validation...\n');
  
  // 测试语言切换器
  const languageSwitcherOk = testLanguageSwitcher();
  console.log('');
  
  // 测试头像引用
  const avatarReferencesOk = testAvatarReferences();
  console.log('');
  
  // 测试Next.js配置
  const nextConfigOk = testNextConfigImages();
  console.log('');
  
  // 测试翻译键
  const translationKeysOk = testTranslationKeys();
  console.log('');
  
  if (languageSwitcherOk && avatarReferencesOk && nextConfigOk && translationKeysOk) {
    console.log('🎉 All fixes validated successfully!');
    console.log('📋 Summary:');
    console.log('  ✅ Language switcher using correct routing');
    console.log('  ✅ Avatar references fixed');
    console.log('  ✅ Next.js images configuration modernized');
    console.log('  ✅ Translation keys complete');
    console.log('  ✅ Ready for deployment');
  } else {
    console.log('❌ Some fixes failed validation');
    console.log('📋 Issues found:');
    if (!languageSwitcherOk) console.log('  ❌ Language switcher issues');
    if (!avatarReferencesOk) console.log('  ❌ Avatar reference issues');
    if (!nextConfigOk) console.log('  ❌ Next.js configuration issues');
    if (!translationKeysOk) console.log('  ❌ Translation key issues');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Validation failed:', error);
  process.exit(1);
});
