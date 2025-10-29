import {
  pgTable,
  uuid,
  timestamp,
  primaryKey,
  text,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { lessons } from "./lesson";
import { relations } from "drizzle-orm";

export const lessonCompletions = pgTable(
  "lesson_completions",
  {
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: uuid()
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    completedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.lessonId] })]
);

export const lessonCompletionsRelations = relations(
  lessonCompletions,
  ({ one }) => ({
    user: one(user, {
      fields: [lessonCompletions.userId],
      references: [user.id],
    }),
    lesson: one(lessons, {
      fields: [lessonCompletions.lessonId],
      references: [lessons.id],
    }),
  })
);
