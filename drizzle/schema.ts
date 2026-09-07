import { pgTable, unique, uuid, text, timestamp, boolean, foreignKey, json, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const verificationTokens = pgTable("verification_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	token: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("verification_tokens_token_unique").on(table.token),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	name: text(),
	image: text(),
	emailVerified: timestamp("email_verified", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	isAdmin: boolean("is_admin").default(false).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const applications = pgTable("applications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	jobId: text("job_id").notNull(),
	jobTitle: text("job_title").notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text().notNull(),
	phone: text(),
	resumeUrl: text("resume_url").notNull(),
	workHybrid: text("work_hybrid"),
	visaSponsorship: text("visa_sponsorship"),
	privacyAcknowledged: boolean("privacy_acknowledged").default(false).notNull(),
	accuracyConfirmed: boolean("accuracy_confirmed").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	status: text().default('pending').notNull(),
	reviewNote: text("review_note"),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }),
	workLinks: json("work_links").default([]).notNull(),
	name: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "applications_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const jobs = pgTable("jobs", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	department: text().notNull(),
	location: text().notNull(),
	type: text().notNull(),
	href: text().notNull(),
	description: text(),
	responsibilities: json().default([]).notNull(),
	requirements: json().default([]).notNull(),
	bonus: json().default([]).notNull(),
	benefits: json().default([]).notNull(),
	displayOrder: integer("display_order").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});
