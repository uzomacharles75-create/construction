import Company from '../models/Company';

export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export async function ensureUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = generateSlugFromName(name) || 'company';
  let slug = base;
  let counter = 1;

  while (true) {
    const filter: Record<string, unknown> = { slug };
    if (excludeId) filter._id = { $ne: excludeId };
    const existing = await Company.findOne(filter).select('_id');
    if (!existing) return slug;
    slug = `${base}-${counter++}`;
  }
}

export async function ensureCompanyHasSlug(company: { _id: unknown; name: string; slug?: string; save: () => Promise<unknown> }) {
  if (company.slug) return company.slug;
  company.slug = await ensureUniqueSlug(company.name, String(company._id));
  await company.save();
  return company.slug;
}

export async function backfillMissingCompanySlugs() {
  const companies = await Company.find({
    $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
  });

  for (const company of companies) {
    await ensureCompanyHasSlug(company);
  }

  if (companies.length > 0) {
    console.log(`✅ Backfilled slugs for ${companies.length} companies`);
  }
}
