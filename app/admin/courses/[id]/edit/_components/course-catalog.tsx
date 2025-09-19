"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import ChapterItem from "./chapter-item";

export default function CourseCatalog() {
  const [chapters, setChapters] = useState([
    {
      id: "chapter-1",
      title: "Chapter 1: Introduction",
      lessons: [
        { id: "lesson-1", title: "Lesson 1: Welcome" },
        { id: "lesson-2", title: "Lesson 2: Setup" },
      ],
    },
    {
      id: "chapter-2",
      title: "Chapter 2: Basics",
      lessons: [],
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    // Reorder chapters
    if (
      active.data.current?.type === "chapter" &&
      over.data.current?.type === "chapter"
    ) {
      if (active.id !== over.id) {
        setChapters((prev) => {
          const oldIndex = prev.findIndex((c) => c.id === active.id);
          const newIndex = prev.findIndex((c) => c.id === over.id);
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
    }

    // Reorder lessons within same chapter
    if (
      active.data.current?.type === "lesson" &&
      over.data.current?.type === "lesson"
    ) {
      const activeChapterId = active.data.current.chapterId;
      const overChapterId = over.data.current.chapterId;

      // only reorder within same chapter for now
      if (activeChapterId === overChapterId) {
        setChapters((prev) =>
          prev.map((chapter) => {
            if (chapter.id !== activeChapterId) return chapter;

            const oldIndex = chapter.lessons.findIndex(
              (l) => l.id === active.id
            );
            const newIndex = chapter.lessons.findIndex((l) => l.id === over.id);

            return {
              ...chapter,
              lessons: arrayMove(chapter.lessons, oldIndex, newIndex),
            };
          })
        );
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Course Content</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Chapter
        </Button>
      </div>

      {/* DnD Context */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={chapters.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <ChapterItem key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
