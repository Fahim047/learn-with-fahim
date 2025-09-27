import db from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function adminGetLesson(id: string) {
  if (!id) {
    throw new Error("Invalid lesson id");
  }
  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, id),
  });
  if (!lesson) {
    throw new Error("Lesson not found");
  }
  return lesson;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
