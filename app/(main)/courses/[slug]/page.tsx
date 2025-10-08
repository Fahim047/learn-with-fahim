import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCourseBySlug } from "@/data/public/get-course";
import { generateImageURL } from "@/utils";
import { notFound } from "next/navigation";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) {
    return notFound();
  }
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      {/* Hero / Banner */}
      <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow">
        {course.fileKey ? (
          <img
            src={generateImageURL(course.fileKey)}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-semibold">
            {course.title}
          </div>
        )}
      </div>

      {/* Course Info */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{course.title}</CardTitle>
          <CardDescription>By Fahimul Islam</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {course.description}
          </p>
          <div className="mt-6">
            <Button size="lg" className="w-full sm:w-auto">
              Enroll Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
