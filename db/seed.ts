/**
 * Seed the CMS with the site's launch content.
 * Run: npx tsx db/seed.ts
 * Idempotent: skips inserts when tables already have rows.
 */
import { getDb } from "../api/queries/connection";
import {
  settings,
  projects,
  posts,
  galleryImages,
  industries,
  testimonials,
  jobs,
  partners,
  offices,
  pageContent,
} from "./schema";
import {
  INDUSTRIES,
  TESTIMONIALS,
  JOBS,
  PARTNERS,
  OFFICES,
} from "@/data/content";

const db = getDb();

const SETTINGS: Record<string, string> = {
  companyName: "Mahoney Design & Build",
  tagline: "A Better Way to Build.",
  phone: "(315) 697-2829",
  fax: "(315) 697-8406",
  email: "info@mahoneydesignandbuild.com",
  address: "559 Fitch Street, Oneida, NY 13421",
  license: "",
  logoUrl: "",
  faviconUrl: "",
  heroVideoUrl: "/media/hero-construction.mp4",
  heroVideoMobileUrl: "/media/hero-construction-mobile.mp4",
  heroPosterUrl: "/media/hero-poster.jpg",
  statYears: "40",
  statProjects: "500+",
  statSqFt: "3M+",
  statRepeat: "90%",
  metaDescription:
    "Mahoney Design & Build is a design-build general contractor delivering ground-up Self Storage, Hotel, and Multifamily projects across the Northeast — 40 years, family-owned.",
  gaId: "",
  googleVerification: "",
};

const PROJECTS = [
  {
    slug: "microtel-inn-suites",
    name: "Microtel Inn & Suites",
    industry: "Hotels & Hospitality",
    industrySlug: "hotels-hospitality",
    location: "Oneida, NY",
    year: "2023",
    size: "4 stories · 83 keys",
    scope: "Ground-up select-service hotel built to Wyndham prototype standards",
    services: JSON.stringify(["Design-Build", "Prototype Compliance", "FF&E Coordination"]),
    narrative: JSON.stringify([
      "Ground-up construction of an 83-key Microtel by Wyndham on brand prototype, delivered through franchise approval, PIP review, and opening authorization without a single standards exception.",
      "Winter construction in Central New York demanded tight enclosure sequencing; the hotel opened on its contracted date.",
    ]),
    heroImage: "/media/projects/microtel-inn-suites.webp",
    cardImage: "/media/projects/microtel-inn-suites.webp",
    featured: true,
    published: true,
    sortOrder: 1,
  },
  {
    slug: "empire-state-storage",
    name: "Empire State Storage",
    industry: "Self Storage",
    industrySlug: "self-storage",
    location: "Syracuse, NY",
    year: "2025",
    size: "92,000 sq ft · 640 units",
    scope: "Ground-up, three-story climate-controlled facility with drive-up annex",
    services: JSON.stringify(["Design-Build", "Preconstruction", "Sitework", "General Contracting"]),
    narrative: JSON.stringify([
      "A three-story climate-controlled flagship with a single-story drive-up annex on a constrained infill site. MDB value-planned the structural system in preconstruction, cutting six weeks from the steel package.",
      "Delivered two months ahead of the developer's lease-up model; the facility reached 60% occupancy within its first quarter.",
    ]),
    heroImage: "/media/gallery/self-storage/climate-controlled-complete.webp",
    cardImage: "/media/gallery/self-storage/climate-controlled-complete.webp",
    featured: true,
    published: true,
    sortOrder: 2,
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
    services: JSON.stringify(["General Contracting", "Sitework", "Phased Turnover"]),
    narrative: JSON.stringify([
      "A 96-unit garden-style community in the Village of Cazenovia, phased so the first building leased while the third was still in drywall.",
      "Durable assemblies and quiet party walls were the brief; warranty callbacks in the first year were near zero.",
    ]),
    heroImage: null,
    cardImage: null,
    featured: true,
    published: true,
    sortOrder: 3,
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
    services: JSON.stringify(["Design-Build", "Volunteer Coordination", "Field Leadership"]),
    narrative: JSON.stringify([
      "In under five days, MDB planned, sequenced, and led the construction of a complete 3,200 sq ft custom home for ABC's Extreme Makeover: Home Edition — coordinating more than 2,000 volunteers around the clock.",
      "It remains the purest expression of our process: plan everything, lead the field, finish on time. There was no second option.",
    ]),
    heroImage: "/media/gallery/extreme-makeover/extreme-makeover-crowd.webp",
    cardImage: "/media/gallery/extreme-makeover/extreme-makeover-move-that-bus.webp",
    featured: true,
    published: true,
    sortOrder: 4,
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
    services: JSON.stringify(["General Contracting", "Sitework", "Design-Build"]),
    narrative: JSON.stringify([
      "A seven-building drive-up campus with a climate-controlled core and covered RV storage, built on a former industrial parcel requiring full environmental sitework.",
      "Phased turnover let the operator open the first three buildings while the RV canopy was still in steel.",
    ]),
    heroImage: "/media/gallery/self-storage/drive-up-units.webp",
    cardImage: "/media/gallery/self-storage/drive-up-units.webp",
    featured: false,
    published: true,
    sortOrder: 5,
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
    services: JSON.stringify(["Renovation", "Occupied Phasing", "FF&E Coordination"]),
    narrative: JSON.stringify([
      "A floor-by-floor PIP renovation of a 120-key property that never closed. MDB sequenced guest floors in eight-day cycles with negative-air containment and day-shift quiet hours.",
      "Brand inspectors signed each floor on first pass; the owner's RevPAR rose double digits post-renovation.",
    ]),
    heroImage: null,
    cardImage: null,
    featured: false,
    published: true,
    sortOrder: 6,
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
    services: JSON.stringify(["Design-Build", "Sitework", "General Contracting"]),
    narrative: JSON.stringify([
      "Sixty-four townhomes and flats arranged along a restored creek corridor, with sitework that turned a drainage constraint into the community's central amenity.",
      "Delivered on a 14-month schedule with first units leasing at month eleven.",
    ]),
    heroImage: null,
    cardImage: null,
    featured: false,
    published: true,
    sortOrder: 7,
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
    services: JSON.stringify(["Design-Build", "Custom Millwork", "High-Performance Envelope"]),
    narrative: JSON.stringify([
      "A 5,400 sq ft lakefront residence built for a client whose first MDB home we delivered in 1998. Stone, timber, and glass detailed to commercial tolerances.",
      "Third-generation client relationships are the point of our custom homes practice — this is what that looks like.",
    ]),
    heroImage: "/media/gallery/custom-homes/custom-home-estate-exterior.webp",
    cardImage: "/media/gallery/custom-homes/custom-home-estate-exterior.webp",
    featured: false,
    published: true,
    sortOrder: 8,
  },
];

const POSTS = [
  {
    slug: "groundbreaking-empire-storage-phase-2",
    title: "MDB Breaks Ground on 92,000 Sq Ft Climate-Controlled Storage Facility in Syracuse",
    category: "Project News",
    excerpt:
      "Phase two for a repeat development partner adds 640 units to the Syracuse market — steel arrives in May.",
    body: JSON.stringify([
      "Mahoney Design & Build has broken ground on a 92,000 sq ft, three-story climate-controlled self-storage facility in Syracuse, NY — the second ground-up project for the same development partner in three years.",
      "The 640-unit project includes a drive-up annex and a retail-front office package. Steel delivery is scheduled for May, with substantial completion targeted for Q1 2027.",
      "Repeat work is the metric we care about most. When a developer comes back for phase two, the first building did its job.",
    ]),
    coverImage: "/media/gallery/self-storage/climate-controlled-structure.webp",
    status: "published" as const,
    publishedAt: new Date("2026-03-04"),
  },
  {
    slug: "2026-storage-cost-outlook",
    title: "2026 Self Storage Cost Outlook: Steel, Sitework, and the Speed Premium",
    category: "Market Insight",
    excerpt:
      "Structural steel pricing has stabilized — but sitework and schedule certainty are where storage pro formas are won or lost this year.",
    body: JSON.stringify([
      "After two volatile years, structural steel pricing for low-rise storage construction has stabilized. The 2026 risk profile sits elsewhere: stormwater compliance, utility lead times, and the cost of schedule drift.",
      "Our preconstruction data across recent storage projects shows sitework now represents a larger share of total cost than the building envelope on most greenfield sites — a reversal from five years ago.",
      "For owner-operators, the implication is simple: lock scope early, buy schedule certainty in preconstruction, and treat every month of lease-up delay as a line item — because it is.",
    ]),
    coverImage: "/media/gallery/self-storage/storage-site-foundations.webp",
    status: "published" as const,
    publishedAt: new Date("2026-02-12"),
  },
  {
    slug: "mdb-40-years",
    title: "Four Decades, Family-Built: MDB Marks 40 Years in Business",
    category: "Company",
    excerpt:
      "From a two-person homebuilding shop in Oneida to a regional commercial GC — the milestones that shaped Mahoney Design & Build.",
    body: JSON.stringify([
      "Founded in 1985 in Oneida, NY, Mahoney Design & Build turns 40 this year. What began as a family homebuilding company is today a design-build general contractor delivering self storage, hospitality, and multifamily projects across the Northeast.",
      "The through-line hasn't changed: plan precisely, build carefully, answer your phone. More than 90% of our current workload comes from repeat and referral clients.",
      "We're marking the year the way we know how — with a full schedule. Several anniversary features and a project retrospective will follow through 2026.",
    ]),
    coverImage: "/media/gallery/extreme-makeover/extreme-makeover-team-huddle.webp",
    status: "published" as const,
    publishedAt: new Date("2026-01-20"),
  },
];

const GALLERIES: { key: string; images: { url: string; caption: string }[] }[] = [
  {
    key: "self-storage",
    images: [
      { url: "/media/gallery/self-storage/climate-controlled-complete.webp", caption: "Completed climate-controlled facility — glass entrance and loading court" },
      { url: "/media/gallery/self-storage/storage-campus-aerial.webp", caption: "Aerial view of a multi-building drive-up storage campus" },
      { url: "/media/gallery/self-storage/drive-up-units.webp", caption: "New drive-up buildings with unit doors and wide drive aisles" },
      { url: "/media/gallery/self-storage/climate-controlled-structure.webp", caption: "Climate-controlled building in steel and concrete structure" },
      { url: "/media/gallery/self-storage/storage-sheathing-telehandler.webp", caption: "Building wrap and sheathing phase, telehandler on site" },
      { url: "/media/gallery/self-storage/storage-building-exterior.webp", caption: "Completed storage building exterior and drive aisle" },
      { url: "/media/gallery/self-storage/storage-site-foundations.webp", caption: "Foundations and slab work on a new storage site" },
      { url: "/media/gallery/self-storage/storage-facility-aerial-front.webp", caption: "Aerial view of facility entrance and parking court" },
      { url: "/media/gallery/self-storage/concrete-pump-pour.webp", caption: "Concrete pump and mixer pouring foundations" },
    ],
  },
  {
    key: "custom-homes",
    images: [
      { url: "/media/gallery/custom-homes/custom-home-estate-exterior.webp", caption: "Custom estate home exterior" },
      { url: "/media/gallery/custom-homes/custom-home-timber-craftsman.webp", caption: "Timber-and-stone craftsman home" },
      { url: "/media/gallery/custom-homes/custom-home-modern-farmhouse.webp", caption: "Modern farmhouse custom home" },
      { url: "/media/gallery/custom-homes/custom-home-contemporary.webp", caption: "Contemporary two-story custom home" },
      { url: "/media/gallery/custom-homes/custom-home-colonial-porch.webp", caption: "Colonial home with wraparound porch" },
      { url: "/media/gallery/custom-homes/custom-home-evening-exterior.webp", caption: "Custom home exterior at dusk" },
      { url: "/media/gallery/custom-homes/custom-home-front-drive.webp", caption: "Custom home with circular drive" },
      { url: "/media/gallery/custom-homes/custom-home-contemporary-garage.webp", caption: "Contemporary home with garage court" },
      { url: "/media/gallery/custom-homes/custom-kitchen-white.webp", caption: "Custom kitchen, white cabinetry" },
      { url: "/media/gallery/custom-homes/custom-living-fireplace.webp", caption: "Living room with fireplace and built-ins" },
      { url: "/media/gallery/custom-homes/custom-great-room-trusses.webp", caption: "Great room with exposed timber trusses" },
      { url: "/media/gallery/custom-homes/custom-kitchen-island.webp", caption: "Kitchen with oversized island" },
      { url: "/media/gallery/custom-homes/custom-staircase-entry.webp", caption: "Entry staircase" },
      { url: "/media/gallery/custom-homes/custom-primary-bedroom.webp", caption: "Primary bedroom suite" },
    ],
  },
  {
    key: "extreme-makeover",
    images: [
      { url: "/media/gallery/extreme-makeover/extreme-makeover-crowd.webp", caption: "Volunteers celebrate at the Extreme Makeover build" },
      { url: "/media/gallery/extreme-makeover/extreme-makeover-move-that-bus.webp", caption: '"Move that bus!" — reveal day' },
      { url: "/media/gallery/extreme-makeover/extreme-makeover-orange-army.webp", caption: "Hundreds of volunteers on the build site" },
      { url: "/media/gallery/extreme-makeover/extreme-makeover-volunteer-crew.webp", caption: "Volunteer crew gathering on site" },
      { url: "/media/gallery/extreme-makeover/extreme-makeover-volunteers-line.webp", caption: "Volunteer teams lining up for a shift" },
      { url: "/media/gallery/extreme-makeover/extreme-makeover-team-huddle.webp", caption: "MDB leads coordinating volunteer crews" },
    ],
  },
];

/**
 * Starter page-level copy that should be editable in the admin.
 * Key scheme: rows are grouped by `page` (the route/page id) and addressed by a
 * dotted `key` (section.field). PageHero copy uses `hero.eyebrow|title|sub`.
 * The Home hero is bespoke, so it carries extra keys (title lines + CTAs).
 * Public pages read a value with usePageContent(page)(key, <static fallback>),
 * so any key left unseeded simply falls back to the hardcoded string.
 */
const PAGE_CONTENT: { page: string; key: string; value: string }[] = [
  // Home — bespoke hero (src/sections/home/Hero.tsx)
  { page: "home", key: "hero.eyebrow", value: "General Contracting · Design-Build · Since 1985" },
  { page: "home", key: "hero.title.line1", value: "A Better" },
  { page: "home", key: "hero.title.line2", value: "Way to Build." },
  {
    page: "home",
    key: "hero.sub",
    value:
      "Ground-up commercial construction for Self Storage, Hospitality, and Multifamily — delivered with the precision of a national firm and the accountability of a family business.",
  },
  { page: "home", key: "hero.ctaPrimary.label", value: "Explore Our Work" },
  { page: "home", key: "hero.ctaPrimary.to", value: "/portfolio" },
  { page: "home", key: "hero.ctaSecondary.label", value: "Start a Project" },
  { page: "home", key: "hero.ctaSecondary.to", value: "/contact" },

  // About — PageHero + "Our Story" section (src/pages/About.tsx)
  { page: "about", key: "hero.eyebrow", value: "About MDB" },
  { page: "about", key: "hero.title", value: "Four decades. Family-built." },
  {
    page: "about",
    key: "hero.sub",
    value:
      "Founded in Oneida, New York in 1985. Grown from a family homebuilder into a regional commercial general contractor — without losing what made clients call in the first place.",
  },
  { page: "about", key: "story.eyebrow", value: "Our Story" },
  { page: "about", key: "story.heading", value: "From Oneida to the Northeast — the name stayed the same." },
  {
    page: "about",
    key: "story.p1",
    value:
      "Mahoney Design & Build started in 1985 as a family homebuilding company in Central New York. The reputation was simple: precise work, honest numbers, and a phone that always got answered.",
  },
  {
    page: "about",
    key: "story.p2",
    value:
      "Clients grew, and asked us to grow with them — first into renovations and small commercial work, then into ground-up Self Storage, Hospitality, and Multifamily projects across the Northeast. Today MDB operates as a design-build general contractor with the systems of a national firm and the accountability of the family business we still are.",
  },
  {
    page: "about",
    key: "story.p3",
    value:
      "More than 90% of our work comes from repeat and referral clients. That number is the whole strategy.",
  },

  // Industries index PageHero (src/pages/Industries.tsx)
  { page: "industries", key: "hero.eyebrow", value: "Industries" },
  { page: "industries", key: "hero.title", value: "What we build." },
  {
    page: "industries",
    key: "hero.sub",
    value:
      "Ground-up commercial construction across three core markets — plus select custom homes for longstanding clients. Each one gets the same discipline: scope early, budgets locked, execution without excuses.",
  },

  // Portfolio PageHero (src/pages/Portfolio.tsx)
  { page: "portfolio", key: "hero.eyebrow", value: "Portfolio" },
  { page: "portfolio", key: "hero.title", value: "Built to last. Delivered to spec." },
  {
    page: "portfolio",
    key: "hero.sub",
    value:
      "A selection of ground-up and renovation work across Self Storage, Hospitality, Multifamily, and select custom homes.",
  },

  // Locations index PageHero (src/pages/Locations.tsx)
  { page: "locations", key: "hero.eyebrow", value: "Locations" },
  { page: "locations", key: "hero.title", value: "Three offices. One standard." },
  {
    page: "locations",
    key: "hero.sub",
    value:
      "From our Oneida, New York headquarters to offices in Chicago and Bend, Oregon, MDB delivers the same design-build discipline coast to coast.",
  },

  // Careers PageHero (src/pages/Careers.tsx)
  { page: "careers", key: "hero.eyebrow", value: "Careers" },
  { page: "careers", key: "hero.title", value: "Exceptional work. Exceptional people." },
  {
    page: "careers",
    key: "hero.sub",
    value:
      "Build ground-up commercial projects with a team that promotes from the field. Competitive pay, real ownership, and a path that actually leads somewhere.",
  },

  // News PageHero (src/pages/News.tsx)
  { page: "news", key: "hero.eyebrow", value: "News & Insights" },
  { page: "news", key: "hero.title", value: "From the field & the market." },
  {
    page: "news",
    key: "hero.sub",
    value:
      "Project milestones, market and cost intelligence, and company news from Mahoney Design & Build.",
  },

  // Contact PageHero (src/pages/Contact.tsx)
  { page: "contact", key: "hero.eyebrow", value: "Contact" },
  { page: "contact", key: "hero.title", value: "Let's build it." },
  {
    page: "contact",
    key: "hero.sub",
    value:
      "New projects, subcontractor prequalification, or bid inquiries — three clear paths, one team that answers.",
  },

  // Subcontractors PageHero (src/pages/Subcontractors.tsx)
  { page: "subcontractors", key: "hero.eyebrow", value: "Subcontractors" },
  { page: "subcontractors", key: "hero.title", value: "Build with MDB." },
  {
    page: "subcontractors",
    key: "hero.sub",
    value:
      "We keep a short list of trade partners we trust — and we trust them completely. If you run a safe operation and stand behind your work, we want to hear from you.",
  },
];

async function main() {
  console.log("Seeding settings…");
  for (const [key, value] of Object.entries(SETTINGS)) {
    await db.insert(settings).values({ key, value }).onConflictDoUpdate({ target: settings.key, set: { value } });
  }

  const existingProjects = await db.select({ id: projects.id }).from(projects).limit(1);
  if (existingProjects.length === 0) {
    console.log("Seeding projects…");
    for (const p of PROJECTS) await db.insert(projects).values(p);
  } else {
    console.log("Projects already seeded — skipping.");
  }

  const existingPosts = await db.select({ id: posts.id }).from(posts).limit(1);
  if (existingPosts.length === 0) {
    console.log("Seeding posts…");
    for (const p of POSTS) await db.insert(posts).values(p);
  } else {
    console.log("Posts already seeded — skipping.");
  }

  const existingGallery = await db.select({ id: galleryImages.id }).from(galleryImages).limit(1);
  if (existingGallery.length === 0) {
    console.log("Seeding galleries…");
    for (const g of GALLERIES) {
      let i = 0;
      for (const img of g.images) {
        await db.insert(galleryImages).values({ galleryKey: g.key, url: img.url, caption: img.caption, sortOrder: i++ });
      }
    }
  } else {
    console.log("Galleries already seeded — skipping.");
  }

  const existingIndustries = await db.select({ id: industries.id }).from(industries).limit(1);
  if (existingIndustries.length === 0) {
    console.log("Seeding industries…");
    let i = 0;
    for (const ind of INDUSTRIES) {
      await db.insert(industries).values({
        slug: ind.slug,
        name: ind.name,
        short: ind.short,
        blurb: ind.blurb,
        overview: JSON.stringify(ind.overview),
        capabilities: JSON.stringify(ind.capabilities),
        heroImage: null,
        cardImage: null,
        statValue: ind.stat.value,
        statLabel: ind.stat.label,
        sortOrder: i++,
        published: true,
      });
    }
  } else {
    console.log("Industries already seeded — skipping.");
  }

  const existingTestimonials = await db.select({ id: testimonials.id }).from(testimonials).limit(1);
  if (existingTestimonials.length === 0) {
    console.log("Seeding testimonials…");
    let i = 0;
    for (const t of TESTIMONIALS) {
      await db.insert(testimonials).values({
        quote: t.quote,
        name: t.name,
        role: t.role,
        project: t.project,
        sortOrder: i++,
        published: true,
      });
    }
  } else {
    console.log("Testimonials already seeded — skipping.");
  }

  const existingJobs = await db.select({ id: jobs.id }).from(jobs).limit(1);
  if (existingJobs.length === 0) {
    console.log("Seeding jobs…");
    let i = 0;
    for (const j of JOBS) {
      await db.insert(jobs).values({
        title: j.title,
        type: j.type,
        location: j.location,
        summary: j.summary,
        sortOrder: i++,
        published: true,
      });
    }
  } else {
    console.log("Jobs already seeded — skipping.");
  }

  const existingPartners = await db.select({ id: partners.id }).from(partners).limit(1);
  if (existingPartners.length === 0) {
    console.log("Seeding partners…");
    let i = 0;
    for (const p of PARTNERS) {
      await db.insert(partners).values({
        name: p.name,
        logo: p.logo ?? null,
        sortOrder: i++,
        published: true,
      });
    }
  } else {
    console.log("Partners already seeded — skipping.");
  }

  const existingOffices = await db.select({ id: offices.id }).from(offices).limit(1);
  if (existingOffices.length === 0) {
    console.log("Seeding offices…");
    let i = 0;
    for (const o of OFFICES) {
      await db.insert(offices).values({
        slug: o.slug,
        city: o.city,
        state: o.state,
        region: o.region,
        hq: !!o.hq,
        address: o.address ?? null,
        phone: o.phone ?? null,
        email: o.email ?? null,
        serves: o.serves,
        blurb: o.blurb,
        lat: o.lat,
        lng: o.lng,
        sortOrder: i++,
      });
    }
  } else {
    console.log("Offices already seeded — skipping.");
  }

  const existingPageContent = await db.select({ id: pageContent.id }).from(pageContent).limit(1);
  if (existingPageContent.length === 0) {
    console.log("Seeding page content…");
    for (const row of PAGE_CONTENT) {
      await db.insert(pageContent).values(row);
    }
  } else {
    console.log("Page content already seeded — skipping.");
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
