import { deleteLesson } from "@/actions/courses";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/lib/try-catch";
import { TrashIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeleteLessonModal({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}) {
  const [isPending, startTransition] = useTransition();
  async function handleDeleteLesson() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteLesson(courseId, chapterId, lessonId)
      );
      if (error || !result.success) {
        toast.error(result?.error || "Failed to delete lesson");
        return;
      }
      toast.success(result.message || "Lesson deleted");
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <TrashIcon className="mr-1 size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            lesson and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteLesson}
            className="cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
