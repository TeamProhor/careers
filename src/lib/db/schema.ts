import {
  boolean,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  jobId: text("job_id").notNull(),
  jobTitle: text("job_title").notNull(),
  name: text("name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull(),
  phone: text("phone"),
  resumeUrl: text("resume_url").notNull(),
  workLinks: json("work_links").$type<string[]>().default([]).notNull(),
  workHybrid: text("work_hybrid"),
  visaSponsorship: text("visa_sponsorship"),
  privacyAcknowledged: boolean("privacy_acknowledged").default(false).notNull(),
  accuracyConfirmed: boolean("accuracy_confirmed").default(false).notNull(),
  status: text("status").default("pending").notNull(),
  reviewNote: text("review_note"),
  reviewedAt: timestamp("reviewed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const jobs = pgTable("jobs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  href: text("href").notNull(),
  description: text("description"),
  responsibilities: json("responsibilities")
    .$type<string[]>()
    .default([])
    .notNull(),
  requirements: json("requirements").$type<string[]>().default([]).notNull(),
  bonus: json("bonus").$type<string[]>().default([]).notNull(),
  benefits: json("benefits").$type<string[]>().default([]).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
