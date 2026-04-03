import { CreateSubscriptionRequest } from '../types/subscription';

export interface SubscriptionPreset extends Omit<CreateSubscriptionRequest, 'billingDate'> {
  billingDate?: number;
  keywords?: string;
}

export const PRESETS: SubscriptionPreset[] = [
  // 영상
  { name: 'Netflix 광고형', price: 5500, billingCycle: 'monthly', category: 'video', color: '#E50914', icon: 'N', keywords: '넷플릭스 광고' },
  { name: 'Netflix 스탠다드', price: 13500, billingCycle: 'monthly', category: 'video', color: '#E50914', icon: 'N', keywords: '넷플릭스 스탠다드' },
  { name: 'Netflix 프리미엄', price: 17000, billingCycle: 'monthly', category: 'video', color: '#E50914', icon: 'N', keywords: '넷플릭스 프리미엄' },
  { name: 'YouTube Premium', price: 14900, billingCycle: 'monthly', category: 'video', color: '#FF0000', icon: 'YT', keywords: '유튜브 프리미엄' },
  { name: 'YouTube Premium 가족', price: 23900, billingCycle: 'monthly', category: 'video', color: '#FF0000', icon: 'YT', keywords: '유튜브 프리미엄 가족' },
  { name: 'Disney+', price: 9900, billingCycle: 'monthly', category: 'video', color: '#113CCF', icon: 'D+', keywords: '디즈니 디즈니플러스' },
  { name: 'Wavve', price: 10900, billingCycle: 'monthly', category: 'video', color: '#1B1464', icon: 'W', keywords: '웨이브' },
  { name: 'TVING', price: 10900, billingCycle: 'monthly', category: 'video', color: '#FF0558', icon: 'TV', keywords: '티빙' },
  { name: '쿠팡플레이', price: 7890, billingCycle: 'monthly', category: 'video', color: '#E4002B', icon: 'CP' },
  { name: '왓챠', price: 7900, billingCycle: 'monthly', category: 'video', color: '#FF0558', icon: 'WC', keywords: 'watcha' },

  // 음악
  { name: 'Spotify', price: 10900, billingCycle: 'monthly', category: 'music', color: '#1DB954', icon: 'S', keywords: '스포티파이' },
  { name: 'Apple Music', price: 10900, billingCycle: 'monthly', category: 'music', color: '#FC3C44', icon: 'AM', keywords: '애플뮤직 애플 뮤직' },
  { name: 'Apple Music 가족', price: 16900, billingCycle: 'monthly', category: 'music', color: '#FC3C44', icon: 'AM', keywords: '애플뮤직 가족' },
  { name: 'YouTube Music', price: 10900, billingCycle: 'monthly', category: 'music', color: '#FF0000', icon: 'YM', keywords: '유튜브 뮤직' },
  { name: 'Melon', price: 10900, billingCycle: 'monthly', category: 'music', color: '#00CD3C', icon: 'ML', keywords: '멜론' },
  { name: 'FLO', price: 10900, billingCycle: 'monthly', category: 'music', color: '#3F3FFF', icon: 'FL', keywords: '플로' },
  { name: 'Vibe', price: 10900, billingCycle: 'monthly', category: 'music', color: '#1EC800', icon: 'VB', keywords: '바이브 네이버뮤직' },

  // 생산성
  { name: 'ChatGPT Plus', price: 20, billingCycle: 'monthly', category: 'productivity', color: '#10A37F', icon: 'GP', currency: 'USD', keywords: '챗지피티 챗GPT 오픈AI' },
  { name: 'Claude Pro', price: 20, billingCycle: 'monthly', category: 'productivity', color: '#D97757', icon: 'CL', currency: 'USD', keywords: '클로드 앤트로픽' },
  { name: 'Notion', price: 10, billingCycle: 'monthly', category: 'productivity', color: '#000000', icon: 'No', currency: 'USD', keywords: '노션' },
  { name: 'GitHub Copilot', price: 10, billingCycle: 'monthly', category: 'productivity', color: '#24292E', icon: 'GH', currency: 'USD', keywords: '깃허브 코파일럿' },
  { name: 'Figma', price: 15, billingCycle: 'monthly', category: 'productivity', color: '#F24E1E', icon: 'Fi', currency: 'USD', keywords: '피그마' },
  { name: 'Adobe CC', price: 59.99, billingCycle: 'monthly', category: 'productivity', color: '#FF0000', icon: 'Ad', currency: 'USD', keywords: '어도비 포토샵 일러스트레이터' },
  { name: 'Microsoft 365', price: 8900, billingCycle: 'monthly', category: 'productivity', color: '#0078D4', icon: 'MS', keywords: '마이크로소프트 오피스 엑셀 워드' },

  // 클라우드
  { name: 'iCloud+ 50GB', price: 1100, billingCycle: 'monthly', category: 'cloud', color: '#3693F5', icon: 'iC', keywords: '아이클라우드' },
  { name: 'iCloud+ 200GB', price: 3300, billingCycle: 'monthly', category: 'cloud', color: '#3693F5', icon: 'iC', keywords: '아이클라우드' },
  { name: 'iCloud+ 2TB', price: 11000, billingCycle: 'monthly', category: 'cloud', color: '#3693F5', icon: 'iC', keywords: '아이클라우드' },
  { name: 'Google One 100GB', price: 2400, billingCycle: 'monthly', category: 'cloud', color: '#4285F4', icon: 'GO', keywords: '구글원 구글 원' },
  { name: 'Google One 2TB', price: 11900, billingCycle: 'monthly', category: 'cloud', color: '#4285F4', icon: 'GO', keywords: '구글원 구글 원' },
  { name: 'Dropbox Plus', price: 13900, billingCycle: 'monthly', category: 'cloud', color: '#0061FF', icon: 'DB', keywords: '드롭박스' },

  // 게임
  { name: 'Xbox Game Pass', price: 10900, billingCycle: 'monthly', category: 'game', color: '#107C10', icon: 'XB', keywords: '엑스박스 게임패스' },
  { name: 'PlayStation Plus', price: 9900, billingCycle: 'monthly', category: 'game', color: '#003791', icon: 'PS', keywords: '플레이스테이션 플스 PS플러스' },
  { name: 'Nintendo Switch Online', price: 4900, billingCycle: 'monthly', category: 'game', color: '#E60012', icon: 'NS', keywords: '닌텐도 스위치 온라인' },
  { name: 'Apple Arcade', price: 8900, billingCycle: 'monthly', category: 'game', color: '#0070C9', icon: 'AA', keywords: '애플 아케이드' },

  // 뉴스/읽기
  { name: '밀리의서재', price: 9900, billingCycle: 'monthly', category: 'news', color: '#F5C518', icon: '밀', keywords: '밀리 서재' },
  { name: '리디셀렉트', price: 9900, billingCycle: 'monthly', category: 'news', color: '#1F8CE6', icon: '리', keywords: '리디 리디북스' },
  { name: '네이버플러스 멤버십', price: 4900, billingCycle: 'monthly', category: 'news', color: '#03C75A', icon: 'N+', keywords: '네이버 플러스 멤버십 네플' },
  { name: 'YES24 북클럽', price: 6500, billingCycle: 'monthly', category: 'news', color: '#1A73E8', icon: 'Y2', keywords: '예스24' },

  // 건강/운동
  { name: 'Apple Fitness+', price: 12900, billingCycle: 'monthly', category: 'health', color: '#92E643', icon: 'AF', keywords: '애플 피트니스' },
  { name: 'Nike Training Club', price: 6900, billingCycle: 'monthly', category: 'health', color: '#111111', icon: 'NK', keywords: '나이키 트레이닝' },
  { name: '눔(Noom)', price: 59000, billingCycle: 'monthly', category: 'health', color: '#00A86B', icon: 'Nm', keywords: '눔 다이어트' },

  // 기타
  { name: 'Coupang 로켓와우', price: 7890, billingCycle: 'monthly', category: 'other', color: '#E4002B', icon: 'CW', keywords: '쿠팡 로켓와우 로켓' },
  { name: '배달의민족 클럽', price: 5990, billingCycle: 'monthly', category: 'other', color: '#2AC1BC', icon: '배', keywords: '배민 배달 민족' },
  { name: '카카오톡 이모티콘 플러스', price: 4900, billingCycle: 'monthly', category: 'other', color: '#FAE100', icon: 'KT', keywords: '카톡 이모티콘' },
];
