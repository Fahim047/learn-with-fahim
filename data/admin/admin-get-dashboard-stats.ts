import db from "@/lib/db";
import { courses, user } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/require-admin";
import { count, eq } from "drizzle-orm";
import "server-only";

interface AdminGetDashboardStats {
  totalCourses: number;
  totalSignUps: number;
}
export async function adminGetDashboardStats(): Promise<
  AdminGetDashboardStats | undefined
> {
  await requireAdmin();
  try {
    const [totalCourses, totalSignUps] = await Promise.all([
      db
        .select({
          count: count(),
        })
        .from(courses)
        .where(eq(courses.status, "published")),

      db
        .select({
          count: count(),
        })
        .from(user),
    ]);
    return {
      totalCourses: totalCourses[0].count,
      totalSignUps: totalSignUps[0].count,
    };
  } catch (error) {
    console.log(error);
  }
}
