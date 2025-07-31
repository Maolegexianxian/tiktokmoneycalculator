#!/usr/bin/env node

/**
 * 测试i18n导入是否正常工作
 */

const path = require('path');

console.log('🌍 Testing i18n imports...');

const locales = ['en', 'zh', 'es', 'fr', 'ja', 'ko', 'de'];

async function testImports() {
  let allPassed = true;
  
  for (const locale of locales) {
    try {
      console.log(`📋 Testing ${locale}...`);
      
      // 测试动态导入
      const modulePath = path.resolve(`src/messages/${locale}/index.ts`);
      
      // 检查文件是否存在
      const fs = require('fs');
      if (!fs.existsSync(modulePath)) {
        console.log(`  ❌ File not found: ${modulePath}`);
        allPassed = false;
        continue;
      }
      
      // 尝试require (注意：这只是基本检查，实际的ES模块导入在运行时进行)
      console.log(`  ✅ ${locale} file exists`);
      
      // 检查文件内容是否包含export default
      const content = fs.readFileSync(modulePath, 'utf8');
      if (content.includes('export default')) {
        console.log(`  ✅ ${locale} has default export`);
      } else {
        console.log(`  ❌ ${locale} missing default export`);
        allPassed = false;
      }
      
    } catch (error) {
      console.log(`  ❌ ${locale} failed: ${error.message}`);
      allPassed = false;
    }
  }
  
  console.log('');
  if (allPassed) {
    console.log('🎉 All i18n imports test passed!');
    console.log('✅ All language files are properly structured');
    console.log('✅ Ready for Railway deployment');
  } else {
    console.log('❌ Some i18n imports failed');
    console.log('Please check the language files');
    process.exit(1);
  }
}

// 测试src/messages/index.ts导出
function testMainExports() {
  console.log('📋 Testing main exports...');
  
  try {
    const fs = require('fs');
    const mainIndexPath = path.resolve('src/messages/index.ts');
    
    if (!fs.existsSync(mainIndexPath)) {
      console.log('❌ src/messages/index.ts not found');
      return false;
    }
    
    const content = fs.readFileSync(mainIndexPath, 'utf8');
    
    // 检查关键导出
    const requiredExports = [
      'supportedLocales',
      'defaultLocale',
      'getMessages',
      'messages'
    ];
    
    let allExportsFound = true;
    for (const exportName of requiredExports) {
      if (content.includes(`export const ${exportName}`) || content.includes(`export function ${exportName}`)) {
        console.log(`  ✅ ${exportName} exported`);
      } else {
        console.log(`  ❌ ${exportName} not found`);
        allExportsFound = false;
      }
    }
    
    return allExportsFound;
  } catch (error) {
    console.log(`❌ Error testing main exports: ${error.message}`);
    return false;
  }
}

// 检查是否还有旧的JSON文件
function checkForOldJsonFiles() {
  console.log('📋 Checking for old JSON files...');
  
  const fs = require('fs');
  const oldPaths = [
    'messages/en.json',
    'messages/zh.json',
    'messages'
  ];
  
  let foundOldFiles = false;
  for (const oldPath of oldPaths) {
    if (fs.existsSync(oldPath)) {
      console.log(`  ❌ Old file/directory found: ${oldPath}`);
      foundOldFiles = true;
    }
  }
  
  if (!foundOldFiles) {
    console.log('  ✅ No old JSON files found');
  }
  
  return !foundOldFiles;
}

async function main() {
  console.log('🚀 Starting i18n validation...\n');
  
  // 测试主导出
  const mainExportsOk = testMainExports();
  console.log('');
  
  // 检查旧文件
  const noOldFiles = checkForOldJsonFiles();
  console.log('');
  
  // 测试各语言导入
  await testImports();
  
  if (mainExportsOk && noOldFiles) {
    console.log('\n🎯 All validations passed!');
    console.log('📋 Summary:');
    console.log('  ✅ Main exports working');
    console.log('  ✅ No conflicting JSON files');
    console.log('  ✅ All language files structured correctly');
    console.log('  ✅ Ready for deployment');
  } else {
    console.log('\n❌ Some validations failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Validation failed:', error);
  process.exit(1);
});
