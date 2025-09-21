import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { courses } from "./course";
import { relations } from "drizzle-orm";
import { lessons } from "./lesson";

export const chapters = pgTable("chapters", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  order: integer().notNull(),
  courseId: uuid()
    .notNull()
    .references(() => courses.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const chapterRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));
