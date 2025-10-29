import db from "@/lib/db";
import { courses, lessonCompletions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "./require-user";

export async function getCourseSidebarData(slug: string) {
  const user = await requireUser();
  const userId = user.id;

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
            with: {
              completions: {
                where: eq(lessonCompletions.userId, userId),
                columns: { lessonId: true },
              },
            },
          },
        },
      },
    },
  });

  if (!courseData) return null;

  // Compute completion info
  const normalizedChapters = courseData.chapters.map((chapter) => ({
    ...chapter,
    lessons: chapter.lessons.map((lesson) => ({
      ...lesson,
      completed: lesson.completions.length > 0,
    })),
  }));

  // Flatten all lessons
  const allLessons = normalizedChapters.flatMap((ch) => ch.lessons);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((l) => l.completed).length;

  const progress = totalLessons
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  return {
    id: courseData.id,
    slug: courseData.slug,
    title: courseData.title,
    progress,
    totalLessons,
    completedLessons,
    chapters: normalizedChapters,
  };
}
