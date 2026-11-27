import type { Locale } from '@/i18n/types';

export interface WelcomeSuggestion {
  label: string;
  message: string;
}

const GREETINGS: Record<Locale, (name: string) => string> = {
  en: (name) => `Hi, ${name} — how can we help today?`,
  ko: (name) => `안녕하세요, ${name}님 — 오늘 무엇을 도와드릴까요?`,
  id: (name) => `Hai, ${name} — ada yang bisa kami bantu hari ini?`,
};

export const WELCOME_SUGGESTIONS: Record<Locale, WelcomeSuggestion[]> = {
  en: [
    {
      label: 'Cheapest picks',
      message: 'What are the cheapest products right now?',
    },
    {
      label: 'Beauty deals',
      message: 'Show me affordable beauty products',
    },
    {
      label: 'Gift ideas',
      message: 'Suggest gift ideas under $50',
    },
    {
      label: 'Top rated',
      message: 'What are the highest rated products?',
    },
  ],
  ko: [
    {
      label: '최저가 상품',
      message: '지금 가장 저렴한 상품을 보여줘',
    },
    {
      label: '뷰티 특가',
      message: '저렴한 뷰티 상품을 추천해줘',
    },
    {
      label: '선물 추천',
      message: '5만원 이하 선물 아이디어를 알려줘',
    },
    {
      label: '평점 높은 상품',
      message: '평점이 가장 높은 상품은 뭐야?',
    },
  ],
  id: [
    {
      label: 'Produk termurah',
      message: 'Apa produk termurah saat ini?',
    },
    {
      label: 'Promo kecantikan',
      message: 'Tunjukkan produk kecantikan yang terjangkau',
    },
    {
      label: 'Ide hadiah',
      message: 'Sarankan ide hadiah di bawah $50',
    },
    {
      label: 'Rating tertinggi',
      message: 'Apa produk dengan rating tertinggi?',
    },
  ],
};

export function getWelcomeGreeting(locale: Locale, name: string): string {
  return GREETINGS[locale](name);
}
