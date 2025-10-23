import db from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getCourseSidebarData(slug: string) {
  const courseData = await db.query.courses.findFirst({
    where: eq(courses.slug, slug),
    columns: {
      id: true,
      title: true,
      slug: true,
    },
    with: {
      chapters: {
        columns: {
          id: true,
          title: true,
        },
        with: {
          lessons: {
            columns: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  return courseData;
}
