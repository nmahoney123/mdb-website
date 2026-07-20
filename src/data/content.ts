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
    slug: "empire-state-storage",
    name: "Empire State Storage",
    industry: "Self Storage",
    industrySlug: "self-storage",
    location: "Syracuse, NY",
    year: "2025",
    size: "92,000 sq ft · 640 units",
    scope: "Ground-up, three-story climate-controlled facility with drive-up annex",
    services: ["Design-Build", "Preconstruction", "Sitework", "General Contracting"],
    narrative: [
      "A three-story climate-controlled flagship with a single-story drive-up annex on a constrained infill site. MDB value-planned the structural system in preconstruction, cutting six weeks from the steel package.",
      "Delivered two months ahead of the developer's lease-up model; the facility reached 60% occupancy within its first quarter.",
    ],
    heroShot: "Aerial drone shot of the completed three-story storage facility — red accent doors, glass-fronted office, full parking court",
    cardShot: "Street-level view of a modern climate-controlled storage facility at dusk, branded red doors and lit office",
    featured: true,
  },
  {
    slug: "microtel-inn-suites",
    name: "Microtel Inn & Suites",
    industry: "Hotels & Hospitality",
    industrySlug: "hotels-hospitality",
    location: "Oneida, NY",
    year: "2023",
    size: "4 stories · 83 keys",
    scope: "Ground-up select-service hotel built to Wyndham prototype standards",
    services: ["Design-Build", "Prototype Compliance", "FF&E Coordination"],
    narrative: [
      "Ground-up construction of an 83-key Microtel by Wyndham on brand prototype, delivered through franchise approval, PIP review, and opening authorization without a single standards exception.",
      "Winter construction in Central New York demanded tight enclosure sequencing; the hotel opened on its contracted date.",
    ],
    heroShot: "Dusk exterior of the completed Microtel — porte-cochère lit, flag signage glowing against a blue-hour sky",
    cardShot: "Hotel exterior at blue hour with illuminated Microtel signage and entry canopy",
    featured: true,
  },
  {
    slug: "green-leaf-station",
    name: "Green Leaf Station",
    industry: "Multifamily",
    industrySlug: "multifamily",
    location: "Cazenovia, NY",
    year: "2022",
    size: "3 buildings · 96 units",
    scope: "Garden-style residential community with clubhouse and amenity spaces",
    services: ["General Contracting", "Sitework", "Phased Turnover"],
    narrative: [
      "A 96-unit garden-style community in the Village of Cazenovia, phased so the first building leased while the third was still in drywall.",
      "Durable assemblies and quiet party walls were the brief; warranty callbacks in the first year were near zero.",
    ],
    heroShot: "Aerial of the Green Leaf Station community — three residential buildings around a green courtyard, mature trees preserved",
    cardShot: "Exterior of a garden-style apartment building with balconies and landscaped entry walk",
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
    heroShot: "Wide shot of the Extreme Makeover build site — framed house surrounded by hundreds of volunteers, cranes, and media tents",
    cardShot: "Volunteers raising a wall on the Extreme Makeover homesite, MDB supers in red vests directing",
    featured: true,
  },
  {
    slug: "harborview-storage",
    name: "Harborview Storage",
    industry: "Self Storage",
    industrySlug: "self-storage",
    location: "Oswego, NY",
    year: "2024",
    size: "68,000 sq ft · 510 units",
    scope: "Drive-up storage campus with climate-controlled building and RV canopy",
    services: ["General Contracting", "Sitework", "Design-Build"],
    narrative: [
      "A seven-building drive-up campus with a climate-controlled core and covered RV storage, built on a former industrial parcel requiring full environmental sitework.",
      "Phased turnover let the operator open the first three buildings while the RV canopy was still in steel.",
    ],
    heroShot: "Aerial of a lakeside storage campus — rows of drive-up buildings with the RV canopy structure in the foreground",
    cardShot: "Rows of drive-up storage buildings with fresh striping and red doors, lake in the distance",
  },
  {
    slug: "the-lander-hotel",
    name: "The Lander Hotel Renovation",
    industry: "Hotels & Hospitality",
    industrySlug: "hotels-hospitality",
    location: "Utica, NY",
    year: "2024",
    size: "6 floors · 120 keys",
    scope: "Full PIP renovation and repositioning of an occupied select-service hotel",
    services: ["Renovation", "Occupied Phasing", "FF&E Coordination"],
    narrative: [
      "A floor-by-floor PIP renovation of a 120-key property that never closed. MDB sequenced guest floors in eight-day cycles with negative-air containment and day-shift quiet hours.",
      "Brand inspectors signed each floor on first pass; the owner's RevPAR rose double digits post-renovation.",
    ],
    heroShot: "Renovated hotel lobby — new brand-standard finishes, feature lighting, front desk in stone and walnut",
    cardShot: "Hotel guestroom mid-renovation transitioning to brand-standard finishes",
  },
  {
    slug: "creekside-commons",
    name: "Creekside Commons",
    industry: "Multifamily",
    industrySlug: "multifamily",
    location: "New Hartford, NY",
    year: "2023",
    size: "2 buildings · 64 units",
    scope: "Townhome and apartment community with trail-connected site plan",
    services: ["Design-Build", "Sitework", "General Contracting"],
    narrative: [
      "Sixty-four townhomes and flats arranged along a restored creek corridor, with sitework that turned a drainage constraint into the community's central amenity.",
      "Delivered on a 14-month schedule with first units leasing at month eleven.",
    ],
    heroShot: "Townhome row along a landscaped creek walk at sunset — porches lit, completed streetscape",
    cardShot: "Row of new-construction townhomes with porches along a landscaped greenway",
  },
  {
    slug: "cazenovia-lake-house",
    name: "Cazenovia Lake House",
    industry: "Custom Homes",
    industrySlug: "custom-homes",
    location: "Cazenovia, NY",
    year: "2021",
    size: "5,400 sq ft · lakefront",
    scope: "One-of-a-kind lakefront residence for a longstanding MDB client",
    services: ["Design-Build", "Custom Millwork", "High-Performance Envelope"],
    narrative: [
      "A 5,400 sq ft lakefront residence built for a client whose first MDB home we delivered in 1998. Stone, timber, and glass detailed to commercial tolerances.",
      "Third-generation client relationships are the point of our custom homes practice — this is what that looks like.",
    ],
    heroShot: "Finished lakefront custom home at twilight — warm light through floor-to-ceiling glass, stone chimney, calm water",
    cardShot: "Exterior of a custom lakefront home in stone and timber at golden hour",
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
