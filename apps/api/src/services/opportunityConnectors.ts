import { IOpportunity } from '../models/Opportunity';
import { isConstructionRelated, guessCategory } from '../utils/constructionFilter';

type OppInput = Partial<IOpportunity>;

const safeDate = (val: any): Date | undefined => {
  if (!val) return undefined;
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
};

/**
 * (a) World Bank procurement notices — REAL, free, no API key.
 */
export async function worldBankConnector(): Promise<OppInput[]> {
  try {
    const url =
      'https://search.worldbank.org/api/v2/procnotices?format=json&rows=120';
    const res = await fetch(url);
    if (!res.ok) return [];
    const data: any = await res.json();
    const notices: any[] = data?.procnotices || [];

    const mapped: OppInput[] = [];
    for (const n of notices) {
      const bidDesc: string = n.bid_description || n.project_name || '';
      const group: string = n.procurement_group || '';

      // Filter to construction only
      if (!isConstructionRelated(`${bidDesc} ${group}`)) continue;

      const id = n.id || n.project_id;
      if (!id) continue;

      mapped.push({
        externalId: `worldbank:${id}`,
        title: bidDesc || n.project_name || 'World Bank Procurement Notice',
        description: n.notice_text || n.project_name || bidDesc,
        type: 'tender',
        category: guessCategory(bidDesc) || group || 'Procurement/Supply',
        source: 'World Bank',
        sourceUrl: `https://projects.worldbank.org/en/projects-operations/procurement-detail/${id}`,
        organization: n.contact_organization || '',
        country: n.project_ctry_name || '',
        locationText: n.project_ctry_name || '',
        deadline: safeDate(n.submission_deadline_date),
        contactEmail: n.contact_email || '',
        contactPhone: n.contact_phone_no || '',
        sector: 'government',
        isConstruction: true,
        postedAt: safeDate(n.noticedate),
      });
    }
    return mapped;
  } catch {
    return [];
  }
}

/**
 * (b) JSearch (RapidAPI) — STUB. Returns [] unless JSEARCH_API_KEY is set.
 */
export async function jsearchConnector(): Promise<OppInput[]> {
  try {
    const key = process.env.JSEARCH_API_KEY;
    if (!key) return [];

    const url =
      'https://jsearch.p.rapidapi.com/search?query=construction%20jobs%20in%20Nigeria&num_pages=1';
    const res = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });
    if (!res.ok) return [];
    const data: any = await res.json();
    const jobs: any[] = data?.data || [];

    const mapped: OppInput[] = [];
    for (const j of jobs) {
      const text = `${j.job_title || ''} ${j.job_description || ''}`;
      if (!isConstructionRelated(text)) continue;

      mapped.push({
        externalId: `jsearch:${j.job_id}`,
        title: j.job_title || 'Construction Job',
        description: j.job_description || '',
        type: 'job',
        category: guessCategory(text) || 'Engineering Job',
        source: 'JSearch',
        sourceUrl: j.job_apply_link || j.job_google_link || '#',
        organization: j.employer_name || '',
        country: j.job_country || '',
        city: j.job_city || '',
        locationText: [j.job_city, j.job_state, j.job_country]
          .filter(Boolean)
          .join(', '),
        deadline: undefined,
        contactEmail: '',
        sector: 'private',
        isConstruction: true,
        postedAt: safeDate(j.job_posted_at_datetime_utc),
      });
    }
    return mapped;
  } catch {
    return [];
  }
}

/**
 * (c) Sample fallback — always works, zero external dependencies.
 */
export async function sampleConnector(): Promise<OppInput[]> {
  try {
    const now = new Date();
    const inDays = (d: number): Date => {
      const x = new Date(now);
      x.setDate(x.getDate() + d);
      return x;
    };
    const agoDays = (d: number): Date => {
      const x = new Date(now);
      x.setDate(x.getDate() - d);
      return x;
    };

    const items: OppInput[] = [
      {
        externalId: 'sample:1',
        title: 'Construction of 12km Rural Access Road — Littoral Region',
        description:
          'Tender for the construction and asphalt surfacing of a 12km rural access road including drainage, culverts and earthworks in the Littoral Region.',
        type: 'tender',
        category: 'Roads',
        source: 'Sample',
        sourceUrl: 'https://www.mintp.cm',
        organization: 'Ministry of Public Works',
        country: 'Cameroon',
        region: 'Littoral',
        city: 'Douala',
        locationText: 'Littoral Region, Cameroon',
        budget: 450000,
        currency: 'USD',
        deadline: inDays(45),
        sector: 'government',
        isConstruction: true,
        contactEmail: 'procurement@mintp.cm',
        postedAt: agoDays(5),
      },
      {
        externalId: 'sample:2',
        title: 'Supply and Installation of Borehole Water Systems (8 Sites)',
        description:
          'Procurement for drilling, supply and installation of solar-powered borehole water systems across 8 rural communities in Kano State.',
        type: 'tender',
        category: 'Water/Borehole',
        source: 'Sample',
        sourceUrl: 'https://www.kanostate.gov.ng',
        organization: 'Kano State Water Board',
        country: 'Nigeria',
        region: 'Kano',
        city: 'Kano',
        locationText: 'Kano State, Nigeria',
        budget: 320000,
        currency: 'USD',
        deadline: inDays(30),
        sector: 'government',
        isConstruction: true,
        contactEmail: 'tenders@kanowater.gov.ng',
        postedAt: agoDays(3),
      },
      {
        externalId: 'sample:3',
        title: 'Design & Build of 24-Unit Affordable Housing Block',
        description:
          'Design and build contract for a 24-unit affordable housing block including structural works, electrical installation and plumbing in Accra.',
        type: 'tender',
        category: 'Buildings/Housing',
        source: 'Sample',
        sourceUrl: 'https://www.mwh.gov.gh',
        organization: 'Ministry of Works and Housing',
        country: 'Ghana',
        region: 'Greater Accra',
        city: 'Accra',
        locationText: 'Accra, Ghana',
        budget: 980000,
        currency: 'USD',
        deadline: inDays(60),
        sector: 'government',
        isConstruction: true,
        contactEmail: 'procurement@mwh.gov.gh',
        postedAt: agoDays(8),
      },
      {
        externalId: 'sample:4',
        title: 'Construction of Reinforced Concrete Bridge over Nyong River',
        description:
          'Civil works tender for a 60m reinforced concrete bridge including foundations, abutments and approach roads over the Nyong River.',
        type: 'tender',
        category: 'Civil Works',
        source: 'Sample',
        sourceUrl: 'https://www.mintp.cm',
        organization: 'Ministry of Public Works',
        country: 'Cameroon',
        region: 'Centre',
        city: 'Yaoundé',
        locationText: 'Centre Region, Cameroon',
        budget: 1250000,
        currency: 'USD',
        deadline: inDays(50),
        sector: 'government',
        isConstruction: true,
        contactEmail: 'bridges@mintp.cm',
        postedAt: agoDays(10),
      },
      {
        externalId: 'sample:5',
        title: 'Rehabilitation of Township Roads and Drainage — Nairobi',
        description:
          'Procurement for the rehabilitation of 8km of township roads including stormwater drainage, pavement reinstatement and road marking.',
        type: 'tender',
        category: 'Roads',
        source: 'Sample',
        sourceUrl: 'https://www.kura.go.ke',
        organization: 'Kenya Urban Roads Authority',
        country: 'Kenya',
        region: 'Nairobi',
        city: 'Nairobi',
        locationText: 'Nairobi, Kenya',
        budget: 540000,
        currency: 'USD',
        deadline: inDays(40),
        sector: 'government',
        isConstruction: true,
        contactEmail: 'procurement@kura.go.ke',
        postedAt: agoDays(6),
      },
      {
        externalId: 'sample:6',
        title: 'Electrification and Solar Installation for Health Centres',
        description:
          'Supply and installation of electrical wiring and solar power systems for 5 rural health centres in the Eastern Cape.',
        type: 'tender',
        category: 'Electrical',
        source: 'Sample',
        sourceUrl: 'https://www.eskom.co.za',
        organization: 'Eastern Cape Department of Health',
        country: 'South Africa',
        region: 'Eastern Cape',
        city: 'Bhisho',
        locationText: 'Eastern Cape, South Africa',
        budget: 410000,
        currency: 'USD',
        deadline: inDays(35),
        sector: 'government',
        isConstruction: true,
        contactEmail: 'tenders@echealth.gov.za',
        postedAt: agoDays(4),
      },
      {
        externalId: 'sample:7',
        title: 'Supply of Cement, Steel and Aggregates — Framework Contract',
        description:
          'Framework procurement contract for the supply and delivery of cement, reinforcement steel and aggregates for ongoing public works.',
        type: 'tender',
        category: 'Procurement/Supply',
        source: 'Sample',
        sourceUrl: 'https://www.bpp.gov.ng',
        organization: 'Federal Ministry of Works',
        country: 'Nigeria',
        region: 'FCT',
        city: 'Abuja',
        locationText: 'Abuja, Nigeria',
        budget: 760000,
        currency: 'USD',
        deadline: inDays(25),
        sector: 'government',
        isConstruction: true,
        contactEmail: 'supply@works.gov.ng',
        postedAt: agoDays(2),
      },
      {
        externalId: 'sample:8',
        title: 'Construction of 6-Classroom School Block with Sanitation',
        description:
          'Building works tender for a 6-classroom school block including masonry, roofing, electrical installation and water supply in Kumasi.',
        type: 'tender',
        category: 'Buildings/Housing',
        source: 'Sample',
        sourceUrl: 'https://www.ghanaeducation.gov.gh',
        organization: 'Ghana Education Service',
        country: 'Ghana',
        region: 'Ashanti',
        city: 'Kumasi',
        locationText: 'Kumasi, Ghana',
        budget: 290000,
        currency: 'USD',
        deadline: inDays(38),
        sector: 'government',
        isConstruction: true,
        contactEmail: 'projects@ges.gov.gh',
        postedAt: agoDays(7),
      },
      {
        externalId: 'sample:9',
        title: 'Site Engineer — Highrise Project',
        description:
          'We are hiring an experienced Site Engineer to oversee structural and concrete works on a 22-storey highrise commercial development in Lagos.',
        type: 'job',
        category: 'Engineering Job',
        source: 'Sample',
        sourceUrl: 'https://careers.julius-berger.com',
        organization: 'Julius Berger Nigeria',
        country: 'Nigeria',
        region: 'Lagos',
        city: 'Lagos',
        locationText: 'Lagos, Nigeria',
        budget: 0,
        currency: 'USD',
        deadline: inDays(20),
        sector: 'private',
        isConstruction: true,
        contactEmail: 'recruitment@julius-berger.com',
        postedAt: agoDays(1),
      },
      {
        externalId: 'sample:10',
        title: 'Quantity Surveyor — Infrastructure',
        description:
          'Seeking a Quantity Surveyor to manage BOQ preparation, cost control and procurement for major infrastructure projects across Nairobi.',
        type: 'job',
        category: 'Engineering Job',
        source: 'Sample',
        sourceUrl: 'https://careers.example-construct.co.ke',
        organization: 'East Africa Builders Ltd',
        country: 'Kenya',
        region: 'Nairobi',
        city: 'Nairobi',
        locationText: 'Nairobi, Kenya',
        budget: 0,
        currency: 'USD',
        deadline: inDays(28),
        sector: 'private',
        isConstruction: true,
        contactEmail: 'hr@eabuilders.co.ke',
        postedAt: agoDays(2),
      },
      {
        externalId: 'sample:11',
        title: 'Civil Engineer — Road Works',
        description:
          'Civil Engineer required for supervision of road construction and earthworks on a national highway upgrade project in Douala.',
        type: 'job',
        category: 'Engineering Job',
        source: 'Sample',
        sourceUrl: 'https://careers.razel-cm.com',
        organization: 'Razel Cameroun',
        country: 'Cameroon',
        region: 'Littoral',
        city: 'Douala',
        locationText: 'Douala, Cameroon',
        budget: 0,
        currency: 'USD',
        deadline: inDays(22),
        sector: 'private',
        isConstruction: true,
        contactEmail: 'jobs@razel.cm',
        postedAt: agoDays(3),
      },
      {
        externalId: 'sample:12',
        title: 'Construction Project Manager — Affordable Housing',
        description:
          'Project Manager needed to lead the delivery of a large affordable housing scheme including structural, plumbing and electrical works in Johannesburg.',
        type: 'job',
        category: 'Engineering Job',
        source: 'Sample',
        sourceUrl: 'https://careers.wbho.co.za',
        organization: 'WBHO Construction',
        country: 'South Africa',
        region: 'Gauteng',
        city: 'Johannesburg',
        locationText: 'Johannesburg, South Africa',
        budget: 0,
        currency: 'USD',
        deadline: inDays(33),
        sector: 'private',
        isConstruction: true,
        contactEmail: 'careers@wbho.co.za',
        postedAt: agoDays(5),
      },
      {
        externalId: 'sample:13',
        title: 'Construction of Earth Dam and Irrigation Infrastructure',
        description:
          'Civil works tender for an earth dam, spillway and associated irrigation drainage infrastructure to serve farming communities in Machakos.',
        type: 'tender',
        category: 'Water/Borehole',
        source: 'Sample',
        sourceUrl: 'https://www.water.go.ke',
        organization: 'National Irrigation Authority',
        country: 'Kenya',
        region: 'Machakos',
        city: 'Machakos',
        locationText: 'Machakos, Kenya',
        budget: 870000,
        currency: 'USD',
        deadline: inDays(55),
        sector: 'government',
        isConstruction: true,
        contactEmail: 'procurement@nia.go.ke',
        postedAt: agoDays(9),
      },
      {
        externalId: 'sample:14',
        title: 'Renovation and Structural Strengthening of Market Complex',
        description:
          'Tender for the renovation, structural strengthening and electrical installation upgrade of the central market complex in Onitsha.',
        type: 'tender',
        category: 'Buildings/Housing',
        source: 'Sample',
        sourceUrl: 'https://www.anambrastate.gov.ng',
        organization: 'Anambra State Ministry of Works',
        country: 'Nigeria',
        region: 'Anambra',
        city: 'Onitsha',
        locationText: 'Onitsha, Nigeria',
        budget: 520000,
        currency: 'USD',
        // Past deadline — exercises the score penalty / closed state
        deadline: agoDays(4),
        sector: 'government',
        isConstruction: true,
        contactEmail: 'works@anambrastate.gov.ng',
        postedAt: agoDays(40),
      },
      {
        externalId: 'sample:15',
        title: 'Architect — Commercial & Mixed-Use Developments',
        description:
          'Registered Architect required to lead design and supervision of commercial and mixed-use building developments across Greater Accra.',
        type: 'job',
        category: 'Engineering Job',
        source: 'Sample',
        sourceUrl: 'https://careers.example-arch.com.gh',
        organization: 'Adjaye & Partners Ghana',
        country: 'Ghana',
        region: 'Greater Accra',
        city: 'Accra',
        locationText: 'Accra, Ghana',
        budget: 0,
        currency: 'USD',
        deadline: inDays(26),
        sector: 'private',
        isConstruction: true,
        contactEmail: 'hr@adjaye-gh.com',
        postedAt: agoDays(6),
      },
    ];

    return items;
  } catch {
    return [];
  }
}

/**
 * Runs all connectors safely and returns a flattened combined array.
 */
export async function runAllConnectors(): Promise<OppInput[]> {
  const results = await Promise.all([
    worldBankConnector(),
    jsearchConnector(),
    sampleConnector(),
  ]);
  return results.flat();
}
