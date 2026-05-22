import { useState } from 'react';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface CountryData {
  id: string;
  name: string;
  nameFr: string;
  nameAr: string;
  continent: string;
  universities: {
    name: string;
    rank: string;
    city: string;
    website: string;
    programs: string[];
    admissionRequirements: string[];
    tuitionFees: string;
    scholarships: string;
  }[];
  jobOpportunities: {
    sector: string;
    description: string;
    avgSalary: string;
    demand: 'high' | 'medium' | 'low';
  }[];
  generalInfo: {
    language: string;
    currency: string;
    costOfLiving: string;
    visaInfo: string;
  };
}

// ─── Pin positions on SVG viewBox 0 0 1000 500 ───────────────────────────────

const PIN_POSITIONS: Record<string, { cx: number; cy: number }> = {
  morocco:     { cx: 430, cy: 248 },
  france:      { cx: 462, cy: 178 },
  spain:       { cx: 448, cy: 192 },
  belgium:     { cx: 468, cy: 168 },
  netherlands: { cx: 472, cy: 162 },
  uk:          { cx: 452, cy: 163 },
  germany:     { cx: 482, cy: 170 },
  turkey:      { cx: 532, cy: 188 },
  saudi:       { cx: 558, cy: 228 },
  uae:         { cx: 578, cy: 238 },
  canada:      { cx: 195, cy: 148 },
  usa:         { cx: 200, cy: 192 },
  australia:   { cx: 820, cy: 358 },
};

// ─── Continent colors ─────────────────────────────────────────────────────────

const CONTINENT_COLORS: Record<string, string> = {
  europe:   '#6366f1',
  amerique: '#10b981',
  asie:     '#f59e0b',
  afrique:  '#f43f5e',
  oceanie:  '#14b8a6',
};

// ─── Country Data ─────────────────────────────────────────────────────────────

const countriesData: CountryData[] = [
  {
    id: 'france', name: 'France', nameFr: 'France', nameAr: 'فرنسا', continent: 'europe',
    generalInfo: { language: 'Français', currency: 'Euro (€)', costOfLiving: '800–1200 €/mois', visaInfo: 'Visa étudiant Campus France obligatoire' },
    universities: [
      { name: 'Sorbonne Université', rank: 'Top 100 mondial', city: 'Paris', website: 'sorbonne-universite.fr', programs: ['Médecine', 'Droit', 'Sciences', 'Lettres'], admissionRequirements: ['Bac avec mention', 'Dossier Campus France', 'Lettre de motivation', 'Niveau B2 français'], tuitionFees: '170–380 €/an (public)', scholarships: 'Bourse Eiffel, BGF, Campus France' },
      { name: 'École Polytechnique (X)', rank: 'Top 50 mondial', city: 'Palaiseau', website: 'polytechnique.edu', programs: ['Ingénierie', 'Sciences', 'Mathématiques', 'Informatique'], admissionRequirements: ['Bac SM avec excellence', 'CPGE 2 ans', 'Concours X', 'Anglais C1'], tuitionFees: '15 000 €/an', scholarships: "Bourse d'excellence, aide sociale" },
      { name: 'HEC Paris', rank: 'Top 5 Business Schools Europe', city: 'Jouy-en-Josas', website: 'hec.edu', programs: ['Management', 'Finance', 'Marketing', 'Entrepreneuriat'], admissionRequirements: ['CPGE ECG ou équivalent', 'Concours HEC', 'Anglais C1', 'Activités extra-scolaires'], tuitionFees: '16 500 €/an', scholarships: 'Bourse HEC, aide sociale CAF' },
    ],
    jobOpportunities: [
      { sector: 'Ingénierie & Tech', description: 'Forte demande en développeurs, ingénieurs IA et data scientists', avgSalary: '35 000–60 000 €/an', demand: 'high' },
      { sector: 'Santé', description: 'Médecins, infirmiers et pharmaciens très recherchés', avgSalary: '40 000–80 000 €/an', demand: 'high' },
      { sector: 'Finance & Conseil', description: 'Banques, cabinets de conseil et assurances recrutent activement', avgSalary: '38 000–70 000 €/an', demand: 'medium' },
    ],
  },
  {
    id: 'canada', name: 'Canada', nameFr: 'Canada', nameAr: 'كندا', continent: 'amerique',
    generalInfo: { language: 'Anglais / Français', currency: 'Dollar canadien (CAD)', costOfLiving: '1000–1500 CAD/mois', visaInfo: "Permis d'études + lettre d'acceptation" },
    universities: [
      { name: 'Université de Montréal', rank: 'Top 150 mondial', city: 'Montréal', website: 'umontreal.ca', programs: ['Médecine', 'Droit', 'Sciences', 'Informatique'], admissionRequirements: ['Bac avec mention', 'Français B2', 'Dossier complet', 'Lettre de motivation'], tuitionFees: '7 000–15 000 CAD/an', scholarships: "Bourse d'excellence, MEES" },
      { name: 'University of Toronto', rank: 'Top 25 mondial', city: 'Toronto', website: 'utoronto.ca', programs: ['Ingénierie', 'Business', 'Sciences', 'Arts'], admissionRequirements: ['Bac 16+/20', 'IELTS 6.5+', 'Lettre de motivation', 'Recommandations'], tuitionFees: '30 000–45 000 CAD/an', scholarships: 'Lester B. Pearson, U of T Excellence' },
      { name: 'McGill University', rank: 'Top 50 mondial', city: 'Montréal', website: 'mcgill.ca', programs: ['Médecine', 'Droit', 'Ingénierie', 'Management'], admissionRequirements: ['Bac 17+/20', 'IELTS 6.5+ ou DELF B2', 'Dossier académique solide'], tuitionFees: '20 000–35 000 CAD/an', scholarships: "Bourses d'entrée, aide financière" },
    ],
    jobOpportunities: [
      { sector: 'Technologie & IA', description: 'Montréal et Toronto sont des hubs tech mondiaux', avgSalary: '55 000–90 000 CAD/an', demand: 'high' },
      { sector: 'Santé', description: 'Pénurie de médecins et infirmiers dans tout le pays', avgSalary: '60 000–120 000 CAD/an', demand: 'high' },
      { sector: 'Ingénierie', description: 'BTP, mines, énergie — secteurs en pleine croissance', avgSalary: '55 000–85 000 CAD/an', demand: 'high' },
    ],
  },
  {
    id: 'germany', name: 'Allemagne', nameFr: 'Allemagne', nameAr: 'ألمانيا', continent: 'europe',
    generalInfo: { language: 'Allemand (+ anglais pour masters)', currency: 'Euro (€)', costOfLiving: '700–1100 €/mois', visaInfo: 'Visa national D, preuve de financement 11 208 €' },
    universities: [
      { name: 'TU Munich (TUM)', rank: 'Top 50 mondial', city: 'Munich', website: 'tum.de', programs: ['Ingénierie', 'Informatique', 'Sciences', 'Management'], admissionRequirements: ['Bac SM 16+/20', 'Allemand B2 ou anglais C1', 'APS (attestation)', 'Dossier académique'], tuitionFees: '0–500 €/semestre (quasi gratuit)', scholarships: 'DAAD, Deutschland Stipendium' },
      { name: 'LMU Munich', rank: 'Top 60 mondial', city: 'Munich', website: 'lmu.de', programs: ['Médecine', 'Droit', 'Sciences Humaines', 'Économie'], admissionRequirements: ['Bac 16+/20', 'Allemand C1 pour médecine', 'APS obligatoire', 'Numerus Clausus'], tuitionFees: '0–500 €/semestre', scholarships: 'DAAD, bourses Land Bayern' },
      { name: 'Heidelberg University', rank: 'Top 70 mondial', city: 'Heidelberg', website: 'uni-heidelberg.de', programs: ['Médecine', 'Sciences Naturelles', 'Droit', 'Philosophie'], admissionRequirements: ['Bac 15+/20', 'Allemand B2-C1', 'APS', 'Lettre de motivation'], tuitionFees: '0–500 €/semestre', scholarships: 'DAAD, Erasmus+' },
    ],
    jobOpportunities: [
      { sector: 'Ingénierie automobile', description: 'BMW, Mercedes, Volkswagen — leaders mondiaux', avgSalary: '45 000–75 000 €/an', demand: 'high' },
      { sector: 'Informatique & Cybersécurité', description: 'Berlin est la Silicon Valley européenne', avgSalary: '50 000–80 000 €/an', demand: 'high' },
      { sector: 'Médecine & Pharmacie', description: 'Forte demande, salaires élevés', avgSalary: '55 000–100 000 €/an', demand: 'high' },
    ],
  },
  {
    id: 'usa', name: 'États-Unis', nameFr: 'États-Unis', nameAr: 'الولايات المتحدة', continent: 'amerique',
    generalInfo: { language: 'Anglais', currency: 'Dollar américain (USD)', costOfLiving: '1200–2000 USD/mois', visaInfo: 'Visa F-1, SEVIS, entretien ambassade' },
    universities: [
      { name: 'MIT', rank: '#1 mondial', city: 'Cambridge, MA', website: 'mit.edu', programs: ['Ingénierie', 'Informatique', 'Sciences', 'Architecture'], admissionRequirements: ['SAT 1500+', 'TOEFL 100+', 'Activités extra-scolaires', 'Lettres de recommandation'], tuitionFees: '57 000 USD/an', scholarships: 'Need-based aid, MIT Scholarships' },
      { name: 'Harvard University', rank: 'Top 5 mondial', city: 'Cambridge, MA', website: 'harvard.edu', programs: ['Droit', 'Médecine', 'Business', 'Sciences'], admissionRequirements: ['SAT 1500+', 'TOEFL 100+', 'Dossier exceptionnel', 'Entretien'], tuitionFees: '54 000 USD/an', scholarships: 'Harvard Financial Aid, bourses mérite' },
      { name: 'Stanford University', rank: 'Top 5 mondial', city: 'Stanford, CA', website: 'stanford.edu', programs: ['Ingénierie', 'Business', 'Médecine', 'Droit'], admissionRequirements: ['SAT 1500+', 'TOEFL 100+', 'Leadership démontré', 'Recommandations'], tuitionFees: '56 000 USD/an', scholarships: 'Stanford Financial Aid, Knight-Hennessy' },
    ],
    jobOpportunities: [
      { sector: 'Tech & Silicon Valley', description: 'Google, Apple, Meta, Amazon — salaires les plus élevés au monde', avgSalary: '100 000–200 000 USD/an', demand: 'high' },
      { sector: 'Finance & Wall Street', description: "Banques d'investissement, hedge funds, fintech", avgSalary: '80 000–150 000 USD/an', demand: 'high' },
      { sector: 'Santé & Biotech', description: 'Médecins spécialistes et chercheurs très demandés', avgSalary: '150 000–300 000 USD/an', demand: 'high' },
    ],
  },
  {
    id: 'uk', name: 'Royaume-Uni', nameFr: 'Royaume-Uni', nameAr: 'المملكة المتحدة', continent: 'europe',
    generalInfo: { language: 'Anglais', currency: 'Livre sterling (£)', costOfLiving: '900–1400 £/mois', visaInfo: 'Student Visa (Tier 4), CAS number requis' },
    universities: [
      { name: 'University of Oxford', rank: '#1 Europe', city: 'Oxford', website: 'ox.ac.uk', programs: ['Médecine', 'Droit', 'Sciences', 'Philosophie'], admissionRequirements: ['A-Levels AAA ou équivalent', 'IELTS 7.0+', 'Entretien', "Test d'admission spécifique"], tuitionFees: '26 000–37 000 £/an', scholarships: 'Rhodes Scholarship, Clarendon Fund' },
      { name: 'University of Cambridge', rank: 'Top 5 mondial', city: 'Cambridge', website: 'cam.ac.uk', programs: ['Sciences', 'Ingénierie', 'Médecine', 'Économie'], admissionRequirements: ['A-Levels A*AA', 'IELTS 7.5+', 'Entretien', 'Dossier exceptionnel'], tuitionFees: '22 000–35 000 £/an', scholarships: 'Gates Cambridge, Cambridge Trust' },
      { name: 'Imperial College London', rank: 'Top 10 mondial', city: 'Londres', website: 'imperial.ac.uk', programs: ['Ingénierie', 'Médecine', 'Sciences', 'Business'], admissionRequirements: ['A-Levels AAA', 'IELTS 6.5+', 'Dossier académique fort'], tuitionFees: '30 000–40 000 £/an', scholarships: "Imperial Scholarships, President's PhD" },
    ],
    jobOpportunities: [
      { sector: 'Finance & Banque', description: 'Londres est la capitale financière mondiale', avgSalary: '40 000–100 000 £/an', demand: 'high' },
      { sector: 'Tech & Startups', description: 'Écosystème startup dynamique à Londres', avgSalary: '45 000–80 000 £/an', demand: 'high' },
      { sector: 'Médecine (NHS)', description: 'NHS recrute massivement médecins et infirmiers', avgSalary: '35 000–80 000 £/an', demand: 'high' },
    ],
  },
  {
    id: 'uae', name: 'Émirats Arabes Unis', nameFr: 'Émirats Arabes Unis', nameAr: 'الإمارات العربية المتحدة', continent: 'asie',
    generalInfo: { language: 'Arabe / Anglais', currency: 'Dirham (AED)', costOfLiving: '3000–5000 AED/mois', visaInfo: "Visa étudiant via université, pas d'impôt sur le revenu" },
    universities: [
      { name: 'Khalifa University', rank: 'Top 200 mondial', city: 'Abu Dhabi', website: 'ku.ac.ae', programs: ['Ingénierie', 'Sciences', 'Informatique', 'Énergie'], admissionRequirements: ['Bac SM 16+/20', 'IELTS 6.0+', 'Dossier académique', 'Entretien'], tuitionFees: '0–5 000 AED/an (bourses disponibles)', scholarships: 'Full scholarship pour excellents étudiants' },
      { name: 'American University of Sharjah', rank: 'Top 500 mondial', city: 'Sharjah', website: 'aus.edu', programs: ['Business', 'Ingénierie', 'Architecture', 'Arts'], admissionRequirements: ['Bac 14+/20', 'IELTS 6.0+', 'SAT recommandé'], tuitionFees: '40 000–55 000 AED/an', scholarships: 'Merit scholarships, need-based aid' },
      { name: 'University of Dubai', rank: 'Reconnue AACSB', city: 'Dubaï', website: 'ud.ac.ae', programs: ['Business', 'Droit', 'Informatique', 'Finance'], admissionRequirements: ['Bac 13+/20', 'IELTS 5.5+', 'Dossier complet'], tuitionFees: '35 000–50 000 AED/an', scholarships: 'Bourses partielles disponibles' },
    ],
    jobOpportunities: [
      { sector: 'Finance & Banque islamique', description: 'Hub financier du Moyen-Orient, 0% impôt', avgSalary: '15 000–40 000 AED/mois', demand: 'high' },
      { sector: 'Tourisme & Hôtellerie', description: 'Dubaï accueille 20M+ touristes/an', avgSalary: '8 000–20 000 AED/mois', demand: 'high' },
      { sector: 'Tech & Innovation', description: 'Smart Dubai, IA gouvernementale, startups', avgSalary: '15 000–35 000 AED/mois', demand: 'high' },
    ],
  },
  {
    id: 'morocco', name: 'Maroc', nameFr: 'Maroc', nameAr: 'المغرب', continent: 'afrique',
    generalInfo: { language: 'Arabe / Français / Amazigh', currency: 'Dirham marocain (MAD)', costOfLiving: '2000–4000 MAD/mois', visaInfo: 'Pas de visa pour les Marocains — accès direct' },
    universities: [
      { name: 'Université Mohammed V', rank: 'Top 5 Afrique', city: 'Rabat', website: 'um5.ac.ma', programs: ['Droit', 'Sciences', 'Médecine', 'Lettres'], admissionRequirements: ['Bac marocain', 'Inscription via Tawjihni', 'Dossier académique'], tuitionFees: '400–600 MAD/an (public)', scholarships: 'Bourse nationale, AMCI' },
      { name: "École Mohammadia d'Ingénieurs (EMI)", rank: 'Top école ingénieurs Maroc', city: 'Rabat', website: 'emi.ac.ma', programs: ['Génie Civil', 'Informatique', 'Électronique', 'Industriel'], admissionRequirements: ['CPGE 2 ans', 'Concours national', 'Bac SM avec excellence'], tuitionFees: '1 000–2 000 MAD/an', scholarships: "Bourse d'excellence, aide sociale" },
      { name: 'ENCG Casablanca', rank: 'Top Business School Maroc', city: 'Casablanca', website: 'encg-casa.ma', programs: ['Management', 'Finance', 'Marketing', 'Commerce International'], admissionRequirements: ['Bac avec mention', 'Concours ENCG', 'Entretien'], tuitionFees: '2 000–4 000 MAD/an', scholarships: 'Bourse nationale, partenariats entreprises' },
    ],
    jobOpportunities: [
      { sector: 'Offshoring & Tech', description: "Casablanca hub tech africain, centres d'appels, IT", avgSalary: '5 000–15 000 MAD/mois', demand: 'high' },
      { sector: 'Tourisme & Hôtellerie', description: 'Secteur en forte croissance post-COVID', avgSalary: '4 000–12 000 MAD/mois', demand: 'medium' },
      { sector: 'BTP & Immobilier', description: 'Grands chantiers nationaux, villes nouvelles', avgSalary: '6 000–18 000 MAD/mois', demand: 'high' },
    ],
  },
  {
    id: 'spain', name: 'Espagne', nameFr: 'Espagne', nameAr: 'إسبانيا', continent: 'europe',
    generalInfo: { language: 'Espagnol', currency: 'Euro (€)', costOfLiving: '700–1000 €/mois', visaInfo: 'Visa étudiant, inscription via universités espagnoles' },
    universities: [
      { name: 'Universidad Complutense Madrid', rank: 'Top 200', city: 'Madrid', website: 'ucm.es', programs: ['Médecine', 'Droit', 'Sciences', 'Lettres'], admissionRequirements: ['Bac 14+/20', 'Espagnol B2', 'Dossier'], tuitionFees: '1000–2500 €/an', scholarships: 'Erasmus+, bourses régionales' },
      { name: 'Universidad de Barcelona', rank: 'Top 200', city: 'Barcelone', website: 'ub.edu', programs: ['Sciences', 'Architecture', 'Business', 'Arts'], admissionRequirements: ['Bac 14+/20', 'Espagnol B2', 'Dossier'], tuitionFees: '1500–3000 €/an', scholarships: 'Erasmus+, MAEC-AECID' },
      { name: 'Universidad Autónoma Madrid', rank: 'Top 250', city: 'Madrid', website: 'uam.es', programs: ['Sciences', 'Ingénierie', 'Économie', 'Lettres'], admissionRequirements: ['Bac 14+/20', 'Espagnol B1', 'Dossier'], tuitionFees: '1000–2000 €/an', scholarships: 'Erasmus+, bourses excellence' },
    ],
    jobOpportunities: [
      { sector: 'Tourisme & Hôtellerie', description: 'Espagne 1er pays touristique mondial', avgSalary: '20 000–35 000 €/an', demand: 'high' },
      { sector: 'Tech & Startups', description: 'Madrid hub tech européen', avgSalary: '30 000–55 000 €/an', demand: 'high' },
      { sector: 'Agroalimentaire', description: 'Leader mondial fruits/légumes', avgSalary: '25 000–40 000 €/an', demand: 'medium' },
    ],
  },
  {
    id: 'netherlands', name: 'Pays-Bas', nameFr: 'Pays-Bas', nameAr: 'هولندا', continent: 'europe',
    generalInfo: { language: 'Néerlandais / Anglais', currency: 'Euro (€)', costOfLiving: '900–1300 €/mois', visaInfo: 'Visa Schengen étudiant, MVV pour +90 jours' },
    universities: [
      { name: 'TU Delft', rank: 'Top 50 Ingénierie', city: 'Delft', website: 'tudelft.nl', programs: ['Ingénierie', 'Architecture', 'Sciences', 'Informatique'], admissionRequirements: ['Bac SM 16+/20', 'Anglais C1', 'Dossier'], tuitionFees: '2200 €/an', scholarships: 'Holland Scholarship, Orange Tulip' },
      { name: 'University of Amsterdam', rank: 'Top 100', city: 'Amsterdam', website: 'uva.nl', programs: ['Business', 'Sciences', 'Droit', 'Arts'], admissionRequirements: ['Bac 15+/20', 'Anglais B2', 'Dossier'], tuitionFees: '2200 €/an', scholarships: 'Amsterdam Merit, Holland Scholarship' },
      { name: 'Erasmus University Rotterdam', rank: 'Top 200 Business', city: 'Rotterdam', website: 'eur.nl', programs: ['Économie', 'Business', 'Droit', 'Médecine'], admissionRequirements: ['Bac 15+/20', 'Anglais B2', 'Dossier'], tuitionFees: '2200 €/an', scholarships: 'Erasmus Trustfonds, Holland Scholarship' },
    ],
    jobOpportunities: [
      { sector: 'Logistique & Commerce', description: 'Port de Rotterdam 1er port Europe', avgSalary: '35 000–60 000 €/an', demand: 'high' },
      { sector: 'Tech & IA', description: 'Amsterdam hub tech mondial', avgSalary: '45 000–75 000 €/an', demand: 'high' },
      { sector: 'Agriculture & Agritech', description: '2ème exportateur mondial', avgSalary: '30 000–50 000 €/an', demand: 'medium' },
    ],
  },
  {
    id: 'belgium', name: 'Belgique', nameFr: 'Belgique', nameAr: 'بلجيكا', continent: 'europe',
    generalInfo: { language: 'Français / Néerlandais / Allemand', currency: 'Euro (€)', costOfLiving: '800–1200 €/mois', visaInfo: 'Visa étudiant, inscription directe universités' },
    universities: [
      { name: 'KU Leuven', rank: 'Top 50 Europe', city: 'Louvain', website: 'kuleuven.be', programs: ['Ingénierie', 'Médecine', 'Sciences', 'Droit'], admissionRequirements: ['Bac 16+/20', 'Anglais C1', 'Dossier'], tuitionFees: '900–1800 €/an', scholarships: 'KU Leuven Excellence, VLIR-UOS' },
      { name: 'Université Libre de Bruxelles', rank: 'Top 200', city: 'Bruxelles', website: 'ulb.ac.be', programs: ['Droit', 'Sciences', 'Médecine', 'Lettres'], admissionRequirements: ['Bac 14+/20', 'Français B2', 'Dossier'], tuitionFees: '835–1000 €/an', scholarships: 'Bourses ULB, ARES' },
      { name: 'Université de Liège', rank: 'Top 300', city: 'Liège', website: 'uliege.be', programs: ['Sciences', 'Ingénierie', 'Médecine', 'Vétérinaire'], admissionRequirements: ['Bac 14+/20', 'Français B2', 'Dossier'], tuitionFees: '835 €/an', scholarships: 'Bourses excellence, ARES' },
    ],
    jobOpportunities: [
      { sector: 'Institutions Européennes', description: 'Siège UE/OTAN à Bruxelles', avgSalary: '40 000–80 000 €/an', demand: 'high' },
      { sector: 'Pharma & Biotech', description: 'UCB/Solvay leaders mondiaux', avgSalary: '45 000–70 000 €/an', demand: 'high' },
      { sector: 'Finance & Assurance', description: 'Hub financier européen', avgSalary: '35 000–60 000 €/an', demand: 'medium' },
    ],
  },
  {
    id: 'turkey', name: 'Turquie', nameFr: 'Turquie', nameAr: 'تركيا', continent: 'asie',
    generalInfo: { language: 'Turc (+ anglais dans grandes universités)', currency: 'Livre turque (TRY)', costOfLiving: '500–900 USD/mois', visaInfo: 'Visa étudiant, bourse Türkiye Scholarships disponible' },
    universities: [
      { name: 'Boğaziçi University', rank: 'Top 500', city: 'Istanbul', website: 'boun.edu.tr', programs: ['Ingénierie', 'Sciences', 'Business', 'Arts'], admissionRequirements: ['Bac 15+/20', 'Anglais C1', 'YÖS ou SAT'], tuitionFees: '500–2000 USD/an', scholarships: 'Türkiye Scholarships, bourse gouvernementale' },
      { name: 'Middle East Technical University', rank: 'Top 500', city: 'Ankara', website: 'metu.edu.tr', programs: ['Ingénierie', 'Architecture', 'Sciences', 'Économie'], admissionRequirements: ['Bac 15+/20', 'Anglais C1', 'YÖS'], tuitionFees: '500–1500 USD/an', scholarships: 'Türkiye Scholarships, METU bourse' },
      { name: 'Istanbul Technical University', rank: 'Top 600', city: 'Istanbul', website: 'itu.edu.tr', programs: ['Ingénierie', 'Architecture', 'Sciences', 'Management'], admissionRequirements: ['Bac 14+/20', 'Anglais B2', 'YÖS'], tuitionFees: '400–1200 USD/an', scholarships: 'Türkiye Scholarships' },
    ],
    jobOpportunities: [
      { sector: 'Industrie & Manufacturing', description: '15ème économie mondiale', avgSalary: '15 000–35 000 TRY/mois', demand: 'high' },
      { sector: 'Tourisme', description: '50M+ touristes/an', avgSalary: '12 000–25 000 TRY/mois', demand: 'high' },
      { sector: 'Tech & E-commerce', description: 'Écosystème startup en plein essor', avgSalary: '20 000–45 000 TRY/mois', demand: 'high' },
    ],
  },
  {
    id: 'saudi', name: 'Arabie Saoudite', nameFr: 'Arabie Saoudite', nameAr: 'المملكة العربية السعودية', continent: 'asie',
    generalInfo: { language: 'Arabe (+ anglais)', currency: 'Riyal saoudien (SAR)', costOfLiving: '3000–6000 SAR/mois', visaInfo: 'Visa étudiant, nombreuses bourses Vision 2030' },
    universities: [
      { name: 'King Abdullah University (KAUST)', rank: 'Top 100 Recherche', city: 'Thuwal', website: 'kaust.edu.sa', programs: ['Sciences', 'Ingénierie', 'Environnement', 'Informatique'], admissionRequirements: ['Master/PhD uniquement', 'Anglais C1', 'Dossier recherche'], tuitionFees: 'Gratuit + bourse complète', scholarships: 'Full fellowship KAUST' },
      { name: 'King Fahd University (KFUPM)', rank: 'Top 300 Ingénierie', city: 'Dhahran', website: 'kfupm.edu.sa', programs: ['Ingénierie', 'Sciences', 'Informatique', 'Business'], admissionRequirements: ['Bac SM 16+/20', 'Anglais B2', 'Dossier'], tuitionFees: 'Quasi gratuit', scholarships: 'Bourse gouvernementale' },
      { name: 'King Abdulaziz University', rank: 'Top 200 Arabe', city: 'Jeddah', website: 'kau.edu.sa', programs: ['Médecine', 'Sciences', 'Ingénierie', 'Lettres'], admissionRequirements: ['Bac 14+/20', 'Arabe ou Anglais B2', 'Dossier'], tuitionFees: 'Gratuit pour boursiers', scholarships: 'Bourse Vision 2030' },
    ],
    jobOpportunities: [
      { sector: 'Pétrole & Énergie', description: 'Saudi Aramco 1ère entreprise mondiale', avgSalary: '15 000–50 000 SAR/mois', demand: 'high' },
      { sector: 'Vision 2030 & Tech', description: 'NEOM/gigaprojets/IA', avgSalary: '12 000–40 000 SAR/mois', demand: 'high' },
      { sector: 'Santé & Médecine', description: 'Forte demande médecins spécialistes', avgSalary: '15 000–45 000 SAR/mois', demand: 'high' },
    ],
  },
  {
    id: 'australia', name: 'Australie', nameFr: 'Australie', nameAr: 'أستراليا', continent: 'oceanie',
    generalInfo: { language: 'Anglais', currency: 'Dollar australien (AUD)', costOfLiving: '1500–2200 AUD/mois', visaInfo: 'Student Visa (subclass 500), OSHC obligatoire' },
    universities: [
      { name: 'Australian National University', rank: 'Top 30 mondial', city: 'Canberra', website: 'anu.edu.au', programs: ['Sciences', 'Droit', 'Politique', 'Ingénierie'], admissionRequirements: ['Bac 16+/20', 'IELTS 6.5+', 'Dossier'], tuitionFees: '35 000–45 000 AUD/an', scholarships: 'ANU Chancellor, Australia Awards' },
      { name: 'University of Melbourne', rank: 'Top 35 mondial', city: 'Melbourne', website: 'unimelb.edu.au', programs: ['Médecine', 'Droit', 'Business', 'Sciences'], admissionRequirements: ['Bac 16+/20', 'IELTS 6.5+', 'Dossier'], tuitionFees: '35 000–48 000 AUD/an', scholarships: 'Melbourne International, Australia Awards' },
      { name: 'University of Sydney', rank: 'Top 40 mondial', city: 'Sydney', website: 'sydney.edu.au', programs: ['Ingénierie', 'Business', 'Médecine', 'Arts'], admissionRequirements: ['Bac 15+/20', 'IELTS 6.5+', 'Dossier'], tuitionFees: '35 000–50 000 AUD/an', scholarships: 'Sydney Scholars, Australia Awards' },
    ],
    jobOpportunities: [
      { sector: 'Mines & Ressources naturelles', description: 'Leader mondial minerais', avgSalary: '80 000–130 000 AUD/an', demand: 'high' },
      { sector: 'Tech & Cybersécurité', description: 'Sydney/Melbourne hubs tech', avgSalary: '70 000–110 000 AUD/an', demand: 'high' },
      { sector: 'Santé & Médecine', description: 'Pénurie médecins dans tout le pays', avgSalary: '80 000–150 000 AUD/an', demand: 'high' },
    ],
  },
];

// ─── Continent metadata ───────────────────────────────────────────────────────

const continents = [
  { id: 'europe',   label: 'Europe',     labelAr: 'أوروبا',              color: '#6366f1' },
  { id: 'amerique', label: 'Amériques',  labelAr: 'الأمريكتان',          color: '#10b981' },
  { id: 'asie',     label: 'Asie & M-O', labelAr: 'آسيا والشرق الأوسط', color: '#f59e0b' },
  { id: 'afrique',  label: 'Afrique',    labelAr: 'أفريقيا',             color: '#f43f5e' },
  { id: 'oceanie',  label: 'Océanie',    labelAr: 'أوقيانوسيا',          color: '#14b8a6' },
];

// ─── Short country codes ──────────────────────────────────────────────────────

const SHORT_LABELS: Record<string, string> = {
  france: 'FR', canada: 'CA', germany: 'DE', usa: 'US', uk: 'UK',
  uae: 'AE', morocco: 'MA', spain: 'ES', netherlands: 'NL',
  belgium: 'BE', turkey: 'TR', saudi: 'SA', australia: 'AU',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface WorldMapPageProps {
  lang: 'fr' | 'ar';
  onClose: () => void;
  onSignup: () => void;
}

// ─── MapPin Component ─────────────────────────────────────────────────────────

interface MapPinProps {
  country: CountryData;
  isSelected: boolean;
  isFiltered: boolean;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onClick: (c: CountryData) => void;
}

function MapPin({ country, isSelected, isFiltered, hoveredId, onHover, onClick }: MapPinProps) {
  const pos = PIN_POSITIONS[country.id];
  if (!pos) return null;
  const isHovered = hoveredId === country.id;
  const baseColor = CONTINENT_COLORS[country.continent] ?? '#6366f1';
  const fillColor = isSelected ? '#7c3aed' : isHovered ? '#a78bfa' : baseColor;
  const opacity = isFiltered ? 1 : 0.2;
  const r = isSelected ? 12 : isHovered ? 11 : 9;
  const label = SHORT_LABELS[country.id] ?? country.id.slice(0, 2).toUpperCase();

  return (
    <g style={{ cursor: 'pointer', opacity, transition: 'opacity 0.2s' }}
      onClick={() => onClick(country)}
      onMouseEnter={() => onHover(country.id)}
      onMouseLeave={() => onHover(null)}
    >
      {isSelected && <circle cx={pos.cx} cy={pos.cy} r={18} fill="none" stroke="#7c3aed" strokeWidth={2.5} opacity={0.4} />}
      {isHovered && !isSelected && <circle cx={pos.cx} cy={pos.cy} r={16} fill={baseColor} opacity={0.15} />}
      <circle cx={pos.cx} cy={pos.cy} r={r} fill={fillColor} stroke="white" strokeWidth={2} />
      <text x={pos.cx} y={pos.cy + 0.5} textAnchor="middle" dominantBaseline="middle"
        fontSize={r < 10 ? '5.5' : '6.5'} fontWeight="bold" fill="white"
        style={{ pointerEvents: 'none', userSelect: 'none' }}>
        {label}
      </text>
      {isHovered && (
        <g>
          <rect x={pos.cx - 32} y={pos.cy - 30} width={64} height={17} rx={4} fill="#1e1b4b" opacity={0.92} />
          <text x={pos.cx} y={pos.cy - 21} textAnchor="middle" dominantBaseline="middle"
            fontSize="7.5" fill="white" fontWeight="500"
            style={{ pointerEvents: 'none', userSelect: 'none' }}>
            {country.nameFr}
          </text>
        </g>
      )}
    </g>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WorldMapPage({ lang, onClose, onSignup }: WorldMapPageProps) {
  const isAr = lang === 'ar';
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [activeContinent, setActiveContinent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'universities' | 'jobs' | 'info'>('universities');
  const [expandedUni, setExpandedUni] = useState<number | null>(null);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const handleSelect = (c: CountryData) => {
    setSelectedCountry(c);
    setActiveTab('universities');
    setExpandedUni(null);
  };

  const demandColor = (d: 'high' | 'medium' | 'low') =>
    d === 'high' ? 'bg-green-100 text-green-700' : d === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
  const demandLabel = (d: 'high' | 'medium' | 'low') =>
    isAr ? (d === 'high' ? 'طلب مرتفع' : d === 'medium' ? 'طلب متوسط' : 'طلب منخفض')
         : (d === 'high' ? 'Forte demande' : d === 'medium' ? 'Demande moyenne' : 'Faible demande');

  return (
    <div className="fixed inset-0 z-[9000] bg-white overflow-y-auto" dir={isAr ? 'rtl' : 'ltr'}>

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌍</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isAr ? 'خريطة الجامعات العالمية' : 'Carte Mondiale des Universités'}
              </h1>
              <p className="text-sm text-gray-500">
                {isAr ? 'اضغط على دولة في الخريطة لاكتشاف جامعاتها وفرص العمل'
                       : 'Cliquez sur un pays dans la carte pour découvrir ses universités et opportunités'}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
            ✕
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Continent Filter ── */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button onClick={() => setActiveContinent(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${!activeContinent ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>
            {isAr ? '🌐 كل الدول' : '🌐 Tous les pays'}
          </button>
          {continents.map((c) => (
            <button key={c.id} onClick={() => setActiveContinent(activeContinent === c.id ? null : c.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${activeContinent === c.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>
              <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: c.color }} />
              {isAr ? c.labelAr : c.label}
            </button>
          ))}
        </div>

        {/* ── Promo Banner (always visible, above everything) ── */}
        {!selectedCountry && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 p-6 text-white shadow-xl mb-6">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
              {/* Left: text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎓</span>
                  <span className="text-xs font-bold bg-white/20 rounded-full px-3 py-1 uppercase tracking-wide">
                    {isAr ? 'حصري على MyTawjeh' : 'Exclusif MyTawjeh'}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black leading-tight mb-2">
                  {isAr
                    ? 'أكثر من 13 دولة و 39 جامعة عالمية'
                    : 'Plus de 13 pays & 39 universités mondiales'}
                </h3>
                <p className="text-purple-100 text-sm leading-relaxed">
                  {isAr
                    ? 'سجّل في MyTawjeh واحصل على توجيه شخصي نحو أفضل الجامعات العالمية — مجاناً تماماً.'
                    : "Inscris-toi sur MyTawjeh et reçois une orientation personnalisée vers les meilleures universités mondiales — entièrement gratuit."}
                </p>
              </div>
              {/* Right: stats + CTA */}
              <div className="flex flex-col gap-3 md:min-w-[220px]">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: '13+', lbl: isAr ? 'دولة' : 'Pays' },
                    { val: '39+', lbl: isAr ? 'جامعة' : 'Universités' },
                    { val: '100%', lbl: isAr ? 'مجاني' : 'Gratuit' },
                  ].map((s) => (
                    <div key={s.lbl} className="bg-white/15 rounded-xl p-2 text-center">
                      <div className="text-lg font-black">{s.val}</div>
                      <div className="text-xs text-purple-200">{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onSignup}
                  className="w-full bg-white text-purple-700 font-bold py-3 rounded-xl text-sm hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isAr ? '✨ إنشاء حساب مجاني' : '✨ Créer un compte gratuit'}
                </button>
                <p className="text-center text-xs text-purple-300">
                  {isAr ? 'لا بطاقة بنكية · أقل من دقيقة' : "Sans carte bancaire · Moins d'une minute"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Split Layout ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── SVG Map (60%) ── */}
          <div className="lg:w-[60%] w-full">
            <div className="rounded-2xl overflow-hidden border border-blue-200 shadow-lg">
              <svg viewBox="0 0 1000 500" className="w-full h-auto block">
                {/* Ocean */}
                <rect x="0" y="0" width="1000" height="500" fill="#bfdbfe" />
                {/* Americas */}
                <polygon points="80,95 290,95 310,205 285,325 195,365 115,305 75,205" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                {/* Europe */}
                <polygon points="375,125 525,125 545,215 505,225 455,220 415,215 375,182" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                {/* Africa */}
                <polygon points="395,218 485,218 495,345 452,375 408,345 392,282" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                {/* Asia */}
                <polygon points="518,125 755,125 785,205 762,265 702,285 598,275 538,245 518,205" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                {/* Oceania */}
                <polygon points="755,295 885,295 905,405 842,425 755,395" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />

                {/* Country Pins */}
                {countriesData.map((country) => (
                  <MapPin key={country.id} country={country}
                    isSelected={selectedCountry?.id === country.id}
                    isFiltered={!activeContinent || country.continent === activeContinent}
                    hoveredId={hoveredPin}
                    onHover={setHoveredPin}
                    onClick={handleSelect}
                  />
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-3 justify-center">
              {continents.map((c) => (
                <div key={c.id} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="w-3 h-3 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: c.color }} />
                  {isAr ? c.labelAr : c.label}
                </div>
              ))}
            </div>

            {/* Country grid (mobile fallback / quick access) */}
            <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
              {countriesData
                .filter(c => !activeContinent || c.continent === activeContinent)
                .map((country) => {
                  const isSelected = selectedCountry?.id === country.id;
                  const color = CONTINENT_COLORS[country.continent] ?? '#6366f1';
                  return (
                    <button key={country.id} onClick={() => handleSelect(country)}
                      className={`rounded-xl p-2 text-center border-2 transition-all hover:scale-105 ${isSelected ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-gray-100 bg-white hover:border-purple-200'}`}>
                      <div className="w-8 h-8 rounded-lg mx-auto mb-1 flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: color }}>
                        {SHORT_LABELS[country.id]}
                      </div>
                      <div className="text-xs font-medium text-gray-700 leading-tight">
                        {isAr ? country.nameAr : country.nameFr}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* ── Detail Panel (40%) ── */}
          <div className="lg:w-[40%] w-full">
            {!selectedCountry ? (
              <div className="h-full flex flex-col gap-4">

                {/* ── Feature list ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-sm font-bold text-gray-700 mb-3">
                    {isAr ? '🌟 ما ستحصل عليه بعد التسجيل' : '🌟 Ce que tu obtiens après inscription'}
                  </p>
                  <ul className="space-y-2.5">
                    {(isAr ? [
                      { icon: '🗺️', text: 'وصول كامل لخريطة الجامعات العالمية' },
                      { icon: '🤖', text: 'توجيه ذكي بالذكاء الاصطناعي' },
                      { icon: '📊', text: 'تتبع نقاطك ومعدلاتك' },
                      { icon: '📝', text: 'تمارين وامتحانات تجريبية' },
                      { icon: '🔔', text: 'إشعارات مواعيد التسجيل' },
                    ] : [
                      { icon: '🗺️', text: 'Accès complet à la carte des universités mondiales' },
                      { icon: '🤖', text: 'Orientation intelligente par IA' },
                      { icon: '📊', text: 'Suivi de tes notes et moyennes' },
                      { icon: '📝', text: 'Exercices et examens blancs' },
                      { icon: '🔔', text: "Alertes dates d'inscription" },
                    ]).map((item) => (
                      <li key={item.text} className="flex items-start gap-2.5">
                        <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                        <span className="text-sm text-gray-600">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ── Hint ── */}
                <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                  <span className="text-lg">👆</span>
                  <p className="text-xs text-blue-700 font-medium">
                    {isAr ? 'اضغط على أي دولة لاكتشاف جامعاتها'
                           : 'Clique sur un pays pour explorer ses universités'}
                  </p>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">

                {/* Country Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ backgroundColor: CONTINENT_COLORS[selectedCountry.continent] ?? '#6366f1' }}>
                      {SHORT_LABELS[selectedCountry.id] ?? selectedCountry.id.slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{isAr ? selectedCountry.nameAr : selectedCountry.nameFr}</h2>
                      <p className="text-purple-200 text-xs mt-0.5">
                        {selectedCountry.generalInfo.language} · {selectedCountry.generalInfo.currency}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                      💰 {selectedCountry.generalInfo.costOfLiving}
                    </span>
                    <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                      ✈️ {selectedCountry.generalInfo.visaInfo}
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                  {([
                    { id: 'universities' as const, label: isAr ? '🎓 الجامعات' : '🎓 Universités' },
                    { id: 'jobs' as const,         label: isAr ? '💼 العمل'    : '💼 Emploi' },
                    { id: 'info' as const,         label: isAr ? 'ℹ️ معلومات' : 'ℹ️ Infos' },
                  ]).map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3 text-xs font-semibold transition-colors ${activeTab === tab.id ? 'text-purple-700 border-b-2 border-purple-600 bg-purple-50' : 'text-gray-500 hover:text-gray-700'}`}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-4 overflow-y-auto max-h-[55vh]">

                  {/* Universities */}
                  {activeTab === 'universities' && (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-400 mb-3">
                        {isAr ? `أفضل ${selectedCountry.universities.length} جامعات في ${selectedCountry.nameAr}`
                               : `Top ${selectedCountry.universities.length} universités en ${selectedCountry.nameFr}`}
                      </p>
                      {selectedCountry.universities.map((uni, i) => (
                        <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                          <button onClick={() => setExpandedUni(expandedUni === i ? null : i)}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                {i + 1}
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-xs">{uni.name}</div>
                                <div className="text-xs text-gray-400">{uni.city} · {uni.rank}</div>
                              </div>
                            </div>
                            <span className="text-gray-400 text-sm ml-2">{expandedUni === i ? '▲' : '▼'}</span>
                          </button>
                          {expandedUni === i && (
                            <div className="px-3 pb-3 space-y-2 border-t border-gray-50 pt-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-blue-50 rounded-lg p-2">
                                  <div className="text-xs font-bold text-blue-700 mb-1">{isAr ? '📚 التخصصات' : '📚 Programmes'}</div>
                                  <div className="flex flex-wrap gap-1">
                                    {uni.programs.map((p) => <span key={p} className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{p}</span>)}
                                  </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-2">
                                  <div className="text-xs font-bold text-green-700 mb-1">{isAr ? '💰 الرسوم' : '💰 Frais'}</div>
                                  <div className="text-xs text-green-800 font-medium">{uni.tuitionFees}</div>
                                </div>
                              </div>
                              <div className="bg-amber-50 rounded-lg p-2">
                                <div className="text-xs font-bold text-amber-700 mb-1">{isAr ? '📋 شروط القبول' : "📋 Conditions d'admission"}</div>
                                <ul className="space-y-0.5">
                                  {uni.admissionRequirements.map((req) => (
                                    <li key={req} className="flex gap-1 text-xs text-amber-800"><span>•</span><span>{req}</span></li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-purple-50 rounded-lg p-2">
                                <div className="text-xs font-bold text-purple-700 mb-1">{isAr ? '🎁 المنح' : '🎁 Bourses'}</div>
                                <div className="text-xs text-purple-800">{uni.scholarships}</div>
                              </div>
                              <a href={`https://${uni.website}`} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium">
                                🔗 {uni.website}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Jobs */}
                  {activeTab === 'jobs' && (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-400 mb-3">
                        {isAr ? `فرص العمل الرئيسية في ${selectedCountry.nameAr}`
                               : `Principales opportunités d'emploi en ${selectedCountry.nameFr}`}
                      </p>
                      {selectedCountry.jobOpportunities.map((job, i) => (
                        <div key={i} className="rounded-xl border border-gray-100 p-3 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-bold text-gray-900 text-xs">{job.sector}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${demandColor(job.demand)}`}>
                                  {demandLabel(job.demand)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{job.description}</p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-400">{isAr ? 'متوسط الراتب:' : 'Salaire moyen:'}</span>
                                <span className="text-xs font-bold text-green-700">{job.avgSalary}</span>
                              </div>
                            </div>
                            <div className="text-xl flex-shrink-0">{i === 0 ? '🏆' : i === 1 ? '🥈' : '🥉'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Info */}
                  {activeTab === 'info' && (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: '🗣️', label: isAr ? 'اللغة' : 'Langue',           value: selectedCountry.generalInfo.language },
                        { icon: '💱', label: isAr ? 'العملة' : 'Devise',           value: selectedCountry.generalInfo.currency },
                        { icon: '🏠', label: isAr ? 'تكلفة المعيشة' : 'Coût de la vie', value: selectedCountry.generalInfo.costOfLiving },
                        { icon: '✈️', label: isAr ? 'التأشيرة' : 'Visa & Séjour',  value: selectedCountry.generalInfo.visaInfo },
                      ].map((item) => (
                        <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                          <div className="text-xl mb-1">{item.icon}</div>
                          <div className="text-xs font-bold text-gray-500 mb-0.5">{item.label}</div>
                          <div className="text-xs font-semibold text-gray-800">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
