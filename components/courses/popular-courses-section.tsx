import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { tryCatch } from "@/lib/try-catch";
import { getAllCourses } from "@/data/public/get-all-courses";
import Image from "next/image";
import { generateImageURL } from "@/utils";

export default async function PopularCoursesSection() {
  const { data: courses, error } = await tryCatch(getAllCourses());
  if (error || courses?.length === 0) return null;
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold">Popular Courses</h2>
        <p className="mt-2 text-muted-foreground">
          Get started with our most loved courses.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {courses.slice(0, 3).map((course) => (
          <Card
            key={course.id}
            className="hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            <CardContent className="flex flex-col gap-4 flex-1">
              {/* Image */}
              <div className="relative aspect-video w-full rounded-md overflow-hidden">
                {course.fileKey ? (
                  <Image
                    src={generateImageURL(course.fileKey)}
                    alt={course.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted-foreground flex justify-center items-center text-white">
                    No Image
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg">{course.title}</h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground flex-grow line-clamp-3">
                {course.shortDescription}
              </p>

              {/* Button */}
              <Link
                href={`/courses/${course.slug}`}
                className={buttonVariants({ className: "w-full mt-auto" })}
              >
                View Course
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/courses"
          className={buttonVariants({ variant: "outline" })}
        >
          View All Courses
        </Link>
      </div>
    </section>
  );
}
