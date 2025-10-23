import db from "@/lib/db";
import { requireUser } from "./require-user";
import { eq } from "drizzle-orm";
import { lessons } from "@/lib/db/schema";

export async function getLesson(id: string) {
  await requireUser();
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
    });
    return data;
  } catch {
    return null;
  }
}
