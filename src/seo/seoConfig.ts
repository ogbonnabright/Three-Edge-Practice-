import { INSIGHTS, PRACTICE_AREAS, REGIONAL_OFFICES, TEAM } from '../../constants';

export const SITE_URL = 'https://tep.com.ng';
export const SITE_NAME = 'Three Edge Practice';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/financial_regulatory_advisory.jpg`;
export const DEFAULT_OG_IMAGE_ALT = 'Three Edge Practice — Nigerian Law and Strategic Advisory Firm';

export interface CareerFaqItem {
  question: string;
  answer: string;
}

export const CAREER_FAQS: CareerFaqItem[] = [
  {
    question: 'How do I apply when there are no active vacancies listed?',
    answer:
      'Three Edge Practice operates an active Rolling Talent Pool. When there are no specific vacancies posted, we encourage exceptional candidates to submit a speculative curriculum vitae and writing sample through our "Submit Your CV" portal on this page or via careers@tep.com.ng. All applications are indexed by practice group and reviewed prior to our quarterly recruitment deliberations.'
  },
  {
    question: 'When does the annual Internship Programme intake take place?',
    answer:
      'Our primary Summer Internship cycle runs annually between June and September. Applications for this cycle open from December 1st through February 28th each year. In addition, we accommodate Nigerian Law School externships on a rolling basis aligned with the official Council of Legal Education academic calendar.'
  },
  {
    question: 'What are the academic qualifications for the Trainee Associate track?',
    answer:
      'Prospective Trainee Associates and NYSC legal counsel must hold a minimum of a Second Class Upper Division (2:1) at both the LL.B and Nigerian Law School (B.L.) levels. We also evaluate demonstrated analytical excellence, legal drafting proficiency, extracurricular moot court or law review leadership, and commercial acumen.'
  },
  {
    question: 'Does the firm accept physical or paper CV drop-offs at regional offices?',
    answer:
      'No. In alignment with Three Edge Practice’s environmental stewardship and paperless digital operations, all applications must be submitted digitally via our online careers portal or transmitted to careers@tep.com.ng. Physical dossiers delivered to our chambers in Lagos, Abuja, Port Harcourt, or Kano will not be processed.'
  },
  {
    question: 'What does the assessment and interview process involve?',
    answer:
      'Our recruitment process is rigorous, transparent, and meritocratic. Shortlisted applicants undergo a three-stage evaluation: (1) a preliminary analytical writing and legal drafting assessment; (2) a competency and commercial problem-solving interview with Senior Associates and Managing Counsel; and (3) a final conversational panel with members of the Firm’s Partnership Board.'
  },
  {
    question: 'Are foreign-qualified practitioners eligible for lateral hire positions?',
    answer:
      'Yes. We actively recruit dual-qualified practitioners (e.g. England & Wales, New York, Texas, or Canada) who are admitted to practice before the Nigerian Bar. Counsel with specialized experience in international arbitration, cross-border energy transactions, and multijurisdictional regulatory compliance are strongly encouraged to submit their credentials.'
  }
];

export interface RouteSeoMetadata {
  path: string;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogType: 'website' | 'article';
  ogImage: string;
  ogImageAlt: string;
  structuredData: Record<string, unknown> | null;
}

const MONTH_MAP: Record<string, string> = {
  JAN: '01',
  FEB: '02',
  MAR: '03',
  APR: '04',
  MAY: '05',
  JUN: '06',
  JUL: '07',
  AUG: '08',
  SEP: '09',
  OCT: '10',
  NOV: '11',
  DEC: '12'
};

function toIsoDate(dateLabel: string): string | undefined {
  const match = dateLabel.trim().match(/^([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{4})$/);
  if (!match) return undefined;
  const month = MONTH_MAP[match[1].toUpperCase()];
  if (!month) return undefined;
  const day = match[2].padStart(2, '0');
  const year = match[3];
  return `${year}-${month}-${day}`;
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalized = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${encodeURI(normalized)}`;
}

function isRealProfileUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed !== 'https://linkedin.com' && trimmed !== 'https://www.linkedin.com' && trimmed !== 'https://twitter.com';
}

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const abujaHq = REGIONAL_OFFICES.find((office) => office.id === 'abuja') || REGIONAL_OFFICES[0];

const BASE_ORGANIZATION_SCHEMA = {
  '@type': 'LegalService',
  '@id': ORGANIZATION_ID,
  name: 'Three Edge Practice',
  alternateName: 'TEP',
  url: SITE_URL,
  description:
    'Three Edge Practice is a modern, technology-driven Nigerian law and strategic advisory firm serving businesses, financial institutions, government institutions, and local and international organisations.',
  email: 'info@tep.com.ng',
  telephone: abujaHq.phone,
  areaServed: {
    '@type': 'Country',
    name: 'Nigeria'
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '13 Sheda Close, Area 8, Garki',
    addressLocality: 'Abuja',
    addressRegion: 'FCT',
    addressCountry: 'NG'
  },
  knowsAbout: [
    'Legal Advisory',
    'AML/CFT Compliance',
    'Financial Crime and Regulatory Compliance',
    'Financial Institutions and DNFBPs Advisory',
    'ESG Advisory',
    'Technology Law and Innovation',
    'Corporate and Commercial Law',
    'Litigation and Dispute Resolution',
    'Data Protection',
    'Tax Advisory',
    'Energy and Natural Resources',
    'Strategic Advocacy'
  ]
};

const BASE_WEBSITE_SCHEMA = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: {
    '@id': ORGANIZATION_ID
  }
};

function buildBreadcrumbs(items: Array<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`
    }))
  };
}

function buildPracticeCatalogSchema() {
  return {
    '@type': 'OfferCatalog',
    name: 'Three Edge Practice Legal and Advisory Services',
    itemListElement: PRACTICE_AREAS.map((area) => ({
      '@type': 'OfferCatalog',
      name: area.title,
      description: area.fullDescription,
      itemListElement: area.subPractices.map((sub) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: sub.title,
          description: sub.details,
          provider: {
            '@id': ORGANIZATION_ID
          },
          areaServed: {
            '@type': 'Country',
            name: 'Nigeria'
          }
        }
      }))
    }))
  };
}

function buildTeamItemListSchema() {
  return {
    '@type': 'ItemList',
    name: 'Three Edge Practice Legal Team',
    numberOfItems: TEAM.length,
    itemListElement: TEAM.map((member, index) => {
      const person: Record<string, unknown> = {
        '@type': 'Person',
        name: member.name,
        jobTitle: member.role,
        description: member.bio,
        worksFor: {
          '@id': ORGANIZATION_ID
        },
        image: toAbsoluteUrl(member.image)
      };

      if (member.email) {
        person.email = member.email;
      }
      if (member.location) {
        person.workLocation = {
          '@type': 'Place',
          name: `${member.location}, Nigeria`
        };
      }
      if (isRealProfileUrl(member.linkedin)) {
        person.sameAs = [member.linkedin];
      }
      if (member.practiceAreas && member.practiceAreas.length > 0) {
        person.knowsAbout = member.practiceAreas;
      }

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: person
      };
    })
  };
}

function buildInsightsArticlesSchema() {
  return INSIGHTS.map((insight) => {
    const isoDate = toIsoDate(insight.date);
    const article: Record<string, unknown> = {
      '@type': 'Article',
      headline: insight.title,
      description: insight.excerpt,
      articleSection: insight.category,
      image: toAbsoluteUrl(insight.image),
      publisher: {
        '@id': ORGANIZATION_ID
      },
      mainEntityOfPage: `${SITE_URL}/insights?article=${encodeURIComponent(insight.title)}`
    };
    if (isoDate) {
      article.datePublished = isoDate;
    }
    if (insight.author) {
      article.author = {
        '@type': 'Person',
        name: insight.author
      };
    }
    return article;
  });
}

function parseOpeningHours(hours: string) {
  const match = hours.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
  if (!match) return undefined;
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: match[1],
    closes: match[2]
  };
}

function buildRegionalOfficesSchema() {
  return REGIONAL_OFFICES.map((office) => {
    const openingHours = parseOpeningHours(office.hours);
    return {
      '@type': 'LegalService',
      '@id': `${SITE_URL}/contact#${office.id}`,
      name: `Three Edge Practice — ${office.city} Office`,
      description: office.tagline,
      url: `${SITE_URL}/contact`,
      parentOrganization: {
        '@id': ORGANIZATION_ID
      },
      telephone: office.phone,
      email: office.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: office.address,
        addressLocality: office.city,
        addressRegion: office.state,
        addressCountry: 'NG'
      },
      areaServed: {
        '@type': 'Country',
        name: 'Nigeria'
      },
      ...(openingHours ? { openingHoursSpecification: openingHours } : {})
    };
  });
}

export const PUBLIC_ROUTE_SEO: Record<string, RouteSeoMetadata> = {
  '/': {
    path: '/',
    title: 'Three Edge Practice | Legal, Regulatory & Strategic Advisory in Nigeria',
    description:
      'Three Edge Practice is a technology-driven Nigerian law firm delivering legal advisory, AML/CFT compliance, regulatory defense, ESG, and strategic advocacy.',
    canonical: `${SITE_URL}/`,
    robots: 'index, follow',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: DEFAULT_OG_IMAGE_ALT,
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_WEBSITE_SCHEMA,
        BASE_ORGANIZATION_SCHEMA,
        {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/#webpage`,
          url: `${SITE_URL}/`,
          name: 'Three Edge Practice | Legal, Regulatory & Strategic Advisory in Nigeria',
          description:
            'Three Edge Practice helps businesses, financial institutions, government institutions, and international organisations navigate legal complexity, regulatory risk, technology governance, and ESG.',
          isPartOf: { '@id': WEBSITE_ID },
          about: { '@id': ORGANIZATION_ID }
        }
      ]
    }
  },
  '/firm': {
    path: '/firm',
    title: 'About Three Edge Practice | Nigerian Law & Advisory Firm',
    description:
      'Learn about Three Edge Practice, a Nigerian law and strategic advisory firm serving local and international clients in Abuja, Lagos, Kano, and Port Harcourt.',
    canonical: `${SITE_URL}/firm`,
    robots: 'index, follow',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: 'Three Edge Practice — About the Nigerian Law and Strategic Advisory Firm',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_ORGANIZATION_SCHEMA,
        {
          '@type': 'AboutPage',
          '@id': `${SITE_URL}/firm#webpage`,
          url: `${SITE_URL}/firm`,
          name: 'About Three Edge Practice | Nigerian Law & Advisory Firm',
          description:
            'Institutional overview, core values, strategic focus, and regulatory vigilance of Three Edge Practice across Nigeria.',
          isPartOf: { '@id': WEBSITE_ID },
          mainEntity: { '@id': ORGANIZATION_ID }
        },
        buildBreadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'The Firm', path: '/firm' }
        ])
      ]
    }
  },
  '/practice': {
    path: '/practice',
    title: 'Legal & Regulatory Advisory Services | Three Edge Practice',
    description:
      'Explore Three Edge Practice services in AML/CFT compliance, corporate criminal defense, data protection, tax advisory, energy, technology law, and ESG advisory.',
    canonical: `${SITE_URL}/practice`,
    robots: 'index, follow',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: 'Three Edge Practice — Legal and Regulatory Advisory Services',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          ...BASE_ORGANIZATION_SCHEMA,
          hasOfferCatalog: buildPracticeCatalogSchema()
        },
        {
          '@type': 'CollectionPage',
          '@id': `${SITE_URL}/practice#webpage`,
          url: `${SITE_URL}/practice`,
          name: 'Legal & Regulatory Advisory Services | Three Edge Practice',
          description:
            'Practice areas including Compliance and Advisory, AML/CFT, Data Protection, Intellectual Property, Government Relations, ESG, Corporate Criminal Defense, Tax, Energy, and IT Law.',
          isPartOf: { '@id': WEBSITE_ID },
          about: { '@id': ORGANIZATION_ID }
        },
        buildBreadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Practice', path: '/practice' }
        ])
      ]
    }
  },
  '/team': {
    path: '/team',
    title: 'Our Lawyers and Advisory Professionals | Three Edge Practice',
    description:
      'Meet the partners, senior associates, and legal advisory professionals at Three Edge Practice across Abuja, Lagos, Kano, and Port Harcourt.',
    canonical: `${SITE_URL}/team`,
    robots: 'index, follow',
    ogType: 'website',
    ogImage: `${SITE_URL}/images/alqasim-jafar.png`,
    ogImageAlt: 'Lawyers and Advisory Professionals at Three Edge Practice',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_ORGANIZATION_SCHEMA,
        {
          '@type': 'CollectionPage',
          '@id': `${SITE_URL}/team#webpage`,
          url: `${SITE_URL}/team`,
          name: 'Our Lawyers and Advisory Professionals | Three Edge Practice',
          description:
            'Directory of partners, senior associates, and associates at Three Edge Practice in Nigeria.',
          isPartOf: { '@id': WEBSITE_ID },
          mainEntity: buildTeamItemListSchema()
        },
        buildBreadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Team', path: '/team' }
        ])
      ]
    }
  },
  '/insights': {
    path: '/insights',
    title: 'Legal and Regulatory Insights | Three Edge Practice',
    description:
      'Read legal and regulatory insights from Three Edge Practice on Nigerian tax reform, SEC and FCCPC enforcement, NDPA data privacy, AML/CFT compliance, and ESG.',
    canonical: `${SITE_URL}/insights`,
    robots: 'index, follow',
    ogType: 'website',
    ogImage: `${SITE_URL}/images/insights/regulatory_gavel_scales.jpg`,
    ogImageAlt: 'Legal and Regulatory Insights by Three Edge Practice',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_ORGANIZATION_SCHEMA,
        {
          '@type': 'Blog',
          '@id': `${SITE_URL}/insights#webpage`,
          url: `${SITE_URL}/insights`,
          name: 'Legal and Regulatory Insights | Three Edge Practice',
          description:
            'Thought leadership and regulatory updates on Nigerian tax, securities enforcement, data protection, AML/CFT, ESG, and AI governance.',
          publisher: { '@id': ORGANIZATION_ID },
          blogPost: buildInsightsArticlesSchema()
        },
        buildBreadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' }
        ])
      ]
    }
  },
  '/careers': {
    path: '/careers',
    title: 'Careers at Three Edge Practice | Join Our Team',
    description:
      'Explore legal careers, internships, trainee associate programmes, and lateral opportunities at Three Edge Practice across Abuja, Lagos, Port Harcourt, and Kano.',
    canonical: `${SITE_URL}/careers`,
    robots: 'index, follow',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: 'Careers at Three Edge Practice Chambers',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_ORGANIZATION_SCHEMA,
        {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/careers#webpage`,
          url: `${SITE_URL}/careers`,
          name: 'Careers at Three Edge Practice | Join Our Team',
          description:
            'Career pathways, internship programmes, trainee associate tracks, selection criteria, and recruitment FAQs at Three Edge Practice.',
          isPartOf: { '@id': WEBSITE_ID },
          about: { '@id': ORGANIZATION_ID }
        },
        {
          '@type': 'FAQPage',
          mainEntity: CAREER_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        },
        buildBreadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Careers', path: '/careers' }
        ])
      ]
    }
  },
  '/careers/open-positions': {
    path: '/careers/open-positions',
    title: 'Current Opportunities | Three Edge Practice',
    description:
      'View current career opportunities at Three Edge Practice and submit your CV to our talent repository for Abuja, Lagos, Port Harcourt, and Kano chambers.',
    canonical: `${SITE_URL}/careers/open-positions`,
    robots: 'index, follow',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: 'Current Opportunities at Three Edge Practice',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_ORGANIZATION_SCHEMA,
        {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/careers/open-positions#webpage`,
          url: `${SITE_URL}/careers/open-positions`,
          name: 'Current Opportunities | Three Edge Practice',
          description:
            'Current recruitment status and talent pool application portal at Three Edge Practice.',
          isPartOf: { '@id': WEBSITE_ID },
          about: { '@id': ORGANIZATION_ID }
        },
        buildBreadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Careers', path: '/careers' },
          { name: 'Open Positions', path: '/careers/open-positions' }
        ])
      ]
    }
  },
  '/contact': {
    path: '/contact',
    title: 'Contact Three Edge Practice | Legal and Advisory Enquiries',
    description:
      'Contact Three Edge Practice offices in Abuja, Lagos, Kano, and Port Harcourt for legal representation, regulatory compliance, and strategic advisory enquiries.',
    canonical: `${SITE_URL}/contact`,
    robots: 'index, follow',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: 'Contact Three Edge Practice Regional Offices in Nigeria',
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        BASE_ORGANIZATION_SCHEMA,
        {
          '@type': 'ContactPage',
          '@id': `${SITE_URL}/contact#webpage`,
          url: `${SITE_URL}/contact`,
          name: 'Contact Three Edge Practice | Legal and Advisory Enquiries',
          description:
            'Regional office addresses, direct telephone lines, office emails, operating hours, and confidential consultation request form.',
          isPartOf: { '@id': WEBSITE_ID },
          mainEntity: { '@id': ORGANIZATION_ID }
        },
        ...buildRegionalOfficesSchema(),
        buildBreadcrumbs([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' }
        ])
      ]
    }
  }
};

export const PRIVATE_PORTAL_SEO: RouteSeoMetadata = {
  path: '/portal',
  title: 'Client & Registry Portal | Three Edge Practice',
  description: 'Authenticated client legal case portal and firm management workspace for Three Edge Practice.',
  canonical: `${SITE_URL}/portal`,
  robots: 'noindex, nofollow',
  ogType: 'website',
  ogImage: DEFAULT_OG_IMAGE,
  ogImageAlt: DEFAULT_OG_IMAGE_ALT,
  structuredData: null
};

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function getSeoForLocation(pathname: string, search = ''): RouteSeoMetadata {
  const normalized = normalizePathname(pathname);

  if (normalized === '/portal' || normalized.startsWith('/portal/')) {
    return PRIVATE_PORTAL_SEO;
  }

  if (normalized === '/insights' && search) {
    const params = new URLSearchParams(search);
    const articleParam = params.get('article');
    if (articleParam) {
      const matched = INSIGHTS.find((item) => item.title.toLowerCase() === articleParam.toLowerCase());
      if (matched) {
        const isoDate = toIsoDate(matched.date);
        return {
          ...PUBLIC_ROUTE_SEO['/insights'],
          title: `${matched.title} | Three Edge Practice`,
          description: matched.excerpt,
          ogType: 'article',
          ogImage: toAbsoluteUrl(matched.image),
          ogImageAlt: `${matched.title} — Three Edge Practice`,
          structuredData: {
            '@context': 'https://schema.org',
            '@graph': [
              BASE_ORGANIZATION_SCHEMA,
              {
                '@type': 'Article',
                headline: matched.title,
                description: matched.excerpt,
                articleSection: matched.category,
                image: toAbsoluteUrl(matched.image),
                publisher: { '@id': ORGANIZATION_ID },
                mainEntityOfPage: `${SITE_URL}/insights?article=${encodeURIComponent(matched.title)}`,
                ...(isoDate ? { datePublished: isoDate } : {}),
                ...(matched.author ? { author: { '@type': 'Person', name: matched.author } } : {})
              },
              buildBreadcrumbs([
                { name: 'Home', path: '/' },
                { name: 'Insights', path: '/insights' }
              ])
            ]
          }
        };
      }
    }
  }

  if (normalized === '/team' && search) {
    const params = new URLSearchParams(search);
    const memberParam = params.get('member');
    if (memberParam) {
      const matched = TEAM.find((m) => m.name.toLowerCase() === memberParam.toLowerCase());
      if (matched) {
        return {
          ...PUBLIC_ROUTE_SEO['/team'],
          title: `${matched.name} — ${matched.role} | Three Edge Practice`,
          description: matched.bio,
          ogImage: toAbsoluteUrl(matched.image),
          ogImageAlt: `${matched.name}, ${matched.role} at Three Edge Practice`
        };
      }
    }
  }

  return PUBLIC_ROUTE_SEO[normalized] || PUBLIC_ROUTE_SEO['/'];
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function buildSeoHeadTags(seo: RouteSeoMetadata): string {
  const jsonLdBlock = seo.structuredData
    ? `\n    <script id="tep-structured-data" type="application/ld+json">${JSON.stringify(seo.structuredData).replace(/</g, '\\u003c')}</script>`
    : '';

  return [
    `<title>${escapeHtmlText(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtmlAttr(seo.description)}" />`,
    `<meta name="robots" content="${escapeHtmlAttr(seo.robots)}" />`,
    `<link rel="canonical" href="${escapeHtmlAttr(seo.canonical)}" />`,
    `<meta property="og:type" content="${escapeHtmlAttr(seo.ogType)}" />`,
    `<meta property="og:site_name" content="${escapeHtmlAttr(SITE_NAME)}" />`,
    `<meta property="og:locale" content="en_NG" />`,
    `<meta property="og:title" content="${escapeHtmlAttr(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtmlAttr(seo.description)}" />`,
    `<meta property="og:url" content="${escapeHtmlAttr(seo.canonical)}" />`,
    `<meta property="og:image" content="${escapeHtmlAttr(seo.ogImage)}" />`,
    `<meta property="og:image:alt" content="${escapeHtmlAttr(seo.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtmlAttr(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtmlAttr(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtmlAttr(seo.ogImage)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtmlAttr(seo.ogImageAlt)}" />${jsonLdBlock}`
  ].join('\n    ');
}

export function injectSeoIntoHtml(html: string, seo: RouteSeoMetadata): string {
  const seoBlock = buildSeoHeadTags(seo);
  return html.replace(
    /<!-- SEO_META_START -->[\s\S]*?<!-- SEO_META_END -->/,
    `<!-- SEO_META_START -->\n    ${seoBlock}\n    <!-- SEO_META_END -->`
  );
}
