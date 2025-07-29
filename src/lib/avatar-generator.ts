/**
 * Avatar Generator Utility
 * Generates SVG avatars for users when no image is available
 */

interface AvatarOptions {
  name: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Generates initials from a full name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generates a color based on the name
 */
export function getColorFromName(name: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length] || '#4ECDC4';
}

/**
 * Generates an SVG avatar
 */
export function generateSVGAvatar(options: AvatarOptions): string {
  const {
    name,
    size = 40,
    backgroundColor = getColorFromName(name),
    textColor = '#FFFFFF'
  } = options;

  const initials = getInitials(name);
  const fontSize = size * 0.4;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${backgroundColor}"/>
      <text 
        x="${size / 2}" 
        y="${size / 2}" 
        text-anchor="middle" 
        dominant-baseline="central" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${fontSize}" 
        font-weight="600" 
        fill="${textColor}"
      >
        ${initials}
      </text>
    </svg>
  `.trim();
}

/**
 * Generates a data URL for an SVG avatar
 */
export function generateAvatarDataURL(options: AvatarOptions): string {
  const svg = generateSVGAvatar(options);
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Avatar component props
 */
export interface AvatarComponentProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * Predefined avatar data for demo users
 */
export const DEMO_AVATARS = {
  'Emma Johnson': {
    name: 'Emma Johnson',
    color: '#FF6B6B',
    initials: 'EJ'
  },
  'David Chen': {
    name: 'David Chen',
    color: '#4ECDC4',
    initials: 'DC'
  },
  'Maria Rodriguez': {
    name: 'Maria Rodriguez',
    color: '#45B7D1',
    initials: 'MR'
  },
  'Alex Thompson': {
    name: 'Alex Thompson',
    color: '#96CEB4',
    initials: 'AT'
  },
  'Sofia Kim': {
    name: 'Sofia Kim',
    color: '#FFEAA7',
    initials: 'SK'
  },
  'Marcus Williams': {
    name: 'Marcus Williams',
    color: '#DDA0DD',
    initials: 'MW'
  },
  'Sarah Davis': {
    name: 'Sarah Davis',
    color: '#98D8C8',
    initials: 'SD'
  },
  'Lisa Anderson': {
    name: 'Lisa Anderson',
    color: '#F7DC6F',
    initials: 'LA'
  }
};

/**
 * Gets avatar data for a demo user or generates new one
 */
export function getAvatarData(name: string) {
  const demoAvatar = DEMO_AVATARS[name as keyof typeof DEMO_AVATARS];
  
  if (demoAvatar) {
    return {
      dataURL: generateAvatarDataURL({
        name: demoAvatar.name,
        backgroundColor: demoAvatar.color
      }),
      initials: demoAvatar.initials,
      color: demoAvatar.color
    };
  }

  const color = getColorFromName(name);
  const initials = getInitials(name);
  
  return {
    dataURL: generateAvatarDataURL({ name, backgroundColor: color }),
    initials,
    color
  };
}
