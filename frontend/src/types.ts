export type Lang = 'fr' | 'ar';
export type Direction = 'ltr' | 'rtl';
export type BacStageIconKey = 'college' | 'tronc' | 'bac1' | 'bac2' | 'pathAvant' | 'pathApres';
export type AvantBacCareerStage = 'college' | 'tronc' | '1bac';

export interface Translation {
  direction: Direction;
  nav: {
    home: string;
    news: string;
    testimonials: string;
    contact: string;
    login: string;
    signup: string;
    features: string;
    formations?: string;
    bacPath?: string;
    worldMap?: string;
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

  aiEcosystem: {
  badge: string;
  title1: string;
  title2: string;
  subtitle: string;
  core: string;

  student: {
    title: string;
    subtitle: string;
    button: string;
    features: string[];
  };

  parent: {
    title: string;
    subtitle: string;
    button: string;
    features: string[];
  };

  teacher: {
    title: string;
    subtitle: string;
    button: string;
    features: string[];
  };
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formations?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bacPath?: any;
  // Allow additional keys for extended translations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
