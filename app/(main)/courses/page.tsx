import { getAllCourses } from "@/data/public/get-all-courses";
import { tryCatch } from "@/lib/try-catch";
import { BookOpen } from "lucide-react";
import { PublicCourseCard } from "@/components/courses/public-course-card";
import { EmptyState } from "@/components/shared/empty-state";

export default async function PublicCoursesPage() {
  const { data: courses, error } = await tryCatch(getAllCourses());

  if (error) {
    return (
      <div className="mt-12">
        <EmptyState
          icon={<BookOpen className="w-8 h-8 text-red-500" />}
          title="Something went wrong"
          description="We couldn’t load the courses. Please try again later."
        />
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="mt-12">
        <EmptyState
          icon={<BookOpen className="w-8 h-8 text-muted-foreground" />}
          title="No courses available"
          description="Check back later as new courses are added frequently."
        />
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-2xl font-bold">Explore Courses</h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse through our selection of courses and start learning today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <PublicCourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            shortDescription={course.shortDescription}
            thumbnailKey={course.fileKey}
          />
        ))}
      </div>
    </div>
  );
}
