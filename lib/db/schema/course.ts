import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { chapters } from "./chapter";

export const courses = pgTable("courses", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  fileKey: text().notNull(),
  description: text().notNull(),
  shortDescription: text().notNull(),
  level: text().notNull().default("beginner"),
  category: text().notNull(),
  status: text().notNull().default("draft"),
  regularPrice: numeric().notNull(),
  sellingPrice: numeric().notNull(),
  slug: text().notNull().unique(),
  duration: integer().notNull().default(0),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const courseRelations = relations(courses, ({ many }) => ({
  chapters: many(chapters),
}));
