import { useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { PROJECTS, NEWS, COMPANY, type Project, type NewsItem } from "@/data/content";

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
  if (!data) return staticProjects;
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

const DEFAULT_SETTINGS: Record<string, string> = {
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
};

export function useSettings(): Record<string, string> {
  const { data } = trpc.settings.all.useQuery();
  return { ...DEFAULT_SETTINGS, ...(data ?? {}) };
}

/** Sync favicon + meta description from CMS settings */
export function useSettingsSideEffects() {
  const settings = useSettings();
  useEffect(() => {
    if (settings.faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (link) link.href = settings.faviconUrl;
    }
    if (settings.metaDescription) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", settings.metaDescription);
    }
  }, [settings.faviconUrl, settings.metaDescription]);
}
