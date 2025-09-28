import db from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getAllCourses() {
  const publishedCourses = await db.query.courses.findMany({
    where: eq(courses.status, "published"),
  });
  return publishedCourses;
}

export type CourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
