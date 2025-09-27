import { deleteChapter } from "@/actions/courses";
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

export function DeleteChapterModal({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) {
  const [isPending, startTransition] = useTransition();
  async function handleDeleteChapter() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteChapter(courseId, chapterId)
      );
      if (error || !result.success) {
        toast.error(result?.error || "Failed to delete chapter");
        return;
      }
      toast.success(result.message || "Chapter deleted");
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="cursor-pointer">
          <TrashIcon className="mr-1 size-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            chapter and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteChapter}
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
