import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 创建示例用户
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
      preferredLanguage: 'en',
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  // 创建示例历史记录
  const sampleHistoryData = [
    {
      platform: 'tiktok',
      inputData: JSON.stringify({
        followers: 100000,
        avgViews: 50000,
        engagementRate: 5.2,
        contentNiche: 'entertainment',
        audienceLocation: 'US',
      }),
      resultData: JSON.stringify({
        monthlyEarnings: 2500,
        yearlyEarnings: 30000,
        breakdown: {
          creatorFund: 500,
          brandDeals: 1500,
          liveGifts: 300,
          merchandise: 200,
        },
      }),
    },
    {
      platform: 'youtube',
      inputData: JSON.stringify({
        subscribers: 50000,
        avgViews: 25000,
        engagementRate: 4.8,
        contentNiche: 'education',
        audienceLocation: 'US',
      }),
      resultData: JSON.stringify({
        monthlyEarnings: 1800,
        yearlyEarnings: 21600,
        breakdown: {
          adRevenue: 1200,
          sponsorships: 400,
          memberships: 200,
        },
      }),
    },
  ];

  for (const historyItem of sampleHistoryData) {
    await prisma.historyRecord.create({
      data: {
        userId: demoUser.id,
        ...historyItem,
      },
    });
  }

  console.log('✅ Created sample calculation history');

  // 创建示例保存的计算
  const savedCalculation = await prisma.savedCalculation.create({
    data: {
      userId: demoUser.id,
      name: 'My TikTok Strategy',
      platform: 'tiktok',
      inputData: JSON.stringify({
        followers: 150000,
        avgViews: 75000,
        engagementRate: 6.1,
        contentNiche: 'lifestyle',
        audienceLocation: 'US',
      }),
      resultData: JSON.stringify({
        monthlyEarnings: 3200,
        yearlyEarnings: 38400,
        breakdown: {
          creatorFund: 600,
          brandDeals: 2000,
          liveGifts: 400,
          merchandise: 200,
        },
      }),
    },
  });

  console.log('✅ Created sample saved calculation');

  console.log('✅ Sample data creation completed');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
