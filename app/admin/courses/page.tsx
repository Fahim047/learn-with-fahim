import { AdminCourseCard } from "@/components/courses/admin-course-card";
import { buttonVariants } from "@/components/ui/button";
import { adminGetCourses } from "@/data/admin/admin-get-courses";
import { tryCatch } from "@/lib/try-catch";
import { BookOpen, Loader2, PlusIcon } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Suspense } from "react";
import { ErrorState } from "@/components/shared/error-state";

export default async function AdminCoursesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          <PlusIcon />
          <span>Add Course</span>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 text-center space-y-4">
            <Loader2 className="animate-spin" />
          </div>
        }
      >
        <RenderCourses />
      </Suspense>
    </>
  );
}

async function RenderCourses() {
  const { data, error } = await tryCatch(adminGetCourses());

  if (error !== null) {
    return <ErrorState message="Something went wrong while loading courses." />;
  }

  const hasCourses = data && data.length > 0;

  return (
    <>
      {hasCourses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No courses found"
          description="Get started by creating your first course. It will show up here once added."
          icon={<BookOpen className="size-10 text-muted-foreground" />}
          action={
            <Link
              href="/admin/courses/create"
              className={buttonVariants({ variant: "default" })}
            >
              <PlusIcon />
              Create Course
            </Link>
          }
        />
      )}
    </>
  );
}
