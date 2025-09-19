import "server-only";
import db from "@/lib/db";

export async function adminGetCourses() {
  const courses = await db.query.courses.findMany({
    columns: {
      description: false,
    },
  });

  return courses;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
