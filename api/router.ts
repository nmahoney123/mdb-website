import { z } from "zod";
import { asc, desc, eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { requireAdminTrpc, isValidToken } from "./lib/adminAuth";
import { getDb } from "./queries/connection";
import {
  settings,
  projects,
  posts,
  galleryImages,
  media,
  inquiries,
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
      const values = {
        ...rest,
        coverImage: rest.coverImage ?? null,
        body: JSON.stringify(body),
        status,
        publishedAt:
          status === "published" ? publishedAt ?? new Date() : publishedAt ?? null,
      };
      const db = getDb();
      if (id) {
        await db.update(posts).set(values).where(eq(posts.id, id));
        return { id };
      }
      const [r] = await db.insert(posts).values(values).returning({ id: posts.id });
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

  media: createRouter({
    list: adminQuery.query(async () => {
      return getDb().select().from(media).orderBy(desc(media.createdAt));
    }),
    delete: adminQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(media).where(eq(media.id, input.id)).limit(1);
      const row = rows[0];
      if (row) {
        const name = row.url.replace(/^\/api\/uploads\//, "");
        const filePath = path.join(UPLOADS_DIR, name);
        if (row.url.startsWith("/api/uploads/") && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        await db.delete(media).where(eq(media.id, input.id));
      }
      return { ok: true };
    }),
  }),

  inquiries: createRouter({
    create: publicQuery.input(inquiryInput).mutation(async ({ input }) => {
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
