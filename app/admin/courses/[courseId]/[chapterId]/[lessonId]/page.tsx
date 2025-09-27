import { adminGetLesson } from "@/data/admin/admin-get-lesson";
import { tryCatch } from "@/lib/try-catch";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import LessonContentForm from "./lesson-content-form";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface AdminLessonPageProps {
  params: Promise<{ courseId: string; chapterId: string; lessonId: string }>;
}
export default async function AdminLessonPage({
  params,
}: AdminLessonPageProps) {
  const { courseId, chapterId, lessonId } = await params;
  const { data: lesson, error } = await tryCatch(adminGetLesson(lessonId));
  if (error) {
    return (
      <div>
        <p>Something went wrong</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className={buttonVariants({ variant: "outline" })}
      >
        <ArrowLeft className="size-4" />
        <span>Back to Course</span>
      </Link>
      <LessonContentForm
        data={lesson}
        courseId={courseId}
        chapterId={chapterId}
      />
    </div>
  );
}
