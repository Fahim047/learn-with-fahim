"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import SortableItem from "./_components/sortable-item";
import { AdminCourseEditType } from "@/data/admin/admin-get-course";
import { Collapsible } from "@radix-ui/react-collapsible";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  GripVerticalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  VideoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditCourseContent({
  data,
}: {
  data: AdminCourseEditType;
}) {
  const initialItems =
    data.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      position: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        position: lesson.position,
      })),
    })) || [];
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  function handleToggle(id: string) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <Card>
        <CardHeader>
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent>
          <SortableContext strategy={verticalListSortingStrategy} items={items}>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter" }}
                className="mt-4"
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => handleToggle(item.id)}
                    >
                      <div className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <GripVerticalIcon
                            className="h-4 w-4 text-muted-foreground cursor-move"
                            {...listeners}
                          />
                          <CardTitle className="text-base">
                            {item.title}
                          </CardTitle>
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
                      </div>
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-muted rounded-md">
                          <span className="text-sm">View Lessons</span>
                          {item.isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </CollapsibleTrigger>

                      {/* Lessons list */}
                      <CollapsibleContent className="pl-6">
                        <SortableContext
                          strategy={verticalListSortingStrategy}
                          items={item.lessons}
                        >
                          {item.lessons.length > 0 ? (
                            item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between rounded-md border p-3 mt-3">
                                    <div className="flex items-center gap-2">
                                      <GripVerticalIcon
                                        className="h-4 w-4 text-muted-foreground cursor-move"
                                        {...lessonListeners}
                                      />
                                      <VideoIcon className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm font-medium">
                                        {lesson.title}
                                      </span>
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
                                )}
                              </SortableItem>
                            ))
                          ) : (
                            <div className="flex items-center justify-between rounded-md border p-3 mt-3">
                              <p className="text-sm text-muted-foreground">
                                No lessons yet.
                              </p>
                            </div>
                          )}
                        </SortableContext>
                        <Button className="w-full mt-2" variant="secondary">
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add Lesson
                        </Button>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
