import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real, unique } from "drizzle-orm/sqlite-core";

/** Key/value site settings (logo, favicon, hero video, company info, stats, SEO) */
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value"),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
});

/** Portfolio projects */
export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  industrySlug: text("industry_slug").notNull(),
  location: text("location").notNull(),
  year: text("year").notNull(),
  size: text("size").notNull(),
  scope: text("scope").notNull(),
  services: text("services").notNull(), // JSON string[]
  narrative: text("narrative").notNull(), // JSON string[]
  heroImage: text("hero_image"),
  cardImage: text("card_image"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
});

/** News / blog posts */
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull().default("Company"),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(), // JSON string[]
  coverImage: text("cover_image"),
  status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
});

/** Gallery images (keyed by gallery, e.g. "self-storage", "custom-homes") */
export const galleryImages = sqliteTable("gallery_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  galleryKey: text("gallery_key").notNull(),
  url: text("url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Media library (uploaded files) */
export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  kind: text("kind", { enum: ["image", "video", "file"] }).notNull().default("image"),
  size: integer("size").notNull().default(0),
  alt: text("alt"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Inquiries from all site forms */
export const inquiries = sqliteTable("inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type", { enum: ["project", "subcontractor", "career", "general"] })
    .notNull()
    .default("project"),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  projectType: text("project_type"),
  message: text("message").notNull(),
  meta: text("meta"), // JSON extra fields (trade, EMR, job title…)
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** Industries / markets (Self Storage, Hotels, Multifamily, Custom Homes…) */
export const industries = sqliteTable("industries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  short: text("short").notNull(),
  blurb: text("blurb").notNull(),
  overview: text("overview").notNull(), // JSON string[]
  capabilities: text("capabilities").notNull(), // JSON string[]
  heroImage: text("hero_image"),
  cardImage: text("card_image"),
  statValue: text("stat_value"),
  statLabel: text("stat_label"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
});

/** Client testimonials */
export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  project: text("project").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
});

/** Open positions / careers */
export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  summary: text("summary").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
});

/** Partners / "Trusted by" marquee */
export const partners = sqliteTable("partners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  logo: text("logo"), // path/url, nullable — name shows as fallback
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
});

/** Office locations */
export const offices = sqliteTable("offices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  region: text("region").notNull(),
  hq: integer("hq", { mode: "boolean" }).notNull().default(false),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  serves: text("serves").notNull(),
  blurb: text("blurb").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
});

/**
 * Flexible page-level copy store. Each row is one editable string keyed by
 * (page, key) — e.g. page="home" key="hero.title". Value holds a plain string
 * or JSON, at the caller's discretion.
 */
export const pageContent = sqliteTable(
  "page_content",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    page: text("page").notNull(),
    key: text("key").notNull(),
    value: text("value"),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    pageKeyUnq: unique().on(t.page, t.key),
  })
);

/** Admin sessions */
export const adminSessions = sqliteTable("admin_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});
