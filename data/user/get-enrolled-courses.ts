import db from "@/lib/db";
import { requireUser } from "./require-user";
import { and, eq } from "drizzle-orm";
import { enrollments } from "@/lib/db/schema";

export async function getEnrolledCourses() {
  const user = await requireUser();
  const enrollmentsWithCourses = await db.query.enrollments.findMany({
    where: and(
      eq(enrollments.userId, user.id),
      eq(enrollments.status, "active")
    ),
    with: {
      course: true,
    },
  });
  const enrolledCourses = enrollmentsWithCourses.map((e) => e.course);
  return enrolledCourses;
}
