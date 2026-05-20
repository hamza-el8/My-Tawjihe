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
    formations: string;
    bacPath: string;
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
  bacPath: {
    headingSmall: string;
    headingLarge: string;
    intro: string;
    avantBac: { title: string; message: string; cta: string };
    apresBac: { title: string; message: string };
    avantBacDetail: {
      badge: string;
      heading: string;
      goal: string;
      guidanceNote: string;
      back: string;
      cards: Array<{
        id: string;
        title: string;
        subtitle: string;
        iconKey: BacStageIconKey;
        tags: string[];
        gradient: string;
        bg: string;
        ring: string;
      }>;
    };
    avantBacExplore: {
      breadcrumb: string;
      title: string;
      titleAccent: string;
      subtitle: string;
      overview: string;
      stagesTitle: string;
      careersTitle: string;
      careersNote: string;
      searchCareers: string;
      careerFiliereLabel: string;
      careerAccessLabel: string;
      careerQualitiesLabel: string;
      careerStageFilters: Record<AvantBacCareerStage | 'all', string>;
      careers: Array<{
        id: string;
        title: string;
        stage: AvantBacCareerStage;
        filiere: string;
        description: string;
        qualities: string[];
        pathway: string;
      }>;
      schoolsTitle: string;
      schoolsNote: string;
      searchSchools: string;
      filterAll: string;
      filterCollege: string;
      filterLycee: string;
      typeCollege: string;
      typeLycee: string;
      networkPublic: string;
      networkPrivate: string;
      stages: Array<{
        id: string;
        title: string;
        highlightTags: string[];
        iconKey: BacStageIconKey;
        gradient: string;
        bg: string;
        intro: string;
        topics: Array<{ title: string; description: string }>;
      }>;
      schools: Array<{
        name: string;
        city: string;
        type: 'college' | 'lycee';
        network: 'public' | 'private';
        stageLabel: string;
      }>;
    };
  };
  formations: {
    headingSmall: string;
    headingLarge: string;
    description: string;
    items: Array<{
      icon: string;
      color: string;
      svgKey: string;
      title: string;
      description: string;
      tags: string[];
      duration: string;
      level: string;
      access: string;
      intro: string;
      points: string[];
      careers: string[];
      emoji: string;
    }>;
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
