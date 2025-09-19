import "server-only";
import db from "@/lib/db";
import z from "zod";

export async function adminGetCourse(id: string) {
  const isValid = z.uuid().safeParse(id);
  if (!isValid.success) {
    throw new Error("Invalid course id");
  }
  const course = await db.query.courses.findFirst({
    where: (courses, { eq }) => eq(courses.id, id),
    with: {
      chapters: {
        with: {
          lessons: true,
        },
      },
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  return course;
}

export type AdminCourseEditType = Awaited<ReturnType<typeof adminGetCourse>>;
