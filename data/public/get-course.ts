import db from "@/lib/db";
import { chapters, courses } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function getCourseBySlug(slug: string) {
  const course = await db.query.courses.findFirst({
    where: and(eq(courses.status, "published"), eq(courses.slug, slug)),
    with: {
      chapters: {
        orderBy: asc(chapters.order),
        with: {
          lessons: {
            orderBy: asc(chapters.order),
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
