import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { asc, desc, eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { requireAdminTrpc, isValidToken } from "./lib/adminAuth";
import { rateLimit, clientIpFromHeaders } from "./lib/rateLimit";
import { getDb } from "./queries/connection";
import {
  settings,
  projects,
  posts,
  galleryImages,
  media,
  inquiries,
  industries,
  testimonials,
  jobs,
  partners,
  offices,
  pageContent,
} from "@db/schema";
import fs from "fs";
import path from "path";
import { UPLOADS_DIR } from "./lib/adminAuth";

const adminQuery = publicQuery.use(async ({ ctx, next }) => {
  await requireAdminTrpc(ctx.req);
  return next();
});

const projectInput = z.object({
  id: z.number().optional(),
  slug: z.string().min(1).max(160),
  name: z.string().min(1).max(255),
  industry: z.string().min(1).max(100),
  industrySlug: z.string().min(1).max(100),
  location: z.string().min(1).max(160),
  year: z.string().min(1).max(40),
  size: z.string().min(1).max(160),
  scope: z.string().min(1),
  services: z.array(z.string()),
  narrative: z.array(z.string()),
  heroImage: z.string().nullable().optional(),
  cardImage: z.string().nullable().optional(),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int(),
});

const postInput = z.object({
  id: z.number().optional(),
  slug: z.string().min(1).max(180),
  title: z.string().min(1).max(300),
  category: z.string().min(1).max(80),
  excerpt: z.string().min(1),
  body: z.array(z.string()),
  coverImage: z.string().nullable().optional(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.date().nullable().optional(),
});

const inquiryInput = z.object({
  type: z.enum(["project", "subcontractor", "career", "general"]).default("project"),
  name: z.string().min(1).max(160),
  company: z.string().max(200).optional(),
  email: z.string().email().max(200),
  phone: z.string().max(60).optional(),
  projectType: z.string().max(120).optional(),
  message: z.string().min(1),
  meta: z.record(z.string(), z.string()).optional(),
});

const industryInput = z.object({
  id: z.number().optional(),
  slug: z.string().min(1).max(160),
  name: z.string().min(1).max(160),
  short: z.string().min(1).max(80),
  blurb: z.string().min(1),
  overview: z.array(z.string()),
  capabilities: z.array(z.string()),
  heroImage: z.string().nullable().optional(),
  cardImage: z.string().nullable().optional(),
  statValue: z.string().nullable().optional(),
  statLabel: z.string().nullable().optional(),
  sortOrder: z.number().int(),
  published: z.boolean(),
});

const testimonialInput = z.object({
  id: z.number().optional(),
  quote: z.string().min(1),
  name: z.string().min(1).max(160),
  role: z.string().min(1).max(200),
  project: z.string().min(1).max(200),
  sortOrder: z.number().int(),
  published: z.boolean(),
});

const jobInput = z.object({
  id: z.number().optional(),
  title: z.string().min(1).max(200),
  type: z.string().min(1).max(120),
  location: z.string().min(1).max(200),
  summary: z.string().min(1),
  sortOrder: z.number().int(),
  published: z.boolean(),
});

const partnerInput = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(200),
  logo: z.string().nullable().optional(),
  sortOrder: z.number().int(),
  published: z.boolean(),
});

const officeInput = z.object({
  id: z.number().optional(),
  slug: z.string().min(1).max(160),
  city: z.string().min(1).max(120),
  state: z.string().min(1).max(60),
  region: z.string().min(1).max(160),
  hq: z.boolean(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  serves: z.string().min(1).max(300),
  blurb: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  sortOrder: z.number().int(),
});

const reorderInput = z.object({
  items: z.array(z.object({ id: z.number(), sortOrder: z.number().int() })),
});

function serializeIndustry(row: typeof industries.$inferSelect) {
  return {
    ...row,
    overview: JSON.parse(row.overview || "[]") as string[],
    capabilities: JSON.parse(row.capabilities || "[]") as string[],
  };
}

function serializeProject(row: typeof projects.$inferSelect) {
  return {
    ...row,
    services: JSON.parse(row.services || "[]") as string[],
    narrative: JSON.parse(row.narrative || "[]") as string[],
  };
}

function serializePost(row: typeof posts.$inferSelect) {
  return { ...row, body: JSON.parse(row.body || "[]") as string[] };
}

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  admin: createRouter({
    check: publicQuery.query(async ({ ctx }) => {
      const cookie = ctx.req.headers.get("cookie") ?? "";
      const match = cookie.match(/(?:^|;\s*)mdb_admin=([^;]+)/);
      return { authed: await isValidToken(match?.[1]) };
    }),
  }),

  settings: createRouter({
    all: publicQuery.query(async () => {
      const rows = await getDb().select().from(settings);
      return Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
    }),
    set: adminQuery
      .input(z.object({ entries: z.record(z.string(), z.string()) }))
      .mutation(async ({ input }) => {
        const db = getDb();
        for (const [key, value] of Object.entries(input.entries)) {
          await db
            .insert(settings)
            .values({ key, value })
            .onConflictDoUpdate({ target: settings.key, set: { value } });
        }
        return { ok: true };
      }),
  }),

  projects: createRouter({
    list: publicQuery.query(async () => {
      const rows = await getDb()
        .select()
        .from(projects)
        .where(eq(projects.published, true))
        .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
      return rows.map(serializeProject);
    }),
    listAll: adminQuery.query(async () => {
      const rows = await getDb()
        .select()
        .from(projects)
        .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
      return rows.map(serializeProject);
    }),
    bySlug: publicQuery.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const rows = await getDb().select().from(projects).where(eq(projects.slug, input.slug)).limit(1);
      return rows[0] ? serializeProject(rows[0]) : null;
    }),
    upsert: adminQuery.input(projectInput).mutation(async ({ input }) => {
      const { id, services, narrative, ...rest } = input;
      const values = {
        ...rest,
        heroImage: rest.heroImage ?? null,
        cardImage: rest.cardImage ?? null,
        services: JSON.stringify(services),
        narrative: JSON.stringify(narrative),
      };
      const db = getDb();
      if (id) {
        await db.update(projects).set(values).where(eq(projects.id, id));
        return { id };
      }
      const [r] = await db.insert(projects).values(values).returning({ id: projects.id });
      return { id: r.id };
    }),
    delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await getDb().delete(projects).where(eq(projects.id, input.id));
      return { ok: true };
    }),
  }),

  posts: createRouter({
    list: publicQuery.query(async () => {
      const rows = await getDb()
        .select()
        .from(posts)
        .where(eq(posts.status, "published"))
        .orderBy(desc(posts.publishedAt), desc(posts.createdAt));
      return rows.map(serializePost);
    }),
    listAll: adminQuery.query(async () => {
      const rows = await getDb().select().from(posts).orderBy(desc(posts.createdAt));
      return rows.map(serializePost);
    }),
    bySlug: publicQuery.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const rows = await getDb()
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug))
        .limit(1);
      const row = rows[0];
      if (!row || row.status !== "published") return null;
      return serializePost(row);
    }),
    upsert: adminQuery.input(postInput).mutation(async ({ input }) => {
      const { id, body, status, publishedAt, ...rest } = input;
      const db = getDb();
      const base = {
        ...rest,
        coverImage: rest.coverImage ?? null,
        body: JSON.stringify(body),
        status,
      };
      if (id) {
        // Preserve the original publish date across edits: keep an explicit
        // date if given, otherwise fall back to the stored one, and only stamp
        // "now" the first time a post goes live without any date on record.
        const [existing] = await db
          .select({ publishedAt: posts.publishedAt })
          .from(posts)
          .where(eq(posts.id, id))
          .limit(1);
        const resolvedPublishedAt =
          status === "published"
            ? publishedAt ?? existing?.publishedAt ?? new Date()
            : publishedAt ?? existing?.publishedAt ?? null;
        await db
          .update(posts)
          .set({ ...base, publishedAt: resolvedPublishedAt })
          .where(eq(posts.id, id));
        return { id };
      }
      const resolvedPublishedAt =
        status === "published" ? publishedAt ?? new Date() : publishedAt ?? null;
      const [r] = await db
        .insert(posts)
        .values({ ...base, publishedAt: resolvedPublishedAt })
        .returning({ id: posts.id });
      return { id: r.id };
    }),
    delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await getDb().delete(posts).where(eq(posts.id, input.id));
      return { ok: true };
    }),
  }),

  galleries: createRouter({
    list: publicQuery.input(z.object({ key: z.string() })).query(async ({ input }) => {
      return getDb()
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.galleryKey, input.key))
        .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));
    }),
    keys: publicQuery.query(async () => {
      const rows = await getDb().select({ key: galleryImages.galleryKey }).from(galleryImages);
      return [...new Set(rows.map((r) => r.key))];
    }),
    add: adminQuery
      .input(
        z.object({
          galleryKey: z.string().min(1).max(80),
          url: z.string().min(1),
          caption: z.string().max(300).optional(),
          sortOrder: z.number().int().default(0),
        })
      )
      .mutation(async ({ input }) => {
        const [r] = await getDb().insert(galleryImages).values(input).returning({ id: galleryImages.id });
        return { id: r.id };
      }),
    update: adminQuery
      .input(
        z.object({
          id: z.number(),
          caption: z.string().max(300).optional(),
          sortOrder: z.number().int().optional(),
          galleryKey: z.string().max(80).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...values } = input;
        await getDb().update(galleryImages).set(values).where(eq(galleryImages.id, id));
        return { ok: true };
      }),
    delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await getDb().delete(galleryImages).where(eq(galleryImages.id, input.id));
      return { ok: true };
    }),
  }),

  industries: createRouter({
    list: publicQuery.query(async () => {
      const rows = await getDb()
        .select()
        .from(industries)
        .where(eq(industries.published, true))
        .orderBy(asc(industries.sortOrder), asc(industries.id));
      return rows.map(serializeIndustry);
    }),
    listAll: adminQuery.query(async () => {
      const rows = await getDb()
        .select()
        .from(industries)
        .orderBy(asc(industries.sortOrder), asc(industries.id));
      return rows.map(serializeIndustry);
    }),
    get: publicQuery.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const rows = await getDb().select().from(industries).where(eq(industries.slug, input.slug)).limit(1);
      return rows[0] ? serializeIndustry(rows[0]) : null;
    }),
    upsert: adminQuery.input(industryInput).mutation(async ({ input }) => {
      const { id, overview, capabilities, ...rest } = input;
      const values = {
        ...rest,
        heroImage: rest.heroImage ?? null,
        cardImage: rest.cardImage ?? null,
        statValue: rest.statValue ?? null,
        statLabel: rest.statLabel ?? null,
        overview: JSON.stringify(overview),
        capabilities: JSON.stringify(capabilities),
      };
      const db = getDb();
      if (id) {
        await db.update(industries).set(values).where(eq(industries.id, id));
        return { id };
      }
      const [r] = await db.insert(industries).values(values).returning({ id: industries.id });
      return { id: r.id };
    }),
    delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await getDb().delete(industries).where(eq(industries.id, input.id));
      return { ok: true };
    }),
    reorder: adminQuery.input(reorderInput).mutation(async ({ input }) => {
      const db = getDb();
      for (const it of input.items) {
        await db.update(industries).set({ sortOrder: it.sortOrder }).where(eq(industries.id, it.id));
      }
      return { ok: true };
    }),
  }),

  testimonials: createRouter({
    list: publicQuery.query(async () => {
      return getDb()
        .select()
        .from(testimonials)
        .where(eq(testimonials.published, true))
        .orderBy(asc(testimonials.sortOrder), asc(testimonials.id));
    }),
    listAll: adminQuery.query(async () => {
      return getDb().select().from(testimonials).orderBy(asc(testimonials.sortOrder), asc(testimonials.id));
    }),
    get: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const rows = await getDb().select().from(testimonials).where(eq(testimonials.id, input.id)).limit(1);
      return rows[0] ?? null;
    }),
    upsert: adminQuery.input(testimonialInput).mutation(async ({ input }) => {
      const { id, ...values } = input;
      const db = getDb();
      if (id) {
        await db.update(testimonials).set(values).where(eq(testimonials.id, id));
        return { id };
      }
      const [r] = await db.insert(testimonials).values(values).returning({ id: testimonials.id });
      return { id: r.id };
    }),
    delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await getDb().delete(testimonials).where(eq(testimonials.id, input.id));
      return { ok: true };
    }),
    reorder: adminQuery.input(reorderInput).mutation(async ({ input }) => {
      const db = getDb();
      for (const it of input.items) {
        await db.update(testimonials).set({ sortOrder: it.sortOrder }).where(eq(testimonials.id, it.id));
      }
      return { ok: true };
    }),
  }),

  jobs: createRouter({
    list: publicQuery.query(async () => {
      return getDb()
        .select()
        .from(jobs)
        .where(eq(jobs.published, true))
        .orderBy(asc(jobs.sortOrder), asc(jobs.id));
    }),
    listAll: adminQuery.query(async () => {
      return getDb().select().from(jobs).orderBy(asc(jobs.sortOrder), asc(jobs.id));
    }),
    get: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const rows = await getDb().select().from(jobs).where(eq(jobs.id, input.id)).limit(1);
      return rows[0] ?? null;
    }),
    upsert: adminQuery.input(jobInput).mutation(async ({ input }) => {
      const { id, ...values } = input;
      const db = getDb();
      if (id) {
        await db.update(jobs).set(values).where(eq(jobs.id, id));
        return { id };
      }
      const [r] = await db.insert(jobs).values(values).returning({ id: jobs.id });
      return { id: r.id };
    }),
    delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await getDb().delete(jobs).where(eq(jobs.id, input.id));
      return { ok: true };
    }),
    reorder: adminQuery.input(reorderInput).mutation(async ({ input }) => {
      const db = getDb();
      for (const it of input.items) {
        await db.update(jobs).set({ sortOrder: it.sortOrder }).where(eq(jobs.id, it.id));
      }
      return { ok: true };
    }),
  }),

  partners: createRouter({
    list: publicQuery.query(async () => {
      return getDb()
        .select()
        .from(partners)
        .where(eq(partners.published, true))
        .orderBy(asc(partners.sortOrder), asc(partners.id));
    }),
    listAll: adminQuery.query(async () => {
      return getDb().select().from(partners).orderBy(asc(partners.sortOrder), asc(partners.id));
    }),
    get: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const rows = await getDb().select().from(partners).where(eq(partners.id, input.id)).limit(1);
      return rows[0] ?? null;
    }),
    upsert: adminQuery.input(partnerInput).mutation(async ({ input }) => {
      const { id, ...rest } = input;
      const values = { ...rest, logo: rest.logo ?? null };
      const db = getDb();
      if (id) {
        await db.update(partners).set(values).where(eq(partners.id, id));
        return { id };
      }
      const [r] = await db.insert(partners).values(values).returning({ id: partners.id });
      return { id: r.id };
    }),
    delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await getDb().delete(partners).where(eq(partners.id, input.id));
      return { ok: true };
    }),
    reorder: adminQuery.input(reorderInput).mutation(async ({ input }) => {
      const db = getDb();
      for (const it of input.items) {
        await db.update(partners).set({ sortOrder: it.sortOrder }).where(eq(partners.id, it.id));
      }
      return { ok: true };
    }),
  }),

  offices: createRouter({
    list: publicQuery.query(async () => {
      return getDb().select().from(offices).orderBy(asc(offices.sortOrder), asc(offices.id));
    }),
    listAll: adminQuery.query(async () => {
      return getDb().select().from(offices).orderBy(asc(offices.sortOrder), asc(offices.id));
    }),
    get: publicQuery.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const rows = await getDb().select().from(offices).where(eq(offices.slug, input.slug)).limit(1);
      return rows[0] ?? null;
    }),
    upsert: adminQuery.input(officeInput).mutation(async ({ input }) => {
      const { id, ...rest } = input;
      const values = {
        ...rest,
        address: rest.address ?? null,
        phone: rest.phone ?? null,
        email: rest.email ?? null,
      };
      const db = getDb();
      if (id) {
        await db.update(offices).set(values).where(eq(offices.id, id));
        return { id };
      }
      const [r] = await db.insert(offices).values(values).returning({ id: offices.id });
      return { id: r.id };
    }),
    delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await getDb().delete(offices).where(eq(offices.id, input.id));
      return { ok: true };
    }),
    reorder: adminQuery.input(reorderInput).mutation(async ({ input }) => {
      const db = getDb();
      for (const it of input.items) {
        await db.update(offices).set({ sortOrder: it.sortOrder }).where(eq(offices.id, it.id));
      }
      return { ok: true };
    }),
  }),

  pageContent: createRouter({
    getByPage: publicQuery.input(z.object({ page: z.string() })).query(async ({ input }) => {
      const rows = await getDb()
        .select()
        .from(pageContent)
        .where(eq(pageContent.page, input.page));
      return Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
    }),
    set: adminQuery
      .input(z.object({ page: z.string().min(1).max(80), key: z.string().min(1).max(160), value: z.string() }))
      .mutation(async ({ input }) => {
        await getDb()
          .insert(pageContent)
          .values({ page: input.page, key: input.key, value: input.value })
          .onConflictDoUpdate({
            target: [pageContent.page, pageContent.key],
            set: { value: input.value },
          });
        return { ok: true };
      }),
  }),

  media: createRouter({
    list: adminQuery.query(async () => {
      return getDb().select().from(media).orderBy(desc(media.createdAt));
    }),
    update: adminQuery
      .input(z.object({ id: z.number(), alt: z.string().max(300).nullable() }))
      .mutation(async ({ input }) => {
        await getDb()
          .update(media)
          .set({ alt: input.alt })
          .where(eq(media.id, input.id));
        return { ok: true };
      }),
    delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(media).where(eq(media.id, input.id)).limit(1);
      const row = rows[0];
      if (row) {
        const name = path.basename(row.url.replace(/^\/api\/uploads\//, ""));
        const filePath = path.join(UPLOADS_DIR, name);
        // Only unlink files that resolve inside the uploads directory.
        if (
          row.url.startsWith("/api/uploads/") &&
          filePath.startsWith(UPLOADS_DIR + path.sep) &&
          fs.existsSync(filePath)
        ) {
          fs.unlinkSync(filePath);
        }
        await db.delete(media).where(eq(media.id, input.id));
      }
      return { ok: true };
    }),
  }),

  inquiries: createRouter({
    create: publicQuery.input(inquiryInput).mutation(async ({ input, ctx }) => {
      // Spam / abuse throttle: 5 submissions / 10 min per client IP.
      const ip = clientIpFromHeaders(ctx.req.headers);
      const limit = rateLimit(`inquiry:${ip}`, 5, 10 * 60 * 1000);
      if (!limit.ok) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many submissions. Please try again later.",
        });
      }
      const { meta, ...rest } = input;
      await getDb()
        .insert(inquiries)
        .values({ ...rest, meta: meta ? JSON.stringify(meta) : null });
      return { ok: true };
    }),
    list: adminQuery
      .input(z.object({ unreadOnly: z.boolean().default(false) }))
      .query(async ({ input }) => {
        const db = getDb();
        const rows = input.unreadOnly
          ? await db.select().from(inquiries).where(eq(inquiries.read, false)).orderBy(desc(inquiries.createdAt))
          : await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
        return rows.map((r) => ({ ...r, meta: r.meta ? JSON.parse(r.meta) : null }));
      }),
    counts: adminQuery.query(async () => {
      const db = getDb();
      const all = await db.select({ id: inquiries.id, read: inquiries.read }).from(inquiries);
      return { total: all.length, unread: all.filter((r) => !r.read).length };
    }),
    setRead: adminQuery
      .input(z.object({ id: z.number(), read: z.boolean() }))
      .mutation(async ({ input }) => {
        await getDb().update(inquiries).set({ read: input.read }).where(eq(inquiries.id, input.id));
        return { ok: true };
      }),
    delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await getDb().delete(inquiries).where(eq(inquiries.id, input.id));
      return { ok: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
