import { boolean, date, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import "dotenv/config";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  uploaderId: varchar("uploaderId", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  createdAt: date("created_at").defaultNow(),
  updatedAt: date("updated_at").defaultNow(),
  deletedAt: date("deleted_at").defaultNow(),
});

export const videosRelations = relations(videos, ({ one }) => ({
  userVideos: one(users, {
    relationName: "userVideos",
    fields: [videos.uploaderId],
    references: [users.id],
  }),
}));

export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;
