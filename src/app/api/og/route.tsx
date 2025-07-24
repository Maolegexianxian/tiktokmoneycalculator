import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tiktokmoneycalculator.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters from URL
    const title = searchParams.get('title') || 'TikTok Money Calculator';
    const subtitle = searchParams.get('subtitle') || 'Calculate Your Creator Earnings';
    const platform = searchParams.get('platform') || 'tiktok';
    const earnings = searchParams.get('earnings');
    const followers = searchParams.get('followers');
    const theme = searchParams.get('theme') || 'default';

    // Platform-specific styling
    const platformConfig = {
      tiktok: {
        gradient: 'from-black via-gray-900 to-black',
        accent: '#ff0050',
        icon: '🎵',
        name: 'TikTok'
      },
      instagram: {
        gradient: 'from-purple-600 via-pink-600 to-orange-500',
        accent: '#E4405F',
        icon: '📷',
        name: 'Instagram'
      },
      youtube: {
        gradient: 'from-red-600 via-red-700 to-red-800',
        accent: '#FF0000',
        icon: '📺',
        name: 'YouTube'
      }
    };

    const config = platformConfig[platform as keyof typeof platformConfig] || platformConfig.tiktok;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${config.gradient.replace('from-', '').replace('via-', '').replace('to-', '').split(' ').join(', ')})`,
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}
          />
          
          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* Platform Icon */}
            <div
              style={{
                fontSize: '120px',
                marginBottom: '40px',
              }}
            >
              {config.icon}
            </div>
            
            {/* Title */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '20px',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
            
            {/* Subtitle */}
            <div
              style={{
                fontSize: '36px',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '40px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {subtitle}
            </div>
            
            {/* Earnings Display */}
            {earnings && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '30px 50px',
                  marginBottom: '30px',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: config.accent,
                    marginRight: '20px',
                  }}
                >
                  💰
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      color: 'rgba(255,255,255,0.8)',
                      marginBottom: '5px',
                    }}
                  >
                    Estimated Monthly Earnings
                  </div>
                  <div
                    style={{
                      fontSize: '48px',
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  >
                    {earnings}
                  </div>
                </div>
              </div>
            )}
            
            {/* Followers Display */}
            {followers && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '15px',
                  padding: '20px 40px',
                  marginBottom: '30px',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    marginRight: '15px',
                  }}
                >
                  👥
                </div>
                <div
                  style={{
                    fontSize: '28px',
                    color: 'white',
                  }}
                >
                  {followers} followers
                </div>
              </div>
            )}
            
            {/* Platform Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: config.accent,
                borderRadius: '50px',
                padding: '15px 30px',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              {config.name} Calculator
            </div>
          </div>
          
          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '24px',
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
            }}
          >
            tiktokmoneycalculator.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('Error generating OG image:', e);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
