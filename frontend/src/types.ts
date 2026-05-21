export type Lang = 'fr' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface Translation {
  direction: Direction;
  nav: {
    home: string;
    news: string;
    testimonials: string;
    contact: string;
    login: string;
    signup: string;
  };
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    button: string;
    buttonSecondary: string;
    stats: Array<{ value: string; label: string }>;
  };
  news: {
    headingSmall: string;
    headingLarge: string;
    items: Array<{ image: string; date: string; category: string; title: string; excerpt: string; id: number }>;
  };
  tabs: {
    headingSmall: string;
    headingLarge: string;
    description: string;
    items: Array<{
      label: string;
      icon: string;
      title: string;
      description: string;
      features: string[];
      color: string;
      bg: string;
    }>;
  };
  cta: {
    badge: string;
    title: string;
    description: string;
    button: string;
    buttonSecondary: string;
  };
  advantages: {
    headingSmall: string;
    headingLarge: string;
    items: Array<{ icon: string; title: string; description: string }>;
  };
  testimonials: {
    headingSmall: string;
    headingLarge: string;
    items: Array<{ text: string; author: string; role: string; avatar: string }>;
  };
  contact: {
    headingSmall: string;
    headingLarge: string;
    headingAccent: string;
    description: string;
    email: string;
    phone: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    button: string;
    copyright: string;
  };
}
