import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { getLesson } from "@/data/user/get-lesson";
import { tryCatch } from "@/lib/try-catch";
import { notFound } from "next/navigation";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const { data: lessonData, error } = await tryCatch(getLesson(lessonId));
  if (error || !lessonData) return notFound();

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <PlayCircle className="h-6 w-6 text-primary" />
            {lessonData.title}
          </CardTitle>
          <CardDescription>Duration: N/A</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="aspect-video bg-black/80 rounded-lg flex items-center justify-center text-white text-lg font-medium">
            🎬 Video Player Placeholder
          </div>

          <div className="flex justify-end">
            <Button size="lg" className="w-full sm:w-auto">
              Mark as Complete
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Lesson Notes</CardTitle>
          <CardDescription>
            Keep track of key points from this lesson.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-32 rounded-md border p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Write your notes here..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
