import { relations } from "drizzle-orm/relations";
import { users, applications } from "./schema";

export const applicationsRelations = relations(applications, ({one}) => ({
	user: one(users, {
		fields: [applications.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	applications: many(applications),
}));