"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  GripVerticalIcon,
} from "lucide-react";
import LessonItem from "./lesson-item";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ChapterItem({
  chapter,
}: {
  chapter: {
    id: string;
    title: string;
    lessons: { id: string; title: string }[];
  };
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: chapter.id,
      data: { type: "chapter" },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Collapsible defaultOpen>
      <Card ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVerticalIcon className="h-4 w-4 text-muted-foreground cursor-move" />
            <CardTitle>{chapter.title}</CardTitle>
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <PencilIcon className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              <TrashIcon className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              Toggle Lessons
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SortableContext
              items={chapter.lessons.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 mt-3">
                {chapter.lessons.length > 0 ? (
                  chapter.lessons.map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      chapterId={chapter.id}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No lessons yet.
                  </p>
                )}
                <Button className="w-full mt-2" variant="secondary">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Lesson
                </Button>
              </div>
            </SortableContext>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
}
