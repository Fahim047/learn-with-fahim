import Image from "next/image";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/data/public/get-course";
import { isEnrolled } from "@/data/public/is-enrolled";
import Link from "next/link";
import EnrollNowButton from "@/components/courses/enroll-now-button";
import CurriculumAccordion from "@/components/courses/curriculum-accordion";
import { generateImageURL } from "@/utils";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return notFound();

  const enrolled = await isEnrolled(course.id);
  const imgURL = generateImageURL(course.fileKey);

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10">
      {/* Hero / Banner */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg">
        {course.fileKey ? (
          <Image
            src={imgURL}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {course.title}
          </div>
        )}
      </div>

      {/* Main content: two columns */}
      <div className="lg:grid lg:grid-cols-[2fr_1fr] gap-8">
        {/* Left column — Curriculum */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
          <CurriculumAccordion course={course} enrolled={enrolled} />
        </div>

        {/* Right column — Sidebar Card */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-2xl shadow p-6 border">
            <h1 className="text-xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-2 mb-4">
              {course.shortDescription ?? "No description available."}
            </p>

            {enrolled ? (
              <Link
                href={`/dashboard/courses/${course.slug}/overview`}
                className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Go to Course
              </Link>
            ) : (
              <EnrollNowButton courseId={course.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
