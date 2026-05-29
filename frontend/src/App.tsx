import { useState, useEffect } from 'react';

import type React from 'react';

import Inscription from './Inscription';

import Dashboard from './Dashboard';

import type { Translation, Lang, BacStageIconKey, AvantBacCareerStage } from './types';
import { translations } from './translations/index';

import { useAuth } from './AuthContext';

import AIEcosystem from './components/AIEcosystem';

import { ErrorBoundary } from './components/ErrorBoundary';

import SmartChatbot from './components/SmartChatbot';
import WorldMapPage from './components/WorldMapPage';

// ─── Translations ─────────────────────────────────────────────────────────────
// Translations are now imported from ./translations/index
// The inline translation data was extracted to:
//   frontend/src/translations/fr.ts  (58KB)
//   frontend/src/translations/ar.ts  (66KB)
//   frontend/src/translations/index.ts (barrel export)

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const MenuIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);

const CloseIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);



// ─── Formation SVG Icons ───────────────────────────────────────────────────────

const FormationIcons: Record<string, () => React.ReactElement> = {

  engineer:   () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>),

  master_spe: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>),

  doctorat:   () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0H5a2 2 0 00-2 2v4a2 2 0 002 2h4m0-6h10a2 2 0 012 2v4a2 2 0 01-2 2H9m0 0v-6"/></svg>),

  licence:    () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="13" y2="13"/></svg>),

  encg:       () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>),

  master:     () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>),

  dut:        () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>),

  bachelor:   () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>),

  deug:       () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>),

  cpge:       () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),

  bac:        () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="9" y1="11" x2="11" y2="11"/></svg>),

  bts:        () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>),

};

const SendIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>);

const ChevronDownIcon = ({ className = '' }: { className?: string }) => (

  <svg

    className={`w-5 h-5 flex-shrink-0 ${className}`}

    fill="none"

    stroke="currentColor"

    viewBox="0 0 24 24"

    aria-hidden

  >

    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />

  </svg>

);



function BacStageIcon({ name, className = 'w-6 h-6' }: { name: BacStageIconKey; className?: string }) {

  const icons: Record<BacStageIconKey, () => React.ReactElement> = {

    college: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />

      </svg>

    ),

    tronc: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M12 3v18M3 12h18M7 7l10 10M17 7L7 17" />

      </svg>

    ),

    bac1: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" />

      </svg>

    ),

    bac2: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M12 15l-4 2V9l4-2 4 2v8l-4-2z" /><path d="M22 10v6M2 10l10-5 10 5-10 5z" />

      </svg>

    ),

    pathAvant: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />

        <path d="M8 7h8M8 11h6" />

      </svg>

    ),

    pathApres: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />

      </svg>

    ),

  };

  const Icon = icons[name];

  return <Icon />;

}



type CareerIconKey =

  | 'militaire' | 'sportif' | 'mecanicien' | 'coiffeur' | 'agriculteur' | 'artiste'

  | 'gendarme' | 'pompier' | 'cuisinier' | 'electricien' | 'infirmier' | 'commercant'

  | 'medecin' | 'ingenieur' | 'technicien' | 'pilote' | 'enseignant' | 'entrepreneur';



const CAREER_ICON_KEYS: CareerIconKey[] = [

  'militaire', 'sportif', 'mecanicien', 'coiffeur', 'agriculteur', 'artiste',

  'gendarme', 'pompier', 'cuisinier', 'electricien', 'infirmier', 'commercant',

  'medecin', 'ingenieur', 'technicien', 'pilote', 'enseignant', 'entrepreneur',

];



function careerIconKeyFromId(id: string): CareerIconKey {

  if (id.startsWith('militaire')) return 'militaire';

  if (id.startsWith('infirmier')) return 'infirmier';

  if (id.startsWith('technicien')) return 'technicien';

  const base = id.split('-')[0];

  return CAREER_ICON_KEYS.includes(base as CareerIconKey) ? (base as CareerIconKey) : 'entrepreneur';

}



function CareerIcon({ id, className = 'w-5 h-5' }: { id: string; className?: string }) {

  const name = careerIconKeyFromId(id);

  const icons: Record<CareerIconKey, () => React.ReactElement> = {

    militaire: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />

        <path d="M9 12l2 2 4-4" />

      </svg>

    ),

    sportif: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7" /><path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7" />

        <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />

        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" /><path d="M18 2H6v7a6 6 0 0012 0V2z" />

      </svg>

    ),

    mecanicien: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />

      </svg>

    ),

    coiffeur: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />

        <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />

        <line x1="8.12" y1="8.12" x2="12" y2="12" />

      </svg>

    ),

    agriculteur: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M7 20h10" /><path d="M12 20v-8" /><path d="M12 12c-2-2.5-5-3.5-5-6a5 5 0 0110 0c0 2.5-3 3.5-5 6z" />

      </svg>

    ),

    artiste: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />

      </svg>

    ),

    gendarme: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M12 2l2.4 4.8 5.4.8-3.9 3.8.9 5.3L12 14.3l-4.8 2.4.9-5.3-3.9-3.8 5.4-.8L12 2z" />

        <path d="M8 21h8" /><path d="M12 17v4" />

      </svg>

    ),

    pompier: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />

      </svg>

    ),

    cuisinier: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" /><path d="M7 2v20" />

        <path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />

      </svg>

    ),

    electricien: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />

      </svg>

    ),

    infirmier: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z" />

        <path d="M12 5v6M9 8h6" />

      </svg>

    ),

    commercant: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />

        <path d="M16 10a4 4 0 01-8 0" />

      </svg>

    ),

    medecin: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />

      </svg>

    ),

    ingenieur: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />

      </svg>

    ),

    technicien: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />

        <line x1="12" y1="12" x2="12" y2="16" /><line x1="8" y1="12" x2="8" y2="12" /><line x1="16" y1="12" x2="16" y2="12" />

      </svg>

    ),

    pilote: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />

      </svg>

    ),

    enseignant: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />

      </svg>

    ),

    entrepreneur: () => (

      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>

        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />

        <path d="M2 13h20" />

      </svg>

    ),

  };

  const Icon = icons[name];

  return <Icon />;

}



// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHeading({ small, large, accent, center = true }: { small: string; large: string; accent?: string; center?: boolean }) {

  return (

    <div className={`mb-12 ${center ? 'text-center' : ''}`}>

      <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">{small}</span>

      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">

        {large}{' '}{accent && <span className="gradient-text">{accent}</span>}

      </h2>

    </div>

  );

}



// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({

  language,

  setLanguage,

  t,

  setShowLoginModal,

  setOpenChat,

  setShowSignupModal,

  onOpenWorldMap,

}: any) {

  const [scrolled, setScrolled] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [activeSection, setActiveSection] = useState('top');



  useEffect(() => {

    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);



  const navLinks = [

    { href: '#top', label: t.nav.home, id: 'top' },

    { href: '#bac-path', label: t.nav.bacPath, id: 'bac-path' },

    { href: '#formations', label: t.nav.formations, id: 'formations' },

    { href: '#world-map', label: t.nav.worldMap, id: 'world-map' },

    { href: '#advantages', label: t.nav.testimonials, id: 'advantages' },

    { href: '#news', label: t.nav.news, id: 'news' },

    { id: 'features', href: '#features', label: t.nav.features },

    { href: '#contact', label: t.nav.contact, id: 'contact' },

  ];

  const navLinksAfterMap: { href: string; label: string; id: string }[] = [];



  const scrollTo = (_href: string, id: string) => {

    setMobileOpen(false); setActiveSection(id);

    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  };

  

  return (

    <nav dir={t.direction} className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>

      

      <div className="w-full px-4 sm:px-6 lg:px-10">

        <div className="flex items-center justify-between h-16 md:h-20">

          <a href="#top" onClick={(e) => { e.preventDefault(); scrollTo('#top', 'top'); }} className="flex items-center gap-2 flex-shrink-0">

            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center shadow-lg"><span className="text-white font-black text-lg">M</span></div>

            <span className={`font-black text-xl ${scrolled ? 'text-gray-900' : 'text-white'}`}>My<span className="gradient-text">Tawjeh</span></span>

          </a>

          <div className="hidden md:flex items-center justify-center flex-1 mx-4 gap-0.5">

            {navLinks.map((link) => (

              <a key={link.id} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href, link.id); }}

                className={`nav-link-animated px-3 py-2 rounded-lg text-base font-medium whitespace-nowrap transition-colors duration-200 ${scrolled ? activeSection === link.id ? 'text-purple-700' : 'text-gray-700 hover:text-purple-700' : activeSection === link.id ? 'text-purple-300' : 'text-white/90 hover:text-white'} ${activeSection === link.id ? 'active' : ''}`}>

                {link.label}

              </a>

            ))}

            {navLinksAfterMap.map((link) => (

              <a key={link.id} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href, link.id); }}

                className={`nav-link-animated px-3 py-2 rounded-lg text-base font-medium whitespace-nowrap transition-colors duration-200 ${scrolled ? activeSection === link.id ? 'text-purple-700' : 'text-gray-700 hover:text-purple-700' : activeSection === link.id ? 'text-purple-300' : 'text-white/90 hover:text-white'} ${activeSection === link.id ? 'active' : ''}`}>

                {link.label}

              </a>

            ))}

          </div>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">

            <button onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')} className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all duration-200 ${scrolled ? 'border-purple-300 text-purple-700 hover:bg-purple-50' : 'border-white/50 text-white hover:bg-white/10'}`}>

              {language === 'fr' ? 'العربية' : 'Français'}

            </button>

            <button onClick={() => setShowLoginModal(true)} className={`px-4 py-2 rounded-full text-base font-medium transition-all duration-200 ${scrolled ? 'text-purple-700 hover:bg-purple-50' : 'text-white/90 hover:bg-white/10'}`}>{t.nav.login}</button>

            <button onClick={() => setShowSignupModal(true)} className="btn-gradient text-white px-5 py-2 rounded-full text-base font-medium shadow-lg">{t.nav.signup}</button>

          </div>

          <div className="md:hidden flex items-center gap-2">

            <button onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')} className={`px-2 py-1 rounded-full text-xs font-bold border ${scrolled ? 'border-purple-300 text-purple-700' : 'border-white/50 text-white'}`}>{language === 'fr' ? 'ع' : 'FR'}</button>

            <button onClick={() => setMobileOpen(!mobileOpen)} className={`p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}>{mobileOpen ? <CloseIcon /> : <MenuIcon />}</button>

          </div>

        </div>

      </div>

      {mobileOpen && (

        <div className="md:hidden mobile-menu-enter bg-white shadow-xl border-t border-gray-100">

          <div className="px-4 py-4 space-y-1">

            {navLinks.map((link) => (

              <a key={link.id} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href, link.id); }} className="block px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors">{link.label}</a>

            ))}

            {navLinksAfterMap.map((link) => (

              <a key={link.id} href={link.href} onClick={(e) => { e.preventDefault(); scrollTo(link.href, link.id); }} className="block px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors">{link.label}</a>

            ))}

            <div className="pt-3 flex gap-2">

              <button onClick={() => setShowLoginModal(true)} className="flex-1 text-center py-2 rounded-full border border-purple-300 text-purple-700 text-sm font-medium">{t.nav.login}</button>

              <button onClick={() => setShowSignupModal(true)} className="flex-1 text-center py-2 rounded-full btn-gradient text-white text-sm font-semibold">{t.nav.signup}</button>

            </div>

          </div>

        </div>

      )}

    </nav>

  );

}



// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ t }: { t: Translation }) {

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (

    <section id="top" className="relative min-h-screen hero-gradient flex items-center overflow-hidden pt-16">

      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 opacity-20 rounded-full animate-blob" />

      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600 opacity-15 rounded-full animate-blob animation-delay-2000" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 opacity-10 rounded-full animate-blob animation-delay-4000" />

      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div className="animate-fade-in-up">

            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium mb-6">

              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />{t.hero.badge}

            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">

              {t.hero.title}{' '}

              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">{t.hero.titleAccent}</span>

            </h1>

            <p className="text-lg text-white/75 mb-8 leading-relaxed max-w-xl">{t.hero.subtitle}</p>

            <div className="flex flex-wrap gap-4 mb-12">

              <button onClick={() => scrollTo('contact')} className="btn-gradient text-white px-8 py-4 rounded-full font-bold text-base shadow-xl">{t.hero.button} →</button>

              <button onClick={() => scrollTo('news')} className="px-8 py-4 rounded-full font-bold text-base text-white border-2 border-white/30 hover:bg-white/10 transition-all">{t.hero.buttonSecondary}</button>

            </div>

            <div className="grid grid-cols-3 gap-6">

              {t.hero.stats.map((stat, i) => (

                <div key={i} className="text-center">

                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>

                  <div className="text-white/60 text-xs font-medium">{stat.label}</div>

                </div>

              ))}

            </div>

          </div>

          <div className="hidden lg:flex justify-center items-center animate-float">

            <div className="relative w-full max-w-lg">

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-400/30 to-indigo-600/30 blur-3xl" />

              <img src="/hero-illustration.png" alt="AI Orientation Platform" className="relative z-10 w-full rounded-3xl shadow-2xl border border-white/10" />

              {/* <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 z-20 animate-float" style={{ animationDelay: '0.5s' }}> */}

                {/* <div className="flex items-center gap-2">

                  <span className="text-2xl">🎯</span>

                  <div><div className="text-xs font-bold text-gray-800">Taux de réussite</div><div className="text-lg font-black gradient-text">95%</div></div>

                </div> */}

              {/* </div> */}

              {/* <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 z-20 animate-float" style={{ animationDelay: '1s' }}> */}

                {/* <div className="flex items-center gap-2">

                  <span className="text-2xl">🤖</span>

                  <div><div className="text-xs font-bold text-gray-800">IA Active</div><div className="text-sm font-semibold text-green-500">En ligne</div></div>

                </div> */}

              {/* </div> */}

            </div>

          </div>

        </div>

      </div>

      <div className="absolute bottom-0 inset-x-0">

        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">

          <path d="M0 80L1440 80L1440 40C1440 40 1080 0 720 0C360 0 0 40 0 40L0 80Z" fill="white" />

        </svg>

      </div>

    </section>

  );

}



// ─── News Carousel ────────────────────────────────────────────────────────────

function NewsCarousel({ t }: { t: Translation }) {

  const [active, setActive] = useState(0);

  const len = t.news.items.length;

  const isRtl = t.direction === 'rtl';

  useEffect(() => { const timer = setInterval(() => setActive((p) => (p + 1) % len), 5000); return () => clearInterval(timer); }, [len]);

  return (

    <section id="news" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading small={t.news.headingSmall} large={t.news.headingLarge} />

        <div className="relative">

          <div className="overflow-hidden rounded-3xl">

            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${isRtl ? active * 100 : -active * 100}%)` }}>

              {t.news.items.map((item, i) => (

                <div key={i} className="min-w-full">

                  <div className="grid md:grid-cols-2 gap-8 items-center p-8">

                    <div className="order-2 md:order-1">

                      <div className="flex items-center gap-3 mb-4">

                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{item.category}</span>

                        <span className="text-gray-500 text-sm">{item.date}</span>

                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{item.title}</h3>

                      <p className="text-gray-600 mb-6">{item.excerpt}</p>

                    </div>

                    <div className="order-1 md:order-2">

                      <div className="rounded-2xl overflow-hidden shadow-xl">

                        <img src={item.image} alt={item.title} className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-500" />

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          <div className="flex justify-center gap-2 mt-8">

            {t.news.items.map((_, i) => (

              <button key={i} onClick={() => setActive(i)} className={`transition-all duration-300 rounded-full ${active === i ? 'w-8 h-2.5 bg-blue-600' : 'w-2.5 h-2.5 bg-blue-200'}`} />

            ))}

          </div>

        </div>

      </div>

    </section>

  );

}



// ─── CTA Section ──────────────────────────────────────────────────────────────

function CTASection({ t, onSignup }: { t: Translation; onSignup: () => void }) {

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (

    <section className="py-24 bg-white overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="relative rounded-3xl hero-gradient overflow-hidden p-10 md:p-16">

          <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500 opacity-20 rounded-full animate-blob" />

          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-600 opacity-15 rounded-full animate-blob animation-delay-2000" />

          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">

            <div>

              <span className="inline-block px-4 py-1.5 bg-white/15 border border-white/25 rounded-full text-white/90 text-xs font-bold uppercase tracking-widest mb-5">{t.cta.badge}</span>

              <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">{t.cta.title}</h2>

              <p className="text-white/75 mb-8 leading-relaxed">{t.cta.description}</p>

              <div className="flex flex-wrap gap-4">

                <button onClick={onSignup} className="bg-white text-purple-700 px-7 py-3.5 rounded-full font-bold shadow-xl hover:-translate-y-1 transition-all">{t.cta.button}</button>

                <button onClick={() => scrollTo('news')} className="border-2 border-white/40 text-white px-7 py-3.5 rounded-full font-bold hover:bg-white/10 transition-all">{t.cta.buttonSecondary}</button>

              </div>

            </div>

            <div className="hidden lg:flex justify-center">

              <img src="/cta-image.png" alt="CTA" className="w-full max-w-md rounded-2xl shadow-2xl opacity-90 animate-float" />

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}



// ─── Advantages ───────────────────────────────────────────────────────────────

function AdvantagesSection({ t }: { t: Translation }) {

  return (

    <section id="advantages" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading small={t.advantages.headingSmall} large={t.advantages.headingLarge} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">

          {t.advantages.items.map((item, i) => (

            <div key={i} className="card-lift bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex gap-5 items-start">

              <div className="text-4xl flex-shrink-0">{item.icon}</div>

              <div><h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{item.description}</p></div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}



// ─── Formation Detail Modal ────────────────────────────────────────────────────

function FormationModal({ item, onClose, dir, onSignup }: { item: Translation['formations']['items'][0] | null; onClose: () => void; dir: string; onSignup: () => void }) {

  useEffect(() => {

    if (!item) return;

    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };

    document.addEventListener('keydown', handleKey);

    document.body.style.overflow = 'hidden';

    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };

  }, [item, onClose]);



  if (!item) return null;

  const isRtl = dir === 'rtl';



  const stats = [

    { label: isRtl ? 'المدة' : 'Durée', value: item.duration },

    { label: isRtl ? 'المستوى' : 'Niveau', value: item.level },

    { label: isRtl ? 'الولوج' : 'Accès', value: item.access },

  ];



  return (

    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" dir={dir}>

      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden />



      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden ring-1 ring-black/5">



        <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3 flex-shrink-0">

          <div className="flex items-center gap-3 min-w-0">

            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 text-white`}>

              {item.svgKey && FormationIcons[item.svgKey]

                ? <span className="scale-75">{FormationIcons[item.svgKey]()}</span>

                : <span className="text-lg">{item.emoji}</span>}

            </div>

            <div className="min-w-0">

              <p className="text-gray-400 text-xs">{isRtl ? 'نوع التكوين' : 'Type de formation'}</p>

              <h2 className="text-gray-900 font-semibold text-lg leading-snug">{item.title}</h2>

            </div>

          </div>

          <button

            onClick={onClose}

            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0"

            aria-label={isRtl ? 'إغلاق' : 'Fermer'}

          >

            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">

              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />

            </svg>

          </button>

        </div>



        <div className="px-5 pb-3 flex gap-2 flex-shrink-0">

          {stats.slice(0, 2).map((s, i) => (

            <div key={i} className="flex-1 rounded-lg bg-gray-50 px-3 py-2.5">

              <p className="text-gray-400 text-[11px] mb-0.5">{s.label}</p>

              <p className="text-gray-800 text-sm font-medium">{s.value}</p>

            </div>

          ))}

        </div>



        <div className="px-5 pb-4 flex-shrink-0">

          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-3">

            <p className="text-gray-400 text-[11px] mb-1">{isRtl ? 'الولوج' : 'Accès'}</p>

            <p className="text-gray-800 text-sm leading-relaxed">{item.access}</p>

          </div>

        </div>



        <div className="border-t border-gray-100" />



        {/* Body */}



        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

          <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>



          <div>

            <h3 className="text-sm font-semibold text-gray-900 mb-2">{isRtl ? 'مقدمة' : 'Introduction'}</h3>

            <p className="text-gray-600 text-sm leading-relaxed">{item.intro}</p>

          </div>



          <div>

            <h3 className="text-sm font-semibold text-gray-900 mb-2">{isRtl ? 'ما يجب معرفته' : 'Ce qu\'il faut savoir'}</h3>

            <ul className="space-y-2">

              {item.points.map((point, i) => (

                <li key={i} className="flex gap-2 text-sm text-gray-600 leading-relaxed">

                  <span className={`mt-2 w-1 h-1 rounded-full bg-gradient-to-br ${item.color} flex-shrink-0`} />

                  {point}

                </li>

              ))}

            </ul>

          </div>



          {/* Débouchés */}

          <div>

            <h3 className="text-sm font-semibold text-gray-900 mb-2">{isRtl ? 'مجالات العمل' : 'Débouchés'}</h3>

            <div className="flex flex-wrap gap-1.5">

              {item.careers.map((career, i) => (

                <span key={i} className="px-2.5 py-1 text-xs text-gray-600 bg-gray-50 rounded-md border border-gray-100">

                  {career}

                </span>

              ))}

            </div>

          </div>



          {item.tags.length > 0 && (

            <div className="flex flex-wrap gap-1.5">

              {item.tags.map((tag, i) => (

                <span key={i} className="px-2 py-0.5 text-[11px] font-medium text-purple-700 bg-purple-50 rounded-md">

                  {tag}

                </span>

              ))}

            </div>

          )}

        </div>



        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 bg-gray-50">

          <p className="text-gray-700 text-sm font-medium mb-1">

            {isRtl ? 'تريد معلومات أكثر؟' : 'Tu veux plus d\'infos ?'}

          </p>

          <p className="text-gray-500 text-xs mb-3">

            {isRtl ? 'توجيه شخصي مجاني على MyTawjeh' : 'Orientation personnalisée gratuite sur MyTawjeh'}

          </p>

          <button

            onClick={() => { onClose(); onSignup(); }}

            className="w-full flex items-center justify-center gap-1.5 btn-gradient text-white text-sm font-semibold py-2.5 rounded-full"

          >

            {isRtl ? 'سجّل مجاناً' : 'S\'inscrire gratuitement'}

            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">

              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />

            </svg>

          </button>

        </div>

      </div>

    </div>

  );

}



// ─── All Formations Page ───────────────────────────────────────────────────────

function AllFormationsPage({ t, onClose, onSelect, onSignup }: {

  t: Translation;

  onClose: () => void;

  onSelect: (item: Translation['formations']['items'][0]) => void;

  onSignup: () => void;

}) {

  const [query, setQuery] = useState('');

  const [page, setPage] = useState(1);

  const [animKey, setAnimKey] = useState(0);

  const isRtl = t.direction === 'rtl';

  const PER_PAGE = 8;



  useEffect(() => {

    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };

    document.addEventListener('keydown', handleKey);

    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleKey); };

  }, [onClose]);



  const filtered = t.formations.items.filter(item =>

    item.title.toLowerCase().includes(query.toLowerCase())

  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);



  const goToPage = (n: number) => {

    setPage(n);

    setAnimKey(k => k + 1);

  };



  return (

    <div className="fp-overlay fixed inset-0 z-[90] flex flex-col bg-[#fafafa] overflow-y-auto" dir={t.direction}>



      <header className="fp-header flex-shrink-0 border-b border-gray-200/80 bg-white">

        <div className="max-w-3xl mx-auto px-6 pt-6 pb-4">

          <div className="flex items-start justify-between gap-6 mb-4">

            <div>

              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">

                {isRtl ? 'الرئيسية / التكوينات' : 'Accueil / Types de formations'}

              </p>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">

                {isRtl ? 'أنواع التكوينات في المغرب' : (

                  <>Types de <span className="gradient-text">formations</span></>

                )}

              </h1>

              {!isRtl && <p className="text-gray-400 text-sm mt-1 font-light">au Maroc</p>}

            </div>

            <button

              onClick={onClose}

              className="text-gray-400 hover:text-gray-900 text-2xl font-light leading-none w-10 h-10 flex items-center justify-center transition-colors duration-300"

              aria-label={isRtl ? 'إغلاق' : 'Fermer'}

            >

              ×

            </button>

          </div>

          <div className="fp-search fp-input-wrap">

            <input

              type="text"

              value={query}

              onChange={e => { setQuery(e.target.value); setPage(1); setAnimKey(k => k + 1); }}

              placeholder={isRtl ? 'ابحث عن تكوين...' : 'Rechercher une formation...'}

              className="w-full bg-transparent border-0 border-b border-gray-200 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors"

            />

          </div>

        </div>

      </header>



      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">

        {paginated.length === 0 ? (

          <p className="fp-card text-center text-gray-400 text-sm py-16" style={{ animationDelay: '0.15s' }}>

            {isRtl ? 'لا توجد نتائج' : 'Aucun résultat trouvé'}

          </p>

        ) : (

          <ul key={animKey} className="fp-grid grid grid-cols-2 gap-3">

            {paginated.map((item, i) => {

              const row = Math.floor(i / 2);

              return (

              <li

                key={item.title}

                className="fp-card-row"

                style={{ animationDelay: `${0.1 + row * 0.14}s` }}

              >

                <button

                  onClick={() => onSelect(item)}

                  className="fp-card-btn w-full h-full bg-white rounded-xl border border-gray-100 px-4 py-4 text-left"

                >

                  <span className="block text-[14px] font-semibold text-gray-800 tracking-tight leading-snug">

                    {item.title}

                  </span>

                  <span className="block text-xs text-gray-400 mt-1 font-normal">

                    {item.level}

                  </span>

                </button>

              </li>

              );

            })}

          </ul>

        )}



        {totalPages > 1 && (

          <nav className="flex items-center justify-center gap-6 mt-10 pt-6 border-t border-gray-100">

            <button

              onClick={() => goToPage(Math.max(1, page - 1))}

              disabled={page === 1}

              className="text-xs font-medium text-gray-500 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-300"

            >

              {isRtl ? 'السابق' : 'Précédent'}

            </button>

            <div className="flex items-center gap-2">

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (

                <button

                  key={n}

                  onClick={() => goToPage(n)}

                  className={`min-w-[36px] h-9 px-2 rounded-full text-xs font-semibold transition-all duration-300 ${

                    n === page

                      ? 'btn-gradient text-white shadow-md'

                      : 'text-gray-500 hover:text-gray-800 hover:bg-white'

                  }`}

                >

                  {n}

                </button>

              ))}

            </div>

            <button

              onClick={() => goToPage(Math.min(totalPages, page + 1))}

              disabled={page === totalPages}

              className="text-xs font-medium text-gray-500 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-300"

            >

              {isRtl ? 'التالي' : 'Suivant'}

            </button>

          </nav>

        )}

      </main>



      <footer className="flex-shrink-0 border-t border-gray-200/80 bg-white py-5 px-6">

        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">

          <span className="text-sm font-black text-gray-800">

            My<span className="gradient-text">Tawjeh</span>

          </span>

          <p className="text-xs text-gray-400">

            {isRtl ? '© 2026 MyTawjeh. جميع الحقوق محفوظة.' : '© 2026 MyTawjeh. Tous droits réservés.'}

          </p>

          <button

            onClick={() => { onClose(); onSignup(); }}

            className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors duration-300"

          >

            {isRtl ? 'إنشاء حساب مجاني' : 'Créer un compte gratuit'}

          </button>

        </div>

      </footer>

    </div>

  );

}



const CAREER_STAGE_GRADIENT: Record<AvantBacCareerStage, string> = {

  college: 'from-amber-400 to-orange-500',

  tronc: 'from-sky-500 to-blue-600',

  '1bac': 'from-violet-500 to-purple-600',

};



type PostBacSchool = {

  id: string;

  name: string;

  category: string;

  duration: string;

  admission: string;

  details: string;

  careers: string[];

  icon: string;

  streams: Array<'sm' | 'pc' | 'svt' | 'eco' | 'lettres' | 'tech'>;

};



const POST_BAC_STREAMS = {

  fr: [

    { key: 'sm', label: 'Sciences Math' },

    { key: 'pc', label: 'Sciences Physiques (PC)' },

    { key: 'svt', label: 'SVT' },

    { key: 'eco', label: 'Sciences Économiques' },

    { key: 'lettres', label: 'Lettres & Sciences Humaines' },

    { key: 'tech', label: 'Sciences & Technologies / Technique' },

  ],

  ar: [

    { key: 'sm', label: 'علوم رياضية' },

    { key: 'pc', label: 'علوم فيزيائية' },

    { key: 'svt', label: 'علوم الحياة والأرض' },

    { key: 'eco', label: 'علوم اقتصادية' },

    { key: 'lettres', label: 'آداب وعلوم إنسانية' },

    { key: 'tech', label: 'علوم وتكنولوجيات / تقني' },

  ],

} as const;



const POST_BAC_SCHOOLS: Record<Lang, PostBacSchool[]> = {

  fr: [

    { id: 'encg', name: 'ENCG (Écoles Nationales de Commerce et Gestion)', category: 'Commerce & Gestion', duration: '5 ans', admission: 'Concours via TAFEM après Bac', details: 'Formation en management, finance, marketing et audit.', careers: ['Cadre marketing', 'Contrôleur de gestion', 'Business analyst'], icon: '💼', streams: ['eco', 'sm', 'pc', 'svt', 'lettres'] },

    { id: 'iscae', name: 'ISCAE', category: 'Commerce Premium', duration: '5 ans', admission: 'Concours national très compétitif', details: 'Grande école de référence en commerce et management.', careers: ['Consultant', 'Manager', 'Auditeur'], icon: '📈', streams: ['eco', 'sm', 'pc', 'svt', 'lettres'] },

    { id: 'enset', name: 'ENSET', category: 'Technologie & Enseignement technique', duration: '3 à 5 ans', admission: 'Concours/sélection selon filière', details: 'Formations en ingénierie pédagogique et techniques industrielles.', careers: ['Enseignant technique', 'Cadre industriel', 'Formateur'], icon: '🧪', streams: ['sm', 'pc', 'svt', 'tech'] },

    { id: 'ensa', name: 'ENSA (Écoles Nationales des Sciences Appliquées)', category: 'Ingénierie', duration: '5 ans', admission: 'Concours national après Bac scientifique', details: 'Cycle préparatoire intégré puis spécialisation.', careers: ['Ingénieur logiciel', 'Ingénieur industriel', 'Chef de projet'], icon: '⚙️', streams: ['sm', 'pc', 'svt', 'tech'] },

    { id: 'ensam', name: 'ENSAM (Arts et Métiers)', category: 'Ingénierie industrielle', duration: '5 ans', admission: 'Concours après Bac scientifique/technique', details: 'Spécialisée en génie mécanique, industriel et productique.', careers: ['Ingénieur mécanique', 'Ingénieur production', 'Responsable maintenance'], icon: '🏭', streams: ['sm', 'pc', 'tech'] },

    { id: 'cpge', name: 'CPGE (Classes Préparatoires)', category: 'Prépa Grandes Écoles', duration: '2 ans', admission: 'Sélection sur dossier', details: 'Voie d’excellence vers grandes écoles ingénieurs/commerce.', careers: ['Accès grandes écoles', 'Ingénierie', 'Management'], icon: '📚', streams: ['sm', 'pc', 'svt', 'eco'] },

    { id: 'medecine', name: 'Faculté de Médecine, Pharmacie, Dentaire', category: 'Santé', duration: '6 à 7 ans+', admission: 'Concours très sélectif', details: 'Parcours long pour étudiants très forts en sciences.', careers: ['Médecin', 'Pharmacien', 'Chirurgien-dentiste'], icon: '🩺', streams: ['svt', 'pc', 'sm'] },

    { id: 'fst-fs', name: 'Facultés des Sciences / FST', category: 'Université scientifique', duration: '3 ans (Licence)', admission: 'Inscription post-bac', details: 'Licence en maths, physique, chimie, biologie, informatique.', careers: ['Recherche', 'Ingénierie', 'Data'], icon: '🎓', streams: ['sm', 'pc', 'svt', 'tech'] },

    { id: 'fsjes', name: 'FSJES (Droit, Éco, Gestion)', category: 'Université droit & économie', duration: '3 ans (Licence)', admission: 'Inscription post-bac', details: 'Formations en droit privé/public, économie et gestion.', careers: ['Juriste', 'Comptable', 'Cadre administratif'], icon: '⚖️', streams: ['eco', 'lettres', 'sm', 'pc'] },

    { id: 'flsh', name: 'FLSH (Lettres et Sciences Humaines)', category: 'Université lettres', duration: '3 ans (Licence)', admission: 'Inscription post-bac', details: 'Langues, histoire, géographie, sociologie, philosophie.', careers: ['Enseignement', 'Communication', 'Fonction publique'], icon: '📝', streams: ['lettres'] },

    { id: 'est', name: 'EST (Écoles Supérieures de Technologie)', category: 'Technologie', duration: '2 à 3 ans', admission: 'Sélection sur dossier', details: 'Formations professionnalisantes en IT, réseaux, génie élec., gestion.', careers: ['Développeur junior', 'Technicien réseau', 'Assistant manager'], icon: '💻', streams: ['sm', 'pc', 'svt', 'eco', 'tech'] },

    { id: 'ensaad', name: 'Écoles d’Art & Design', category: 'Art, Design, Création', duration: '3 à 5 ans', admission: 'Dossier + concours/entretien', details: 'Design graphique, animation, arts visuels, UX/UI.', careers: ['Designer', 'Directeur artistique', 'Illustrateur'], icon: '🎨', streams: ['lettres', 'tech', 'eco'] },

    { id: 'architecture', name: 'Écoles d’Architecture', category: 'Architecture & Urbanisme', duration: '6 ans', admission: 'Concours + parfois dessin', details: 'Conception architecturale et techniques du bâtiment.', careers: ['Architecte', 'Urbaniste', 'Designer d’espace'], icon: '🏛️', streams: ['sm', 'pc', 'tech'] },

    { id: 'aviation', name: 'Écoles d’Aviation / Pilotage', category: 'Aéronautique', duration: '2 à 5 ans', admission: 'Tests + niveau scientifique + anglais', details: 'Formation de pilotes et techniciens aéronautiques.', careers: ['Pilote', 'Technicien avionique', 'Opérations aériennes'], icon: '✈️', streams: ['sm', 'pc'] },

    { id: 'paramedical', name: 'Instituts Paramédicaux / Kiné', category: 'Paramédical', duration: '3 à 5 ans', admission: 'Concours ou sélection', details: 'Soins infirmiers, kiné, labo, imagerie médicale.', careers: ['Infirmier(ère)', 'Kinésithérapeute', 'Technicien imagerie'], icon: '🏥', streams: ['svt', 'pc', 'sm'] },

    { id: 'ifcs', name: 'IFCS (Infirmiers et Cadres de Santé)', category: 'Santé publique', duration: '3 ans', admission: 'Concours après Bac', details: 'Instituts publics de formation en soins infirmiers.', careers: ['Infirmier polyvalent', 'Sage-femme', 'Urgences'], icon: '🧑‍⚕️', streams: ['svt', 'pc', 'sm'] },

    { id: 'tourisme', name: 'Écoles de Tourisme & Hôtellerie', category: 'Tourisme', duration: '2 à 4 ans', admission: 'Dossier/concours', details: 'Formations hôtellerie, restauration, événementiel.', careers: ['Manager hôtelier', 'Agent de voyage', 'Responsable événementiel'], icon: '🏨', streams: ['eco', 'lettres', 'tech'] },

    { id: 'journalisme', name: 'Écoles de Journalisme & Média', category: 'Média & Communication', duration: '3 à 5 ans', admission: 'Dossier, concours ou entretien', details: 'Rédaction, audiovisuel, communication digitale.', careers: ['Journaliste', 'Chargé de communication', 'Content creator'], icon: '🎙️', streams: ['lettres', 'eco'] },

    { id: 'ofppt', name: 'OFPPT / Instituts techniques', category: 'Formation Professionnelle', duration: '2 à 3 ans', admission: 'Dossier + conditions selon spécialité', details: 'Voie pratique avec insertion rapide dans plusieurs métiers.', careers: ['Technicien spécialisé', 'Support IT', 'Technicien maintenance'], icon: '🛠️', streams: ['sm', 'pc', 'svt', 'eco', 'lettres', 'tech'] },

    { id: 'isitt', name: 'ISITT (Tourisme International Tanger)', category: 'Tourisme international', duration: '3 à 5 ans', admission: 'Concours + langues', details: 'Spécialisation haut niveau en management touristique.', careers: ['Manager tourisme', 'Chef produit touristique', 'Consultant travel'], icon: '🌍', streams: ['eco', 'lettres'] },

  ],

  ar: [

    { id: 'encg', name: 'المدرسة الوطنية للتجارة والتسيير ENCG', category: 'التجارة والتسيير', duration: '5 سنوات', admission: 'ولوج عبر مباراة TAFEM بعد الباك', details: 'تكوين قوي في التسويق والمالية والتدبير.', careers: ['التسويق', 'المالية', 'تحليل الأعمال'], icon: '💼', streams: ['eco', 'sm', 'pc', 'svt', 'lettres'] },

    { id: 'iscae', name: 'ISCAE', category: 'تجارة وتسيير عالي', duration: '5 سنوات', admission: 'مباراة وطنية تنافسية', details: 'مؤسسة مرجعية في التسيير والمالية.', careers: ['استشاري', 'مدير', 'مدقق مالي'], icon: '📈', streams: ['eco', 'sm', 'pc', 'svt', 'lettres'] },

    { id: 'enset', name: 'ENSET', category: 'التكنولوجيا والتعليم التقني', duration: '3 إلى 5 سنوات', admission: 'مباراة/انتقاء حسب المسلك', details: 'تكوينات في الهندسة التقنية والتعليم المهني.', careers: ['أستاذ تقني', 'إطار صناعي', 'مكوّن'], icon: '🧪', streams: ['sm', 'pc', 'svt', 'tech'] },

    { id: 'ensa', name: 'المدارس الوطنية للعلوم التطبيقية ENSA', category: 'الهندسة', duration: '5 سنوات', admission: 'مباراة وطنية بعد الباك العلمي', details: 'مسار مدمج مع تخصصات هندسية متعددة.', careers: ['مهندس معلوميات', 'مهندس صناعي', 'تدبير المشاريع'], icon: '⚙️', streams: ['sm', 'pc', 'svt', 'tech'] },

    { id: 'ensam', name: 'ENSAM (الفنون والمهن)', category: 'الهندسة الصناعية', duration: '5 سنوات', admission: 'مباراة بعد الباك العلمي/التقني', details: 'تخصص قوي في الهندسة الميكانيكية والصناعية.', careers: ['مهندس ميكانيك', 'مهندس إنتاج', 'مسؤول صيانة'], icon: '🏭', streams: ['sm', 'pc', 'tech'] },

    { id: 'cpge', name: 'الأقسام التحضيرية CPGE', category: 'التحضير للمدارس الكبرى', duration: 'سنتان', admission: 'انتقاء حسب المعدل والملف', details: 'تكوين مكثف للتحضير لمباريات المدارس العليا.', careers: ['ولوج المدارس العليا', 'الهندسة', 'التسيير'], icon: '📚', streams: ['sm', 'pc', 'svt', 'eco'] },

    { id: 'med', name: 'كليات الطب والصيدلة وطب الأسنان', category: 'الصحة', duration: '6 إلى 7 سنوات+', admission: 'مباراة انتقائية جداً', details: 'مسار طويل يتطلب مستوى قوي في العلوم.', careers: ['طبيب', 'صيدلي', 'طبيب أسنان'], icon: '🩺', streams: ['svt', 'pc', 'sm'] },

    { id: 'fsfst', name: 'كلية العلوم / كلية العلوم والتقنيات', category: 'جامعة علمية', duration: '3 سنوات (إجازة)', admission: 'تسجيل بعد الباك', details: 'تخصصات علمية متعددة في الرياضيات والفيزياء والمعلوميات.', careers: ['بحث علمي', 'هندسة', 'تحليل بيانات'], icon: '🎓', streams: ['sm', 'pc', 'svt', 'tech'] },

    { id: 'fsjes', name: 'FSJES (القانون والاقتصاد والتدبير)', category: 'جامعة قانون واقتصاد', duration: '3 سنوات (إجازة)', admission: 'تسجيل بعد الباك', details: 'مسالك القانون والاقتصاد والتدبير.', careers: ['قانوني', 'محاسب', 'إدارة'], icon: '⚖️', streams: ['eco', 'lettres', 'sm', 'pc'] },

    { id: 'flsh', name: 'FLSH (الآداب والعلوم الإنسانية)', category: 'جامعة الآداب', duration: '3 سنوات (إجازة)', admission: 'تسجيل بعد الباك', details: 'مسالك اللغات والتاريخ والجغرافيا والفلسفة.', careers: ['التدريس', 'التواصل', 'الإدارة'], icon: '📝', streams: ['lettres'] },

    { id: 'est', name: 'المدارس العليا للتكنولوجيا EST', category: 'التكنولوجيا', duration: '2 إلى 3 سنوات', admission: 'انتقاء بالملف', details: 'تكوين تطبيقي في المعلوميات والشبكات والتدبير.', careers: ['مطور مبتدئ', 'تقني شبكات', 'مساعد إداري'], icon: '💻', streams: ['sm', 'pc', 'svt', 'eco', 'tech'] },

    { id: 'artdesign', name: 'مدارس الفن والتصميم', category: 'فن وتصميم', duration: '3 إلى 5 سنوات', admission: 'ملف + مباراة/مقابلة', details: 'تكوين في التصميم الغرافيكي والفنون البصرية.', careers: ['مصمم', 'مخرج فني', 'رسام'], icon: '🎨', streams: ['lettres', 'tech', 'eco'] },

    { id: 'archi', name: 'مدارس الهندسة المعمارية', category: 'الهندسة المعمارية والتصميم', duration: '6 سنوات', admission: 'مباراة وقد تشمل اختبار الرسم', details: 'تكوين في التصميم المعماري والتعمير.', careers: ['مهندس معماري', 'مخطط عمراني', 'مصمم فضاءات'], icon: '🏛️', streams: ['sm', 'pc', 'tech'] },

    { id: 'aviation', name: 'مدارس الطيران', category: 'الطيران', duration: '2 إلى 5 سنوات', admission: 'اختبارات + مستوى علمي + إنجليزية', details: 'تكوين الطيارين والتقنيين في مجال الطيران.', careers: ['طيار', 'تقني طيران', 'عمليات جوية'], icon: '✈️', streams: ['sm', 'pc'] },

    { id: 'paramed', name: 'المعاهد شبه الطبية والعلاج الطبيعي', category: 'شبه طبي', duration: '3 إلى 5 سنوات', admission: 'مباراة أو انتقاء', details: 'تكوينات في التمريض والعلاج الطبيعي والمختبر.', careers: ['ممرض(ة)', 'أخصائي علاج طبيعي', 'تقني تصوير'], icon: '🏥', streams: ['svt', 'pc', 'sm'] },

    { id: 'ifcs', name: 'IFCS (معاهد التمريض وتقنيات الصحة)', category: 'الصحة العمومية', duration: '3 سنوات', admission: 'مباراة بعد الباك', details: 'تكوينات عمومية في مهن التمريض.', careers: ['ممرض متعدد الاختصاصات', 'قبالة', 'مستعجلات'], icon: '🧑‍⚕️', streams: ['svt', 'pc', 'sm'] },

    { id: 'tour', name: 'مدارس السياحة والفندقة', category: 'السياحة', duration: '2 إلى 4 سنوات', admission: 'ملف أو مباراة', details: 'تكوين في الفندقة والمطعمة وتنظيم التظاهرات.', careers: ['تدبير الفنادق', 'وكالات الأسفار', 'تنظيم الأحداث'], icon: '🏨', streams: ['eco', 'lettres', 'tech'] },

    { id: 'media', name: 'مدارس الصحافة والإعلام', category: 'الإعلام والتواصل', duration: '3 إلى 5 سنوات', admission: 'ملف أو مباراة أو مقابلة', details: 'تنمية مهارات الكتابة والإعلام الرقمي.', careers: ['صحفي', 'مسؤول تواصل', 'صانع محتوى'], icon: '🎙️', streams: ['lettres', 'eco'] },

    { id: 'ofppt', name: 'OFPPT والمعاهد التقنية', category: 'التكوين المهني', duration: '2 إلى 3 سنوات', admission: 'ملف وشروط حسب التخصص', details: 'مسار عملي للاندماج السريع في سوق الشغل.', careers: ['تقني متخصص', 'الدعم المعلوماتي', 'الصيانة'], icon: '🛠️', streams: ['sm', 'pc', 'svt', 'eco', 'lettres', 'tech'] },

    { id: 'isitt', name: 'ISITT (المعهد العالي الدولي للسياحة طنجة)', category: 'السياحة الدولية', duration: '3 إلى 5 سنوات', admission: 'مباراة + لغات', details: 'تكوين عالي في تدبير السياحة والفندقة الدولية.', careers: ['مدير سياحي', 'تسويق سياحي', 'استشارة سفر'], icon: '🌍', streams: ['eco', 'lettres'] },

  ],

};



// ─── Avant Bac — page complète (style Voir Tout) ─────────────────────────────

function AllAvantBacPage({ t, onClose, onSignup }: { t: Translation; onClose: () => void; onSignup: () => void }) {

  const e = t.bacPath.avantBacExplore;

  const isRtl = t.direction === 'rtl';

  const [careerQuery, setCareerQuery] = useState('');

  const [careerFilter, setCareerFilter] = useState<AvantBacCareerStage | 'all'>('all');

  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);

  const [expandedStage, setExpandedStage] = useState<string | null>(e.stages[0]?.id ?? null);



  useEffect(() => {

    document.body.style.overflow = 'hidden';

    const handleKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') onClose(); };

    document.addEventListener('keydown', handleKey);

    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleKey); };

  }, [onClose]);



  const careerFilterKeys = ['all', 'college', 'tronc', '1bac'] as const;

  const careerStageOrder: AvantBacCareerStage[] = ['college', 'tronc', '1bac'];

  const filteredCareers = e.careers.filter((c) => {

    const matchStage = careerFilter === 'all' || c.stage === careerFilter;

    const q = careerQuery.toLowerCase();

    const matchQuery = !q || c.title.toLowerCase().includes(q) || c.filiere.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);

    return matchStage && matchQuery;

  });

  const careersByStage = careerStageOrder

    .map((stageId) => ({

      stageId,

      items: filteredCareers.filter((c) => c.stage === stageId),

    }))

    .filter((group) => group.items.length > 0);

  const handleSignup = () => {

    onClose();

    onSignup();

  };



  return (

    <div className="fp-overlay fixed inset-0 z-[90] flex flex-col bg-[#fafafa] overflow-y-auto" dir={t.direction}>

      <header className="fp-header flex-shrink-0 border-b border-gray-200/80 bg-white sticky top-0 z-10">

        <div className="max-w-3xl mx-auto px-6 pt-6 pb-4">

          <div className="flex items-start justify-between gap-6 mb-3">

            <div>

              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">{e.breadcrumb}</p>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">

                {e.title} <span className="gradient-text">{e.titleAccent}</span>

              </h1>

              <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-lg">{e.subtitle}</p>

            </div>

            <button

              type="button"

              onClick={onClose}

              className="text-gray-400 hover:text-gray-900 text-2xl font-light leading-none w-10 h-10 flex items-center justify-center transition-colors"

              aria-label={isRtl ? 'إغلاق' : 'Fermer'}

            >

              ×

            </button>

          </div>

        </div>

      </header>



      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8 space-y-12">

        <section>

          <div className="rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-5 py-4 mb-8 shadow-sm">

            <p className="text-sm text-gray-700 leading-relaxed">{e.overview}</p>

          </div>

          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">{e.stagesTitle}</h2>

          <div className="avant-stages-timeline space-y-5">

            {e.stages.map((stage, i) => {

              const open = expandedStage === stage.id;

              const isLast = i === e.stages.length - 1;

              return (

                <article

                  key={stage.id}

                  className={`avant-stage-item relative fp-card ${isLast ? '' : 'pb-1'} group`}

                  style={{ animationDelay: `${0.08 + i * 0.1}s` }}

                >

                  {!isLast && <span className="avant-stage-line" aria-hidden />}

                  <div

                    className={`overflow-hidden rounded-2xl border bg-gradient-to-br ${stage.bg} shadow-sm transition-all duration-300 ${open ? 'shadow-md ring-1 ring-black/5 border-gray-100/90' : 'border-gray-100/80 group-hover:border-violet-200 group-hover:shadow-md'}`}

                  >

                    <button

                    type="button"

                    onClick={() => setExpandedStage(open ? null : stage.id)}

                    className="w-full px-5 py-5 flex items-start gap-4 text-left"

                    aria-expanded={open}

                  >

                    <div className={`relative z-[1] flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${stage.gradient} flex items-center justify-center text-white shadow-md ring-1 ring-white/30`}>

                      <BacStageIcon name={stage.iconKey} className="w-6 h-6" />

                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-[10px] font-black text-gray-700 flex items-center justify-center shadow border border-gray-100">

                        {i + 1}

                      </span>

                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap items-center gap-2 mb-1.5">

                        <h3 className="text-lg font-black text-gray-900">{stage.title}</h3>

                      </div>

                      {!open && (

                        <div className="flex flex-wrap gap-1.5 mb-2.5">

                          {stage.highlightTags.map((tag) => (

                            <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 text-gray-600 border border-gray-100">

                              {tag}

                            </span>

                          ))}

                        </div>

                      )}

                      <p className={`text-sm text-gray-600 leading-relaxed ${open ? '' : 'line-clamp-2'}`}>{stage.intro}</p>

                    </div>

                    <ChevronDownIcon className={`self-center mt-0.5 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />

                  </button>

                  {open && (

                    <div className="px-5 pb-5 pt-0 border-t border-white/80">

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

                        {stage.topics.map((topic, ti) => (

                          <li key={topic.title} className="flex gap-3 bg-white/85 rounded-xl px-4 py-3.5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">

                            <span className={`flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br ${stage.gradient} text-white text-xs font-black flex items-center justify-center shadow-sm`}>

                              {ti + 1}

                            </span>

                            <div className="min-w-0">

                              <p className="text-sm font-bold text-gray-900 mb-1 leading-snug">{topic.title}</p>

                              <p className="text-xs text-gray-600 leading-relaxed">{topic.description}</p>

                            </div>

                          </li>

                        ))}

                      </ul>

                    </div>

                  )}

                  </div>

                </article>

              );

            })}

          </div>

          <div className="mt-6 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">

            <p className="text-sm text-gray-700 leading-relaxed">

              {isRtl ? 'تحتاج مزيداً من المعلومات؟ توجيه شخصي مجاني على MyTawjeh.' : 'Tu veux plus d’infos ? Orientation personnalisée gratuite sur MyTawjeh.'}

            </p>

            <button

              type="button"

              onClick={handleSignup}

              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold text-white btn-gradient shadow-sm hover:shadow-md transition-shadow"

            >

              {isRtl ? 'إنشاء حساب مجاني' : 'Créer un compte gratuit'}

            </button>

          </div>

        </section>



        <section>

          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{e.careersTitle}</h2>

          <p className="text-xs text-gray-400 mb-5">{e.careersNote}</p>

          <div className="flex flex-wrap gap-2 mb-4">

            {careerFilterKeys.map((f) => (

              <button

                key={f}

                type="button"

                onClick={() => setCareerFilter(f)}

                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${

                  careerFilter === f ? 'btn-gradient text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'

                }`}

              >

                {e.careerStageFilters[f]}

              </button>

            ))}

          </div>

          <div className="fp-search fp-input-wrap mb-5">

            <input

              type="text"

              value={careerQuery}

              onChange={(ev) => setCareerQuery(ev.target.value)}

              placeholder={e.searchCareers}

              className="w-full bg-transparent border-0 border-b border-gray-200 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"

            />

          </div>

          {filteredCareers.length === 0 ? (

            <p className="text-center text-gray-400 text-sm py-10">{isRtl ? 'لا توجد نتائج' : 'Aucun métier trouvé'}</p>

          ) : (

            <div className="space-y-8">

              {careersByStage.map(({ stageId, items }) => (

                <div key={stageId} className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/70 p-4 sm:p-5 shadow-sm">

                  <div className="flex items-center justify-between gap-3 mb-4">

                    <div className="flex items-center gap-3">

                      <span className={`w-2 h-8 rounded-full bg-gradient-to-b ${CAREER_STAGE_GRADIENT[stageId]}`} aria-hidden />

                      <h3 className="text-sm font-black text-gray-800">{e.careerStageFilters[stageId]}</h3>

                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-500">

                      {items.length}

                    </span>

                  </div>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {items.map((career, i) => {

                const open = expandedCareer === career.id;

                const grad = CAREER_STAGE_GRADIENT[career.stage];

                return (

                  <li key={career.id} className="fp-card" style={{ animationDelay: `${0.05 + (i % 6) * 0.06}s` }}>

                    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-violet-200 transition-all h-full flex flex-col">

                      <button

                        type="button"

                        onClick={() => setExpandedCareer(open ? null : career.id)}

                        className="w-full px-4 py-4 flex items-start gap-3 text-left"

                        aria-expanded={open}

                      >

                        <span className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white shadow-md ring-1 ring-white/30`}>

                          <CareerIcon id={career.id} className="w-5 h-5" />

                        </span>

                        <div className="flex-1 min-w-0">

                          <div className="flex flex-wrap items-center gap-2 mb-1">

                            <h3 className="text-sm font-black text-gray-900">{career.title}</h3>

                            <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gradient-to-r ${grad} text-white`}>

                              {e.careerStageFilters[career.stage]}

                            </span>

                          </div>

                          <p className={`text-xs text-gray-600 leading-relaxed ${open ? '' : 'line-clamp-2'}`}>{career.description}</p>

                        </div>

                        <ChevronDownIcon className={`self-center text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />

                      </button>

                      {open && (

                        <div className="px-4 pb-4 pt-0 border-t border-gray-50 space-y-3">

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{e.careerFiliereLabel}</p>

                            <p className="text-xs font-semibold text-indigo-600 leading-relaxed mb-2">{career.filiere}</p>

                          </div>

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">{e.careerQualitiesLabel}</p>

                            <div className="flex flex-wrap gap-1.5">

                              {career.qualities.map((q) => (

                                <span key={q} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">

                                  {q}

                                </span>

                              ))}

                            </div>

                          </div>

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{e.careerAccessLabel}</p>

                            <p className="text-xs text-gray-600 leading-relaxed">{career.pathway}</p>

                          </div>

                        </div>

                      )}

                    </article>

                  </li>

                );

              })}

                  </ul>

                </div>

              ))}

            </div>

          )}

          <div className="mt-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">

            <p className="text-sm text-gray-700 leading-relaxed">

              {isRtl ? 'اكتشف التخصص المناسب لك بخطة واضحة ومجانية على MyTawjeh.' : 'Découvre la spécialité qui te correspond avec un plan clair et gratuit sur MyTawjeh.'}

            </p>

            <button

              type="button"

              onClick={handleSignup}

              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold text-white btn-gradient shadow-sm hover:shadow-md transition-shadow"

            >

              {isRtl ? 'ابدأ الآن مجاناً' : 'Commencer gratuitement'}

            </button>

          </div>

        </section>



      </main>



      <footer className="flex-shrink-0 border-t border-gray-200/80 bg-white py-5 px-6">

        <div className="max-w-3xl mx-auto">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">

            <span className="text-sm font-black text-gray-800">My<span className="gradient-text">Tawjeh</span></span>

            <p className="text-xs text-gray-400">{isRtl ? '© 2026 MyTawjeh' : '© 2026 MyTawjeh. Tous droits réservés.'}</p> 

            <button type="button" onClick={onClose} className="text-xs font-semibold text-violet-600 hover:text-violet-800">

              {isRtl ? 'إغلاق' : 'Fermer'}

            </button>

          </div>

        </div>

      </footer>

    </div>

  );

}



function AllApresBacPage({ t, onClose, onSignup }: { t: Translation; onClose: () => void; onSignup: () => void }) {

  const isRtl = t.direction === 'rtl';

  const schools = POST_BAC_SCHOOLS[isRtl ? 'ar' : 'fr'];

  const streamOptions = POST_BAC_STREAMS[isRtl ? 'ar' : 'fr'];

  const [selectedStream, setSelectedStream] = useState<'' | 'sm' | 'pc' | 'svt' | 'eco' | 'lettres' | 'tech'>('');

  const [query, setQuery] = useState('');

  const [expanded, setExpanded] = useState<string | null>(schools[0]?.id ?? null);



  useEffect(() => {

    document.body.style.overflow = 'hidden';

    const handleKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') onClose(); };

    document.addEventListener('keydown', handleKey);

    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleKey); };

  }, [onClose]);



  const filteredSchools = schools.filter((s) => {

    if (!selectedStream) return false;

    if (!s.streams.includes(selectedStream)) return false;

    const q = query.toLowerCase();

    if (!q) return true;

    return (

      s.name.toLowerCase().includes(q) ||

      s.category.toLowerCase().includes(q) ||

      s.details.toLowerCase().includes(q) ||

      s.careers.some((c) => c.toLowerCase().includes(q))

    );

  });



  return (

    <div className="fp-overlay fixed inset-0 z-[90] flex flex-col bg-[#fafafa] overflow-y-auto" dir={t.direction}>

      <header className="fp-header flex-shrink-0 border-b border-gray-200/80 bg-white sticky top-0 z-10">

        <div className="max-w-4xl mx-auto px-6 pt-6 pb-4">

          <div className="flex items-start justify-between gap-6 mb-3">

            <div>

              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">{isRtl ? 'الرئيسية / بعد الباك' : 'Accueil / Après Bac'}</p>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">

                {isRtl ? 'المسارات ' : 'Parcours '}<span className="gradient-text">{isRtl ? 'بعد الباك' : 'après le Bac'}</span>

              </h1>

              <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-2xl">

                {isRtl

                  ? 'دليل مبسّط لأهم المدارس والتكوينات بعد البكالوريا في المغرب، مع مدة الدراسة، شروط الولوج، والآفاق المهنية لكل مؤسسة.'

                  : 'Guide pratique des principales écoles et filières après le Bac au Maroc, avec durée, mode d’admission et débouchés pour chaque établissement.'}

              </p>

            </div>

            <button

              type="button"

              onClick={onClose}

              className="text-gray-400 hover:text-gray-900 text-2xl font-light leading-none w-10 h-10 flex items-center justify-center transition-colors"

              aria-label={isRtl ? 'إغلاق' : 'Fermer'}

            >

              ×

            </button>

          </div>

        </div>

      </header>



      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-7">

        <section className="rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-5 shadow-sm">

          <p className="text-sm text-gray-700 leading-relaxed mb-4">

            {isRtl

              ? 'اختيار ما بعد الباك كيحتاج مقارنة واضحة: التخصص، شروط القبول، مدة الدراسة، وفرص الشغل.'

              : 'Pour bien choisir après le Bac, comparez clairement: spécialité, admission, durée des études et débouchés.'}

          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1.5 block">

                {isRtl ? 'اختيار الشعبة' : 'Choisir votre branche'}

              </label>

              <select

                value={selectedStream}

                onChange={(ev) => setSelectedStream(ev.target.value as '' | 'sm' | 'pc' | 'svt' | 'eco' | 'lettres' | 'tech')}

                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"

              >

                <option value="">{isRtl ? 'اختر الشعبة أولاً' : 'Sélectionnez d’abord votre branche'}</option>

                {streamOptions.map((opt) => (

                  <option key={opt.key} value={opt.key}>{opt.label}</option>

                ))}

              </select>

            </div>

            <div className="fp-search fp-input-wrap">

              <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1.5 block">

                {isRtl ? 'بحث إضافي' : 'Recherche rapide'}

              </label>

              <input

                type="text"

                value={query}

                onChange={(ev) => setQuery(ev.target.value)}

                placeholder={isRtl ? 'ابحث عن مدرسة أو تخصص أو مهنة...' : 'Rechercher une école, une spécialité ou un débouché...'}

                className="w-full bg-transparent border-0 border-b border-gray-200 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"

              />

            </div>

          </div>

        </section>



        <section className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50 px-5 py-4 shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <p className="text-sm text-gray-700 leading-relaxed">

              {isRtl ? 'باغي معلومات أكثر على المدارس والشعب؟ تسجّل فـ MyTawjeh وخذ توجيه مخصص ليك.' : 'Tu veux plus d’infos sur les écoles et filières ? Inscris-toi sur MyTawjeh pour une orientation personnalisée.'}

            </p>

            <button

              type="button"

              onClick={() => { onClose(); onSignup(); }}

              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold text-white btn-gradient shadow-sm hover:shadow-md transition-shadow"

            >

              {isRtl ? 'تسجيل مجاني' : 'Inscription gratuite'}

            </button>

          </div>

        </section>



        <section>

          {!selectedStream ? (

            <p className="text-center text-gray-400 text-sm py-12">

              {isRtl ? 'اختار الشعبة ديالك أولاً باش نعرضو لك المدارس المناسبة.' : 'Choisissez d’abord votre branche pour afficher les écoles adaptées.'}

            </p>

          ) : filteredSchools.length === 0 ? (

            <p className="text-center text-gray-400 text-sm py-12">{isRtl ? 'لا توجد نتائج' : 'Aucun établissement trouvé'}</p>

          ) : (

            <>

              <p className="text-xs text-gray-500 mb-3">

                {isRtl ? `تم العثور على ${filteredSchools.length} مؤسسة مناسبة` : `${filteredSchools.length} établissements trouvés pour votre branche`}

              </p>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {filteredSchools.map((school, i) => {

                const open = expanded === school.id;

                return (

                  <li key={school.id} className="fp-card" style={{ animationDelay: `${0.05 + (i % 8) * 0.05}s` }}>

                    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">

                      <button

                        type="button"

                        onClick={() => setExpanded(open ? null : school.id)}

                        className="w-full px-4 py-4 flex items-start gap-3 text-left"

                        aria-expanded={open}

                      >

                        <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg shadow-md">

                          {school.icon}

                        </span>

                        <div className="flex-1 min-w-0">

                          <div className="flex flex-wrap items-center gap-2 mb-1">

                            <h3 className="text-sm font-black text-gray-900">{school.name}</h3>

                          </div>

                          <div className="flex flex-wrap gap-1.5 mb-1.5">

                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">{school.category}</span>

                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{school.duration}</span>

                          </div>

                          <p className={`text-xs text-gray-600 leading-relaxed ${open ? '' : 'line-clamp-2'}`}>{school.details}</p>

                        </div>

                        <ChevronDownIcon className={`self-center text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />

                      </button>

                      {open && (

                        <div className="px-4 pb-4 pt-0 border-t border-gray-50 space-y-3">

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{isRtl ? 'شروط الولوج' : 'Admission'}</p>

                            <p className="text-xs text-gray-700 leading-relaxed">{school.admission}</p>

                          </div>

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">{isRtl ? 'الآفاق المهنية' : 'Débouchés'}</p>

                            <div className="flex flex-wrap gap-1.5">

                              {school.careers.map((career) => (

                                <span key={career} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">

                                  {career}

                                </span>

                              ))}

                            </div>

                          </div>

                        </div>

                      )}

                    </article>

                  </li>

                );

              })}

              </ul>

            </>

          )}

        </section>

      </main>



      <footer className="flex-shrink-0 border-t border-gray-200/80 bg-white py-5 px-6">

        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">

          <span className="text-sm font-black text-gray-800">My<span className="gradient-text">Tawjeh</span></span>

          <button type="button" onClick={onClose} className="text-xs font-semibold text-violet-600 hover:text-violet-800">

            {isRtl ? 'إغلاق' : 'Fermer'}

          </button>

        </div>

      </footer>

    </div>

  );

}



// ─── Avant / Après Bac ────────────────────────────────────────────────────────

/* removed legacy avant detail

      <button

        type="button"

        onClick={onBack}

        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"

      >

        {d.back}

      </button>

      <div className="text-center mb-10">

        <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">

          {d.badge}

        </span>

        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{d.heading}</h3>

        <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base leading-relaxed">{d.goal}</p>

        <p className="mt-3 text-xs text-gray-400 italic">{d.guidanceNote}</p>

      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">

        {d.cards.map((card, i) => (

          <article

            key={card.id}

            className={`avant-bac-card avant-bac-enter ${delays[i + 1] ?? ''} group relative overflow-hidden rounded-3xl border-2 border-white bg-gradient-to-br ${card.bg} p-6 md:p-7 shadow-lg ring-2 ${card.ring}`}

          >

            <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl group-hover:opacity-35 transition-opacity`} />

            <div className="relative flex items-start justify-between gap-3 mb-5">

              <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} text-2xl shadow-md`}>

                {card.icon}

              </div>

              <div className="avant-bac-illus text-4xl md:text-5xl leading-none select-none" aria-hidden>

                {card.illustration}

              </div>

            </div>

            <h4 className="text-xl font-black text-gray-900 mb-2">{card.title}</h4>

            <p className="text-gray-600 text-sm leading-relaxed mb-5 min-h-[2.5rem]">{card.subtitle}</p>

            <div className="flex flex-wrap gap-2">

              {card.tags.map((tag) => (

                <span

                  key={tag}

                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 text-gray-700 border border-gray-100 shadow-sm group-hover:shadow transition-shadow"

                >

                  {tag}

                </span>

              ))}

            </div>

            <div className={`mt-5 h-1 rounded-full bg-gradient-to-r ${card.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

          </article>

        ))}

      </div>

    </div>

  );

*/



// ─── World Map Teaser Section ─────────────────────────────────────────────────

function WorldMapTeaserSection({ lang, onOpenMap }: { lang: 'fr' | 'ar'; onOpenMap: () => void }) {
  const isAr = lang === 'ar';

  const features = isAr ? [
    { icon: '🇫🇷', label: 'فرنسا' }, { icon: '🇩🇪', label: 'ألمانيا' }, { icon: '🇨🇦', label: 'كندا' },
    { icon: '🇺🇸', label: 'الولايات المتحدة' }, { icon: '🇬🇧', label: 'المملكة المتحدة' }, { icon: '🇦🇪', label: 'الإمارات' },
    { icon: '🇪🇸', label: 'إسبانيا' }, { icon: '🇳🇱', label: 'هولندا' }, { icon: '🇧🇪', label: 'بلجيكا' },
    { icon: '🇹🇷', label: 'تركيا' }, { icon: '🇸🇦', label: 'السعودية' }, { icon: '🇦🇺', label: 'أستراليا' },
    { icon: '🇲🇦', label: 'المغرب' },
  ] : [
    { icon: '🇫🇷', label: 'France' }, { icon: '🇩🇪', label: 'Allemagne' }, { icon: '🇨🇦', label: 'Canada' },
    { icon: '🇺🇸', label: 'États-Unis' }, { icon: '🇬🇧', label: 'Royaume-Uni' }, { icon: '🇦🇪', label: 'Émirats' },
    { icon: '🇪🇸', label: 'Espagne' }, { icon: '🇳🇱', label: 'Pays-Bas' }, { icon: '🇧🇪', label: 'Belgique' },
    { icon: '🇹🇷', label: 'Turquie' }, { icon: '🇸🇦', label: 'Arabie Saoudite' }, { icon: '🇦🇺', label: 'Australie' },
    { icon: '🇲🇦', label: 'Maroc' },
  ];

  return (
    <section id="world-map" dir={isAr ? 'rtl' : 'ltr'} className="py-20 bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-purple-200 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">
            <span className="text-base">🌍</span>
            {isAr ? 'خريطة الجامعات العالمية' : 'Carte Mondiale des Universités'}
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center leading-tight mb-4">
          {isAr ? (
            <><span className="text-purple-300">اكتشف</span> أفضل الجامعات<br />في العالم</>
          ) : (
            <>Explore les meilleures<br /><span className="text-purple-300">universités du monde</span></>
          )}
        </h2>

        <p className="text-center text-purple-200 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {isAr
            ? 'خريطة تفاعلية تضم 13 دولة و39 جامعة عالمية — اضغط على أي دولة لاكتشاف شروط القبول، الرسوم، المنح وفرص العمل.'
            : 'Une carte interactive avec 13 pays et 39 universités mondiales — clique sur un pays pour découvrir les conditions d\'admission, les frais, les bourses et les opportunités d\'emploi.'}
        </p>

        {/* Scrolling countries strip */}
        <div className="relative mb-10 overflow-hidden">
          <div className="flex gap-3 animate-[scroll_30s_linear_infinite] w-max">
            {[...features, ...features].map((f, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-white text-sm font-medium backdrop-blur-sm">
                <span className="text-lg">{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-indigo-950 to-transparent pointer-events-none" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
          {[
            { val: '13', lbl: isAr ? 'دولة' : 'Pays', icon: '🌍' },
            { val: '39', lbl: isAr ? 'جامعة' : 'Universités', icon: '🎓' },
            { val: '100%', lbl: isAr ? 'مجاني' : 'Gratuit', icon: '✨' },
          ].map((s) => (
            <div key={s.lbl} className="bg-white/10 border border-white/15 rounded-2xl p-4 text-center backdrop-blur-sm">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-white">{s.val}</div>
              <div className="text-xs text-purple-300 font-medium">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={onOpenMap}
            className="group relative inline-flex items-center gap-3 bg-white text-purple-700 font-black text-base px-8 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/30 hover:scale-105 active:scale-[0.98] transition-all duration-200"
          >
            <span className="text-xl">🗺️</span>
            <span>{isAr ? 'استكشف الخريطة الآن' : 'Explorer la carte maintenant'}</span>
            <span className="text-lg group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </div>

        <p className="text-center text-purple-400 text-xs mt-4">
          {isAr ? 'مجاني تماماً · بدون تسجيل مسبق' : 'Entièrement gratuit · Sans inscription préalable'}
        </p>

      </div>

      {/* Inline keyframes for the scroll animation */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

// ─── Bac Path Section ─────────────────────────────────────────────────────────

function BacPathSection({ t, onSignup }: { t: Translation; onSignup: () => void }) {

  const [activePathPage, setActivePathPage] = useState<'avant' | 'apres' | null>(null);

  const pathCards = [

    { key: 'avant' as const, iconKey: 'pathAvant' as const, gradient: 'from-blue-500 to-indigo-600', bg: 'from-blue-50 to-indigo-50', data: t.bacPath.avantBac, clickable: true },

    { key: 'apres' as const, iconKey: 'pathApres' as const, gradient: 'from-purple-500 to-violet-600', bg: 'from-purple-50 to-violet-50', data: t.bacPath.apresBac, clickable: true },

  ];

  const openPath = (key: 'avant' | 'apres') => setActivePathPage(key);



  return (

    <>

      <section id="bac-path" className="py-24 bg-gradient-to-b from-gray-50 to-white">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            <SectionHeading small={t.bacPath.headingSmall} large={t.bacPath.headingLarge} />

            <p className="text-center text-gray-600 text-base max-w-2xl mx-auto -mt-6 mb-12 leading-relaxed">

              {t.bacPath.intro}

            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

              {pathCards.map(({ key, iconKey, gradient, bg, data, clickable }) => {

                const inner = (

                  <>

                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg mb-5`}>

                      <BacStageIcon name={iconKey} className="w-7 h-7" />

                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{data.title}</h3>

                    <p className="text-gray-600 text-sm leading-relaxed">{data.message}</p>

                    {clickable && (

                      <span className="mt-4 inline-block text-sm font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors">

                        {key === 'avant' ? t.bacPath.avantBac.cta : (t.direction === 'rtl' ? 'استكشاف المسارات بعد الباك →' : 'Explorer les options →')}

                      </span>

                    )}

                  </>

                );

                if (clickable) {

                  return (

                    <button key={key} type="button" onClick={() => openPath(key)} className={`group text-left w-full rounded-2xl border border-gray-100 bg-gradient-to-br ${bg} p-8 shadow-sm card-lift cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2`}>{inner}</button>

                  );

                }

                return <div key={key} className={`rounded-2xl border border-gray-100 bg-gradient-to-br ${bg} p-8 shadow-sm`}>{inner}</div>;

              })}

            </div>

        </div>

      </section>

      {activePathPage === 'avant' && <AllAvantBacPage t={t} onClose={() => setActivePathPage(null)} onSignup={onSignup} />}

      {activePathPage === 'apres' && <AllApresBacPage t={t} onClose={() => setActivePathPage(null)} onSignup={onSignup} />}

    </>

  );

}



// ─── Formations ───────────────────────────────────────────────────────────────

function FormationsSection({ t, onSignup }: { t: Translation; onSignup: () => void }) {

  const [selected, setSelected] = useState<Translation['formations']['items'][0] | null>(null);

  const [showAllPage, setShowAllPage] = useState(false);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visibleItems = t.formations.items.slice(0, 12);



  return (

    <section id="formations" className="py-24 bg-white">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading small={t.formations.headingSmall} large={t.formations.headingLarge} />

        <p className="text-gray-500 text-sm text-center mb-10">{t.formations.description}</p>



        {/* Accordion list */}

        <div className="space-y-3">

          {visibleItems.map((item, i) => (

            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

              <button

                onClick={() => setOpenIndex(openIndex === i ? null : i)}

                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"

              >

                <div className="flex-1">

                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{item.tags[0]}</span>

                  <h3 className="text-sm font-bold text-gray-900 mt-1">{item.title}</h3>

                </div>

                <svg 

                  className={`w-5 h-5 text-orange-500 flex-shrink-0 ml-3 transition-transform duration-300 ${openIndex === i ? 'rotate-90' : ''}`} 

                  fill="none" 

                  stroke="currentColor" 

                  strokeWidth={2.5} 

                  viewBox="0 0 24 24"

                >

                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />

                </svg>

              </button>

              {openIndex === i && (

                <div className="px-5 pb-4 pt-0">

                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>

                  <button 

                    onClick={() => setSelected(item)}

                    className="mt-3 text-purple-600 text-sm font-semibold hover:text-purple-700"

                  >

                    {t.direction === 'rtl' ? 'المزيد من التفاصيل' : 'En savoir plus'}

                  </button>

                </div>

              )}

            </div>

          ))}

        </div>



        {/* Voir tout — always visible */}

        <div className="text-center mt-10">

          <button

            onClick={() => setShowAllPage(true)}

            className="text-blue-500 font-medium text-sm hover:text-blue-700 hover:underline transition-colors"

          >

            {t.direction === 'rtl' ? 'عرض الكل' : 'Voir Tout'}

          </button>

        </div>

      </div>



      {/* All Formations Page */}

      {showAllPage && (

        <AllFormationsPage

          t={t}

          onClose={() => setShowAllPage(false)}

          onSelect={(item) => { setSelected(item); }}

          onSignup={onSignup}

        />

      )}



      {/* Detail Modal — rendered on top of everything */}

      <FormationModal item={selected} onClose={() => setSelected(null)} dir={t.direction} onSignup={onSignup} />

    </section>

  );

}



// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection({ t }: { t: Translation }) {

  const [active, setActive] = useState(0);

  const len = t.testimonials.items.length;

  const isRtl = t.direction === 'rtl';

  useEffect(() => { const timer = setInterval(() => setActive((p) => (p + 1) % len), 4500); return () => clearInterval(timer); }, [len]);

  return (

    <section id="testimonials" className="py-24 bg-white">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading small={t.testimonials.headingSmall} large={t.testimonials.headingLarge} />

        <div className="relative mt-4">

          <div className="overflow-hidden">

            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${isRtl ? active * 100 : -active * 100}%)` }}>

              {t.testimonials.items.map((item, i) => (

                <div key={i} className="min-w-full px-4">

                  <div className="testimonial-gradient rounded-3xl p-10 border border-purple-100 text-center shadow-sm">

                    <div className="text-5xl mb-5">{item.avatar}</div>

                    <p className="text-lg text-gray-700 italic leading-relaxed mb-6">{item.text}</p>

                    <div className="font-bold text-gray-900">{item.author}</div>

                    <div className="text-sm text-purple-600 font-medium">{item.role}</div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          <div className="flex justify-center gap-2 mt-6">

            {t.testimonials.items.map((_, i) => (

              <button key={i} onClick={() => setActive(i)} className={`transition-all duration-300 rounded-full ${active === i ? 'w-8 h-2.5 bg-purple-600' : 'w-2.5 h-2.5 bg-purple-200'}`} />

            ))}

          </div>

        </div>

      </div>

    </section>

  );

}



// ─── Contact Section ──────────────────────────────────────────────────────────

function ContactSection({ t }: { t: Translation }) {

  const [sent, setSent] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const isRtl = t.direction === 'rtl';

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    try { await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) }); } catch (_) {}

    setSent(true); setFormData({ name: '', email: '', message: '' }); setTimeout(() => setSent(false), 4000);

  };

  return (

    <section id="contact" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          <div>

            <SectionHeading small={t.contact.headingSmall} large={t.contact.headingLarge} accent={t.contact.headingAccent} center={false} />

            <p className="text-gray-500 mb-8 leading-relaxed">{t.contact.description}</p>

            <div className="space-y-4 mb-10">

              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">

                <div className="w-11 h-11 rounded-xl btn-gradient flex items-center justify-center text-white text-lg shadow flex-shrink-0">📧</div>

                <div><div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</div><div className="text-gray-800 font-semibold">{t.contact.email}</div></div>

              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">

                <div className="w-11 h-11 rounded-xl btn-gradient flex items-center justify-center text-white text-lg shadow flex-shrink-0">📞</div>

                <div><div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{isRtl ? 'الهاتف' : 'Téléphone'}</div><div className="text-gray-800 font-semibold">{t.contact.phone}</div></div>

              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">

            {sent ? (

              <div className="text-center py-10">

                <div className="text-6xl mb-4">✅</div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{isRtl ? 'تم الإرسال!' : 'Message envoyé !'}</h3>

                <p className="text-gray-500">{isRtl ? 'سنتواصل معك قريبًا.' : 'Nous vous répondrons dans les plus brefs délais.'}</p>

              </div>

            ) : (

              <form onSubmit={handleSubmit} className="space-y-5">

                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.namePlaceholder}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t.contact.namePlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm bg-gray-50" /></div>

                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.emailPlaceholder}</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={t.contact.emailPlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm bg-gray-50" /></div>

                <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.messagePlaceholder}</label><textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t.contact.messagePlaceholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm bg-gray-50 resize-none" /></div>

                <button type="submit" className="btn-gradient w-full text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"><SendIcon />{t.contact.button}</button>

              </form>

            )}

          </div>

        </div>

      </div>

    </section>

  );

}



// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ t }: { t: Translation }) {
  const isRtl = t.direction === 'rtl';

  const links = {
    platform: {
      title: isRtl ? 'المنصة' : 'Plateforme',
      items: [
        { label: isRtl ? 'الرئيسية' : 'Accueil', href: '#top' },
        { label: isRtl ? 'المميزات' : 'Fonctionnalités', href: '#features' },
        { label: isRtl ? 'أنواع التكوينات' : 'Formations', href: '#formations' },
        { label: isRtl ? 'قبل/بعد البكالوريا' : 'Avant/Après Bac', href: '#bac-path' },
        { label: isRtl ? 'خريطة الجامعات' : 'Map Mondiale', href: '#world-map' },
      ],
    },
    resources: {
      title: isRtl ? 'الموارد' : 'Ressources',
      items: [
        { label: isRtl ? 'الأخبار' : 'Actualités', href: '#news' },
        { label: isRtl ? 'المزايا' : 'Avantages', href: '#advantages' },
        { label: isRtl ? 'تواصل معنا' : 'Contact', href: '#contact' },
      ],
    },
    legal: {
      title: isRtl ? 'قانوني' : 'Légal',
      items: [
        { label: isRtl ? 'سياسة الخصوصية' : 'Politique de confidentialité', href: '#' },
        { label: isRtl ? 'شروط الاستخدام' : 'Conditions d\'utilisation', href: '#' },
        { label: isRtl ? 'ملفات تعريف الارتباط' : 'Cookies', href: '#' },
      ],
    },
  };

  const socials = [
    {
      label: 'Instagram',
      href: '#',
      color: 'hover:bg-pink-600/30 hover:border-pink-500/50 hover:text-pink-400',
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      label: 'Twitter / X',
      href: '#',
      color: 'hover:bg-sky-600/30 hover:border-sky-500/50 hover:text-sky-400',
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: '#',
      color: 'hover:bg-blue-600/30 hover:border-blue-500/50 hover:text-blue-400',
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: '#',
      color: 'hover:bg-red-600/30 hover:border-red-500/50 hover:text-red-400',
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer dir={isRtl ? 'rtl' : 'ltr'} className="bg-gray-950 text-gray-400 pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand col (2 cols wide) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-base">M</span>
              </div>
              <span className="font-black text-xl text-white">My<span className="gradient-text">Tawjeh</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mb-6">
              {isRtl
                ? 'منصة التوجيه الذكي بالذكاء الاصطناعي — مجانية وشاملة لكل طالب مغربي.'
                : "La plateforme d'orientation intelligente par IA — gratuite et complète pour chaque étudiant marocain."}
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-200 ${s.color}`}>
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          {Object.values(links).map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <a href={item.href}
                      className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Badge */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-400 font-medium">
                {isRtl ? 'المنصة تعمل بشكل طبيعي' : 'Plateforme opérationnelle'}
              </span>
            </div>

            {/* Copyright */}
            <p className="text-xs text-gray-500 text-center">
              {t.contact.copyright}
            </p>

            {/* Made in Morocco */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>{isRtl ? 'صُنع بـ' : 'Fait avec'}</span>
              <span className="text-red-400">♥</span>
              <span>{isRtl ? 'في المغرب 🇲🇦' : 'au Maroc 🇲🇦'}</span>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}



// ─── LOGIN MODAL (connected to real backend) ──────────────────────────────────

function LoginModal({ isOpen, onClose, t, onSwitchToSignup }: {

  isOpen: boolean; onClose: () => void; t: Translation;

  onSwitchToSignup: () => void;

}) {

  const { login } = useAuth();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const isRtl = t.direction === 'rtl';



  if (!isOpen) return null;



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);

    setError('');

    try {

      await login(email, password);

      onClose();

      // loggedIn from useAuth updates automatically — no callback needed

    } catch (err: any) {

      setError(err.message || 'Email ou mot de passe incorrect.');

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="relative flex w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: '460px' }}>

        {/* Left panel */}

        <div className="hidden md:flex flex-col justify-between w-5/12 p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3b1a6e 0%, #6d28d9 60%, #a855f7 100%)' }}>

          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />

          <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />

          <div className="relative z-10">

            <div className="flex items-center gap-2 mb-8">

              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow"><span className="text-white font-black text-lg">M</span></div>

              <span className="font-black text-xl tracking-tight">MyTawjeh</span>

            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>

              {isRtl ? 'التوجيه الذكي' : 'Orientation Intelligente'}

            </div>

            <h2 className="text-2xl font-black leading-snug mb-3">{isRtl ? 'مساحتك الشخصية' : 'Votre espace personnel'}</h2>

            <p className="text-white/70 text-sm leading-relaxed">{isRtl ? 'مسار مخصص، متابعة الأهداف وتوصيات الذكاء الاصطناعي.' : 'Parcours sur mesure, suivi des objectifs et recommandations IA.'}</p>

          </div>

          <div className="relative z-10 text-white/40 text-xs">© 2026 MyTawjeh</div>

        </div>



        {/* Right panel */}

        <div className="flex-1 bg-white flex flex-col justify-center px-8 py-10 relative">

          <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all text-lg">×</button>

          <h3 className="text-2xl font-bold text-gray-900 mb-1">{isRtl ? 'تسجيل الدخول' : 'Connexion'}</h3>

          <p className="text-sm text-purple-600 font-medium mb-5">{isRtl ? 'وصول آمن إلى حسابك' : 'Accès sécurisé à votre compte'}</p>



          <form onSubmit={handleSubmit} className="space-y-4">

            <div>

              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{isRtl ? 'البريد الإلكتروني' : 'E-MAIL'}</label>

              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nom@domaine.com"

                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm bg-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />

            </div>



            <div>

              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{isRtl ? 'كلمة المرور' : 'MOT DE PASSE'}</label>

              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"

                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm bg-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />

            </div>



            {error && (

              <div className="px-3 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-600 font-medium">{error}</div>

            )}



            {/* Google Auth placeholder */}

            <div className="relative">

              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>

              <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-gray-400">{isRtl ? 'أو' : 'ou'}</span></div>

            </div>

            <button type="button" disabled className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-sm text-gray-400 bg-gray-50 cursor-not-allowed">

              <svg width="16" height="16" viewBox="0 0 48 48">

                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>

                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>

                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>

                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>

              </svg>

              {isRtl ? 'المتابعة مع Google' : 'Continuer avec Google'}

              <span className="text-gray-300 text-xs">({isRtl ? 'قريباً' : 'bientôt'})</span>

            </button>



            <button type="submit" disabled={loading}

              className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg disabled:opacity-70 transition-all hover:-translate-y-0.5"

              style={{ background: loading ? '#c084fc' : 'linear-gradient(90deg, #c084fc 0%, #e879f9 50%, #f472b6 100%)' }}>

              {loading ? (isRtl ? 'جاري التسجيل...' : 'Connexion en cours...') : (isRtl ? 'متابعة' : 'CONTINUER')}

            </button>

          </form>



          <p className="mt-5 text-center text-xs text-gray-500">

            {isRtl ? 'جديد على المنصة؟ ' : 'Nouveau sur la plateforme ? '}

            <button onClick={() => { onClose(); onSwitchToSignup(); }} className="text-purple-600 font-semibold hover:underline">

              {isRtl ? 'إنشاء حساب' : 'Créer un compte'}

            </button>

          </p>



          {/* Test accounts — clickable to auto-fill */}

          <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">

            <p className="text-xs text-gray-400 font-medium mb-2">

              {isRtl ? 'حسابات تجريبية — كلمة المرور:' : 'Comptes de test — mot de passe :'}{' '}

              <strong className="font-mono text-gray-600">password</strong>

              <span className="ml-1 text-gray-300">{isRtl ? '(انقر للملء)' : '(cliquer pour remplir)'}</span>

            </p>

            <div className="space-y-1">

              {[

                { role: isRtl ? 'طالب' : 'Étudiant',   email: 'yassine@test.ma',  color: '#7c3aed' },

                { role: isRtl ? 'ولي أمر' : 'Parent',   email: 'parent@test.ma',   color: '#059669' },

                { role: isRtl ? 'أستاذ' : 'Professeur', email: 'hassan@test.ma',   color: '#2563eb' },

                { role: 'Admin',                          email: 'admin@mowajih.ma', color: '#dc2626' },

              ].map(a => (

                <button

                  key={a.role}

                  type="button"

                  onClick={() => { setEmail(a.email); setPassword('password'); }}

                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white transition-all text-left border border-transparent hover:border-gray-200 hover:shadow-sm"

                >

                  <span className="text-xs font-bold" style={{ color: a.color }}>{a.role}</span>

                  <span className="text-xs text-gray-400 font-mono">{a.email}</span>

                </button>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}



// ─── AI FAB ────────────────────────────────────────────────────────────────────

function AIFAB({ setOpenChat }: { setOpenChat: (v: boolean) => void }) {

  return (

    <button onClick={() => setOpenChat(true)}

      className="fixed bottom-6 right-6 z-50 btn-gradient text-white w-14 h-14 rounded-full shadow-2xl text-lg font-black flex items-center justify-center hover:scale-110 transition-transform border-2 border-white/30">

      🤖

    </button>

  );

}



// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {

  const { loggedIn, language, setLanguage } = useAuth();

  const [openChat, setOpenChat] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [showSignupModal, setShowSignupModal] = useState(false);

  const [showWorldMap, setShowWorldMap] = useState(false);

  const t = translations[language];



  useEffect(() => {

    document.documentElement.dir = t.direction;

    document.documentElement.lang = language;

  }, [language, t.direction]);



  // ── If logged in, show dashboard ──

  if (loggedIn) {

    return <Dashboard />;

  }



  // ── Otherwise show landing page ──

  return (

    <div dir={t.direction} lang={language}>

      <Navbar language={language} setLanguage={setLanguage} t={t} setOpenChat={setOpenChat} setShowLoginModal={setShowLoginModal} setShowSignupModal={setShowSignupModal} onOpenWorldMap={() => setShowWorldMap(true)} />

      <main>

        <HeroSection t={t} />



        <BacPathSection key={`bac-${language}`} t={t} onSignup={() => setShowSignupModal(true)} />

        <FormationsSection key={language} t={t} onSignup={() => setShowSignupModal(true)} />

        <WorldMapTeaserSection lang={language} onOpenMap={() => setShowWorldMap(true)} />

        <AdvantagesSection t={t} />

        <NewsCarousel t={t} />

        <CTASection t={t} onSignup={() => setShowSignupModal(true)} />

        <AIEcosystem
  t={t}
  onSignup={() => setShowSignupModal(true)}
/>

        <SmartChatbot
          language={language}
          onSignup={() => setShowSignupModal(true)}
        />
        {openChat && (
  <div
    className="fixed inset-0 z-[9999] bg-black/40 overflow-y-auto"
  >
    <button
      onClick={() => setOpenChat(false)}
      className="fixed top-5 right-5 w-12 h-12 rounded-full bg-white text-black font-bold text-xl z-[10000]"
    >
      ✕
    </button>

    <SmartChatbot
      language={language}
      onSignup={() => setShowSignupModal(true)}
    />
  </div>
)}

        <TestimonialsSection t={t} />

        <ContactSection t={t} />

      </main>

      <Footer t={t} />

      <AIFAB setOpenChat={setOpenChat} />



      <LoginModal

        isOpen={showLoginModal}

        onClose={() => setShowLoginModal(false)}

        t={t}

        onSwitchToSignup={() => { setShowLoginModal(false); setShowSignupModal(true); }}

      />

      {showSignupModal && (

        <Inscription

          onClose={() => setShowSignupModal(false)}

          onSwitchToLogin={() => { setShowSignupModal(false); setShowLoginModal(true); }}

          lang={language}

        />

      )}

      {showWorldMap && (

        <WorldMapPage

          lang={language}

          onClose={() => setShowWorldMap(false)}

          onSignup={() => { setShowWorldMap(false); setShowSignupModal(true); }}

        />

      )}

    </div>

  );

}
