import {
  pgTable,
  uuid,
  timestamp,
  pgEnum,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";
import { courses } from "./course";
import { relations } from "drizzle-orm";
import { user } from "./auth";

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "pending",
  "active",
  "cancelled",
]);

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    courseId: uuid()
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    status: enrollmentStatusEnum().notNull().default("pending"),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("unique_user_course").on(table.userId, table.courseId),
  ]
);

export const enrollmentRelations = relations(enrollments, ({ one }) => ({
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  user: one(user, {
    fields: [enrollments.userId],
    references: [user.id],
  }),
}));
