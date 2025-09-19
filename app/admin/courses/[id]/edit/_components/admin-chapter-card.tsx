"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  VideoIcon,
  GripVerticalIcon,
} from "lucide-react";
export default function AdminChapterCard() {
  console.log("AdminChapterCard");
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVerticalIcon className="h-4 w-4 text-muted-foreground cursor-move" />
          <CardTitle>Chapter 1: Introduction</CardTitle>
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
        <AccordionTrigger className="text-sm font-medium">
          View Lessons
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 mt-3">
            {/* Lesson Item */}
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-2">
                <GripVerticalIcon className="h-4 w-4 text-muted-foreground cursor-move" />
                <VideoIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Lesson 1: Welcome</span>
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

            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-2">
                <GripVerticalIcon className="h-4 w-4 text-muted-foreground cursor-move" />
                <VideoIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Lesson 2: Setup</span>
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

            {/* Add Lesson Button */}
            <Button className="w-full" variant="secondary">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Lesson
            </Button>
          </div>
        </AccordionContent>
      </CardContent>
    </Card>
  );
}
