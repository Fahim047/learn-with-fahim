import db from "@/lib/db";
import { chapters, courses, lessons } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function getCourseBySlug(slug: string) {
  const course = await db.query.courses.findFirst({
    where: and(eq(courses.status, "published"), eq(courses.slug, slug)),
    with: {
      chapters: {
        orderBy: asc(chapters.order),
        columns: {
          id: true,
          title: true,
          order: true,
        },
        with: {
          lessons: {
            orderBy: asc(lessons.order),
            columns: {
              id: true,
              title: true,
              order: true,
            },
          },
        },
      },
    },
  });
  if (!course) {
    return notFound();
  }
  return course;
}

export type SingleCourseType = Awaited<ReturnType<typeof getCourseBySlug>>;
