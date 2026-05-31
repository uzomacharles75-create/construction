// Personalized match score — deterministic, NO AI.

interface ScorableOpp {
  country?: string;
  city?: string;
  category?: string;
  title?: string;
  description?: string;
  deadline?: Date | string | null;
}

interface ScorableCompany {
  country?: string;
  city?: string;
  sector?: string;
}

/**
 * Computes a 0-100 personalized match score for an opportunity against a company.
 * Deterministic: pass `now` explicitly to keep it test-stable.
 */
export function computeMatchScore(
  opp: ScorableOpp,
  company?: ScorableCompany | null,
  now: Date = new Date()
): number {
  let score = 55;

  const norm = (v?: string) => (v || '').trim().toLowerCase();

  // Same country
  if (opp.country && company?.country && norm(opp.country) === norm(company.country)) {
    score += 20;
  }

  // Same city
  if (opp.city && company?.city && norm(opp.city) === norm(company.city)) {
    score += 8;
  }

  // Sector / keyword overlap
  const oppText = `${opp.title || ''} ${opp.description || ''} ${opp.category || ''}`.toLowerCase();
  if (company?.sector) {
    const sectorTerms = norm(company.sector)
      .split(/[^a-z]+/)
      .filter((t) => t.length > 2);
    const overlaps = sectorTerms.some((t) => oppText.includes(t));
    if (overlaps) score += 12;
  } else {
    // Company has no sector info — give a small neutral boost
    score += 8;
  }

  // Expired deadline penalty
  if (opp.deadline) {
    const d = opp.deadline instanceof Date ? opp.deadline : new Date(opp.deadline);
    if (!isNaN(d.getTime()) && d.getTime() < now.getTime()) {
      score -= 25;
    }
  }

  // Clamp [30, 98]
  score = Math.max(30, Math.min(98, score));
  return Math.round(score);
}
