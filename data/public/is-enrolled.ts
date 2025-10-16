import db from "@/lib/db";
import { enrollments } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "@/lib/get-server-session";

export async function isEnrolled(courseId: string) {
  const session = await getServerSession();
  if (!session) return false;

  const enrollment = await db.query.enrollments.findFirst({
    where: and(
      eq(enrollments.userId, session.user.id),
      eq(enrollments.courseId, courseId)
    ),
    columns: {
      status: true,
    },
  });

  return enrollment?.status === "active";
}
