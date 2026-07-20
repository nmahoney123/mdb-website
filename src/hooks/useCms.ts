import { useEffect } from "react";
import { trpc } from "@/providers/trpc";
import {
  PROJECTS,
  NEWS,
  COMPANY,
  INDUSTRIES,
  TESTIMONIALS,
  JOBS,
  PARTNERS,
  OFFICES,
  type Project,
  type NewsItem,
  type Industry,
  type Job,
  type Office,
  type Partner,
} from "@/data/content";

/**
 * CMS hooks — read from the database with instant static fallback,
 * so the site renders fully even before the API responds.
 */

export type CmsProject = {
  id?: number;
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
  /** Real image URL (from CMS) or null → placeholder slot shows */
  heroImage: string | null;
  cardImage: string | null;
  /** Placeholder shot descriptions (static fallback text) */
  heroShot: string;
  cardShot: string;
  featured: boolean;
};

const staticProjects: CmsProject[] = PROJECTS.map((p: Project) => ({
  slug: p.slug,
  name: p.name,
  industry: p.industry,
  industrySlug: p.industrySlug,
  location: p.location,
  year: p.year,
  size: p.size,
  scope: p.scope,
  services: p.services,
  narrative: p.narrative,
  heroImage: null,
  cardImage: null,
  heroShot: p.heroShot,
  cardShot: p.cardShot,
  featured: !!p.featured,
}));

export function useProjects(): CmsProject[] {
  const { data } = trpc.projects.list.useQuery();
  if (!data || data.length === 0) return staticProjects;
  return data.map((p) => {
    const fallback = staticProjects.find((s) => s.slug === p.slug);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      industry: p.industry,
      industrySlug: p.industrySlug,
      location: p.location,
      year: p.year,
      size: p.size,
      scope: p.scope,
      services: p.services,
      narrative: p.narrative,
      heroImage: p.heroImage ?? null,
      cardImage: p.cardImage ?? null,
      heroShot: fallback?.heroShot ?? `${p.name} — hero photograph`,
      cardShot: fallback?.cardShot ?? `${p.name} — exterior photograph`,
      featured: p.featured,
    };
  });
}

export type CmsPost = {
  id?: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string[];
  coverImage: string | null;
  shot: string;
  date: string;
};

const staticPosts: CmsPost[] = NEWS.map((n: NewsItem) => ({
  slug: n.slug,
  title: n.title,
  category: n.category,
  excerpt: n.excerpt,
  body: n.body,
  coverImage: null,
  shot: n.shot,
  date: n.date,
}));

export function usePosts(): CmsPost[] {
  const { data } = trpc.posts.list.useQuery();
  if (!data) return staticPosts;
  return data.map((p) => {
    const fallback = staticPosts.find((s) => s.slug === p.slug);
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      category: p.category,
      excerpt: p.excerpt,
      body: p.body,
      coverImage: p.coverImage ?? null,
      shot: fallback?.shot ?? `${p.title} — article photograph`,
      date: p.publishedAt
        ? new Date(p.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : fallback?.date ?? "",
    };
  });
}

export function useGallery(key: string) {
  const { data } = trpc.galleries.list.useQuery({ key });
  return data ?? [];
}

export type CmsIndustry = {
  id?: number;
  slug: string;
  name: string;
  short: string;
  blurb: string;
  overview: string[];
  capabilities: string[];
  /** Real image URL (from CMS) or null → placeholder slot shows */
  heroImage: string | null;
  cardImage: string | null;
  /** Placeholder shot descriptions (static fallback text) */
  heroShot: string;
  cardShot: string;
  stat: { value: string; label: string };
};

const staticIndustries: CmsIndustry[] = INDUSTRIES.map((i: Industry) => ({
  slug: i.slug,
  name: i.name,
  short: i.short,
  blurb: i.blurb,
  overview: i.overview,
  capabilities: i.capabilities,
  heroImage: null,
  cardImage: null,
  heroShot: i.heroShot,
  cardShot: i.cardShot,
  stat: i.stat,
}));

export function useIndustries(): CmsIndustry[] {
  const { data } = trpc.industries.list.useQuery();
  if (!data || data.length === 0) return staticIndustries;
  return data.map((i) => {
    const fallback = staticIndustries.find((s) => s.slug === i.slug);
    return {
      id: i.id,
      slug: i.slug,
      name: i.name,
      short: i.short,
      blurb: i.blurb,
      overview: i.overview,
      capabilities: i.capabilities,
      heroImage: i.heroImage ?? null,
      cardImage: i.cardImage ?? null,
      heroShot: fallback?.heroShot ?? `${i.name} — hero photograph`,
      cardShot: fallback?.cardShot ?? `${i.name} — card photograph`,
      stat: {
        value: i.statValue ?? fallback?.stat.value ?? "",
        label: i.statLabel ?? fallback?.stat.label ?? "",
      },
    };
  });
}

export type CmsTestimonial = {
  id?: number;
  quote: string;
  name: string;
  role: string;
  project: string;
};

const staticTestimonials: CmsTestimonial[] = TESTIMONIALS.map((t) => ({
  quote: t.quote,
  name: t.name,
  role: t.role,
  project: t.project,
}));

export function useTestimonials(): CmsTestimonial[] {
  const { data } = trpc.testimonials.list.useQuery();
  if (!data) return staticTestimonials;
  return data.map((t) => ({
    id: t.id,
    quote: t.quote,
    name: t.name,
    role: t.role,
    project: t.project,
  }));
}

export type CmsJob = {
  id?: number;
  title: string;
  type: string;
  location: string;
  summary: string;
};

const staticJobs: CmsJob[] = JOBS.map((j: Job) => ({
  title: j.title,
  type: j.type,
  location: j.location,
  summary: j.summary,
}));

export function useJobs(): CmsJob[] {
  const { data } = trpc.jobs.list.useQuery();
  if (!data) return staticJobs;
  return data.map((j) => ({
    id: j.id,
    title: j.title,
    type: j.type,
    location: j.location,
    summary: j.summary,
  }));
}

export type CmsPartner = {
  id?: number;
  name: string;
  logo: string | null;
};

const staticPartners: CmsPartner[] = PARTNERS.map((p: Partner) => ({
  name: p.name,
  logo: p.logo ?? null,
}));

export function usePartners(): CmsPartner[] {
  const { data } = trpc.partners.list.useQuery();
  if (!data || data.length === 0) return staticPartners;
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    logo: p.logo ?? null,
  }));
}

export type CmsOffice = {
  id?: number;
  slug: string;
  city: string;
  state: string;
  region: string;
  hq: boolean;
  address: string | null;
  phone: string | null;
  email: string | null;
  serves: string;
  blurb: string;
  lat: number;
  lng: number;
};

const staticOffices: CmsOffice[] = OFFICES.map((o: Office) => ({
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
}));

export function useOffices(): CmsOffice[] {
  const { data } = trpc.offices.list.useQuery();
  if (!data || data.length === 0) return staticOffices;
  return data.map((o) => ({
    id: o.id,
    slug: o.slug,
    city: o.city,
    state: o.state,
    region: o.region,
    hq: o.hq,
    address: o.address ?? null,
    phone: o.phone ?? null,
    email: o.email ?? null,
    serves: o.serves,
    blurb: o.blurb,
    lat: o.lat,
    lng: o.lng,
  }));
}

/**
 * Page-level editable copy. Returns a getter `(key, fallback) => string`:
 * while the query is loading or a key is unset/empty, the caller's static
 * fallback string is returned — so public pages render fully before the API
 * responds and never show a blank string. Keys follow the seed's dotted
 * scheme, e.g. usePageContent("home")("hero.title", "A Better").
 */
export function usePageContent(page: string): (key: string, fallback: string) => string {
  const { data } = trpc.pageContent.getByPage.useQuery({ page });
  return (key: string, fallback: string) => {
    const value = data?.[key];
    return value != null && value !== "" ? value : fallback;
  };
}

export const DEFAULT_SETTINGS: Record<string, string> = {
  companyName: COMPANY.name,
  tagline: COMPANY.tagline,
  phone: COMPANY.phone,
  fax: COMPANY.fax,
  email: COMPANY.email,
  address: COMPANY.address,
  license: COMPANY.license,
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
  // Marketing: Google tag (GA4 "G-…" or Google Ads "AW-…") + Search Console verification.
  gaId: "",
  googleVerification: "",
};

export function useSettings(): Record<string, string> {
  const { data } = trpc.settings.all.useQuery();
  return { ...DEFAULT_SETTINGS, ...(data ?? {}) };
}

/**
 * Sync favicon from CMS settings.
 *
 * The meta description is intentionally NOT managed here: every public page
 * sets its own unique description via `useSeo`, and a global override would
 * clobber those per-page values. See src/lib/useSeo.ts.
 */
export function useSettingsSideEffects() {
  const settings = useSettings();
  useEffect(() => {
    if (settings.faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (link) link.href = settings.faviconUrl;
    }
  }, [settings.faviconUrl]);
}
