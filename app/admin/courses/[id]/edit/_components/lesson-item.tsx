"use client";

import { Button } from "@/components/ui/button";
import {
  GripVerticalIcon,
  PencilIcon,
  TrashIcon,
  VideoIcon,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function LessonItem({
  lesson,
  chapterId,
}: {
  lesson: { id: string; title: string };
  chapterId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: lesson.id,
      data: { type: "lesson", chapterId },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between rounded-md border p-3 bg-background"
    >
      <div className="flex items-center gap-2">
        <GripVerticalIcon className="h-4 w-4 text-muted-foreground cursor-move" />
        <VideoIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{lesson.title}</span>
      </div>
      <div className="space-x-2">
        <Button variant="outline" size="sm">
          <PencilIcon className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="sm">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
