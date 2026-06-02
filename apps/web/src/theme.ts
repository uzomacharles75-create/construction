// ─── BuildHub Unified Theme ────────────────────────────────────────────────
// Import from this file instead of writing raw Tailwind strings inline.
// All class strings here are hand-typed — zero regex contamination.

export const t = {
  // ── PAGE SHELLS ──────────────────────────────────────────────────────────
  page:        'min-h-screen bg-brand-navy text-white',
  pageInner:   'max-w-7xl mx-auto px-6 pb-20',

  // ── CARDS ────────────────────────────────────────────────────────────────
  card:        'bg-brand-navy-card border border-brand-border rounded-3xl',
  cardLg:      'bg-brand-navy-card border border-brand-border rounded-[2.5rem]',
  cardXl:      'bg-brand-navy-card border border-brand-border rounded-[3rem]',
  cardDark:    'bg-brand-navy rounded-[3rem] shadow-2xl',
  cardHover:   'hover:shadow-card hover:border-brand-yellow/20 transition-all',

  // ── TYPOGRAPHY ───────────────────────────────────────────────────────────
  h1:          'text-4xl font-black text-white tracking-tight',
  h2:          'text-3xl font-black text-white tracking-tight',
  h3:          'text-xl font-black text-white',
  h4:          'text-base font-black text-white',
  label:       'text-[10px] font-black text-white/50 uppercase tracking-[0.2em]',
  muted:       'text-sm text-white/50 font-medium',
  micro:       'text-[9px] font-black uppercase tracking-widest',

  // ── BUTTONS ──────────────────────────────────────────────────────────────
  btnPrimary:  'bg-brand-yellow text-brand-navy font-black rounded-2xl px-8 py-3 text-xs uppercase tracking-widest shadow-yellow hover:bg-brand-yellow-dim hover:scale-[1.02] transition-all',
  btnSecondary:'bg-brand-navy-card border border-brand-border text-white/70 font-black rounded-2xl px-6 py-3 text-xs uppercase tracking-widest hover:bg-brand-navy-light transition-all',
  btnGhost:    'text-white/50 font-black text-xs uppercase tracking-widest hover:text-white transition-colors',
  btnDanger:   'bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black rounded-2xl px-6 py-3 text-xs hover:bg-rose-500/20 transition-all',

  // ── INPUTS ───────────────────────────────────────────────────────────────
  input:       'w-full p-4 bg-brand-navy-light border border-brand-border rounded-2xl text-white text-sm font-medium outline-none focus:ring-2 focus:ring-brand-yellow/40 placeholder:text-white/25 transition-all',
  select:      'w-full p-4 bg-brand-navy-light border border-brand-border rounded-2xl text-white text-sm font-medium outline-none focus:ring-2 focus:ring-brand-yellow/40 transition-all',
  textarea:    'w-full p-4 bg-brand-navy-light border border-brand-border rounded-2xl text-white text-sm font-medium outline-none focus:ring-2 focus:ring-brand-yellow/40 placeholder:text-white/25 resize-none transition-all',

  // ── BADGES ───────────────────────────────────────────────────────────────
  badgeYellow: 'px-3 py-1 bg-brand-yellow-pale text-brand-yellow text-[9px] font-black uppercase tracking-widest rounded-full',
  badgeGreen:  'px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20',
  badgeRed:    'px-3 py-1 bg-rose-500/10 text-rose-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-rose-500/20',
  badgeAmber:  'px-3 py-1 bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-500/20',
  badgeNavy:   'px-3 py-1 bg-brand-navy-light text-white/50 text-[9px] font-black uppercase tracking-widest rounded-full border border-brand-border',

  // ── ICONS ────────────────────────────────────────────────────────────────
  iconBoxYellow: 'w-12 h-12 bg-brand-yellow-pale text-brand-yellow rounded-2xl flex items-center justify-center',
  iconBoxNavy:   'w-12 h-12 bg-brand-navy-light text-white/50 rounded-2xl flex items-center justify-center border border-brand-border',
  iconBoxGreen:  'w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center',

  // ── DIVIDERS ─────────────────────────────────────────────────────────────
  divider:     'border-t border-brand-border',
  row:         'border-b border-brand-border',

  // ── TABLES ───────────────────────────────────────────────────────────────
  tableHead:   'bg-brand-navy-light text-[10px] font-black uppercase text-white/50 tracking-[0.15em]',
  tableRow:    'border-b border-brand-border hover:bg-brand-navy-light/40 transition-colors group',
  tableCell:   'px-6 py-5 text-sm font-bold text-white/80',

  // ── STAT CARD ────────────────────────────────────────────────────────────
  statCard:    'bg-brand-navy-card border border-brand-border p-6 rounded-3xl shadow-sm',

  // ── EMPTY STATE ──────────────────────────────────────────────────────────
  emptyState:  'bg-brand-navy-card border-2 border-dashed border-brand-border rounded-[3rem] p-20 text-center',

  // ── MODAL OVERLAY ────────────────────────────────────────────────────────
  overlay:     'fixed inset-0 z-50 bg-brand-navy/70 backdrop-blur-sm flex items-center justify-center p-4',
  modal:       'bg-brand-navy-card border border-brand-border rounded-[3rem] w-full max-w-md shadow-2xl p-10',

  // ── HEADER SECTION ───────────────────────────────────────────────────────
  pageHeader:  'flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10',

  // ── GLOW / DECORATIVE ────────────────────────────────────────────────────
  glowBg:      'absolute inset-0 pointer-events-none',

} as const;

// ── Status badge helper ───────────────────────────────────────────────────
export const statusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'paid':
    case 'verified':
    case 'active':
    case 'in transit':
      return t.badgeGreen;
    case 'contacted':
      return t.badgeGreen;
    case 'pending':
    case 'new':
      return t.badgeAmber;
    case 'overdue':
    case 'rejected':
    case 'inactive':
    case 'closed':
      return t.badgeRed;
    default:
      return t.badgeNavy;
  }
};
