import "server-only";
import db from "@/lib/db";

export async function adminGetCourses() {
  const allCourses = await db.query.courses.findMany({
    columns: {
      description: false,
    },
  });

  return allCourses;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
