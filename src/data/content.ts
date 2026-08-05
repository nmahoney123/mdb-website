export const COMPANY = {
  name: "Mahoney Design & Build",
  short: "MDB",
  tagline: "A Better Way to Build.",
  founded: 1985,
  phone: "(315) 697-2829",
  fax: "(315) 697-8406",
  email: "info@mahoneydesignandbuild.com",
  address: "559 Fitch Street, Oneida, NY 13421",
  license: "",
};

export type Office = {
  slug: string;
  city: string;
  state: string;
  region: string;
  hq?: boolean;
  address?: string;
  phone?: string;
  email?: string;
  serves: string;
  blurb: string;
  // Approximate coordinates used to place the office on the locations map.
  lat: number;
  lng: number;
};

export const OFFICES: Office[] = [
  {
    slug: "oneida-ny",
    city: "Oneida",
    state: "NY",
    region: "Northeast — Headquarters",
    hq: true,
    address: "559 Fitch Street, Oneida, NY 13421",
    phone: "(315) 697-2829",
    email: "info@mahoneydesignandbuild.com",
    serves: "New York & the Northeast",
    blurb:
      "Our founding office and headquarters. From Oneida we've delivered ground-up storage, hospitality, and multifamily projects across New York and the Northeast since 1985.",
    lat: 43.0917,
    lng: -75.6506,
  },
  {
    slug: "chicago-il",
    city: "Chicago",
    state: "IL",
    region: "Midwest",
    address: undefined,
    phone: undefined,
    email: undefined,
    serves: "Illinois & the greater Midwest",
    blurb:
      "Our Midwest hub brings MDB's single-contract design-build delivery to storage, hospitality, and multifamily developers across the region.",
    lat: 41.8781,
    lng: -87.6298,
  },
  {
    slug: "bend-or",
    city: "Bend",
    state: "OR",
    region: "Pacific Northwest",
    address: undefined,
    phone: undefined,
    email: undefined,
    serves: "Oregon & the Pacific Northwest",
    blurb:
      "Our western office extends MDB's ground-up commercial construction and cost-certainty process to Pacific Northwest owners and operators.",
    lat: 44.0582,
    lng: -121.3153,
  },
];

export type Industry = {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  overview: string[];
  capabilities: string[];
  heroShot: string;
  cardShot: string;
  stat: { value: string; label: string };
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "multifamily",
    name: "Multifamily",
    short: "Multifamily",
    blurb:
      "Apartments, condos, and residential communities built for durability, livability, and return — from sitework to final unit.",
    overview: [
      "Multifamily owners need buildings that lease well and hold up. We deliver garden-style communities, townhome rows, and mixed residential developments where durability of assemblies and speed of unit turnover directly drive returns.",
      "Our superintendents run unit-completion matrices floor by floor, so owners see lease-ready inventory weeks before final turnover. Communities like Green Leaf Station in Cazenovia show the standard: tight envelopes, quiet party walls, common spaces that photograph and lease.",
    ],
    capabilities: [
      "Garden-style apartment communities",
      "Townhomes & condominium buildings",
      "Mixed-use residential",
      "Amenity spaces & clubhouses",
      "Sitework, parking & landscape packages",
      "Phased unit turnover & lease-up support",
    ],
    heroShot:
      "Aerial view of a garden-style apartment community — clustered residential buildings, green courtyards, completed landscaping",
    cardShot:
      "Exterior of a three-story multifamily building at completion — fiber-cement and masonry facade, balconies, entry monument sign",
    stat: { value: "800+", label: "Residential units built" },
  },
  {
    slug: "hotels-hospitality",
    name: "Hotels",
    short: "Hotels",
    blurb:
      "Flagged and boutique builds — from select-service brands like Microtel to full renovations — delivered on brand standard, on schedule.",
    overview: [
      "Hotel work lives and dies on two things: brand standards and the opening date. Miss either and the owner's pro forma suffers. We build flagged select-service properties — including Microtel by Wyndham — and boutique hospitality projects with PIP and brand review built into the schedule from day one.",
      "From franchise approval through punch list, our team manages prototype compliance, FF&E coordination, and the inspections that gate a flag's opening authorization. Renovation work is phased to keep properties in revenue wherever possible.",
    ],
    capabilities: [
      "Select-service & extended-stay flags",
      "Boutique & independent hotels",
      "PIP renovations & repositioning",
      "FF&E procurement coordination",
      "Brand-standard & prototype compliance",
      "Occupied-phased renovations",
    ],
    heroShot:
      "Dusk exterior of a newly completed select-service hotel — porte-cochère lit, flag signage glowing, guests arriving",
    cardShot:
      "Hotel guestroom corridor and lobby under final punch — warm lighting, brand-standard finishes, construction nearly complete",
    stat: { value: "20+", label: "Hotel projects completed" },
  },
  {
    slug: "custom-homes",
    name: "Residential",
    short: "Residential",
    blurb:
      "Single-family and custom residential — from luxury one-of-a-kind homes to the 3,200 sq ft house we raised in under five days for ABC's Extreme Makeover: Home Edition with 2,000+ volunteers.",
    overview: [
      "MDB began as a homebuilder in 1985, and craft at that scale is still in our DNA. On the residential side we build luxury custom homes and select single-family work for longstanding clients and referrals who want the same precision we bring to commercial construction.",
      "Our signature credential: a 3,200 sq ft custom home raised in under five days for ABC's Extreme Makeover: Home Edition, coordinating more than 2,000 volunteers. It remains the clearest demonstration of what MDB planning and field leadership can do.",
    ],
    capabilities: [
      "Luxury custom homes",
      "Single-family residential",
      "Design-build from concept to keys",
      "Historic renovation & restoration",
      "High-performance envelopes",
      "Client-direct project management",
    ],
    heroShot:
      "Finished custom lakefront home at twilight — warm interior light through large windows, natural stone and timber exterior",
    cardShot:
      "Finished custom home exterior at golden hour — stone, timber, and glass",
    stat: { value: "106 hrs", label: "Extreme Makeover build" },
  },
  {
    slug: "self-storage",
    name: "Self Storage",
    short: "Storage",
    blurb:
      "Climate-controlled and drive-up facilities engineered for fast lease-up and low operating cost — ground-up storage for owner-operators and institutional developers.",
    overview: [
      "Self storage is a speed-to-market business. Every week of schedule is a week of lost lease-up. We plan MDB storage projects around that math — sitework, structure, and climate systems sequenced so certificates of occupancy arrive early, not on time.",
      "We build single-story drive-up, multi-story climate-controlled, and conversion projects for owner-operators and institutional developers. Unit mixes, gate systems, office packages, and climate zones are coordinated in preconstruction — not value-engineered in the field.",
    ],
    capabilities: [
      "Ground-up climate-controlled facilities",
      "Single-story drive-up complexes",
      "Building conversions & adaptive reuse",
      "Sitework, stormwater & utilities",
      "Gate, security & office fit-out",
      "Multi-site program rollouts",
    ],
    heroShot:
      "Aerial drone shot of a completed multi-building self-storage facility at golden hour — rows of drive-up units with red doors, fresh asphalt striping",
    cardShot:
      "Exterior of a modern climate-controlled self-storage building — standing-seam metal facade, glass office corner, branded red unit doors",
    stat: { value: "1.2M+", label: "Storage sq ft delivered" },
  },
  {
    slug: "industrial",
    name: "Industrial",
    short: "Industrial",
    blurb:
      "Warehouses, distribution, flex, and light-manufacturing facilities — tilt-up and structural-steel builds engineered for throughput, power, and expansion.",
    overview: [
      "Industrial owners build for throughput: clear heights, dock counts, column spacing, and power that match how goods actually move. MDB plans industrial projects around those operational drivers — not a generic shell — so the building works the day it opens.",
      "We deliver tilt-up and structural-steel warehouses, distribution and fulfillment centers, flex buildings, and light-manufacturing space, coordinating heavy sitework, utilities, and phasing so operations can scale without a second mobilization.",
    ],
    capabilities: [
      "Tilt-up & structural-steel warehouses",
      "Distribution & fulfillment centers",
      "Flex & light-manufacturing space",
      "Loading docks, drive aisles & truck courts",
      "Heavy power, HVAC & process utilities",
      "Site development & stormwater",
    ],
    heroShot:
      "Aerial of a completed distribution warehouse — rows of loading docks, truck court, and a large parking field at dusk",
    cardShot:
      "Exterior of a tilt-up industrial warehouse with dock doors, truck bays, and clean sitework",
    stat: { value: "Tilt-Up", label: "& structural steel" },
  },
  {
    slug: "specialty-commercial",
    name: "Specialty Commercial",
    short: "Specialty",
    blurb:
      "Retail, office, medical, and mixed-use — ground-up and tenant fit-out delivered to brand and code with the schedule certainty a hard opening date demands.",
    overview: [
      "Specialty commercial covers the projects that don't fit a single mold — retail centers, offices, medical and dental suites, restaurants, and mixed-use developments. What they share is an exacting finish standard and an opening date that can't move.",
      "MDB delivers these ground-up and as tenant fit-outs, managing landlord coordination, permitting, brand standards, and the inspections that gate a certificate of occupancy — so tenants open on schedule and on budget.",
    ],
    capabilities: [
      "Retail & restaurant construction",
      "Office & medical / dental fit-out",
      "Mixed-use developments",
      "Tenant improvements",
      "Landlord & brand coordination",
      "Permitting & certificate-of-occupancy management",
    ],
    heroShot:
      "Completed multi-tenant retail and office building at dusk — lit storefronts, clean parking field, monument signage",
    cardShot:
      "Modern multi-tenant commercial storefront with a glass facade and brick detailing",
    stat: { value: "Fit-Out", label: "to ground-up" },
  },
];

export type Project = {
  slug: string;
  name: string;
  industry: string;
  industrySlug: string;
  location: string;
  year: string;
  size: string;
  scope: string;
  services: string[];
  narrative: string[];
  heroShot: string;
  cardShot: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "manlius-self-storage",
    name: "Manlius Self Storage",
    industry: "Self Storage",
    industrySlug: "self-storage",
    location: "Manlius, NY",
    year: "Class A",
    size: "60,000 sq ft · fully climate-controlled",
    scope: "Ground-up Class A, fully climate-controlled self-storage facility",
    services: ["Design-Build", "Preconstruction", "General Contracting"],
    narrative: [
      "A 60,000-square-foot, fully climate-controlled Class A self-storage facility built ground-up in Manlius, New York. Every unit sits inside a conditioned, secured envelope — the premium product today's operators and their customers expect.",
      "MDB delivered the building complete: structure, climate systems, security infrastructure, and a retail-ready office — engineered for durability, low operating cost, and fast lease-up.",
    ],
    heroShot: "Completed Class A climate-controlled self-storage facility exterior in Manlius, NY",
    cardShot: "Modern climate-controlled self-storage building with secured entry",
    featured: true,
  },
  {
    slug: "bannockburn-self-storage",
    name: "Bannockburn Self Storage",
    industry: "Self Storage",
    industrySlug: "self-storage",
    location: "Bannockburn, IL",
    year: "Class A · Conversion",
    size: "110,000 sq ft · fully climate-controlled",
    scope: "Adaptive-reuse conversion to a Class A, fully climate-controlled facility; operated by Store America",
    services: ["Adaptive Reuse / Conversion", "Design-Build", "General Contracting"],
    narrative: [
      "A 110,000-square-foot Class A, fully climate-controlled self-storage facility created through the adaptive-reuse conversion of an existing building — a fast, capital-efficient path to premium storage inventory in a supply-constrained market.",
      "Built for local developer Anthony Donato and operated by Store America, the project showcases MDB's conversion expertise: reworking an existing structure into a modern, climate-controlled, security-hardened facility that performs like new construction. At 110,000 square feet, it is one of the largest storage conversions in our portfolio.",
    ],
    heroShot: "Large converted Class A climate-controlled self-storage facility operated by Store America",
    cardShot: "Exterior of a 110,000 sq ft converted self-storage facility",
    featured: true,
  },
  {
    slug: "brunswick-self-storage",
    name: "Brunswick Self Storage",
    industry: "Self Storage",
    industrySlug: "self-storage",
    location: "Brunswick, ME",
    year: "Class A",
    size: "70,000 sq ft · fully climate-controlled",
    scope: "Ground-up Class A, fully climate-controlled self-storage facility",
    services: ["Design-Build", "Sitework", "General Contracting"],
    narrative: [
      "A 70,000-square-foot Class A, fully climate-controlled self-storage facility in Brunswick, Maine — MDB's design-build discipline extended into northern New England.",
      "Conditioned throughout and built to the same Class A standard as our New York storage work: a durable envelope, modern security, and an efficient unit mix engineered for year-round performance in a demanding climate.",
    ],
    heroShot: "Completed Class A climate-controlled self-storage facility in Brunswick, Maine",
    cardShot: "Climate-controlled self-storage building exterior in New England",
    featured: true,
  },
  {
    slug: "topsham-self-storage",
    name: "Topsham Self Storage",
    industry: "Self Storage",
    industrySlug: "self-storage",
    location: "Topsham, ME",
    year: "Class A",
    size: "75,000 sq ft · fully climate-controlled",
    scope: "Ground-up Class A, fully climate-controlled self-storage facility built for Extra Space Storage",
    services: ["Design-Build", "Sitework", "General Contracting"],
    narrative: [
      "A 75,000-square-foot Class A, fully climate-controlled self-storage facility in Topsham, Maine, built for Extra Space Storage — one of the largest self-storage operators in the country.",
      "MDB delivered the ground-up building to Extra Space's operating standard: a fully conditioned envelope, modern security and access systems, and an efficient unit mix engineered for durable, low-cost performance and fast lease-up.",
    ],
    heroShot: "Completed Class A climate-controlled Extra Space Storage facility in Topsham, Maine",
    cardShot: "Extra Space Storage climate-controlled facility exterior",
    featured: true,
  },
  {
    slug: "microtel-inn-suites",
    name: "Microtel Inn & Suites",
    industry: "Hotels & Hospitality",
    industrySlug: "hotels-hospitality",
    location: "Verona, NY",
    year: "2008",
    size: "3 stories · 81 keys",
    scope: "Ground-up select-service hotel at Turning Stone Resort Casino, built on Microtel by Wyndham's next-generation prototype",
    services: ["Design-Build", "Prototype Compliance", "FF&E Coordination"],
    narrative: [
      "An 81-key Microtel Inn & Suites by Wyndham built steps from the Turning Stone Resort Casino in Verona, New York — one of the first hotels in the country to open on Microtel's then-new prototype, the brand's “hotel of the future” design.",
      "MDB delivered the three-story, ground-up build to full brand standards on a high-visibility casino-corridor site, coordinating franchise approval, PIP compliance, and FF&E. The property has anchored the Turning Stone lodging market for more than 15 years.",
    ],
    heroShot: "Exterior of the Microtel Inn & Suites near Turning Stone Resort Casino in Verona, NY",
    cardShot: "Select-service hotel exterior with illuminated Microtel signage",
    featured: true,
  },
  {
    slug: "extreme-makeover-home",
    name: "Extreme Makeover Build",
    industry: "Custom Homes",
    industrySlug: "custom-homes",
    location: "Central New York",
    year: "Signature",
    size: "3,200 sq ft · <5 days",
    scope: "Full custom home for ABC's Extreme Makeover: Home Edition — 2,000+ volunteers",
    services: ["Design-Build", "Volunteer Coordination", "Field Leadership"],
    narrative: [
      "In under five days, MDB planned, sequenced, and led the construction of a complete 3,200 sq ft custom home for ABC's Extreme Makeover: Home Edition — coordinating more than 2,000 volunteers around the clock.",
      "It remains the purest expression of our process: plan everything, lead the field, finish on time. There was no second option.",
    ],
    heroShot: "Wide shot of the Extreme Makeover build site — framed house surrounded by hundreds of volunteers",
    cardShot: "Volunteers raising a wall on the Extreme Makeover homesite, MDB supers in red vests directing",
    featured: true,
  },
  {
    slug: "green-leaf-station",
    name: "Green Leaf Station",
    industry: "Custom Homes",
    industrySlug: "custom-homes",
    location: "Cazenovia, NY",
    year: "Development",
    size: "24-lot residential subdivision",
    scope: "Full residential land development and custom home construction — infrastructure, roads, utilities, and homes",
    services: ["Land Development", "Site Infrastructure", "Custom Home Construction"],
    narrative: [
      "Green Leaf Station is a 24-lot custom-home community that MDB developed and built end to end — from raw land through finished homes. We engineered and installed the full site infrastructure — roads, drainage, water, sewer, and utilities — and then designed and constructed the homes on it.",
      "Lots range from roughly 10,000 to 31,000 square feet, each home built to order for its buyer. It is the clearest expression of our range: we don't just build houses, we create the neighborhoods they sit in.",
    ],
    heroShot: "Aerial site plan of the Green Leaf Station custom-home subdivision",
    cardShot: "Custom homes along a finished residential street in the Green Leaf Station community",
    featured: false,
  },
  {
    slug: "timber-ridge",
    name: "Timber Ridge",
    industry: "Custom Homes",
    industrySlug: "custom-homes",
    location: "Manlius, NY",
    year: "Development",
    size: "20-lot residential subdivision",
    scope: "Residential subdivision development and custom home construction on wooded walkout lots",
    services: ["Land Development", "Site Infrastructure", "Custom Home Construction"],
    narrative: [
      "Timber Ridge is a wooded custom-home subdivision in the Village of Manlius, New York, developed and built by MDB. We handled the land development and infrastructure, then built custom homes across the community's roughly twenty lots — many sited as full- or side-walkout designs to work with the site's natural grade.",
      "Lots run from about 22,000 to 48,000 square feet, giving each home generous, wooded privacy. Like Green Leaf Station, Timber Ridge shows MDB delivering the whole picture — the streets, the utilities, and the homes.",
    ],
    heroShot: "Wooded custom-home subdivision with walkout lots in the Village of Manlius, NY",
    cardShot: "Custom home on a wooded walkout lot at Timber Ridge",
    featured: false,
  },
  {
    slug: "cazenovia-lake-house",
    name: "Cazenovia Lake House",
    industry: "Custom Homes",
    industrySlug: "custom-homes",
    location: "Cazenovia, NY",
    year: "Custom Home",
    size: "Lakefront custom residence",
    scope: "One-of-a-kind lakefront custom home",
    services: ["Design-Build", "Custom Millwork", "High-Performance Envelope"],
    narrative: [
      "A lakefront custom residence in Cazenovia — stone, timber, and glass detailed to commercial tolerances.",
      "Multi-generation client relationships are the point of our custom homes practice — this is what that looks like.",
    ],
    heroShot: "Finished lakefront custom home at twilight — warm light through floor-to-ceiling glass, stone chimney",
    cardShot: "Exterior of a custom lakefront home in stone and timber at golden hour",
    featured: false,
  },
];

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string[];
  shot: string;
};

export const NEWS: NewsItem[] = [
  {
    slug: "groundbreaking-empire-storage-phase-2",
    title: "MDB Breaks Ground on 92,000 Sq Ft Climate-Controlled Storage Facility in Syracuse",
    date: "March 4, 2026",
    category: "Project News",
    excerpt:
      "Phase two for a repeat development partner adds 640 units to the Syracuse market — steel arrives in May.",
    body: [
      "Mahoney Design & Build has broken ground on a 92,000 sq ft, three-story climate-controlled self-storage facility in Syracuse, NY — the second ground-up project for the same development partner in three years.",
      "The 640-unit project includes a drive-up annex and a retail-front office package. Steel delivery is scheduled for May, with substantial completion targeted for Q1 2027.",
      "Repeat work is the metric we care about most. When a developer comes back for phase two, the first building did its job.",
    ],
    shot: "Groundbreaking ceremony — shovels in fresh earth, MDB team and developer partners in branded hard hats, excavator behind",
  },
  {
    slug: "2026-storage-cost-outlook",
    title: "2026 Self Storage Cost Outlook: Steel, Sitework, and the Speed Premium",
    date: "February 12, 2026",
    category: "Market Insight",
    excerpt:
      "Structural steel pricing has stabilized — but sitework and schedule certainty are where storage pro formas are won or lost this year.",
    body: [
      "After two volatile years, structural steel pricing for low-rise storage construction has stabilized. The 2026 risk profile sits elsewhere: stormwater compliance, utility lead times, and the cost of schedule drift.",
      "Our preconstruction data across recent storage projects shows sitework now represents a larger share of total cost than the building envelope on most greenfield sites — a reversal from five years ago.",
      "For owner-operators, the implication is simple: lock scope early, buy schedule certainty in preconstruction, and treat every month of lease-up delay as a line item — because it is.",
    ],
    shot: "Editorial-style photo of structural steel being erected on a storage project — ironworkers on beams against an overcast sky",
  },
  {
    slug: "mdb-40-years",
    title: "Four Decades, Family-Built: MDB Marks 40 Years in Business",
    date: "January 20, 2026",
    category: "Company",
    excerpt:
      "From a two-person homebuilding shop in Oneida to a regional commercial GC — the milestones that shaped Mahoney Design & Build.",
    body: [
      "Founded in 1985 in Oneida, NY, Mahoney Design & Build turns 40 this year. What began as a family homebuilding company is today a design-build general contractor delivering self storage, hospitality, and multifamily projects across the Northeast.",
      "The through-line hasn't changed: plan precisely, build carefully, answer your phone. More than 90% of our current workload comes from repeat and referral clients.",
      "We're marking the year the way we know how — with a full schedule. Several anniversary features and a project retrospective will follow through 2026.",
    ],
    shot: "Archival-meets-modern photo treatment — the Mahoney family on a current jobsite, 40-year logo lockup, steel background",
  },
];

export type Job = {
  title: string;
  type: string;
  location: string;
  summary: string;
};

export const JOBS: Job[] = [
  {
    title: "Project Superintendent — Commercial",
    type: "Full-time · Field",
    location: "Central NY / Regional Travel",
    summary:
      "Lead ground-up storage, hotel, and multifamily sites. 10+ years field experience; you own the schedule, the safety culture, and the quality bar.",
  },
  {
    title: "Project Manager",
    type: "Full-time · Office/Field",
    location: "Oneida, NY",
    summary:
      "Run budgets, buyout, and owner communication from preconstruction through closeout. Design-build experience preferred.",
  },
  {
    title: "Assistant Superintendent",
    type: "Full-time · Field",
    location: "Central NY / Regional Travel",
    summary:
      "Grow into a lead super role. Daily field coordination, subcontractor management, and site documentation on commercial projects.",
  },
  {
    title: "Preconstruction Estimator",
    type: "Full-time · Office",
    location: "Oneida, NY",
    summary:
      "Quantity takeoffs, subcontractor outreach, and budget development across our three core markets. Conceptual estimating experience a plus.",
  },
  {
    title: "Construction Intern / Co-op",
    type: "Seasonal · Paid",
    location: "Oneida, NY + Field Sites",
    summary:
      "Real project exposure for construction management and engineering students — field rotation, estimating support, and a mentor who's done it for decades.",
  },
];

// Real, approved client testimonials only. Add them in admin → Testimonials
// (or here as the seed). The homepage section stays hidden while this is empty,
// so no fabricated endorsements ship. Shape: { quote, name, role, project }.
export const TESTIMONIALS: {
  quote: string;
  name: string;
  role: string;
  project: string;
}[] = [];

export const CAPABILITIES_MARQUEE = [
  "Ground-Up Construction",
  "Design-Build",
  "Tilt-Up Concrete",
  "Structural Steel",
  "Renovation & Repositioning",
  "Tenant Fit-Out",
  "Site Development",
  "Preconstruction",
];

export type Partner = {
  name: string;
  /**
   * Logo image path. Drop the file in `public/media/partners/` using the slug
   * shown, then it renders automatically in the home "Trusted by" marquee.
   * Until the file exists, the marquee shows the partner NAME as a fallback.
   * Owner note: only use logo assets you are cleared to display; the U.S. Army
   * mark and network-show branding have specific usage restrictions.
   */
  logo?: string;
};

export const PARTNERS: Partner[] = [
  { name: "Extra Space Storage", logo: "/media/partners/extra-space-storage.png" },
  { name: "Life Storage", logo: "/media/partners/life-storage.png" },
  { name: "Store America", logo: "/media/partners/store-america.png" },
  { name: "Extreme Makeover: Home Edition", logo: "/media/partners/extreme-home-makeover.png" },
  { name: "Fort Drum · U.S. Army", logo: "/media/partners/fort-drum.svg" },
  { name: "GAIL Technology", logo: "/media/partners/gale-technology.png" },
];

/**
 * Social profiles shown in the footer. Only entries with a real URL render —
 * add MDB's actual profile links here (e.g.
 * { label: "LinkedIn", href: "https://www.linkedin.com/company/..." }).
 */
export type SocialLabel = "Facebook" | "LinkedIn" | "YouTube";
export const SOCIAL_LINKS: { label: SocialLabel; href: string }[] = [
  { label: "Facebook", href: "https://www.facebook.com/MahoneyBuilding1/" },
];

export type NavItem = {
  label: string;
  to?: string;
  children?: { label: string; to: string }[];
};

// Consolidated top nav: two primary links + a "Company" group. The "Start a
// Project" button (→ /contact) serves as the Contact entry, so it's not repeated.
export const NAV_LINKS: NavItem[] = [
  { label: "Industries", to: "/industries" },
  { label: "Portfolio", to: "/portfolio" },
  {
    label: "Company",
    children: [
      { label: "About", to: "/about" },
      { label: "Locations", to: "/locations" },
      { label: "Careers", to: "/careers" },
      { label: "News", to: "/news" },
    ],
  },
];
