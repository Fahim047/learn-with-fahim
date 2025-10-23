import RichTextPreview from "@/components/rich-text-editor/tip-tap-preview";
import { getCourseBySlug } from "@/data/public/get-course";
import { tryCatch } from "@/lib/try-catch";
import { notFound } from "next/navigation";

export default async function CourseOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: course, error } = await tryCatch(getCourseBySlug(slug));

  if (error || !course) return notFound();

  return (
    <div>
      <h1>{course.title}</h1>
      <RichTextPreview doc={JSON.parse(course.description)} />
    </div>
  );
}
