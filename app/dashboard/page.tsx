import { tryCatch } from "@/lib/try-catch";
import { GraduationCap, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { getEnrolledCourses } from "@/data/user/get-enrolled-courses";
import { PublicCourseCard } from "@/components/courses/public-course-card";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ErrorState } from "@/components/shared/error-state";

export default async function DashboardPage() {
  const { data: courses, error } = await tryCatch(getEnrolledCourses());

  if (error) {
    return (
      <div className="mt-12">
        <ErrorState message="Something went wrong" />
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="mt-20">
        <EmptyState
          icon={<GraduationCap className="w-10 h-10 text-muted-foreground" />}
          title="You’re not enrolled in any courses yet"
          description="Start your learning journey by enrolling in your first course."
          action={<Link href="/courses">Browse Courses</Link>}
        />
      </div>
    );
  }

  const totalCourses = courses.length;
  const avgProgress = 50;

  return (
    <div className="space-y-10">
      {/* Dashboard Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back 👋
            </h1>
            <p className="text-muted-foreground">
              Here’s an overview of your enrolled courses.
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">
              {totalCourses} {totalCourses === 1 ? "course" : "courses"}{" "}
              enrolled
            </span>
          </div>
        </div>

        <Separator />

        {/* Progress Summary */}
        <Card className="bg-muted/40 border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                Overall Progress
              </h3>
              <span className="text-sm font-semibold text-primary">
                {Math.round(avgProgress)}%
              </span>
            </div>
            <Progress value={avgProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Enrolled Courses</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/dashboard/courses/${course.slug}`}
              className="group"
            >
              <PublicCourseCard
                id={course.id}
                slug={course.slug}
                title={course.title}
                shortDescription={course.shortDescription}
                thumbnailKey={course.fileKey}
                className="transition-transform group-hover:scale-[1.02]"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
