import { boolean, date, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import "dotenv/config";
import { videos } from "./videos";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  createdAt: date("created_at").defaultNow(),
  updatedAt: date("updated_at").defaultNow(),
  deletedAt: date("deleted_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  userVideos: many(videos, {
    relationName: "userVideos",
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
