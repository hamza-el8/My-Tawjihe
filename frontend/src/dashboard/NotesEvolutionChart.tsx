import { useMemo } from 'react';

// ─── NOTES EVOLUTION CHART ────────────────────────────────────────────────────
function NotesEvolutionChart({ notes }: { notes: any[] }) {
  const subjects = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    notes.forEach(n => { if (!seen.has(n.matiere)) { seen.add(n.matiere); result.push(n.matiere); } });
    return result.slice(0, 5);
  }, [notes]);

  const colors = ['#7c3aed','#10b981','#3b82f6','#f59e0b','#ec4899'];
  const W = 520, H = 170, PAD = 36;

  const bySubject = useMemo(() => {
    const map: Record<string, { y: number; idx: number }[]> = {};
    notes.forEach((n, i) => {
      if (!map[n.matiere]) map[n.matiere] = [];
      map[n.matiere].push({ y: parseFloat(n.valeur), idx: i });
    });
    return map;
  }, [notes]);

  if (notes.length < 2) return null;

  const toCoords = (idx: number, val: number) => ({
    x: PAD + (notes.length <= 1 ? (W - PAD * 2) / 2 : (idx / (notes.length - 1)) * (W - PAD * 2)),
    y: PAD + ((20 - val) / 20) * (H - PAD * 2),
  });

  return (
    <div className="dash-card p-5">
      <h3 className="dash-section-title">📈 Évolution des notes</h3>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 280 }}>
          {/* Grid */}
          {[0, 5, 10, 15, 20].map(v => {
            const cy = PAD + ((20 - v) / 20) * (H - PAD * 2);
            return (
              <g key={v}>
                <line x1={PAD} y1={cy} x2={W - PAD} y2={cy} stroke={v === 10 ? '#fde68a' : '#f1f5f9'} strokeWidth={v === 10 ? 1.5 : 1} strokeDasharray={v === 10 ? '5,3' : undefined} />
                <text x={PAD - 5} y={cy + 4} fontSize="9" fill="#94a3b8" textAnchor="end">{v}</text>
              </g>
            );
          })}
          {/* Lines per subject */}
          {subjects.map((subj, si) => {
            const pts = bySubject[subj];
            if (!pts || pts.length < 1) return null;
            const color = colors[si % colors.length];
            let d = '';
            pts.forEach((p, i) => {
              const { x, y } = toCoords(p.idx, p.y);
              d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
            });
            return (
              <g key={subj}>
                <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                {pts.map((p, i) => {
                  const { x, y } = toCoords(p.idx, p.y);
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill={color} stroke="#fff" strokeWidth="2" />
                      {pts.length <= 8 && (
                        <text x={x} y={y - 8} fontSize="8" fill={color} textAnchor="middle" fontWeight="bold">{p.y}</text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap gap-3 mt-2">
        {subjects.map((s, i) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }} />
            <span className="text-xs text-gray-500 font-medium">{s}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-4 border-t-2 border-dashed border-amber-400" />
          <span className="text-xs text-gray-400">Seuil 10</span>
        </div>
      </div>
    </div>
  );
}

export default NotesEvolutionChart;
