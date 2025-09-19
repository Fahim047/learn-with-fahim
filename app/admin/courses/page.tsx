import { AdminCourseCard } from "@/components/courses/admin-course-card";
import { buttonVariants } from "@/components/ui/button";
import { adminGetCourses } from "@/data/admin/admin-get-courses";
import { tryCatch } from "@/lib/try-catch";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const { data, error } = await tryCatch(adminGetCourses());
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>{error.message}</p>
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          <PlusIcon />
          <span>Add Course</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((course) => (
          <AdminCourseCard key={course.id} data={course} />
        ))}
      </div>
    </>
  );
}
