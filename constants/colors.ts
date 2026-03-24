export const COLORS = {
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#2D3436',
  textSecondary: '#636E72',
  textMuted: '#B2BEC3',
  border: '#E9ECEF',
  danger: '#E17055',
  success: '#00B894',
  warning: '#FDCB6E',
  categoryColors: [
    '#6C5CE7', '#00B894', '#E17055', '#0984E3',
    '#FDCB6E', '#E84393', '#00CEC9', '#FF7675',
  ],
} as const;

export const CATEGORIES = [
  { label: '영상', value: 'video', icon: '🎬' },
  { label: '음악', value: 'music', icon: '🎵' },
  { label: '게임', value: 'game', icon: '🎮' },
  { label: '클라우드', value: 'cloud', icon: '☁️' },
  { label: '생산성', value: 'productivity', icon: '📋' },
  { label: '뉴스/읽기', value: 'news', icon: '📰' },
  { label: '건강/운동', value: 'health', icon: '💪' },
  { label: '기타', value: 'other', icon: '📦' },
] as const;
