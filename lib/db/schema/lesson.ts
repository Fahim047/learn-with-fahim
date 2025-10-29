import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { chapters } from "./chapter";
import { relations } from "drizzle-orm";
import { lessonCompletions } from "./lesson-completions";

export const lessons = pgTable("lessons", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  thumbnailKey: text(),
  videoKey: text(),
  order: integer().notNull(),
  chapterId: uuid()
    .notNull()
    .references(() => chapters.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const lessonRelations = relations(lessons, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [lessons.chapterId],
    references: [chapters.id],
  }),
  completions: many(lessonCompletions),
}));
