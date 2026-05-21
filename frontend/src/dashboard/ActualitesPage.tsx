import { useState, useEffect } from 'react';

// ─── ACTUALITES PAGE ─────────────────────────────────────────────────────────
// Curated + live news. Static items always shown; RSS items loaded from public API.
const STATIC_NEWS = [
  {
    id: 's1',
    titre: "Concours CNC 2026 — Calendrier officiel",
    source: "CPGE Maroc",
    date: '2025-12-01',
    emoji: '🏆',
    categorie: 'Concours',
    resume: "Le Concours National Commun (CNC) pour l'accès aux grandes écoles d'ingénieurs aura lieu du 15 au 20 juin 2026. Les inscriptions ouvrent le 1er mars 2026.",
    lien: 'https://cnc.ac.ma',
  },
  {
    id: 's2',
    titre: "ENSA — Nouvelles filières IA et Data Science 2026",
    source: "ENSA Maroc",
    date: '2025-09-10',
    emoji: '🤖',
    categorie: 'Université',
    resume: "Les Écoles Nationales des Sciences Appliquées lancent des formations en IA, Data Science et Cybersécurité. Niveau requis : 16/20 en maths au CNC.",
    lien: 'https://ensa.ac.ma',
  },
  {
    id: 's3',
    titre: "Bourses d'excellence AMCI 2026 — Candidatures ouvertes",
    source: "AMCI",
    date: '2025-11-15',
    emoji: '💰',
    categorie: 'Bourse',
    resume: "Plus de 500 bourses d'études à l'étranger pour les étudiants marocains. France, Canada, Espagne, Allemagne. Dossier avant le 28 février 2026.",
    lien: 'https://amci.ma',
  },
  {
    id: 's4',
    titre: "Réforme LMD 2026 — Ce qui change pour les étudiants",
    source: "Ministère de l'Enseignement Supérieur",
    date: '2025-08-30',
    emoji: '📋',
    categorie: 'Réforme',
    resume: "Crédits capitalisables, passerelles entre filières, et reconnaissance internationale facilitée des diplômes marocains.",
    lien: 'https://enssup.gov.ma',
  },
  {
    id: 's5',
    titre: "Guide orientation Bac+1 — Toutes les filières 2026",
    source: "Mowajih AI",
    date: '2025-10-20',
    emoji: '📚',
    categorie: 'Orientation',
    resume: "CPGE, BTS, Licence, ENSA, ENCG, Médecine — comparatif complet des débouchés, salaires et taux d'insertion par filière au Maroc.",
    lien: '#',
  },
  {
    id: 's6',
    titre: "Admission en Médecine 2026 — Nouvelles règles du concours",
    source: "Facultés de Médecine",
    date: '2025-10-05',
    emoji: '🏥',
    categorie: 'Concours',
    resume: "Le concours d'accès aux études médicales adopte un nouveau format en 2026 : QCM informatisé, coefficient science de la vie augmenté.",
    lien: 'https://men.gov.ma',
  },
];

const CATEGORIE_COLORS: Record<string, { bg: string; color: string }> = {
  Concours:   { bg: '#fff7ed', color: '#c2410c' },
  Université: { bg: '#eff6ff', color: '#1d4ed8' },
  Bourse:     { bg: '#f0fdf4', color: '#15803d' },
  Orientation:{ bg: '#fdf4ff', color: '#9333ea' },
  Réforme:    { bg: '#fff1f2', color: '#be123c' },
  Actualité:  { bg: '#f8f7ff', color: '#7c3aed' },
};

function ActualitesPage() {
  const [activeCategorie, setActiveCategorie] = useState('');
  const [liveNews, setLiveNews] = useState<any[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);

  // Fetch live news via public RSS-to-JSON proxy (MEN Maroc)
  useEffect(() => {
    const RSS_URL = encodeURIComponent('https://men.gov.ma/fr/feed');
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}&count=4`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok' && Array.isArray(data.items)) {
          const items = data.items.map((item: any, i: number) => ({
            id: `live_${i}`,
            titre: item.title?.slice(0, 90) || 'Actualité',
            source: "MEN — Ministère de l'Éducation",
            date: item.pubDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            emoji: '📰',
            categorie: 'Actualité',
            resume: item.description?.replace(/<[^>]*>/g, '').slice(0, 180) || '',
            lien: item.link || '#',
          }));
          setLiveNews(items);
        }
      })
      .catch(() => {}) // Silent fail — static news always shown
      .finally(() => setLiveLoading(false));
  }, []);

  const allNews = [...(liveLoading ? [] : liveNews), ...STATIC_NEWS];
  const categories = [...new Set(allNews.map(a => a.categorie))];
  const filtered = activeCategorie ? allNews.filter(a => a.categorie === activeCategorie) : allNews;

  return (
    <div>
      {/* Filter chips */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:22, alignItems:'center' }}>
        <button
          onClick={() => setActiveCategorie('')}
          style={{ padding:'6px 14px', borderRadius:999, fontSize:12, fontWeight:700, cursor:'pointer', border:'none', background: activeCategorie==='' ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#f1f5f9', color: activeCategorie==='' ? '#fff' : '#64748b', transition:'all .15s' }}
        >
          Tout ({allNews.length})
        </button>
        {categories.map(cat => {
          const c = CATEGORIE_COLORS[cat] || { bg:'#f1f5f9', color:'#64748b' };
          const count = allNews.filter(a => a.categorie === cat).length;
          return (
            <button key={cat} onClick={() => setActiveCategorie(activeCategorie===cat ? '' : cat)} style={{
              padding:'6px 14px', borderRadius:999, fontSize:12, fontWeight:700, cursor:'pointer', border:'none',
              background: activeCategorie===cat ? c.color : c.bg, color: activeCategorie===cat ? '#fff' : c.color, transition:'all .15s',
            }}>{cat} ({count})</button>
          );
        })}
        {liveLoading && (
          <span style={{ fontSize:11, color:'#94a3b8', display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:12, height:12, borderRadius:'50%', border:'2px solid #e2e8f0', borderTopColor:'#7c3aed', animation:'spin 1s linear infinite', display:'inline-block' }} />
            Actualités en direct...
          </span>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
        {/* Skeleton loaders while live news loads */}
        {liveLoading && [1,2,3,4].map(i => (
          <div key={`sk_${i}`} className="dash-card p-5">
            <div className="dash-skeleton" style={{ height:14, borderRadius:6, marginBottom:10, width:'30%' }} />
            <div className="dash-skeleton" style={{ height:18, borderRadius:6, marginBottom:8, width:'90%' }} />
            <div className="dash-skeleton" style={{ height:14, borderRadius:6, marginBottom:6, width:'100%' }} />
            <div className="dash-skeleton" style={{ height:14, borderRadius:6, width:'70%' }} />
          </div>
        ))}

        {filtered.map(a => {
          const c = CATEGORIE_COLORS[a.categorie] || { bg:'#f8f7ff', color:'#7c3aed' };
          return (
            <div key={a.id} className="dash-card p-5" style={{ display:'flex', flexDirection:'column' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:12 }}>
                <div style={{ fontSize:26 }}>{a.emoji}</div>
                <span style={{ padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:c.bg, color:c.color, flexShrink:0 }}>
                  {a.categorie}
                </span>
              </div>
              <h3 style={{ fontSize:14, fontWeight:800, color:'#0f0c29', lineHeight:1.4, marginBottom:8 }}>{a.titre}</h3>
              {a.resume && <p style={{ fontSize:12.5, color:'#64748b', lineHeight:1.6, flex:1, marginBottom:12 }}>{a.resume}</p>}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid #f1f5f9', paddingTop:10 }}>
                <div>
                  <p style={{ fontSize:11, color:'#94a3b8', margin:0, fontWeight:600 }}>{a.source}</p>
                  <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>
                    {new Date(a.date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
                  </p>
                </div>
                {a.lien && a.lien !== '#' && (
                  <a href={a.lien} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, fontWeight:700, color:'#7c3aed', textDecoration:'none', padding:'5px 10px', borderRadius:6, background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.15)' }}>
                    Lire →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActualitesPage;
