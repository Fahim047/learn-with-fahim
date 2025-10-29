import db from "@/lib/db";
import { requireUser } from "./require-user";
import { eq } from "drizzle-orm";
import { lessons, lessonCompletions } from "@/lib/db/schema";

export async function getLesson(id: string) {
  const user = await requireUser();

  try {
    const data = await db.query.lessons.findFirst({
      where: eq(lessons.id, id),
      columns: {
        id: true,
        title: true,
        description: true,
        videoKey: true,
        thumbnailKey: true,
        order: true,
      },
      with: {
        chapter: {
          columns: { id: true },
          with: {
            course: {
              columns: {
                id: true,
                slug: true,
                title: true,
              },
            },
          },
        },
        completions: {
          where: eq(lessonCompletions.userId, user.id),
          columns: {
            lessonId: true,
          },
        },
      },
    });

    if (!data) return null;

    const completed = data.completions.length > 0;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      videoKey: data.videoKey,
      thumbnailKey: data.thumbnailKey,
      order: data.order,
      courseSlug: data.chapter.course.slug,
      completed,
    };
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return null;
  }
}
