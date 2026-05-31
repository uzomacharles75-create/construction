// Heuristic construction filter — NO AI. Works fully offline.

const CONSTRUCTION_KEYWORDS = [
  'construction',
  'build',
  'building',
  'civil',
  'road',
  'highway',
  'bridge',
  'borehole',
  'housing',
  'house',
  'infrastructure',
  'contractor',
  'quantity surveyor',
  'architect',
  'architecture',
  'engineer',
  'engineering',
  'procurement',
  'tender',
  'boq',
  'cement',
  'steel',
  'concrete',
  'electrical installation',
  'plumbing',
  'renovation',
  'works',
  'site',
  'structural',
  'drainage',
  'water supply',
  'pavement',
  'foundation',
  'reinforcement',
  'masonry',
  'rehabilitation',
  'earthworks',
  'excavation',
  'supply and installation',
];

/**
 * Returns true if the given text appears construction-related.
 */
export function isConstructionRelated(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return CONSTRUCTION_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Maps the text to a sensible construction category label.
 */
export function guessCategory(text: string): string {
  const lower = (text || '').toLowerCase();

  if (/\b(road|highway|pavement|asphalt|access route)\b/.test(lower)) {
    return 'Roads';
  }
  if (/\b(house|housing|residential|apartment|building|block|school|hospital|office)\b/.test(lower)) {
    return 'Buildings/Housing';
  }
  if (/\b(borehole|water supply|water system|drainage|sewer|dam|irrigation|pipeline)\b/.test(lower)) {
    return 'Water/Borehole';
  }
  if (/\b(electrical|electrification|power|solar|wiring|substation|transformer)\b/.test(lower)) {
    return 'Electrical';
  }
  if (/\b(supply|installation|procurement|delivery|equipment|materials)\b/.test(lower)) {
    return 'Procurement/Supply';
  }
  if (
    /\b(engineer|quantity surveyor|architect|foreman|site manager|technician|draughtsman)\b/.test(
      lower
    )
  ) {
    return 'Engineering Job';
  }
  if (/\b(civil|bridge|earthworks|excavation|structural|foundation|culvert)\b/.test(lower)) {
    return 'Civil Works';
  }
  return 'General Construction';
}
